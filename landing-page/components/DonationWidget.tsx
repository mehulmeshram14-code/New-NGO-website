"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, ShieldCheck, QrCode, Building, CreditCard, Check, AlertCircle, Loader2 } from "lucide-react";
import { loadRazorpayCheckoutScript } from "@/lib/loadRazorpay";

interface DonationWidgetProps {
  initialAmount?: number;
  isStandalonePage?: boolean;
}

const PRESET_AMOUNTS = [350, 550, 1350, 2000, 5000];

export default function DonationWidget({ initialAmount = 1350, isStandalonePage = false }: DonationWidgetProps) {
  const router = useRouter();

  // State
  const [amount, setAmount] = useState<number>(initialAmount);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [frequency, setFrequency] = useState<"one_time" | "monthly">("one_time");
  const [paymentMethod, setPaymentMethod] = useState<"gateway" | "upi_manual" | "bank_transfer">("gateway");

  // Form Fields
  const [donorName, setDonorName] = useState("");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorPhone, setDonorPhone] = useState("");
  const [transferReference, setTransferReference] = useState("");
  const [isTaxReceiptRequested, setIsTaxReceiptRequested] = useState(false);
  const [notes, setNotes] = useState("");

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const activeAmount = customAmount ? parseInt(customAmount, 10) || 0 : amount;

  // Handle Preset Click
  const handleSelectPreset = (val: number) => {
    setAmount(val);
    setCustomAmount("");
    setErrorMessage("");
  };

  // Handle Custom Amount Input
  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    setCustomAmount(val);
    if (val) {
      setAmount(parseInt(val, 10));
    }
  };

  // Submission Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (activeAmount < 10) {
      setErrorMessage("Minimum donation amount is ₹10.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (paymentMethod === "upi_manual" || paymentMethod === "bank_transfer") {
        if (!transferReference.trim()) {
          setErrorMessage("Please enter the UTR or Transaction Reference of your transfer.");
          setIsSubmitting(false);
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
            notes: notes.trim(),
          }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Failed to record transfer reference.");
        }

        // Navigate to authoritative confirmation page
        router.push(
          `/donation-confirmation?id=${data.internalId}&name=${encodeURIComponent(
            donorName || "Generous Supporter"
          )}&amount=${activeAmount}&status=awaiting_verification&provider=${paymentMethod}&ref=${encodeURIComponent(
            transferReference
          )}`
        );
      } else {
        // Online Gateway Flow (Razorpay / Secure Sandbox)
        const res = await fetch("/api/donations/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            donorName: donorName.trim() || "Generous Supporter",
            donorEmail: donorEmail.trim() || "",
            donorPhone: donorPhone.trim() || "",
            amount: activeAmount,
            frequency,
            campaign: "First Meal - Vidarbha",
            isTaxReceiptRequested,
          }),
        });

        const orderData = await res.json();
        if (!res.ok || !orderData.success) {
          throw new Error(orderData.error || "Could not initialize payment order.");
        }

        let RazorpaySDK: any = null;
        try {
          RazorpaySDK = await loadRazorpayCheckoutScript();
        } catch {
          if (typeof window !== "undefined") {
            RazorpaySDK = (window as any).Razorpay;
          }
        }

        if (orderData.isLiveGateway && RazorpaySDK) {
          const options = {
            key: orderData.keyId,
            amount: orderData.amount, // already in paise
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
            handler: async function (response: {
              razorpay_payment_id: string;
              razorpay_order_id: string;
              razorpay_signature: string;
            }) {
              // Authoritatively verify signature on backend
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
              if (verifyRes.ok && verifyData.success) {
                router.push(
                  `/thank-you?id=${encodeURIComponent(
                    verifyData.donationReference || orderData.donationReference
                  )}&name=${encodeURIComponent(
                    verifyData.donorName || donorName || "Generous Supporter"
                  )}&amount=${verifyData.amount || activeAmount}&status=successful&provider=razorpay&ref=${encodeURIComponent(
                    response.razorpay_payment_id
                  )}`
                );
              } else if (verifyData.pending) {
                setErrorMessage(verifyData.message || "Payment is authorized but capture is pending.");
                setIsSubmitting(false);
              } else {
                setErrorMessage(verifyData.error || "Payment signature verification failed.");
                setIsSubmitting(false);
              }
            },
            modal: {
              ondismiss: function () {
                setIsSubmitting(false);
              },
            },
          };

          const rzp = new RazorpaySDK(options);
          rzp.open();
        } else {
          throw new Error(
            orderData.error || "Unable to initialize Razorpay checkout. Please verify your connection."
          );
        }
      }
    } catch (err: unknown) {
      console.error(err);
      setErrorMessage(err instanceof Error ? err.message : "An error occurred while processing your request.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`bg-white rounded-3xl border border-forest/15 shadow-2xl p-6 sm:p-10 ${isStandalonePage ? "max-w-3xl mx-auto" : ""}`}>
      {/* Widget Header */}
      <div className="space-y-2 pb-6 border-b border-forest/10">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-widest text-terracotta font-bold flex items-center gap-1.5">
            <Heart className="w-4 h-4 fill-terracotta" />
            <span>First Meal Campaign</span>
          </span>
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-forest-subtle text-forest">
            Direct Grassroots Support
          </span>
        </div>
        <h3 className="font-serif text-2xl sm:text-3xl text-forest tracking-tight">
          Be part of someone’s first meal.
        </h3>
        <p className="text-xs sm:text-sm text-charcoal/80">
          Your support helps DeepRoots Foundation work towards a future where access to nutritious food does not stand between a person and their potential.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="pt-6 space-y-6">
        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 1. Frequency Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-charcoal">
            Donation Frequency
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFrequency("one_time")}
              className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
                frequency === "one_time"
                  ? "bg-forest text-white border-forest shadow-sm"
                  : "bg-cream-light text-charcoal border-forest/15 hover:border-forest/40"
              }`}
            >
              One-Time Contribution
            </button>
            <button
              type="button"
              onClick={() => setFrequency("monthly")}
              className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
                frequency === "monthly"
                  ? "bg-forest text-white border-forest shadow-sm"
                  : "bg-cream-light text-charcoal border-forest/15 hover:border-forest/40"
              }`}
            >
              Monthly Sustainer
            </button>
          </div>
        </div>

        {/* 2. Amount Selection */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-charcoal">
              Select Donation Amount
            </label>
            <span className="text-[11px] text-charcoal-muted">
              Suggested support tiers
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {PRESET_AMOUNTS.map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => handleSelectPreset(val)}
                className={`py-3 px-3 rounded-xl text-sm font-bold tracking-tight transition-all border ${
                  amount === val && !customAmount
                    ? "bg-terracotta text-white border-terracotta shadow-md"
                    : "bg-cream-light text-forest border-forest/15 hover:border-terracotta/50"
                }`}
              >
                ₹{val.toLocaleString("en-IN")}
              </button>
            ))}
          </div>

          {/* Custom Amount Input */}
          <div className="pt-2">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal-muted font-bold text-sm">
                ₹
              </span>
              <input
                type="text"
                placeholder="Or enter custom amount (e.g. 1500)"
                value={customAmount}
                onChange={handleCustomChange}
                className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-forest/20 text-sm focus:outline-none focus:ring-2 focus:ring-forest bg-cream-light/60 font-medium text-charcoal"
              />
            </div>
          </div>
        </div>

        {/* 3. Donor Information */}
        <div className="space-y-3 pt-2 border-t border-forest/10">
          <label className="text-xs font-bold uppercase tracking-wider text-charcoal block">
            Donor Details
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="donorName" className="text-[11px] font-semibold text-charcoal-muted block mb-1">
                Full Name <span className="text-terracotta">*</span>
              </label>
              <input
                id="donorName"
                type="text"
                required
                placeholder="e.g. Ramesh Deshmukh"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-forest/20 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-forest bg-cream-light/50"
              />
            </div>

            <div>
              <label htmlFor="donorEmail" className="text-[11px] font-semibold text-charcoal-muted block mb-1">
                Email Address <span className="text-terracotta">*</span>
              </label>
              <input
                id="donorEmail"
                type="email"
                required
                placeholder="for acknowledgement slip"
                value={donorEmail}
                onChange={(e) => setDonorEmail(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-forest/20 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-forest bg-cream-light/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="sm:col-span-2">
              <label htmlFor="donorPhone" className="text-[11px] font-semibold text-charcoal-muted block mb-1">
                Mobile Number (Optional)
              </label>
              <input
                id="donorPhone"
                type="tel"
                placeholder="10-digit mobile"
                value={donorPhone}
                onChange={(e) => setDonorPhone(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-forest/20 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-forest bg-cream-light/50"
              />
            </div>
          </div>
        </div>

        {/* 4. Payment Method Tabs */}
        <div className="space-y-3 pt-2 border-t border-forest/10">
          <label className="text-xs font-bold uppercase tracking-wider text-charcoal block">
            Choose Payment Method
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => setPaymentMethod("upi_manual")}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                paymentMethod === "upi_manual"
                  ? "bg-forest-subtle border-forest ring-1 ring-forest"
                  : "bg-cream-light border-forest/15 hover:border-forest/40"
              }`}
            >
              <div className="flex items-center justify-between pb-1">
                <QrCode className="w-4 h-4 text-forest" />
                {paymentMethod === "upi_manual" && <Check className="w-3.5 h-3.5 text-forest" />}
              </div>
              <div>
                <span className="text-xs font-bold text-forest block">UPI / QR Code</span>
                <span className="text-[10px] text-charcoal-muted">Direct transfer</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod("bank_transfer")}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                paymentMethod === "bank_transfer"
                  ? "bg-forest-subtle border-forest ring-1 ring-forest"
                  : "bg-cream-light border-forest/15 hover:border-forest/40"
              }`}
            >
              <div className="flex items-center justify-between pb-1">
                <Building className="w-4 h-4 text-forest" />
                {paymentMethod === "bank_transfer" && <Check className="w-3.5 h-3.5 text-forest" />}
              </div>
              <div>
                <span className="text-xs font-bold text-forest block">Bank Transfer</span>
                <span className="text-[10px] text-charcoal-muted">NEFT / RTGS / IMPS</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod("gateway")}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                paymentMethod === "gateway"
                  ? "bg-forest-subtle border-forest ring-1 ring-forest"
                  : "bg-cream-light border-forest/15 hover:border-forest/40"
              }`}
            >
              <div className="flex items-center justify-between pb-1">
                <CreditCard className="w-4 h-4 text-forest" />
                {paymentMethod === "gateway" && <Check className="w-3.5 h-3.5 text-forest" />}
              </div>
              <div>
                <span className="text-xs font-bold text-forest block">Online Gateway</span>
                <span className="text-[10px] text-charcoal-muted">Razorpay Checkout</span>
              </div>
            </button>
          </div>

          {/* Conditional Instructions for UPI / Bank Transfer */}
          {(paymentMethod === "upi_manual" || paymentMethod === "bank_transfer") && (
            <div className="p-4 rounded-2xl bg-cream border border-forest/20 space-y-3 text-xs text-charcoal">
              <div className="flex items-center gap-2 font-bold text-forest">
                <Building className="w-4 h-4 text-forest" />
                <span>Verified Organisation Bank Account</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 font-mono text-[11px] bg-white p-3 rounded-xl border border-forest/10">
                <div>
                  <span className="text-[10px] font-sans text-charcoal-muted uppercase block">Account Name:</span>
                  <strong className="text-forest">DeepRoots Foundation</strong>
                </div>
                <div>
                  <span className="text-[10px] font-sans text-charcoal-muted uppercase block">UPI ID:</span>
                  <strong className="text-terracotta">deeproots@upi</strong>
                </div>
                <div>
                  <span className="text-[10px] font-sans text-charcoal-muted uppercase block">Account Number:</span>
                  <span>40123456789 (SBI)</span>
                </div>
                <div>
                  <span className="text-[10px] font-sans text-charcoal-muted uppercase block">IFSC Code:</span>
                  <span>SBIN0000312</span>
                </div>
              </div>

              <div>
                <label htmlFor="transferRef" className="text-[11px] font-bold text-forest block mb-1">
                  Enter UTR / Transaction Reference Number <span className="text-terracotta">*</span>
                </label>
                <input
                  id="transferRef"
                  type="text"
                  required
                  placeholder="e.g. 429810238491 or SBI-UTR-XXXXX"
                  value={transferReference}
                  onChange={(e) => setTransferReference(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-forest/30 text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-forest bg-white"
                />
                <p className="text-[10px] text-charcoal-muted mt-1">
                  Submissions are recorded as <strong>Awaiting Verification</strong> until confirmed against bank statements by our accounts team.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || activeAmount < 50}
          className="w-full flex items-center justify-center gap-2 bg-terracotta hover:bg-terracotta-dark disabled:opacity-60 text-white font-bold text-sm sm:text-base uppercase tracking-wider py-4 rounded-full shadow-terracotta transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Processing Contribution...</span>
            </>
          ) : (
            <>
              <Heart className="w-5 h-5 fill-white" />
              <span>Donate ₹{activeAmount.toLocaleString("en-IN")} Now</span>
            </>
          )}
        </button>

        {/* Security & Integrity Note */}
        <div className="flex items-center justify-center gap-2 text-center text-[11px] text-charcoal/70">
          <ShieldCheck className="w-4 h-4 text-forest" />
          <span>Section 8 Registered Non-Profit · Acknowledgement issued for all contributions</span>
        </div>
      </form>
    </div>
  );
}
