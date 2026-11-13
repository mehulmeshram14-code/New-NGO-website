"use client";

import { CalendarDays, CalendarRange, Sun } from "lucide-react";
import { useDonation } from "@/components/donation/DonationProvider";
import { formatINR, mealsFor, sponsorships } from "@/data/donation";
import { hungerFreeCampaign } from "@/data/hungerFreeCampaign";

const { sponsor } = hungerFreeCampaign;
const ICONS = [Sun, CalendarDays, CalendarRange];

export function Sponsorships() {
  const { startDonation } = useDonation();

  return (
    <section className="bg-ivory py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 md:px-12">
        <p className="text-sm font-bold uppercase tracking-widest text-accent-gold-deep">{sponsor.eyebrow}</p>
        <h2 className="mt-2 text-3xl text-primary-green md:text-4xl">{sponsor.title}</h2>
        <p className="mt-3 max-w-2xl text-muted">{sponsor.description}</p>

        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {sponsorships.map((option, i) => {
            const Icon = ICONS[i] ?? Sun;
            return (
              <li key={option.title} className="flex flex-col rounded-3xl border border-sand bg-white p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-green/10 text-primary-green">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-sans text-lg text-charcoal">{option.title}</h3>
                <p className="text-sm font-semibold text-accent-gold-deep">{mealsFor(option.amount).toLocaleString("en-IN")} meals</p>
                <p className="mt-2 flex-1 text-sm text-muted">{option.detail}</p>
                <button
                  type="button"
                  onClick={() => startDonation(option.amount)}
                  className="mt-5 self-start rounded-full bg-primary-green px-5 py-2.5 font-bold text-white transition-colors hover:bg-primary-green-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-green focus-visible:ring-offset-2"
                >
                  Give {formatINR(option.amount)}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
