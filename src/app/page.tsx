import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/sections/HeroSection";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { WhyDeeproots } from "@/components/sections/WhyDeeproots";
import { FocusAreas } from "@/components/sections/FocusAreas";
import { FeaturedInitiative } from "@/components/sections/FeaturedInitiative";
import { ImpactSection } from "@/components/sections/ImpactSection";
import { VidarbhaMap } from "@/components/sections/VidarbhaMap";
import { GallerySection } from "@/components/sections/GallerySection";
import { GetInvolvedSection } from "@/components/sections/GetInvolvedSection";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <TrustStrip />
        <WhyDeeproots />
        <FocusAreas />
        <FeaturedInitiative />
        <ImpactSection />
        <VidarbhaMap />
        <GallerySection />
        <GetInvolvedSection />
      </main>
      <Footer />
    </>
  );
}
