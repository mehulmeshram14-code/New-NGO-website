import React, { Suspense } from "react";
import DonationWidget from "@/components/DonationWidget";
import { ShieldCheck, Heart, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Donate a Meal | DeepRoots Foundation",
  description:
    "Contribute to the First Meal child nutrition drive in Vidarbha, Maharashtra. Support hot, wholesome food and dignity for rural families.",
};

function DonateContent() {
  return (
    <div className="pt-32 pb-24 bg-cream min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-earth hover:text-leaf transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Page Title */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-leaf/10 text-leaf text-xs font-bold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 fill-leaf" />
            <span>Dedicated Contribution Portal</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl text-earth tracking-tight">
            Nourish a Life. Seed Opportunity.
          </h1>
          <p className="text-sm sm:text-base text-earth/80 max-w-2xl font-sans">
            Every rupee donated directly delivers fresh, hot, culturally appropriate meals prepared with dignity for children and elders across Melghat, Amravati, and Gadchiroli.
          </p>
        </div>

        {/* The Donation Widget Container */}
        <DonationWidget isStandalonePage={true} />

        {/* Transparency & Security Assurances */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-leaf/20 shadow-sm space-y-4 text-xs text-earth/85">
          <div className="flex items-center gap-2 font-bold text-earth text-sm">
            <ShieldCheck className="w-5 h-5 text-leaf" />
            <span>Donation Integrity Standards</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1 font-sans">
            <div>
              <strong className="text-earth block mb-0.5">Direct Foundation Account:</strong>
              <p className="text-earth/70">All contributions deposit directly into the official DeepRoots Foundation account at SBI Amravati.</p>
            </div>
            <div>
              <strong className="text-earth block mb-0.5">Authoritative Receipts:</strong>
              <p className="text-earth/70">Official acknowledgement slips with unique transaction reference IDs generated for every contribution.</p>
            </div>
            <div>
              <strong className="text-earth block mb-0.5">Zero Intermediary Deductions:</strong>
              <p className="text-earth/70">No private commissions. Your donation converts directly into grains, produce, and preparation.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DonatePage() {
  return (
    <Suspense fallback={<div className="pt-40 pb-20 text-center font-serif text-earth">Loading donation portal...</div>}>
      <DonateContent />
    </Suspense>
  );
}
