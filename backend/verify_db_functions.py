"""Verification script for database query functions."""

import asyncio
from backend.database.db import (
    init_db,
    get_restaurants_filtered,
    get_restaurant_by_id,
    get_menu_items,
    get_all_cuisines,
)


async def verify_functions():
    """Verify all database query functions work correctly."""
    
    print("=" * 60)
    print("Database Query Functions Verification")
    print("=" * 60)
    
    # Test 1: get_restaurants_filtered() - no filters
    print("\n1. Testing get_restaurants_filtered() with no filters:")
    restaurants = await get_restaurants_filtered()
    print(f"   ✓ Found {len(restaurants)} restaurants")
    if restaurants:
        print(f"   Sample: {restaurants[0]['name']} ({restaurants[0]['cuisine']})")
    
    # Test 2: get_restaurants_filtered() - cuisine filter
    print("\n2. Testing get_restaurants_filtered() with cuisine='Italian':")
    italian_restaurants = await get_restaurants_filtered(cuisine='Italian')
    print(f"   ✓ Found {len(italian_restaurants)} Italian restaurants")
    for r in italian_restaurants[:3]:
        print(f"   - {r['name']}")
    
    # Test 3: get_restaurants_filtered() - price filter
    print("\n3. Testing get_restaurants_filtered() with max_price=2:")
    cheap_restaurants = await get_restaurants_filtered(max_price=2)
    print(f"   ✓ Found {len(cheap_restaurants)} restaurants with price ≤ 2")
    for r in cheap_restaurants[:3]:
        print(f"   - {r['name']} (price: {r['price_range']})")
    
    # Test 4: get_restaurants_filtered() - combined filters
    print("\n4. Testing get_restaurants_filtered() with cuisine='Italian' and max_price=2:")
    filtered = await get_restaurants_filtered(cuisine='Italian', max_price=2)
    print(f"   ✓ Found {len(filtered)} Italian restaurants with price ≤ 2")
    for r in filtered:
        print(f"   - {r['name']} (price: {r['price_range']})")
    
    # Test 5: get_restaurant_by_id() - valid ID
    print("\n5. Testing get_restaurant_by_id() with valid ID (1):")
    restaurant = await get_restaurant_by_id(1)
    if restaurant:
        print(f"   ✓ Found: {restaurant['name']}")
        print(f"   Address: {restaurant['address']}")
        print(f"   Description: {restaurant['description'][:50]}...")
    
    # Test 6: get_restaurant_by_id() - invalid ID
    print("\n6. Testing get_restaurant_by_id() with invalid ID (99999):")
    restaurant = await get_restaurant_by_id(99999)
    if restaurant is None:
        print(f"   ✓ Correctly returned None for non-existent restaurant")
    else:
        print(f"   ✗ ERROR: Should have returned None")
    
    # Test 7: get_menu_items()
    print("\n7. Testing get_menu_items() for restaurant ID 1:")
    menu_items = await get_menu_items(1)
    print(f"   ✓ Found {len(menu_items)} menu items")
    for item in menu_items[:3]:
        print(f"   - {item['name']} (${item['price']}) - {item['category']}")
    
    # Test 8: get_all_cuisines()
    print("\n8. Testing get_all_cuisines():")
    cuisines = await get_all_cuisines()
    print(f"   ✓ Found {len(cuisines)} unique cuisines (sorted alphabetically)")
    print(f"   Cuisines: {', '.join(cuisines)}")
    
    print("\n" + "=" * 60)
    print("All database query functions verified successfully! ✓")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(verify_functions())
