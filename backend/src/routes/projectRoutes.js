import express from 'express';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roles.js';

const router = express.Router();

router.get('/', getProjects);
router.get('/:id', getProjectById);
router.post('/', protect, authorize('admin', 'staff'), createProject);
router.put('/:id', protect, authorize('admin', 'staff'), updateProject);
router.delete('/:id', protect, authorize('admin'), deleteProject);

export default router;
