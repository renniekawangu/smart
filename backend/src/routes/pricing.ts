import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { pricingController } from '../controllers/pricingController';

export const pricingRoutes = Router();

pricingRoutes.post('/', authMiddleware, pricingController.addSeasonalPrice);
pricingRoutes.get('/', pricingController.getSeasonalPrices);
pricingRoutes.delete('/:pricingId', authMiddleware, pricingController.removeSeasonalPrice);
pricingRoutes.post('/calculate', pricingController.calculatePrice);
