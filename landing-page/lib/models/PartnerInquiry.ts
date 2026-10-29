import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPartnerInquiry extends Document {
  organizationName: string;
  contactName: string;
  email: string;
  phone?: string;
  partnershipType: string;
  message?: string;
  status: "new" | "in_discussion" | "partnered" | "declined";
  createdAt: Date;
  updatedAt: Date;
}

const PartnerInquirySchema = new Schema<IPartnerInquiry>(
  {
    organizationName: { type: String, required: true, trim: true },
    contactName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    partnershipType: { type: String, required: true },
    message: { type: String },
    status: { type: String, enum: ["new", "in_discussion", "partnered", "declined"], default: "new" },
  },
  { timestamps: true }
);

const PartnerInquiry: Model<IPartnerInquiry> =
  mongoose.models.PartnerInquiry || mongoose.model<IPartnerInquiry>("PartnerInquiry", PartnerInquirySchema);
export default PartnerInquiry;
