import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { landingContent } from "@/data/landingContent";
import { Button } from "@/components/ui/Button";

export default function WorkPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-32 pb-24 bg-ivory min-h-screen">
        <div className="container mx-auto px-6 md:px-12">
          <SectionHeading title="From survival to possibility, one honest step at a time" />
          <div className="mx-auto mt-16 max-w-5xl space-y-8">
            {landingContent.phases.map((phase, index) => (
              <article key={phase.title} id={`phase-${index + 1}`} className="grid gap-8 border-t-2 border-primary-green/20 pt-8 md:grid-cols-[0.35fr_1fr]">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent-gold">{phase.phase}</p>
                  <h2 className="mt-3 font-editorial text-3xl font-bold text-primary-green">{phase.title}</h2>
                </div>
                <div className="space-y-4 text-lg leading-relaxed text-muted">
                  <p>{phase.text}</p>
                  <p className="border-l-2 border-accent-gold pl-5 text-primary-brown">{phase.detail}</p>
                </div>
              </article>
            ))}

            <section className="mt-16 bg-sand p-8 md:p-12">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent-gold">Community Upliftment</p>
              <h2 className="mt-4 font-editorial text-4xl font-bold text-primary-green">{landingContent.community.title}</h2>
              <p className="mt-6 text-lg leading-relaxed text-muted">{landingContent.community.text}</p>
              <p className="mt-5 text-lg leading-relaxed text-primary-brown">{landingContent.community.closing}</p>
            </section>

            <div className="pt-4 text-center"><Button href="/get-involved">Support the Work</Button></div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
