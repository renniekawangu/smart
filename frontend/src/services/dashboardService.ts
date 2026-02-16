import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const adminService = {
  getAllUsers: async () => {
    const response = await api.get('/admin/users');
    return response.data.data;
  },

  getUserById: async (userId: string) => {
    const response = await api.get(`/admin/users/${userId}`);
    return response.data.data;
  },

  updateUserRole: async (userId: string, role: string) => {
    const response = await api.put(`/admin/users/${userId}/role`, { role });
    return response.data.data;
  },

  deleteUser: async (userId: string) => {
    const response = await api.delete(`/admin/users/${userId}`);
    return response.data.data;
  },

  getAllLodgings: async () => {
    const response = await api.get('/admin/lodgings');
    return response.data.data;
  },

  createLodging: async (data: any) => {
    const response = await api.post('/admin/lodgings', data);
    return response.data.data;
  },

  updateLodging: async (lodgingId: string, data: any) => {
    const response = await api.put(`/admin/lodgings/${lodgingId}`, data);
    return response.data.data;
  },

  deleteLodging: async (lodgingId: string) => {
    const response = await api.delete(`/admin/lodgings/${lodgingId}`);
    return response.data.data;
  },

  getStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data.data;
  },
};

export const hostService = {
  getMyLodgings: async () => {
    const response = await api.get('/host/lodgings');
    return response.data.data;
  },

  createLodging: async (data: any) => {
    const response = await api.post('/host/lodgings', data);
    return response.data.data;
  },

  updateLodging: async (lodgingId: string, data: any) => {
    const response = await api.put(`/host/lodgings/${lodgingId}`, data);
    return response.data.data;
  },

  deleteLodging: async (lodgingId: string) => {
    const response = await api.delete(`/host/lodgings/${lodgingId}`);
    return response.data.data;
  },

  getMyBookings: async () => {
    const response = await api.get('/host/bookings');
    return response.data.data;
  },

  updateBookingStatus: async (bookingId: string, status: string) => {
    const response = await api.put(`/host/bookings/${bookingId}/status`, { status });
    return response.data.data;
  },

  getStats: async () => {
    const response = await api.get('/host/stats');
    return response.data.data;
  },
};
