import express from 'express';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  createBroadcastNotification,
} from '../controllers/notificationController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roles.js';

const router = express.Router();

router.use(protect);

router.get('/', getNotifications);
router.patch('/:id/read', markAsRead);
router.patch('/read-all', markAllAsRead);
router.post('/broadcast', authorize('admin'), createBroadcastNotification);

export default router;
