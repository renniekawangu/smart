import { Response } from 'express';
import { bookingService, userService, lodgingService } from '../services/index';
import { successResponse, errorResponse } from '../utils/response';
import { emailService } from '../utils/email';
import { AuthenticatedRequest } from '../middleware/auth';

export const paymentController = {
  // Record cash payment
  recordCashPayment: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.userId) {
        res.status(401).json(errorResponse('Not authenticated'));
        return;
      }

      const { bookingId, notes } = req.body;

      if (!bookingId) {
        res.status(400).json(errorResponse('Booking ID required'));
        return;
      }

      const booking = await bookingService.getBookingById(bookingId);

      if (!booking) {
        res.status(404).json(errorResponse('Booking not found'));
        return;
      }

      // Only host can record payment for their booking
      if (booking.hostId !== req.userId) {
        res.status(403).json(errorResponse('Unauthorized'));
        return;
      }

      // Update payment status
      const updated = await bookingService.updateBooking(bookingId, {
        paymentStatus: 'paid',
        paymentDate: new Date(),
        paymentMethod: 'cash',
        notes: notes || '',
      });

      // Send payment notification email asynchronously
      const host = await userService.getUserById(req.userId);
      const guest = await userService.getUserById(booking.userId);
      const lodging = await lodgingService.getLodgingById(booking.lodgingId);

      if (host && guest && lodging) {
        emailService.sendPaymentNotification(
          host.email,
          host.name,
          guest.name,
          booking.totalPrice,
          lodging.title || lodging.name
        );
      }

      res.json(successResponse({
        message: 'Payment recorded successfully',
        booking: updated,
      }));
    } catch (error) {
      console.error('Error recording payment:', error);
      res.status(500).json(errorResponse('Failed to record payment'));
    }
  },

  // Get payment summary for host
  getPaymentSummary: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.userId) {
        res.status(401).json(errorResponse('Not authenticated'));
        return;
      }

      // Get all completed bookings for this host
      const bookings = await bookingService.getBookingsByHost(req.userId);
      
      const paidBookings = bookings.filter(b => b.paymentStatus === 'paid');
      const pendingBookings = bookings.filter(b => b.paymentStatus === 'pending');
      
      const totalEarnings = paidBookings.reduce((sum, b) => sum + b.totalPrice, 0);
      const pendingAmount = pendingBookings.reduce((sum, b) => sum + b.totalPrice, 0);

      res.json(successResponse({
        totalEarnings,
        pendingAmount,
        paidBookingsCount: paidBookings.length,
        pendingBookingsCount: pendingBookings.length,
        totalBookings: bookings.length,
      }));
    } catch (error) {
      console.error('Error fetching payment summary:', error);
      res.status(500).json(errorResponse('Failed to fetch payment summary'));
    }
  },

  // Get payment history
  getPaymentHistory: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.userId) {
        res.status(401).json(errorResponse('Not authenticated'));
        return;
      }

      const bookings = await bookingService.getBookingsByHost(req.userId);
      
      // Filter paid bookings and format for payment history
      const paymentHistory = bookings
        .filter(b => b.paymentStatus === 'paid' && b.paymentDate)
        .map(b => ({
          id: b.id,
          lodgingId: b.lodgingId,
          amount: b.totalPrice,
          paymentDate: b.paymentDate,
          checkInDate: b.checkInDate,
          checkOutDate: b.checkOutDate,
          guestId: b.userId,
          notes: b.notes,
        }))
        .sort((a, b) => {
          const dateA = new Date(a.paymentDate || 0).getTime();
          const dateB = new Date(b.paymentDate || 0).getTime();
          return dateB - dateA;
        });

      res.json(successResponse(paymentHistory));
    } catch (error) {
      console.error('Error fetching payment history:', error);
      res.status(500).json(errorResponse('Failed to fetch payment history'));
    }
  },
};
