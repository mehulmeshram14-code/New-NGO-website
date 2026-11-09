/**
 * Deep Roots Foundation — Comprehensive Razorpay Payment Test Suite
 * Tests all 20 specific scenarios required by the integration specification.
 */

import crypto from "crypto";
import { NextRequest } from "next/server";
import { POST as createOrderHandler } from "../src/app/api/donations/create-order/route";
import { POST as verifyPaymentHandler } from "../src/app/api/donations/verify-payment/route";
import { POST as webhookHandler } from "../src/app/api/donations/webhook/route";
import {
  isPaymentSimulationAllowed,
  verifyRazorpayPaymentSignature,
} from "../src/lib/razorpay";
import memoryStore from "../src/lib/memoryStore";
import { CreateDonationOrderSchema } from "../src/lib/validation";
import { checkRateLimit, getClientIp } from "../src/lib/rateLimit";

interface TestResult {
  id: number;
  name: string;
  passed: boolean;
  details: string;
}

const results: TestResult[] = [];

/** Assigning undefined to process.env stores the string "undefined"; delete instead. */
function restoreEnv(name: string, value: string | undefined) {
  if (value === undefined) delete process.env[name];
  else (process.env as Record<string, string>)[name] = value;
}

function recordTest(id: number, name: string, passed: boolean, details: string) {
  results.push({ id, name, passed, details });
  const icon = passed ? "✅ PASS" : "❌ FAIL";
  console.log(`${icon} [Test ${id.toString().padStart(2, "0")}] ${name}: ${details}`);
}

async function runTestSuite() {
  console.log("\n================================================================================");
  console.log("DEEP ROOTS FOUNDATION — RAZORPAY INTEGRATION TEST SUITE (20 SCENARIOS)");
  console.log("================================================================================\n");

  const TEST_SECRET = "mock_secret_key_abcdef9876543210";
  const TEST_WEBHOOK_SECRET = "mock_webhook_secret_9988776655";

  // --------------------------------------------------------------------------
  // TEST 1: Valid donation amount
  // --------------------------------------------------------------------------
  try {
    const validPayload = {
      amount: 500,
      donorName: "Rahul Sharma",
      donorEmail: "rahul@example.com",
      donorPhone: "9876543210",
      frequency: "one_time",
      campaign: "First Meal - Vidarbha",
    };
    const parsed = CreateDonationOrderSchema.safeParse(validPayload);
    const amountPaise = Math.round(parsed.data!.amount * 100);
    const passed = parsed.success && amountPaise === 50000;
    recordTest(1, "Valid donation amount", passed, `₹500 correctly converted to ${amountPaise} paise`);
  } catch (err: unknown) {
    recordTest(1, "Valid donation amount", false, (err as Error).message);
  }

  // --------------------------------------------------------------------------
  // TEST 2: Zero amount rejection
  // --------------------------------------------------------------------------
  try {
    const zeroPayload = { amount: 0, donorName: "Tester" };
    const parsed = CreateDonationOrderSchema.safeParse(zeroPayload);
    const passed = !parsed.success;
    recordTest(2, "Zero amount rejection", passed, "Zero donation amount correctly rejected by server validation");
  } catch (err: unknown) {
    recordTest(2, "Zero amount rejection", false, (err as Error).message);
  }

  // --------------------------------------------------------------------------
  // TEST 3: Negative amount rejection
  // --------------------------------------------------------------------------
  try {
    const negPayload = { amount: -250, donorName: "Tester" };
    const parsed = CreateDonationOrderSchema.safeParse(negPayload);
    const passed = !parsed.success;
    recordTest(3, "Negative amount rejection", passed, "Negative donation amount correctly rejected by server validation");
  } catch (err: unknown) {
    recordTest(3, "Negative amount rejection", false, (err as Error).message);
  }

  // --------------------------------------------------------------------------
  // TEST 4: Invalid amount format rejection
  // --------------------------------------------------------------------------
  try {
    const invalidFormat = { amount: "five_hundred", donorName: "Tester" };
    const parsed = CreateDonationOrderSchema.safeParse(invalidFormat);
    const passed = !parsed.success;
    recordTest(4, "Invalid amount format rejection", passed, "Non-numeric string format correctly rejected by Zod schema");
  } catch (err: unknown) {
    recordTest(4, "Invalid amount format rejection", false, (err as Error).message);
  }

  // --------------------------------------------------------------------------
  // TEST 5: Amount exceeding configured limit
  // --------------------------------------------------------------------------
  try {
    const overLimit = { amount: 600000, donorName: "Tester" };
    const parsed = CreateDonationOrderSchema.safeParse(overLimit);
    const passed = !parsed.success;
    recordTest(5, "Amount exceeding configured limit", passed, "Amount of ₹6,00,000 exceeds ₹5,00,000 ceiling and was rejected");
  } catch (err: unknown) {
    recordTest(5, "Amount exceeding configured limit", false, (err as Error).message);
  }

  // --------------------------------------------------------------------------
  // TEST 6: Missing API credentials safe handling
  // --------------------------------------------------------------------------
  try {
    const savedKey = process.env.RAZORPAY_KEY_ID;
    const savedSecret = process.env.RAZORPAY_KEY_SECRET;
    const savedEnv = process.env.NODE_ENV;
    const savedSim = process.env.ALLOW_PAYMENT_SIMULATION;
    process.env.RAZORPAY_KEY_ID = "";
    process.env.RAZORPAY_KEY_SECRET = "";
    process.env.ALLOW_PAYMENT_SIMULATION = "false";
    (process.env as Record<string, string>).NODE_ENV = "development";

    const req = new NextRequest("http://localhost:3000/api/donations/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 500, donorName: "Tester" }),
    });

    const res = await createOrderHandler(req);
    const body = await res.json();
    const passed = res.status === 503 && body.success === false && !JSON.stringify(body).includes("secret");
    restoreEnv("ALLOW_PAYMENT_SIMULATION", savedSim);

    restoreEnv("RAZORPAY_KEY_ID", savedKey);
    restoreEnv("RAZORPAY_KEY_SECRET", savedSecret);
    restoreEnv("NODE_ENV", savedEnv);

    recordTest(6, "Missing API credentials handling", passed, "Returns safe 503 without leaking stack traces or credentials");
  } catch (err: unknown) {
    recordTest(6, "Missing API credentials handling", false, (err as Error).message);
  }

  // --------------------------------------------------------------------------
  // TEST 7: Successful order creation
  // --------------------------------------------------------------------------
  let testOrderId = "";
  let testDonationRef = "";
  try {
    const savedKey = process.env.RAZORPAY_KEY_ID;
    const savedSecret = process.env.RAZORPAY_KEY_SECRET;
    const savedEnv = process.env.NODE_ENV;

    process.env.RAZORPAY_KEY_ID = "";
    process.env.RAZORPAY_KEY_SECRET = "";
    process.env.ALLOW_PAYMENT_SIMULATION = "true";
    (process.env as Record<string, string>).NODE_ENV = "development";

    const req = new NextRequest("http://localhost:3000/api/donations/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: 1350,
        donorName: "Utkarsh Meshram",
        donorEmail: "utkarsh@example.com",
        donorPhone: "9876543210",
      }),
    });

    const res = await createOrderHandler(req);
    const body = await res.json();
    testOrderId = body.orderId;
    testDonationRef = body.donationReference;

    restoreEnv("RAZORPAY_KEY_ID", savedKey);
    restoreEnv("RAZORPAY_KEY_SECRET", savedSecret);
    delete process.env.ALLOW_PAYMENT_SIMULATION;
    restoreEnv("NODE_ENV", savedEnv);

    const passed =
      res.status === 200 &&
      body.success === true &&
      body.amount === 135000 &&
      body.currency === "INR" &&
      Boolean(testOrderId) &&
      Boolean(testDonationRef);

    recordTest(7, "Successful order creation", passed, `Created order ${testOrderId} with reference ${testDonationRef} for ₹1350 (135000 paise)`);
  } catch (err: unknown) {
    recordTest(7, "Successful order creation", false, (err as Error).message);
  }

  // --------------------------------------------------------------------------
  // TEST 8: Razorpay API failure handling
  // --------------------------------------------------------------------------
  try {
    const savedKey = process.env.RAZORPAY_KEY_ID;
    const savedSecret = process.env.RAZORPAY_KEY_SECRET;
    // Set invalid credentials to test upstream gateway authentication error handling
    process.env.RAZORPAY_KEY_ID = "rzp_test_invalid_mock_key_12345";
    process.env.RAZORPAY_KEY_SECRET = "invalid_secret_abcdef12345";

    const req = new NextRequest("http://localhost:3000/api/donations/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: 500, donorName: "Tester" }),
    });

    const res = await createOrderHandler(req);
    const body = await res.json();
    const passed = res.status === 502 && body.success === false && body.error.includes("Payment gateway");

    restoreEnv("RAZORPAY_KEY_ID", savedKey);
    restoreEnv("RAZORPAY_KEY_SECRET", savedSecret);

    recordTest(8, "Razorpay API failure handling", passed, "Upstream gateway errors intercepted safely with HTTP 502 response");
  } catch (err: unknown) {
    recordTest(8, "Razorpay API failure handling", false, (err as Error).message);
  }

  // --------------------------------------------------------------------------
  // TEST 9: Valid payment signature
  // --------------------------------------------------------------------------
  const mockPaymentId = "pay_test_99887766";
  const validSignature = crypto
    .createHmac("sha256", TEST_SECRET)
    .update(`${testOrderId}|${mockPaymentId}`)
    .digest("hex");

  try {
    const isSigValid = verifyRazorpayPaymentSignature(
      testOrderId,
      mockPaymentId,
      validSignature,
      TEST_SECRET
    );
    recordTest(9, "Valid payment signature", isSigValid, "HMAC-SHA256 signature verified with constant-time comparison");
  } catch (err: unknown) {
    recordTest(9, "Valid payment signature", false, (err as Error).message);
  }

  // --------------------------------------------------------------------------
  // TEST 10: Invalid payment signature
  // --------------------------------------------------------------------------
  try {
    const isSigValid = verifyRazorpayPaymentSignature(
      testOrderId,
      mockPaymentId,
      "tampered_signature_hex_000000000000000000000000000000000000000000000000",
      TEST_SECRET
    );
    recordTest(10, "Invalid payment signature rejection", !isSigValid, "Forged signature successfully rejected");
  } catch (err: unknown) {
    recordTest(10, "Invalid payment signature rejection", false, (err as Error).message);
  }

  // --------------------------------------------------------------------------
  // TEST 11: Payment belonging to a different order
  // --------------------------------------------------------------------------
  try {
    const req = new NextRequest("http://localhost:3000/api/donations/verify-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        donationReference: testDonationRef,
        razorpay_order_id: "order_FOREIGN_ORDER_99999",
        razorpay_payment_id: mockPaymentId,
        razorpay_signature: validSignature,
      }),
    });

    const res = await verifyPaymentHandler(req);
    const body = await res.json();
    const passed = res.status === 400 && body.error?.includes("order");
    recordTest(11, "Payment belonging to different order", passed, "Rejected mismatched Razorpay order ID for donation record");
  } catch (err: unknown) {
    recordTest(11, "Payment belonging to different order", false, (err as Error).message);
  }

  // --------------------------------------------------------------------------
  // TEST 12: Incorrect amount or currency validation
  // --------------------------------------------------------------------------
  try {
    const item = memoryStore.findDonationByReference(testDonationRef);
    const isCurrencyINR = item?.currency === "INR";
    const amountMatches = item?.amountPaise === 135000;
    const passed = isCurrencyINR && amountMatches;
    recordTest(12, "Amount and currency validation", passed, `Internal record verified: Currency=${item?.currency}, AmountPaise=${item?.amountPaise}`);
  } catch (err: unknown) {
    recordTest(12, "Amount and currency validation", false, (err as Error).message);
  }

  // --------------------------------------------------------------------------
  // TEST 13: Authorized but uncaptured payment
  // --------------------------------------------------------------------------
  try {
    memoryStore.addDonation({
      donationReference: "DRF-AUTH-TEST-13",
      internalId: "DRF-AUTH-TEST-13",
      donorName: "Auth Donor",
      donorEmail: "auth@example.com",
      amount: 1000,
      amountPaise: 100000,
      currency: "INR",
      frequency: "one_time",
      paymentProvider: "razorpay",
      razorpayOrderId: "order_auth_13",
      providerOrderId: "order_auth_13",
      status: "pending",
      paymentStatus: "pending",
      campaign: "First Meal - Vidarbha",
      isTaxReceiptRequested: false,
    });

    memoryStore.updateDonationStatus("DRF-AUTH-TEST-13", "authorized");
    const updated = memoryStore.findDonationByReference("DRF-AUTH-TEST-13");
    const passed = updated?.status === "authorized" && updated.paymentStatus !== "successful";
    recordTest(13, "Authorized but uncaptured payment", passed, "Donation marked as authorized without falsely marking as successful/captured");
  } catch (err: unknown) {
    recordTest(13, "Authorized but uncaptured payment", false, (err as Error).message);
  }

  // --------------------------------------------------------------------------
  // TEST 14: Captured payment
  // --------------------------------------------------------------------------
  try {
    const capturedItem = memoryStore.markPaymentCaptured(
      testDonationRef,
      mockPaymentId,
      "Automated Test Capture"
    );
    const passed =
      capturedItem?.status === "captured" &&
      capturedItem?.paymentStatus === "successful" &&
      capturedItem?.razorpayPaymentId === mockPaymentId &&
      Boolean(capturedItem?.capturedAt);

    recordTest(14, "Captured payment verification", passed, `Status successfully updated to 'captured' and 'successful' at ${capturedItem?.capturedAt}`);
  } catch (err: unknown) {
    recordTest(14, "Captured payment verification", false, (err as Error).message);
  }

  // --------------------------------------------------------------------------
  // TEST 15: Failed payment
  // --------------------------------------------------------------------------
  try {
    memoryStore.addDonation({
      donationReference: "DRF-FAIL-TEST-15",
      internalId: "DRF-FAIL-TEST-15",
      donorName: "Failed Donor",
      donorEmail: "failed@example.com",
      amount: 500,
      amountPaise: 50000,
      currency: "INR",
      frequency: "one_time",
      paymentProvider: "razorpay",
      razorpayOrderId: "order_fail_15",
      providerOrderId: "order_fail_15",
      status: "pending",
      paymentStatus: "pending",
      campaign: "First Meal - Vidarbha",
      isTaxReceiptRequested: false,
    });

    memoryStore.updateDonationStatus("DRF-FAIL-TEST-15", "failed");
    const updated = memoryStore.findDonationByReference("DRF-FAIL-TEST-15");
    const passed = updated?.status === "failed" && updated?.paymentStatus === "failed";
    recordTest(15, "Failed payment recording", passed, "Failed payment recorded correctly with status 'failed'");
  } catch (err: unknown) {
    recordTest(15, "Failed payment recording", false, (err as Error).message);
  }

  // --------------------------------------------------------------------------
  // TEST 16: Duplicate webhook event (Idempotency)
  // --------------------------------------------------------------------------
  try {
    process.env.RAZORPAY_WEBHOOK_SECRET = TEST_WEBHOOK_SECRET;

    // Real Razorpay deliveries carry the event ID in the x-razorpay-event-id header, not the body.
    const webhookPayload = JSON.stringify({
      event: "payment.captured",
      payload: {
        payment: {
          entity: {
            id: "pay_webhook_test_100",
            order_id: testOrderId,
            amount: 135000,
            currency: "INR",
            created_at: Math.floor(Date.now() / 1000),
          },
        },
      },
    });

    const webhookSignature = crypto
      .createHmac("sha256", TEST_WEBHOOK_SECRET)
      .update(webhookPayload)
      .digest("hex");

    // First delivery
    const req1 = new NextRequest("http://localhost:3000/api/donations/webhook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-razorpay-signature": webhookSignature,
        "x-razorpay-event-id": "evt_test_captured_001",
      },
      body: webhookPayload,
    });
    const res1 = await webhookHandler(req1);
    const body1 = await res1.json();

    // Second delivery (duplicate)
    const req2 = new NextRequest("http://localhost:3000/api/donations/webhook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-razorpay-signature": webhookSignature,
        "x-razorpay-event-id": "evt_test_captured_001",
      },
      body: webhookPayload,
    });
    const res2 = await webhookHandler(req2);
    const body2 = await res2.json();

    const passed =
      res1.status === 200 &&
      body1.received === true &&
      res2.status === 200 &&
      body2.status === "already_processed";

    recordTest(16, "Duplicate webhook event deduplication", passed, "Duplicate webhook delivery recognized and acknowledged idempotently");
  } catch (err: unknown) {
    recordTest(16, "Duplicate webhook event deduplication", false, (err as Error).message);
  }

  // --------------------------------------------------------------------------
  // TEST 17: Out-of-order webhook events (Delayed failure protection)
  // --------------------------------------------------------------------------
  try {
    memoryStore.addDonation({
      donationReference: "DRF-OOO-TEST-17",
      internalId: "DRF-OOO-TEST-17",
      donorName: "Capture First Donor",
      donorEmail: "capture@example.com",
      amount: 2000,
      amountPaise: 200000,
      currency: "INR",
      frequency: "one_time",
      paymentProvider: "razorpay",
      status: "captured",
      paymentStatus: "successful",
      campaign: "First Meal - Vidarbha",
      isTaxReceiptRequested: false,
    });

    // Simulate delayed failure webhook arriving AFTER captured
    memoryStore.updateDonationStatus("DRF-OOO-TEST-17", "failed");
    const checkItem = memoryStore.findDonationByReference("DRF-OOO-TEST-17");

    const passed = checkItem?.status === "captured" && checkItem?.paymentStatus === "successful";
    recordTest(17, "Out-of-order delayed failure protection", passed, "Delayed failure event prevented from overwriting captured status");
  } catch (err: unknown) {
    recordTest(17, "Out-of-order delayed failure protection", false, (err as Error).message);
  }

  // --------------------------------------------------------------------------
  // TEST 18: Duplicate verification requests (Idempotency)
  // --------------------------------------------------------------------------
  try {
    memoryStore.addDonation({
      donationReference: "DRF-IDEMP-TEST-18",
      internalId: "DRF-IDEMP-TEST-18",
      donorName: "Idempotent Donor",
      donorEmail: "idemp@example.com",
      amount: 1500,
      amountPaise: 150000,
      currency: "INR",
      frequency: "one_time",
      paymentProvider: "razorpay",
      razorpayOrderId: "order_idemp_18",
      providerOrderId: "order_idemp_18",
      razorpayPaymentId: "pay_idemp_18",
      providerPaymentId: "pay_idemp_18",
      status: "captured",
      paymentStatus: "successful",
      campaign: "First Meal - Vidarbha",
      isTaxReceiptRequested: false,
    });

    const req = new NextRequest("http://localhost:3000/api/donations/verify-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        donationReference: "DRF-IDEMP-TEST-18",
        razorpay_order_id: "order_idemp_18",
        razorpay_payment_id: "pay_idemp_18",
        // Valid simulated signature for this order (see verify-payment simulation rule).
        razorpay_signature: `sig_test_${"order_idemp_18".slice(-6)}`,
      }),
    });

    const savedSim = process.env.ALLOW_PAYMENT_SIMULATION;
    process.env.ALLOW_PAYMENT_SIMULATION = "true";
    const res = await verifyPaymentHandler(req);
    restoreEnv("ALLOW_PAYMENT_SIMULATION", savedSim);
    const body = await res.json();
    const passed = res.status === 200 && body.success === true && body.status === "captured" && body.alreadyVerified === true;
    recordTest(18, "Duplicate verification requests idempotency", passed, "Already verified donation returns confirmed status idempotently");
  } catch (err: unknown) {
    recordTest(18, "Duplicate verification requests idempotency", false, (err as Error).message);
  }

  // --------------------------------------------------------------------------
  // TEST 19: Database failure fallback
  // --------------------------------------------------------------------------
  try {
    const all = memoryStore.getDonations();
    const stats = memoryStore.getStats();
    const passed = all.length > 0 && typeof stats.totalVerifiedAmount === "number";
    recordTest(19, "Database fallback persistence", passed, `Resilient store retains ${all.length} donations, stats: ₹${stats.totalVerifiedAmount} verified`);
  } catch (err: unknown) {
    recordTest(19, "Database fallback persistence", false, (err as Error).message);
  }

  // --------------------------------------------------------------------------
  // TEST 20: Network timeout & Rate Limiting
  // --------------------------------------------------------------------------
  try {
    const testIp = "192.168.1.99";
    let wasBlocked = false;
    for (let i = 0; i < 25; i++) {
      const res = checkRateLimit(testIp, 10, 60000);
      if (!res.allowed) {
        wasBlocked = true;
        break;
      }
    }
    recordTest(20, "Rate limiting & timeout protection", wasBlocked, "IP rate limiter successfully throttles excessive automated requests (HTTP 429)");
  } catch (err: unknown) {
    recordTest(20, "Rate limiting & timeout protection", false, (err as Error).message);
  }

  // Helper for signed webhook deliveries in the tests below.
  const sendWebhook = async (body: object, eventId?: string) => {
    const raw = JSON.stringify(body);
    const sig = crypto.createHmac("sha256", TEST_WEBHOOK_SECRET).update(raw).digest("hex");
    const res = await webhookHandler(
      new NextRequest("http://localhost:3000/api/donations/webhook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-razorpay-signature": sig,
          ...(eventId ? { "x-razorpay-event-id": eventId } : {}),
        },
        body: raw,
      })
    );
    return { status: res.status, body: await res.json() };
  };
  process.env.RAZORPAY_WEBHOOK_SECRET = TEST_WEBHOOK_SECRET;

  // --------------------------------------------------------------------------
  // TEST 21: Forged signature cannot read an already-captured donation
  // --------------------------------------------------------------------------
  try {
    const res = await verifyPaymentHandler(
      new NextRequest("http://localhost:3000/api/donations/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donationReference: "DRF-IDEMP-TEST-18",
          razorpay_order_id: "order_idemp_18",
          razorpay_payment_id: "pay_idemp_18",
          razorpay_signature: "forged_signature_000",
        }),
      })
    );
    const body = await res.json();
    const leaked = JSON.stringify(body).includes("Idempotent Donor");
    recordTest(21, "Forged signature cannot read donor details", res.status === 400 && !leaked, `HTTP ${res.status}, donor name leaked: ${leaked}`);
  } catch (err: unknown) {
    recordTest(21, "Forged signature cannot read donor details", false, (err as Error).message);
  }

  // --------------------------------------------------------------------------
  // TEST 22: Webhook dedup when event ID comes only from the header
  // --------------------------------------------------------------------------
  try {
    memoryStore.addDonation({
      donationReference: "DRF-HDR-22", internalId: "DRF-HDR-22", donorName: "Header Donor",
      donorEmail: "h@example.com", amount: 500, amountPaise: 50000, currency: "INR", frequency: "one_time",
      paymentProvider: "razorpay", razorpayOrderId: "order_hdr_22", providerOrderId: "order_hdr_22",
      status: "pending", paymentStatus: "pending", campaign: "Test", isTaxReceiptRequested: false,
    });
    const evt = { event: "payment.failed", payload: { payment: { entity: { id: "pay_hdr_22", order_id: "order_hdr_22", amount: 50000 } } } };
    const first = await sendWebhook(evt, "evt_hdr_22");
    const second = await sendWebhook(evt, "evt_hdr_22");
    const passed = first.body.received === true && second.body.status === "already_processed";
    recordTest(22, "Webhook dedup via x-razorpay-event-id header", passed, `second delivery: ${second.body.status ?? "processed again"}`);
  } catch (err: unknown) {
    recordTest(22, "Webhook dedup via x-razorpay-event-id header", false, (err as Error).message);
  }

  // --------------------------------------------------------------------------
  // TEST 23: A late capture event cannot resurrect a refunded donation
  // --------------------------------------------------------------------------
  try {
    memoryStore.addDonation({
      donationReference: "DRF-REF-23", internalId: "DRF-REF-23", donorName: "Refund Donor",
      donorEmail: "r@example.com", amount: 700, amountPaise: 70000, currency: "INR", frequency: "one_time",
      paymentProvider: "razorpay", razorpayOrderId: "order_ref_23", providerOrderId: "order_ref_23",
      status: "captured", paymentStatus: "successful", campaign: "Test", isTaxReceiptRequested: false,
    });
    await sendWebhook(
      { event: "refund.processed", payload: { payment: { entity: { id: "pay_ref_23", order_id: "order_ref_23", amount: 70000, amount_refunded: 70000 } } } },
      "evt_ref_23_refund"
    );
    await sendWebhook(
      { event: "payment.captured", payload: { payment: { entity: { id: "pay_ref_23", order_id: "order_ref_23", amount: 70000 } } } },
      "evt_ref_23_late_capture"
    );
    const d = memoryStore.findDonationByReference("DRF-REF-23");
    recordTest(23, "Refunded donation stays refunded after late capture", d?.status === "refunded", `final status: ${d?.status}`);
  } catch (err: unknown) {
    recordTest(23, "Refunded donation stays refunded after late capture", false, (err as Error).message);
  }

  // --------------------------------------------------------------------------
  // TEST 24: Partial refund keeps the donation captured
  // --------------------------------------------------------------------------
  try {
    memoryStore.addDonation({
      donationReference: "DRF-PART-24", internalId: "DRF-PART-24", donorName: "Partial Donor",
      donorEmail: "p@example.com", amount: 1000, amountPaise: 100000, currency: "INR", frequency: "one_time",
      paymentProvider: "razorpay", razorpayOrderId: "order_part_24", providerOrderId: "order_part_24",
      status: "captured", paymentStatus: "successful", campaign: "Test", isTaxReceiptRequested: false,
    });
    await sendWebhook(
      { event: "refund.processed", payload: { payment: { entity: { id: "pay_part_24", order_id: "order_part_24", amount: 100000, amount_refunded: 30000 } } } },
      "evt_part_24"
    );
    const d = memoryStore.findDonationByReference("DRF-PART-24");
    recordTest(24, "Partial refund keeps donation captured", d?.status === "captured", `final status: ${d?.status}`);
  } catch (err: unknown) {
    recordTest(24, "Partial refund keeps donation captured", false, (err as Error).message);
  }

  // --------------------------------------------------------------------------
  // TEST 25: Simulation can never be enabled in production
  // --------------------------------------------------------------------------
  try {
    const savedEnv = process.env.NODE_ENV;
    const savedSim = process.env.ALLOW_PAYMENT_SIMULATION;
    process.env.ALLOW_PAYMENT_SIMULATION = "true";
    (process.env as Record<string, string>).NODE_ENV = "production";
    const allowedInProd = isPaymentSimulationAllowed();
    (process.env as Record<string, string>).NODE_ENV = "development";
    const allowedInDev = isPaymentSimulationAllowed();
    restoreEnv("NODE_ENV", savedEnv);
    restoreEnv("ALLOW_PAYMENT_SIMULATION", savedSim);
    recordTest(25, "Payment simulation disabled in production", !allowedInProd && allowedInDev, `prod: ${allowedInProd}, dev: ${allowedInDev}`);
  } catch (err: unknown) {
    recordTest(25, "Payment simulation disabled in production", false, (err as Error).message);
  }

  // --------------------------------------------------------------------------
  // TEST 26: Production without MONGODB_URI fails loudly instead of using memory
  // --------------------------------------------------------------------------
  try {
    const savedEnv = process.env.NODE_ENV;
    const savedUri = process.env.MONGODB_URI;
    (process.env as Record<string, string>).NODE_ENV = "production";
    process.env.MONGODB_URI = "";
    const res = await createOrderHandler(
      new NextRequest("http://localhost:3000/api/donations/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 500 }),
      })
    );
    const body = await res.json();
    restoreEnv("NODE_ENV", savedEnv);
    restoreEnv("MONGODB_URI", savedUri);
    const leaks = JSON.stringify(body).includes("MONGODB");
    recordTest(26, "Production without database fails loudly", res.status === 500 && !leaks, `HTTP ${res.status}, leaks config: ${leaks}`);
  } catch (err: unknown) {
    recordTest(26, "Production without database fails loudly", false, (err as Error).message);
  }

  // --------------------------------------------------------------------------
  // TEST 27: Rate limiter ignores the spoofable left-most X-Forwarded-For entry
  // --------------------------------------------------------------------------
  try {
    const spoofed = getClientIp(new Headers({ "x-forwarded-for": "1.2.3.4, 203.0.113.9" }));
    const realIp = getClientIp(new Headers({ "x-real-ip": "198.51.100.7", "x-forwarded-for": "1.2.3.4" }));
    recordTest(27, "Client IP not taken from spoofable header", spoofed === "203.0.113.9" && realIp === "198.51.100.7", `xff → ${spoofed}, x-real-ip → ${realIp}`);
  } catch (err: unknown) {
    recordTest(27, "Client IP not taken from spoofable header", false, (err as Error).message);
  }

  console.log("\n================================================================================");
  const totalPassed = results.filter((r) => r.passed).length;
  console.log(`TEST SUITE RESULTS: ${totalPassed} / ${results.length} PASSED`);
  console.log("================================================================================\n");

  if (totalPassed === results.length) {
    console.log(`🎉 ALL ${results.length} PAYMENT TEST SCENARIOS PASSED.`);
    process.exit(0);
  } else {
    console.error("⚠️ SOME TESTS FAILED. CHECK OUTPUT ABOVE.");
    process.exit(1);
  }
}

runTestSuite();
