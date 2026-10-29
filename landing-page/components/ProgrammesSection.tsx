import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Utensils, BookOpen, Briefcase, HeartHandshake, ArrowRight, Check } from "lucide-react";

export default function ProgrammesSection() {
  return (
    <section className="py-24 bg-cream relative" id="programmes">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-earth">
            <span className="w-8 h-[2px] bg-terracotta"></span>
            <span>Comprehensive Grassroots Framework</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl text-forest tracking-tight leading-tight">
            Our 4 Core Programmes
          </h2>
          <p className="text-base sm:text-lg text-charcoal/80 leading-relaxed font-sans">
            Food is the foundation of human possibility. We begin by securing daily nutrition, then walk alongside communities as they build education, livelihood, and self-reliance.
          </p>
        </div>

        {/* Panel 1: Hunger and Nutrition (Editorial Asymmetric Layout) */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-forest/15 shadow-editorial grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta-subtle text-terracotta text-xs font-bold uppercase tracking-wider">
              <Utensils className="w-3.5 h-3.5" />
              <span>Programme 01 · Flagship Drive</span>
            </div>

            <h3 className="font-serif text-2xl sm:text-4xl text-forest tracking-tight">
              “Start with the first meal.”
            </h3>

            <p className="text-base text-charcoal/85 leading-relaxed font-sans">
              Build community nutrition support for young children, pregnant and nursing mothers, elderly people and households experiencing food insecurity across remote Vidarbha.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-charcoal/80 font-medium">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-terracotta"></span>
                <span>Community nutrition kitchens</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-terracotta"></span>
                <span>Culturally appropriate wholesome food</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-terracotta"></span>
                <span>Local produce sourcing where feasible</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-terracotta"></span>
                <span>Dignified, respectful meal distribution</span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/donate"
                className="inline-flex items-center gap-2 bg-terracotta hover:bg-terracotta-dark text-white font-semibold text-xs sm:text-sm uppercase tracking-wider px-6 py-3 rounded-full shadow-terracotta transition-all"
              >
                <span>Support Nutrition in Vidarbha</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative aspect-[4/3] rounded-2xl overflow-hidden shadow-card border-2 border-forest/10">
            <Image
              src="/assets/images/daan-serving.jpg"
              alt="DeepRoots team serving hot meals to community members"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* Panel 2: Education and Literacy (Image Left, Content Right) */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-forest/15 shadow-editorial grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1 relative aspect-[4/3] rounded-2xl overflow-hidden shadow-card border-2 border-forest/10">
            <Image
              src="/assets/images/community-smile.jpg"
              alt="Community children and learners in Vidarbha"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-subtle text-forest text-xs font-bold uppercase tracking-wider">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Programme 02 · Opportunity</span>
            </div>

            <h3 className="font-serif text-2xl sm:text-4xl text-forest tracking-tight">
              “Help opportunity take root.”
            </h3>

            <p className="text-base text-charcoal/85 leading-relaxed font-sans">
              Support children at risk of leaving school, adolescent girls facing barriers to education, and adults who want to develop foundational literacy.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-charcoal/80 font-medium">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-forest"></span>
                <span>Essential learning kits &amp; materials</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-forest"></span>
                <span>Bridge education for out-of-school kids</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-forest"></span>
                <span>Community educators &amp; safe spaces</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-forest"></span>
                <span>Adolescent mentorship initiatives</span>
              </div>
            </div>

            <div className="pt-4">
              <Link
                href="/#get-involved"
                className="inline-flex items-center gap-2 text-sm font-bold text-forest hover:text-terracotta transition-colors"
              >
                <span>Volunteer as a Community Educator &rarr;</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Panel 3 & 4: Two-Column Responsive Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Programme 3: Livelihood Development */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-forest/15 shadow-editorial flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/15 text-earth text-xs font-bold uppercase tracking-wider">
                <Briefcase className="w-3.5 h-3.5 text-earth" />
                <span>Programme 03 · Self-Reliance</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl text-forest tracking-tight">
                “Turn skills into independence.”
              </h3>

              <p className="text-sm sm:text-base text-charcoal/85 leading-relaxed font-sans">
                Support communities with practical skills, livelihood opportunities and pathways towards greater economic independence.
              </p>

              <ul className="space-y-2 text-xs text-charcoal/80 font-medium pt-2">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-earth" />
                  <span>Vocational and artisanal skill training</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-earth" />
                  <span>Women’s Self-Help Group (SHG) micro-initiatives</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-earth" />
                  <span>Digital literacy &amp; government entitlement access</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-forest/10">
              <Link
                href="/#get-involved"
                className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-earth hover:text-forest transition-colors"
              >
                <span>Partner on Livelihoods &rarr;</span>
              </Link>
            </div>
          </div>

          {/* Programme 4: Community Upliftment */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-forest/15 shadow-editorial flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-subtle text-forest text-xs font-bold uppercase tracking-wider">
                <HeartHandshake className="w-3.5 h-3.5" />
                <span>Programme 04 · Compassion</span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl text-forest tracking-tight">
                “Reach the people systems often miss.”
              </h3>

              <p className="text-sm sm:text-base text-charcoal/85 leading-relaxed font-sans">
                Work alongside underserved families, tribal communities, women-led households and other vulnerable groups to improve access to essential support.
              </p>

              <ul className="space-y-2 text-xs text-charcoal/80 font-medium pt-2">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-forest" />
                  <span>Senior citizen and elderly shelter support</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-forest" />
                  <span>Tribal hamlet nutritional outreach in Melghat</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-forest" />
                  <span>Emergency relief &amp; health camp assistance</span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-forest/10">
              <Link
                href="/donate"
                className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-forest hover:text-terracotta transition-colors"
              >
                <span>Sponsor Shelter Meals &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
