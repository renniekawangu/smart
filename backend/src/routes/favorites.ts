import { Router } from 'express';
import { favoriteController } from '../controllers/favoriteController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Add to favorites (authenticated)
router.post('/', authenticateToken, favoriteController.addFavorite);

// Remove from favorites (authenticated)
router.delete('/:lodgingId', authenticateToken, favoriteController.removeFavorite);

// Get user's favorites (authenticated)
router.get('/', authenticateToken, favoriteController.getUserFavorites);

// Check if lodging is favorited (authenticated)
router.get('/check/:lodgingId', authenticateToken, favoriteController.checkFavorite);

// Get favorite count for lodging (public)
router.get('/count/:lodgingId', favoriteController.getFavoriteCount);

export default router;
