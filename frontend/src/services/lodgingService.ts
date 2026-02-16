import apiClient from './api';
import { Lodging } from '../types';

export const lodgingService = {
  getLodgings: async (filters?: {
    city?: string;
    minPrice?: number;
    maxPrice?: number;
    amenities?: string[];
    limit?: number;
    offset?: number;
  }): Promise<{ lodgings: Lodging[]; total: number }> => {
    const response = await apiClient.get('/lodgings', { params: filters });
    return response.data.data || response.data;
  },

  getLodgingById: async (id: string): Promise<Lodging> => {
    const response = await apiClient.get(`/lodgings/${id}`);
    return response.data.data || response.data;
  },

  createLodging: async (data: Omit<Lodging, 'id' | 'createdAt'>): Promise<Lodging> => {
    const response = await apiClient.post('/lodgings', data);
    return response.data.data || response.data;
  },

  updateLodging: async (id: string, updates: Partial<Lodging>): Promise<Lodging> => {
    const response = await apiClient.put(`/lodgings/${id}`, updates);
    return response.data.data || response.data;
  },

  searchLodgings: async (query: string): Promise<Lodging[]> => {
    const response = await apiClient.get('/lodgings/search', { params: { q: query } });
    return response.data.data || response.data || [];
  },
};
