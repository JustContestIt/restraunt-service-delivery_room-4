"""Sample data for development and testing."""

import aiosqlite
import asyncio
from backend.database.db import DB_PATH, init_db


SAMPLE_RESTAURANTS = [
    {
        "name": "Bella Italia",
        "cuisine": "Italian",
        "price_range": 3,
        "rating": 4.5,
        "address": "123 Main St, Downtown",
        "description": "Authentic Italian cuisine with fresh pasta and wood-fired pizzas."
    },
    {
        "name": "Sushi Palace",
        "cuisine": "Japanese",
        "price_range": 4,
        "rating": 4.8,
        "address": "456 Ocean Ave, Waterfront",
        "description": "Premium sushi and sashimi with traditional Japanese ambiance."
    },
    {
        "name": "Taco Fiesta",
        "cuisine": "Mexican",
        "price_range": 2,
        "rating": 4.2,
        "address": "789 Sunset Blvd, West Side",
        "description": "Vibrant Mexican street food with authentic flavors and fresh ingredients."
    },
    {
        "name": "Dragon Wok",
        "cuisine": "Chinese",
        "price_range": 2,
        "rating": 4.0,
        "address": "321 Market St, Chinatown",
        "description": "Traditional Chinese dishes with a modern twist."
    },
    {
        "name": "Le Petit Bistro",
        "cuisine": "French",
        "price_range": 4,
        "rating": 4.7,
        "address": "555 Park Ave, Uptown",
        "description": "Classic French cuisine in an elegant setting."
    },
    {
        "name": "Pasta Paradise",
        "cuisine": "Italian",
        "price_range": 2,
        "rating": 4.3,
        "address": "888 Broadway, Theater District",
        "description": "Casual Italian dining with homemade pasta and family recipes."
    },
    {
        "name": "Spice Route",
        "cuisine": "Indian",
        "price_range": 2,
        "rating": 4.4,
        "address": "999 Curry Lane, Little India",
        "description": "Aromatic Indian curries and tandoori specialties."
    },
    {
        "name": "The Burger Joint",
        "cuisine": "American",
        "price_range": 1,
        "rating": 3.9,
        "address": "111 Fast Food Way, Mall District",
        "description": "Classic American burgers and fries in a retro diner setting."
    }
]


SAMPLE_MENU_ITEMS = [
    # Bella Italia menu
    {"restaurant_id": 1, "name": "Margherita Pizza", "description": "Classic tomato, mozzarella, and basil", "price": 14.99, "category": "Main Course"},
    {"restaurant_id": 1, "name": "Bruschetta", "description": "Toasted bread with tomatoes and garlic", "price": 8.99, "category": "Appetizers"},
    {"restaurant_id": 1, "name": "Tiramisu", "description": "Coffee-flavored Italian dessert", "price": 7.99, "category": "Desserts"},
    {"restaurant_id": 1, "name": "Fettuccine Alfredo", "description": "Creamy pasta with parmesan", "price": 16.99, "category": "Main Course"},
    
    # Sushi Palace menu
    {"restaurant_id": 2, "name": "Salmon Nigiri", "description": "Fresh salmon over rice", "price": 12.99, "category": "Main Course"},
    {"restaurant_id": 2, "name": "Miso Soup", "description": "Traditional Japanese soup", "price": 4.99, "category": "Appetizers"},
    {"restaurant_id": 2, "name": "Green Tea Ice Cream", "description": "Matcha flavored dessert", "price": 6.99, "category": "Desserts"},
    {"restaurant_id": 2, "name": "Dragon Roll", "description": "Eel and avocado sushi roll", "price": 15.99, "category": "Main Course"},
    
    # Taco Fiesta menu
    {"restaurant_id": 3, "name": "Beef Tacos", "description": "Three soft tacos with seasoned beef", "price": 9.99, "category": "Main Course"},
    {"restaurant_id": 3, "name": "Guacamole & Chips", "description": "Fresh guacamole with tortilla chips", "price": 6.99, "category": "Appetizers"},
    {"restaurant_id": 3, "name": "Churros", "description": "Fried dough with cinnamon sugar", "price": 5.99, "category": "Desserts"},
    {"restaurant_id": 3, "name": "Margarita", "description": "Classic lime margarita", "price": 8.99, "category": "Beverages"},
    
    # Dragon Wok menu
    {"restaurant_id": 4, "name": "Kung Pao Chicken", "description": "Spicy chicken with peanuts", "price": 13.99, "category": "Main Course"},
    {"restaurant_id": 4, "name": "Spring Rolls", "description": "Crispy vegetable rolls", "price": 5.99, "category": "Appetizers"},
    {"restaurant_id": 4, "name": "Fortune Cookies", "description": "Traditional dessert cookies", "price": 2.99, "category": "Desserts"},
    
    # Le Petit Bistro menu
    {"restaurant_id": 5, "name": "Coq au Vin", "description": "Chicken braised in red wine", "price": 28.99, "category": "Main Course"},
    {"restaurant_id": 5, "name": "French Onion Soup", "description": "Classic soup with cheese", "price": 9.99, "category": "Appetizers"},
    {"restaurant_id": 5, "name": "Crème Brûlée", "description": "Vanilla custard with caramelized sugar", "price": 9.99, "category": "Desserts"},
    
    # Pasta Paradise menu
    {"restaurant_id": 6, "name": "Spaghetti Carbonara", "description": "Pasta with bacon and egg", "price": 12.99, "category": "Main Course"},
    {"restaurant_id": 6, "name": "Caprese Salad", "description": "Tomato, mozzarella, and basil", "price": 7.99, "category": "Appetizers"},
    {"restaurant_id": 6, "name": "Panna Cotta", "description": "Italian cream dessert", "price": 6.99, "category": "Desserts"},
    
    # Spice Route menu
    {"restaurant_id": 7, "name": "Chicken Tikka Masala", "description": "Creamy tomato curry", "price": 14.99, "category": "Main Course"},
    {"restaurant_id": 7, "name": "Samosas", "description": "Fried pastry with spiced filling", "price": 5.99, "category": "Appetizers"},
    {"restaurant_id": 7, "name": "Mango Lassi", "description": "Sweet yogurt drink", "price": 4.99, "category": "Beverages"},
    
    # The Burger Joint menu
    {"restaurant_id": 8, "name": "Classic Cheeseburger", "description": "Beef patty with cheese", "price": 9.99, "category": "Main Course"},
    {"restaurant_id": 8, "name": "Onion Rings", "description": "Crispy fried onion rings", "price": 4.99, "category": "Appetizers"},
    {"restaurant_id": 8, "name": "Milkshake", "description": "Vanilla, chocolate, or strawberry", "price": 5.99, "category": "Beverages"},
]


async def seed_database() -> None:
    """Populate database with sample data."""
    # Initialize database schema first
    await init_db()

    async with aiosqlite.connect(str(DB_PATH)) as db:
        # Insert restaurants
        for restaurant in SAMPLE_RESTAURANTS:
            await db.execute(
                """
                INSERT INTO restaurants (name, cuisine, price_range, rating, address, description)
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                (
                    restaurant["name"],
                    restaurant["cuisine"],
                    restaurant["price_range"],
                    restaurant["rating"],
                    restaurant["address"],
                    restaurant["description"]
                )
            )
        
        # Insert menu items
        for item in SAMPLE_MENU_ITEMS:
            await db.execute(
                """
                INSERT INTO menu_items (restaurant_id, name, description, price, category)
                VALUES (?, ?, ?, ?, ?)
                """,
                (
                    item["restaurant_id"],
                    item["name"],
                    item["description"],
                    item["price"],
                    item["category"]
                )
            )
        
        await db.commit()
        print("Database seeded successfully!")


if __name__ == "__main__":
    asyncio.run(seed_database())
