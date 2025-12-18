"""
Restaurant Backend API

FastAPI-based backend service for restaurant selection platform.
Provides RESTful endpoints for managing and querying restaurant data.
"""

import logging
from typing import List, Optional, Dict, Callable, Any, TypeVar
from functools import wraps
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
import aiosqlite

from backend.models.schemas import RestaurantListItem, RestaurantDetail, MenuResponse, MenuItem
from backend.database.db import get_restaurants_filtered, get_restaurant_by_id, get_menu_items, get_all_cuisines

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Type variable for generic async functions
T = TypeVar('T')

# Initialize FastAPI application
app = FastAPI(
    title="Restaurant Service API",
    description="Backend API for restaurant selection platform",
    version="1.0.0"
)

# Configure CORS middleware for development and production
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # React default
        "http://localhost:5173",  # Vite default
        "http://localhost:8080",  # Vue default
        "https://*.onrender.com",  # Render deployment
    ],
    allow_origin_regex=r"https://.*\.onrender\.com",  # Allow all Render subdomains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Request logging middleware
@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log all incoming requests and their responses."""
    logger.info(f"Request: {request.method} {request.url.path}")
    try:
        response = await call_next(request)
        logger.info(f"Response: {request.method} {request.url.path} - Status: {response.status_code}")
        return response
    except Exception as e:
        logger.error(f"Request failed: {request.method} {request.url.path} - Error: {str(e)}")
        raise


async def safe_db_query(query_func: Callable[..., Any], *args, **kwargs) -> Any:
    """
    Wrapper for database queries with error handling.
    
    Args:
        query_func: Async function that performs database query
        *args: Positional arguments to pass to query_func
        **kwargs: Keyword arguments to pass to query_func
    
    Returns:
        Query result
        
    Raises:
        HTTPException: 500 if database error occurs
    """
    try:
        return await query_func(*args, **kwargs)
    except aiosqlite.Error as e:
        logger.error(f"Database error in {query_func.__name__}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Database error occurred"
        )
    except Exception as e:
        logger.error(f"Unexpected error in {query_func.__name__}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Internal server error"
        )


@app.get("/")
async def root() -> dict[str, str]:
    """Root endpoint - API health check."""
    return {"message": "Restaurant Service API is running"}


@app.get("/health")
async def health_check() -> dict[str, str]:
    """Health check endpoint."""
    return {"status": "healthy"}


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
        
    Raises:
        HTTPException: 500 if database error occurs
    """
    logger.info(f"Fetching restaurants with filters - cuisine: {cuisine}, max_price: {max_price}")
    restaurants = await safe_db_query(get_restaurants_filtered, cuisine=cuisine, max_price=max_price)
    return [RestaurantListItem(**restaurant) for restaurant in restaurants]


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
        HTTPException: 500 if database error occurs
    """
    logger.info(f"Fetching restaurant details for ID: {restaurant_id}")
    restaurant = await safe_db_query(get_restaurant_by_id, restaurant_id)
    
    if restaurant is None:
        logger.warning(f"Restaurant not found: {restaurant_id}")
        raise HTTPException(
            status_code=404,
            detail="Restaurant not found"
        )
    
    return RestaurantDetail(**restaurant)


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
        HTTPException: 500 if database error occurs
    """
    logger.info(f"Fetching menu for restaurant ID: {restaurant_id}")
    
    # First check if restaurant exists
    restaurant = await safe_db_query(get_restaurant_by_id, restaurant_id)
    
    if restaurant is None:
        logger.warning(f"Restaurant not found for menu request: {restaurant_id}")
        raise HTTPException(
            status_code=404,
            detail="Restaurant not found"
        )
    
    # Get all menu items for the restaurant
    menu_items = await safe_db_query(get_menu_items, restaurant_id)
    
    # Group menu items by category
    categories: Dict[str, List[MenuItem]] = {}
    for item in menu_items:
        category = item["category"]
        menu_item = MenuItem(**item)
        
        if category not in categories:
            categories[category] = []
        
        categories[category].append(menu_item)
    
    return MenuResponse(
        restaurant_id=restaurant_id,
        categories=categories
    )


@app.get("/api/cuisines", response_model=List[str])
async def get_cuisines() -> List[str]:
    """
    Retrieve all unique cuisine types.
    
    Returns:
        Sorted list of cuisine types
        
    Raises:
        HTTPException: 500 if database error occurs
    """
    logger.info("Fetching all cuisines")
    cuisines = await safe_db_query(get_all_cuisines)
    return cuisines
