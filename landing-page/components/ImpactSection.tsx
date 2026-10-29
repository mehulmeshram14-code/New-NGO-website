"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Target, Layers, TrendingUp, AlertCircle, ShieldCheck, Heart } from "lucide-react";

export default function ImpactSection() {
  const [stats, setStats] = useState({
    verifiedDonationsCount: 2,
    totalVerifiedAmount: 3000,
  });

  useEffect(() => {
    fetch("/api/donations/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats({
            verifiedDonationsCount: data.verifiedDonationsCount,
            totalVerifiedAmount: data.totalVerifiedAmount,
          });
        }
      })
      .catch(() => {
        // graceful fallback
      });
  }, []);

  return (
    <section className="py-24 bg-cream-light border-y border-forest/10 relative" id="impact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Heading */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-earth">
            <span className="w-8 h-[2px] bg-terracotta"></span>
            <span>Measurable Accountability</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl text-forest tracking-tight leading-tight">
            Transparent Goals. Real Responsibility.
          </h2>

          <p className="text-base sm:text-lg text-charcoal/80 leading-relaxed font-sans">
            We believe public trust is built through clear distinctions between regional challenges, planned programme goals, and authoritatively verified outcomes.
          </p>
        </div>

        {/* 3 Pillars of Impact Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Regional Baseline Reality */}
          <div className="bg-white rounded-2xl p-8 border border-forest/15 shadow-sm space-y-4 relative flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-terracotta-subtle flex items-center justify-center text-terracotta">
                <AlertCircle className="w-5 h-5" />
              </div>
              <span className="text-[11px] uppercase tracking-wider text-charcoal-muted font-bold block">
                Regional Challenge · Vidarbha
              </span>
              <div className="font-serif text-4xl sm:text-5xl text-terracotta font-bold">
                30–35%
              </div>
              <p className="text-sm text-charcoal/85 leading-relaxed font-sans">
                Estimated chronic malnutrition prevalence among young children in tribal pockets of Melghat and Gadchiroli, highlighting the urgent need for consistent nutrition.
              </p>
            </div>
            <div className="pt-4 border-t border-forest/10 text-[11px] text-charcoal-muted italic">
              *Regional survey estimate; baseline motivation for First Meal.
            </div>
          </div>

          {/* Card 2: 3 Operational Phases */}
          <div className="bg-white rounded-2xl p-8 border border-forest/15 shadow-sm space-y-4 relative flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-forest-subtle flex items-center justify-center text-forest">
                <Layers className="w-5 h-5" />
              </div>
              <span className="text-[11px] uppercase tracking-wider text-charcoal-muted font-bold block">
                Holistic Progression Model
              </span>
              <div className="font-serif text-4xl sm:text-5xl text-forest font-bold">
                3 Phases
              </div>
              <p className="text-sm text-charcoal/85 leading-relaxed font-sans">
                Connecting immediate Food Security to School Education &amp; Retention, and graduating families into Sustainable Livelihood development.
              </p>
            </div>
            <div className="pt-4 border-t border-forest/10 text-[11px] text-forest font-medium">
              Phase 1: Nutrition → Phase 2: Education → Phase 3: Livelihood
            </div>
          </div>

          {/* Card 3: 18-Month Target Goal */}
          <div className="bg-forest text-cream rounded-2xl p-8 border border-forest/40 shadow-card space-y-4 relative flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-forest-light/20 flex items-center justify-center text-gold">
                <Target className="w-5 h-5" />
              </div>
              <span className="text-[11px] uppercase tracking-wider text-gold font-bold block">
                Our Programme Target
              </span>
              <div className="font-serif text-4xl sm:text-5xl text-cream font-bold">
                10,000
              </div>
              <p className="text-sm text-cream/90 leading-relaxed font-sans font-medium">
                “Reach 10,000 people with daily nutrition support within our first 18 months.”
              </p>
            </div>
            <div className="pt-4 border-t border-forest-light/20 text-[11px] text-gold/90">
              Planned target with active phased community deployment.
            </div>
          </div>
        </div>

        {/* Live Public Transparency Bar (Verified by Database) */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-forest/15 shadow-editorial">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-forest" />
                <h3 className="font-serif text-lg sm:text-xl text-forest font-bold">
                  Live Public Donation Integrity
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-charcoal/70">
                Only authoritatively verified payments and confirmed bank transfers are counted. No fabricated metrics.
              </p>
            </div>

            <div className="flex items-center gap-6 sm:gap-10">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-charcoal-muted font-bold block">
                  Verified Contributions
                </span>
                <span className="font-mono text-xl sm:text-2xl font-bold text-forest">
                  ₹{stats.totalVerifiedAmount.toLocaleString("en-IN")}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-charcoal-muted font-bold block">
                  Confirmed Donors
                </span>
                <span className="font-mono text-xl sm:text-2xl font-bold text-forest">
                  {stats.verifiedDonationsCount}
                </span>
              </div>

              <Link
                href="/donate"
                className="hidden sm:inline-flex items-center gap-1.5 bg-terracotta hover:bg-terracotta-dark text-white text-xs font-semibold uppercase tracking-wider px-4 py-2.5 rounded-full shadow-terracotta transition-all"
              >
                <Heart className="w-3.5 h-3.5 fill-white" />
                <span>Contribute</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
