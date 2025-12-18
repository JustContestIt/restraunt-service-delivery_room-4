"""Quick demo to verify logging is working."""

import asyncio
import logging
from backend.database.db import init_db, get_restaurants_filtered

# Configure logging to see output
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

async def main():
    """Test logging functionality."""
    print("Initializing database...")
    await init_db()
    
    print("\nFetching restaurants (this should log)...")
    restaurants = await get_restaurants_filtered()
    print(f"Found {len(restaurants)} restaurants")
    
    print("\nFetching with filters (this should log)...")
    italian = await get_restaurants_filtered(cuisine="Italian")
    print(f"Found {len(italian)} Italian restaurants")

if __name__ == "__main__":
    asyncio.run(main())
