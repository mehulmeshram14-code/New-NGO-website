import { z } from "zod";
import { CONTACT_SUBJECTS } from "@/data/contactForm";
import { formatINR, MAX_DONATION, MIN_DONATION } from "@/data/donation";
import { CAMPAIGN_IDS } from "@/data/campaigns";

/** Strips spaces, dashes and brackets, then expects 10–13 digits with an optional leading "+". */
export const PhoneSchema = z
  .string({ message: "Please enter your phone number." })
  .trim()
  .transform((v) => v.replace(/[\s\-()]/g, ""))
  .pipe(z.string().regex(/^\+?\d{10,13}$/, "Please enter a valid phone number."));

export const CreateDonationOrderSchema = z.object({
  // Name and phone are required so every donation has a contact for its receipt.
  donorName: z
    .string({ message: "Please enter your name." })
    .trim()
    .min(2, "Please enter your name.")
    .max(100, "Name must not exceed 100 characters"),
  donorEmail: z
    .string()
    .trim()
    .email("Please provide a valid email address")
    .optional()
    .or(z.literal(""))
    .default(""),
  donorPhone: PhoneSchema,
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
    .min(MIN_DONATION, `Minimum donation amount is ${formatINR(MIN_DONATION)} (one meal).`)
    .max(MAX_DONATION, `For donations above ${formatINR(MAX_DONATION)}, please contact our team directly.`),
  frequency: z.enum(["one_time", "monthly"]).default("one_time"),
  // Only known campaigns; the server derives the stored name from src/data/campaigns.ts.
  campaignId: z.enum(CAMPAIGN_IDS, { message: "Unknown campaign." }).default("general"),
  isTaxReceiptRequested: z.boolean().default(false),
});

export const VerifyPaymentSchema = z.object({
  donationReference: z.string().min(3).optional(),
  internalId: z.string().min(3).optional(),
  razorpay_order_id: z.string().min(5, "Razorpay Order ID is required"),
  razorpay_payment_id: z.string().min(5, "Razorpay Payment ID is required"),
  razorpay_signature: z.string().min(10, "Razorpay Signature is required"),
});

/** Matches the fields of the "Contact Us" Google Form (see src/data/contactForm.ts). */
export const ContactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100, "Name is too long."),
  email: z.string().trim().email("Please enter a valid email address.").max(150),
  subject: z.enum(CONTACT_SUBJECTS, { message: "Please choose a subject." }),
  message: z
    .string()
    .trim()
    .min(10, "Please write a message of at least 10 characters.")
    .max(2000, "Please keep your message under 2000 characters."),
  // Honeypot: hidden from people, filled in by naive spam bots.
  website: z.string().max(0).optional().or(z.literal("")),
});

export type ContactInput = z.infer<typeof ContactSchema>;
