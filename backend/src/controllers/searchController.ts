import { Request, Response } from 'express';
import { searchService } from '../services/searchService';
import { sendSuccess, sendError } from '../utils/response';

export const searchController = {
  // Advanced search with filters
  search: async (req: Request, res: Response) => {
    try {
      const {
        location,
        minPrice,
        maxPrice,
        amenities,
        minRating,
        startDate,
        endDate,
        numberOfGuests,
      } = req.query;

      const filters = {
        location: location ? String(location) : undefined,
        minPrice: minPrice ? parseFloat(String(minPrice)) : undefined,
        maxPrice: maxPrice ? parseFloat(String(maxPrice)) : undefined,
        amenities: amenities ? (Array.isArray(amenities) ? amenities : [amenities]) : undefined,
        minRating: minRating ? parseFloat(String(minRating)) : undefined,
        startDate: startDate ? String(startDate) : undefined,
        endDate: endDate ? String(endDate) : undefined,
        numberOfGuests: numberOfGuests ? parseInt(String(numberOfGuests)) : undefined,
      };

      // Remove undefined values
      Object.keys(filters).forEach(
        key => filters[key as keyof typeof filters] === undefined && delete filters[key as keyof typeof filters]
      );

      const results = await searchService.searchLodgings(filters);
      return sendSuccess(res, results, 'Search completed');
    } catch (error) {
      console.error('Search error:', error);
      return sendError(res, 'Search failed');
    }
  },

  // Save a search
  saveSearch: async (req: Request, res: Response) => {
    try {
      const { name, filters } = req.body;
      const userId = (req as any).userId;

      if (!name || !filters) {
        return sendError(res, 'Name and filters required', 400);
      }

      const savedSearch = await searchService.saveSearch(userId, name, filters);
      return sendSuccess(res, savedSearch, 'Search saved');
    } catch (error) {
      console.error('Save search error:', error);
      return sendError(res, 'Failed to save search');
    }
  },

  // Get saved searches
  getSavedSearches: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const searches = await searchService.getSavedSearches(userId);
      return sendSuccess(res, searches, 'Saved searches retrieved');
    } catch (error) {
      console.error('Get saved searches error:', error);
      return sendError(res, 'Failed to get saved searches');
    }
  },

  // Delete saved search
  deleteSavedSearch: async (req: Request, res: Response) => {
    try {
      const { searchId } = req.params;
      const userId = (req as any).userId;

      const search = await searchService.getSavedSearchById(searchId);
      if (!search || search.userId !== userId) {
        return sendError(res, 'Search not found', 404);
      }

      await searchService.deleteSavedSearch(searchId);
      return sendSuccess(res, {}, 'Search deleted');
    } catch (error) {
      console.error('Delete search error:', error);
      return sendError(res, 'Failed to delete search');
    }
  },

  // Get search by ID
  getSavedSearchById: async (req: Request, res: Response) => {
    try {
      const { searchId } = req.params;
      const search = await searchService.getSavedSearchById(searchId);
      if (!search) {
        return sendError(res, 'Search not found', 404);
      }
      return sendSuccess(res, search, 'Search retrieved');
    } catch (error) {
      console.error('Get search error:', error);
      return sendError(res, 'Failed to get search');
    }
  },
};
