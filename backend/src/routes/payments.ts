import { Router } from 'express';
import { paymentController } from '../controllers/paymentController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Record cash payment (host only)
router.post('/record-cash', authMiddleware, paymentController.recordCashPayment);

// Get payment summary (host only)
router.get('/summary', authMiddleware, paymentController.getPaymentSummary);

// Get payment history (host only)
router.get('/history', authMiddleware, paymentController.getPaymentHistory);

export default router;
