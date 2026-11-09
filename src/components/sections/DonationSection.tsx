"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  FileCheck,
  Heart,
  Loader2,
  Lock,
  Mail,
  Phone,
  Printer,
  ShieldCheck,
  User,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/components/ui/Button";
import { loadRazorpayCheckoutScript } from "@/lib/loadRazorpay";
import { donationOptions as donation } from "@/data/donation";

export interface DonationSectionProps {
  /** Stored on the donation record and sent to Razorpay. */
  campaignName: string;
  /** Short description of what the money supports, shown on checkout and receipt. */
  purpose: string;
  eyebrow: string;
  title: string;
  description: string;
}

// Website palette: primary-green, accent-gold, primary-brown, sand
const CONFETTI_COLORS = ["#597349", "#E89230", "#4A311D", "#EDE4D5"];
const RAZORPAY_THEME_COLOR = "#597349";
const FALLBACK_DONOR_NAME = "Generous Supporter";

type Step = 1 | 2 | 3;
type VerificationStatus = "idle" | "verifying" | "success" | "pending" | "failed";

interface DonationRecord {
  donationReference: string;
  paymentId: string;
  orderId?: string;
  amount: number;
  currency: string;
  donorName: string;
  capturedAt?: string;
}

const formatINR = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;

function celebrate(particleCount: number) {
  try {
    confetti({
      particleCount,
      spread: 70,
      origin: { y: 0.6 },
      colors: CONFETTI_COLORS,
      disableForReducedMotion: true,
    });
  } catch {
    // Canvas unavailable; purely decorative.
  }
}

const inputClass =
  "w-full pl-10 pr-4 py-3 text-sm rounded-xl border border-sand bg-white text-charcoal placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent transition";

export function DonationSection({ campaignName, purpose, eyebrow, title, description }: DonationSectionProps) {
  const [currentStep, setCurrentStep] = useState<Step>(1);

  const [selectedAmount, setSelectedAmount] = useState<number>(donation.defaultAmount);
  const [customAmount, setCustomAmount] = useState("");

  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState("");

  const [isProcessing, setIsProcessing] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [pendingMessage, setPendingMessage] = useState("");
  const [record, setRecord] = useState<DonationRecord | null>(null);

  const activeAmount = customAmount ? parseInt(customAmount, 10) || 0 : selectedAmount;
  const displayName = donorName.trim() || FALLBACK_DONOR_NAME;

  const handleSelectTier = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
    setErrorMessage("");
    celebrate(20);
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setCustomAmount(raw);
    if (raw) setSelectedAmount(parseInt(raw, 10));
    setErrorMessage("");
  };

  const handleProceed = () => {
    setErrorMessage("");
    if (activeAmount < donation.minAmount) {
      setErrorMessage(`Minimum donation amount is ${formatINR(donation.minAmount)}.`);
      return;
    }
    if (activeAmount > donation.maxAmount) {
      setErrorMessage(
        `For contributions above ${formatINR(donation.maxAmount)}, please contact the foundation directly.`
      );
      return;
    }
    setCurrentStep(2);
  };

  const handlePayment = async () => {
    setErrorMessage("");
    setPendingMessage("");
    setIsProcessing(true);
    setVerificationStatus("idle");

    try {
      // 1. Create the order server-side (amount is re-validated there).
      const orderRes = await fetch("/api/donations/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: activeAmount,
          donorName: displayName,
          donorEmail: donorEmail.trim(),
          donorPhone: donorPhone.trim(),
          frequency: "one_time",
          campaign: campaignName,
          // No PAN is collected, so an 80G tax receipt cannot be issued from this form.
          isTaxReceiptRequested: false,
        }),
      });
      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.error || "Could not initialise the payment order.");
      }

      // 2. Load Razorpay Checkout.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let RazorpaySDK: any = null;
      try {
        RazorpaySDK = await loadRazorpayCheckoutScript();
      } catch {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        RazorpaySDK = typeof window !== "undefined" ? (window as any).Razorpay : null;
      }

      if (!orderData.isLiveGateway || !RazorpaySDK) {
        throw new Error(
          orderData.error ||
            "Unable to launch Razorpay checkout. Please check your internet connection or try again."
        );
      }

      // 3. Open checkout; verify server-side in the handler.
      const rzp = new RazorpaySDK({
        key: orderData.keyId,
        amount: orderData.amount, // paise
        currency: orderData.currency || "INR",
        name: "DeepRoots Foundation",
        description: purpose,
        image: "/logo.png",
        order_id: orderData.orderId,
        prefill: {
          name: donorName.trim() || undefined,
          email: donorEmail.trim() || undefined,
          contact: donorPhone.trim() || undefined,
        },
        notes: { donationReference: orderData.donationReference },
        theme: { color: RAZORPAY_THEME_COLOR },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handler: async (response: any) => {
          setVerificationStatus("verifying");
          setIsProcessing(true);
          try {
            const verifyRes = await fetch("/api/donations/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                donationReference: orderData.donationReference,
                internalId: orderData.donationReference,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success && verifyData.status === "captured") {
              setRecord({
                donationReference: verifyData.donationReference,
                paymentId: verifyData.paymentId,
                orderId: verifyData.orderId,
                amount: verifyData.amount,
                currency: verifyData.currency,
                donorName: verifyData.donorName || displayName,
                capturedAt: verifyData.capturedAt,
              });
              setVerificationStatus("success");
              setCurrentStep(3);
              celebrate(80);
            } else if (verifyData.pending) {
              setRecord({
                donationReference: verifyData.donationReference || orderData.donationReference,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                amount: activeAmount,
                currency: "INR",
                donorName: displayName,
              });
              setPendingMessage(
                verifyData.message ||
                  "Your payment has been authorised by your bank, but confirmation is pending settlement. Please check back shortly."
              );
              setVerificationStatus("pending");
              setCurrentStep(3);
            } else {
              throw new Error(verifyData.error || "Payment verification failed.");
            }
          } catch (err: unknown) {
            console.error(err);
            setErrorMessage(err instanceof Error ? err.message : "Verification failed.");
            setVerificationStatus("failed");
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          // Donor closed the popup: allow retry without marking as failed.
          ondismiss: () => setIsProcessing(false),
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rzp.on("payment.failed", (response: any) => {
        setErrorMessage(
          response?.error?.description || "Payment failed. Please try again or use another payment method."
        );
        setIsProcessing(false);
        setVerificationStatus("failed");
      });
      rzp.open();
    } catch (err: unknown) {
      console.error(err);
      setErrorMessage(err instanceof Error ? err.message : "An unexpected payment error occurred.");
      setIsProcessing(false);
      setVerificationStatus("failed");
    }
  };

  const steps: { n: Step; label: string }[] = [
    { n: 1, label: "Amount" },
    { n: 2, label: "Payment" },
    { n: 3, label: "Receipt" },
  ];

  const isPending = verificationStatus === "pending" || Boolean(pendingMessage);

  return (
    <section id="donate" className="py-24 md:py-32 bg-sand/40 scroll-mt-24">
      <div className="container mx-auto px-6 md:px-12">
        <SectionHeading subtitle={eyebrow} title={title} />
        <p className="mt-6 text-center text-muted max-w-xl mx-auto">{description}</p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mt-12 max-w-4xl mx-auto bg-white rounded-3xl shadow-md border border-primary-green/10 p-6 md:p-10"
        >
          {/* Stepper */}
          <ol className="flex items-center max-w-md mx-auto mb-10">
            {steps.map((step, i) => {
              const isDone = currentStep > step.n;
              const isActive = currentStep === step.n;
              return (
                <li key={step.n} className={cn("flex items-center", i < steps.length - 1 && "flex-1")}>
                  <button
                    type="button"
                    disabled={!isDone || currentStep === 3}
                    onClick={() => setCurrentStep(step.n)}
                    className={cn(
                      "flex items-center gap-2 text-xs font-bold uppercase tracking-wider transition-colors disabled:cursor-default",
                      isActive ? "text-primary-green" : isDone ? "text-primary-brown" : "text-muted/60"
                    )}
                  >
                    <span
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-sm transition-colors",
                        isActive && "bg-primary-green text-white ring-4 ring-primary-green/15",
                        isDone && "bg-primary-brown text-white",
                        !isActive && !isDone && "bg-sand text-muted"
                      )}
                    >
                      {isDone ? <Check className="w-4 h-4" strokeWidth={3} /> : step.n}
                    </span>
                    <span className="hidden sm:inline">{step.label}</span>
                  </button>
                  {i < steps.length - 1 && (
                    <span
                      className={cn(
                        "flex-1 h-0.5 mx-3 transition-colors",
                        currentStep > step.n ? "bg-primary-brown" : "bg-sand"
                      )}
                    />
                  )}
                </li>
              );
            })}
          </ol>

          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                role="alert"
                className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{errorMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {/* STEP 1: amount + optional donor details */}
            {currentStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-charcoal">
                      Choose an amount
                    </h3>
                    <span className="text-sm font-bold text-primary-green">{formatINR(activeAmount)}</span>
                  </div>

                  <div role="radiogroup" aria-label="Suggested donation amounts" className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {donation.tiers.map((tier, idx) => {
                      const isSelected = !customAmount && selectedAmount === tier.amount;
                      return (
                        <button
                          key={tier.amount}
                          type="button"
                          role="radio"
                          aria-checked={isSelected}
                          onClick={() => handleSelectTier(tier.amount)}
                          className={cn(
                            "relative p-4 rounded-2xl border-2 text-left transition-all hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary-green focus:ring-offset-2",
                            idx === donation.tiers.length - 1 && "col-span-2 md:col-span-1",
                            isSelected
                              ? "border-primary-green bg-primary-green/5 shadow-md"
                              : "border-sand bg-white hover:border-primary-green/40"
                          )}
                        >
                          {tier.isPopular && (
                            <span className="absolute -top-2.5 right-3 bg-accent-gold text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                              Popular
                            </span>
                          )}
                          <span className="flex items-center justify-between mb-2">
                            <span className="font-serif text-2xl font-bold text-charcoal">{formatINR(tier.amount)}</span>
                            <span
                              className={cn(
                                "w-5 h-5 rounded-full border flex items-center justify-center transition-colors",
                                isSelected ? "border-primary-green bg-primary-green text-white" : "border-sand text-transparent"
                              )}
                            >
                              <Check className="w-3 h-3" strokeWidth={3} />
                            </span>
                          </span>
                          <span className="block text-xs text-muted leading-snug">{tier.description}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-5 pt-5 border-t border-sand flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <label htmlFor="customAmount" className="text-sm font-bold text-charcoal">
                      Or enter a custom amount
                    </label>
                    <div className="relative w-full sm:max-w-xs">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-serif text-lg font-bold text-primary-green pointer-events-none">
                        ₹
                      </span>
                      <input
                        id="customAmount"
                        type="text"
                        inputMode="numeric"
                        value={customAmount}
                        onChange={handleCustomChange}
                        placeholder="e.g. 2500"
                        className={cn(inputClass, "font-bold", customAmount && "border-primary-green bg-primary-green/5")}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-ivory rounded-2xl p-5 md:p-6 border border-sand space-y-4">
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-charcoal">
                      Your details <span className="normal-case tracking-normal font-normal text-muted">(optional)</span>
                    </h3>
                    <span className="hidden sm:flex items-center gap-1 text-xs font-bold text-primary-green">
                      <Lock className="w-3.5 h-3.5" /> Confidential
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="relative">
                      <User className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input type="text" autoComplete="name" aria-label="Your name" value={donorName} onChange={(e) => setDonorName(e.target.value)} placeholder="Your name" className={inputClass} />
                    </div>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input type="email" autoComplete="email" aria-label="Email address" value={donorEmail} onChange={(e) => setDonorEmail(e.target.value)} placeholder="Email address" className={inputClass} />
                    </div>
                    <div className="relative sm:col-span-2">
                      <Phone className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input type="tel" autoComplete="tel" aria-label="Phone number" value={donorPhone} onChange={(e) => setDonorPhone(e.target.value)} placeholder="Phone number" className={inputClass} />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleProceed}
                  disabled={activeAmount <= 0}
                  className="w-full inline-flex items-center justify-center gap-3 rounded-full bg-primary-green text-white font-bold text-lg px-8 py-4 hover:bg-primary-brown transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-green focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
                >
                  <Heart className="w-5 h-5 fill-white" />
                  Continue with {formatINR(activeAmount)}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            )}

            {/* STEP 2: review + Razorpay */}
            {currentStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  disabled={isProcessing}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-primary-green transition-colors disabled:opacity-50"
                >
                  <ArrowLeft className="w-4 h-4" /> Change amount or details
                </button>

                <div className="p-6 rounded-2xl bg-ivory border border-sand flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-accent-gold">Your donation</span>
                    <p className="font-serif text-4xl font-bold text-charcoal mt-1">{formatINR(activeAmount)}</p>
                    <p className="text-sm text-muted mt-1">DeepRoots Foundation · {purpose}</p>
                    {donorName && (
                      <p className="text-xs text-muted mt-1">
                        Donor: {donorName} {donorEmail && `(${donorEmail})`}
                      </p>
                    )}
                  </div>
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-primary-green/20 text-xs font-bold text-primary-green">
                    <ShieldCheck className="w-4 h-4" /> Secure payment
                  </span>
                </div>

                <div className="p-6 md:p-8 rounded-2xl border-2 border-primary-green/20 text-center space-y-6">
                  <div className="w-14 h-14 rounded-full bg-primary-green/10 text-primary-green flex items-center justify-center mx-auto">
                    <Lock className="w-7 h-7" />
                  </div>
                  <div className="max-w-md mx-auto space-y-2">
                    <h3 className="text-2xl text-primary-green">Pay securely with Razorpay</h3>
                    <p className="text-sm text-muted leading-relaxed">
                      UPI (Google Pay, PhonePe, Paytm), debit and credit cards, and net banking. Every payment is verified on our server before it is recorded.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="w-full max-w-md mx-auto inline-flex items-center justify-center gap-3 rounded-full bg-accent-gold text-white font-bold text-lg px-8 py-4 hover:bg-primary-green transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-accent-gold focus:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {verificationStatus === "verifying" ? "Verifying payment…" : "Connecting to Razorpay…"}
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Pay {formatINR(activeAmount)}
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: confirmation + receipt */}
            {currentStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35 }}
                className="space-y-6"
              >
                {isPending ? (
                  <div className="p-5 rounded-2xl bg-accent-gold/10 border border-accent-gold/40 flex items-start gap-4">
                    <span className="w-10 h-10 rounded-full bg-accent-gold text-white flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5" />
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-primary-brown">Confirmation pending</p>
                      <p className="text-sm text-charcoal mt-1 leading-relaxed">
                        {pendingMessage || "Your payment has been initiated. We are awaiting final confirmation from your bank."}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 rounded-2xl bg-primary-green/10 border border-primary-green/30 flex items-start sm:items-center gap-4">
                    <span className="w-10 h-10 rounded-full bg-primary-green text-white flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-6 h-6" />
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-primary-green">Payment verified</p>
                      <p className="text-sm font-semibold text-charcoal mt-0.5">
                        Thank you for supporting DeepRoots Foundation. Your donation has been received.
                      </p>
                    </div>
                  </div>
                )}

                <div className="p-6 md:p-7 rounded-2xl bg-ivory border border-sand text-sm space-y-4">
                  <div className="flex items-start justify-between gap-4 pb-4 border-b border-sand">
                    <div>
                      <p className="font-serif text-2xl font-bold text-primary-green leading-tight">DeepRoots Foundation</p>
                      <p className="text-[11px] uppercase tracking-wider font-semibold text-muted">{purpose}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] uppercase tracking-wider font-bold text-muted">Reference</p>
                      <p className="font-mono font-bold text-primary-brown">{record?.donationReference ?? "—"}</p>
                    </div>
                  </div>
                  <dl className="grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-[11px] uppercase tracking-wider font-bold text-muted">Donor</dt>
                      <dd className="font-bold text-charcoal">{record?.donorName ?? displayName}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] uppercase tracking-wider font-bold text-muted">Amount</dt>
                      <dd className="font-bold text-lg text-primary-green">{formatINR(record?.amount ?? activeAmount)}</dd>
                    </div>
                    <div className="min-w-0">
                      <dt className="text-[11px] uppercase tracking-wider font-bold text-muted">Payment ID</dt>
                      <dd className="font-mono text-xs text-charcoal truncate">{record?.paymentId ?? "—"}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] uppercase tracking-wider font-bold text-muted">Status</dt>
                      <dd className={cn("font-bold text-xs inline-flex items-center gap-1", isPending ? "text-primary-brown" : "text-primary-green")}>
                        {isPending ? <Clock className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                        {isPending ? "Pending confirmation" : "Captured & recorded"}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-2 rounded-full border-2 border-primary-green text-primary-green font-bold px-6 py-3 hover:bg-primary-green hover:text-white transition-colors duration-300"
                  >
                    <Printer className="w-4 h-4" /> Print receipt
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-10 pt-6 border-t border-sand flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-muted">
            <span className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-primary-green" /> SSL encrypted</span>
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-primary-green" /> Section 8 registered non-profit</span>
            <span className="flex items-center gap-1.5"><FileCheck className="w-4 h-4 text-primary-green" /> Server-verified payments</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
