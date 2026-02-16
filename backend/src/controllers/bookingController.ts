import { Request, Response } from 'express';
import { bookingService, userService, lodgingService } from '../services/index';
import { successResponse, errorResponse } from '../utils/response';
import { emailService } from '../utils/email';
import { seasonalPricingService } from '../services/seasonalPricingService';
import { AuthenticatedRequest } from '../middleware/auth';
import { BookingStatus } from '../types/index';

export const bookingController = {
  createBooking: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { lodgingId, checkInDate, checkOutDate, numberOfGuests } = req.body;

      if (!lodgingId || !checkInDate || !checkOutDate) {
        res.status(400).json(errorResponse('Missing required fields'));
        return;
      }

      const available = await bookingService.checkAvailability(lodgingId, checkInDate, checkOutDate);
      if (!available) {
        res.status(409).json(errorResponse('Lodging not available for selected dates'));
        return;
      }

      // Get lodging to find hostId
      const lodging = await lodgingService.getLodgingById(lodgingId);
      if (!lodging) {
        res.status(404).json(errorResponse('Lodging not found'));
        return;
      }

      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      const nights = (checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24);
      
      // Calculate total price with seasonal pricing
      const { totalPrice } = await seasonalPricingService.calculateTotalPrice(
        lodgingId,
        checkInDate,
        checkOutDate,
        lodging.price || 100
      );

      const booking = await bookingService.createBooking({
        userId: req.userId || '',
        lodgingId,
        hostId: lodging.hostId,
        checkInDate,
        checkOutDate,
        numberOfGuests,
        totalPrice,
        status: BookingStatus.PENDING,
        paymentMethod: 'cash',
        paymentStatus: 'pending',
      });

      // Send emails asynchronously (don't wait for completion)
      if (req.userId) {
        const guest = await userService.getUserById(req.userId);
        const host = await userService.getUserById(lodging.hostId);
        
        if (guest) {
          emailService.sendBookingConfirmation(
            guest.email,
            guest.name,
            lodging.title || lodging.name,
            checkInDate,
            checkOutDate,
            totalPrice
          );
        }

        if (host) {
          emailService.sendHostBookingNotification(
            host.email,
            host.name,
            guest?.name || 'Guest',
            lodging.title || lodging.name,
            checkInDate,
            checkOutDate,
            numberOfGuests,
            totalPrice
          );
        }
      }

      res.status(201).json(successResponse(booking));
    } catch (error) {
      res.status(500).json(errorResponse('Internal server error'));
    }
  },

  getBooking: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const booking = await bookingService.getBookingById(id);

      if (!booking) {
        res.status(404).json(errorResponse('Booking not found'));
        return;
      }

      res.json(successResponse(booking));
    } catch (error) {
      res.status(500).json(errorResponse('Internal server error'));
    }
  },

  getUserBookings: async (req: Request, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const bookings = await bookingService.getUserBookings(userId);
      res.json(successResponse(bookings));
    } catch (error) {
      res.status(500).json(errorResponse('Internal server error'));
    }
  },

  cancelBooking: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const booking = await bookingService.updateBookingStatus(id, BookingStatus.CANCELLED);

      if (!booking) {
        res.status(404).json(errorResponse('Booking not found'));
        return;
      }

      res.json(successResponse(booking));
    } catch (error) {
      res.status(500).json(errorResponse('Internal server error'));
    }
  },

  checkAvailability: async (req: Request, res: Response): Promise<void> => {
    try {
      const { lodgingId, checkInDate, checkOutDate } = req.body;

      const available = await bookingService.checkAvailability(lodgingId, checkInDate, checkOutDate);
      res.json(successResponse({ available }));
    } catch (error) {
      res.status(500).json(errorResponse('Internal server error'));
    }
  },
};
