import express from 'express';
import {
  getGalleryImages,
  createGalleryImage,
  deleteGalleryImage,
} from '../controllers/galleryController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roles.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getGalleryImages);
router.post(
  '/',
  protect,
  authorize('admin', 'staff'),
  upload.single('image'),
  createGalleryImage
);
router.delete('/:id', protect, authorize('admin'), deleteGalleryImage);

export default router;
