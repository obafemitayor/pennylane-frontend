import { useState, useCallback, useRef } from 'react';
import type { AxiosError } from 'axios';
import { ingredientService } from '../services/ingredientService';
import type { Ingredient, IngredientsResponse } from '../types';

type IngredientsParams = {
  query?: string;
  pageSize: number;
  nextCursor?: number;
};

const DEBOUNCE_DELAY = 300;
const PAGE_SIZE = 200;

export const useIngredients = () => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchIngredients = useCallback(async (query: string) => {
    setLoading(true);
    setError(null);

    try {
      const params: IngredientsParams = {
        query: query || undefined,
        pageSize: PAGE_SIZE,
      };
      const response: IngredientsResponse = await ingredientService.getIngredients(params);
      response.ingredients.push({
        id: null,
        name: `Add "${query}" as an ingredient`,
      });
      setIngredients(response.ingredients);
    } catch (err) {
      const axiosError = err as AxiosError<{ error?: string }>;
      setError(axiosError.response?.data?.error || 'Failed to fetch ingredients');
      setIngredients([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIngredients([]);
    setError(null);
  }, []);

  const searchIngredients = useCallback(
    (query: string) => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (!query.trim()) {
        reset();
        return;
      }
      debounceTimeoutRef.current = setTimeout(() => {
        fetchIngredients(query);
      }, DEBOUNCE_DELAY);
    },
    [fetchIngredients, reset]
  );

  return {
    ingredients,
    loading,
    error,
    searchIngredients,
    reset,
  };
};
