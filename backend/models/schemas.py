"""Pydantic models for request/response validation."""

from typing import Dict, List, Union, Any
from pydantic import BaseModel, Field, field_validator


class RestaurantBase(BaseModel):
    """Base restaurant fields shared across models."""
    
    name: str = Field(..., min_length=1, max_length=100)
    cuisine: str = Field(..., min_length=1, max_length=50)
    price_range: int = Field(..., ge=1, le=4, description="Price level indicator (1-4)")
    rating: float = Field(..., ge=0.0, le=5.0, description="Average rating (0.0-5.0)")
    
    model_config = {
        "json_schema_extra": {
            "examples": [{
                "name": "Bella Italia",
                "cuisine": "Italian",
                "price_range": 3,
                "rating": 4.5
            }]
        }
    }


class RestaurantListItem(RestaurantBase):
    """Restaurant summary for list views."""
    
    id: int = Field(..., gt=0, description="Unique restaurant identifier")


class RestaurantDetail(RestaurantBase):
    """Complete restaurant information."""
    
    id: int = Field(..., gt=0, description="Unique restaurant identifier")
    address: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1, max_length=500)


class MenuItem(BaseModel):
    """Individual menu item."""
    
    id: int = Field(..., gt=0, description="Unique menu item identifier")
    name: str = Field(..., min_length=1, max_length=100)
    description: str = Field(..., min_length=1, max_length=300)
    price: float = Field(..., ge=0.0, description="Item price (must be non-negative)")
    category: str = Field(..., min_length=1, max_length=50)
    
    @field_validator('price')
    @classmethod
    def validate_price(cls, v: float) -> float:
        """Ensure price is non-negative and has reasonable precision."""
        if v < 0:
            raise ValueError('Price must be non-negative')
        # Round to 2 decimal places for currency
        return round(v, 2)


class MenuResponse(BaseModel):
    """Menu grouped by categories."""
    
    restaurant_id: int = Field(..., gt=0, description="Restaurant identifier")
    categories: Dict[str, List[MenuItem]] = Field(
        ..., 
        description="Menu items organized by category"
    )


class ErrorResponse(BaseModel):
    """Standard error response format."""
    
    detail: Union[str, List[Dict[str, Any]]] = Field(
        ..., 
        description="Error message or validation error details"
    )
