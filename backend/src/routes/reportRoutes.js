import express from 'express';
import {
  getDashboardStats,
  exportComplaintsCsv,
} from '../controllers/reportController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roles.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin', 'staff'));

router.get('/dashboard-stats', getDashboardStats);
router.get('/complaints/export-csv', exportComplaintsCsv);

export default router;
