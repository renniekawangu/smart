import { Router } from 'express';
import { paymentController } from '../controllers/paymentController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Record cash payment (host only)
router.post('/record-cash', authenticateToken, paymentController.recordCashPayment);

// Get payment summary (host only)
router.get('/summary', authenticateToken, paymentController.getPaymentSummary);

// Get payment history (host only)
router.get('/history', authenticateToken, paymentController.getPaymentHistory);

export default router;
