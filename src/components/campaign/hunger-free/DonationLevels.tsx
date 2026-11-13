"use client";

import { useDonation } from "@/components/donation/DonationProvider";
import { cn } from "@/components/ui/Button";
import { donationLevels, formatINR, mealsFor } from "@/data/donation";
import { hungerFreeCampaign } from "@/data/hungerFreeCampaign";

const { levels } = hungerFreeCampaign;

export function DonationLevels() {
  const { startDonation, presetAmount, customInput } = useDonation();

  return (
    <section className="bg-sand/40 py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 md:px-12">
        <p className="text-sm font-bold uppercase tracking-widest text-accent-gold-deep">{levels.eyebrow}</p>
        <h2 className="mt-2 text-3xl text-primary-green md:text-4xl">{levels.title}</h2>
        <p className="mt-3 max-w-2xl text-muted">{levels.description}</p>

        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {donationLevels.map((level) => {
            const selected = !customInput && presetAmount === level.amount;
            return (
              <button
                key={level.amount}
                type="button"
                onClick={() => startDonation(level.amount)}
                aria-label={`${level.name}: donate ${formatINR(level.amount)}, ${mealsFor(level.amount)} meals`}
                className={cn(
                  "group relative flex flex-col rounded-3xl border-2 bg-white p-5 text-left transition-all hover:-translate-y-1 hover:border-primary-green hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-green focus-visible:ring-offset-2",
                  selected ? "border-primary-green" : "border-transparent shadow-sm"
                )}
              >
                {level.badge && (
                  <span className="absolute -top-3 left-5 rounded-full bg-accent-gold-deep px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                    {level.badge}
                  </span>
                )}
                <span className="font-serif text-xl text-primary-green">{level.name}</span>
                <span className="mt-3 text-2xl font-bold text-charcoal">{formatINR(level.amount)}</span>
                <span className="text-sm font-semibold text-accent-gold-deep">{mealsFor(level.amount)} meals</span>
                <span className="mt-3 flex-1 text-sm text-muted">{level.description}</span>
                <span className="mt-4 text-sm font-bold text-primary-green group-hover:underline">Choose →</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
