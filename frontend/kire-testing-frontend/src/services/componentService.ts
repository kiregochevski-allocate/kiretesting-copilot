import apiClient from './apiClient';
import type { Component } from '../models/types';

const RESOURCE_URL = '/components';

export const ComponentService = {
  getAll: async (): Promise<Component[]> => {
    const response = await apiClient.get<Component[]>(RESOURCE_URL);
    return response.data;
  },
  
  getById: async (id: number): Promise<Component> => {
    const response = await apiClient.get<Component>(`${RESOURCE_URL}/${id}`);
    return response.data;
  },
  
  getByProduct: async (productId: number): Promise<Component[]> => {
    const response = await apiClient.get<Component[]>(`${RESOURCE_URL}/product/${productId}`);
    return response.data;
  },
  
  create: async (component: Omit<Component, 'id'>): Promise<Component> => {
    const response = await apiClient.post<Component>(RESOURCE_URL, component);
    return response.data;
  },
  
  update: async (id: number, component: Component): Promise<Component> => {
    const response = await apiClient.put<Component>(`${RESOURCE_URL}/${id}`, component);
    return response.data;
  },
  
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`${RESOURCE_URL}/${id}`);
  }
};

