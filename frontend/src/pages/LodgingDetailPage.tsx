import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLodging } from '../hooks/useLodging';
import { useReviews } from '../hooks/useReviews';
import { useCreateBooking } from '../hooks/useBooking';
import { ReviewList } from '../components/ReviewList';
import { ReviewForm } from '../components/ReviewForm';

export const LodgingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState(1);

  const { data: lodging, isLoading: isLoadingLodging } = useLodging(id || '');
  const { data: reviews = [], isLoading: isLoadingReviews } = useReviews(id || '');
  const { mutateAsync: createBooking, isPending: isBooking } = useCreateBooking();

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      const nights = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24);
      const totalPrice = (lodging?.price || 0) * nights;

      const booking = await createBooking({
        userId: '', // Will be set from auth context
        lodgingId: id,
        checkInDate,
        checkOutDate,
        numberOfGuests,
        totalPrice,
      });

      navigate('/bookings');
    } catch (error) {
      console.error('Booking failed:', error);
    }
  };

  if (isLoadingLodging) {
    return <div className="text-center py-12 text-white">Loading...</div>;
  }

  if (!lodging) {
    return <div className="text-center py-12 text-white">Lodging not found</div>;
  }

  return (
    <div className="min-h-screen bg-cover bg-center md:bg-fixed bg-scroll" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80")'}}>
      <div className="min-h-screen bg-black bg-opacity-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg border border-white border-opacity-20 p-6 mb-6">
            <h1 className="text-3xl font-bold mb-2 text-white">{lodging.name}</h1>
            <p className="text-white text-opacity-80 mb-4">{lodging.location.address}, {lodging.location.city}</p>
            <div className="flex items-center space-x-4 mb-4">
              <span className="text-2xl font-bold text-blue-200">K{lodging.price}/night</span>
              <span className="text-lg text-white">⭐ {lodging.rating} ({lodging.reviewCount} reviews)</span>
            </div>
          </div>

          {/* Images */}
          {lodging.images.length > 0 && (
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg border border-white border-opacity-20 p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {lodging.images.slice(0, 4).map((image, idx) => (
                  <img key={idx} src={image} alt={`Room ${idx}`} className="w-full h-64 object-cover rounded" />
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg border border-white border-opacity-20 p-6">
                <h2 className="text-xl font-bold mb-4 text-white">About</h2>
                <p className="text-white text-opacity-90">{lodging.description}</p>
              </div>

              <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg border border-white border-opacity-20 p-6">
                <h2 className="text-xl font-bold mb-4 text-white">Amenities</h2>
                <div className="grid grid-cols-2 gap-2">
                  {lodging.amenities.map((amenity, idx) => (
                    <span key={idx} className="bg-white bg-opacity-20 px-3 py-2 rounded text-sm text-white">✓ {amenity}</span>
                  ))}
                </div>
              </div>

              <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg border border-white border-opacity-20 p-6">
                {isLoadingReviews ? (
                  <p className="text-white">Loading reviews...</p>
                ) : (
                  <ReviewList reviews={reviews} />
                )}
              </div>

              <ReviewForm lodgingId={id || ''} />
            </div>

            {/* Booking Form */}
            <div className="lg:col-span-1">
              <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg border border-white border-opacity-20 p-6 sticky top-4">
                <h2 className="text-xl font-bold mb-4 text-white">Book Now</h2>
                <form onSubmit={handleBooking}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1 text-white">Check-in Date</label>
                    <input
                      type="date"
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="w-full px-3 py-2 border rounded bg-white bg-opacity-20 border-white border-opacity-30 text-white"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1 text-white">Check-out Date</label>
                    <input
                      type="date"
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="w-full px-3 py-2 border rounded bg-white bg-opacity-20 border-white border-opacity-30 text-white"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1 text-white">Guests</label>
                    <input
                      type="number"
                      value={numberOfGuests}
                      onChange={(e) => setNumberOfGuests(parseInt(e.target.value))}
                      className="w-full px-3 py-2 border rounded bg-white bg-opacity-20 border-white border-opacity-30 text-white"
                      min="1"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isBooking}
                    className="w-full bg-blue-600 bg-opacity-80 text-white py-2 rounded hover:bg-opacity-100 transition-all disabled:opacity-50"
                  >
                    {isBooking ? 'Booking...' : 'Book Now'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
