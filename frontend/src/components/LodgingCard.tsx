import React, { useState } from 'react';
import { Lodging } from '../types';
import { favoriteService } from '../services/favoriteService';
import { useAuth } from '../hooks/useAuth';

interface LodgingCardProps {
  lodging: Lodging;
  onSelect: (lodging: Lodging) => void;
}

export const LodgingCard: React.FC<LodgingCardProps> = ({ lodging, onSelect }) => {
  const { isAuthenticated } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      alert('Please login to add favorites');
      return;
    }

    try {
      if (isFavorited) {
        await favoriteService.removeFavorite(lodging.id);
      } else {
        await favoriteService.addFavorite(lodging.id);
      }
      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error('Failed to update favorite:', error);
    }
  };

  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg border border-white border-opacity-20 overflow-hidden hover:border-opacity-40 transition p-4 cursor-pointer relative" onClick={() => onSelect(lodging)}>
      <button
        onClick={handleFavoriteClick}
        className={`absolute top-3 right-3 z-10 text-2xl transition-all ${
          isFavorited ? 'text-red-500' : 'text-white text-opacity-50 hover:text-opacity-100'
        }`}
      >
        ♥
      </button>
      <div className="mb-3 bg-white bg-opacity-10 rounded h-40 flex items-center justify-center overflow-hidden">
        {lodging.images && lodging.images.length > 0 ? (
          <img 
            src={lodging.images[0]} 
            alt={lodging.name} 
            className="w-full h-full object-cover rounded"
            crossOrigin="anonymous"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80';
            }}
          />
        ) : (
          <div className="text-white text-opacity-50 text-sm">No image available</div>
        )}
      </div>
      <h3 className="text-lg font-bold mb-2 text-white">{lodging.name}</h3>
      <p className="text-sm text-white text-opacity-70 mb-2">{lodging.location.city}</p>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xl font-bold text-blue-200">K{lodging.price}</span>
        <span className="text-sm bg-yellow-500 bg-opacity-80 px-2 py-1 rounded text-white font-medium">⭐ {lodging.rating}</span>
      </div>
      {lodging.sentimentScore !== undefined && (
        <p className="text-xs text-white text-opacity-70">Sentiment: {(lodging.sentimentScore * 100).toFixed(0)}%</p>
      )}
      <div className="mt-2">
        <p className="text-xs text-white text-opacity-70">Amenities: {lodging.amenities.slice(0, 2).join(', ')}</p>
      </div>
    </div>
  );
};
