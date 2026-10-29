import { z } from "zod";

export const CreateDonationOrderSchema = z.object({
  donorName: z
    .string()
    .trim()
    .max(100, "Name must not exceed 100 characters")
    .optional()
    .default("Generous Supporter"),
  donorEmail: z
    .string()
    .trim()
    .email("Please provide a valid email address")
    .optional()
    .or(z.literal(""))
    .default(""),
  donorPhone: z
    .string()
    .trim()
    .regex(/^[0-9+ -]{10,15}$/, "Please enter a valid phone number (10-15 digits)")
    .optional()
    .or(z.literal("")),
  donorPan: z
    .string()
    .trim()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format (e.g. ABCDE1234F)")
    .optional()
    .or(z.literal("")),
  amount: z
    .number()
    .int("Donation amount must be an integer in Rupees")
    .positive("Donation amount must be greater than zero")
    .min(10, "Minimum donation amount is ₹10")
    .max(500000, "For donations exceeding ₹5,00,000, please contact our team directly"),
  frequency: z.enum(["one_time", "monthly"]).default("one_time"),
  campaign: z.string().default("First Meal - Vidarbha"),
  isTaxReceiptRequested: z.boolean().default(false),
});

export const VerifyPaymentSchema = z.object({
  donationReference: z.string().min(3).optional(),
  internalId: z.string().min(3).optional(),
  razorpay_order_id: z.string().min(5, "Razorpay Order ID is required"),
  razorpay_payment_id: z.string().min(5, "Razorpay Payment ID is required"),
  razorpay_signature: z.string().min(10, "Razorpay Signature is required"),
});

export const ManualTransferSchema = z.object({
  donorName: z.string().min(2).max(100).default("Generous Supporter"),
  donorEmail: z.string().email().default("deeprootsfoundation2026@gmail.com"),
  donorPhone: z.string().regex(/^[0-9+ -]{10,15}$/, "Please enter a valid phone number").optional().or(z.literal("")),
  amount: z.number().int().min(10, "Minimum donation amount is ₹10").max(1000000),
  paymentProvider: z.enum(["upi_manual", "bank_transfer"]),
  transferReference: z.string().min(4, "Transaction reference / UTR is required").max(60),
  notes: z.string().max(500).optional(),
});

export const UpdateDonorDetailsSchema = z.object({
  internalId: z.string().min(3),
  donorName: z.string().min(2, "Name must be at least 2 characters").max(100),
  donorEmail: z.string().email("Please enter a valid email address"),
  donorPhone: z.string().regex(/^[0-9+ -]{10,15}$/, "Please enter a valid phone number").optional().or(z.literal("")),
  isTaxReceiptRequested: z.boolean().default(false),
});

export const VolunteerSchema = z.object({
  fullName: z.string().min(2, "Full name is required").max(100),
  email: z.string().email("Valid email is required"),
  phone: z.string().regex(/^[0-9+ -]{10,15}$/, "Valid 10-digit mobile number required"),
  city: z.string().min(2, "City or region is required").max(80),
  interest: z.string().min(2, "Please select an area of contribution"),
  availability: z.string().optional(),
  message: z.string().max(800).optional(),
});

export const PartnerSchema = z.object({
  organizationName: z.string().min(2, "Organization name is required").max(120),
  contactName: z.string().min(2, "Contact person name is required").max(100),
  email: z.string().email("Official email is required"),
  phone: z.string().regex(/^[0-9+ -]{10,15}$/, "Valid phone number required").optional().or(z.literal("")),
  partnershipType: z.string().min(2, "Please choose a partnership scope"),
  message: z.string().max(1200).optional(),
});

export const ContactSchema = z.object({
  name: z.string().min(2, "Name is required").max(100),
  email: z.string().email("Valid email is required"),
  subject: z.string().max(150).optional(),
  message: z.string().min(5, "Message must be at least 5 characters").max(1500),
});
