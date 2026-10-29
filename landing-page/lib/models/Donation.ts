import mongoose, { Schema, Document, Model } from "mongoose";

export type DonationStatus = "pending" | "authorized" | "captured" | "failed" | "refunded";
export type PaymentStatus = "pending" | "awaiting_verification" | "successful" | "failed" | "cancelled" | "refunded";
export type PaymentProvider = "razorpay" | "upi_manual" | "bank_transfer" | "offline";
export type DonationFrequency = "one_time" | "monthly";

export interface IDonation extends Document {
  donationReference: string;
  internalId: string; // Alias for backward compatibility
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  donorPan?: string;
  amount: number; // In Rupees (INR)
  amountPaise: number; // In Paise (Integer)
  currency: string;
  frequency: DonationFrequency;
  paymentProvider: PaymentProvider;
  razorpayOrderId?: string;
  providerOrderId?: string; // Alias for backward compatibility
  razorpayPaymentId?: string;
  providerPaymentId?: string; // Alias for backward compatibility
  transferReference?: string; // UTR or transaction ID for bank transfer / UPI
  status: DonationStatus;
  paymentStatus: PaymentStatus; // Synchronized alias for backward compatibility
  campaign: string;
  isTaxReceiptRequested: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  capturedAt?: Date;
  verifiedAt?: Date;
  verifiedBy?: string;
}

const DonationSchema = new Schema<IDonation>(
  {
    donationReference: { type: String, required: true, unique: true, index: true },
    internalId: { type: String, required: true, index: true },
    donorName: { type: String, required: true, trim: true, default: "Generous Supporter" },
    donorEmail: { type: String, required: true, trim: true, lowercase: true, index: true },
    donorPhone: { type: String, trim: true },
    donorPan: { type: String, trim: true, uppercase: true },
    amount: { type: Number, required: true, min: [10, "Minimum donation is ₹10"] },
    amountPaise: { type: Number, required: true },
    currency: { type: String, default: "INR" },
    frequency: { type: String, enum: ["one_time", "monthly"], default: "one_time" },
    paymentProvider: { type: String, enum: ["razorpay", "upi_manual", "bank_transfer", "offline"], required: true },
    razorpayOrderId: { type: String, index: true, sparse: true },
    providerOrderId: { type: String, index: true, sparse: true },
    razorpayPaymentId: { type: String, index: true, sparse: true },
    providerPaymentId: { type: String, index: true, sparse: true },
    transferReference: { type: String, trim: true, index: true, sparse: true },
    status: {
      type: String,
      enum: ["pending", "authorized", "captured", "failed", "refunded"],
      default: "pending",
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "awaiting_verification", "successful", "failed", "cancelled", "refunded"],
      default: "pending",
      index: true,
    },
    campaign: { type: String, default: "First Meal - Vidarbha" },
    isTaxReceiptRequested: { type: Boolean, default: false },
    notes: { type: String },
    capturedAt: { type: Date },
    verifiedAt: { type: Date },
    verifiedBy: { type: String },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware to keep aliases and amountPaise synchronized
DonationSchema.pre("save", function () {
  if (this.donationReference && !this.internalId) {
    this.internalId = this.donationReference;
  } else if (this.internalId && !this.donationReference) {
    this.donationReference = this.internalId;
  }

  if (this.amount && !this.amountPaise) {
    this.amountPaise = Math.round(this.amount * 100);
  } else if (this.amountPaise && !this.amount) {
    this.amount = Math.round(this.amountPaise / 100);
  }

  if (this.razorpayOrderId && !this.providerOrderId) {
    this.providerOrderId = this.razorpayOrderId;
  } else if (this.providerOrderId && !this.razorpayOrderId) {
    this.razorpayOrderId = this.providerOrderId;
  }

  if (this.razorpayPaymentId && !this.providerPaymentId) {
    this.providerPaymentId = this.razorpayPaymentId;
  } else if (this.providerPaymentId && !this.razorpayPaymentId) {
    this.razorpayPaymentId = this.providerPaymentId;
  }

  // Synchronize status with paymentStatus
  if (this.status === "captured") {
    this.paymentStatus = "successful";
  } else if (this.paymentStatus === "successful") {
    this.status = "captured";
  }
});

// Prevent recompilation during Next.js development hot reload
const Donation: Model<IDonation> =
  mongoose.models.Donation || mongoose.model<IDonation>("Donation", DonationSchema);

export default Donation;
