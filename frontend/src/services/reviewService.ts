import apiClient from './api';
import { Review } from '../types';

export const reviewService = {
  createReview: async (data: Omit<Review, 'id' | 'createdAt' | 'sentiment' | 'sentimentScore'>): Promise<Review> => {
    const response = await apiClient.post('/reviews', data);
    return response.data.data || response.data;
  },

  getReview: async (id: string): Promise<Review> => {
    const response = await apiClient.get(`/reviews/${id}`);
    return response.data.data || response.data;
  },

  getLodgingReviews: async (lodgingId: string): Promise<Review[]> => {
    const response = await apiClient.get(`/reviews/lodging/${lodgingId}`);
    return response.data.data || response.data || [];
  },

  getUserReviews: async (userId: string): Promise<Review[]> => {
    const response = await apiClient.get(`/reviews/user/${userId}`);
    return response.data.data || response.data || [];
  },

  updateReview: async (id: string, data: Partial<Review>): Promise<Review> => {
    const response = await apiClient.put(`/reviews/${id}`, data);
    return response.data.data || response.data;
  },

  deleteReview: async (id: string): Promise<void> => {
    await apiClient.delete(`/reviews/${id}`);
  },
};
