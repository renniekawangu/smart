import React, { useState } from 'react';

interface FilterState {
  location: string;
  minPrice: string;
  maxPrice: string;
  amenities: string[];
  minRating: string;
  startDate: string;
  endDate: string;
  numberOfGuests: string;
}

interface AdvancedFiltersProps {
  onApplyFilters: (filters: Partial<FilterState>) => void;
  isLoading?: boolean;
  availableAmenities?: string[];
}

const COMMON_AMENITIES = [
  'WiFi',
  'Pool',
  'Kitchen',
  'Air Conditioning',
  'Heating',
  'Parking',
  'Washer',
  'Dryer',
  'TV',
  'Dishwasher',
];

export const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  onApplyFilters,
  isLoading = false,
  availableAmenities = COMMON_AMENITIES,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    location: '',
    minPrice: '',
    maxPrice: '',
    amenities: [],
    minRating: '',
    startDate: '',
    endDate: '',
    numberOfGuests: '',
  });

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, location: e.target.value });
  };

  const handlePriceChange = (field: 'minPrice' | 'maxPrice', value: string) => {
    setFilters({ ...filters, [field]: value });
  };

  const handleAmenityToggle = (amenity: string) => {
    setFilters({
      ...filters,
      amenities: filters.amenities.includes(amenity)
        ? filters.amenities.filter(a => a !== amenity)
        : [...filters.amenities, amenity],
    });
  };

  const handleRatingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters({ ...filters, minRating: e.target.value });
  };

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    setFilters({ ...filters, [field]: value });
  };

  const handleGuestsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, numberOfGuests: e.target.value });
  };

  const handleApply = () => {
    const activeFilters: Partial<FilterState> = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value && (Array.isArray(value) ? value.length > 0 : true)) {
        activeFilters[key as keyof FilterState] = value;
      }
    });
    onApplyFilters(activeFilters);
  };

  const handleReset = () => {
    setFilters({
      location: '',
      minPrice: '',
      maxPrice: '',
      amenities: [],
      minRating: '',
      startDate: '',
      endDate: '',
      numberOfGuests: '',
    });
  };

  const activeFilterCount = Object.values(filters).filter(v =>
    Array.isArray(v) ? v.length > 0 : v !== ''
  ).length;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-6 py-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-gray-800">Advanced Filters</span>
          {activeFilterCount > 0 && (
            <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1">
              {activeFilterCount} active
            </span>
          )}
        </div>
        <span className={`text-2xl transition-transform ${expanded ? 'rotate-180' : ''}`}>▼</span>
      </button>

      {expanded && (
        <div className="px-6 py-6 border-t border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                placeholder="City or neighborhood"
                value={filters.location}
                onChange={handleLocationChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Price ($)</label>
              <input
                type="number"
                placeholder="Min"
                value={filters.minPrice}
                onChange={(e) => handlePriceChange('minPrice', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Price ($)</label>
              <input
                type="number"
                placeholder="Max"
                value={filters.maxPrice}
                onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Rating</label>
              <select
                value={filters.minRating}
                onChange={handleRatingChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any rating</option>
                <option value="4">4+ stars</option>
                <option value="4.5">4.5+ stars</option>
                <option value="5">5 stars</option>
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Check-in</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleDateChange('startDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Check-out</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleDateChange('endDate', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Guests</label>
              <input
                type="number"
                placeholder="Number of guests"
                min="1"
                value={filters.numberOfGuests}
                onChange={handleGuestsChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Amenities */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Amenities</label>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {availableAmenities.map(amenity => (
                <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.amenities.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{amenity}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={handleReset}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 font-medium hover:bg-gray-100 transition-colors"
            >
              Reset
            </button>
            <button
              onClick={handleApply}
              disabled={isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            >
              {isLoading ? 'Searching...' : 'Apply Filters'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
