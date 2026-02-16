import { Response } from 'express';
import { userService, lodgingService } from '../services/index';
import { successResponse, errorResponse } from '../utils/response';
import { AuthenticatedRequest } from '../middleware/auth';

export const adminController = {
  // User Management
  getAllUsers: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const users = await userService.getAllUsers();
      res.json(successResponse(users));
    } catch (error) {
      res.status(500).json(errorResponse('Failed to fetch users'));
    }
  },

  getUserById: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const user = await userService.getUserById(userId);

      if (!user) {
        res.status(404).json(errorResponse('User not found'));
        return;
      }

      res.json(successResponse(user));
    } catch (error) {
      res.status(500).json(errorResponse('Failed to fetch user'));
    }
  },

  updateUserRole: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      if (!['admin', 'client', 'host'].includes(role)) {
        res.status(400).json(errorResponse('Invalid role'));
        return;
      }

      const user = await userService.updateUser(userId, { role });

      if (!user) {
        res.status(404).json(errorResponse('User not found'));
        return;
      }

      res.json(successResponse({ message: 'User role updated', user }));
    } catch (error) {
      res.status(500).json(errorResponse('Failed to update user role'));
    }
  },

  deleteUser: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;

      if (req.userId === userId) {
        res.status(400).json(errorResponse('Cannot delete your own account'));
        return;
      }

      const result = await userService.deleteUser(userId);

      if (!result) {
        res.status(404).json(errorResponse('User not found'));
        return;
      }

      res.json(successResponse({ message: 'User deleted successfully' }));
    } catch (error) {
      res.status(500).json(errorResponse('Failed to delete user'));
    }
  },

  // Lodging Management
  getAllLodgings: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const result = await lodgingService.getAllLodgings();
      res.json(successResponse(result.lodgings));
    } catch (error) {
      res.status(500).json(errorResponse('Failed to fetch lodgings'));
    }
  },

  createLodging: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { title, name, description, city, price, amenities, images } = req.body;

      if (!title && !name) {
        res.status(400).json(errorResponse('Title or name is required'));
        return;
      }

      if (!description || !city || !price) {
        res.status(400).json(errorResponse('Missing required fields'));
        return;
      }

      const lodging = await lodgingService.createLodging({
        title: title || name,
        name: name || title,
        description,
        location: {
          address: city,
          city,
        },
        amenities: amenities || [],
        price: parseFloat(price),
        basePrice: parseFloat(price),
        rating: 0,
        reviewCount: 0,
        images: images || [],
        availability: [],
        hostId: req.userId || 'admin',
      });

      res.status(201).json(successResponse(lodging));
    } catch (error) {
      res.status(500).json(errorResponse('Failed to create lodging'));
    }
  },

  updateLodging: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { lodgingId } = req.params;
      const { title, name, description, city, price, amenities, images } = req.body;

      const updates: any = {};
      if (title) updates.title = title;
      if (name) updates.name = name;
      if (description) updates.description = description;
      if (city) updates.location = { address: city, city };
      if (price) {
        updates.price = parseFloat(price);
        updates.basePrice = parseFloat(price);
      }
      if (amenities) updates.amenities = amenities;
      if (images) updates.images = images;

      const lodging = await lodgingService.updateLodging(lodgingId, updates);

      if (!lodging) {
        res.status(404).json(errorResponse('Lodging not found'));
        return;
      }

      res.json(successResponse(lodging));
    } catch (error) {
      res.status(500).json(errorResponse('Failed to update lodging'));
    }
  },

  deleteLodging: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { lodgingId } = req.params;

      const result = await lodgingService.deleteLodging(lodgingId);

      if (!result) {
        res.status(404).json(errorResponse('Lodging not found'));
        return;
      }

      res.json(successResponse({ message: 'Lodging deleted successfully' }));
    } catch (error) {
      res.status(500).json(errorResponse('Failed to delete lodging'));
    }
  },

  // Dashboard Stats
  getStats: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const users = await userService.getAllUsers();
      const result = await lodgingService.getAllLodgings();
      const lodgings = result.lodgings;

      const stats = {
        totalUsers: users.length,
        totalLodgings: lodgings.length,
        adminCount: users.filter((u: any) => u.role === 'admin').length,
        hostCount: users.filter((u: any) => u.role === 'host').length,
        clientCount: users.filter((u: any) => u.role === 'client').length,
      };

      res.json(successResponse(stats));
    } catch (error) {
      res.status(500).json(errorResponse('Failed to fetch stats'));
    }
  },
};
