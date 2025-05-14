import apiClient from './apiClient';
import type { Environment } from '../models/types';

const RESOURCE_URL = '/environments';

export const EnvironmentService = {
  getAll: async (): Promise<Environment[]> => {
    const response = await apiClient.get<Environment[]>(RESOURCE_URL);
    return response.data;
  },
  
  getById: async (id: number): Promise<Environment> => {
    const response = await apiClient.get<Environment>(`${RESOURCE_URL}/${id}`);
    return response.data;
  },
  
  create: async (environment: Omit<Environment, 'id'>): Promise<Environment> => {
    const response = await apiClient.post<Environment>(RESOURCE_URL, environment);
    return response.data;
  },
  
  update: async (id: number, environment: Environment): Promise<Environment> => {
    const response = await apiClient.put<Environment>(`${RESOURCE_URL}/${id}`, environment);
    return response.data;
  },
  
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`${RESOURCE_URL}/${id}`);
  }
};

