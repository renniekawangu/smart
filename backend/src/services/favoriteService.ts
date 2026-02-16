import { FavoriteModel } from '../models/Favorite';

export const favoriteService = {
  // Add to favorites
  addFavorite: async (userId: string, lodgingId: string): Promise<boolean> => {
    try {
      await FavoriteModel.create({ userId, lodgingId });
      return true;
    } catch (error: any) {
      // Ignore duplicate key error
      if (error.code === 11000) {
        return false; // Already favorited
      }
      throw error;
    }
  },

  // Remove from favorites
  removeFavorite: async (userId: string, lodgingId: string): Promise<boolean> => {
    const result = await FavoriteModel.deleteOne({ userId, lodgingId });
    return result.deletedCount > 0;
  },

  // Get user's favorites
  getUserFavorites: async (userId: string): Promise<string[]> => {
    const favorites = await FavoriteModel.find({ userId }).select('lodgingId');
    return favorites.map(f => f.lodgingId);
  },

  // Check if lodging is favorited
  isFavorite: async (userId: string, lodgingId: string): Promise<boolean> => {
    const count = await FavoriteModel.countDocuments({ userId, lodgingId });
    return count > 0;
  },

  // Get favorite count for lodging
  getFavoriteCount: async (lodgingId: string): Promise<number> => {
    return await FavoriteModel.countDocuments({ lodgingId });
  },
};
