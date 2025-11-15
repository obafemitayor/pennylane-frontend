import { useState, useCallback, useRef } from 'react';
import type { AxiosError } from 'axios';
import { categoryService } from '../services/categoryService';
import type { Category, CategoriesParams } from '../types';

const DEBOUNCE_DELAY = 300;
const PAGE_SIZE = 50;

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchCategories = useCallback(async (query?: string, offset: number = 0) => {
    setLoading(true);
    setError(null);

    try {
      const params: CategoriesParams = {
        query: query || undefined,
        pageSize: PAGE_SIZE,
        offset,
      };
      const response = await categoryService.getCategories(params);
      setCategories(response.categories);
    } catch (err) {
      const axiosError = err as AxiosError<{ error?: string }>;
      setError(axiosError.response?.data?.error || 'Failed to fetch categories');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setCategories([]);
    setError(null);
  }, []);

  const searchCategories = useCallback(
    (query: string) => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (!query.trim()) {
        reset();
        return;
      }
      debounceTimeoutRef.current = setTimeout(() => {
        fetchCategories(query);
      }, DEBOUNCE_DELAY);
    },
    [fetchCategories, reset]
  );

  return {
    categories,
    loading,
    error,
    searchCategories,
    reset,
    fetchCategories,
  };
};
