/**
 * Data Adapter
 * 
 * Converts backend API data to frontend types
 */

import { Restaurant, MenuItem, CuisineType } from '../types';
import { BackendRestaurant, BackendMenuItem, BackendMenuResponse } from './api';

/**
 * Convert backend restaurant to frontend restaurant
 */
export function adaptRestaurant(
  backendRestaurant: BackendRestaurant,
  menu?: BackendMenuResponse
): Restaurant {
  // Generate placeholder image based on cuisine
  const cuisineImages: Record<string, string> = {
    Italian: 'https://images.unsplash.com/photo-1595295333158-4742f28fbd85?w=400',
    Japanese: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400',
    Mexican: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400',
    Chinese: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=400',
    French: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=400',
    American: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400',
    Indian: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
    Thai: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400',
  };

  // Estimate delivery time based on price range
  const deliveryTimes = ['15-25 min', '20-30 min', '25-35 min', '30-40 min'];
  const deliveryTime = deliveryTimes[backendRestaurant.price_range - 1] || '25-35 min';

  return {
    id: backendRestaurant.id.toString(),
    name: backendRestaurant.name,
    cuisine: backendRestaurant.cuisine as CuisineType,
    rating: backendRestaurant.rating,
    deliveryTime,
    image: cuisineImages[backendRestaurant.cuisine] || cuisineImages.American,
    description: backendRestaurant.description || `Delicious ${backendRestaurant.cuisine} cuisine`,
    menu: menu ? adaptMenu(menu) : [],
  };
}

/**
 * Convert backend menu items to frontend menu items
 */
export function adaptMenu(backendMenu: BackendMenuResponse): MenuItem[] {
  const menuItems: MenuItem[] = [];
  
  // Flatten all categories into a single array
  Object.entries(backendMenu.categories).forEach(([category, items]) => {
    items.forEach((item) => {
      menuItems.push(adaptMenuItem(item, category));
    });
  });
  
  return menuItems;
}

/**
 * Convert backend menu item to frontend menu item
 */
export function adaptMenuItem(backendItem: BackendMenuItem, category: string): MenuItem {
  // Generate placeholder images based on category
  const categoryImages: Record<string, string> = {
    Appetizers: 'https://images.unsplash.com/photo-1541529086526-db283c563270?w=300',
    'Main Course': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300',
    Desserts: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=300',
    Beverages: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300',
  };

  return {
    id: backendItem.id.toString(),
    name: backendItem.name,
    description: backendItem.description,
    price: backendItem.price,
    image: categoryImages[category] || categoryImages['Main Course'],
    category: backendItem.category,
  };
}

/**
 * Convert backend cuisines to frontend cuisine types
 */
export function adaptCuisines(backendCuisines: string[]): CuisineType[] {
  const validCuisines: CuisineType[] = [
    'Italian',
    'Chinese',
    'Japanese',
    'Mexican',
    'American',
    'Indian',
    'Thai',
    'French',
  ];
  
  return backendCuisines.filter((cuisine): cuisine is CuisineType =>
    validCuisines.includes(cuisine as CuisineType)
  );
}
