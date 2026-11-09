import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DonationSection } from "@/components/sections/DonationSection";
import { generalDonation } from "@/data/donation";
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
      <main className="flex-1 pt-24">
        <DonationSection {...generalDonation} />
        <p className="pb-16 -mt-12 bg-sand/40 text-center text-sm text-muted px-6">
          Want to give to a specific cause?{" "}
          <Link href={HUNGER_FREE_PATH} className="font-semibold text-primary-green underline underline-offset-4">
            Support the Hunger Free Vidarbha campaign
          </Link>
          . Read our{" "}
          <Link href="/donation-policy" className="font-semibold text-primary-green underline underline-offset-4">
            donation &amp; refund policy
          </Link>
          .
        </p>
      </main>
      <Footer />
    </>
  );
}
