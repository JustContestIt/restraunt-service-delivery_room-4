/**
 * API Client for Restaurant Backend
 * 
 * This module provides functions to interact with the FastAPI backend.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Backend API Types
 */
export interface BackendRestaurant {
  id: number;
  name: string;
  cuisine: string;
  price_range: number;
  rating: number;
  address?: string;
  description?: string;
}

export interface BackendMenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
}

export interface BackendMenuResponse {
  restaurant_id: number;
  categories: Record<string, BackendMenuItem[]>;
}

/**
 * Fetch all restaurants with optional filters
 */
export async function fetchRestaurants(
  cuisine?: string,
  maxPrice?: number
): Promise<BackendRestaurant[]> {
  const params = new URLSearchParams();
  if (cuisine && cuisine !== 'All') {
    params.append('cuisine', cuisine);
  }
  if (maxPrice) {
    params.append('max_price', maxPrice.toString());
  }

  const url = `${API_BASE_URL}/api/restaurants${params.toString() ? '?' + params.toString() : ''}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch restaurants: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Fetch a single restaurant by ID
 */
export async function fetchRestaurantById(id: number): Promise<BackendRestaurant> {
  const response = await fetch(`${API_BASE_URL}/api/restaurants/${id}`);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Restaurant not found');
    }
    throw new Error(`Failed to fetch restaurant: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Fetch menu for a specific restaurant
 */
export async function fetchRestaurantMenu(id: number): Promise<BackendMenuResponse> {
  const response = await fetch(`${API_BASE_URL}/api/restaurants/${id}/menu`);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Restaurant not found');
    }
    throw new Error(`Failed to fetch menu: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Fetch all available cuisines
 */
export async function fetchCuisines(): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/api/cuisines`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch cuisines: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * Check API health
 */
export async function checkHealth(): Promise<{ status: string }> {
  const response = await fetch(`${API_BASE_URL}/health`);
  
  if (!response.ok) {
    throw new Error('API is not healthy');
  }
  
  return response.json();
}
