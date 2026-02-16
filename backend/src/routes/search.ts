import { Router } from 'express';
import { authMiddleware } from '../middleware/auth';
import { searchController } from '../controllers/searchController';

export const searchRoutes = Router();

// Public search with filters
searchRoutes.get('/', searchController.search);

// Saved searches (authenticated)
searchRoutes.post('/save', authMiddleware, searchController.saveSearch);
searchRoutes.get('/saved', authMiddleware, searchController.getSavedSearches);
searchRoutes.get('/saved/:searchId', authMiddleware, searchController.getSavedSearchById);
searchRoutes.delete('/saved/:searchId', authMiddleware, searchController.deleteSavedSearch);
