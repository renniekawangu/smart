import apiClient from './api';
import { AuthPayload, AuthResponse, User } from '../types';

export const authService = {
  register: async (data: AuthPayload & { name: string }): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', data);
    const { data: responseData } = response;
    // Response is { success: true, data: { user, token } }
    const token = responseData.data?.token;
    if (token) {
      localStorage.setItem('auth_token', token);
    }
    return responseData.data || {};
  },

  login: async (data: AuthPayload): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', data);
    const { data: responseData } = response;
    console.log('🔐 Login response:', responseData);
    // Response is { success: true, data: { user, token } }
    const token = responseData.data?.token;
    console.log('🔐 Token in response:', token);
    if (token) {
      localStorage.setItem('auth_token', token);
      console.log('✓ Token saved to localStorage');
    } else {
      console.warn('⚠️ No token in login response');
    }
    return responseData.data || {};
  },

  logout: (): void => {
    localStorage.removeItem('auth_token');
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await apiClient.get('/auth/me');
    return response.data.data || response.data;
  },

  updateProfile: async (userId: string, updates: Partial<User>): Promise<User> => {
    const response = await apiClient.put(`/auth/users/${userId}`, updates);
    return response.data.data || response.data;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('auth_token');
  },
};
