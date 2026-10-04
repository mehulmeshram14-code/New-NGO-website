import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { landingContent } from "@/data/landingContent";

export default function GetInvolvedPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-32 pb-24 bg-ivory min-h-screen">
        <div className="container mx-auto px-6 md:px-12">
          <SectionHeading title="This Is Where You Come In" />
          <div className="mx-auto mt-16 max-w-5xl">
            <div className="grid gap-6 md:grid-cols-3">
              <article className="border-t-4 border-accent-gold bg-white p-8 shadow-sm">
                <h2 className="font-editorial text-3xl font-bold text-primary-green">Donate</h2>
                <p className="mt-4 leading-relaxed text-muted">Even a small contribution helps put a First Meal in front of a child, a mother, or an elder today.</p>
                <Button href="/donate" className="mt-8">Donate a Meal</Button>
              </article>
              <article id="partner" className="border-t-4 border-primary-green bg-white p-8 shadow-sm">
                <h2 className="font-editorial text-3xl font-bold text-primary-green">Partner or Volunteer</h2>
                <p className="mt-4 leading-relaxed text-muted">Bring your skills, your company, or simply your time. We're building relationships with companies and individuals who want to be part of something real, not just write a cheque.</p>
                <Button href="/contact" variant="outline" className="mt-8">Start a Conversation</Button>
              </article>
              <article id="volunteer" className="border-t-4 border-primary-brown bg-white p-8 shadow-sm">
                <h2 className="font-editorial text-3xl font-bold text-primary-green">Stay Close to the Work</h2>
                <p className="mt-4 leading-relaxed text-muted">Follow along as we grow, honest updates from the field, not polished PR. Join our early community of supporters.</p>
                <Button href="/stories" variant="ghost" className="mt-8">Read Updates</Button>
              </article>
            </div>

            <section className="mt-20 border-l-4 border-accent-gold pl-6 md:pl-10">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-accent-gold">One Last Thing</p>
              <h2 className="mt-3 font-editorial text-4xl font-bold text-primary-green">{landingContent.closing.title}</h2>
              <p className="mt-6 text-lg leading-relaxed text-muted">{landingContent.closing.text}</p>
              <p className="mt-5 text-lg leading-relaxed text-primary-brown">{landingContent.closing.invitation}</p>
              <Button href="/donate" className="mt-8">{landingContent.closing.cta}</Button>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
