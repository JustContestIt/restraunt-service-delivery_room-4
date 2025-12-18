# Restaurant Backend API

A FastAPI-based backend service for a restaurant selection platform. Provides RESTful endpoints for managing and querying restaurant data, menus, and cuisine types.

## Features

- 🍽️ Restaurant listing with filtering by cuisine and price range
- 📋 Detailed restaurant information and menus
- 🔍 Cuisine type discovery
- ⚡ Asynchronous database operations with aiosqlite
- ✅ Comprehensive data validation with Pydantic
- 🌐 CORS support for frontend integration
- 📝 Full type hints throughout codebase

## Tech Stack

- **Framework**: FastAPI 0.115+
- **Database**: SQLite with aiosqlite (async)
- **Validation**: Pydantic v2
- **Testing**: pytest, pytest-asyncio, hypothesis
- **Python**: 3.10+

## Quick Start

### Prerequisites

- Python 3.10 or higher
- pip (Python package manager)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd <repository-directory>
```

2. Create and activate a virtual environment:
```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r backend/requirements.txt
```

4. Initialize the database:
```bash
python -c "import asyncio; from backend.database.db import init_db; asyncio.run(init_db())"
```

5. (Optional) Seed the database with sample data:
```bash
python backend/database/seed_data.py
```

### Running the Server

Start the development server:
```bash
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- API Base URL: `http://localhost:8000`
- Interactive API Docs: `http://localhost:8000/docs`
- Alternative API Docs: `http://localhost:8000/redoc`

## API Documentation

### Base URL

```
http://localhost:8000
```

### Endpoints

#### 1. Health Check

**GET** `/health`

Check if the API is running.

**Response:**
```json
{
  "status": "healthy"
}
```

---

#### 2. List Restaurants

**GET** `/api/restaurants`

Retrieve a list of restaurants with optional filtering.

**Query Parameters:**
- `cuisine` (optional): Filter by cuisine type (e.g., "Italian", "Japanese")
- `max_price` (optional): Filter by maximum price range (1-4)

**Example Requests:**
```bash
# Get all restaurants
curl http://localhost:8000/api/restaurants

# Filter by cuisine
curl http://localhost:8000/api/restaurants?cuisine=Italian

# Filter by max price
curl http://localhost:8000/api/restaurants?max_price=2

# Combined filters
curl http://localhost:8000/api/restaurants?cuisine=Japanese&max_price=3
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Bella Italia",
    "cuisine": "Italian",
    "price_range": 3,
    "rating": 4.5
  },
  {
    "id": 2,
    "name": "Sushi Palace",
    "cuisine": "Japanese",
    "price_range": 4,
    "rating": 4.8
  }
]
```

---

#### 3. Get Restaurant Details

**GET** `/api/restaurants/{id}`

Retrieve detailed information for a specific restaurant.

**Path Parameters:**
- `id` (required): Restaurant ID (integer)

**Example Request:**
```bash
curl http://localhost:8000/api/restaurants/1
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Bella Italia",
  "cuisine": "Italian",
  "price_range": 3,
  "rating": 4.5,
  "address": "123 Main St, City, State 12345",
  "description": "Authentic Italian cuisine with a modern twist. Family-owned restaurant serving traditional recipes passed down through generations."
}
```

**Error Response (404 Not Found):**
```json
{
  "detail": "Restaurant not found"
}
```

---

#### 4. Get Restaurant Menu

**GET** `/api/restaurants/{id}/menu`

Retrieve the menu for a specific restaurant, grouped by category.

**Path Parameters:**
- `id` (required): Restaurant ID (integer)

**Example Request:**
```bash
curl http://localhost:8000/api/restaurants/1/menu
```

**Response (200 OK):**
```json
{
  "restaurant_id": 1,
  "categories": {
    "Appetizers": [
      {
        "id": 1,
        "name": "Bruschetta",
        "description": "Toasted bread with tomatoes, garlic, and basil",
        "price": 8.99,
        "category": "Appetizers"
      }
    ],
    "Main Course": [
      {
        "id": 2,
        "name": "Spaghetti Carbonara",
        "description": "Classic Roman pasta with eggs, cheese, and pancetta",
        "price": 16.99,
        "category": "Main Course"
      }
    ],
    "Desserts": [
      {
        "id": 3,
        "name": "Tiramisu",
        "description": "Coffee-flavored Italian dessert",
        "price": 7.99,
        "category": "Desserts"
      }
    ]
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "detail": "Restaurant not found"
}
```

---

#### 5. List Cuisines

**GET** `/api/cuisines`

Retrieve all unique cuisine types available in the database.

**Example Request:**
```bash
curl http://localhost:8000/api/cuisines
```

**Response (200 OK):**
```json
[
  "Chinese",
  "French",
  "Italian",
  "Japanese",
  "Mexican"
]
```

---

### Response Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success - Request completed successfully |
| 404 | Not Found - Restaurant does not exist |
| 422 | Validation Error - Invalid request parameters |
| 500 | Server Error - Internal server error |

### Error Response Format

All errors follow a consistent format:

```json
{
  "detail": "Error message or validation details"
}
```

For validation errors (422), the detail field contains an array of error objects:

```json
{
  "detail": [
    {
      "loc": ["query", "max_price"],
      "msg": "Input should be less than or equal to 4",
      "type": "less_than_equal"
    }
  ]
}
```

## Configuration

### Environment Variables

The application supports the following environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | Path to SQLite database file | `restaurants.db` |
| `CORS_ORIGINS` | Comma-separated list of allowed origins | `http://localhost:3000,http://localhost:5173,http://localhost:8080` |
| `LOG_LEVEL` | Logging level (DEBUG, INFO, WARNING, ERROR) | `INFO` |
| `HOST` | Server host address | `0.0.0.0` |
| `PORT` | Server port number | `8000` |

### Setting Environment Variables

**Windows (CMD):**
```cmd
set DATABASE_URL=restaurants.db
set LOG_LEVEL=DEBUG
```

**Windows (PowerShell):**
```powershell
$env:DATABASE_URL="restaurants.db"
$env:LOG_LEVEL="DEBUG"
```

**macOS/Linux:**
```bash
export DATABASE_URL=restaurants.db
export LOG_LEVEL=DEBUG
```

### CORS Configuration

By default, the API allows requests from:
- `http://localhost:3000` (React default)
- `http://localhost:5173` (Vite default)
- `http://localhost:8080` (Vue default)

To modify allowed origins for production, update the `CORSMiddleware` configuration in `backend/main.py`.

## Database Schema

### Tables

#### restaurants
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT |
| name | TEXT | NOT NULL |
| cuisine | TEXT | NOT NULL |
| price_range | INTEGER | NOT NULL, CHECK(1-4) |
| rating | REAL | NOT NULL, CHECK(0-5) |
| address | TEXT | NOT NULL |
| description | TEXT | NOT NULL |

#### menu_items
| Column | Type | Constraints |
|--------|------|-------------|
| id | INTEGER | PRIMARY KEY, AUTOINCREMENT |
| restaurant_id | INTEGER | NOT NULL, FOREIGN KEY |
| name | TEXT | NOT NULL |
| description | TEXT | NOT NULL |
| price | REAL | NOT NULL, CHECK(>= 0) |
| category | TEXT | NOT NULL |

### Indexes

- `idx_restaurants_cuisine` on `restaurants(cuisine)`
- `idx_restaurants_price` on `restaurants(price_range)`
- `idx_menu_restaurant` on `menu_items(restaurant_id)`
- `idx_menu_category` on `menu_items(category)`

## Testing

### Running Tests

Run all tests:
```bash
pytest backend/tests/
```

Run with coverage:
```bash
pytest backend/tests/ --cov=backend --cov-report=html
```

Run specific test file:
```bash
pytest backend/tests/test_database.py
```

### Test Structure

- `backend/tests/test_database.py` - Database function tests
- `backend/tests/test_error_handling.py` - Error handling and validation tests

## Development

### Project Structure

```
backend/
├── main.py                 # FastAPI app, routes, middleware
├── models/
│   └── schemas.py         # Pydantic models
├── database/
│   ├── db.py              # Database functions
│   └── seed_data.py       # Sample data for development
├── tests/
│   ├── test_database.py   # Database tests
│   └── test_error_handling.py # Error handling tests
├── requirements.txt       # Python dependencies
└── __init__.py

```

### Code Style

- Follow PEP 8 style guidelines
- Use type hints for all function parameters and return values
- Write docstrings for all public functions and classes
- Keep functions focused and single-purpose

### Adding New Endpoints

1. Define Pydantic models in `backend/models/schemas.py`
2. Create database functions in `backend/database/db.py`
3. Add route handlers in `backend/main.py`
4. Write tests in `backend/tests/`
5. Update this README with API documentation

## Deployment

### Production Considerations

1. **Database**: Consider migrating to PostgreSQL for production
2. **Environment Variables**: Use a `.env` file or environment management system
3. **CORS**: Configure specific allowed origins (not wildcards)
4. **Logging**: Set appropriate log levels and configure log aggregation
5. **Security**: Implement rate limiting and authentication if needed
6. **HTTPS**: Deploy behind a reverse proxy (nginx) with SSL/TLS

### Running in Production

Use a production ASGI server:

```bash
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --workers 4
```

Or with Gunicorn:

```bash
gunicorn backend.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

## Troubleshooting

### Database Issues

**Problem**: Database file not found
```
Solution: Run the database initialization command:
python -c "import asyncio; from backend.database.db import init_db; asyncio.run(init_db())"
```

**Problem**: Database locked error
```
Solution: Ensure no other processes are accessing the database file. Close any open connections.
```

### CORS Issues

**Problem**: CORS errors in browser console
```
Solution: Verify your frontend origin is listed in the CORS_ORIGINS configuration in main.py
```

### Import Errors

**Problem**: Module not found errors
```
Solution: Ensure you're running commands from the project root directory and the virtual environment is activated
```

## License

[Add your license information here]

## Contributing

[Add contribution guidelines here]

## Support

For issues and questions:
- Create an issue in the repository
- Contact: [Add contact information]
