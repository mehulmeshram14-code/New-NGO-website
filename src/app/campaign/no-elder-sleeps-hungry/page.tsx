import type { Metadata } from "next";
import { DonationProvider } from "@/components/donation/DonationProvider";
import { StickyDonateBar } from "@/components/donation/StickyDonateBar";
import {
  ElderDonate,
  ElderFaces,
  ElderFaq,
  ElderFinalCta,
  ElderFooter,
  ElderHeader,
  ElderHero,
  ElderProblem,
  ElderSponsor,
  ElderWhatWeDo,
  ElderWhyElders,
} from "@/components/campaign/elder/ElderLanding";
import { ELDER_CAMPAIGN_PATH, elderCampaign } from "@/data/elderCampaign";
import { siteConfig } from "@/data/siteConfig";

const title = "No Elder Sleeps Hungry | DeepRoots Foundation";
const description =
  "Feed an elder in Amravati. ₹50 is one warm meal, cooked fresh by volunteers and served with dignity through our Elder Daily Food Seva.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: ELDER_CAMPAIGN_PATH },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: ELDER_CAMPAIGN_PATH,
    title,
    description,
    siteName: siteConfig.name,
    images: [{ url: elderCampaign.hero.image, alt: elderCampaign.hero.imageAlt }],
  },
  twitter: { card: "summary_large_image", title, description, images: [elderCampaign.hero.image] },
};

/** Standalone campaign landing page: its own slim header and footer instead of the site's. */
export default function NoElderSleepsHungryPage() {
  return (
    <DonationProvider campaignId="no-elder-sleeps-hungry">
      <ElderHeader />
      <main className="flex-1">
        <ElderHero />
        <ElderProblem />
        <ElderWhatWeDo />
        <ElderWhyElders />
        <ElderFaces />
        <ElderDonate />
        <ElderSponsor />
        <ElderFaq />
        <ElderFinalCta />
      </main>
      <ElderFooter />
      <StickyDonateBar />
      {/* Keeps the end of the footer clear of the mobile sticky donate bar. */}
      <div aria-hidden="true" className="h-20 bg-primary-brown-deep lg:hidden" />
    </DonationProvider>
  );
}
