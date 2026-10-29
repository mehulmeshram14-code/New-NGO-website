"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, Building2, CheckCircle2 } from "lucide-react";

export default function AboutSection() {
  return (
    <section className="py-24 bg-cream-light relative border-t border-forest/10" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Visual Documentary Proof */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative">
              {/* Authentic Photo with Official DeepRoots Foundation Banner */}
              <div className="relative rounded-2xl overflow-hidden shadow-card border-4 border-white aspect-[4/3] bg-cream-dark">
                <Image
                  src="/assets/images/team-banner-full.png"
                  alt="DeepRoots Foundation founders and community members standing proudly with the official organisation banner"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-top"
                />
              </div>

              {/* Verified Identity Card */}
              <div className="mt-4 bg-white p-5 rounded-xl border border-forest/15 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-forest text-xs font-bold uppercase tracking-wider">
                  <Building2 className="w-4 h-4 text-forest" />
                  <span>Verified Section 8 Foundation</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1 border-t border-forest/10">
                  <div>
                    <span className="text-[10px] text-charcoal-muted uppercase font-semibold block">
                      Corporate Identity No. (CIN)
                    </span>
                    <span className="font-mono text-charcoal font-semibold text-xs">
                      U88900ME2026NPL476439
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-charcoal-muted uppercase font-semibold block">
                      Headquarters Office
                    </span>
                    <span className="text-charcoal font-medium">
                      Amravati, Maharashtra - 444606
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Narrative */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-earth">
              <span className="w-8 h-[2px] bg-terracotta"></span>
              <span>Our Story &amp; Regional Reality</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-forest tracking-tight leading-[1.18]">
              “A land that feeds the nation, and still goes hungry.”
            </h2>

            <div className="space-y-4 text-charcoal/85 text-base sm:text-lg leading-relaxed font-sans">
              <p>
                Vidarbha produces cotton, soybeans, oranges and pulses that support livelihoods and markets across India. Yet some communities continue to face serious barriers to adequate nutrition, healthcare and opportunity.
              </p>
              <p>
                For families in remote and underserved areas, the challenge is not simply the availability of food. It is also the distance between support systems and the people who need them.
              </p>
              <p className="font-medium text-forest">
                DeepRoots Foundation exists to help close that gap, beginning with nutrition and building towards education, livelihood and dignity.
              </p>
            </div>

            {/* Core Pillars Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-forest/15">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif font-bold text-forest text-sm">Dignity First</h4>
                  <p className="text-xs text-charcoal-muted leading-snug">Partners in upliftment, never passive recipients.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif font-bold text-forest text-sm">Grassroots Reach</h4>
                  <p className="text-xs text-charcoal-muted leading-snug">Direct presence across Melghat and Gadchiroli.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-serif font-bold text-forest text-sm">Accountability</h4>
                  <p className="text-xs text-charcoal-muted leading-snug">Truthful reporting without fabricated metrics.</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="#mission"
                className="inline-flex items-center gap-2 text-sm font-bold text-forest hover:text-terracotta transition-colors group"
              >
                <span>Read our Mission, Vision &amp; Core Principles</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
