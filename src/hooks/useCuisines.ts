import { useState, useEffect, useCallback } from 'react';
import { cuisineService } from '../services/cuisineService';
import type { Cuisine } from '../services/cuisineService';

export const useCuisines = () => {
  const [cuisines, setCuisines] = useState<Cuisine[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCuisines = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cuisinesData = await cuisineService.getAllCuisines();
      setCuisines(cuisinesData);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch cuisines');
      setCuisines([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCuisines();
  }, [fetchCuisines]);

  return {
    cuisines,
    loading,
    error,
    fetchCuisines,
  };
};

