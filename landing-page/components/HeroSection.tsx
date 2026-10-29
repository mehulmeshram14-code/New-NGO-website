"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ArrowRight, ShieldCheck, ChevronDown, Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-[92vh] pt-32 pb-20 bg-cream overflow-hidden flex items-center">
      {/* Subtle organic background tint */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#244A36_1px,transparent_1px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Copy */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-subtle border border-forest/15"
            >
              <span className="w-2 h-2 rounded-full bg-forest animate-pulse"></span>
              <span className="text-xs uppercase tracking-widest font-bold text-forest">
                Rooted in Vidarbha. Committed to Human Dignity.
              </span>
            </motion.div>

            {/* 2. Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
              className="font-serif text-3xl sm:text-5xl lg:text-6xl text-forest tracking-tight leading-[1.12]"
            >
              “Before a child can learn. Before a mother can heal.{" "}
              <span className="italic font-normal text-terracotta">They must first be fed.</span>”
            </motion.h1>

            {/* 3. Supporting Copy */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
              className="text-base sm:text-lg text-charcoal/85 leading-relaxed max-w-2xl font-sans"
            >
              DeepRoots Foundation brings <strong>First Meal</strong> — real food, real dignity, real hope — to underserved communities across Vidarbha, Maharashtra. Food is where our story starts. It is not where it ends.
            </motion.p>

            {/* 4. Small supporting label */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex items-center gap-3 text-xs uppercase tracking-wider text-earth font-semibold"
            >
              <span className="text-forest font-bold">First Meal Initiative</span>
              <span className="text-earth/40">•</span>
              <span>Food Security</span>
              <span className="text-earth/40">•</span>
              <span>Education</span>
              <span className="text-earth/40">•</span>
              <span>Livelihood</span>
            </motion.div>

            {/* 5. CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
            >
              <Link
                href="/donate"
                className="inline-flex items-center justify-center gap-2.5 bg-terracotta hover:bg-terracotta-dark text-white font-semibold text-sm sm:text-base uppercase tracking-wider px-7 py-3.5 rounded-full shadow-terracotta transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Heart className="w-5 h-5 fill-white" />
                <span>Donate a Meal</span>
              </Link>

              <Link
                href="#about"
                className="inline-flex items-center justify-center gap-2 bg-white hover:bg-cream-dark text-forest font-medium text-sm sm:text-base px-6 py-3.5 rounded-full border border-forest/20 shadow-sm transition-all"
              >
                <span>Discover Our Mission</span>
                <ArrowRight className="w-4 h-4 text-forest" />
              </Link>
            </motion.div>

            
          </div>

          {/* Right Column: Authentic Editorial Visual Card */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="relative"
            >
              {/* Outer decorative card frame with earthy tint */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-cream-dark aspect-[4/5] max-h-[560px]">
                <Image
                  src="/assets/images/volunteer-serving-full.png"
                  alt="DeepRoots Foundation volunteers serving fresh, warm meals in stainless steel thalis with dignity to elders in Amravati"
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover object-center"
                  priority
                />

                {/* Subtle gradient vignette to protect caption legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent"></div>

                {/* Authentic Ground Caption */}
                <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-forest/80 backdrop-blur-sm text-[11px] font-semibold tracking-wider uppercase mb-1.5 text-gold">
                    <Sparkles className="w-3 h-3" />
                    <span>Ground Reality · Dignified Nutrition</span>
                  </div>
                  <p className="text-xs text-cream/90 leading-snug">
                    Volunteers serving warm, wholesome meals in Amravati. Dignity before charity in every thali we offer.
                  </p>
                </div>
              </div>

              {/* Floating Stat Badge */}
              <div className="absolute -bottom-5 -left-4 sm:-left-6 bg-white rounded-xl p-4 shadow-popover border border-forest/10 max-w-[240px]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-forest-subtle flex items-center justify-center text-forest text-lg">
                    🌾
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider text-forest font-bold block">
                      Target Goal
                    </span>
                    <span className="text-sm font-serif font-bold text-charcoal block">
                      10,000 People
                    </span>
                    <span className="text-[10px] text-charcoal-muted leading-tight block">
                      Daily nutrition in first 18 months
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll invitation indicator */}
        <div className="hidden lg:flex justify-center pt-16">
          <Link
            href="#about"
            className="flex flex-col items-center gap-1 text-xs text-charcoal/60 hover:text-forest transition-colors"
            aria-label="Scroll to read about DeepRoots Foundation"
          >
            <span className="tracking-widest uppercase text-[10px] font-semibold">Explore Our Journey</span>
            <ChevronDown className="w-4 h-4 animate-bounce text-forest" />
          </Link>
        </div>
      </div>
    </section>
  );
}
