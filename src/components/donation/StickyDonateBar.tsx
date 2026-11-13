"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { DONATION_CARD_ID, useDonation } from "./DonationProvider";
import { formatINR, mealsFor, MIN_DONATION } from "@/data/donation";

/**
 * Mobile-only bar pinned to the bottom of the screen. It shows once the donation
 * card has scrolled out of view, and hides again when the card is visible or the
 * donation is complete.
 */
export function StickyDonateBar() {
  const { amount, step, startDonation } = useDonation();
  const [cardVisible, setCardVisible] = useState(true);

  useEffect(() => {
    const card = document.getElementById(DONATION_CARD_ID);
    if (!card) return;
    const observer = new IntersectionObserver(([entry]) => setCardVisible(entry.isIntersecting), {
      threshold: 0.15,
    });
    observer.observe(card);
    return () => observer.disconnect();
  }, []);

  if (cardVisible || step === "done") return null;

  const validAmount = amount >= MIN_DONATION;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-sand bg-white/95 px-4 py-3 shadow-[0_-6px_20px_rgba(0,0,0,0.08)] backdrop-blur lg:hidden print:hidden">
      <div className="mx-auto flex max-w-md items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-charcoal">
            {validAmount ? `${mealsFor(amount)} warm meals` : "Feed someone"}
          </p>
          <p className="truncate text-xs text-muted">
            {validAmount ? "cooked and served tonight" : `${formatINR(MIN_DONATION)} = one meal`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => startDonation()}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-accent-gold-deep px-5 py-3 font-bold text-white transition-colors hover:bg-primary-brown focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold-deep focus-visible:ring-offset-2"
        >
          <Heart className="h-4 w-4 fill-white" />
          Donate {validAmount ? formatINR(amount) : ""}
        </button>
      </div>
    </div>
  );
}
