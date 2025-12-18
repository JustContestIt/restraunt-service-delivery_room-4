# Design Document

## Overview

This document describes the design for a FastAPI-based backend service that provides RESTful API endpoints for a restaurant selection platform. The system uses asynchronous operations with aiosqlite for database access, Pydantic models for data validation, and CORS middleware for cross-origin requests. The architecture follows a three-layer pattern: API routes, business logic, and data access.

## Architecture

### High-Level Architecture

```
┌─────────────────┐
│  Frontend App   │
│  (React/Vue)    │
└────────┬────────┘
         │ HTTP/JSON
         │ CORS enabled
         ▼
┌─────────────────┐
│   FastAPI App   │
│  ┌───────────┐  │
│  │  Routes   │  │
│  └─────┬─────┘  │
│        │        │
│  ┌─────▼─────┐  │
│  │ Pydantic  │  │
│  │  Models   │  │
│  └─────┬─────┘  │
│        │        │
│  ┌─────▼─────┐  │
│  │ Database  │  │
│  │  Layer    │  │
│  └─────┬─────┘  │
└────────┼────────┘
         │
         ▼
┌─────────────────┐
│  SQLite DB      │
│  (aiosqlite)    │
└─────────────────┘
```

### Technology Stack

- **Framework**: FastAPI 0.115+ (async web framework)
- **Database**: SQLite with aiosqlite (async database driver)
- **Validation**: Pydantic v2 (data validation and serialization)
- **CORS**: FastAPI CORSMiddleware (cross-origin support)
- **Type System**: Python 3.10+ with full type hints

## Components and Interfaces

### 1. API Routes Layer (`main.py`)

The main application file contains all route definitions and FastAPI app configuration.

**Responsibilities:**
- Define HTTP endpoints
- Handle request/response flow
- Apply middleware (CORS)
- Coordinate between Pydantic models and database layer

**Key Routes:**

```python
@app.get("/api/restaurants", response_model=List[RestaurantListItem])
async def get_restaurants(
    cuisine: Optional[str] = None,
    max_price: Optional[int] = None
) -> List[RestaurantListItem]:
    """
    Retrieve restaurants with optional filtering.
    
    Args:
        cuisine: Filter by cuisine type (e.g., "Italian", "Japanese")
        max_price: Filter by maximum price range (1-4)
    
    Returns:
        List of restaurants matching the criteria
    """
    pass

@app.get("/api/restaurants/{restaurant_id}", response_model=RestaurantDetail)
async def get_restaurant(restaurant_id: int) -> RestaurantDetail:
    """
    Retrieve detailed information for a specific restaurant.
    
    Args:
        restaurant_id: Unique identifier for the restaurant
    
    Returns:
        Complete restaurant details
    
    Raises:
        HTTPException: 404 if restaurant not found
    """
    pass

@app.get("/api/restaurants/{restaurant_id}/menu", response_model=MenuResponse)
async def get_menu(restaurant_id: int) -> MenuResponse:
    """
    Retrieve menu items for a specific restaurant.
    
    Args:
        restaurant_id: Unique identifier for the restaurant
    
    Returns:
        Menu items grouped by category
    
    Raises:
        HTTPException: 404 if restaurant not found
    """
    pass

@app.get("/api/cuisines", response_model=List[str])
async def get_cuisines() -> List[str]:
    """
    Retrieve all unique cuisine types.
    
    Returns:
        Sorted list of cuisine types
    """
    pass
```

### 2. Data Models Layer (`models/schemas.py`)

Pydantic models define the structure and validation rules for all API requests and responses.

**Base Models:**

```python
class RestaurantBase(BaseModel):
    """Base restaurant fields shared across models."""
    name: str
    cuisine: str
    price_range: int  # 1-4 scale
    rating: float  # 0.0-5.0 scale
    
    model_config = {
        "json_schema_extra": {
            "examples": [{
                "name": "Bella Italia",
                "cuisine": "Italian",
                "price_range": 3,
                "rating": 4.5
            }]
        }
    }
```

**Response Models:**

```python
class RestaurantListItem(RestaurantBase):
    """Restaurant summary for list views."""
    id: int

class RestaurantDetail(RestaurantBase):
    """Complete restaurant information."""
    id: int
    address: str
    description: str

class MenuItem(BaseModel):
    """Individual menu item."""
    id: int
    name: str
    description: str
    price: float
    category: str

class MenuResponse(BaseModel):
    """Menu grouped by categories."""
    restaurant_id: int
    categories: Dict[str, List[MenuItem]]
```

### 3. Database Layer (`database/db.py`)

Handles all database operations using aiosqlite with async context managers.

**Database Schema:**

```sql
-- restaurants table
CREATE TABLE restaurants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    cuisine TEXT NOT NULL,
    price_range INTEGER NOT NULL CHECK(price_range BETWEEN 1 AND 4),
    rating REAL NOT NULL CHECK(rating BETWEEN 0 AND 5),
    address TEXT NOT NULL,
    description TEXT NOT NULL
);

-- menu_items table
CREATE TABLE menu_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    restaurant_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price REAL NOT NULL CHECK(price >= 0),
    category TEXT NOT NULL,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
);

-- indexes for performance
CREATE INDEX idx_restaurants_cuisine ON restaurants(cuisine);
CREATE INDEX idx_restaurants_price ON restaurants(price_range);
CREATE INDEX idx_menu_restaurant ON menu_items(restaurant_id);
CREATE INDEX idx_menu_category ON menu_items(category);
```

**Database Functions:**

```python
async def get_db_connection() -> aiosqlite.Connection:
    """
    Create and return a database connection.
    
    Returns:
        Async database connection with Row factory
    """
    db = await aiosqlite.connect("restaurants.db")
    db.row_factory = aiosqlite.Row
    return db

async def init_db() -> None:
    """Initialize database schema and seed data."""
    async with aiosqlite.connect("restaurants.db") as db:
        # Create tables
        await db.executescript(CREATE_TABLES_SQL)
        await db.commit()

async def get_restaurants_filtered(
    cuisine: Optional[str] = None,
    max_price: Optional[int] = None
) -> List[Dict[str, Any]]:
    """
    Query restaurants with optional filters.
    
    Args:
        cuisine: Filter by cuisine type
        max_price: Filter by maximum price range
    
    Returns:
        List of restaurant dictionaries
    """
    pass

async def get_restaurant_by_id(restaurant_id: int) -> Optional[Dict[str, Any]]:
    """
    Query single restaurant by ID.
    
    Args:
        restaurant_id: Restaurant identifier
    
    Returns:
        Restaurant dictionary or None if not found
    """
    pass

async def get_menu_items(restaurant_id: int) -> List[Dict[str, Any]]:
    """
    Query all menu items for a restaurant.
    
    Args:
        restaurant_id: Restaurant identifier
    
    Returns:
        List of menu item dictionaries
    """
    pass

async def get_all_cuisines() -> List[str]:
    """
    Query all unique cuisine types.
    
    Returns:
        Sorted list of cuisine strings
    """
    pass
```

## Data Models

### Restaurant Entity

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | int | PRIMARY KEY | Unique identifier |
| name | str | NOT NULL | Restaurant name |
| cuisine | str | NOT NULL | Cuisine type |
| price_range | int | 1-4 | Price level indicator |
| rating | float | 0.0-5.0 | Average rating |
| address | str | NOT NULL | Physical address |
| description | str | NOT NULL | Restaurant description |

### Menu Item Entity

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | int | PRIMARY KEY | Unique identifier |
| restaurant_id | int | FOREIGN KEY | Parent restaurant |
| name | str | NOT NULL | Item name |
| description | str | NOT NULL | Item description |
| price | float | >= 0 | Item price |
| category | str | NOT NULL | Menu category |


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Unfiltered query returns all restaurants

*For any* database state with restaurants, querying /api/restaurants without filters should return all restaurants present in the database.

**Validates: Requirements 1.1**

### Property 2: Cuisine filter correctness

*For any* cuisine type and database state, querying /api/restaurants with a cuisine parameter should return only restaurants where the cuisine field exactly matches the query parameter.

**Validates: Requirements 1.2**

### Property 3: Price filter correctness

*For any* max_price value and database state, querying /api/restaurants with a max_price parameter should return only restaurants where price_range <= max_price.

**Validates: Requirements 1.3**

### Property 4: Combined filter correctness

*For any* combination of cuisine and max_price parameters and database state, querying /api/restaurants should return only restaurants that satisfy both conditions simultaneously.

**Validates: Requirements 1.4**

### Property 5: Restaurant list response schema

*For any* restaurant returned by /api/restaurants, the response object should contain all required fields: id, name, cuisine, price_range, and rating.

**Validates: Requirements 1.5**

### Property 6: Restaurant detail completeness

*For any* valid restaurant ID in the database, querying /api/restaurants/{id} should return an object containing all fields: id, name, cuisine, price_range, rating, address, and description.

**Validates: Requirements 2.1**

### Property 7: Invalid restaurant ID handling

*For any* restaurant ID that does not exist in the database, querying /api/restaurants/{id} should return HTTP status code 404.

**Validates: Requirements 2.2**

### Property 8: Text field encoding safety

*For any* restaurant with text fields containing special characters (quotes, angle brackets, unicode), the API response should properly encode these characters without corruption or injection vulnerabilities.

**Validates: Requirements 2.3**

### Property 9: Menu completeness

*For any* restaurant with menu items, querying /api/restaurants/{id}/menu should return all menu items associated with that restaurant ID.

**Validates: Requirements 3.1**

### Property 10: Menu category grouping

*For any* restaurant menu response, all menu items should be organized into a dictionary structure where keys are category names and values are lists of items belonging to that category.

**Validates: Requirements 3.2**

### Property 11: Menu item schema

*For any* menu item in the response, it should contain all required fields: id, name, description, price, and category.

**Validates: Requirements 3.3**

### Property 12: Invalid menu request handling

*For any* restaurant ID that does not exist in the database, querying /api/restaurants/{id}/menu should return HTTP status code 404.

**Validates: Requirements 3.4**

### Property 13: Cuisine list uniqueness and completeness

*For any* database state, querying /api/cuisines should return a list containing exactly one instance of each unique cuisine value present in the restaurants table, with no duplicates and no omissions.

**Validates: Requirements 4.1**

### Property 14: Cuisine list ordering

*For any* database state, querying /api/cuisines should return a list sorted in alphabetical order.

**Validates: Requirements 4.3**

### Property 15: Request parameter validation

*For any* request with invalid parameters (wrong types, out-of-range values, missing required fields), the API should reject the request with appropriate validation errors.

**Validates: Requirements 5.1**

### Property 16: Response schema conformance

*For any* API response, the returned data should conform to the defined Pydantic response model, including proper types and snake_case field naming convention.

**Validates: Requirements 5.2, 5.4**

### Property 17: Validation error response

*For any* request with invalid data that fails Pydantic validation, the API should return HTTP status code 422 with detailed validation error information.

**Validates: Requirements 5.3**

### Property 18: CORS header presence

*For any* API request, the response should include Access-Control-Allow-Origin headers to enable cross-origin requests.

**Validates: Requirements 6.2**

### Property 19: Concurrent request handling

*For any* set of concurrent API requests, the system should process all requests without blocking, and each request should receive a correct response based on the database state at the time of execution.

**Validates: Requirements 7.2**

## Error Handling

### HTTP Status Codes

| Status Code | Scenario | Response Format |
|-------------|----------|-----------------|
| 200 | Successful request | JSON with requested data |
| 404 | Resource not found | `{"detail": "Restaurant not found"}` |
| 422 | Validation error | `{"detail": [{"loc": [...], "msg": "...", "type": "..."}]}` |
| 500 | Server error | `{"detail": "Internal server error"}` |

### Error Response Model

```python
class ErrorResponse(BaseModel):
    """Standard error response format."""
    detail: Union[str, List[Dict[str, Any]]]
```

### Database Error Handling

```python
async def safe_db_query(query_func):
    """
    Wrapper for database queries with error handling.
    
    Args:
        query_func: Async function that performs database query
    
    Returns:
        Query result or raises HTTPException
    """
    try:
        return await query_func()
    except aiosqlite.Error as e:
        logger.error(f"Database error: {e}")
        raise HTTPException(
            status_code=500,
            detail="Database error occurred"
        )
```

## Testing Strategy

### Unit Testing

Unit tests will verify specific functionality of individual components:

- **Pydantic Model Validation**: Test that models correctly validate valid and invalid data
- **Database Query Functions**: Test individual database functions with known data
- **Route Handlers**: Test each endpoint with mock database responses
- **Error Handling**: Test that appropriate exceptions are raised and handled

**Example Unit Tests:**
- Test that `RestaurantListItem` model accepts valid data
- Test that `get_restaurant_by_id` returns None for non-existent ID
- Test that 404 is raised when restaurant not found
- Test that CORS middleware is properly configured

### Property-Based Testing

Property-based tests will verify universal properties across many randomly generated inputs using **Hypothesis** library for Python.

**Testing Framework**: Hypothesis (https://hypothesis.readthedocs.io/)

**Configuration**: Each property test should run minimum 100 iterations to ensure thorough coverage of the input space.

**Property Test Requirements**:
- Each property-based test MUST be tagged with a comment referencing the design document property
- Tag format: `# Feature: restaurant-backend, Property {number}: {property_text}`
- Each correctness property MUST be implemented by a SINGLE property-based test

**Test Generators**:

```python
from hypothesis import given, strategies as st

# Strategy for generating valid restaurants
restaurant_strategy = st.builds(
    dict,
    id=st.integers(min_value=1),
    name=st.text(min_size=1, max_size=100),
    cuisine=st.sampled_from(["Italian", "Japanese", "Mexican", "Chinese", "French"]),
    price_range=st.integers(min_value=1, max_value=4),
    rating=st.floats(min_value=0.0, max_value=5.0),
    address=st.text(min_size=1, max_size=200),
    description=st.text(min_size=1, max_size=500)
)

# Strategy for generating menu items
menu_item_strategy = st.builds(
    dict,
    id=st.integers(min_value=1),
    restaurant_id=st.integers(min_value=1),
    name=st.text(min_size=1, max_size=100),
    description=st.text(min_size=1, max_size=300),
    price=st.floats(min_value=0.0, max_value=1000.0),
    category=st.sampled_from(["Appetizers", "Main Course", "Desserts", "Beverages"])
)
```

**Example Property Tests**:

```python
@given(st.lists(restaurant_strategy, min_size=1))
async def test_property_1_unfiltered_returns_all(restaurants):
    """
    Feature: restaurant-backend, Property 1: Unfiltered query returns all restaurants
    Validates: Requirements 1.1
    """
    # Setup: Insert restaurants into test database
    # Execute: Query /api/restaurants without filters
    # Assert: Response contains exactly the same restaurants
    pass

@given(
    st.lists(restaurant_strategy, min_size=5),
    st.sampled_from(["Italian", "Japanese", "Mexican"])
)
async def test_property_2_cuisine_filter(restaurants, cuisine):
    """
    Feature: restaurant-backend, Property 2: Cuisine filter correctness
    Validates: Requirements 1.2
    """
    # Setup: Insert restaurants with various cuisines
    # Execute: Query /api/restaurants?cuisine={cuisine}
    # Assert: All returned restaurants have matching cuisine
    pass
```

### Integration Testing

Integration tests will verify the complete request-response cycle:

- Test actual HTTP requests to running FastAPI application
- Verify database persistence and retrieval
- Test CORS functionality with different origins
- Test concurrent request handling

### Test Data Management

**Seed Data**: Create a `seed_data.py` script to populate test database with realistic restaurant and menu data for manual testing and development.

**Test Database**: Use separate SQLite database file for tests (`test_restaurants.db`) that is created fresh for each test run.

## Deployment Considerations

### Environment Variables

```python
DATABASE_URL: str = "restaurants.db"  # Path to SQLite database
CORS_ORIGINS: List[str] = ["http://localhost:3000"]  # Allowed origins
LOG_LEVEL: str = "INFO"  # Logging level
```

### Database Initialization

On first startup, the application should:
1. Check if database file exists
2. If not, create database and run schema initialization
3. Optionally seed with sample data for development

### CORS Configuration

For production deployment:
- Configure specific allowed origins (not wildcard)
- Set appropriate credentials policy
- Configure allowed methods and headers

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://restaurant-app.com"],  # Production domain
    allow_credentials=True,
    allow_methods=["GET"],  # Only needed methods
    allow_headers=["*"],
)
```

### Performance Considerations

- **Database Indexes**: Ensure indexes on frequently queried columns (cuisine, price_range)
- **Connection Pooling**: aiosqlite handles connection management efficiently
- **Response Caching**: Consider caching cuisine list and popular restaurant queries
- **Query Optimization**: Use SELECT with specific columns instead of SELECT *

## File Structure

```
backend/
├── main.py                 # FastAPI app, routes, middleware
├── models/
│   └── schemas.py         # Pydantic models
├── database/
│   ├── db.py              # Database functions
│   └── seed_data.py       # Sample data for development
├── tests/
│   ├── test_unit.py       # Unit tests
│   ├── test_properties.py # Property-based tests
│   └── test_integration.py # Integration tests
├── requirements.txt       # Python dependencies
└── README.md             # Setup and usage instructions
```

## Dependencies

```txt
fastapi>=0.115.0
uvicorn[standard]>=0.30.0
aiosqlite>=0.20.0
pydantic>=2.0.0
hypothesis>=6.100.0  # For property-based testing
pytest>=8.0.0
pytest-asyncio>=0.23.0
httpx>=0.27.0  # For testing FastAPI
```
