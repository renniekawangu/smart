import apiClient from './api';
import { Booking, BookingStatus } from '../types';

export const bookingService = {
  createBooking: async (data: Omit<Booking, 'id' | 'createdAt' | 'status'>): Promise<Booking> => {
    const response = await apiClient.post('/bookings', data);
    return response.data.data || response.data;
  },

  getBooking: async (id: string): Promise<Booking> => {
    const response = await apiClient.get(`/bookings/${id}`);
    return response.data.data || response.data;
  },

  getUserBookings: async (userId: string): Promise<Booking[]> => {
    const response = await apiClient.get(`/bookings/user/${userId}`);
    return response.data.data || response.data || [];
  },

  updateBookingStatus: async (id: string, status: BookingStatus): Promise<Booking> => {
    const response = await apiClient.patch(`/bookings/${id}`, { status });
    return response.data.data || response.data;
  },

  cancelBooking: async (id: string): Promise<Booking> => {
    const response = await apiClient.patch(`/bookings/${id}/cancel`);
    return response.data.data || response.data;
  },

  checkAvailability: async (
    lodgingId: string,
    checkInDate: string,
    checkOutDate: string
  ): Promise<{ available: boolean }> => {
    const response = await apiClient.post('/bookings/check-availability', {
      lodgingId,
      checkInDate,
      checkOutDate,
    });
    return response.data.data || response.data;
  },
};
