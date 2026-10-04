import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StoriesCarousel } from "@/components/sections/StoriesCarousel";

export default function StoriesPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-32 pb-24 bg-ivory min-h-screen">
        <div className="container mx-auto px-6 md:px-12">
          <SectionHeading title="Stories From the Field" />
          <p className="mx-auto mt-8 max-w-2xl text-center text-muted">Honest updates from the field, not polished PR. Follow along as the First Meal Movement grows.</p>
          <StoriesCarousel />
        </div>
      </main>
      <Footer />
    </>
  );
}
