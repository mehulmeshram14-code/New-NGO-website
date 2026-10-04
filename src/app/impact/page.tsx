import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ImpactSection } from "@/components/sections/ImpactSection";

export default function ImpactPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20 bg-ivory min-h-screen">
        <ImpactSection />
      </main>
      <Footer />
    </>
  );
}
