import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { favoriteService } from '../services/favoriteService';

interface Lodging {
  id: string;
  name: string;
  title?: string;
  city?: string;
  price: number;
  images?: string[];
  amenities?: string[];
  location?: {
    city: string;
  };
  rating: number;
}

export const FavoritesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Lodging[]>([]);
  const [loading, setLoading] = useState(false);
  const [imageIndexes, setImageIndexes] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchFavorites();
    }
  }, [user, navigate]);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const data = await favoriteService.getUserFavorites();
      setFavorites(data);
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (lodgingId: string) => {
    try {
      await favoriteService.removeFavorite(lodgingId);
      setFavorites(favorites.filter(l => l.id !== lodgingId));
    } catch (error) {
      console.error('Failed to remove favorite:', error);
      alert('Failed to remove from favorites');
    }
  };

  const handleViewDetails = (lodgingId: string) => {
    navigate(`/lodging/${lodgingId}`);
  };

  return (
    <div className="min-h-screen bg-cover bg-center md:bg-fixed bg-scroll" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80")'}}>
      <div className="min-h-screen bg-black bg-opacity-60 pt-24 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-white mb-2">My Favorites</h1>
          <p className="text-gray-300 mb-8">Saved lodgings for later</p>

          {loading ? (
            <div className="text-center text-gray-300">Loading favorites...</div>
          ) : favorites.length === 0 ? (
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl border border-white border-opacity-20 p-12 text-center">
              <p className="text-gray-300 text-lg mb-4">No favorites yet</p>
              <button
                onClick={() => navigate('/search')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold transition-all"
              >
                Browse Lodgings
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((lodging) => {
                const currentImageIndex = imageIndexes[lodging.id] || 0;
                const images = lodging.images || [];
                const currentImage = images[currentImageIndex];
                const hasMultipleImages = images.length > 1;

                return (
                  <div
                    key={lodging.id}
                    className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl border border-white border-opacity-20 overflow-hidden hover:bg-opacity-20 transition-all"
                  >
                    {currentImage && (
                      <div className="relative w-full h-48 bg-gray-900">
                        <img
                          src={currentImage}
                          alt={lodging.title || lodging.name}
                          className="w-full h-full object-cover"
                          crossOrigin="anonymous"
                        />
                        {hasMultipleImages && (
                          <>
                            <button
                              onClick={() => setImageIndexes({
                                ...imageIndexes,
                                [lodging.id]: (currentImageIndex - 1 + images.length) % images.length
                              })}
                              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                            >
                              ◀
                            </button>
                            <button
                              onClick={() => setImageIndexes({
                                ...imageIndexes,
                                [lodging.id]: (currentImageIndex + 1) % images.length
                              })}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
                            >
                              ▶
                            </button>
                            <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                              {currentImageIndex + 1}/{images.length}
                            </div>
                          </>
                        )}
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="text-white font-semibold mb-2">{lodging.title || lodging.name}</h3>
                      <p className="text-gray-300 text-sm mb-3">{lodging.location?.city || lodging.city || 'N/A'}</p>
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-blue-400 font-semibold">K{lodging.price}/night</p>
                        {lodging.rating > 0 && (
                          <p className="text-yellow-400 text-sm">⭐ {lodging.rating.toFixed(1)}</p>
                        )}
                      </div>
                      {lodging.amenities && (
                        <div className="mb-4 flex flex-wrap gap-2">
                          {lodging.amenities.slice(0, 3).map((amenity, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-blue-500 bg-opacity-20 text-blue-300 px-2 py-1 rounded border border-blue-400 border-opacity-50"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(lodging.id)}
                          className="flex-1 bg-blue-500 bg-opacity-20 text-blue-300 hover:bg-opacity-40 py-2 rounded border border-blue-400 border-opacity-50 transition-all"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleRemoveFavorite(lodging.id)}
                          className="flex-1 bg-red-500 bg-opacity-20 text-red-300 hover:bg-opacity-40 py-2 rounded border border-red-400 border-opacity-50 transition-all"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
