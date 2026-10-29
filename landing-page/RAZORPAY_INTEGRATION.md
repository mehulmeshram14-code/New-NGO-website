# Deep Roots Foundation — Razorpay Payment Integration Guide

This document outlines the architecture, setup instructions, security controls, testing procedures, and deployment requirements for the Razorpay donation payment integration.

---

## 1. Files Created and Modified

| File | Purpose |
|------|---------|
| `lib/razorpay.ts` | **Created**: Server-side Razorpay client factory, credential validators, constant-time HMAC-SHA256 payment signature and webhook signature verification (`crypto.timingSafeEqual`). |
| `lib/loadRazorpay.ts` | **Created**: Resilient client-side script loader for the official Razorpay Checkout SDK (`https://checkout.razorpay.com/v1/checkout.js`). |
| `lib/models/Donation.ts` | **Modified**: Enhanced Mongoose schema with `donationReference`, `amountPaise` (integer in paise), `status` (`pending`, `authorized`, `captured`, `failed`, `refunded`), `capturedAt`, and synchronized backward-compatibility aliases. |
| `lib/models/WebhookEvent.ts` | **Created**: Audit collection for webhook events ensuring strict deduplication and idempotent processing. |
| `lib/memoryStore.ts` | **Modified**: Resilient in-memory database store supporting all Razorpay fields, event deduplication, and protection against out-of-order webhook delivery. |
| `lib/validation.ts` | **Modified**: Zod validation schemas for order creation (`CreateDonationOrderSchema`) and payment verification (`VerifyPaymentSchema`). |
| `app/api/donations/create-order/route.ts` | **Modified**: Server-side order creation route with IP rate limiting, input validation, integer paise arithmetic, unique reference generation, Razorpay SDK order creation, and pending status recording. |
| `app/api/donations/verify-payment/route.ts` | **Modified**: Authoritative payment verification route with HMAC-SHA256 constant-time check, server-side `payments.fetch` status confirmation, amount/currency matching, and idempotent capture recording. |
| `app/api/donations/webhook/route.ts` | **Modified**: Secure webhook listener with raw body HMAC verification, event deduplication, safe state transitions, and protection against delayed failure overwrites. |
| `components/Section2Donation.tsx` | **Modified**: Landing page donation section featuring 3-step workflow, predefined amount cards, custom amount entry, optional donor details, Razorpay Checkout trigger, verification handler, celebratory confetti, and digital receipt. |
| `components/DonationWidget.tsx` | **Modified**: Dedicated donation widget on `/donate` page synchronized with official checkout loader and verification endpoints. |
| `scripts/test-razorpay-suite.ts` | **Created**: Comprehensive automated test runner covering all 20 required integration and security scenarios. |
| `package.json` | **Modified**: Added `test` script (`npm test`) and `tsx` development dependency for automated testing. |

---

## 2. Environment Variables Configuration

Create or update `.env.local` in the project root:

```env
# Application Base URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# MongoDB Atlas Connection String (Optional in local development; in-memory store acts as resilient fallback)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/deeproots_ngo?retryWrites=true&w=majority

# Razorpay API Credentials (LIVE / Production Mode)
# Obtain these from Razorpay Dashboard (Toggle to Live Mode) -> Account & Settings -> API Keys
RAZORPAY_KEY_ID=rzp_live_your_actual_key_id
RAZORPAY_KEY_SECRET=your_actual_live_secret

# Razorpay Webhook Secret (Configured in Live Mode Webhooks)
RAZORPAY_WEBHOOK_SECRET=your_live_webhook_secret

# Organization Admin Key
ADMIN_SECRET_KEY=deeproots_admin_2026
```

### Security Rules:
- **Never** prefix `RAZORPAY_KEY_SECRET` or `RAZORPAY_WEBHOOK_SECRET` with `NEXT_PUBLIC_`.
- **Never** commit `.env.local` to Git (it is ignored in `.gitignore`).
- **Never** expose secrets to the browser or in client-side bundles.

---

## 3. How to Run Locally

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Start Development Server**:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000` in your web browser.

---

## 4. Running the Automated Test Suite

A complete test suite covering all 20 edge-case and security scenarios is included:

```bash
npm test
```

### Verified Test Scenarios:
1. Valid donation amount (e.g. ₹500 $\rightarrow$ 50,000 paise).
2. Zero amount rejection (HTTP 400).
3. Negative amount rejection (HTTP 400).
4. Invalid amount format (non-numeric string rejected).
5. Amount exceeding configured limit (exceeding ₹5,00,000 rejected).
6. Missing API credentials safe handling (HTTP 503 without leaking stack traces).
7. Successful order creation with unique internal reference.
8. Upstream Razorpay API failure interception (HTTP 502 safe response).
9. Cryptographic HMAC-SHA256 signature verification (constant-time).
10. Tampered payment signature rejection.
11. Payment belonging to a different order (order ID mismatch rejection).
12. Currency (INR) and amount (paise) match verification.
13. Authorized but uncaptured payment handling (held pending until capture).
14. Captured payment verification (marked `captured` / `successful`).
15. Failed payment recording (marked `failed`).
16. Duplicate webhook event deduplication (idempotent receipt).
17. Out-of-order delayed failure protection (delayed failure cannot overwrite captured status).
18. Duplicate verification request idempotency (already-verified order returns confirmation).
19. Resilient in-memory database fallback persistence.
20. IP rate limiter protection against automated request flooding (HTTP 429).

---

## 5. Testing the Checkout Flow in Test Mode

1. Visit `http://localhost:3000` and click the **Donate Now** button in the header or hero section.
2. The page scrolls smoothly to the donation section (`#donate`).
3. Select a predefined tier (e.g., ₹1,350) or type a custom amount.
4. Optionally enter your name, email, and phone number.
5. Click **Proceed to Payment**.
6. Click **Pay via Razorpay**.
7. The official Razorpay modal opens:
   - Use Razorpay Test Mode credentials (e.g., Test UPI `success@razorpay` or any 4111 test card).
8. After completing payment, the frontend passes payment credentials to `/api/donations/verify-payment`.
9. The backend validates signature and verifies captured status.
10. The celebratory confirmation screen displays the donation reference, amount, and printable receipt.

---

## 6. Configuring the Razorpay Webhook

1. Log into your [Razorpay Dashboard](https://dashboard.razorpay.com).
2. Navigate to **Account & Settings** $\rightarrow$ **Webhooks**.
3. Click **Add New Webhook**.
4. Set **Webhook URL**:
   - Production: `https://your-domain.com/api/donations/webhook`
   - Local testing: Use an ngrok or Cloudflare tunnel URL: `https://<tunnel-id>.ngrok-free.app/api/donations/webhook`
5. Set **Secret**: Enter a secure random string and assign it to `RAZORPAY_WEBHOOK_SECRET` in `.env.local`.
6. Select **Active Events**:
   - `payment.captured`
   - `payment.authorized`
   - `payment.failed`
   - `order.paid`
   - `refund.processed`
7. Save the webhook.

---

## 7. How Donation Records are Stored

Each donation record contains:
- `donationReference`: Unique internal reference (e.g. `DRF-ORD-MVRQQDDU-B2F442`).
- `razorpayOrderId`: Razorpay order identifier (`order_...`).
- `razorpayPaymentId`: Verified Razorpay payment identifier (`pay_...`).
- `amount`: Donation amount in INR (e.g. 1350).
- `amountPaise`: Integer in paise (e.g. 135000).
- `currency`: Always "INR".
- `donorName`: Provided donor name or "Generous Supporter".
- `donorEmail`: Donor email for receipt.
- `donorPhone`: Donor mobile number.
- `status`: Lifecycle state (`pending` $\rightarrow$ `authorized` $\rightarrow$ `captured` $\rightarrow$ `failed` $\rightarrow$ `refunded`).
- `capturedAt`: Timestamp when payment capture was authoritatively verified.
- `createdAt` & `updatedAt`: Automatic ISO timestamps.

---

## 8. Deployment Requirements

1. **Hosting Environment**:
   - Next.js App Router API routes require a Node.js runtime (e.g., Vercel, Railway, Render, AWS Amplify, DigitalOcean App Platform, or self-hosted Node.js).
   - Static hosting (e.g., GitHub Pages, S3 static bucket) cannot execute server-side API routes or verify payment signatures securely.
2. **HTTPS Requirement**:
   - Razorpay Checkout and webhook endpoints require HTTPS in production.
3. **Switching from Test Mode to Live Mode**:
   - The account is currently under KYC review. Keep using `rzp_test_...` credentials until Razorpay KYC approval is completed.
   - Once approved, generate Live API keys (`rzp_live_...`) in Razorpay Dashboard and update production environment variables.
