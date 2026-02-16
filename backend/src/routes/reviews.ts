import { Router } from 'express';
import { reviewController } from '../controllers/reviewController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/', authMiddleware, reviewController.createReview);
router.get('/:id', reviewController.getReview);
router.get('/lodging/:lodgingId', reviewController.getLodgingReviews);
router.get('/user/:userId', reviewController.getUserReviews);
router.put('/:id', authMiddleware, reviewController.updateReview);
router.delete('/:id', authMiddleware, reviewController.deleteReview);

export default router;
