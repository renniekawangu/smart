import { Router } from 'express';
import { availabilityController } from '../controllers/availabilityController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Block dates (authenticated host only)
router.post('/block', authenticateToken, availabilityController.blockDates);

// Unblock dates (authenticated host only)
router.delete('/block/:blockedDateId', authenticateToken, availabilityController.unblockDates);

// Get calendar data (authenticated host only)
router.get('/calendar/:lodgingId', authenticateToken, availabilityController.getCalendar);

// Check availability (public)
router.get('/check', availabilityController.checkAvailability);

export default router;
