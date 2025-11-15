import { useState, useCallback } from 'react';
import type { AxiosError } from 'axios';
import { useIntl } from 'react-intl';
import { userIngredientService } from '../services/userIngredientService';
import type { UserIngredient, UpdateIngredientPayload } from '../types';

const DEFAULT_PAGE_SIZE = 10;

export const useUserIngredients = (userId: number | undefined) => {
  const intl = useIntl();
  const [ingredients, setIngredients] = useState<UserIngredient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [currentOffset, setCurrentOffset] = useState(0);

  const getUserIngredients = useCallback(
    async (offset: number = 0) => {
      if (!userId) {
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await userIngredientService.getUserIngredients(userId, {
          pageSize: DEFAULT_PAGE_SIZE,
          offset,
        });
        setIngredients(response.ingredients);
        setHasMore(response.has_more);
        setCurrentOffset(response.offset);
      } catch (err) {
        const axiosError = err as AxiosError<{ error?: string }>;
        setError(
          axiosError.response?.data?.error || intl.formatMessage({ id: 'pantry.failedToLoad' })
        );
      } finally {
        setLoading(false);
      }
    },
    [userId, intl]
  );

  const loadNextPage = useCallback(async () => {
    if (!hasMore || loading) {
      return;
    }
    const nextOffset = currentOffset + DEFAULT_PAGE_SIZE;
    await getUserIngredients(nextOffset);
  }, [currentOffset, hasMore, loading, getUserIngredients]);

  const loadPreviousPage = useCallback(async () => {
    if (currentOffset === 0 || loading) {
      return;
    }
    const prevOffset = Math.max(0, currentOffset - DEFAULT_PAGE_SIZE);
    await getUserIngredients(prevOffset);
  }, [currentOffset, loading, getUserIngredients]);

  const updateIngredient = async (ingredientId: number, ingredient: UpdateIngredientPayload) => {
    if (!userId) {
      return;
    }
    setLoading(true);
    try {
      await userIngredientService.updateIngredient(userId, ingredientId, ingredient);
    } catch (err) {
      const axiosError = err as AxiosError<{ error?: string }>;
      throw new Error(
        axiosError.response?.data?.error || intl.formatMessage({ id: 'pantry.failedToUpdate' })
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteIngredient = async (ingredientId: number) => {
    if (!userId) {
      return;
    }
    setLoading(true);
    try {
      await userIngredientService.removeIngredients(userId, [ingredientId]);
    } catch (err) {
      const axiosError = err as AxiosError<{ error?: string }>;
      throw new Error(
        axiosError.response?.data?.error || intl.formatMessage({ id: 'pantry.failedToDelete' })
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    ingredients,
    loading,
    error,
    hasMore,
    hasPrevious: currentOffset > 0,
    getUserIngredients,
    loadNextPage,
    loadPreviousPage,
    updateIngredient,
    deleteIngredient,
  };
};
