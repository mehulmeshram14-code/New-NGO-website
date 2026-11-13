import Image from "next/image";
import { Utensils } from "lucide-react";
import { DonationCard } from "@/components/donation/DonationCard";
import { hungerFreeCampaign } from "@/data/hungerFreeCampaign";
import { formatINR, mealsFor } from "@/data/donation";

const { hero, campaignName, purpose } = hungerFreeCampaign;
const EXAMPLE_AMOUNT = 1000;

export function CampaignHero() {
  return (
    <section className="bg-ivory pt-32 pb-16 md:pt-36 md:pb-24">
      <div className="container mx-auto grid items-start gap-10 px-4 sm:px-6 md:px-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <div>
          <span className="inline-block rounded-full bg-accent-gold/15 px-3 py-1 text-xs font-bold uppercase tracking-widest text-accent-gold-deep">
            {hero.eyebrow}
          </span>
          <h1 className="mt-4 text-4xl leading-tight text-charcoal md:text-5xl lg:text-6xl">
            {hero.titleLead} <span className="italic text-primary-green">{hero.titleAccent}</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">{hero.description}</p>

          <DonationCard campaignName={campaignName} purpose={purpose} className="mt-8" />
        </div>

        <div className="lg:sticky lg:top-32">
          <figure className="relative aspect-[4/3] max-h-[38rem] w-full overflow-hidden rounded-3xl shadow-lg lg:aspect-[4/5]">
            <Image
              src={hero.image}
              alt={hero.imageAlt}
              fill
              priority
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <figcaption className="absolute inset-x-0 bottom-0 p-6 md:p-8">
              <p className="font-serif text-3xl leading-tight text-white md:text-4xl">{hero.imageCaption}</p>
            </figcaption>
          </figure>
          <p className="mt-4 flex items-center gap-3 rounded-2xl border border-sand bg-white px-5 py-4 text-sm text-charcoal">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-green/10 text-primary-green">
              <Utensils className="h-5 w-5" />
            </span>
            <span>
              <strong>{formatINR(EXAMPLE_AMOUNT)}</strong> serves {mealsFor(EXAMPLE_AMOUNT)} freshly cooked meals, prepared
              and served by our volunteers.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
