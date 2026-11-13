"use client";

import { useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CircleCheck,
  Clock,
  Heart,
  LoaderCircle,
  Lock,
  Printer,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/components/ui/Button";
import { loadRazorpayCheckoutScript } from "@/lib/loadRazorpay";
import { DONATION_CARD_ID, useDonation } from "./DonationProvider";
import { donationLevels, formatINR, MAX_DONATION, mealsFor, MIN_DONATION } from "@/data/donation";

// Website palette: primary-green, accent-gold, primary-brown, sand
const CONFETTI_COLORS = ["#597349", "#E89230", "#4A311D", "#EDE4D5"];

interface Receipt {
  donationReference: string;
  paymentId: string;
  amount: number;
  donorName: string;
  pending: boolean;
  message?: string;
}

interface DonationCardProps {
  /** Stored on the donation record and sent to Razorpay. */
  campaignName: string;
  /** What the money supports; shown on the Razorpay checkout and the receipt. */
  purpose: string;
  className?: string;
}

const inputClass =
  "w-full rounded-xl border border-sand bg-white px-4 py-3 text-charcoal placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent transition";

function celebrate() {
  try {
    confetti({ particleCount: 80, spread: 75, origin: { y: 0.6 }, colors: CONFETTI_COLORS, disableForReducedMotion: true });
  } catch {
    // Purely decorative.
  }
}

/** Same rule as the server's PhoneSchema: 10–13 digits, optional leading "+". */
const isValidPhone = (value: string) => /^\+?\d{10,13}$/.test(value.replace(/[\s\-()]/g, ""));

export function DonationCard({ campaignName, purpose, className }: DonationCardProps) {
  const { presetAmount, customInput, amount, step, setStep, choosePreset, setCustomInput } = useDonation();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [errorField, setErrorField] = useState<"amount" | "name" | "phone" | "email" | undefined>();
  const [isPaying, setIsPaying] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  const meals = mealsFor(amount);

  const fail = (message: string, field?: typeof errorField) => {
    setError(message);
    setErrorField(field);
  };
  const clearError = () => {
    setError("");
    setErrorField(undefined);
  };

  const goToDetails = () => {
    clearError();
    if (amount < MIN_DONATION) return fail(`The minimum donation is ${formatINR(MIN_DONATION)} — one meal.`, "amount");
    if (amount > MAX_DONATION) return fail(`For gifts above ${formatINR(MAX_DONATION)}, please contact us directly.`, "amount");
    setStep("details");
  };

  const pay = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    if (name.trim().length < 2) return fail("Please enter your name.", "name");
    if (!isValidPhone(phone)) return fail("Please enter a valid phone number.", "phone");

    setIsPaying(true);
    try {
      // 1. Create the order on the server (which re-validates every field).
      const orderRes = await fetch("/api/donations/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          donorName: name.trim(),
          donorPhone: phone.trim(),
          donorEmail: email.trim(),
          frequency: "one_time",
          campaign: campaignName,
          // 80G approval is pending, so no tax receipt can be issued yet.
          isTaxReceiptRequested: false,
        }),
      });
      const order = await orderRes.json();
      if (!orderRes.ok || !order.success) {
        const field = ["donorName", "donorPhone", "donorEmail", "amount"].includes(order.field)
          ? (order.field.replace("donor", "").toLowerCase() as typeof errorField)
          : undefined;
        throw Object.assign(new Error(order.error || "Could not start the payment."), { field });
      }

      // 2. Load Razorpay Checkout.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let Razorpay: any = null;
      try {
        Razorpay = await loadRazorpayCheckoutScript();
      } catch {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        Razorpay = typeof window !== "undefined" ? (window as any).Razorpay : null;
      }
      if (!order.isLiveGateway || !Razorpay) {
        throw new Error("Unable to open the payment window. Please check your connection and try again.");
      }

      // 3. Open checkout; the handler verifies the payment on our server.
      const rzp = new Razorpay({
        key: order.keyId,
        amount: order.amount, // paise
        currency: order.currency || "INR",
        name: "DeepRoots Foundation",
        description: purpose,
        image: "/logo.png",
        order_id: order.orderId,
        prefill: { name: name.trim(), contact: phone.trim(), email: email.trim() || undefined },
        notes: { donationReference: order.donationReference },
        theme: { color: "#597349" },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handler: async (response: any) => {
          setIsVerifying(true);
          try {
            const res = await fetch("/api/donations/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                donationReference: order.donationReference,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const data = await res.json();
            if (res.ok && data.success && data.status === "captured") {
              setReceipt({
                donationReference: data.donationReference,
                paymentId: data.paymentId,
                amount: data.amount,
                donorName: data.donorName || name.trim(),
                pending: false,
              });
              setStep("done");
              celebrate();
            } else if (data.pending) {
              setReceipt({
                donationReference: data.donationReference || order.donationReference,
                paymentId: response.razorpay_payment_id,
                amount,
                donorName: name.trim(),
                pending: true,
                message: data.message,
              });
              setStep("done");
            } else {
              throw new Error(data.error || "We couldn't verify your payment.");
            }
          } catch (err) {
            fail(
              `${(err as Error).message} If money was deducted, please contact us with your payment ID ${response.razorpay_payment_id}.`
            );
          } finally {
            setIsVerifying(false);
            setIsPaying(false);
          }
        },
        modal: {
          // Donor closed the window: let them try again without an error.
          ondismiss: () => setIsPaying(false),
        },
      });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rzp.on("payment.failed", (response: any) => {
        fail(response?.error?.description || "The payment didn't go through. Please try again or use another method.");
        setIsPaying(false);
      });
      rzp.open();
    } catch (err) {
      fail((err as Error).message || "Something went wrong. Please try again.", (err as { field?: typeof errorField }).field);
      setIsPaying(false);
    }
  };

  const resetForAnother = () => {
    setReceipt(null);
    clearError();
    setStep("amount");
  };

  const errorBox = error && (
    <p role="alert" className="flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{error}</span>
    </p>
  );

  return (
    <div
      id={DONATION_CARD_ID}
      tabIndex={-1}
      className={cn(
        "rounded-3xl border border-primary-green/15 bg-white p-5 shadow-lg outline-none md:p-7 print:shadow-none",
        className
      )}
    >
      {step !== "done" && (
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-sans text-lg font-bold text-charcoal">Donate now</h2>
          <span className="text-xs font-semibold text-muted">Step {step === "amount" ? 1 : 2} of 2</span>
        </div>
      )}

      {/* STEP 1 — amount */}
      {step === "amount" && (
        <div className="space-y-4">
          <div role="radiogroup" aria-label="Donation amount" className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {donationLevels.map((level) => {
              const selected = !customInput && presetAmount === level.amount;
              return (
                <button
                  key={level.amount}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={() => {
                    clearError();
                    choosePreset(level.amount);
                  }}
                  className={cn(
                    "relative rounded-2xl border-2 px-2 py-3 text-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-green focus-visible:ring-offset-2",
                    selected
                      ? "border-primary-green bg-primary-green text-white"
                      : "border-sand bg-white text-charcoal hover:border-primary-green/50"
                  )}
                >
                  {level.badge && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-accent-gold-deep px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                      {level.badge}
                    </span>
                  )}
                  <span className="block text-lg font-bold">{formatINR(level.amount)}</span>
                  <span className={cn("block text-xs", selected ? "text-white/90" : "text-muted")}>
                    {mealsFor(level.amount)} meals
                  </span>
                </button>
              );
            })}
          </div>

          <div>
            <label htmlFor="donation-other" className="sr-only">
              Other amount in rupees
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted">₹</span>
              <input
                id="donation-other"
                inputMode="numeric"
                autoComplete="off"
                placeholder="Other amount"
                value={customInput}
                onChange={(e) => {
                  clearError();
                  setCustomInput(e.target.value);
                }}
                aria-invalid={errorField === "amount" || undefined}
                className={cn(
                  inputClass,
                  "pl-9 pr-28 font-semibold",
                  customInput && "border-primary-green ring-1 ring-primary-green",
                  errorField === "amount" && "ring-2 ring-red-400"
                )}
              />
              <span
                className={cn(
                  "pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm",
                  customInput && amount >= MIN_DONATION ? "font-semibold text-primary-green" : "text-muted"
                )}
              >
                {customInput && amount >= MIN_DONATION ? `= ${meals} meals` : `min ${formatINR(MIN_DONATION)}`}
              </span>
            </div>
          </div>

          {errorBox}

          <button
            type="button"
            onClick={goToDetails}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-accent-gold-deep px-6 py-4 text-lg font-bold text-white transition-colors hover:bg-primary-brown focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold-deep focus-visible:ring-offset-2"
          >
            Continue · {formatINR(amount || 0)}
            <ArrowRight className="h-5 w-5" />
          </button>

          <p className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center text-xs text-muted">
            <span className="inline-flex items-center gap-1">
              <Heart className="h-3.5 w-3.5 text-primary-green" />
              {amount >= MIN_DONATION ? `${formatINR(amount)} = ${meals} freshly cooked meals` : `${formatINR(MIN_DONATION)} = one meal`}
            </span>
            <span className="inline-flex items-center gap-1">
              <Lock className="h-3.5 w-3.5 text-primary-green" /> Secure payment via Razorpay
            </span>
          </p>
        </div>
      )}

      {/* STEP 2 — donor details */}
      {step === "details" && (
        <form onSubmit={pay} noValidate className="space-y-4">
          <div className="flex items-center justify-between rounded-2xl bg-ivory px-4 py-3">
            <div>
              <p className="text-xl font-bold text-charcoal">{formatINR(amount)}</p>
              <p className="text-xs text-muted">{meals} freshly cooked meals</p>
            </div>
            <button
              type="button"
              onClick={() => {
                clearError();
                setStep("amount");
              }}
              disabled={isPaying}
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary-green hover:underline disabled:opacity-50"
            >
              <ArrowLeft className="h-4 w-4" /> Change
            </button>
          </div>

          <div>
            <label htmlFor="donor-name" className="mb-1.5 block text-sm font-bold text-charcoal">
              Full name <span className="text-red-700">*</span>
            </label>
            <input
              id="donor-name"
              autoComplete="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={errorField === "name" || undefined}
              className={cn(inputClass, errorField === "name" && "ring-2 ring-red-400")}
            />
          </div>
          <div>
            <label htmlFor="donor-phone" className="mb-1.5 block text-sm font-bold text-charcoal">
              Phone number <span className="text-red-700">*</span>
            </label>
            <input
              id="donor-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required
              placeholder="10-digit mobile number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              aria-invalid={errorField === "phone" || undefined}
              className={cn(inputClass, errorField === "phone" && "ring-2 ring-red-400")}
            />
          </div>
          <div>
            <label htmlFor="donor-email" className="mb-1.5 block text-sm font-bold text-charcoal">
              Email <span className="font-normal text-muted">(optional)</span>
            </label>
            <input
              id="donor-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={errorField === "email" || undefined}
              className={cn(inputClass, errorField === "email" && "ring-2 ring-red-400")}
            />
          </div>

          {errorBox}

          <button
            type="submit"
            disabled={isPaying}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-accent-gold-deep px-6 py-4 text-lg font-bold text-white transition-colors hover:bg-primary-brown focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold-deep focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-70"
          >
            {isPaying ? (
              <>
                <LoaderCircle className="h-5 w-5 animate-spin" />
                {isVerifying ? "Confirming your payment…" : "Opening secure payment…"}
              </>
            ) : (
              <>
                <Lock className="h-5 w-5" /> Pay {formatINR(amount)} securely
              </>
            )}
          </button>

          <p className="text-center text-xs text-muted">
            UPI, cards and net banking via Razorpay. By donating you agree to our{" "}
            <Link href="/donation-policy" className="underline">
              donation policy
            </Link>
            .
          </p>
        </form>
      )}

      {/* DONE — thank you + receipt */}
      {step === "done" && receipt && (
        <div className="space-y-5 text-center">
          <span
            className={cn(
              "mx-auto flex h-14 w-14 items-center justify-center rounded-full",
              receipt.pending ? "bg-accent-gold-deep text-white" : "bg-primary-green text-white"
            )}
          >
            {receipt.pending ? <Clock className="h-7 w-7" /> : <CircleCheck className="h-7 w-7" />}
          </span>
          <div>
            <h2 className="text-2xl text-primary-green">
              {receipt.pending ? "Payment received, confirming" : `Thank you, ${receipt.donorName.split(" ")[0]}!`}
            </h2>
            <p className="mt-2 text-muted">
              {receipt.pending
                ? receipt.message || "Your bank has authorised the payment. Confirmation usually takes a few minutes."
                : `Your ${formatINR(receipt.amount)} will serve ${mealsFor(receipt.amount)} freshly cooked meals.`}
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-3 rounded-2xl bg-ivory p-4 text-left text-sm">
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-wider text-muted">Amount</dt>
              <dd className="font-bold text-charcoal">{formatINR(receipt.amount)}</dd>
            </div>
            <div>
              <dt className="text-[11px] font-bold uppercase tracking-wider text-muted">Donor</dt>
              <dd className="font-bold text-charcoal">{receipt.donorName}</dd>
            </div>
            <div className="min-w-0">
              <dt className="text-[11px] font-bold uppercase tracking-wider text-muted">Reference</dt>
              <dd className="truncate font-mono text-xs text-charcoal">{receipt.donationReference}</dd>
            </div>
            <div className="min-w-0">
              <dt className="text-[11px] font-bold uppercase tracking-wider text-muted">Payment ID</dt>
              <dd className="truncate font-mono text-xs text-charcoal">{receipt.paymentId}</dd>
            </div>
          </dl>

          <div className="flex flex-wrap justify-center gap-3 print:hidden">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-full border-2 border-primary-green px-5 py-2.5 font-bold text-primary-green transition-colors hover:bg-primary-green hover:text-white"
            >
              <Printer className="h-4 w-4" /> Print receipt
            </button>
            <button
              type="button"
              onClick={resetForAnother}
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-bold text-primary-green hover:underline"
            >
              Give again
            </button>
          </div>
          <p className="flex items-center justify-center gap-1 text-xs text-muted">
            <ShieldCheck className="h-3.5 w-3.5 text-primary-green" /> Keep this reference for your records.
          </p>
        </div>
      )}
    </div>
  );
}
