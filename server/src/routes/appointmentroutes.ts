import express from 'express';
import { createAppointment, getMyAppointments, updateAppointmentStatus } from '../controllers/appointmentController';
import { protect, authorize } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', protect, authorize('patient'), createAppointment);
router.get('/my', protect, authorize('patient'), getMyAppointments);
router.put('/:id/status', protect, authorize('doctor', 'admin'), updateAppointmentStatus);

export default router;