import crypto from "crypto";
import Razorpay from "razorpay";

/**
 * Validates and retrieves server-side Razorpay credentials.
 * Ensures secrets are never exposed to browser or client bundles.
 */
export function getRazorpayCredentials() {
  if (typeof window !== "undefined") {
    throw new Error("SECURITY VIOLATION: Razorpay server credentials cannot be accessed on the client.");
  }

  const keyId = process.env.RAZORPAY_KEY_ID?.trim();
  const keySecret = process.env.RAZORPAY_KEY_SECRET?.trim();
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET?.trim();

  const isConfigured = Boolean(
    keyId &&
      keySecret &&
      keyId.length >= 8 &&
      keySecret.length >= 8 &&
      !keyId.includes("your_actual_key_id") &&
      !keySecret.includes("your_actual_test_secret")
  );

  const isLive = Boolean(keyId && keyId.startsWith("rzp_live_"));

  return {
    keyId,
    keySecret,
    webhookSecret,
    isConfigured,
    isLive,
    mode: isConfigured ? (isLive ? "live" : "test") : "unconfigured",
  };
}

/**
 * Checks whether Razorpay credentials are fully configured on the server.
 */
export function isRazorpayConfigured(): boolean {
  try {
    const creds = getRazorpayCredentials();
    return creds.isConfigured;
  } catch {
    return false;
  }
}

/**
 * Returns an authenticated instance of the official Razorpay Node.js SDK.
 * Throws a safe configuration error if credentials are missing or invalid.
 */
export function getRazorpayClient(): Razorpay {
  const { keyId, keySecret, isConfigured } = getRazorpayCredentials();

  if (!isConfigured || !keyId || !keySecret) {
    throw new Error(
      "Live Razorpay API credentials (RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET) are not configured in environment variables."
    );
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
}

/**
 * Cryptographically verifies Razorpay Checkout payment signatures using HMAC-SHA256
 * and constant-time buffer comparison to prevent timing attacks.
 */
export function verifyRazorpayPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string,
  secretOverride?: string
): boolean {
  if (!orderId || !paymentId || !signature) {
    return false;
  }

  const secret = secretOverride || process.env.RAZORPAY_KEY_SECRET?.trim();
  if (!secret) {
    return false;
  }

  const payload = `${orderId}|${paymentId}`;
  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  const expectedBuf = Buffer.from(generatedSignature, "utf8");
  const receivedBuf = Buffer.from(signature, "utf8");

  if (expectedBuf.length !== receivedBuf.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuf, receivedBuf);
}

/**
 * Cryptographically verifies Razorpay Webhook signatures using HMAC-SHA256
 * and constant-time buffer comparison against the raw webhook request body.
 */
export function verifyRazorpayWebhookSignature(
  rawBody: string,
  signature: string,
  secretOverride?: string
): boolean {
  if (!rawBody || !signature) {
    return false;
  }

  const secret = secretOverride || process.env.RAZORPAY_WEBHOOK_SECRET?.trim();
  if (!secret) {
    return false;
  }

  const generatedSignature = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  const expectedBuf = Buffer.from(generatedSignature, "utf8");
  const receivedBuf = Buffer.from(signature, "utf8");

  if (expectedBuf.length !== receivedBuf.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuf, receivedBuf);
}
