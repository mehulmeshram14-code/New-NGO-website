"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Heart, X } from "lucide-react";

const PRESET_AMOUNTS = [500, 1000, 2500, 5000];

export default function StickyDonationBar() {
  const [selectedAmount, setSelectedAmount] = useState(1000);
  const [customAmount, setCustomAmount] = useState("");
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const currentAmount = customAmount ? Number(customAmount) : selectedAmount;

  return (
    <aside
      className="fixed bottom-0 left-0 right-0 z-40 bg-deepgreen/95 backdrop-blur-md text-cream border-t border-gold/30 shadow-2xl py-3 px-4 sm:px-6 transition-all"
      aria-label="Quick Donation Bar"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Caption & Context */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-2">
            <span className="inline-block p-1 bg-terracotta/20 rounded-full text-terracotta">
              <Heart className="w-4 h-4 fill-terracotta" />
            </span>
            <div>
              <p className="text-xs sm:text-sm font-medium tracking-tight">
                <strong className="text-gold">Support First Meal</strong> · Vidarbha Nutrition Drive
              </p>
              <p className="text-[11px] text-cream/70 hidden sm:block">
                Transparent community support directly reaching remote hamlets
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsDismissed(true)}
            className="md:hidden text-cream/60 hover:text-white p-1"
            aria-label="Dismiss quick donation bar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Amount Selector Pills & Action */}
        <div className="flex items-center gap-2 sm:gap-3 w-full md:w-auto justify-between md:justify-end overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center gap-1.5 sm:gap-2" role="radiogroup" aria-label="Select preset donation amount">
            {PRESET_AMOUNTS.map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => {
                  setSelectedAmount(amt);
                  setCustomAmount("");
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all ${
                  selectedAmount === amt && !customAmount
                    ? "bg-terracotta text-white shadow-sm ring-2 ring-terracotta/50"
                    : "bg-forest/50 hover:bg-forest text-cream/90 border border-forest/60"
                }`}
              >
                ₹{amt.toLocaleString("en-IN")}
              </button>
            ))}
          </div>

          {/* CTA Link to Donate Page with selected amount */}
          <Link
            href={`/donate?amount=${currentAmount || 1000}`}
            className="inline-flex items-center justify-center gap-1.5 bg-terracotta hover:bg-terracotta-dark text-white font-semibold text-xs sm:text-sm uppercase tracking-wider px-4 sm:px-6 py-2 rounded-full shadow-terracotta transition-all whitespace-nowrap"
          >
            <Heart className="w-3.5 h-3.5 fill-white" />
            <span>Donate ₹{(currentAmount || 1000).toLocaleString("en-IN")}</span>
          </Link>

          <button
            onClick={() => setIsDismissed(true)}
            className="hidden md:inline-flex text-cream/60 hover:text-white p-1 ml-2"
            aria-label="Dismiss quick donation bar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
