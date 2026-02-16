import React, { useState, useEffect } from 'react';
import { searchService } from '../services/searchService';

interface SavedSearch {
  _id: string;
  name: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  amenities?: string[];
  minRating?: number;
}

interface SavedSearchesProps {
  onLoadSearch: (search: any) => void;
  onSearchApplied?: () => void;
}

export const SavedSearches: React.FC<SavedSearchesProps> = ({ onLoadSearch, onSearchApplied }) => {
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(false);
  const [showNewSearch, setShowNewSearch] = useState(false);
  const [newSearchName, setNewSearchName] = useState('');
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    loadSavedSearches();
  }, []);

  const loadSavedSearches = async () => {
    try {
      setLoading(true);
      const data = await searchService.getSavedSearches();
      setSearches(data);
    } catch (error) {
      console.error('Failed to load saved searches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSearch = async (searchId: string) => {
    if (confirm('Delete this saved search?')) {
      try {
        await searchService.deleteSavedSearch(searchId);
        await loadSavedSearches();
      } catch (error) {
        console.error('Failed to delete search:', error);
        alert('Failed to delete search');
      }
    }
  };

  const handleLoadSearch = (search: SavedSearch) => {
    onLoadSearch({
      location: search.location || '',
      minPrice: search.minPrice || '',
      maxPrice: search.maxPrice || '',
      amenities: search.amenities || [],
      minRating: search.minRating || '',
    });
    onSearchApplied?.();
  };

  const getSummary = (search: SavedSearch): string => {
    const parts = [];
    if (search.location) parts.push(search.location);
    if (search.minPrice) parts.push(`$${search.minPrice}+`);
    if (search.maxPrice) parts.push(`up to $${search.maxPrice}`);
    if (search.amenities?.length) parts.push(`${search.amenities.length} amenities`);
    if (search.minRating) parts.push(`${search.minRating}+ stars`);
    return parts.join(' • ') || 'No filters';
  };

  if (!searches.length && !showNewSearch) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-gray-800">Saved Searches</span>
          {searches.length > 0 && (
            <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1">
              {searches.length}
            </span>
          )}
        </div>
        <span className={`text-2xl transition-transform ${expanded ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {expanded && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 space-y-3">
          {searches.map(search => (
            <div
              key={search._id}
              className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-md hover:border-blue-400 transition-colors"
            >
              <div className="flex-1 cursor-pointer" onClick={() => handleLoadSearch(search)}>
                <p className="font-medium text-gray-800">{search.name}</p>
                <p className="text-sm text-gray-600">{getSummary(search)}</p>
              </div>
              <button
                onClick={() => handleDeleteSearch(search._id)}
                className="ml-3 text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Delete
              </button>
            </div>
          ))}

          {searches.length > 0 && (
            <button
              onClick={() => setShowNewSearch(!showNewSearch)}
              className="w-full py-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              {showNewSearch ? 'Cancel' : 'Save New Search'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
