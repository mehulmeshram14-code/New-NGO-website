"use client";

import { Heart } from "lucide-react";
import { useDonation } from "@/components/donation/DonationProvider";
import { hungerFreeCampaign } from "@/data/hungerFreeCampaign";

const { tagline } = hungerFreeCampaign;

export function TaglineBand() {
  const { startDonation } = useDonation();
  return (
    <section className="bg-accent-gold">
      <div className="container mx-auto flex flex-col items-center justify-between gap-5 px-4 py-8 text-center sm:px-6 md:flex-row md:px-12 md:text-left">
        <p>
          <span className="block font-serif text-3xl italic text-charcoal md:text-4xl">{tagline.line}</span>
          <span className="mt-1 block text-sm font-semibold text-charcoal/80">{tagline.translation}</span>
        </p>
        <button
          type="button"
          onClick={() => startDonation()}
          className="inline-flex shrink-0 items-center gap-2 rounded-full bg-primary-green-deep px-7 py-3.5 font-bold text-white transition-colors hover:bg-charcoal focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-green-deep focus-visible:ring-offset-2 focus-visible:ring-offset-accent-gold"
        >
          <Heart className="h-4 w-4 fill-white" /> Donate now
        </button>
      </div>
    </section>
  );
}
