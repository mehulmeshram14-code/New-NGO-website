import { NextRequest, NextResponse } from "next/server";
import { CreateDonationOrderSchema } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rateLimit";
import { connectToDatabase } from "@/lib/db";
import Donation from "@/lib/models/Donation";
import memoryStore from "@/lib/memoryStore";
import { getRazorpayCredentials, getRazorpayClient } from "@/lib/razorpay";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    // 1. IP Rate Limiting (15 order creation requests per minute per IP)
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
    const { allowed } = checkRateLimit(ip, 15, 60 * 1000);
    if (!allowed) {
      return NextResponse.json(
        { success: false, error: "Too many donation requests. Please wait a moment." },
        { status: 429 }
      );
    }

    // 2. Parse & Validate Payload on Server
    let rawJson: unknown;
    try {
      rawJson = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Malformed JSON payload in request." },
        { status: 400 }
      );
    }

    const parsed = CreateDonationOrderSchema.safeParse(rawJson);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return NextResponse.json(
        {
          success: false,
          error: issue?.message || "Invalid donation form data.",
          field: issue?.path.join("."),
        },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // 3. Amount Validation and Integer Arithmetic Conversion to Paise
    if (!Number.isFinite(data.amount) || data.amount <= 0) {
      return NextResponse.json(
        { success: false, error: "Donation amount must be a finite, positive number." },
        { status: 400 }
      );
    }

    const MIN_AMOUNT_INR = 10;
    const MAX_AMOUNT_INR = 500000;

    if (data.amount < MIN_AMOUNT_INR || data.amount > MAX_AMOUNT_INR) {
      return NextResponse.json(
        {
          success: false,
          error: `Donation amount must be between ₹${MIN_AMOUNT_INR} and ₹${MAX_AMOUNT_INR.toLocaleString("en-IN")}.`,
        },
        { status: 400 }
      );
    }

    const amountPaise = Math.round(data.amount * 100);

    // 4. Generate Unique Internal Donation Reference
    const randomHex = crypto.randomBytes(3).toString("hex").toUpperCase();
    const timestampToken = Date.now().toString(36).toUpperCase();
    const donationReference = `DRF-ORD-${timestampToken}-${randomHex}`;

    // 5. Razorpay Live Configuration Check
    const { keyId, isConfigured, mode } = getRazorpayCredentials();

    let providerOrderId = "";

    if (isConfigured) {
      try {
        const razorpay = getRazorpayClient();
        const order = await razorpay.orders.create({
          amount: amountPaise,
          currency: "INR",
          receipt: donationReference,
          notes: {
            donationReference,
            donorName: data.donorName || "Generous Supporter",
            donorEmail: data.donorEmail || "",
            donorPhone: data.donorPhone || "",
            campaign: data.campaign,
          },
        });

        if (!order || !order.id) {
          throw new Error("Razorpay returned an empty order payload.");
        }

        providerOrderId = order.id;
      } catch (gatewayErr: unknown) {
        console.error("Razorpay order creation failed:", (gatewayErr as Error)?.message || gatewayErr);
        return NextResponse.json(
          {
            success: false,
            error: "Payment gateway communication error. Please try again or use direct bank transfer.",
          },
          { status: 502 }
        );
      }
    } else {
      // In automated test suite mode only:
      if (process.env.ALLOW_PAYMENT_SIMULATION === "true") {
        providerOrderId = `order_sim_${crypto.randomBytes(8).toString("hex")}`;
      } else {
        return NextResponse.json(
          {
            success: false,
            error: "Live payment gateway is not configured. Please enter your RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local to accept donations.",
          },
          { status: 503 }
        );
      }
    }

    // 6. Record Pending Donation in Database (MongoDB Atlas with resilient in-memory fallback)
    const db = await connectToDatabase();
    if (db) {
      await Donation.create({
        donationReference,
        internalId: donationReference,
        donorName: data.donorName,
        donorEmail: data.donorEmail || "anonymous@deeprootsfoundation.org",
        donorPhone: data.donorPhone,
        donorPan: data.donorPan,
        amount: data.amount,
        amountPaise,
        currency: "INR",
        frequency: data.frequency,
        paymentProvider: "razorpay",
        razorpayOrderId: providerOrderId,
        providerOrderId: providerOrderId,
        status: "pending",
        paymentStatus: "pending",
        campaign: data.campaign,
        isTaxReceiptRequested: data.isTaxReceiptRequested,
      });
    } else {
      memoryStore.addDonation({
        donationReference,
        internalId: donationReference,
        donorName: data.donorName,
        donorEmail: data.donorEmail || "anonymous@deeprootsfoundation.org",
        donorPhone: data.donorPhone,
        donorPan: data.donorPan,
        amount: data.amount,
        amountPaise,
        currency: "INR",
        frequency: data.frequency,
        paymentProvider: "razorpay",
        razorpayOrderId: providerOrderId,
        providerOrderId: providerOrderId,
        status: "pending",
        paymentStatus: "pending",
        campaign: data.campaign,
        isTaxReceiptRequested: data.isTaxReceiptRequested,
      });
    }

    // 7. Return safe checkout information to the frontend
    return NextResponse.json({
      success: true,
      orderId: providerOrderId,
      amount: amountPaise,
      currency: "INR",
      keyId: isConfigured ? keyId : "rzp_test_simulation",
      donationReference,
      isLiveGateway: isConfigured,
      gatewayMode: mode,
    });
  } catch (error) {
    console.error("Critical error in create-order API:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected server error occurred while creating your order." },
      { status: 500 }
    );
  }
}
