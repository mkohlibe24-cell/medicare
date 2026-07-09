import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IDoctor extends Document {
  user: Types.ObjectId; // ref to User
  specialty: string;
  qualifications: string[];
  experienceYears: number;
  consultationFee: number;
  availableDays: string[]; // e.g. ['Monday', 'Wednesday', 'Friday']
  availableSlots: string[]; // e.g. ['09:00', '09:30', '10:00']
  bio?: string;
}

const doctorSchema = new Schema<IDoctor>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    specialty: { type: String, required: true },
    qualifications: [{ type: String }],
    experienceYears: { type: Number, default: 0 },
    consultationFee: { type: Number, required: true },
    availableDays: [{ type: String }],
    availableSlots: [{ type: String }],
    bio: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IDoctor>('Doctor', doctorSchema);