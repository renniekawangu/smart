import React, { useState } from 'react';
import { useLodgings } from '../hooks/useLodging';
import { LodgingCard } from '../components/LodgingCard';
import { Lodging } from '../types';
import { useNavigate } from 'react-router-dom';

export const SearchPage: React.FC = () => {
  const [filters, setFilters] = useState({
    city: '',
    minPrice: 0,
    maxPrice: 10000,
    amenities: [] as string[],
    limit: 20,
  });

  const { data: result, isLoading, error } = useLodgings(filters);
  const navigate = useNavigate();

  const handleLodgingSelect = (lodging: Lodging) => {
    navigate(`/lodgings/${lodging.id}`);
  };

  return (
    <div className="min-h-screen bg-cover bg-center md:bg-fixed bg-scroll" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80")'}}>
      <div className="min-h-screen bg-black bg-opacity-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-white">Find Your Perfect Stay</h1>

          {/* Filters */}
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg border border-white border-opacity-20 p-6 mb-8">
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
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {result?.lodgings?.map((lodging, index) => (
              <LodgingCard key={lodging.id || `lodging-${index}`} lodging={lodging} onSelect={handleLodgingSelect} />
            ))}
          </div>
        )}
        </div>
      </div>
    </div>
  );
};
