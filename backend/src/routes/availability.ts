import { Router } from 'express';
import { availabilityController } from '../controllers/availabilityController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Block dates (authenticated host only)
router.post('/block', authMiddleware, availabilityController.blockDates);

// Unblock dates (authenticated host only)
router.delete('/block/:blockedDateId', authMiddleware, availabilityController.unblockDates);

// Get calendar data (authenticated host only)
router.get('/calendar/:lodgingId', authMiddleware, availabilityController.getCalendar);

// Check availability (public)
router.get('/check', availabilityController.checkAvailability);

export default router;
