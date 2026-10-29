"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Heart,
  ShieldCheck,
  Check,
  AlertCircle,
  Loader2,
  CreditCard,
  Lock,
  FileCheck,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Receipt,
  User,
  Mail,
  Phone,
  Printer,
  Download,
} from "lucide-react";
import { loadRazorpayCheckoutScript } from "@/lib/loadRazorpay";

interface DonationTier {
  id: string;
  amount: number;
  label: string;
  subtext: string;
  isPopular?: boolean;
}

const DONATION_TIERS: DonationTier[] = [
  {
    id: "tier-350",
    amount: 350,
    label: "₹350",
    subtext: "Nourish 5 warm wholesome meals.",
  },
  {
    id: "tier-550",
    amount: 550,
    label: "₹550",
    subtext: "Support weekly nutrition for a family.",
  },
  {
    id: "tier-1350",
    amount: 1350,
    label: "₹1,350",
    subtext: "Provide essential food rations for 2 weeks.",
    isPopular: true,
  },
  {
    id: "tier-2000",
    amount: 2000,
    label: "₹2,000",
    subtext: "Sponsor a community drive distribution.",
  },
  {
    id: "tier-5000",
    amount: 5000,
    label: "₹5,000",
    subtext: "Support community hunger relief programs.",
  },
];

export default function Section2Donation() {
  const router = useRouter();

  // 3-Step Flow:
  // Step 1: Select Amount + Optional Donor Details
  // Step 2: Checkout / Review & Pay
  // Step 3: Verified Confirmation & Official Receipt
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Donation Amount State
  const [selectedAmount, setSelectedAmount] = useState<number>(1350);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [frequency, setFrequency] = useState<"one_time" | "monthly">("one_time");
  const [paymentMethod, setPaymentMethod] = useState<"gateway" | "upi_manual" | "bank_transfer">("gateway");

  // Optional Donor Details
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [isTaxReceiptRequested, setIsTaxReceiptRequested] = useState(true);

  // Status & Reference States
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "verifying" | "success" | "pending" | "failed">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [pendingMessage, setPendingMessage] = useState("");
  const [transferReference, setTransferReference] = useState("");

  const [verifiedDonation, setVerifiedDonation] = useState<{
    donationReference: string;
    paymentId: string;
    orderId?: string;
    amount: number;
    currency: string;
    donorName: string;
    capturedAt?: string;
  } | null>(null);

  const activeAmount = customAmount ? parseInt(customAmount, 10) || 0 : selectedAmount;

  // Tier Selection
  const handleSelectTier = (amt: number) => {
    setSelectedAmount(amt);
    setCustomAmount("");
    setErrorMessage("");

    try {
      confetti({
        particleCount: 20,
        spread: 45,
        origin: { y: 0.65 },
        colors: ["#b83a24", "#66873b", "#fa9f19", "#f5d000"],
        disableForReducedMotion: true,
      });
    } catch {
      // Ignore if canvas is unavailable
    }
  };

  // Custom Amount Input
  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setCustomAmount(raw);
    if (raw) {
      setSelectedAmount(parseInt(raw, 10));
    }
    setErrorMessage("");
  };

  const handleCardKeyDown = (e: React.KeyboardEvent, amt: number) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleSelectTier(amt);
    }
  };

  // Step 1 -> Step 2 Validation & Transition
  const handleProceedToStep2 = () => {
    setErrorMessage("");
    if (activeAmount < 10) {
      setErrorMessage("Minimum donation amount is ₹10.");
      return;
    }
    if (activeAmount > 500000) {
      setErrorMessage("For contributions above ₹5,00,000, please contact our foundation directly.");
      return;
    }
    setCurrentStep(2);
  };

  // Execute Razorpay Checkout / Manual Bank Transfer
  const handleExecutePayment = async () => {
    setErrorMessage("");
    setPendingMessage("");
    setIsProcessingPayment(true);
    setVerificationStatus("idle");

    try {
      // Flow A: Direct Manual Bank / UPI Transfer
      if (paymentMethod === "upi_manual" || paymentMethod === "bank_transfer") {
        if (!transferReference.trim()) {
          setErrorMessage("Please enter your transaction reference number (UTR / UPI Ref).");
          setIsProcessingPayment(false);
          return;
        }

        const res = await fetch("/api/donations/manual-transfer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            donorName: donorName.trim() || "Generous Supporter",
            donorEmail: donorEmail.trim() || "deeprootsfoundation2026@gmail.com",
            donorPhone: donorPhone.trim(),
            amount: activeAmount,
            paymentProvider: paymentMethod,
            transferReference: transferReference.trim(),
            notes: "Direct manual transfer via website",
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to record manual transfer reference.");
        }

        setVerifiedDonation({
          donationReference: data.internalId,
          paymentId: transferReference.trim(),
          amount: activeAmount,
          currency: "INR",
          donorName: donorName.trim() || "Generous Supporter",
        });

        try {
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {}

        setIsProcessingPayment(false);
        setVerificationStatus("pending");
        setCurrentStep(3);
        return;
      }

      // Flow B: Online Razorpay Checkout
      // 1. Create order on server
      const orderRes = await fetch("/api/donations/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: activeAmount,
          donorName: donorName.trim() || "Generous Supporter",
          donorEmail: donorEmail.trim() || "",
          donorPhone: donorPhone.trim() || "",
          frequency,
          campaign: "First Meal - Vidarbha",
          isTaxReceiptRequested,
        }),
      });

      const orderData = await orderRes.json();
      if (!orderRes.ok || !orderData.success) {
        throw new Error(orderData.error || "Could not initialize payment order.");
      }

      // 2. Load official Razorpay Checkout SDK
      let RazorpaySDK: any = null;
      try {
        RazorpaySDK = await loadRazorpayCheckoutScript();
      } catch {
        // Fallback check
        if (typeof window !== "undefined") {
          RazorpaySDK = (window as any).Razorpay;
        }
      }

      // 3. Launch Checkout if live or sandbox gateway is active
      if (orderData.isLiveGateway && RazorpaySDK) {
        const options = {
          key: orderData.keyId,
          amount: orderData.amount, // in paise
          currency: orderData.currency || "INR",
          name: "Deep Roots Foundation",
          description: "Support food security and community development in Vidarbha",
          image: "/assets/images/logo.png",
          order_id: orderData.orderId,
          prefill: {
            name: donorName.trim() || undefined,
            email: donorEmail.trim() || undefined,
            contact: donorPhone.trim() || undefined,
          },
          notes: {
            donationReference: orderData.donationReference,
          },
          theme: {
            color: "#b83a24",
          },
          handler: async function (response: any) {
            setVerificationStatus("verifying");
            setIsProcessingPayment(true);

            try {
              // 4. Server-Side Payment Verification & Status Confirmation
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
                // Success: Verified & Captured
                setVerifiedDonation({
                  donationReference: verifyData.donationReference,
                  paymentId: verifyData.paymentId,
                  orderId: verifyData.orderId,
                  amount: verifyData.amount,
                  currency: verifyData.currency,
                  donorName: verifyData.donorName || donorName || "Generous Supporter",
                  capturedAt: verifyData.capturedAt,
                });

                setVerificationStatus("success");
                setIsProcessingPayment(false);
                setCurrentStep(3);

                try {
                  confetti({
                    particleCount: 80,
                    spread: 85,
                    origin: { y: 0.6 },
                    colors: ["#b83a24", "#66873b", "#fa9f19", "#f5d000"],
                  });
                } catch {}
              } else if (verifyData.pending) {
                // Authorized but pending capture
                setVerifiedDonation({
                  donationReference: verifyData.donationReference || orderData.donationReference,
                  paymentId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id,
                  amount: activeAmount,
                  currency: "INR",
                  donorName: donorName || "Generous Supporter",
                });
                setPendingMessage(
                  verifyData.message ||
                    "Your payment has been authorized by your bank, but confirmation is pending settlement. Please check back shortly."
                );
                setVerificationStatus("pending");
                setIsProcessingPayment(false);
                setCurrentStep(3);
              } else {
                throw new Error(verifyData.error || "Payment signature or capture verification failed.");
              }
            } catch (vErr: unknown) {
              console.error(vErr);
              setErrorMessage(vErr instanceof Error ? vErr.message : "Verification failed.");
              setVerificationStatus("failed");
              setIsProcessingPayment(false);
            }
          },
          modal: {
            ondismiss: function () {
              // Reset loading so donor can retry without marking as failed
              setIsProcessingPayment(false);
            },
          },
        };

        const rzp = new RazorpaySDK(options);
        rzp.on("payment.failed", function (response: any) {
          console.warn("Payment failed callback:", response?.error);
          setErrorMessage(
            response?.error?.description || "Payment failed. Please try again or use another payment method."
          );
          setIsProcessingPayment(false);
          setVerificationStatus("failed");
        });
        rzp.open();
      } else {
        throw new Error(
          orderData.error || "Unable to launch Razorpay checkout. Please check your internet connection or try again."
        );
      }
    } catch (err: unknown) {
      console.error(err);
      setErrorMessage(err instanceof Error ? err.message : "An unexpected payment error occurred.");
      setIsProcessingPayment(false);
      setVerificationStatus("failed");
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <section className="py-12 sm:py-24 bg-cream/60 relative scroll-mt-20 overflow-hidden" id="donate">
      <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-8 sm:mb-12"
        >
          <span className="text-[10px] sm:text-xs uppercase tracking-widest font-bold text-rust bg-rust/10 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full inline-block mb-3 shadow-sm border border-rust/20">
            CONTRIBUTION & MEAL SPONSORSHIP
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-earth tracking-tight leading-tight">
            Your Contribution. <br className="hidden sm:inline" />
            <span className="text-rust italic font-normal">A Nourishing Difference.</span>
          </h2>
          <p className="mt-3 sm:mt-4 text-xs sm:text-base text-earth/75 leading-relaxed font-sans max-w-lg mx-auto">
            Three simple steps to nourish vulnerable communities: select your amount, pay securely via Razorpay, and receive your verified digital receipt.
          </p>
        </motion.div>

        {/* Dynamic 3-Step Container Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-10 shadow-card border border-earth/10 relative overflow-hidden transition-shadow duration-300 hover:shadow-hover"
        >
          {/* Top Animated Progress Bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gray-100">
            <motion.div
              animate={{
                width: currentStep === 1 ? "33.3%" : currentStep === 2 ? "66.6%" : "100%",
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="h-full bg-gradient-to-r from-rust via-saffron to-leaf"
            />
          </div>

          {/* Stepper Header Pills */}
          <div className="mb-8 pt-2 pb-6 border-b border-gray-100">
            <div className="flex items-center justify-between max-w-md mx-auto">
              {/* Step 1 Pill */}
              <div
                onClick={() => currentStep > 1 && setCurrentStep(1)}
                className={`flex items-center gap-2 cursor-pointer transition-all ${
                  currentStep === 1
                    ? "text-rust font-bold scale-105"
                    : currentStep > 1
                    ? "text-leaf font-semibold"
                    : "text-gray-400"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-colors ${
                    currentStep === 1
                      ? "bg-rust text-white shadow-md ring-4 ring-rust/20"
                      : currentStep > 1
                      ? "bg-leaf text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {currentStep > 1 ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : "1"}
                </div>
                <span className="text-xs uppercase tracking-wider hidden sm:inline">Amount</span>
              </div>

              {/* Connecting Bar 1 */}
              <div
                className={`flex-1 h-0.5 mx-2 sm:mx-3 transition-colors ${
                  currentStep >= 2 ? "bg-leaf" : "bg-gray-200"
                }`}
              />

              {/* Step 2 Pill */}
              <div
                onClick={() => currentStep === 3 && setCurrentStep(2)}
                className={`flex items-center gap-2 cursor-pointer transition-all ${
                  currentStep === 2
                    ? "text-rust font-bold scale-105"
                    : currentStep > 2
                    ? "text-leaf font-semibold"
                    : "text-gray-400"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-colors ${
                    currentStep === 2
                      ? "bg-rust text-white shadow-md ring-4 ring-rust/20"
                      : currentStep > 2
                      ? "bg-leaf text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {currentStep > 2 ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : "2"}
                </div>
                <span className="text-xs uppercase tracking-wider hidden sm:inline">Checkout</span>
              </div>

              {/* Connecting Bar 2 */}
              <div
                className={`flex-1 h-0.5 mx-2 sm:mx-3 transition-colors ${
                  currentStep === 3 ? "bg-leaf" : "bg-gray-200"
                }`}
              />

              {/* Step 3 Pill */}
              <div
                className={`flex items-center gap-2 transition-all ${
                  currentStep === 3 ? "text-rust font-bold scale-105" : "text-gray-400"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-colors ${
                    currentStep === 3
                      ? "bg-rust text-white shadow-md ring-4 ring-rust/20"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  3
                </div>
                <span className="text-xs uppercase tracking-wider hidden sm:inline">Receipt</span>
              </div>
            </div>
          </div>

          {/* Animated Error Banner */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                role="alert"
                className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <span>{errorMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Dynamic Content Transitions */}
          <AnimatePresence mode="wait">
            {/* ============================================================ */}
            {/* STEP 1: SELECT DONATION AMOUNT + OPTIONAL DONOR DETAILS */}
            {/* ============================================================ */}
            {currentStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="space-y-8"
              >
                <div>
                  <div className="flex items-center justify-between mb-3.5">
                    <label className="block text-xs uppercase tracking-wider font-bold text-earth/80">
                      Step 1: Select Contribution Amount
                    </label>
                    <span className="text-[11px] font-bold text-rust">
                      Selected: ₹{activeAmount.toLocaleString("en-IN")}
                    </span>
                  </div>

                  {/* 5-Card Responsive Tier Grid */}
                  <div
                    role="radiogroup"
                    aria-label="Suggested donation amounts"
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3"
                  >
                    {DONATION_TIERS.map((tier, idx) => {
                      const isSelected = !customAmount && selectedAmount === tier.amount;
                      return (
                        <motion.div
                          key={tier.id}
                          role="radio"
                          aria-checked={isSelected}
                          tabIndex={0}
                          onClick={() => handleSelectTier(tier.amount)}
                          onKeyDown={(e) => handleCardKeyDown(e, tier.amount)}
                          whileHover={{ y: -4, scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                          className={`relative p-3 sm:p-4 rounded-xl sm:rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between text-left focus:outline-none focus:ring-2 focus:ring-rust focus:ring-offset-2 ${
                            idx === 4 ? "col-span-2 sm:col-span-1" : ""
                          } ${
                            isSelected
                              ? "border-rust bg-rust/[0.06] shadow-lg ring-2 ring-rust-light/60"
                              : "border-gray-200/90 bg-white hover:border-rust/40 hover:bg-rust/[0.02]"
                          }`}
                        >
                          {tier.isPopular && (
                            <span className="absolute -top-2.5 right-1.5 sm:right-3 bg-rust text-white font-black text-[9px] sm:text-[10px] uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full border border-rust-light/40 shadow-sm flex items-center gap-1">
                              <Sparkles className="w-2.5 h-2.5 fill-white" />
                              <span>Popular</span>
                            </span>
                          )}

                          <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                            <span className="font-serif text-xl sm:text-2xl font-bold text-earth">
                              {tier.label}
                            </span>
                            <div
                              className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border flex items-center justify-center transition-all ${
                                isSelected
                                  ? "border-rust bg-rust text-white scale-110"
                                  : "border-gray-300 bg-white text-transparent"
                              }`}
                            >
                              <Check className="w-2.5 h-2.5 sm:w-3 sm:h-3 stroke-[3]" />
                            </div>
                          </div>

                          <p className="text-[11px] sm:text-xs text-earth/80 font-medium leading-snug line-clamp-2 sm:line-clamp-none">
                            {tier.subtext}
                          </p>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Custom Donation Field */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <label
                        htmlFor="customAmountInput"
                        className="text-xs font-bold text-earth uppercase tracking-wider"
                      >
                        Or Enter Custom Amount (₹)
                      </label>
                      <div className="relative max-w-xs w-full">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-serif text-rust text-lg font-bold pointer-events-none">
                          ₹
                        </span>
                        <input
                          id="customAmountInput"
                          type="text"
                          inputMode="numeric"
                          value={customAmount}
                          onChange={handleCustomChange}
                          placeholder="e.g. 2500"
                          className={`w-full pl-9 pr-4 py-2.5 rounded-xl border text-earth font-bold placeholder:font-normal placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-rust transition-all ${
                            customAmount ? "border-rust bg-rust/[0.03] ring-1 ring-rust/20" : "border-gray-200 bg-gray-50/50"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Optional Donor Information */}
                <div className="bg-gray-50/60 rounded-2xl p-4 sm:p-6 border border-gray-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-earth">
                      Donor Details <span className="text-earth/50 text-[11px] font-normal">(Optional for Instant Receipt)</span>
                    </span>
                    <span className="text-[11px] text-leaf font-bold flex items-center gap-1">
                      <Lock className="w-3 h-3 text-leaf" /> Confidential
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <div className="relative">
                        <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={donorName}
                          onChange={(e) => setDonorName(e.target.value)}
                          placeholder="Your Name (e.g. Rahul Sharma)"
                          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 bg-white text-earth focus:outline-none focus:ring-2 focus:ring-rust"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="email"
                          value={donorEmail}
                          onChange={(e) => setDonorEmail(e.target.value)}
                          placeholder="Email Address (for receipt)"
                          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 bg-white text-earth focus:outline-none focus:ring-2 focus:ring-rust"
                        />
                      </div>
                    </div>
                    <div className="sm:col-span-2">
                      <div className="relative">
                        <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="tel"
                          value={donorPhone}
                          onChange={(e) => setDonorPhone(e.target.value)}
                          placeholder="Phone Number (optional)"
                          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 bg-white text-earth focus:outline-none focus:ring-2 focus:ring-rust"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Continue CTA to Step 2 */}
                <motion.button
                  type="button"
                  onClick={handleProceedToStep2}
                  disabled={activeAmount <= 0}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="relative w-full py-4 px-6 rounded-2xl bg-rust hover:bg-rust-hover disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-black text-base uppercase tracking-wider shadow-xl border-2 border-rust-light/50 transition-colors flex items-center justify-center gap-3 cursor-pointer focus:outline-none focus:ring-4 focus:ring-rust-light/40 overflow-hidden group"
                >
                  <motion.span
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                    className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/35 to-transparent skew-x-12 pointer-events-none"
                  />
                  <Heart className="w-5 h-5 fill-white text-white group-hover:scale-125 transition-transform duration-300 relative z-10 shrink-0" />
                  <span className="relative z-10 font-black">
                    Proceed to Payment (₹{activeAmount.toLocaleString("en-IN")})
                  </span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                </motion.button>
              </motion.div>
            )}

            {/* ============================================================ */}
            {/* STEP 2: CHECKOUT & PAYMENT METHOD */}
            {/* ============================================================ */}
            {currentStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="space-y-6"
              >
                {/* Back to Step 1 Button */}
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-earth/70 hover:text-rust transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Change Amount or Details</span>
                </button>

                {/* Amount Summary Highlight Card */}
                <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-cream via-white to-rust/5 border-2 border-rust/20 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                  <div>
                    <span className="text-[11px] uppercase tracking-wider font-bold text-rust">
                      Ready to Complete Donation
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-earth mt-0.5">
                      ₹{activeAmount.toLocaleString("en-IN")}
                    </h3>
                    <p className="text-xs text-earth/70 mt-1 font-sans">
                      Beneficiary: Deep Roots Foundation · Hunger Relief in Vidarbha
                    </p>
                    {donorName && (
                      <p className="text-[11px] text-earth/60 font-sans mt-0.5">
                        Donor: {donorName} {donorEmail ? `(${donorEmail})` : ""}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-leaf/20 shadow-sm text-xs font-bold text-leaf">
                    <ShieldCheck className="w-4 h-4 text-leaf" />
                    <span>256-Bit SSL Secured</span>
                  </div>
                </div>

                {/* RAZORPAY CHECKOUT CARD */}
                <div className="p-6 sm:p-8 rounded-2xl bg-white border-2 border-rust/30 shadow-card text-center space-y-6">
                  <div className="w-16 h-16 rounded-full bg-rust/10 text-rust flex items-center justify-center mx-auto shadow-inner">
                    <Lock className="w-8 h-8 text-rust animate-pulse" />
                  </div>

                  <div className="max-w-md mx-auto space-y-2">
                    <h3 className="font-serif text-xl sm:text-2xl text-earth font-bold">
                      Pay via Razorpay Secure Checkout
                    </h3>
                    <p className="text-xs sm:text-sm text-earth/75 font-sans leading-relaxed">
                      Instant checkout supporting UPI (Google Pay, PhonePe, Paytm), Debit/Credit Cards, and NetBanking with verified server-side capture.
                    </p>
                  </div>

                  {/* Razorpay Launch Button */}
                  <motion.button
                    type="button"
                    disabled={isProcessingPayment}
                    onClick={handleExecutePayment}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative w-full max-w-md mx-auto py-4 px-8 rounded-2xl bg-rust hover:bg-rust-hover disabled:bg-gray-400 text-white font-black text-base uppercase tracking-wider shadow-2xl border-2 border-rust-light/60 transition-all flex items-center justify-center gap-3 cursor-pointer overflow-hidden group"
                  >
                    <motion.span
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                      className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/35 to-transparent skew-x-12 pointer-events-none"
                    />

                    {isProcessingPayment ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin relative z-10" />
                        <span className="relative z-10">
                          {verificationStatus === "verifying"
                            ? "Verifying Payment with Bank..."
                            : "Connecting to Razorpay..."}
                        </span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5 relative z-10" />
                        <span className="relative z-10">
                          Pay ₹{activeAmount.toLocaleString("en-IN")} via Razorpay
                        </span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                      </>
                    )}
                  </motion.button>

                  <div className="flex items-center justify-center gap-4 text-[11px] text-earth/60 font-sans">
                    <span>• PCI-DSS Level 1 Certified</span>
                    <span>• Verified Server-Side Confirmation</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ============================================================ */}
            {/* STEP 3: VERIFIED PAYMENT CONFIRMATION & OFFICIAL RECEIPT */}
            {/* ============================================================ */}
            {currentStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="space-y-6"
              >
                {/* Status Alert Banner */}
                {verificationStatus === "pending" || pendingMessage ? (
                  <div className="p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 text-amber-900 flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
                      <Sparkles className="w-6 h-6 stroke-[2.5]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-black uppercase tracking-wider text-amber-800">
                        Payment Confirmation Pending
                      </span>
                      <p className="text-xs sm:text-sm font-medium mt-1 leading-relaxed">
                        {pendingMessage ||
                          "Your payment has been initiated. Our systems are awaiting final settlement confirmation from your bank."}
                      </p>
                      {verifiedDonation?.donationReference && (
                        <p className="text-[11px] font-mono mt-1 text-amber-700">
                          Reference Token: {verifiedDonation.donationReference}
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-5 rounded-2xl bg-leaf/10 border-2 border-leaf/30 flex items-start sm:items-center gap-3.5">
                    <div className="w-10 h-10 rounded-full bg-leaf text-white flex items-center justify-center shrink-0 shadow-md">
                      <CheckCircle2 className="w-6 h-6 stroke-[2.5]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-black uppercase tracking-wider text-leaf">
                          Payment Verified & Captured
                        </span>
                        {verifiedDonation?.donationReference && (
                          <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-leaf/20 text-earth">
                            Ref: {verifiedDonation.donationReference}
                          </span>
                        )}
                      </div>
                      <p className="text-sm font-bold text-earth mt-0.5">
                        Thank you for supporting Deep Roots Foundation. Your donation has been successfully received.
                      </p>
                    </div>
                  </div>
                )}

                {/* Printable Digital Receipt Card */}
                <div className="p-5 sm:p-7 rounded-2xl bg-gray-50/90 border border-gray-200 text-left text-xs sm:text-sm font-sans space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                    <div>
                      <span className="font-serif text-xl sm:text-2xl text-earth font-bold block leading-tight">
                        Deep Roots Foundation
                      </span>
                      <span className="text-[10px] text-earth/70 uppercase font-semibold">
                        Section 8 Non-Profit · Vidarbha Hunger Relief
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-earth/60 uppercase block font-bold">
                        Donation Reference
                      </span>
                      <span className="font-mono font-bold text-rust text-xs sm:text-sm">
                        {verifiedDonation?.donationReference || "DRF-CONFIRMED"}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <span className="text-[10px] text-earth/60 uppercase font-bold block">
                        Donor Name
                      </span>
                      <span className="font-bold text-earth text-sm">
                        {verifiedDonation?.donorName || donorName || "Generous Supporter"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-earth/60 uppercase font-bold block">
                        Amount Contributed
                      </span>
                      <span className="font-black text-rust text-base sm:text-lg">
                        ₹{(verifiedDonation?.amount || activeAmount).toLocaleString("en-IN")}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-earth/60 uppercase font-bold block">
                        Payment Gateway Ref
                      </span>
                      <span className="font-mono text-xs text-earth/80 truncate block">
                        {verifiedDonation?.paymentId || "rzp_verified"}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-earth/60 uppercase font-bold block">
                        Status
                      </span>
                      <span className="inline-flex items-center gap-1 font-bold text-leaf text-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>Captured & Recorded</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Receipt Actions */}
                <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={handlePrint}
                    type="button"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-rust hover:bg-rust-hover text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Print Receipt</span>
                  </button>

                  <button
                    onClick={() => {
                      router.push(
                        `/thank-you?id=${encodeURIComponent(
                          verifiedDonation?.donationReference || "DRF-CONFIRMED"
                        )}&name=${encodeURIComponent(
                          verifiedDonation?.donorName || donorName || "Generous Supporter"
                        )}&amount=${verifiedDonation?.amount || activeAmount}&status=successful&provider=razorpay&ref=${encodeURIComponent(
                          verifiedDonation?.paymentId || "N/A"
                        )}`
                      );
                    }}
                    type="button"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-cream border border-gray-200 text-earth text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
                  >
                    <Receipt className="w-4 h-4" />
                    <span>View Dedicated Receipt Page</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Trust Badges Footer Bar */}
          <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-[11px] sm:text-xs text-earth/70">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-leaf" />
              <span>256-Bit SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-leaf" />
              <span>Section 8 Registered Non-Profit</span>
            </div>
            <div className="flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-leaf" />
              <span>Verified Payment Capture</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
