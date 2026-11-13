"use client";

import Image from "next/image";
import { Heart } from "lucide-react";
import { useDonation } from "@/components/donation/DonationProvider";
import { hungerFreeCampaign } from "@/data/hungerFreeCampaign";

const { finalCta } = hungerFreeCampaign;

export function FinalCtaSection() {
  const { startDonation } = useDonation();

  return (
    <section className="bg-ivory py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 md:px-12">
        <div className="grid overflow-hidden rounded-3xl bg-primary-green-deep md:grid-cols-2">
          <div className="relative min-h-64">
            <Image src={finalCta.image} alt={finalCta.imageAlt} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
          </div>
          <div className="flex flex-col items-start justify-center gap-5 p-8 md:p-12">
            <h2 className="text-4xl leading-tight text-white md:text-5xl">{finalCta.title}</h2>
            <p className="text-lg text-ivory/85">{finalCta.description}</p>
            <button
              type="button"
              onClick={() => startDonation()}
              className="inline-flex items-center gap-2 rounded-full bg-accent-gold-deep px-7 py-3.5 font-bold text-white transition-colors hover:bg-white hover:text-primary-green-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold-light focus-visible:ring-offset-2 focus-visible:ring-offset-primary-green-deep"
            >
              <Heart className="h-4 w-4 fill-current" /> Donate now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
