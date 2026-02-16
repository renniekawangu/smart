import { apiClient } from './api';

export const favoriteService = {
  // Add to favorites
  addFavorite: async (lodgingId: string) => {
    const { data } = await apiClient.post('/favorites', { lodgingId });
    return data.data;
  },

  // Remove from favorites
  removeFavorite: async (lodgingId: string) => {
    const { data } = await apiClient.delete(`/favorites/${lodgingId}`);
    return data.data;
  },

  // Get user's favorites
  getUserFavorites: async () => {
    const { data } = await apiClient.get('/favorites');
    return data.data;
  },

  // Check if favorited
  checkFavorite: async (lodgingId: string) => {
    const { data } = await apiClient.get(`/favorites/check/${lodgingId}`);
    return data.data.isFavorite;
  },

  // Get favorite count
  getFavoriteCount: async (lodgingId: string) => {
    const { data } = await apiClient.get(`/favorites/count/${lodgingId}`);
    return data.data.count;
  },
};
