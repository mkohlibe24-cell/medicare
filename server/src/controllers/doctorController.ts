import { Response } from 'express';
import Doctor from '../models/Doctor';
import User from '../models/User';
import { AuthRequest } from '../middleware/authMiddleware';

// Create a doctor profile (called after a user with role 'doctor' registers)
export const createDoctorProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { specialty, qualifications, experienceYears, consultationFee, availableDays, availableSlots, bio } = req.body;

    const existing = await Doctor.findOne({ user: req.user._id });
    if (existing) {
      return res.status(400).json({ message: 'Doctor profile already exists' });
    }

    const doctor = await Doctor.create({
      user: req.user._id,
      specialty,
      qualifications,
      experienceYears,
      consultationFee,
      availableDays,
      availableSlots,
      bio,
    });

    res.status(201).json(doctor);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get all doctors (public — patients browse this)
export const getDoctors = async (req: AuthRequest, res: Response) => {
  try {
    const doctors = await Doctor.find().populate('user', 'name email');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Get a single doctor by ID
export const getDoctorById = async (req: AuthRequest, res: Response) => {
  try {
    const doctor = await Doctor.findById(req.params.id).populate('user', 'name email');
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};