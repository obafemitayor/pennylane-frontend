import api from './api';

export interface Cuisine {
  id: number;
  name: string;
}

export interface CuisinesResponse {
  cuisines: Cuisine[];
}

export const cuisineService = {
  async getAllCuisines(): Promise<Cuisine[]> {
    const response = await api.get<CuisinesResponse>('/cuisines');
    return response.data.cuisines;
  },
};

