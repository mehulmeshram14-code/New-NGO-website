# DeepRoots Foundation website

Next.js 16 (App Router) site for DeepRoots Foundation, with Razorpay donations stored in MongoDB.

## Run locally

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

Without Razorpay keys the donation forms show a "gateway not configured" error. That is expected locally.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build and server |
| `npm run lint` | ESLint |
| `npm test` | Payment test suite (`scripts/test-payments.ts`): order creation, signature checks, webhooks, idempotency |

## Where things live

- `src/app/` holds the pages. Payment API routes are in `src/app/api/donations/` (`create-order`, `verify-payment`, `webhook`).
- `src/components/` holds the UI. The Razorpay donation flow is `sections/DonationSection.tsx`, used by `/donate` and `/campaign/hunger-free`.
- `src/data/` holds the site content: copy, team, gallery, donation amounts, contact details (`siteConfig.ts`).
- `src/lib/` holds the payment backend: Razorpay helpers, MongoDB connection, validation, rate limiting.

## Production checklist

1. **`MONGODB_URI`** must be set. In production the app refuses to fall back to in-memory storage, so donations are never silently lost.
2. **Razorpay:** set `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` (live keys) and `RAZORPAY_WEBHOOK_SECRET`.
3. **Razorpay webhook:** point it at `https://<domain>/api/donations/webhook` and enable `payment.authorized`, `payment.captured`, `payment.failed`, `order.paid` and `refund.processed`.
4. **Reverse proxy:** must set the real client IP for rate limiting, e.g. nginx `proxy_set_header X-Real-IP $remote_addr;`.
5. **`NEXT_PUBLIC_SITE_URL`:** set to the public domain, for canonical and social-share links.
6. **Never set `ALLOW_PAYMENT_SIMULATION`** outside local testing. It is ignored in production regardless.
