"""Tests for error handling and validation."""

import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
import aiosqlite
import os

from backend.main import app
from backend.database.db import init_db


@pytest_asyncio.fixture
async def test_db():
    """Create a test database with sample data."""
    # Use a separate test database
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
        """)
        
        # Insert test data
        await db.execute("""
            INSERT INTO restaurants (name, cuisine, price_range, rating, address, description)
            VALUES 
                ('Bella Italia', 'Italian', 3, 4.5, '123 Main St', 'Authentic Italian cuisine'),
                ('Sushi Palace', 'Japanese', 4, 4.8, '456 Oak Ave', 'Premium sushi restaurant')
        """)
        
        # Insert menu items
        await db.execute("""
            INSERT INTO menu_items (restaurant_id, name, description, price, category)
            VALUES
                (1, 'Margherita Pizza', 'Classic tomato and mozzarella', 12.99, 'Main Course'),
                (1, 'Tiramisu', 'Italian coffee dessert', 6.99, 'Desserts')
        """)
        
        await db.commit()
    
    # Temporarily patch the database connection to use test database
    original_connect = aiosqlite.connect
    
    async def test_connect(db_path):
        return await original_connect(test_db_path)
    
    aiosqlite.connect = test_connect
    
    yield
    
    # Restore original connection
    aiosqlite.connect = original_connect
    
    # Cleanup test database
    if os.path.exists(test_db_path):
        os.remove(test_db_path)


@pytest.mark.asyncio
async def test_restaurant_not_found_returns_404(test_db):
    """Test that requesting a non-existent restaurant returns 404."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/restaurants/999")
        
        assert response.status_code == 404
        assert "detail" in response.json()
        assert response.json()["detail"] == "Restaurant not found"


@pytest.mark.asyncio
async def test_menu_not_found_returns_404(test_db):
    """Test that requesting menu for non-existent restaurant returns 404."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/restaurants/999/menu")
        
        assert response.status_code == 404
        assert "detail" in response.json()
        assert response.json()["detail"] == "Restaurant not found"


@pytest.mark.asyncio
async def test_invalid_restaurant_id_type_returns_422():
    """Test that invalid restaurant ID type returns 422 validation error."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/restaurants/invalid")
        
        assert response.status_code == 422
        assert "detail" in response.json()


@pytest.mark.asyncio
async def test_error_response_format_matches_schema(test_db):
    """Test that error responses match the ErrorResponse schema."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Test 404 error
        response = await client.get("/api/restaurants/999")
        
        assert response.status_code == 404
        error_data = response.json()
        
        # Verify ErrorResponse schema
        assert "detail" in error_data
        assert isinstance(error_data["detail"], (str, list))


@pytest.mark.asyncio
async def test_validation_error_response_format():
    """Test that validation errors return proper 422 format."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Invalid path parameter type
        response = await client.get("/api/restaurants/not_a_number")
        
        assert response.status_code == 422
        error_data = response.json()
        
        # Verify validation error format
        assert "detail" in error_data
        assert isinstance(error_data["detail"], list)
        
        # Check validation error structure
        if isinstance(error_data["detail"], list) and len(error_data["detail"]) > 0:
            error_item = error_data["detail"][0]
            assert "loc" in error_item or "type" in error_item or "msg" in error_item


@pytest.mark.asyncio
async def test_cors_headers_present(test_db):
    """Test that CORS headers are present in responses."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get(
            "/api/restaurants",
            headers={"Origin": "http://localhost:3000"}
        )
        
        assert response.status_code == 200
        # CORS headers should be present
        assert "access-control-allow-origin" in response.headers


@pytest.mark.asyncio
async def test_successful_request_returns_valid_data(test_db):
    """Test that successful requests return properly formatted data."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/restaurants")
        
        assert response.status_code == 200
        data = response.json()
        
        # Verify response is a list
        assert isinstance(data, list)
        
        # Verify each restaurant has required fields
        for restaurant in data:
            assert "id" in restaurant
            assert "name" in restaurant
            assert "cuisine" in restaurant
            assert "price_range" in restaurant
            assert "rating" in restaurant


@pytest.mark.asyncio
async def test_pydantic_validation_on_response(test_db):
    """Test that Pydantic validates response data."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/restaurants/1")
        
        assert response.status_code == 200
        restaurant = response.json()
        
        # Verify all required fields are present
        assert "id" in restaurant
        assert "name" in restaurant
        assert "cuisine" in restaurant
        assert "price_range" in restaurant
        assert "rating" in restaurant
        assert "address" in restaurant
        assert "description" in restaurant
        
        # Verify field types and constraints
        assert isinstance(restaurant["id"], int)
        assert isinstance(restaurant["name"], str)
        assert isinstance(restaurant["price_range"], int)
        assert 1 <= restaurant["price_range"] <= 4
        assert isinstance(restaurant["rating"], float)
        assert 0.0 <= restaurant["rating"] <= 5.0


@pytest.mark.asyncio
async def test_menu_response_schema_validation(test_db):
    """Test that menu responses conform to MenuResponse schema."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/restaurants/1/menu")
        
        assert response.status_code == 200
        menu = response.json()
        
        # Verify MenuResponse structure
        assert "restaurant_id" in menu
        assert "categories" in menu
        assert isinstance(menu["categories"], dict)
        
        # Verify menu items have required fields
        for category, items in menu["categories"].items():
            assert isinstance(items, list)
            for item in items:
                assert "id" in item
                assert "name" in item
                assert "description" in item
                assert "price" in item
                assert "category" in item
                assert item["price"] >= 0


@pytest.mark.asyncio
async def test_cuisines_response_format(test_db):
    """Test that cuisines endpoint returns proper format."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/cuisines")
        
        assert response.status_code == 200
        cuisines = response.json()
        
        # Verify response is a list of strings
        assert isinstance(cuisines, list)
        assert all(isinstance(c, str) for c in cuisines)
        
        # Verify sorted and unique
        assert cuisines == sorted(cuisines)
        assert len(cuisines) == len(set(cuisines))
