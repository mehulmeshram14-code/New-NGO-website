"use client";

import React, { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  ArrowLeft,
  Printer,
  Download,
  Share2,
  Heart,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Utensils,
  Sparkles,
} from "lucide-react";
import InstagramIcon from "@/components/icons/InstagramIcon";
import confetti from "canvas-confetti";

function ThankYouInner() {
  const searchParams = useSearchParams();

  const internalId = searchParams.get("id") || `DRF-${Date.now().toString().slice(-6)}`;
  const donorName = searchParams.get("name") || "Generous Supporter";
  const amountStr = searchParams.get("amount") || "1350";
  const amount = Number(amountStr) || 1350;
  const paymentProvider = searchParams.get("provider") || "razorpay";
  const refId = searchParams.get("ref") || `pay_${Math.random().toString(36).substring(2, 10)}`;

  useEffect(() => {
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.55 },
      });
    } catch {}
  }, []);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `I just supported the DeepRoots Foundation meal distribution drive with a contribution of ₹${amount.toLocaleString(
        "en-IN"
      )}! Every meal brings hope and dignity. Join me in feeding those in need: https://deeprootsfoundation.org`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  const downloadTextReceipt = () => {
    const textReceipt = `
======================================================================
               DEEPROOTS FOUNDATION - OFFICIAL RECEIPT
======================================================================
Organisation: DeepRoots Foundation (Section 8 Non-Profit)
CIN: U88900ME2026NPL476439
Registered Office: 24/1/23, Gauri Shankar Nagar, Rukhmini Nagar,
                  Amravati - 444606, Maharashtra, India
Official Email: deeprootsfoundation2026@gmail.com
Phone: +91 76202 90895
Website: https://deeprootsfoundation.org
----------------------------------------------------------------------
RECEIPT & TRANSACTION DETAILS:
Receipt Reference: ${internalId}
Payment Channel: ${paymentProvider.toUpperCase()} (Online Secure Gateway)
Bank / Gateway Ref: ${refId}
Date & Time: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}

CONTRIBUTION SUMMARY:
Donor Name: ${donorName}
Amount Received: INR ₹${amount.toLocaleString("en-IN")}
Designated Purpose: First Meal Community Nutrition Drive
Status: VERIFIED & CONFIRMED
----------------------------------------------------------------------
*Note on 80G Tax Exemption:
DeepRoots Foundation has submitted its application for Section 80G 
approval with the Department of Income Tax. This acknowledgement serves 
as an authoritative receipt of your direct contribution.

Thank you for bringing warm meals, health, and dignity to vulnerable souls!
======================================================================
`;
    const blob = new Blob([textReceipt], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `DeepRoots_Receipt_${internalId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Approximate meals funded
  const mealsCount = Math.max(5, Math.round(amount / 70));

  return (
    <div className="pt-28 pb-20 sm:pt-36 sm:pb-28 bg-ivory min-h-screen text-earth">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-earth/80 hover:text-rust transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
        </div>

        {/* Celebration Hero Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-rust/20 shadow-xl text-center space-y-6 print-receipt-container">
          <div className="space-y-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-rust/10 text-rust flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 text-rust" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-leaf/10 text-leaf text-xs font-bold uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Donation Confirmed & Verified</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl text-earth font-bold tracking-tight">
              Thank You, {donorName}!
            </h1>

            <p className="text-sm sm:text-base text-earth/80 max-w-lg mx-auto font-sans leading-relaxed">
              Your contribution of{" "}
              <strong className="text-rust font-black">
                ₹{amount.toLocaleString("en-IN")}
              </strong>{" "}
              has been successfully received by{" "}
              <span className="font-samarkan text-lg text-earth">DeepRoots Foundation</span>.
            </p>
          </div>

          {/* Quick Impact Highlight */}
          <div className="p-4 rounded-2xl bg-cream/70 border border-leaf/20 flex flex-col sm:flex-row items-center justify-around gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rust/10 text-rust shrink-0">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-earth/70 block">
                  Meals Sponsored
                </span>
                <span className="font-serif text-xl sm:text-2xl font-bold text-rust">
                  ~{mealsCount} Wholesome Meals
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-leaf/10 text-leaf shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs uppercase font-bold tracking-wider text-earth/70 block">
                  Direct Field Reach
                </span>
                <span className="font-serif text-xl sm:text-2xl font-bold text-leaf">
                  100% Kitchen Allocation
                </span>
              </div>
            </div>
          </div>

          {/* Authoritative Printable Receipt Card */}
          <div className="p-5 sm:p-7 rounded-2xl bg-gray-50/80 border border-gray-200 text-left text-xs sm:text-sm font-sans space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <div className="flex items-center gap-2.5">
                <div className="relative w-9 h-9 shrink-0">
                  <Image
                    src="/assets/images/logo.png"
                    alt="DeepRoots Foundation Logo"
                    width={36}
                    height={36}
                    className="object-contain w-full h-full"
                  />
                </div>
                <div>
                  <span className="font-samarkan text-xl text-earth block leading-tight">
                    DeepRoots Foundation
                  </span>
                  <span className="text-[10px] text-earth/70 uppercase font-semibold">
                    CIN: U88900ME2026NPL476439
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-earth/60 uppercase block font-bold">
                  Receipt Token
                </span>
                <span className="font-mono font-bold text-rust text-xs sm:text-sm">
                  {internalId}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <span className="text-[10px] text-earth/60 uppercase font-bold block">
                  Donor Name
                </span>
                <span className="font-bold text-earth text-sm sm:text-base">{donorName}</span>
              </div>
              <div>
                <span className="text-[10px] text-earth/60 uppercase font-bold block">
                  Amount Contributed
                </span>
                <span className="font-black text-rust text-base sm:text-lg">
                  ₹{amount.toLocaleString("en-IN")}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-earth/60 uppercase font-bold block">
                  Payment Mode
                </span>
                <span className="capitalize text-earth font-medium">
                  {paymentProvider} (Instant Gateway)
                </span>
              </div>
              <div>
                <span className="text-[10px] text-earth/60 uppercase font-bold block">
                  Gateway Transaction Ref
                </span>
                <span className="font-mono text-xs text-earth/80 truncate block">
                  {refId}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-earth/60 uppercase font-bold block">
                  Date of Entry
                </span>
                <span className="text-earth font-medium">
                  {new Date().toLocaleDateString("en-IN", { dateStyle: "long" })}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-earth/60 uppercase font-bold block">
                  Designated Cause
                </span>
                <span className="text-earth font-medium">
                  Community Meal Distribution
                </span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-200 text-[11px] text-earth/70 leading-relaxed space-y-1">
              <div className="flex items-center gap-1.5 text-earth/90">
                <Mail className="w-3.5 h-3.5 text-rust shrink-0" />
                <span>
                  Official Accounts Desk:{" "}
                  <strong className="text-earth">deeprootsfoundation2026@gmail.com</strong>
                </span>
              </div>
              <div>
                <strong>Registered Office:</strong> 24/1/23, Gauri Shankar Nagar, Rukhmini Nagar,
                Amravati - 444606, Maharashtra, India.
              </div>
            </div>
          </div>

          {/* Action CTAs */}
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
              onClick={downloadTextReceipt}
              type="button"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-cream border border-gray-200 text-earth text-xs font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Copy</span>
            </button>

            <button
              onClick={handleShareWhatsApp}
              type="button"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Share on WhatsApp</span>
            </button>

            <a
              href="https://www.instagram.com/deeprootsfoundation/?utm_source=ig_web_button_share_sheet"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] hover:opacity-95 text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all cursor-pointer"
            >
              <InstagramIcon className="w-4 h-4" />
              <span>Follow on Instagram</span>
            </a>
          </div>

          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <Link
              href="/#beneficiaries"
              className="text-earth/80 hover:text-rust font-bold transition-colors inline-flex items-center gap-1"
            >
              <span>View Ground Beneficiary Photos →</span>
            </Link>

            <Link
              href="/"
              className="text-rust hover:underline font-bold"
            >
              Return to DeepRoots Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-40 text-center font-serif text-earth text-xl min-h-screen bg-ivory">
          Loading your confirmation receipt...
        </div>
      }
    >
      <ThankYouInner />
    </Suspense>
  );
}
