import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { landingContent } from "@/data/landingContent";
import { Button } from "@/components/ui/Button";
import { TeamSection } from "@/components/sections/TeamSection";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-32 pb-24 bg-ivory min-h-screen">
        <div className="container mx-auto px-6 md:px-12">
          <SectionHeading title="About DeepRoots Foundation" />

          <div className="mx-auto mt-16 max-w-5xl space-y-20">
            <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <p className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-accent-gold">Our Story</p>
                <h2 className="font-editorial text-4xl font-bold leading-tight text-primary-green md:text-5xl">{landingContent.story.title}</h2>
                <div className="mt-8 space-y-5 text-lg leading-relaxed text-muted">
                  {landingContent.story.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
              </div>
              <div className="space-y-4 border-l-2 border-accent-gold pl-6">
                {landingContent.story.facts.map((fact) => <p key={fact} className="font-editorial text-xl leading-snug text-primary-brown">{fact}</p>)}
              </div>
            </section>

            <section id="mission" className="grid gap-10 bg-primary-green p-8 text-ivory md:p-12 lg:grid-cols-[1fr_0.8fr]">
              <div>
                <p className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-accent-gold">Vision & Mission</p>
                <h2 className="font-editorial text-4xl font-bold leading-tight md:text-5xl">{landingContent.vision.title}</h2>
                <div className="mt-8 space-y-5 text-lg leading-relaxed text-ivory/80">
                  {landingContent.vision.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                </div>
              </div>
              <blockquote className="flex items-center border-l border-accent-gold pl-6 font-editorial text-3xl italic text-accent-gold">“{landingContent.vision.quote}”</blockquote>
            </section>

            <section>
              <p className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-accent-gold">Core Values</p>
              <h2 className="font-editorial text-4xl font-bold text-primary-green">We're young. We won't pretend otherwise.</h2>
              <div className="mt-10 grid gap-5 md:grid-cols-2">
                {landingContent.values.map((value) => (
                  <article key={value.title} className="border-t-2 border-primary-green/20 pt-5">
                    <h3 className="font-editorial text-2xl font-bold text-primary-brown">{value.title}</h3>
                    <p className="mt-3 leading-relaxed text-muted">{value.text}</p>
                  </article>
                ))}
              </div>
              <p className="mt-8 text-lg italic text-muted">We know we don't have decades of track record yet. What we can offer instead is honesty. You'll always be able to see exactly where your support goes.</p>
            </section>

            {/* Removed inline team section, will be added outside the max-w-5xl container */}
          </div>
        </div>
        
        {/* Animated Team Section */}
        <TeamSection />

        <div className="container mx-auto px-6 md:px-12 mt-20">
          <div className="text-center"><Button href="/get-involved">Be Part of the Work</Button></div>
        </div>
      </main>
      <Footer />
    </>
  );
}
