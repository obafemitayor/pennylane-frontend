import { useState, useCallback } from 'react';
import type { AxiosError } from 'axios';
import { userService } from '../services/userService';
import type { User } from '../types';

export const useUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserByEmail = useCallback(async (email: string) => {
    setLoading(true);
    setError(null);

    try {
      const userData = await userService.getUserByEmail(email);
      setUser(userData);
      return userData;
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ error?: string }>;
      const errorMessage = axiosError.response?.data?.error || 'Failed to fetch user';
      setError(errorMessage);
      if (axiosError.response?.status === 404) {
        return null;
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    error,
    fetchUserByEmail,
  };
};
