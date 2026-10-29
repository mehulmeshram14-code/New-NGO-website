import mongoose, { Schema, Document, Model } from "mongoose";

export interface IVolunteer extends Document {
  fullName: string;
  email: string;
  phone: string;
  city: string;
  interest: string;
  availability?: string;
  message?: string;
  status: "new" | "contacted" | "active" | "archived";
  createdAt: Date;
  updatedAt: Date;
}

const VolunteerSchema = new Schema<IVolunteer>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    interest: { type: String, required: true },
    availability: { type: String },
    message: { type: String },
    status: { type: String, enum: ["new", "contacted", "active", "archived"], default: "new" },
  },
  { timestamps: true }
);

const Volunteer: Model<IVolunteer> = mongoose.models.Volunteer || mongoose.model<IVolunteer>("Volunteer", VolunteerSchema);
export default Volunteer;
