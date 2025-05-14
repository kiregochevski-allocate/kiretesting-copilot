import apiClient from './apiClient';
import type { Product } from '../models/types';

const RESOURCE_URL = '/products';

export const ProductService = {
  getAll: async (): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>(RESOURCE_URL);
    return response.data;
  },
  
  getById: async (id: number): Promise<Product> => {
    const response = await apiClient.get<Product>(`${RESOURCE_URL}/${id}`);
    return response.data;
  },
  
  getByTeam: async (teamId: number): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>(`${RESOURCE_URL}/team/${teamId}`);
    return response.data;
  },
  
  getByEnvironment: async (environmentId: number): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>(`${RESOURCE_URL}/environment/${environmentId}`);
    return response.data;
  },
  
  getByTenant: async (tenantId: number): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>(`${RESOURCE_URL}/tenant/${tenantId}`);
    return response.data;
  },
  
  getMultiTenantProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>(`${RESOURCE_URL}/multi-tenant`);
    return response.data;
  },
  
  getSingleTenantProducts: async (): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>(`${RESOURCE_URL}/single-tenant`);
    return response.data;
  },
  
  create: async (product: Omit<Product, 'id'>): Promise<Product> => {
    const response = await apiClient.post<Product>(RESOURCE_URL, product);
    return response.data;
  },
  
  update: async (id: number, product: Product): Promise<Product> => {
    const response = await apiClient.put<Product>(`${RESOURCE_URL}/${id}`, product);
    return response.data;
  },
  
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`${RESOURCE_URL}/${id}`);
  }
};

