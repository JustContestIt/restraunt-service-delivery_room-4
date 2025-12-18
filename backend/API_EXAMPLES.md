# API Examples

This document provides comprehensive examples of API requests and responses for the Restaurant Backend API.

## Table of Contents

- [Authentication](#authentication)
- [Health Check](#health-check)
- [Restaurant Endpoints](#restaurant-endpoints)
- [Menu Endpoints](#menu-endpoints)
- [Cuisine Endpoints](#cuisine-endpoints)
- [Error Responses](#error-responses)
- [Client Examples](#client-examples)

## Base URL

```
http://localhost:8000
```

For production, replace with your actual domain:
```
https://api.example.com
```

## Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible.

## Health Check

### Check API Status

**Request:**
```bash
curl -X GET http://localhost:8000/health
```

**Response (200 OK):**
```json
{
  "status": "healthy"
}
```

---

## Restaurant Endpoints

### 1. Get All Restaurants

Retrieve all restaurants without any filters.

**Request:**
```bash
curl -X GET http://localhost:8000/api/restaurants
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
  },
  {
    "id": 3,
    "name": "Taco Fiesta",
    "cuisine": "Mexican",
    "price_range": 2,
    "rating": 4.2
  },
  {
    "id": 4,
    "name": "Le Petit Bistro",
    "cuisine": "French",
    "price_range": 4,
    "rating": 4.7
  },
  {
    "id": 5,
    "name": "Dragon Wok",
    "cuisine": "Chinese",
    "price_range": 2,
    "rating": 4.3
  }
]
```

---

### 2. Filter Restaurants by Cuisine

Get all restaurants of a specific cuisine type.

**Request:**
```bash
curl -X GET "http://localhost:8000/api/restaurants?cuisine=Italian"
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
    "id": 6,
    "name": "Pasta Paradise",
    "cuisine": "Italian",
    "price_range": 2,
    "rating": 4.1
  }
]
```

---

### 3. Filter Restaurants by Price Range

Get restaurants within a specific price range (1-4 scale).

**Request:**
```bash
curl -X GET "http://localhost:8000/api/restaurants?max_price=2"
```

**Response (200 OK):**
```json
[
  {
    "id": 3,
    "name": "Taco Fiesta",
    "cuisine": "Mexican",
    "price_range": 2,
    "rating": 4.2
  },
  {
    "id": 5,
    "name": "Dragon Wok",
    "cuisine": "Chinese",
    "price_range": 2,
    "rating": 4.3
  },
  {
    "id": 6,
    "name": "Pasta Paradise",
    "cuisine": "Italian",
    "price_range": 2,
    "rating": 4.1
  },
  {
    "id": 7,
    "name": "Burger Barn",
    "cuisine": "American",
    "price_range": 1,
    "rating": 3.9
  }
]
```

---

### 4. Filter by Both Cuisine and Price

Combine multiple filters to narrow down results.

**Request:**
```bash
curl -X GET "http://localhost:8000/api/restaurants?cuisine=Japanese&max_price=3"
```

**Response (200 OK):**
```json
[
  {
    "id": 8,
    "name": "Ramen House",
    "cuisine": "Japanese",
    "price_range": 2,
    "rating": 4.4
  },
  {
    "id": 9,
    "name": "Tokyo Express",
    "cuisine": "Japanese",
    "price_range": 3,
    "rating": 4.6
  }
]
```

---

### 5. Get Restaurant Details

Retrieve complete information about a specific restaurant.

**Request:**
```bash
curl -X GET http://localhost:8000/api/restaurants/1
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Bella Italia",
  "cuisine": "Italian",
  "price_range": 3,
  "rating": 4.5,
  "address": "123 Main Street, Downtown, City, State 12345",
  "description": "Authentic Italian cuisine with a modern twist. Family-owned restaurant serving traditional recipes passed down through generations. Our pasta is made fresh daily, and we source ingredients directly from Italy."
}
```

---

### 6. Get Non-Existent Restaurant

Attempt to retrieve a restaurant that doesn't exist.

**Request:**
```bash
curl -X GET http://localhost:8000/api/restaurants/9999
```

**Response (404 Not Found):**
```json
{
  "detail": "Restaurant not found"
}
```

---

## Menu Endpoints

### 1. Get Restaurant Menu

Retrieve the complete menu for a restaurant, organized by category.

**Request:**
```bash
curl -X GET http://localhost:8000/api/restaurants/1/menu
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
        "description": "Toasted bread topped with fresh tomatoes, garlic, basil, and olive oil",
        "price": 8.99,
        "category": "Appetizers"
      },
      {
        "id": 2,
        "name": "Caprese Salad",
        "description": "Fresh mozzarella, tomatoes, and basil with balsamic glaze",
        "price": 10.99,
        "category": "Appetizers"
      },
      {
        "id": 3,
        "name": "Calamari Fritti",
        "description": "Lightly fried squid served with marinara sauce",
        "price": 12.99,
        "category": "Appetizers"
      }
    ],
    "Main Course": [
      {
        "id": 4,
        "name": "Spaghetti Carbonara",
        "description": "Classic Roman pasta with eggs, Pecorino cheese, pancetta, and black pepper",
        "price": 16.99,
        "category": "Main Course"
      },
      {
        "id": 5,
        "name": "Margherita Pizza",
        "description": "Traditional pizza with tomato sauce, mozzarella, and fresh basil",
        "price": 14.99,
        "category": "Main Course"
      },
      {
        "id": 6,
        "name": "Osso Buco",
        "description": "Braised veal shanks with vegetables, white wine, and broth",
        "price": 28.99,
        "category": "Main Course"
      },
      {
        "id": 7,
        "name": "Risotto ai Funghi",
        "description": "Creamy risotto with mixed mushrooms and Parmesan cheese",
        "price": 18.99,
        "category": "Main Course"
      }
    ],
    "Desserts": [
      {
        "id": 8,
        "name": "Tiramisu",
        "description": "Classic Italian dessert with coffee-soaked ladyfingers and mascarpone cream",
        "price": 7.99,
        "category": "Desserts"
      },
      {
        "id": 9,
        "name": "Panna Cotta",
        "description": "Silky vanilla custard with berry compote",
        "price": 6.99,
        "category": "Desserts"
      },
      {
        "id": 10,
        "name": "Cannoli",
        "description": "Crispy pastry shells filled with sweet ricotta cream",
        "price": 5.99,
        "category": "Desserts"
      }
    ],
    "Beverages": [
      {
        "id": 11,
        "name": "Espresso",
        "description": "Strong Italian coffee",
        "price": 3.50,
        "category": "Beverages"
      },
      {
        "id": 12,
        "name": "Italian Soda",
        "description": "Sparkling water with flavored syrup",
        "price": 4.50,
        "category": "Beverages"
      }
    ]
  }
}
```

---

### 2. Get Menu for Non-Existent Restaurant

**Request:**
```bash
curl -X GET http://localhost:8000/api/restaurants/9999/menu
```

**Response (404 Not Found):**
```json
{
  "detail": "Restaurant not found"
}
```

---

## Cuisine Endpoints

### 1. Get All Cuisines

Retrieve a sorted list of all unique cuisine types.

**Request:**
```bash
curl -X GET http://localhost:8000/api/cuisines
```

**Response (200 OK):**
```json
[
  "American",
  "Chinese",
  "French",
  "Italian",
  "Japanese",
  "Mexican",
  "Thai",
  "Vietnamese"
]
```

---

## Error Responses

### 1. Validation Error (422)

Invalid query parameter value.

**Request:**
```bash
curl -X GET "http://localhost:8000/api/restaurants?max_price=10"
```

**Response (422 Unprocessable Entity):**
```json
{
  "detail": [
    {
      "type": "less_than_equal",
      "loc": ["query", "max_price"],
      "msg": "Input should be less than or equal to 4",
      "input": "10",
      "ctx": {
        "le": 4
      }
    }
  ]
}
```

---

### 2. Invalid Path Parameter

**Request:**
```bash
curl -X GET http://localhost:8000/api/restaurants/abc
```

**Response (422 Unprocessable Entity):**
```json
{
  "detail": [
    {
      "type": "int_parsing",
      "loc": ["path", "restaurant_id"],
      "msg": "Input should be a valid integer, unable to parse string as an integer",
      "input": "abc"
    }
  ]
}
```

---

### 3. Server Error (500)

Database connection error or internal server error.

**Response (500 Internal Server Error):**
```json
{
  "detail": "Database error occurred"
}
```

---

## Client Examples

### JavaScript (Fetch API)

```javascript
// Get all restaurants
async function getAllRestaurants() {
  const response = await fetch('http://localhost:8000/api/restaurants');
  const restaurants = await response.json();
  console.log(restaurants);
}

// Filter restaurants by cuisine
async function getItalianRestaurants() {
  const response = await fetch('http://localhost:8000/api/restaurants?cuisine=Italian');
  const restaurants = await response.json();
  console.log(restaurants);
}

// Get restaurant details
async function getRestaurantDetails(id) {
  const response = await fetch(`http://localhost:8000/api/restaurants/${id}`);
  
  if (!response.ok) {
    if (response.status === 404) {
      console.error('Restaurant not found');
      return null;
    }
    throw new Error('Failed to fetch restaurant');
  }
  
  const restaurant = await response.json();
  return restaurant;
}

// Get restaurant menu
async function getRestaurantMenu(id) {
  const response = await fetch(`http://localhost:8000/api/restaurants/${id}/menu`);
  const menu = await response.json();
  console.log(menu);
}

// Get all cuisines
async function getAllCuisines() {
  const response = await fetch('http://localhost:8000/api/cuisines');
  const cuisines = await response.json();
  console.log(cuisines);
}

// Filter with multiple parameters
async function filterRestaurants(cuisine, maxPrice) {
  const params = new URLSearchParams();
  if (cuisine) params.append('cuisine', cuisine);
  if (maxPrice) params.append('max_price', maxPrice);
  
  const response = await fetch(`http://localhost:8000/api/restaurants?${params}`);
  const restaurants = await response.json();
  return restaurants;
}
```

---

### Python (requests)

```python
import requests

BASE_URL = "http://localhost:8000"

# Get all restaurants
def get_all_restaurants():
    response = requests.get(f"{BASE_URL}/api/restaurants")
    response.raise_for_status()
    return response.json()

# Filter restaurants by cuisine
def get_restaurants_by_cuisine(cuisine):
    response = requests.get(
        f"{BASE_URL}/api/restaurants",
        params={"cuisine": cuisine}
    )
    response.raise_for_status()
    return response.json()

# Get restaurant details
def get_restaurant_details(restaurant_id):
    response = requests.get(f"{BASE_URL}/api/restaurants/{restaurant_id}")
    
    if response.status_code == 404:
        print("Restaurant not found")
        return None
    
    response.raise_for_status()
    return response.json()

# Get restaurant menu
def get_restaurant_menu(restaurant_id):
    response = requests.get(f"{BASE_URL}/api/restaurants/{restaurant_id}/menu")
    response.raise_for_status()
    return response.json()

# Get all cuisines
def get_all_cuisines():
    response = requests.get(f"{BASE_URL}/api/cuisines")
    response.raise_for_status()
    return response.json()

# Filter with multiple parameters
def filter_restaurants(cuisine=None, max_price=None):
    params = {}
    if cuisine:
        params['cuisine'] = cuisine
    if max_price:
        params['max_price'] = max_price
    
    response = requests.get(f"{BASE_URL}/api/restaurants", params=params)
    response.raise_for_status()
    return response.json()

# Example usage
if __name__ == "__main__":
    # Get all restaurants
    restaurants = get_all_restaurants()
    print(f"Found {len(restaurants)} restaurants")
    
    # Filter by cuisine
    italian = get_restaurants_by_cuisine("Italian")
    print(f"Found {len(italian)} Italian restaurants")
    
    # Get details
    restaurant = get_restaurant_details(1)
    if restaurant:
        print(f"Restaurant: {restaurant['name']}")
    
    # Get menu
    menu = get_restaurant_menu(1)
    print(f"Menu has {len(menu['categories'])} categories")
    
    # Get cuisines
    cuisines = get_all_cuisines()
    print(f"Available cuisines: {', '.join(cuisines)}")
```

---

### Python (httpx - async)

```python
import asyncio
import httpx

BASE_URL = "http://localhost:8000"

async def get_all_restaurants():
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{BASE_URL}/api/restaurants")
        response.raise_for_status()
        return response.json()

async def get_restaurant_details(restaurant_id):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{BASE_URL}/api/restaurants/{restaurant_id}")
        
        if response.status_code == 404:
            return None
        
        response.raise_for_status()
        return response.json()

async def main():
    # Fetch multiple restaurants concurrently
    async with httpx.AsyncClient() as client:
        tasks = [
            client.get(f"{BASE_URL}/api/restaurants/1"),
            client.get(f"{BASE_URL}/api/restaurants/2"),
            client.get(f"{BASE_URL}/api/restaurants/3"),
        ]
        responses = await asyncio.gather(*tasks)
        restaurants = [r.json() for r in responses if r.status_code == 200]
        print(f"Fetched {len(restaurants)} restaurants")

if __name__ == "__main__":
    asyncio.run(main())
```

---

### cURL Examples

```bash
# Get all restaurants
curl -X GET http://localhost:8000/api/restaurants

# Filter by cuisine
curl -X GET "http://localhost:8000/api/restaurants?cuisine=Italian"

# Filter by price
curl -X GET "http://localhost:8000/api/restaurants?max_price=2"

# Combined filters
curl -X GET "http://localhost:8000/api/restaurants?cuisine=Japanese&max_price=3"

# Get restaurant details
curl -X GET http://localhost:8000/api/restaurants/1

# Get restaurant menu
curl -X GET http://localhost:8000/api/restaurants/1/menu

# Get all cuisines
curl -X GET http://localhost:8000/api/cuisines

# Pretty print JSON response
curl -X GET http://localhost:8000/api/restaurants | jq

# Include response headers
curl -X GET http://localhost:8000/api/restaurants -v

# Save response to file
curl -X GET http://localhost:8000/api/restaurants -o restaurants.json
```

---

### Postman Collection

Import this JSON into Postman to get started quickly:

```json
{
  "info": {
    "name": "Restaurant Backend API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get All Restaurants",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/api/restaurants",
          "host": ["{{base_url}}"],
          "path": ["api", "restaurants"]
        }
      }
    },
    {
      "name": "Filter by Cuisine",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/api/restaurants?cuisine=Italian",
          "host": ["{{base_url}}"],
          "path": ["api", "restaurants"],
          "query": [
            {
              "key": "cuisine",
              "value": "Italian"
            }
          ]
        }
      }
    },
    {
      "name": "Get Restaurant Details",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/api/restaurants/1",
          "host": ["{{base_url}}"],
          "path": ["api", "restaurants", "1"]
        }
      }
    },
    {
      "name": "Get Restaurant Menu",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/api/restaurants/1/menu",
          "host": ["{{base_url}}"],
          "path": ["api", "restaurants", "1", "menu"]
        }
      }
    },
    {
      "name": "Get All Cuisines",
      "request": {
        "method": "GET",
        "header": [],
        "url": {
          "raw": "{{base_url}}/api/cuisines",
          "host": ["{{base_url}}"],
          "path": ["api", "cuisines"]
        }
      }
    }
  ],
  "variable": [
    {
      "key": "base_url",
      "value": "http://localhost:8000"
    }
  ]
}
```

---

## Testing Tips

### 1. Test CORS

```bash
# Test from browser console
fetch('http://localhost:8000/api/restaurants')
  .then(r => r.json())
  .then(console.log)
```

### 2. Load Testing

```bash
# Using Apache Bench
ab -n 1000 -c 10 http://localhost:8000/api/restaurants

# Using wrk
wrk -t4 -c100 -d30s http://localhost:8000/api/restaurants
```

### 3. Response Time

```bash
# Measure response time
curl -w "@curl-format.txt" -o /dev/null -s http://localhost:8000/api/restaurants

# curl-format.txt content:
#     time_namelookup:  %{time_namelookup}\n
#        time_connect:  %{time_connect}\n
#     time_appconnect:  %{time_appconnect}\n
#    time_pretransfer:  %{time_pretransfer}\n
#       time_redirect:  %{time_redirect}\n
#  time_starttransfer:  %{time_starttransfer}\n
#                     ----------\n
#          time_total:  %{time_total}\n
```

## Additional Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [HTTP Status Codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status)
- [REST API Best Practices](https://restfulapi.net/)
