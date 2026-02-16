import { lodgingService } from './index';
import { SavedSearchModel } from '../models/SavedSearch';

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
  }): Promise<any[]> => {
    const query: any = {};

    // Location filter
    if (filters.location && filters.location.trim()) {
      query.city = { $regex: filters.location, $options: 'i' };
    }

    // Price range filter
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      query.pricePerNight = {};
      if (filters.minPrice !== undefined) {
        query.pricePerNight.$gte = filters.minPrice;
      }
      if (filters.maxPrice !== undefined) {
        query.pricePerNight.$lte = filters.maxPrice;
      }
    }

    // Amenities filter - must have all selected amenities
    if (filters.amenities && filters.amenities.length > 0) {
      query.amenities = { $all: filters.amenities };
    }

    // Rating filter
    if (filters.minRating !== undefined) {
      query.rating = { $gte: filters.minRating };
    }

    // Get all matching lodgings
    const lodgings = await lodgingService.searchLodgings(query);

    // Filter by availability if dates provided
    if (filters.startDate && filters.endDate) {
      const availableLodgings = [];
      for (const lodging of lodgings) {
        const available = await lodgingService.checkAvailability(
          lodging.id || lodging._id,
          filters.startDate,
          filters.endDate
        );
        if (available) {
          availableLodgings.push(lodging);
        }
      }
      return availableLodgings;
    }

    return lodgings;
  },

  // Save a search
  saveSearch: async (
    userId: string,
    name: string,
    filters: any
  ): Promise<any> => {
    const savedSearch = new SavedSearchModel({
      userId,
      name,
      ...filters,
    });
    await savedSearch.save();
    return savedSearch.toObject();
  },

  // Get user's saved searches
  getSavedSearches: async (userId: string): Promise<any[]> => {
    const searches = await SavedSearchModel.find({ userId }).sort({ createdAt: -1 });
    return searches.map(s => s.toObject());
  },

  // Update saved search
  updateSavedSearch: async (searchId: string, filters: any): Promise<any> => {
    const updated = await SavedSearchModel.findByIdAndUpdate(
      searchId,
      filters,
      { new: true }
    );
    return updated?.toObject();
  },

  // Delete saved search
  deleteSavedSearch: async (searchId: string): Promise<boolean> => {
    const result = await SavedSearchModel.deleteOne({ _id: searchId });
    return result.deletedCount > 0;
  },

  // Get saved search by ID
  getSavedSearchById: async (searchId: string): Promise<any> => {
    const search = await SavedSearchModel.findById(searchId);
    return search?.toObject();
  },
};
