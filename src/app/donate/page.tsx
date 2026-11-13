import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DonationProvider } from "@/components/donation/DonationProvider";
import { DonationCard } from "@/components/donation/DonationCard";
import { COST_PER_MEAL, formatINR, generalDonation } from "@/data/donation";
import { HUNGER_FREE_PATH } from "@/data/hungerFreeCampaign";

export const metadata: Metadata = {
  title: "Donate | DeepRoots Foundation",
  description:
    "Support food security, nutrition, education and community upliftment in Vidarbha with a secure online donation.",
  alternates: { canonical: "/donate" },
};

export default function DonatePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 bg-ivory pt-32 pb-24">
        <div className="container mx-auto max-w-xl px-4 sm:px-6">
          <p className="text-center text-sm font-bold uppercase tracking-widest text-accent-gold-deep">Donate</p>
          <h1 className="mt-2 text-center text-4xl leading-tight text-primary-green md:text-5xl">
            Your gift can become someone&rsquo;s first meal.
          </h1>
          <p className="mt-4 text-center text-muted">
            {formatINR(COST_PER_MEAL)} cooks and serves one fresh meal. Pay securely by UPI, card or net banking.
          </p>

          <DonationProvider>
            <DonationCard {...generalDonation} className="mt-10" />
          </DonationProvider>

          <p className="mt-8 text-center text-sm text-muted">
            Want to give to a specific cause?{" "}
            <Link href={HUNGER_FREE_PATH} className="font-semibold text-primary-green underline underline-offset-4">
              Support Hunger Free Vidarbha
            </Link>
            . Read our{" "}
            <Link href="/donation-policy" className="font-semibold text-primary-green underline underline-offset-4">
              donation &amp; refund policy
            </Link>
            .
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
