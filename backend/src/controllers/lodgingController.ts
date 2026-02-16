import { Request, Response } from 'express';
import { lodgingService } from '../services/index';
import { successResponse, errorResponse } from '../utils/response';

export const lodgingController = {
  getAllLodgings: async (req: Request, res: Response): Promise<void> => {
    try {
      const { city, minPrice, maxPrice, amenities, limit, offset } = req.query;

      const filters: any = {
        city: city as string | undefined,
        minPrice: minPrice ? parseInt(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseInt(maxPrice as string) : undefined,
        amenities: amenities ? (amenities as string).split(',') : undefined,
        limit: limit ? parseInt(limit as string) : 20,
        offset: offset ? parseInt(offset as string) : 0,
      };

      const result = await lodgingService.getAllLodgings(filters);
      res.json(successResponse(result));
    } catch (error) {
      res.status(500).json(errorResponse('Internal server error'));
    }
  },

  getLodgingById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const lodging = await lodgingService.getLodgingById(id);

      if (!lodging) {
        res.status(404).json(errorResponse('Lodging not found'));
        return;
      }

      res.json(successResponse(lodging));
    } catch (error) {
      res.status(500).json(errorResponse('Internal server error'));
    }
  },

  createLodging: async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, description, location, amenities, price, basePrice, images } = req.body;

      if (!name || !price) {
        res.status(400).json(errorResponse('Missing required fields'));
        return;
      }

      const lodging = await lodgingService.createLodging({
        name,
        description,
        hostId: 'system', // Default hostId for public lodgings
        location,
        amenities,
        price,
        basePrice: basePrice || price,
        rating: 0,
        reviewCount: 0,
        images,
        availability: [],
      });

      res.status(201).json(successResponse(lodging));
    } catch (error) {
      res.status(500).json(errorResponse('Internal server error'));
    }
  },

  searchLodgings: async (req: Request, res: Response): Promise<void> => {
    try {
      const { q } = req.query;

      if (!q) {
        res.status(400).json(errorResponse('Search query required'));
        return;
      }

      const allLodgings = Array.from(
        await lodgingService.getAllLodgings({ limit: 1000 }).then((r) => r.lodgings)
      );

      const results = allLodgings.filter(
        (l) =>
          l.name.toLowerCase().includes((q as string).toLowerCase()) ||
          l.location.city.toLowerCase().includes((q as string).toLowerCase()) ||
          l.description.toLowerCase().includes((q as string).toLowerCase())
      );

      res.json(successResponse(results));
    } catch (error) {
      res.status(500).json(errorResponse('Internal server error'));
    }
  },
};
