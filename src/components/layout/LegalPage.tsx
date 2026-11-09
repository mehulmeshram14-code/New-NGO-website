import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { siteConfig } from "@/data/siteConfig";

interface LegalPageProps {
  eyebrow: string;
  title: string;
  updated: string;
  children: ReactNode;
}

/** Shared shell for policy pages: site chrome plus a readable single column. */
export function LegalPage({ eyebrow, title, updated, children }: LegalPageProps) {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-32 pb-24 bg-ivory">
        <div className="container mx-auto px-6 md:px-12">
          <article className="max-w-3xl mx-auto bg-white rounded-3xl shadow-md border border-primary-green/10 p-8 md:p-12">
            <p className="text-accent-gold font-bold tracking-widest uppercase text-sm">{eyebrow}</p>
            <h1 className="mt-3 text-4xl md:text-5xl text-primary-green leading-tight">{title}</h1>
            <p className="mt-4 pb-6 border-b border-sand text-sm text-muted">
              {updated} · {siteConfig.name} · Section 8 non-profit (CIN: {siteConfig.cin})
            </p>
            <div className="mt-8 space-y-5 text-charcoal/85 leading-relaxed [&_h2]:font-serif [&_h2]:text-2xl [&_h2]:text-primary-green [&_h2]:pt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2">
              {children}
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}

export function LegalContactBlock({ label }: { label: string }) {
  return (
    <address className="not-italic p-5 bg-ivory rounded-2xl border border-sand text-sm">
      {label}, {siteConfig.name}
      <br />
      {siteConfig.contact.address}, Maharashtra
      <br />
      Email:{" "}
      <a href={`mailto:${siteConfig.contact.email}`} className="text-primary-green underline underline-offset-4">
        {siteConfig.contact.email}
      </a>
    </address>
  );
}
