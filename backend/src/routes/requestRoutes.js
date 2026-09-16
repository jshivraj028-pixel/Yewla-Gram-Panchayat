import express from 'express';
import {
  createRequest,
  getRequests,
  getRequestById,
  updateRequestStatus,
  downloadRequestReceipt,
} from '../controllers/requestController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roles.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.use(protect);

router.post('/', upload.single('attachment'), createRequest);
router.get('/', getRequests);
router.get('/:id/receipt', downloadRequestReceipt);
router.get('/:id', getRequestById);
router.patch('/:id/status', authorize('admin', 'staff'), updateRequestStatus);

export default router;
