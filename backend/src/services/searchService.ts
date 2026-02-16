import { lodgingService, bookingService } from './index';
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
    // Use getAllLodgings from lodgingService with appropriate query
    const result = await lodgingService.getAllLodgings({
      city: filters.location,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      amenities: filters.amenities,
      limit: 100,
    });

    let lodgings = result.lodgings;

    // Filter by rating if specified
    if (filters.minRating !== undefined) {
      lodgings = lodgings.filter(l => (l.rating || 0) >= filters.minRating!);
    }

    // Filter by availability if dates provided
    if (filters.startDate && filters.endDate) {
      const availableLodgings = [];
      for (const lodging of lodgings) {
        const available = await bookingService.checkAvailability(
          String(lodging.id),
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
