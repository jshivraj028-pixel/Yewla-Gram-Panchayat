import express from 'express';
import {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
  getComplaintAnalytics,
  downloadComplaintReceipt,
  toggleLikeComplaint,
  addCommentToComplaint,
  deleteComment,
} from '../controllers/complaintController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roles.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.use(protect);

router.post('/', upload.single('photo'), createComplaint);
router.get('/', getComplaints);
router.get('/analytics', authorize('admin', 'staff'), getComplaintAnalytics);
router.get('/:id/receipt', downloadComplaintReceipt);
router.get('/:id', getComplaintById);
router.patch('/:id/status', authorize('admin', 'staff'), updateComplaintStatus);

// Likes & Comments
router.post('/:id/like', toggleLikeComplaint);
router.post('/:id/comments', addCommentToComplaint);
router.delete('/:id/comments/:commentId', deleteComment);

export default router;
