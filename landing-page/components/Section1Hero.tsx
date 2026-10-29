"use client";

import React from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Heart, ArrowDown, ChevronDown } from "lucide-react";

export default function Section1Hero() {
  const { scrollY } = useScroll();
  // Parallax subtle translation on background
  const yBg = useTransform(scrollY, [0, 600], [0, 100]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-[92vh] sm:min-h-screen flex items-center justify-center overflow-hidden bg-earth text-white pt-20 pb-12 sm:pt-28 sm:pb-20">
      {/* Background Photography with Slow Gentle Living Zoom & Parallax */}
      <motion.div style={{ y: yBg }} className="absolute inset-0 z-0">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-full h-full"
        >
          <Image
            src="/assets/images/volunteer-serving-full.png"
            alt="DeepRoots Foundation volunteers serving hot meals to community members in Vidarbha"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </motion.div>
        {/* High-legibility Transparent Green Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-earth/85 via-earth/60 to-earth/35 sm:from-earth/80 sm:via-earth/50 sm:to-earth/25" />
        <div className="absolute inset-0 bg-gradient-to-t from-earth/90 via-earth/40 to-earth/50 sm:from-earth/75 sm:via-transparent sm:to-earth/35" />
      </motion.div>

      {/* Hero Content Container with 100% Solid Mobile Legibility */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left w-full">
        <div className="max-w-3xl mx-auto sm:mx-0">
          {/* Headline with Staggered Fade Up */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="font-serif text-3xl sm:text-5xl lg:text-7xl font-normal tracking-tight text-ivory leading-[1.12] sm:leading-[1.08] mb-4 sm:mb-6 drop-shadow-[0_2px_14px_rgba(0,0,0,0.85)]"
          >
            No One Should <br className="hidden sm:inline" />
            <motion.span
              animate={{ color: ["#f5d000", "#fa9f19", "#f5d000"] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="italic font-normal inline-block"
            >
              Sleep Hungry.
            </motion.span>
          </motion.h1>

          {/* Supporting Text */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm sm:text-lg lg:text-xl text-ivory font-normal leading-relaxed mb-8 sm:mb-10 max-w-2xl font-sans drop-shadow-[0_1px_8px_rgba(0,0,0,0.8)]"
          >
            Helping underserved communities across Vidarbha access food, nutrition, education, and opportunities for a better future.
          </motion.p>

          {/* CTA Group with Spring Physics */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 max-w-sm sm:max-w-none mx-auto sm:mx-0"
          >
            <motion.button
              onClick={() => scrollTo("donate")}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="relative inline-flex items-center justify-center gap-2.5 bg-rust hover:bg-rust-hover text-white text-sm sm:text-base font-black uppercase tracking-wider px-7 sm:px-9 py-3.5 sm:py-4 rounded-full shadow-2xl border-2 border-rust-light/50 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-rust-light/50 cursor-pointer overflow-hidden group w-full sm:w-auto"
              aria-label="Donate Now - scroll to donation selector"
            >
              {/* Light beam shimmer */}
              <motion.span
                animate={{ x: ["-100%", "200%"] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/35 to-transparent skew-x-12 pointer-events-none"
              />
              <Heart className="w-4 h-4 fill-white text-white group-hover:scale-125 transition-transform duration-300 relative z-10 shrink-0" />
              <span className="relative z-10 font-black">Donate Now</span>
            </motion.button>

            <motion.button
              onClick={() => scrollTo("beneficiaries")}
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center gap-2 bg-earth/70 hover:bg-earth/90 text-ivory border border-white/30 text-sm sm:text-base font-medium px-6 sm:px-7 py-3.5 sm:py-4 rounded-full backdrop-blur-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/40 cursor-pointer shadow-md group w-full sm:w-auto"
              aria-label="Our Beneficiaries - scroll to beneficiary photo stories"
            >
              <span>Our Beneficiaries</span>
              <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform duration-300 shrink-0" />
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Animated Scroll Down Indicator at bottom center (hidden on small mobile screens to prevent overlap) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        onClick={() => scrollTo("donate")}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 hidden sm:flex flex-col items-center gap-1.5 cursor-pointer text-ivory/80 hover:text-sun transition-colors group"
      >
        <span className="text-[10px] uppercase tracking-widest font-bold">Scroll Down</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border-2 border-white/30 group-hover:border-sun flex items-start justify-center p-1 transition-colors"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-2 rounded-full bg-sun"
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
