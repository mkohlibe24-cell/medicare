import { Response } from 'express';
import Appointment from '../models/Appointment';
import { AuthRequest } from '../middleware/authMiddleware';

// Patient books an appointment
export const createAppointment = async (req: AuthRequest, res: Response) => {
  try {
    const { doctor, date, timeSlot, reason } = req.body;

    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor,
      date,
      timeSlot,
      reason,
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get logged-in patient's own appointments
export const getMyAppointments = async (req: AuthRequest, res: Response) => {
  try {
    const appointments = await Appointment.find({ patient: req.user._id })
      .populate('doctor')
      .sort({ date: 1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Doctor/admin updates appointment status
export const updateAppointmentStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { status } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });

    appointment.status = status;
    await appointment.save();

    res.json(appointment);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};