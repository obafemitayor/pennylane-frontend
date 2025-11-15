import api from './api';
import type { IngredientsResponse } from '../types';

export const ingredientService = {
  async getIngredients(params: {
    query?: string;
    pageSize?: number;
    nextCursor?: number;
    previousCursor?: number;
  }): Promise<IngredientsResponse> {
    const response = await api.get<IngredientsResponse>('/ingredients', {
      params: {
        query: params.query,
        pageSize: params.pageSize,
        nextCursor: params.nextCursor,
        previousCursor: params.previousCursor,
      },
    });
    return response.data;
  },
};

