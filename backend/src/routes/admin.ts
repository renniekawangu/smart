import { Router } from 'express';
import { authMiddleware, requireRole } from '../middleware/auth';
import { adminController } from '../controllers/adminController';

const router = Router();

// Protect all routes with auth and admin role
router.use(authMiddleware, requireRole(['admin']));

// User Management
router.get('/users', adminController.getAllUsers);
router.get('/users/:userId', adminController.getUserById);
router.put('/users/:userId/role', adminController.updateUserRole);
router.delete('/users/:userId', adminController.deleteUser);

// Lodging Management
router.get('/lodgings', adminController.getAllLodgings);
router.post('/lodgings', adminController.createLodging);
router.put('/lodgings/:lodgingId', adminController.updateLodging);
router.delete('/lodgings/:lodgingId', adminController.deleteLodging);

// Stats
router.get('/stats', adminController.getStats);

export default router;
