import { NextRequest, NextResponse } from "next/server";
import { ManualTransferSchema } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rateLimit";
import { connectToDatabase } from "@/lib/db";
import Donation from "@/lib/models/Donation";
import memoryStore from "@/lib/memoryStore";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const { allowed } = checkRateLimit(ip, 10, 60 * 1000);
    if (!allowed) {
      return NextResponse.json({ error: "Too many submissions. Please wait a moment." }, { status: 429 });
    }

    const body = await req.json();
    const parsed = ManualTransferSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid transfer submission", details: parsed.error.format() }, { status: 400 });
    }

    const data = parsed.data;
    const internalId = `DRF-TRF-${Math.floor(10000 + Math.random() * 90000)}`;

    const db = await connectToDatabase();
    if (db) {
      // Check for duplicate UTR
      const existing = await Donation.findOne({ transferReference: data.transferReference });
      if (existing) {
        return NextResponse.json(
          { error: "A donation with this transaction reference has already been submitted." },
          { status: 409 }
        );
      }

      await Donation.create({
        internalId,
        donorName: data.donorName,
        donorEmail: data.donorEmail,
        donorPhone: data.donorPhone,
        amount: data.amount,
        currency: "INR",
        frequency: "one_time",
        paymentProvider: data.paymentProvider,
        transferReference: data.transferReference,
        paymentStatus: "awaiting_verification",
        campaign: "First Meal - Vidarbha",
        notes: data.notes,
      });
    } else {
      // In-memory store
      const isDuplicate = memoryStore.getDonations().some((d) => d.transferReference === data.transferReference);
      if (isDuplicate) {
        return NextResponse.json(
          { error: "A donation with this transaction reference has already been submitted." },
          { status: 409 }
        );
      }

      memoryStore.addDonation({
        internalId,
        donorName: data.donorName,
        donorEmail: data.donorEmail,
        donorPhone: data.donorPhone,
        amount: data.amount,
        currency: "INR",
        frequency: "one_time",
        paymentProvider: data.paymentProvider,
        transferReference: data.transferReference,
        paymentStatus: "awaiting_verification",
        campaign: "First Meal - Vidarbha",
        isTaxReceiptRequested: false,
        notes: data.notes,
      });
    }

    return NextResponse.json({
      success: true,
      internalId,
      amount: data.amount,
      donorName: data.donorName,
      status: "awaiting_verification",
      message: "Your transfer reference has been registered. An administrator will verify the receipt and send a confirmation to your email.",
    });
  } catch (error) {
    console.error("Manual transfer server error:", error);
    return NextResponse.json({ error: "Could not record manual transfer submission." }, { status: 500 });
  }
}
