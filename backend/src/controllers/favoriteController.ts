import { Response } from 'express';
import { favoriteService } from '../services/favoriteService';
import { lodgingService } from '../services/index';
import { successResponse, errorResponse } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';

export const favoriteController = {
  // Add lodging to favorites
  addFavorite: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.userId) {
        res.status(401).json(errorResponse('Not authenticated'));
        return;
      }

      const { lodgingId } = req.body;

      if (!lodgingId) {
        res.status(400).json(errorResponse('Lodging ID required'));
        return;
      }

      // Verify lodging exists
      const lodging = await lodgingService.getLodgingById(lodgingId);
      if (!lodging) {
        res.status(404).json(errorResponse('Lodging not found'));
        return;
      }

      const added = await favoriteService.addFavorite(req.userId, lodgingId);
      
      res.json(successResponse({
        message: added ? 'Added to favorites' : 'Already in favorites',
        isFavorite: true,
      }));
    } catch (error) {
      console.error('Error adding favorite:', error);
      res.status(500).json(errorResponse('Failed to add favorite'));
    }
  },

  // Remove lodging from favorites
  removeFavorite: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.userId) {
        res.status(401).json(errorResponse('Not authenticated'));
        return;
      }

      const { lodgingId } = req.params;

      if (!lodgingId) {
        res.status(400).json(errorResponse('Lodging ID required'));
        return;
      }

      const removed = await favoriteService.removeFavorite(req.userId, lodgingId);

      res.json(successResponse({
        message: removed ? 'Removed from favorites' : 'Not in favorites',
        isFavorite: false,
      }));
    } catch (error) {
      console.error('Error removing favorite:', error);
      res.status(500).json(errorResponse('Failed to remove favorite'));
    }
  },

  // Get user's favorites
  getUserFavorites: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.userId) {
        res.status(401).json(errorResponse('Not authenticated'));
        return;
      }

      const favoriteIds = await favoriteService.getUserFavorites(req.userId);
      
      // Fetch full lodging details
      const favorites = [];
      for (const lodgingId of favoriteIds) {
        const lodging = await lodgingService.getLodgingById(lodgingId);
        if (lodging) {
          favorites.push(lodging);
        }
      }

      res.json(successResponse(favorites));
    } catch (error) {
      console.error('Error fetching favorites:', error);
      res.status(500).json(errorResponse('Failed to fetch favorites'));
    }
  },

  // Check if lodging is favorited
  checkFavorite: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.userId) {
        res.status(401).json(errorResponse('Not authenticated'));
        return;
      }

      const { lodgingId } = req.params;

      if (!lodgingId) {
        res.status(400).json(errorResponse('Lodging ID required'));
        return;
      }

      const isFavorite = await favoriteService.isFavorite(req.userId, lodgingId);

      res.json(successResponse({ isFavorite }));
    } catch (error) {
      console.error('Error checking favorite:', error);
      res.status(500).json(errorResponse('Failed to check favorite'));
    }
  },

  // Get favorite count for a lodging
  getFavoriteCount: async (req: Response): Promise<void> => {
    try {
      const { lodgingId } = req.params;

      if (!lodgingId) {
        res.status(400).json(errorResponse('Lodging ID required'));
        return;
      }

      const count = await favoriteService.getFavoriteCount(lodgingId);

      res.json(successResponse({ count }));
    } catch (error) {
      console.error('Error getting favorite count:', error);
      res.status(500).json(errorResponse('Failed to get favorite count'));
    }
  },
};
