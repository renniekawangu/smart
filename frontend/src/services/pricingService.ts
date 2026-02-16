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

export const pricingService = {
  addSeasonalPrice: async (
    lodgingId: string,
    startDate: string,
    endDate: string,
    pricePerNight: number,
    name: string = 'Seasonal Rate'
  ) => {
    const response = await apiClient.post('/api/pricing', {
      lodgingId,
      startDate,
      endDate,
      pricePerNight,
      name,
    });
    return response.data.data;
  },

  getSeasonalPrices: async (lodgingId: string) => {
    const response = await apiClient.get('/api/pricing', {
      params: { lodgingId },
    });
    return response.data.data;
  },

  removeSeasonalPrice: async (pricingId: string) => {
    const response = await apiClient.delete(`/api/pricing/${pricingId}`);
    return response.data.data;
  },

  calculatePrice: async (
    lodgingId: string,
    startDate: string,
    endDate: string,
    basePrice: number
  ) => {
    const response = await apiClient.post('/api/pricing/calculate', {
      lodgingId,
      startDate,
      endDate,
      basePrice,
    });
    return response.data.data;
  },
};
