import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

export default function TransparencyPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-32 pb-24 bg-ivory min-h-screen">
        <div className="container mx-auto px-6 md:px-12">
          <SectionHeading title="Transparency & Accountability" />
          <div className="mx-auto mt-16 max-w-3xl space-y-8 text-lg leading-relaxed text-muted">
            <p>We measure what we do, we publish it, the wins and the failures alike, and our accounts are open for anyone to see.</p>
            <p>We know we don't have decades of track record yet. What we can offer instead is honesty. You'll always be able to see exactly where your support goes.</p>
            <div className="border-l-4 border-accent-gold pl-6 text-primary-brown">
              <p>Built with communities, not for them. Nothing we design happens without the people it's meant to serve.</p>
            </div>
            <p>Our reporting will follow the work from First Meal through education and livelihood, with clear updates on reach, programme quality, inclusion, and the lessons we learn.</p>
            <Button href="/stories">Read Field Updates</Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
