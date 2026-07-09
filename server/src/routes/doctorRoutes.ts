import express from 'express';
import { createDoctorProfile, getDoctors, getDoctorById } from '../controllers/doctorController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getDoctors); // public
router.get('/:id', getDoctorById); // public
router.post('/', protect, authorize('doctor'), createDoctorProfile);

export default router;