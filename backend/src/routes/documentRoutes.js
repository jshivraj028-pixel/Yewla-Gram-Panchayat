import express from 'express';
import {
  getDocuments,
  createDocument,
  deleteDocument,
  downloadDocument,
} from '../controllers/documentController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roles.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.get('/', getDocuments);
router.get('/:id/download', downloadDocument);
router.post('/', protect, authorize('admin', 'staff'), upload.single('file'), createDocument);
router.delete('/:id', protect, authorize('admin'), deleteDocument);

export default router;
