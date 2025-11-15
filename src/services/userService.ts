import api from './api';
import type { User } from '../types';

export const userService = {
  async getUserByEmail(email: string): Promise<User> {
    const response = await api.get<User>('/users', {
      params: { email },
    });
    return response.data;
  },

  async createUser(email: string, ingredients: {
    ingredientsInDB: number[];
    ingredientsNotInDB: string[];
  }): Promise<void> {
    await api.post('/users', {
      userEmail: email,
      ingredients,
    });
  },
};

