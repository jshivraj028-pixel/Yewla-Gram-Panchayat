import express from 'express';
import {
  getNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice,
} from '../controllers/noticeController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roles.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getNotices);
router.get('/:id', getNoticeById);

// Protected admin/staff notice management
router.post(
  '/',
  protect,
  authorize('admin', 'staff'),
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'pdfDocument', maxCount: 1 },
  ]),
  createNotice
);

router.put(
  '/:id',
  protect,
  authorize('admin', 'staff'),
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'pdfDocument', maxCount: 1 },
  ]),
  updateNotice
);

router.delete('/:id', protect, authorize('admin'), deleteNotice);

export default router;
