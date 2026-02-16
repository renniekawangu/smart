import React, { useState } from 'react';
import { useLodgings } from '../hooks/useLodging';
import { LodgingCard } from '../components/LodgingCard';
import { AdvancedFilters } from '../components/AdvancedFilters';
import { SavedSearches } from '../components/SavedSearches';
import { searchService } from '../services/searchService';
import { Lodging } from '../types';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const SearchPage: React.FC = () => {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    city: '',
    minPrice: 0,
    maxPrice: 10000,
    amenities: [] as string[],
    limit: 20,
  });
  const [searchResults, setSearchResults] = useState<Lodging[]>([]);
  const [manualSearch, setManualSearch] = useState(false);
  const [saveSearchOpen, setSaveSearchOpen] = useState(false);
  const [searchName, setSearchName] = useState('');

  const { data: result, isLoading, error } = useLodgings(filters);
  const navigate = useNavigate();

  const handleApplyFilters = async (newFilters: any) => {
    try {
      const results = await searchService.searchLodgings(newFilters);
      setSearchResults(results);
      setManualSearch(true);
    } catch (error) {
      console.error('Search error:', error);
      alert('Search failed');
    }
  };

  const handleSaveSearch = async () => {
    if (!searchName.trim()) {
      alert('Please enter a search name');
      return;
    }

    try {
      await searchService.saveSearch(searchName, filters);
      alert('Search saved successfully!');
      setSearchName('');
      setSaveSearchOpen(false);
    } catch (error) {
      console.error('Failed to save search:', error);
      alert('Failed to save search');
    }
  };

  const handleLoadSearch = (loadedFilters: any) => {
    setFilters(prev => ({
      ...prev,
      ...loadedFilters,
    }));
    handleApplyFilters(loadedFilters);
  };

  const displayResults = manualSearch ? searchResults : result?.lodgings || [];

  const handleLodgingSelect = (lodging: Lodging) => {
    navigate(`/lodgings/${lodging.id}`);
  };

  return (
    <div className="min-h-screen bg-cover bg-center md:bg-fixed bg-scroll" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80")'}}>
      <div className="min-h-screen bg-black bg-opacity-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-white">Find Your Perfect Stay</h1>

          {/* Saved Searches */}
          {user && (
            <SavedSearches
              onLoadSearch={handleLoadSearch}
              onSearchApplied={() => window.scrollTo({ top: 400, behavior: 'smooth' })}
            />
          )}

          {/* Advanced Filters */}
          <AdvancedFilters
            onApplyFilters={handleApplyFilters}
            isLoading={isLoading}
          />

          {/* Save Current Search */}
          {user && manualSearch && (
            <div className="bg-blue-600 rounded-lg p-4 mb-6 flex items-center justify-between">
              <span className="text-white font-medium">Want to save this search?</span>
              <button
                onClick={() => setSaveSearchOpen(!saveSearchOpen)}
                className="bg-white text-blue-600 px-4 py-2 rounded font-medium hover:bg-blue-50"
              >
                Save Search
              </button>
            </div>
          )}

          {/* Save Search Form */}
          {saveSearchOpen && (
            <div className="bg-white rounded-lg p-4 mb-6 shadow-lg">
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Search name (e.g., Beach Vacation)"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSaveSearch}
                  className="bg-green-600 text-white px-6 py-2 rounded-md font-medium hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  onClick={() => { setSaveSearchOpen(false); setSearchName(''); }}
                  className="bg-gray-400 text-white px-6 py-2 rounded-md font-medium hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Old filters - hidden by default */}
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg border border-white border-opacity-20 p-6 mb-8 hidden">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-white">City</label>
              <input
                type="text"
                value={filters.city}
                onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                className="w-full px-3 py-2 border rounded bg-white bg-opacity-20 border-white border-opacity-30 text-white placeholder-white placeholder-opacity-50"
                placeholder="Enter city"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-white">Min Price</label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => setFilters({ ...filters, minPrice: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded bg-white bg-opacity-20 border-white border-opacity-30 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-white">Max Price</label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border rounded bg-white bg-opacity-20 border-white border-opacity-30 text-white"
              />
            </div>
            <div className="flex items-end">
              <button className="w-full bg-blue-600 bg-opacity-80 text-white py-2 rounded hover:bg-opacity-100 transition-all">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-white text-opacity-90">Loading lodgings...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-300">
            <p>Error loading lodgings</p>
          </div>
        ) : displayResults && displayResults.length > 0 ? (
          <>
            <p className="text-white mb-6">Found {displayResults.length} results</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayResults.map((lodging, index) => (
                <LodgingCard key={lodging.id || `lodging-${index}`} lodging={lodging} onSelect={handleLodgingSelect} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-white text-opacity-90">No lodgings found. Try adjusting your filters.</p>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};
