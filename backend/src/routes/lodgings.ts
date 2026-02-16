import { Router } from 'express';
import { lodgingController } from '../controllers/lodgingController';

const router = Router();

router.get('/', lodgingController.getAllLodgings);
router.get('/search', lodgingController.searchLodgings);
router.get('/:id', lodgingController.getLodgingById);
router.post('/', lodgingController.createLodging);

export default router;
