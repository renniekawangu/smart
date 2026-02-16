import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingService } from '../services/bookingService';
import { Booking, BookingStatus } from '../types';

export const useUserBookings = (userId: string) => {
  return useQuery({
    queryKey: ['bookings', userId],
    queryFn: () => bookingService.getUserBookings(userId),
    enabled: !!userId,
  });
};

export const useBooking = (bookingId: string) => {
  return useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => bookingService.getBooking(bookingId),
    enabled: !!bookingId,
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => bookingService.createBooking(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};

export const useCancelBooking = (bookingId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => bookingService.cancelBooking(bookingId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking', bookingId] });
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
};

export const useCheckAvailability = () => {
  return useMutation({
    mutationFn: ({ lodgingId, checkInDate, checkOutDate }: any) =>
      bookingService.checkAvailability(lodgingId, checkInDate, checkOutDate),
  });
};
