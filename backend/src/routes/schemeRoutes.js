import express from 'express';
import {
  getSchemes,
  getSchemeById,
  createScheme,
  updateScheme,
  deleteScheme,
} from '../controllers/schemeController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roles.js';

const router = express.Router();

router.get('/', getSchemes);
router.get('/:id', getSchemeById);
router.post('/', protect, authorize('admin', 'staff'), createScheme);
router.put('/:id', protect, authorize('admin', 'staff'), updateScheme);
router.delete('/:id', protect, authorize('admin'), deleteScheme);

export default router;
