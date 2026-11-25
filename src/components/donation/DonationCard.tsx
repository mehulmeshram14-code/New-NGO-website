"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, ArrowRight, Heart, LoaderCircle, Lock } from "lucide-react";
import { cn } from "@/components/ui/Button";
import { loadRazorpayCheckoutScript } from "@/lib/loadRazorpay";
import { saveReceipt } from "@/lib/donationReceipt";
import { DONATION_CARD_ID, useDonation } from "./DonationProvider";
import { formatINR, MAX_DONATION, mealsFor, MIN_DONATION } from "@/data/donation";
import { getCampaign } from "@/data/campaigns";

/** Universal thank-you page shared by every campaign. */
const THANK_YOU_PATH = "/thank-you";

/** The campaign (levels, wording, receipt) comes from the surrounding <DonationProvider campaignId>. */
interface DonationCardProps {
  className?: string;
}

/** Main button colours, per campaign (see DonationCardCopy.accent). Shared with the sticky bar. */
export const BUTTON_TONES = {
  gold: "bg-accent-gold-deep hover:bg-primary-brown focus-visible:ring-accent-gold-deep",
  green: "bg-primary-green hover:bg-primary-green-deep focus-visible:ring-primary-green",
};

const inputClass =
  "w-full rounded-xl border border-sand bg-white px-4 py-3 text-charcoal placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent transition";

/** Same rule as the server's PhoneSchema: 10–13 digits, optional leading "+". */
const isValidPhone = (value: string) => /^\+?\d{10,13}$/.test(value.replace(/[\s\-()]/g, ""));

export function DonationCard({ className }: DonationCardProps) {
  const router = useRouter();
  const { campaign, presetAmount, customInput, amount, step, setStep, choosePreset, setCustomInput } = useDonation();
  const { card } = campaign;
  const buttonTone = BUTTON_TONES[card.accent];

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [errorField, setErrorField] = useState<"amount" | "name" | "phone" | "email" | undefined>();
  const [isPaying, setIsPaying] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

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
          campaignId: campaign.id,
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
        description: campaign.purpose,
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
            const confirmed = res.ok && data.success && data.status === "captured";
            if (!confirmed && !data.pending) {
              throw new Error(data.error || "We couldn't verify your payment.");
            }
            // The receipt is built from the server's verified record, not from the form.
            saveReceipt({
              reference: data.donationReference || order.donationReference,
              paymentId: data.paymentId || response.razorpay_payment_id,
              orderId: data.orderId || response.razorpay_order_id,
              amount: typeof data.amount === "number" ? data.amount : amount,
              donorName: data.donorName || name.trim(),
              campaignId: getCampaign(data.campaignId).id,
              date: data.capturedAt || new Date().toISOString(),
              status: confirmed ? "confirmed" : "pending",
              message: confirmed ? undefined : data.message,
            });
            setStep("done");
            router.push(THANK_YOU_PATH);
            // Keep the button in its "Confirming…" state while the thank-you page loads.
          } catch (err) {
            fail(
              `${(err as Error).message} If money was deducted, please contact us with your payment ID ${response.razorpay_payment_id}.`
            );
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
          <div
            role="radiogroup"
            aria-label="Donation amount"
            className={cn("grid grid-cols-2 sm:grid-cols-3", card.detailedLevels ? "gap-3" : "gap-2.5")}
          >
            {campaign.levels.map((level) => {
              const selected = !customInput && presetAmount === level.amount;
              const select = () => {
                clearError();
                choosePreset(level.amount);
              };
              return card.detailedLevels ? (
                // Detailed: level name, amount and what it does, with the badge underneath.
                <button
                  key={level.amount}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={select}
                  className={cn(
                    "flex flex-col items-start rounded-2xl border-2 p-3 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-green focus-visible:ring-offset-2",
                    selected ? "border-primary-green bg-primary-green/10" : "border-sand bg-white hover:border-primary-green/50"
                  )}
                >
                  <span className="text-[11px] font-bold uppercase tracking-widest text-muted">{level.name}</span>
                  <span className="mt-1 font-serif text-2xl text-primary-brown">{formatINR(level.amount)}</span>
                  <span className="mt-1 text-xs leading-snug text-charcoal/80">{level.description}</span>
                  {level.badge && (
                    <span className="mt-2 rounded-full bg-primary-brown px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                      {level.badge}
                    </span>
                  )}
                </button>
              ) : (
                <button
                  key={level.amount}
                  type="button"
                  role="radio"
                  aria-checked={selected}
                  onClick={select}
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
            <label
              htmlFor="donation-other"
              className={card.detailedLevels ? "mb-1.5 block text-sm font-bold text-charcoal" : "sr-only"}
            >
              {card.detailedLevels ? "Or enter your own amount" : "Other amount in rupees"}
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted">₹</span>
              <input
                id="donation-other"
                inputMode="numeric"
                autoComplete="off"
                placeholder={card.customPlaceholder}
                value={customInput}
                onChange={(e) => {
                  clearError();
                  setCustomInput(e.target.value);
                }}
                aria-invalid={errorField === "amount" || undefined}
                className={cn(
                  inputClass,
                  "pl-9 font-semibold placeholder:font-normal",
                  // Long placeholders ("Even ₹50 feeds one elder tonight") must fit on phones.
                  card.detailedLevels && "placeholder:text-sm",
                  // Leave room for the hint on the right only while it is shown.
                  customInput || !card.detailedLevels ? "pr-28" : "pr-4",
                  customInput && "border-primary-green ring-1 ring-primary-green",
                  errorField === "amount" && "ring-2 ring-red-400"
                )}
              />
              {(customInput || !card.detailedLevels) && (
                <span
                  className={cn(
                    "pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm",
                    customInput && amount >= MIN_DONATION ? "font-semibold text-primary-green" : "text-muted"
                  )}
                >
                  {customInput && amount >= MIN_DONATION ? `= ${meals} meals` : `min ${formatINR(MIN_DONATION)}`}
                </span>
              )}
            </div>
          </div>

          {errorBox}

          <button
            type="button"
            onClick={goToDetails}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-full px-4 py-4 text-base font-bold text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:px-6 sm:text-lg",
              buttonTone
            )}
          >
            <span className="whitespace-nowrap">{card.continueLabel(amount || 0)}</span>
            {/* The arrow is decorative; dropping it on phones keeps the label on one line. */}
            <ArrowRight className="hidden h-5 w-5 shrink-0 sm:block" aria-hidden="true" />
          </button>

          {card.footnote ? (
            <p className="text-center text-xs text-muted">{card.footnote}</p>
          ) : (
          <p className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-center text-xs text-muted">
            <span className="inline-flex items-center gap-1">
              <Heart className="h-3.5 w-3.5 text-primary-green" />
              {amount >= MIN_DONATION ? `${formatINR(amount)} = ${meals} freshly cooked meals` : `${formatINR(MIN_DONATION)} = one meal`}
            </span>
            <span className="inline-flex items-center gap-1">
              <Lock className="h-3.5 w-3.5 text-primary-green" /> Secure payment via Razorpay
            </span>
          </p>
          )}
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
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-lg font-bold text-white transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-70",
              buttonTone
            )}
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

      {/* DONE — shown only for the moment it takes to open /thank-you */}
      {step === "done" && (
        <p role="status" className="flex items-center justify-center gap-2 py-10 text-muted">
          <LoaderCircle className="h-5 w-5 animate-spin text-primary-green" /> Opening your receipt…
        </p>
      )}
    </div>
  );
}
