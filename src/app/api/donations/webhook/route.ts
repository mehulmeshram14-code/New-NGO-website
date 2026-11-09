import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import Donation from "@/lib/models/Donation";
import WebhookEvent from "@/lib/models/WebhookEvent";
import memoryStore from "@/lib/memoryStore";
import {
  captureAuthorizedPayment,
  getRazorpayCredentials,
  verifyRazorpayWebhookSignature,
} from "@/lib/razorpay";

type DonationStatus = "pending" | "authorized" | "captured" | "failed" | "refunded";
type PaymentStatus = "pending" | "successful" | "failed" | "refunded";

const ok = (body: Record<string, unknown> = {}) => NextResponse.json({ success: true, ...body });

function isDuplicateKeyError(err: unknown): boolean {
  return typeof err === "object" && err !== null && (err as { code?: number }).code === 11000;
}

export async function POST(req: NextRequest) {
  try {
    // 1. Verify the signature against the raw body before trusting anything in it.
    const rawBody = await req.text();
    const signature = req.headers.get("x-razorpay-signature");
    const { webhookSecret, isConfigured } = getRazorpayCredentials();

    if (!webhookSecret || !signature) {
      console.warn("Webhook rejected: missing signature or webhook secret configuration.");
      return NextResponse.json({ success: false, error: "Unauthorized webhook request." }, { status: 401 });
    }

    if (!verifyRazorpayWebhookSignature(rawBody, signature, webhookSecret)) {
      console.warn("Webhook signature mismatch detected. Request rejected.");
      return NextResponse.json({ success: false, error: "Invalid cryptographic webhook signature." }, { status: 400 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json({ success: false, error: "Invalid JSON webhook payload." }, { status: 400 });
    }

    const event: string = payload.event;
    const paymentEntity = payload.payload?.payment?.entity;
    const orderEntity = payload.payload?.order?.entity;
    const refundEntity = payload.payload?.refund?.entity;

    const orderId: string | undefined = paymentEntity?.order_id || orderEntity?.id;
    const paymentId: string | undefined = paymentEntity?.id || refundEntity?.payment_id;
    const amountInPaise: number | undefined = paymentEntity?.amount ?? orderEntity?.amount;

    // 2. Deduplicate. Razorpay sends the unique event ID in the `x-razorpay-event-id`
    // header (it is not in the body). The fallback is deterministic so that retries
    // of the same event still deduplicate.
    const eventId =
      req.headers.get("x-razorpay-event-id") ||
      payload.event_id ||
      `evt_${event}_${paymentId || orderId || "unknown"}_${payload.created_at ?? ""}`;

    // Throws (=> 500 => Razorpay retries) if a configured database is unreachable.
    const db = await connectToDatabase();

    const alreadyProcessed = db
      ? Boolean(await WebhookEvent.exists({ eventId }))
      : memoryStore.isWebhookEventProcessed(eventId);
    if (alreadyProcessed) {
      return ok({ status: "already_processed", message: "Event already processed." });
    }

    // 3. Find the donation this event belongs to.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let donation: any = null;
    if (orderId || paymentId) {
      const notesRef: string | undefined = paymentEntity?.notes?.donationReference;
      if (db) {
        donation = await Donation.findOne({
          $or: [
            ...(orderId ? [{ razorpayOrderId: orderId }, { providerOrderId: orderId }] : []),
            ...(paymentId ? [{ razorpayPaymentId: paymentId }, { providerPaymentId: paymentId }] : []),
            ...(notesRef ? [{ donationReference: notesRef }] : []),
          ],
        });
      } else {
        donation =
          (orderId ? memoryStore.findDonationByOrderId(orderId) : null) ||
          (paymentId ? memoryStore.findDonationByPaymentId(paymentId) : null) ||
          (notesRef ? memoryStore.findDonationByReference(notesRef) : null);
      }
    }

    if (donation) {
      const isCaptured = donation.status === "captured" || donation.paymentStatus === "successful";
      const isRefunded = donation.status === "refunded" || donation.paymentStatus === "refunded";
      const expectedPaise: number = donation.amountPaise || Math.round(donation.amount * 100);

      const setStatus = async (
        status: DonationStatus,
        paymentStatus: PaymentStatus | undefined,
        extra: Record<string, unknown> = {},
        verifiedBy?: string
      ) => {
        if (db) {
          await Donation.updateOne(
            { _id: donation._id },
            { $set: { status, ...(paymentStatus ? { paymentStatus } : {}), ...extra } }
          );
        } else if (status === "captured") {
          memoryStore.markPaymentCaptured(
            donation.donationReference,
            paymentId || donation.razorpayPaymentId || "pay_webhook",
            verifiedBy || "Razorpay Webhook"
          );
        } else {
          memoryStore.updateDonationStatus(donation.donationReference, status);
        }
      };

      const markCaptured = (verifiedBy: string) => {
        const capturedAt = paymentEntity?.created_at ? new Date(paymentEntity.created_at * 1000) : new Date();
        return setStatus(
          "captured",
          "successful",
          {
            razorpayPaymentId: paymentId || donation.razorpayPaymentId,
            providerPaymentId: paymentId || donation.providerPaymentId,
            capturedAt: donation.capturedAt || capturedAt,
            verifiedAt: donation.verifiedAt || new Date(),
            verifiedBy,
          },
          verifiedBy
        );
      };

      switch (event) {
        case "payment.captured":
        case "order.paid":
          // A refund is final: a late or retried capture event must not resurrect it.
          if (!isRefunded && !isCaptured) {
            await markCaptured(`Razorpay Webhook (${event})`);
          }
          break;

        case "payment.authorized":
          if (!isCaptured && !isRefunded) {
            // Covers donors who closed the browser before /verify-payment ran:
            // capture here so the payment is not auto-refunded.
            if (isConfigured && paymentId && Number(amountInPaise) === expectedPaise) {
              const status = await captureAuthorizedPayment(paymentId, expectedPaise);
              if (status === "captured") {
                await markCaptured("Razorpay Webhook (payment.authorized → captured)");
                break;
              }
            }
            await setStatus("authorized", undefined, {
              razorpayPaymentId: paymentId || donation.razorpayPaymentId,
              providerPaymentId: paymentId || donation.providerPaymentId,
            });
          }
          break;

        case "payment.failed":
          // A delayed failure for an earlier attempt must not overwrite a capture.
          if (!isCaptured && !isRefunded) {
            await setStatus("failed", "failed", { razorpayPaymentId: paymentId || donation.razorpayPaymentId });
          }
          break;

        case "refund.processed": {
          // Only a full refund marks the donation refunded; partial refunds keep it captured.
          const refundedPaise = Number(paymentEntity?.amount_refunded ?? refundEntity?.amount ?? 0);
          if (refundedPaise >= expectedPaise) {
            await setStatus("refunded", "refunded");
          }
          break;
        }
      }
    }

    // 4. Record the event so redeliveries are acknowledged without reprocessing.
    if (db) {
      try {
        await WebhookEvent.create({
          eventId,
          eventType: event,
          orderId,
          paymentId,
          processedAt: new Date(),
          payload: { event, orderId, paymentId, amountInPaise },
        });
      } catch (err) {
        // Two deliveries of the same event raced; the updates above are idempotent.
        if (!isDuplicateKeyError(err)) throw err;
      }
    } else {
      memoryStore.recordWebhookEvent(eventId, { eventType: event, orderId, paymentId });
    }

    return ok({ received: true });
  } catch (error) {
    console.error("Critical error in Razorpay webhook handler:", error);
    return NextResponse.json({ success: false, error: "Internal webhook processing error." }, { status: 500 });
  }
}
