import express from 'express';
import {
  getEmergencyContacts,
  createEmergencyContact,
  updateEmergencyContact,
  deleteEmergencyContact,
} from '../controllers/emergencyController.js';
import { protect } from '../middleware/auth.js';
import { authorize } from '../middleware/roles.js';

const router = express.Router();

router.get('/', getEmergencyContacts);
router.post('/', protect, authorize('admin'), createEmergencyContact);
router.put('/:id', protect, authorize('admin'), updateEmergencyContact);
router.delete('/:id', protect, authorize('admin'), deleteEmergencyContact);

export default router;
