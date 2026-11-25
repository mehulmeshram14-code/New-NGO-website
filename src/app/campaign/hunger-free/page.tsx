import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DonationProvider } from "@/components/donation/DonationProvider";
import { StickyDonateBar } from "@/components/donation/StickyDonateBar";
import { CampaignHero } from "@/components/campaign/hunger-free/CampaignHero";
import { TaglineBand } from "@/components/campaign/hunger-free/TaglineBand";
import { CampaignTrustStrip } from "@/components/campaign/hunger-free/CampaignTrustStrip";
import { AboutCampaign } from "@/components/campaign/hunger-free/AboutCampaign";
import { BeneficiariesSection } from "@/components/campaign/hunger-free/BeneficiariesSection";
import { DonationLevels } from "@/components/campaign/hunger-free/DonationLevels";
import { Sponsorships } from "@/components/campaign/hunger-free/Sponsorships";
import { CampaignFaq } from "@/components/campaign/hunger-free/CampaignFaq";
import { FinalCtaSection } from "@/components/campaign/hunger-free/FinalCtaSection";
import { HUNGER_FREE_PATH, hungerFreeCampaign } from "@/data/hungerFreeCampaign";
import { siteConfig } from "@/data/siteConfig";

const title = "Hunger Free Vidarbha | DeepRoots Foundation";
const description =
  "Sponsor a meal and support hunger relief, nutrition, and community upliftment across Vidarbha, Maharashtra.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: HUNGER_FREE_PATH },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: HUNGER_FREE_PATH,
    title,
    description,
    siteName: siteConfig.name,
    images: [{ url: hungerFreeCampaign.hero.image, alt: hungerFreeCampaign.hero.imageAlt }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [hungerFreeCampaign.hero.image],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "NGO",
  name: siteConfig.name,
  description: siteConfig.description,
  foundingDate: "2026",
  address: {
    "@type": "PostalAddress",
    streetAddress: "24/1/23, Gauri Shankar Nagar, Rukhmini Nagar",
    addressLocality: "Amravati",
    addressRegion: "Maharashtra",
    postalCode: "444606",
    addressCountry: "IN",
  },
  areaServed: ["Amravati", "Vidarbha", "Maharashtra", "India"],
  knowsAbout: ["Food Security", "Hunger Relief", "Child Nutrition", "Community Empowerment", "Education"],
};

export default function HungerFreeCampaignPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Navbar />
      {/* Shares the chosen amount between the donation card, level cards, sponsorships and sticky bar. */}
      <DonationProvider campaignId="hunger-free">
        <main className="flex-1">
          <CampaignHero />
          <TaglineBand />
          <CampaignTrustStrip />
          <AboutCampaign />
          <BeneficiariesSection />
          <DonationLevels />
          <Sponsorships />
          <CampaignFaq />
          <FinalCtaSection />
        </main>
        <StickyDonateBar />
      </DonationProvider>
      <Footer />
      {/* Keeps the end of the footer clear of the mobile sticky donate bar. */}
      <div aria-hidden="true" className="h-20 bg-primary-green-deep lg:hidden" />
    </>
  );
}
