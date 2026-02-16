import { Router, Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import { seasonalPricingService } from '../services/seasonalPricingService';
import { successResponse, errorResponse } from '../utils/response';

export const pricingController = {
  // Add seasonal price
  addSeasonalPrice: async (req: Request, res: Response) => {
    try {
      const { lodgingId, startDate, endDate, pricePerNight, name } = req.body;
      const userId = (req as any).userId;

      if (!lodgingId || !startDate || !endDate || !pricePerNight) {
        res.status(400).json(errorResponse('Missing required fields'));
        return;
      }

      // Verify ownership
      const Lodging = (req as any).app.locals.Lodging;
      const lodging = await Lodging.findById(lodgingId);
      if (!lodging || lodging.hostId !== userId) {
        res.status(403).json(errorResponse('Unauthorized'));
        return;
      }

      const seasonalPrice = await seasonalPricingService.addSeasonalPrice(
        lodgingId,
        startDate,
        endDate,
        pricePerNight,
        name
      );

      res.json(successResponse(seasonalPrice, 'Seasonal price added successfully'));
    } catch (error) {
      console.error('Error adding seasonal price:', error);
      res.status(500).json(errorResponse('Failed to add seasonal price'));
    }
  },

  // Get seasonal prices
  getSeasonalPrices: async (req: Request, res: Response) => {
    try {
      const { lodgingId } = req.query;

      if (!lodgingId) {
        res.status(400).json(errorResponse('Lodging ID required'));
        return;
      }

      const prices = await seasonalPricingService.getSeasonalPrices(lodgingId as string);
      res.json(successResponse(prices, 'Seasonal prices retrieved'));
    } catch (error) {
      console.error('Error getting seasonal prices:', error);
      res.status(500).json(errorResponse('Failed to get seasonal prices'));
    }
  },

  // Remove seasonal price
  removeSeasonalPrice: async (req: Request, res: Response) => {
    try {
      const { pricingId } = req.params;
      const userId = (req as any).userId;

      const SeasonalPrice = (req as any).app.locals.SeasonalPrice;
      const price = await SeasonalPrice.findById(pricingId);
      if (!price) {
        res.status(404).json(errorResponse('Pricing not found'));
        return;
      }

      const Lodging = (req as any).app.locals.Lodging;
      const lodging = await Lodging.findById(price.lodgingId);
      if (lodging.hostId !== userId) {
        res.status(403).json(errorResponse('Unauthorized'));
        return;
      }

      const success = await seasonalPricingService.removeSeasonalPrice(pricingId);
      if (!success) {
        res.status(404).json(errorResponse('Pricing not found'));
        return;
      }

      res.json(successResponse({}, 'Seasonal price removed successfully'));
    } catch (error) {
      console.error('Error removing seasonal price:', error);
      res.status(500).json(errorResponse('Failed to remove seasonal price'));
    }
  },

  // Calculate total price for date range
  calculatePrice: async (req: Request, res: Response) => {
    try {
      const { lodgingId, startDate, endDate, basePrice } = req.body;

      if (!lodgingId || !startDate || !endDate || !basePrice) {
        res.status(400).json(errorResponse('Missing required fields'));
        return;
      }

      const result = await seasonalPricingService.calculateTotalPrice(
        lodgingId,
        startDate,
        endDate,
        basePrice
      );

      res.json(successResponse(result, 'Price calculated successfully'));
    } catch (error) {
      console.error('Error calculating price:', error);
      res.status(500).json(errorResponse('Failed to calculate price'));
    }
  },
};
