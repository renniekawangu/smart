import { Router } from 'express';
import { favoriteController } from '../controllers/favoriteController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Add to favorites (authenticated)
router.post('/', authMiddleware, favoriteController.addFavorite);

// Remove from favorites (authenticated)
router.delete('/:lodgingId', authMiddleware, favoriteController.removeFavorite);

// Get user's favorites (authenticated)
router.get('/', authMiddleware, favoriteController.getUserFavorites);

// Check if lodging is favorited (authenticated)
router.get('/check/:lodgingId', authMiddleware, favoriteController.checkFavorite);

// Get favorite count for lodging (public)
router.get('/count/:lodgingId', favoriteController.getFavoriteCount);

export default router;
