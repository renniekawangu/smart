import { Request, Response } from 'express';
import { searchService } from '../services/searchService';
import { successResponse, errorResponse } from '../utils/response';

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

      // Handle amenities - ensure it's an array of strings
      let amenitiesArray: string[] = [];
      if (amenities) {
        if (Array.isArray(amenities)) {
          amenitiesArray = amenities.filter(a => typeof a === 'string') as string[];
        } else if (typeof amenities === 'string') {
          amenitiesArray = [amenities];
        }
      }

      const filters = {
        location: location ? String(location) : undefined,
        minPrice: minPrice ? parseFloat(String(minPrice)) : undefined,
        maxPrice: maxPrice ? parseFloat(String(maxPrice)) : undefined,
        amenities: amenitiesArray.length > 0 ? amenitiesArray : undefined,
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
      res.status(200).json(successResponse(results, 'Search completed'));
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json(errorResponse('Search failed'));
    }
  },

  // Save a search
  saveSearch: async (req: Request, res: Response) => {
    try {
      const { name, filters } = req.body;
      const userId = (req as any).userId;

      if (!name || !filters) {
        res.status(400).json(errorResponse('Name and filters required'));
        return;
      }

      const savedSearch = await searchService.saveSearch(userId, name, filters);
      res.status(201).json(successResponse(savedSearch, 'Search saved'));
    } catch (error) {
      console.error('Save search error:', error);
      res.status(500).json(errorResponse('Failed to save search'));
    }
  },

  // Get saved searches
  getSavedSearches: async (req: Request, res: Response) => {
    try {
      const userId = (req as any).userId;
      const searches = await searchService.getSavedSearches(userId);
      res.status(200).json(successResponse(searches, 'Saved searches retrieved'));
    } catch (error) {
      console.error('Get saved searches error:', error);
      res.status(500).json(errorResponse('Failed to get saved searches'));
    }
  },

  // Delete saved search
  deleteSavedSearch: async (req: Request, res: Response) => {
    try {
      const { searchId } = req.params;
      const userId = (req as any).userId;

      const search = await searchService.getSavedSearchById(searchId);
      if (!search || search.userId !== userId) {
        res.status(404).json(errorResponse('Search not found'));
        return;
      }

      await searchService.deleteSavedSearch(searchId);
      res.status(200).json(successResponse({}, 'Search deleted'));
    } catch (error) {
      console.error('Delete search error:', error);
      res.status(500).json(errorResponse('Failed to delete search'));
    }
  },

  // Get search by ID
  getSavedSearchById: async (req: Request, res: Response) => {
    try {
      const { searchId } = req.params;
      const search = await searchService.getSavedSearchById(searchId);
      if (!search) {
        res.status(404).json(errorResponse('Search not found'));
        return;
      }
      res.status(200).json(successResponse(search, 'Search retrieved'));
    } catch (error) {
      console.error('Get search error:', error);
      res.status(500).json(errorResponse('Failed to get search'));
    }
  },
};
