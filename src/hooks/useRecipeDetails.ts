import { useState, useCallback } from 'react';
import type { AxiosError } from 'axios';
import { recipeService } from '../services/recipeService';
import type { RecipeDetails } from '../types';

export const useRecipeDetails = () => {
  const [recipe, setRecipe] = useState<RecipeDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getRecipeDetails = useCallback(async (userId: number, recipeId: number) => {
    setLoading(true);
    setError(null);

    try {
      const recipeData = await recipeService.getRecipeDetails(userId, recipeId);
      setRecipe(recipeData);
    } catch (err) {
      const axiosError = err as AxiosError<{ error?: string }>;
      setError(axiosError.response?.data?.error || 'Failed to fetch recipe details');
      setRecipe(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    recipe,
    loading,
    error,
    getRecipeDetails,
  };
};
