import { Response } from 'express';
import { lodgingService, bookingService } from '../services/index';
import { successResponse, errorResponse } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';

export const hostController = {
  // Lodging Management
  getMyLodgings: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.userId) {
        res.status(401).json(errorResponse('Not authenticated'));
        return;
      }

      const lodgings = await lodgingService.getLodgingsByHost(req.userId);
      res.json(successResponse(lodgings));
    } catch (error) {
      res.status(500).json(errorResponse('Failed to fetch your lodgings'));
    }
  },

  createLodging: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.userId) {
        res.status(401).json(errorResponse('Not authenticated'));
        return;
      }

      const { title, description, city, country, price, amenities, rating } = req.body;
      const files = (req as any).files as Express.Multer.File[] || [];

      if (!title || !description || !city || !country || !price) {
        res.status(400).json(errorResponse('Missing required fields'));
        return;
      }

      // Convert file paths to URLs (relative to /uploads)
      const imageUrls = files.map(file => `/uploads/${file.filename}`);

      // Parse amenities from JSON string if provided
      let amenitiesArray = [];
      if (amenities) {
        try {
          amenitiesArray = typeof amenities === 'string' ? JSON.parse(amenities) : amenities;
        } catch (e) {
          amenitiesArray = [];
        }
      }

      const lodging = await lodgingService.createLodging({
        name: title,
        title,
        description,
        hostId: req.userId,
        location: {
          address: city,
          city,
          country,
        },
        price,
        basePrice: price,
        amenities: amenitiesArray || [],
        images: imageUrls || [],
        rating: rating || 0,
        reviewCount: 0,
        availability: [],
      });

      res.status(201).json(successResponse(lodging));
    } catch (error) {
      console.error('Error creating lodging:', error);
      res.status(500).json(errorResponse('Failed to create lodging'));
    }
  },

  updateLodging: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.userId) {
        res.status(401).json(errorResponse('Not authenticated'));
        return;
      }

      const { lodgingId } = req.params;
      const lodging = await lodgingService.getLodgingById(lodgingId);

      if (!lodging) {
        res.status(404).json(errorResponse('Lodging not found'));
        return;
      }

      if (lodging.hostId !== req.userId) {
        res.status(403).json(errorResponse('You can only edit your own lodgings'));
        return;
      }

      const { title, description, city, country, price, amenities } = req.body;
      const files = (req as any).files as Express.Multer.File[] || [];

      // Convert file paths to URLs
      const newImageUrls = files.map(file => `/uploads/${file.filename}`);
      
      // Combine new images with existing ones (if not replacing)
      const existingImages = lodging.images || [];
      const allImages = files.length > 0 ? newImageUrls : existingImages;

      // Parse amenities from JSON string if provided
      let amenitiesArray = [];
      if (amenities) {
        try {
          amenitiesArray = typeof amenities === 'string' ? JSON.parse(amenities) : amenities;
        } catch (e) {
          amenitiesArray = lodging.amenities || [];
        }
      }

      const updateData = {
        title: title || lodging.title,
        description: description || lodging.description,
        location: {
          address: city || lodging.location.address,
          city: city || lodging.location.city,
          country: country || lodging.location.country,
          coordinates: lodging.location.coordinates,
        },
        price: price ? parseFloat(price) : lodging.price,
        basePrice: price ? parseFloat(price) : lodging.basePrice,
        amenities: amenitiesArray && amenitiesArray.length > 0 ? amenitiesArray : lodging.amenities,
        images: allImages,
      };

      const updated = await lodgingService.updateLodging(lodgingId, updateData);
      res.json(successResponse(updated));
    } catch (error) {
      console.error('Error updating lodging:', error);
      res.status(500).json(errorResponse('Failed to update lodging'));
    }
  },

  deleteLodging: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.userId) {
        res.status(401).json(errorResponse('Not authenticated'));
        return;
      }

      const { lodgingId } = req.params;
      const lodging = await lodgingService.getLodgingById(lodgingId);

      if (!lodging) {
        res.status(404).json(errorResponse('Lodging not found'));
        return;
      }

      if (lodging.hostId !== req.userId) {
        res.status(403).json(errorResponse('You can only delete your own lodgings'));
        return;
      }

      await lodgingService.deleteLodging(lodgingId);
      res.json(successResponse({ message: 'Lodging deleted successfully' }));
    } catch (error) {
      res.status(500).json(errorResponse('Failed to delete lodging'));
    }
  },

  // Booking Management
  getMyBookings: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.userId) {
        res.status(401).json(errorResponse('Not authenticated'));
        return;
      }

      const bookings = await bookingService.getBookingsByHost(req.userId);
      res.json(successResponse(bookings));
    } catch (error) {
      res.status(500).json(errorResponse('Failed to fetch bookings'));
    }
  },

  updateBookingStatus: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.userId) {
        res.status(401).json(errorResponse('Not authenticated'));
        return;
      }

      const { bookingId } = req.params;
      const { status } = req.body;

      if (!['pending', 'confirmed', 'cancelled', 'completed'].includes(status)) {
        res.status(400).json(errorResponse('Invalid status'));
        return;
      }

      const booking = await bookingService.getBookingById(bookingId);

      if (!booking) {
        res.status(404).json(errorResponse('Booking not found'));
        return;
      }

      // Verify host ownership by checking if booking is for this host's lodging
      const lodging = await lodgingService.getLodgingById(booking.lodgingId);
      if (!lodging || lodging.hostId !== req.userId) {
        res.status(403).json(errorResponse('You can only manage bookings for your lodgings'));
        return;
      }

      const updated = await bookingService.updateBookingStatus(bookingId, status);
      res.json(successResponse(updated));
    } catch (error) {
      console.error('Error updating booking status:', error);
      res.status(500).json(errorResponse('Failed to update booking status'));
    }
  },

  // Dashboard Stats
  getStats: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.userId) {
        res.status(401).json(errorResponse('Not authenticated'));
        return;
      }

      const lodgings = await lodgingService.getLodgingsByHost(req.userId);
      const bookings = await bookingService.getBookingsByHost(req.userId);

      const stats = {
        totalLodgings: lodgings.length,
        totalBookings: bookings.length,
        totalRevenueK: bookings.reduce((sum: number, b: any) => sum + (b.totalPrice || 0), 0),
      };

      res.json(successResponse(stats));
    } catch (error) {
      res.status(500).json(errorResponse('Failed to fetch stats'));
    }
  },
};
