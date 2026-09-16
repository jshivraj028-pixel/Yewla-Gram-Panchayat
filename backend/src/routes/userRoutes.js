import express from 'express';
import {
  getUsers,
  toggleUserStatus,
  updateUserRole,
  getUserProfile,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roles.js';

const router = express.Router();

router.use(protect);

// Authenticated users can view profile + complaints
router.get('/:id/profile', getUserProfile);

// Admin-only user management
router.use(authorize('admin'));

router.get('/', getUsers);
router.patch('/:id/status', toggleUserStatus);
router.patch('/:id/role', updateUserRole);

export default router;
