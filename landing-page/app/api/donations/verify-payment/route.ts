import { NextRequest, NextResponse } from "next/server";
import { VerifyPaymentSchema } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rateLimit";
import { connectToDatabase } from "@/lib/db";
import Donation from "@/lib/models/Donation";
import memoryStore from "@/lib/memoryStore";
import {
  getRazorpayCredentials,
  getRazorpayClient,
  verifyRazorpayPaymentSignature,
} from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    // 1. IP Rate Limiting (20 verification attempts per minute per IP)
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || "127.0.0.1";
    const { allowed } = checkRateLimit(ip, 20, 60 * 1000);
    if (!allowed) {
      return NextResponse.json(
        { success: false, error: "Too many verification attempts. Please wait a moment." },
        { status: 429 }
      );
    }

    // 2. Parse & Validate Payload
    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Malformed JSON payload in request." },
        { status: 400 }
      );
    }

    const parsed = VerifyPaymentSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid payment verification parameters.",
          details: parsed.error.issues[0]?.message,
        },
        { status: 400 }
      );
    }

    const {
      donationReference,
      internalId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = parsed.data;

    const reference = donationReference || internalId;

    // 3. Retrieve Internal Donation Record
    const db = await connectToDatabase();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let existingDonation: any = null;

    if (db) {
      if (reference) {
        existingDonation = await Donation.findOne({
          $or: [
            { donationReference: reference },
            { internalId: reference },
            { razorpayOrderId: razorpay_order_id },
            { providerOrderId: razorpay_order_id },
          ],
        });
      } else {
        existingDonation = await Donation.findOne({
          $or: [
            { razorpayOrderId: razorpay_order_id },
            { providerOrderId: razorpay_order_id },
          ],
        });
      }
    } else {
      if (reference) {
        existingDonation =
          memoryStore.findDonationByReference(reference) ||
          memoryStore.findDonationByOrderId(razorpay_order_id);
      } else {
        existingDonation = memoryStore.findDonationByOrderId(razorpay_order_id);
      }
    }

    if (!existingDonation) {
      return NextResponse.json(
        { success: false, error: "No matching donation record found for this order." },
        { status: 404 }
      );
    }

    // 4. Validate that the Razorpay Order ID belongs to this donation
    const expectedOrderId = existingDonation.razorpayOrderId || existingDonation.providerOrderId;
    if (expectedOrderId && expectedOrderId !== razorpay_order_id) {
      console.warn(
        `Order mismatch: donation expects ${expectedOrderId}, received ${razorpay_order_id}`
      );
      return NextResponse.json(
        { success: false, error: "Payment verification failed: order ID mismatch." },
        { status: 400 }
      );
    }

    // 5. Check Idempotency: If already confirmed as captured, return confirmation
    if (existingDonation.status === "captured" || existingDonation.paymentStatus === "successful") {
      return NextResponse.json({
        success: true,
        alreadyVerified: true,
        status: "captured",
        donationReference: existingDonation.donationReference || existingDonation.internalId,
        orderId: razorpay_order_id,
        paymentId: existingDonation.razorpayPaymentId || razorpay_payment_id,
        amount: existingDonation.amount,
        amountPaise: existingDonation.amountPaise,
        currency: existingDonation.currency || "INR",
        donorName: existingDonation.donorName,
        message: "Thank you for supporting Deep Roots Foundation. Your donation has been successfully received.",
      });
    }

    // 6. Cryptographic Signature Verification
    const { keySecret, isConfigured } = getRazorpayCredentials();

    let isSignatureValid = false;

    if (isConfigured && keySecret) {
      isSignatureValid = verifyRazorpayPaymentSignature(
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        keySecret
      );
    } else if (process.env.ALLOW_PAYMENT_SIMULATION === "true") {
      isSignatureValid =
        razorpay_signature === `sig_test_${razorpay_order_id.slice(-6)}` ||
        razorpay_signature.startsWith("sig_test_");
    }

    if (!isSignatureValid) {
      console.warn(`Invalid Razorpay payment signature for order ${razorpay_order_id}`);
      return NextResponse.json(
        {
          success: false,
          error: "Invalid cryptographic payment signature. Transaction could not be verified.",
        },
        { status: 400 }
      );
    }

    // 7. Server-Side Payment Status Confirmation via Razorpay API
    let paymentStatusFromGateway = "captured";

    if (isConfigured) {
      try {
        const razorpay = getRazorpayClient();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const payment: any = await razorpay.payments.fetch(razorpay_payment_id);

        if (!payment) {
          throw new Error("Unable to retrieve payment details from Razorpay API.");
        }

        // Verify order ID matches
        if (payment.order_id && payment.order_id !== razorpay_order_id) {
          return NextResponse.json(
            { success: false, error: "Payment does not match the expected order on the gateway." },
            { status: 400 }
          );
        }

        // Verify currency matches
        if (payment.currency && payment.currency.toUpperCase() !== "INR") {
          return NextResponse.json(
            { success: false, error: "Payment currency mismatch." },
            { status: 400 }
          );
        }

        // Verify amount in paise matches
        const expectedPaise = existingDonation.amountPaise || Math.round(existingDonation.amount * 100);
        if (Number(payment.amount) !== expectedPaise) {
          console.warn(
            `Amount mismatch: expected ${expectedPaise} paise, received ${payment.amount} paise`
          );
          return NextResponse.json(
            { success: false, error: "Payment amount does not match expected donation amount." },
            { status: 400 }
          );
        }

        paymentStatusFromGateway = payment.status; // e.g. 'captured', 'authorized', 'failed'
      } catch (apiErr: unknown) {
        console.error("Razorpay payments.fetch error:", (apiErr as Error)?.message || apiErr);
        return NextResponse.json(
          {
            success: false,
            error: "Unable to confirm payment status with gateway. Please contact support.",
          },
          { status: 502 }
        );
      }
    }

    // 8. Handle Gateway Payment Status (captured vs authorized vs failed)
    const finalCapturedDate = new Date();

    if (paymentStatusFromGateway === "captured") {
      // Payment is confirmed captured
      if (db) {
        await Donation.updateOne(
          { _id: existingDonation._id },
          {
            $set: {
              status: "captured",
              paymentStatus: "successful",
              razorpayPaymentId: razorpay_payment_id,
              providerPaymentId: razorpay_payment_id,
              capturedAt: finalCapturedDate,
              verifiedAt: finalCapturedDate,
              verifiedBy: "Razorpay Signature & Capture API",
            },
          }
        );
      } else {
        memoryStore.markPaymentCaptured(
          existingDonation.donationReference,
          razorpay_payment_id,
          "Razorpay Signature & Capture API"
        );
      }

      return NextResponse.json({
        success: true,
        status: "captured",
        donationReference: existingDonation.donationReference || existingDonation.internalId,
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        amount: existingDonation.amount,
        amountPaise: existingDonation.amountPaise,
        currency: existingDonation.currency || "INR",
        donorName: existingDonation.donorName,
        capturedAt: finalCapturedDate.toISOString(),
        message: "Thank you for supporting Deep Roots Foundation. Your donation has been successfully received.",
      });
    } else if (paymentStatusFromGateway === "authorized") {
      // Payment is authorized but not yet captured
      if (db) {
        await Donation.updateOne(
          { _id: existingDonation._id },
          {
            $set: {
              status: "authorized",
              paymentStatus: "pending",
              razorpayPaymentId: razorpay_payment_id,
              providerPaymentId: razorpay_payment_id,
            },
          }
        );
      } else {
        existingDonation.status = "authorized";
        existingDonation.razorpayPaymentId = razorpay_payment_id;
      }

      return NextResponse.json({
        success: false,
        pending: true,
        status: "authorized",
        donationReference: existingDonation.donationReference || existingDonation.internalId,
        message: "Your payment has been authorized by your bank, but confirmation is pending settlement. Please check back shortly.",
      });
    } else {
      // Payment failed or cancelled
      if (db) {
        await Donation.updateOne(
          { _id: existingDonation._id },
          {
            $set: {
              status: "failed",
              paymentStatus: "failed",
              razorpayPaymentId: razorpay_payment_id,
            },
          }
        );
      } else {
        memoryStore.updateDonationStatus(existingDonation.donationReference, "failed");
      }

      return NextResponse.json(
        {
          success: false,
          status: "failed",
          error: "Payment could not be completed or was declined by the bank.",
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Critical error in verify-payment API:", error);
    return NextResponse.json(
      { success: false, error: "An unexpected server error occurred during payment verification." },
      { status: 500 }
    );
  }
}
