import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const searchService = {
  // Advanced search with filters
  searchLodgings: async (filters: {
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    amenities?: string[];
    minRating?: number;
    startDate?: string;
    endDate?: string;
    numberOfGuests?: number;
  }) => {
    const params = new URLSearchParams();
    if (filters.location) params.append('location', filters.location);
    if (filters.minPrice !== undefined) params.append('minPrice', String(filters.minPrice));
    if (filters.maxPrice !== undefined) params.append('maxPrice', String(filters.maxPrice));
    if (filters.minRating !== undefined) params.append('minRating', String(filters.minRating));
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.numberOfGuests) params.append('numberOfGuests', String(filters.numberOfGuests));
    if (filters.amenities && filters.amenities.length > 0) {
      filters.amenities.forEach(a => params.append('amenities', a));
    }

    const response = await apiClient.get(`/api/search?${params.toString()}`);
    return response.data.data;
  },

  // Save a search
  saveSearch: async (name: string, filters: any) => {
    const response = await apiClient.post('/api/search/save', { name, filters });
    return response.data.data;
  },

  // Get saved searches
  getSavedSearches: async () => {
    const response = await apiClient.get('/api/search/saved');
    return response.data.data;
  },

  // Get saved search by ID
  getSavedSearchById: async (searchId: string) => {
    const response = await apiClient.get(`/api/search/saved/${searchId}`);
    return response.data.data;
  },

  // Delete saved search
  deleteSavedSearch: async (searchId: string) => {
    const response = await apiClient.delete(`/api/search/saved/${searchId}`);
    return response.data.data;
  },
};
