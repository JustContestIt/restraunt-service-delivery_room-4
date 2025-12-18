"""Tests for database query functions."""

import pytest
import pytest_asyncio
import aiosqlite
import os
from backend.database.db import (
    init_db,
    get_restaurants_filtered,
    get_restaurant_by_id,
    get_menu_items,
    get_all_cuisines,
)


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
                ('Sushi Palace', 'Japanese', 4, 4.8, '456 Oak Ave', 'Premium sushi restaurant'),
                ('Taco Fiesta', 'Mexican', 2, 4.2, '789 Elm St', 'Casual Mexican dining'),
                ('Pizza Corner', 'Italian', 2, 4.0, '321 Pine St', 'Family-friendly pizza place')
        """)
        
        # Insert menu items
        await db.execute("""
            INSERT INTO menu_items (restaurant_id, name, description, price, category)
            VALUES
                (1, 'Margherita Pizza', 'Classic tomato and mozzarella', 12.99, 'Main Course'),
                (1, 'Tiramisu', 'Italian coffee dessert', 6.99, 'Desserts'),
                (2, 'California Roll', 'Crab and avocado roll', 8.99, 'Appetizers'),
                (2, 'Salmon Nigiri', 'Fresh salmon sushi', 15.99, 'Main Course')
        """)
        
        await db.commit()
    
    # Temporarily patch the database connection to use test database
    import backend.database.db as db_module
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
async def test_get_restaurants_filtered_no_filters(test_db):
    """Test getting all restaurants without filters."""
    restaurants = await get_restaurants_filtered()
    assert len(restaurants) == 4
    assert all('id' in r for r in restaurants)
    assert all('name' in r for r in restaurants)


@pytest.mark.asyncio
async def test_get_restaurants_filtered_by_cuisine(test_db):
    """Test filtering restaurants by cuisine."""
    restaurants = await get_restaurants_filtered(cuisine='Italian')
    assert len(restaurants) == 2
    assert all(r['cuisine'] == 'Italian' for r in restaurants)


@pytest.mark.asyncio
async def test_get_restaurants_filtered_by_price(test_db):
    """Test filtering restaurants by max price."""
    restaurants = await get_restaurants_filtered(max_price=2)
    assert len(restaurants) == 2
    assert all(r['price_range'] <= 2 for r in restaurants)


@pytest.mark.asyncio
async def test_get_restaurants_filtered_combined(test_db):
    """Test filtering restaurants by both cuisine and price."""
    restaurants = await get_restaurants_filtered(cuisine='Italian', max_price=2)
    assert len(restaurants) == 1
    assert restaurants[0]['name'] == 'Pizza Corner'


@pytest.mark.asyncio
async def test_get_restaurant_by_id_valid(test_db):
    """Test getting a restaurant by valid ID."""
    restaurant = await get_restaurant_by_id(1)
    assert restaurant is not None
    assert restaurant['name'] == 'Bella Italia'
    assert 'address' in restaurant
    assert 'description' in restaurant


@pytest.mark.asyncio
async def test_get_restaurant_by_id_invalid(test_db):
    """Test getting a restaurant by invalid ID returns None."""
    restaurant = await get_restaurant_by_id(999)
    assert restaurant is None


@pytest.mark.asyncio
async def test_get_menu_items(test_db):
    """Test getting menu items for a restaurant."""
    menu_items = await get_menu_items(1)
    assert len(menu_items) == 2
    assert all('name' in item for item in menu_items)
    assert all('price' in item for item in menu_items)
    assert all('category' in item for item in menu_items)


@pytest.mark.asyncio
async def test_get_menu_items_empty(test_db):
    """Test getting menu items for restaurant with no items."""
    menu_items = await get_menu_items(3)
    assert len(menu_items) == 0


@pytest.mark.asyncio
async def test_get_all_cuisines(test_db):
    """Test getting all unique cuisines sorted."""
    cuisines = await get_all_cuisines()
    assert len(cuisines) == 3
    assert cuisines == ['Italian', 'Japanese', 'Mexican']  # Alphabetically sorted
    assert len(set(cuisines)) == len(cuisines)  # No duplicates
