"use client";

import React, { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, Clock, AlertTriangle, ArrowLeft, Printer, Download, Share2, Heart } from "lucide-react";
import confetti from "canvas-confetti";

function ConfirmationInner() {
  const searchParams = useSearchParams();

  const internalId = searchParams.get("id") || "DRF-2026-PENDING";
  const donorName = searchParams.get("name") || "Generous Supporter";
  const amount = searchParams.get("amount") || "1000";
  const status = searchParams.get("status") || "awaiting_verification";
  const paymentProvider = searchParams.get("provider") || "bank_transfer";
  const refId = searchParams.get("ref") || "";

  const isSuccess = status === "successful";
  const isPending = status === "awaiting_verification";
  const isFailed = status === "failed";

  useEffect(() => {
    if (isSuccess && typeof confetti === "function") {
      confetti({
        particleCount: 90,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  }, [isSuccess]);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const downloadTextReceipt = () => {
    const textReceipt = `
======================================================================
               DEEPROOTS FOUNDATION - DONATION ACKNOWLEDGEMENT
======================================================================
Organisation: DeepRoots Foundation (Section 8 Non-Profit)
CIN: U88900ME2026NPL476439
Registered Office: 24/1/23, Gauri Shankar Nagar, Rukhmini Nagar,
                  Amravati - 444606, Maharashtra, India
Official Email: deeprootsfoundation2026@gmail.com
Website: https://deeprootsfoundation.org
----------------------------------------------------------------------
ACKNOWLEDGEMENT DETAILS:
Internal Reference ID: ${internalId}
Payment Provider / Method: ${paymentProvider.toUpperCase()}
Transaction / UTR Reference: ${refId || "N/A"}
Date & Time: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}

CONTRIBUTION SUMMARY:
Donor Name: ${donorName}
Amount Received / Pledged: INR ₹${Number(amount).toLocaleString("en-IN")}
Designated Campaign: First Meal - Vidarbha Community Nutrition
Status: ${isSuccess ? "VERIFIED & CONFIRMED" : "AWAITING VERIFICATION BY ACCOUNTS"}
----------------------------------------------------------------------
*Note on 80G Tax Exemption:
DeepRoots Foundation has submitted its application for Section 80G 
approval with the Department of Income Tax. This acknowledgement serves 
as an authoritative receipt of your direct contribution to our mission.

With heartfelt gratitude for supporting dignity and nourishment in Vidarbha!
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

  return (
    <div className="pt-32 pb-24 bg-cream min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-forest hover:text-terracotta transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>
        </div>

        {/* Status Hero Card */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-forest/15 shadow-2xl space-y-6 text-center print-receipt-container">
          {isSuccess && (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-forest-subtle text-forest flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <span className="inline-block px-3 py-1 rounded-full bg-forest-subtle text-forest text-xs font-bold uppercase tracking-widest">
                Payment Verified &amp; Received
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl text-forest font-bold">
                Thank You, {donorName}!
              </h1>
              <p className="text-sm sm:text-base text-charcoal/80 max-w-lg mx-auto font-sans leading-relaxed">
                Your contribution of <strong className="text-forest font-bold">₹{Number(amount).toLocaleString("en-IN")}</strong> has been authoritatively verified and credited to DeepRoots Foundation.
              </p>
            </div>
          )}

          {isPending && (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-gold/20 text-earth flex items-center justify-center mx-auto shadow-sm">
                <Clock className="w-10 h-10 text-earth" />
              </div>
              <span className="inline-block px-3 py-1 rounded-full bg-gold/15 text-earth text-xs font-bold uppercase tracking-widest">
                Transfer Awaiting Verification
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl text-forest font-bold">
                Reference Registered, {donorName}
              </h1>
              <p className="text-sm sm:text-base text-charcoal/80 max-w-lg mx-auto font-sans leading-relaxed">
                We have registered your transaction reference <code className="bg-cream-dark px-2 py-0.5 rounded font-mono font-bold text-forest">{refId || "N/A"}</code> for ₹{Number(amount).toLocaleString("en-IN")}. Our accounts team verifies incoming bank and UPI credits daily.
              </p>
            </div>
          )}

          {isFailed && (
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto shadow-sm">
                <AlertTriangle className="w-10 h-10" />
              </div>
              <span className="inline-block px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-widest">
                Transaction Incomplete
              </span>
              <h1 className="font-serif text-3xl sm:text-4xl text-forest font-bold">
                Payment Not Confirmed
              </h1>
              <p className="text-sm sm:text-base text-charcoal/80 max-w-lg mx-auto font-sans leading-relaxed">
                The transaction could not be authoritatively confirmed. If funds were deducted, they will automatically reverse per banking rules.
              </p>
            </div>
          )}

          {/* Detailed Printable Receipt Box */}
          <div className="p-6 rounded-2xl bg-cream-light border border-forest/15 text-left text-xs sm:text-sm font-sans space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-forest/10">
              <div className="flex items-center gap-2">
                <Image src="/assets/images/logo.png" alt="Logo" width={32} height={32} />
                <div>
                  <span className="font-serif font-bold text-forest text-base block leading-none">
                    DeepRoots Foundation
                  </span>
                  <span className="text-[10px] text-earth uppercase font-semibold">CIN: U88900ME2026NPL476439</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-charcoal-muted uppercase block">Reference Token</span>
                <span className="font-mono font-bold text-forest">{internalId}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <span className="text-[10px] text-charcoal-muted uppercase font-bold block">Donor Name:</span>
                <span className="font-medium text-charcoal">{donorName}</span>
              </div>
              <div>
                <span className="text-[10px] text-charcoal-muted uppercase font-bold block">Amount:</span>
                <span className="font-bold text-forest text-base">₹{Number(amount).toLocaleString("en-IN")}</span>
              </div>
              <div>
                <span className="text-[10px] text-charcoal-muted uppercase font-bold block">Payment Channel:</span>
                <span className="capitalize">{paymentProvider.replace("_", " ")}</span>
              </div>
              <div>
                <span className="text-[10px] text-charcoal-muted uppercase font-bold block">Bank Reference / UTR:</span>
                <span className="font-mono">{refId || "Verified Online Gateway"}</span>
              </div>
              <div>
                <span className="text-[10px] text-charcoal-muted uppercase font-bold block">Date of Entry:</span>
                <span>{new Date().toLocaleDateString("en-IN", { dateStyle: "long" })}</span>
              </div>
              <div>
                <span className="text-[10px] text-charcoal-muted uppercase font-bold block">Designated Purpose:</span>
                <span>Vidarbha First Meal Child Nutrition</span>
              </div>
            </div>

            <div className="pt-3 border-t border-forest/10 text-[11px] text-charcoal/70 leading-relaxed">
              <strong>Registered Office:</strong> 24/1/23, Gauri Shankar Nagar, Rukhmini Nagar, Amravati - 444606, Maharashtra · 
              <span className="italic"> All donations directly power hot meals, educational kits, and community dignity.</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handlePrint}
              type="button"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-forest text-white text-xs font-semibold uppercase tracking-wider hover:bg-forest-dark transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print Acknowledgement</span>
            </button>

            <button
              onClick={downloadTextReceipt}
              type="button"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-forest border border-forest/20 text-xs font-semibold uppercase tracking-wider hover:bg-cream-dark transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Download Text Copy</span>
            </button>

            {isFailed && (
              <Link
                href="/donate"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-terracotta text-white text-xs font-semibold uppercase tracking-wider hover:bg-terracotta-dark transition-all"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>Try Again</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DonationConfirmationPage() {
  return (
    <Suspense fallback={<div className="pt-40 text-center font-serif">Loading confirmation...</div>}>
      <ConfirmationInner />
    </Suspense>
  );
}
