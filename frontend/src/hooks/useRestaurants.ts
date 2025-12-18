/**
 * useRestaurants Hook
 * 
 * Custom hook for fetching and managing restaurant data from the backend API
 */

import { useState, useEffect } from 'react';
import { Restaurant, CuisineType } from '../types';
import { fetchRestaurants, fetchRestaurantById, fetchRestaurantMenu } from '../services/api';
import { adaptRestaurant } from '../services/dataAdapter';

interface UseRestaurantsResult {
  restaurants: Restaurant[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook to fetch restaurants with optional filters
 */
export function useRestaurants(
  cuisine?: CuisineType | 'All',
  maxPrice?: number
): UseRestaurantsResult {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const cuisineFilter = cuisine === 'All' ? undefined : cuisine;
      const backendRestaurants = await fetchRestaurants(cuisineFilter, maxPrice);

      // Convert backend data to frontend format
      const adaptedRestaurants = backendRestaurants.map((restaurant) =>
        adaptRestaurant(restaurant)
      );

      setRestaurants(adaptedRestaurants);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch restaurants');
      console.error('Error fetching restaurants:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [cuisine, maxPrice]);

  return {
    restaurants,
    loading,
    error,
    refetch: fetchData,
  };
}

interface UseRestaurantMenuResult {
  restaurant: Restaurant | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook to fetch a single restaurant with its menu
 */
export function useRestaurantMenu(restaurantId: number | null): UseRestaurantMenuResult {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!restaurantId) {
      setRestaurant(null);
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch restaurant details and menu in parallel
        const [backendRestaurant, menuData] = await Promise.all([
          fetchRestaurantById(restaurantId),
          fetchRestaurantMenu(restaurantId),
        ]);

        const adaptedRestaurant = adaptRestaurant(backendRestaurant, menuData);
        setRestaurant(adaptedRestaurant);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch restaurant menu');
        console.error('Error fetching restaurant menu:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [restaurantId]);

  return {
    restaurant,
    loading,
    error,
  };
}
