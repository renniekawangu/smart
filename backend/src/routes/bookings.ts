import { Router } from 'express';
import { bookingController } from '../controllers/bookingController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/', authMiddleware, bookingController.createBooking);
router.get('/:id', bookingController.getBooking);
router.get('/user/:userId', bookingController.getUserBookings);
router.patch('/:id/cancel', authMiddleware, bookingController.cancelBooking);
router.post('/check-availability', bookingController.checkAvailability);

export default router;
