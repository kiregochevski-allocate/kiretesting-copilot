import apiClient from './apiClient';
import type { Tenant } from '../models/types';

const RESOURCE_URL = '/tenants';

export const TenantService = {
  getAll: async (): Promise<Tenant[]> => {
    const response = await apiClient.get<Tenant[]>(RESOURCE_URL);
    return response.data;
  },
  
  getById: async (id: number): Promise<Tenant> => {
    const response = await apiClient.get<Tenant>(`${RESOURCE_URL}/${id}`);
    return response.data;
  },
  
  create: async (tenant: Omit<Tenant, 'id'>): Promise<Tenant> => {
    const response = await apiClient.post<Tenant>(RESOURCE_URL, tenant);
    return response.data;
  },
  
  update: async (id: number, tenant: Tenant): Promise<Tenant> => {
    const response = await apiClient.put<Tenant>(`${RESOURCE_URL}/${id}`, tenant);
    return response.data;
  },
  
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`${RESOURCE_URL}/${id}`);
  }
};
