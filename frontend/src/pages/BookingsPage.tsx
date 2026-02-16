import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useUserBookings } from '../hooks/useBooking';

export const BookingsPage: React.FC = () => {
  const { user } = useAuth();
  const { data: bookings = [], isLoading } = useUserBookings(user?.id || '');

  if (isLoading) {
    return <div className="text-center py-12 text-white">Loading bookings...</div>;
  }

  return (
    <div className="min-h-screen bg-cover bg-center md:bg-fixed bg-scroll" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1631049307264-da0ec9d70304?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2000&q=80")'}}>
      <div className="min-h-screen bg-black bg-opacity-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-white">My Bookings</h1>

          {bookings.length === 0 ? (
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg border border-white border-opacity-20 p-6 text-center">
              <p className="text-white text-opacity-90 mb-4">No bookings yet</p>
              <a href="/search" className="text-blue-200 hover:text-blue-100 transition-colors">Start booking now</a>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg border border-white border-opacity-20 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-white">Booking #{booking.id}</h3>
                      <p className="text-sm text-white text-opacity-80">{booking.checkInDate} to {booking.checkOutDate}</p>
                    </div>
                    <span className={`px-3 py-1 rounded text-sm font-medium ${
                      booking.status === 'confirmed' ? 'bg-green-500 bg-opacity-80 text-white' :
                      booking.status === 'cancelled' ? 'bg-red-500 bg-opacity-80 text-white' :
                      'bg-yellow-500 bg-opacity-80 text-white'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="text-xl font-bold text-blue-200">K{booking.totalPrice}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
