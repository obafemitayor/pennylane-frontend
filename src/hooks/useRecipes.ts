import { useState, useCallback } from 'react';
import type { AxiosError } from 'axios';
import { recipeService } from '../services/recipeService';
import type { Recipe, RecipeFilters } from '../types';

export const useRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getMostRelevantRecipes = useCallback(async (userId: number, filters?: RecipeFilters) => {
    setLoading(true);
    setError(null);

    try {
      const recipesData = await recipeService.findMostRelevantRecipes(userId, filters);
      setRecipes(recipesData);
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ error?: string }>;
      setError(axiosError.response?.data?.error || 'Failed to fetch recipes');
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    recipes,
    loading,
    error,
    getMostRelevantRecipes,
  };
};
