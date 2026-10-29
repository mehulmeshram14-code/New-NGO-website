"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Utensils, Users, BookOpen, Sparkles } from "lucide-react";

export default function Section3Mission() {
  const pillars = [
    {
      icon: Utensils,
      title: "FOOD SECURITY",
      description: "Working towards better access to essential food and nutrition.",
    },
    {
      icon: Users,
      title: "COMMUNITY UPLIFTMENT",
      description: "Supporting dignity, opportunity, and stronger communities.",
    },
    {
      icon: BookOpen,
      title: "EDUCATION",
      description: "Encouraging education as a pathway towards a better future.",
    },
  ];

  return (
    <section className="py-12 sm:py-28 bg-ivory relative overflow-hidden scroll-mt-20" id="mission">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Column 1: Large Authentic Photograph with Vertical Scroll Entrance (5 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 order-2 lg:order-1"
          >
            <div className="relative mx-auto max-w-sm sm:max-w-md lg:max-w-none group px-1 sm:px-0">
              {/* Dynamic Interactive Frame */}
              <motion.div
                whileHover={{ rotate: 0, scale: 1.02 }}
                transition={{ duration: 0.4 }}
                className="absolute -inset-1 sm:-inset-3 bg-gradient-to-tr from-leaf/25 via-saffron/20 to-sun/30 rounded-2xl sm:rounded-3xl -rotate-1 shadow-lg pointer-events-none"
              />

              {/* Main Image Container */}
              <div className="relative rounded-2xl overflow-hidden shadow-card border-2 border-leaf/20 bg-white aspect-[4/5] sm:aspect-[3/4]">
                <Image
                  src="/assets/images/team-banner-full.png"
                  alt="DeepRoots Foundation volunteers on the ground in Vidarbha"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-earth/85 via-transparent to-transparent" />

                {/* Ground Reality Caption */}
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.25, duration: 0.5 }}
                  className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 p-3 sm:p-4 rounded-xl bg-white/95 backdrop-blur-md border border-leaf/20 shadow-sm"
                >
                  <div className="flex items-center gap-1.5 text-leaf font-bold text-[11px] sm:text-xs uppercase tracking-wider mb-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-sun animate-pulse shrink-0" />
                    <span>Ground Reality · Vidarbha</span>
                  </div>
                  <p className="text-[11px] sm:text-xs text-earth/75 leading-tight font-sans">
                    Volunteer-led community meal drives bringing nutritious food directly to underserved families.
                  </p>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Column 2: Mission Copy & Three Pillars with Vertical Scroll Entrance (7 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 order-1 lg:order-2 space-y-6 sm:space-y-8"
          >
            <div>
              <span className="text-[10px] sm:text-xs uppercase tracking-widest font-bold text-leaf bg-leaf/10 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full inline-block mb-3 shadow-sm">
                OUR CORE PURPOSE
              </span>
              <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-earth tracking-tight leading-tight">
                Rooted in Compassion. <br />
                <span className="text-leaf italic font-normal">Growing Through Action.</span>
              </h2>
            </div>

            <div className="space-y-3 sm:space-y-4 text-earth/80 text-xs sm:text-base leading-relaxed font-sans">
              <p>
                Across Vidarbha, many communities face challenges in accessing nutritious food, education, and opportunities for growth.
              </p>
              <p>
                DeepRoots Foundation is committed to supporting underserved communities through hunger relief, food security, nutrition, and education.
              </p>
              <p className="font-semibold text-earth text-sm sm:text-base">
                We believe lasting change begins when compassion becomes action.
              </p>
            </div>

            {/* Three Compact Mission Pillars with Interactive Hover Micro-Physics */}
            <div className="pt-2 sm:pt-4 space-y-3 sm:space-y-4">
              {pillars.map((pillar, idx) => {
                const IconComponent = pillar.icon;
                return (
                  <motion.div
                    key={pillar.title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.12, duration: 0.5 }}
                    whileHover={{ x: 6, scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="p-3.5 sm:p-5 rounded-xl sm:rounded-2xl bg-cream/60 border border-leaf/15 hover:border-leaf/40 hover:bg-cream/90 transition-all duration-300 flex items-start gap-3 sm:gap-4 cursor-pointer group shadow-sm hover:shadow-md"
                  >
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-leaf text-sun flex items-center justify-center shrink-0 shadow-sm mt-0.5 group-hover:rotate-6 group-hover:scale-110 transition-transform duration-300">
                      <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-sun" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] sm:text-xs font-mono font-black text-saffron-dark">
                          0{idx + 1}
                        </span>
                        <h3 className="font-sans font-bold text-xs sm:text-sm tracking-wider text-earth uppercase group-hover:text-leaf transition-colors">
                          {pillar.title}
                        </h3>
                      </div>
                      <p className="text-[11px] sm:text-sm text-earth/80 leading-relaxed font-medium">
                        {pillar.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
