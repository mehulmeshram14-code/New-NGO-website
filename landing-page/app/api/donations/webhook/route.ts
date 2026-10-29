import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Donation from "@/lib/models/Donation";
import WebhookEvent from "@/lib/models/WebhookEvent";
import memoryStore from "@/lib/memoryStore";
import {
  getRazorpayCredentials,
  verifyRazorpayWebhookSignature,
} from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  try {
    // 1. Read Raw Request Body
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");

    const { webhookSecret, isConfigured } = getRazorpayCredentials();

    if (!webhookSecret || !signature) {
      console.warn("Webhook rejected: missing signature or webhook secret configuration.");
      return NextResponse.json(
        { success: false, error: "Unauthorized webhook request." },
        { status: 401 }
      );
    }

    // 2. Cryptographic Webhook Signature Verification
    const isSignatureValid = verifyRazorpayWebhookSignature(rawBody, signature, webhookSecret);
    if (!isSignatureValid) {
      console.warn("Webhook signature mismatch detected. Request rejected.");
      return NextResponse.json(
        { success: false, error: "Invalid cryptographic webhook signature." },
        { status: 400 }
      );
    }

    // 3. Parse JSON Event Payload
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON webhook payload." },
        { status: 400 }
      );
    }

    const event = payload.event as string;
    const paymentEntity = payload.payload?.payment?.entity;
    const orderEntity = payload.payload?.order?.entity;

    const eventId =
      payload.event_id ||
      payload.id ||
      `evt_${event}_${paymentEntity?.id || orderEntity?.id}_${Date.now()}`;

    // 4. Deduplication / Idempotency Check
    const db = await connectToDatabase();

    if (db) {
      const existingEvent = await WebhookEvent.findOne({ eventId });
      if (existingEvent) {
        return NextResponse.json({
          success: true,
          status: "already_processed",
          message: "Event already processed.",
        });
      }
    } else {
      if (memoryStore.isWebhookEventProcessed(eventId)) {
        return NextResponse.json({
          success: true,
          status: "already_processed",
          message: "Event already processed.",
        });
      }
    }

    const orderId = paymentEntity?.order_id || orderEntity?.id;
    const paymentId = paymentEntity?.id;
    const amountInPaise = paymentEntity?.amount || orderEntity?.amount;

    // 5. Handle Specific Razorpay Payment Events
    if (orderId || paymentId) {
      // Find matching donation
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let donation: any = null;

      if (db) {
        donation = await Donation.findOne({
          $or: [
            ...(orderId ? [{ razorpayOrderId: orderId }, { providerOrderId: orderId }] : []),
            ...(paymentId ? [{ razorpayPaymentId: paymentId }, { providerPaymentId: paymentId }] : []),
            ...(paymentEntity?.notes?.donationReference
              ? [{ donationReference: paymentEntity.notes.donationReference }]
              : []),
          ],
        });
      } else {
        donation =
          (orderId ? memoryStore.findDonationByOrderId(orderId) : null) ||
          (paymentId ? memoryStore.findDonationByPaymentId(paymentId) : null) ||
          (paymentEntity?.notes?.donationReference
            ? memoryStore.findDonationByReference(paymentEntity.notes.donationReference)
            : null);
      }

      if (donation) {
        if (event === "payment.captured" || event === "order.paid") {
          // Idempotent capture update
          const capturedDate = paymentEntity?.created_at
            ? new Date(paymentEntity.created_at * 1000)
            : new Date();

          if (db) {
            await Donation.updateOne(
              { _id: donation._id },
              {
                $set: {
                  status: "captured",
                  paymentStatus: "successful",
                  razorpayPaymentId: paymentId || donation.razorpayPaymentId,
                  providerPaymentId: paymentId || donation.providerPaymentId,
                  capturedAt: donation.capturedAt || capturedDate,
                  verifiedAt: donation.verifiedAt || new Date(),
                  verifiedBy: "Razorpay Webhook (payment.captured)",
                },
              }
            );
          } else {
            memoryStore.markPaymentCaptured(
              donation.donationReference,
              paymentId || donation.razorpayPaymentId || "pay_webhook",
              "Razorpay Webhook (payment.captured)"
            );
          }
        } else if (event === "payment.authorized") {
          // Authorized but not captured
          if (donation.status !== "captured" && donation.paymentStatus !== "successful") {
            if (db) {
              await Donation.updateOne(
                { _id: donation._id },
                {
                  $set: {
                    status: "authorized",
                    razorpayPaymentId: paymentId || donation.razorpayPaymentId,
                    providerPaymentId: paymentId || donation.providerPaymentId,
                  },
                }
              );
            } else {
              memoryStore.updateDonationStatus(donation.donationReference, "authorized");
            }
          }
        } else if (event === "payment.failed") {
          // CRITICAL: Prevent delayed failure from overwriting a captured payment!
          if (donation.status !== "captured" && donation.paymentStatus !== "successful") {
            if (db) {
              await Donation.updateOne(
                { _id: donation._id },
                {
                  $set: {
                    status: "failed",
                    paymentStatus: "failed",
                    razorpayPaymentId: paymentId || donation.razorpayPaymentId,
                  },
                }
              );
            } else {
              memoryStore.updateDonationStatus(donation.donationReference, "failed");
            }
          }
        } else if (event === "refund.processed" || event === "payment.refunded") {
          if (db) {
            await Donation.updateOne(
              { _id: donation._id },
              {
                $set: {
                  status: "refunded",
                  paymentStatus: "refunded",
                },
              }
            );
          } else {
            memoryStore.updateDonationStatus(donation.donationReference, "refunded");
          }
        }
      }
    }

    // 6. Record Event in Webhook Audit Store
    if (db) {
      await WebhookEvent.create({
        eventId,
        eventType: event,
        orderId,
        paymentId,
        processedAt: new Date(),
        payload: {
          event,
          orderId,
          paymentId,
          amountInPaise,
        },
      });
    } else {
      memoryStore.recordWebhookEvent(eventId, {
        eventType: event,
        orderId,
        paymentId,
      });
    }

    return NextResponse.json({ success: true, received: true });
  } catch (error) {
    console.error("Critical error in Razorpay webhook handler:", error);
    return NextResponse.json(
      { success: false, error: "Internal webhook processing error." },
      { status: 500 }
    );
  }
}
