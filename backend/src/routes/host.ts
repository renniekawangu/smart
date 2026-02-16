import { Router } from 'express';
import { authMiddleware, requireRole } from '../middleware/auth';
import { hostController } from '../controllers/hostController';
import { uploadMiddleware } from '../utils/upload';

const router = Router();

// Protect all routes with auth and host role
router.use(authMiddleware, requireRole(['host']));

// Lodging Management
router.get('/lodgings', hostController.getMyLodgings);
router.post('/lodgings', uploadMiddleware.array('images', 10), hostController.createLodging);
router.put('/lodgings/:lodgingId', uploadMiddleware.array('images', 10), hostController.updateLodging);
router.delete('/lodgings/:lodgingId', hostController.deleteLodging);

// Booking Management
router.get('/bookings', hostController.getMyBookings);

// Stats
router.get('/stats', hostController.getStats);

export default router;

