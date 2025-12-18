"""Database schema and connection management."""

from pathlib import Path
import aiosqlite
from typing import Optional, List, Dict, Any

# Get the absolute path to the database file
DB_DIR = Path(__file__).parent.parent
DB_PATH = DB_DIR / "restaurants.db"


# Database schema SQL
CREATE_TABLES_SQL = """
-- restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    cuisine TEXT NOT NULL,
    price_range INTEGER NOT NULL CHECK(price_range BETWEEN 1 AND 4),
    rating REAL NOT NULL CHECK(rating BETWEEN 0 AND 5),
    address TEXT NOT NULL,
    description TEXT NOT NULL
);

-- menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    restaurant_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price REAL NOT NULL CHECK(price >= 0),
    category TEXT NOT NULL,
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
);

-- indexes for performance
CREATE INDEX IF NOT EXISTS idx_restaurants_cuisine ON restaurants(cuisine);
CREATE INDEX IF NOT EXISTS idx_restaurants_price ON restaurants(price_range);
CREATE INDEX IF NOT EXISTS idx_menu_restaurant ON menu_items(restaurant_id);
CREATE INDEX IF NOT EXISTS idx_menu_category ON menu_items(category);
"""


async def get_db_connection() -> aiosqlite.Connection:
    """
    Create and return a database connection.

    Returns:
        Async database connection with Row factory
    """
    db = await aiosqlite.connect(str(DB_PATH))
    db.row_factory = aiosqlite.Row
    return db


async def init_db() -> None:
    """Initialize database schema and seed data."""
    async with aiosqlite.connect(str(DB_PATH)) as db:
        # Create tables and indexes
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
    db = await get_db_connection()
    try:
        query = "SELECT id, name, cuisine, price_range, rating FROM restaurants WHERE 1=1"
        params = []
        
        if cuisine is not None:
            query += " AND cuisine = ?"
            params.append(cuisine)
        
        if max_price is not None:
            query += " AND price_range <= ?"
            params.append(max_price)
        
        async with db.execute(query, params) as cursor:
            rows = await cursor.fetchall()
            return [dict(row) for row in rows]
    finally:
        await db.close()


async def get_restaurant_by_id(restaurant_id: int) -> Optional[Dict[str, Any]]:
    """
    Query single restaurant by ID.
    
    Args:
        restaurant_id: Restaurant identifier
    
    Returns:
        Restaurant dictionary or None if not found
    """
    db = await get_db_connection()
    try:
        query = """
            SELECT id, name, cuisine, price_range, rating, address, description
            FROM restaurants
            WHERE id = ?
        """
        async with db.execute(query, (restaurant_id,)) as cursor:
            row = await cursor.fetchone()
            return dict(row) if row else None
    finally:
        await db.close()


async def get_menu_items(restaurant_id: int) -> List[Dict[str, Any]]:
    """
    Query all menu items for a restaurant.
    
    Args:
        restaurant_id: Restaurant identifier
    
    Returns:
        List of menu item dictionaries
    """
    db = await get_db_connection()
    try:
        query = """
            SELECT id, restaurant_id, name, description, price, category
            FROM menu_items
            WHERE restaurant_id = ?
        """
        async with db.execute(query, (restaurant_id,)) as cursor:
            rows = await cursor.fetchall()
            return [dict(row) for row in rows]
    finally:
        await db.close()


async def get_all_cuisines() -> List[str]:
    """
    Query all unique cuisine types.
    
    Returns:
        Sorted list of cuisine strings
    """
    db = await get_db_connection()
    try:
        query = "SELECT DISTINCT cuisine FROM restaurants ORDER BY cuisine"
        async with db.execute(query) as cursor:
            rows = await cursor.fetchall()
            return [row["cuisine"] for row in rows]
    finally:
        await db.close()
