"""Integration tests for the Restaurant API endpoints."""

import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
import aiosqlite
import os

from backend.main import app


@pytest_asyncio.fixture
async def test_db():
    """Create a test database with comprehensive sample data."""
    test_db_path = "test_restaurants.db"

    # Remove existing test database if it exists
    if os.path.exists(test_db_path):
        os.remove(test_db_path)

    # Create fresh test database
    async with aiosqlite.connect(test_db_path) as db:
        # Create tables
        await db.executescript("""
            CREATE TABLE restaurants (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                cuisine TEXT NOT NULL,
                price_range INTEGER NOT NULL CHECK(price_range BETWEEN 1 AND 4),
                rating REAL NOT NULL CHECK(rating BETWEEN 0 AND 5),
                address TEXT NOT NULL,
                description TEXT NOT NULL
            );

            CREATE TABLE menu_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                restaurant_id INTEGER NOT NULL,
                name TEXT NOT NULL,
                description TEXT NOT NULL,
                price REAL NOT NULL CHECK(price >= 0),
                category TEXT NOT NULL,
                FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
            );

            CREATE INDEX idx_restaurants_cuisine ON restaurants(cuisine);
            CREATE INDEX idx_restaurants_price ON restaurants(price_range);
            CREATE INDEX idx_menu_restaurant ON menu_items(restaurant_id);
            CREATE INDEX idx_menu_category ON menu_items(category);
        """)

        # Insert comprehensive test data
        await db.execute("""
            INSERT INTO restaurants (name, cuisine, price_range, rating, address, description)
            VALUES
                ('Bella Italia', 'Italian', 3, 4.5, '123 Main St', 'Authentic Italian cuisine'),
                ('Sushi Palace', 'Japanese', 4, 4.8, '456 Oak Ave', 'Premium sushi restaurant'),
                ('Taco Fiesta', 'Mexican', 2, 4.2, '789 Elm St', 'Casual Mexican dining'),
                ('Pizza Corner', 'Italian', 2, 4.0, '321 Pine St', 'Family-friendly pizza place'),
                ('Dragon Wok', 'Chinese', 3, 4.6, '654 Maple Dr', 'Traditional Chinese food'),
                ('Le Petit Bistro', 'French', 4, 4.9, '987 Cedar Ln', 'Fine French dining')
        """)

        # Insert menu items for multiple restaurants
        await db.execute("""
            INSERT INTO menu_items (restaurant_id, name, description, price, category)
            VALUES
                -- Bella Italia menu
                (1, 'Margherita Pizza', 'Classic tomato and mozzarella', 12.99, 'Main Course'),
                (1, 'Tiramisu', 'Italian coffee dessert', 6.99, 'Desserts'),
                (1, 'Bruschetta', 'Toasted bread with tomatoes', 8.99, 'Appetizers'),
                (1, 'Espresso', 'Strong Italian coffee', 3.50, 'Beverages'),
                -- Sushi Palace menu
                (2, 'California Roll', 'Crab and avocado roll', 8.99, 'Appetizers'),
                (2, 'Salmon Nigiri', 'Fresh salmon sushi', 15.99, 'Main Course'),
                (2, 'Miso Soup', 'Traditional Japanese soup', 4.50, 'Appetizers'),
                (2, 'Green Tea Ice Cream', 'Japanese dessert', 5.99, 'Desserts'),
                -- Taco Fiesta menu
                (3, 'Beef Tacos', 'Three soft shell tacos', 10.99, 'Main Course'),
                (3, 'Guacamole', 'Fresh avocado dip', 6.50, 'Appetizers'),
                (3, 'Churros', 'Fried dough pastry', 4.99, 'Desserts'),
                -- Dragon Wok menu
                (5, 'Kung Pao Chicken', 'Spicy Sichuan dish', 13.99, 'Main Course'),
                (5, 'Spring Rolls', 'Crispy vegetable rolls', 5.99, 'Appetizers')
        """)

        await db.commit()

    # Patch database connection
    original_connect = aiosqlite.connect

    async def test_connect(db_path):
        return await original_connect(test_db_path)

    aiosqlite.connect = test_connect

    yield

    # Cleanup
    aiosqlite.connect = original_connect
    if os.path.exists(test_db_path):
        os.remove(test_db_path)


@pytest.mark.asyncio
async def test_health_endpoint():
    """Test the health check endpoint."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/health")

        assert response.status_code == 200
        assert response.json() == {"status": "healthy"}


@pytest.mark.asyncio
async def test_root_endpoint():
    """Test the root endpoint."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/")

        assert response.status_code == 200
        data = response.json()
        assert "message" in data


@pytest.mark.asyncio
async def test_get_all_restaurants(test_db):
    """Test retrieving all restaurants without filters."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/restaurants")

        assert response.status_code == 200
        restaurants = response.json()
        assert isinstance(restaurants, list)
        assert len(restaurants) == 6

        # Verify each restaurant has required fields
        for restaurant in restaurants:
            assert "id" in restaurant
            assert "name" in restaurant
            assert "cuisine" in restaurant
            assert "price_range" in restaurant
            assert "rating" in restaurant


@pytest.mark.asyncio
async def test_filter_restaurants_by_cuisine(test_db):
    """Test filtering restaurants by cuisine type."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Test Italian cuisine
        response = await client.get("/api/restaurants?cuisine=Italian")
        assert response.status_code == 200
        restaurants = response.json()
        assert len(restaurants) == 2
        assert all(r["cuisine"] == "Italian" for r in restaurants)

        # Test Japanese cuisine
        response = await client.get("/api/restaurants?cuisine=Japanese")
        assert response.status_code == 200
        restaurants = response.json()
        assert len(restaurants) == 1
        assert restaurants[0]["cuisine"] == "Japanese"


@pytest.mark.asyncio
async def test_filter_restaurants_by_price(test_db):
    """Test filtering restaurants by maximum price range."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Test max price 2
        response = await client.get("/api/restaurants?max_price=2")
        assert response.status_code == 200
        restaurants = response.json()
        assert len(restaurants) == 2
        assert all(r["price_range"] <= 2 for r in restaurants)

        # Test max price 3
        response = await client.get("/api/restaurants?max_price=3")
        assert response.status_code == 200
        restaurants = response.json()
        assert len(restaurants) == 4
        assert all(r["price_range"] <= 3 for r in restaurants)


@pytest.mark.asyncio
async def test_filter_restaurants_combined(test_db):
    """Test filtering restaurants by both cuisine and price."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/restaurants?cuisine=Italian&max_price=2")

        assert response.status_code == 200
        restaurants = response.json()
        assert len(restaurants) == 1
        assert restaurants[0]["name"] == "Pizza Corner"
        assert restaurants[0]["cuisine"] == "Italian"
        assert restaurants[0]["price_range"] == 2


@pytest.mark.asyncio
async def test_get_restaurant_by_id(test_db):
    """Test retrieving a specific restaurant by ID."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/restaurants/1")

        assert response.status_code == 200
        restaurant = response.json()

        # Verify all fields are present
        assert restaurant["id"] == 1
        assert restaurant["name"] == "Bella Italia"
        assert restaurant["cuisine"] == "Italian"
        assert restaurant["price_range"] == 3
        assert restaurant["rating"] == 4.5
        assert "address" in restaurant
        assert "description" in restaurant


@pytest.mark.asyncio
async def test_get_restaurant_menu(test_db):
    """Test retrieving menu for a restaurant."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/restaurants/1/menu")

        assert response.status_code == 200
        menu = response.json()

        # Verify menu structure
        assert "restaurant_id" in menu
        assert menu["restaurant_id"] == 1
        assert "categories" in menu
        assert isinstance(menu["categories"], dict)

        # Verify categories
        categories = menu["categories"]
        assert "Main Course" in categories
        assert "Desserts" in categories
        assert "Appetizers" in categories
        assert "Beverages" in categories

        # Verify items in Main Course
        main_course = categories["Main Course"]
        assert len(main_course) == 1
        assert main_course[0]["name"] == "Margherita Pizza"
        assert main_course[0]["price"] == 12.99


@pytest.mark.asyncio
async def test_get_menu_multiple_categories(test_db):
    """Test menu retrieval with multiple categories."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/restaurants/2/menu")

        assert response.status_code == 200
        menu = response.json()

        # Sushi Palace should have multiple categories
        categories = menu["categories"]
        assert len(categories) >= 3
        assert "Appetizers" in categories
        assert "Main Course" in categories
        assert "Desserts" in categories

        # Verify total item count
        total_items = sum(len(items) for items in categories.values())
        assert total_items == 4


@pytest.mark.asyncio
async def test_get_all_cuisines(test_db):
    """Test retrieving all unique cuisines."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/cuisines")

        assert response.status_code == 200
        cuisines = response.json()

        # Verify response structure
        assert isinstance(cuisines, list)
        assert len(cuisines) == 5  # Chinese, French, Italian, Japanese, Mexican

        # Verify cuisines are sorted
        assert cuisines == sorted(cuisines)

        # Verify specific cuisines
        assert "Italian" in cuisines
        assert "Japanese" in cuisines
        assert "Mexican" in cuisines
        assert "Chinese" in cuisines
        assert "French" in cuisines


@pytest.mark.asyncio
async def test_restaurant_not_found_404(test_db):
    """Test 404 error for non-existent restaurant."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/restaurants/9999")

        assert response.status_code == 404
        error = response.json()
        assert "detail" in error
        assert error["detail"] == "Restaurant not found"


@pytest.mark.asyncio
async def test_menu_not_found_404(test_db):
    """Test 404 error for menu of non-existent restaurant."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/restaurants/9999/menu")

        assert response.status_code == 404
        error = response.json()
        assert "detail" in error
        assert error["detail"] == "Restaurant not found"


@pytest.mark.asyncio
async def test_invalid_restaurant_id_validation():
    """Test validation error for invalid restaurant ID."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/restaurants/not_a_number")

        assert response.status_code == 422
        error = response.json()
        assert "detail" in error


@pytest.mark.asyncio
async def test_cors_headers(test_db):
    """Test CORS headers are properly set."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get(
            "/api/restaurants",
            headers={"Origin": "http://localhost:3000"}
        )

        assert response.status_code == 200
        assert "access-control-allow-origin" in response.headers


@pytest.mark.asyncio
async def test_response_content_type(test_db):
    """Test that responses have correct content type."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/restaurants")

        assert response.status_code == 200
        assert "application/json" in response.headers["content-type"]


@pytest.mark.asyncio
async def test_empty_filter_results(test_db):
    """Test filtering that returns no results."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Test with non-existent cuisine
        response = await client.get("/api/restaurants?cuisine=NonExistent")

        assert response.status_code == 200
        restaurants = response.json()
        assert isinstance(restaurants, list)
        assert len(restaurants) == 0


@pytest.mark.asyncio
async def test_restaurant_with_empty_menu(test_db):
    """Test restaurant that has no menu items."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Pizza Corner (ID 4) has no menu items in test data
        response = await client.get("/api/restaurants/4/menu")

        assert response.status_code == 200
        menu = response.json()
        assert menu["restaurant_id"] == 4
        assert menu["categories"] == {}


@pytest.mark.asyncio
async def test_price_range_boundaries(test_db):
    """Test filtering with price range boundaries."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Test max_price = 4 (should return all restaurants)
        response = await client.get("/api/restaurants?max_price=4")
        assert response.status_code == 200
        restaurants = response.json()
        assert len(restaurants) == 6

        # Test max_price = 1 (should return none in our test data)
        response = await client.get("/api/restaurants?max_price=1")
        assert response.status_code == 200
        restaurants = response.json()
        assert len(restaurants) == 0


@pytest.mark.asyncio
async def test_rating_field_format(test_db):
    """Test that rating field is properly formatted as float."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/restaurants/1")

        assert response.status_code == 200
        restaurant = response.json()
        assert isinstance(restaurant["rating"], float)
        assert 0.0 <= restaurant["rating"] <= 5.0


@pytest.mark.asyncio
async def test_price_field_format(test_db):
    """Test that price fields are properly formatted."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/restaurants/1/menu")

        assert response.status_code == 200
        menu = response.json()

        for category, items in menu["categories"].items():
            for item in items:
                assert "price" in item
                assert isinstance(item["price"], (int, float))
                assert item["price"] >= 0


@pytest.mark.asyncio
async def test_case_sensitive_cuisine_filter(test_db):
    """Test that cuisine filtering is case-sensitive."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Test with correct case
        response = await client.get("/api/restaurants?cuisine=Italian")
        assert response.status_code == 200
        restaurants = response.json()
        assert len(restaurants) == 2

        # Test with incorrect case
        response = await client.get("/api/restaurants?cuisine=italian")
        assert response.status_code == 200
        restaurants = response.json()
        assert len(restaurants) == 0  # Should not match due to case sensitivity


@pytest.mark.asyncio
async def test_concurrent_requests(test_db):
    """Test handling of concurrent requests."""
    import asyncio

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Make multiple concurrent requests
        tasks = [
            client.get("/api/restaurants"),
            client.get("/api/restaurants/1"),
            client.get("/api/restaurants/2/menu"),
            client.get("/api/cuisines"),
        ]

        responses = await asyncio.gather(*tasks)

        # Verify all requests succeeded
        assert all(r.status_code == 200 for r in responses)
