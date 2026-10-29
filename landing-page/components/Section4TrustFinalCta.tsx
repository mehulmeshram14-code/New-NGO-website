"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Receipt,
  PieChart,
  MapPin,
  Heart,
  Mail,
  Phone,
  ArrowRight,
} from "lucide-react";
import InstagramIcon from "@/components/icons/InstagramIcon";

export default function Section4TrustFinalCta() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const trustItems = [
    {
      icon: Receipt,
      label: "DONATION RECEIPT PROCESS",
      value: "Digital Receipt Issued for Every Contribution",
      subtext: "Instant electronic confirmation with unique internal transaction audit ID.",
    },
    {
      icon: PieChart,
      label: "FUND UTILISATION POLICY",
      value: "100% Field Nourishment & Upliftment Deployment",
      subtext: "Zero leakage; all public contributions directly sustain nutrition initiatives.",
    },
    {
      icon: MapPin,
      label: "OFFICIAL REGISTERED OFFICE",
      value: "Amravati, Vidarbha, Maharashtra",
      subtext: "24/1/23, Gauri Shankar Nagar, Rukhmini Nagar, Amravati - 444606.",
    },
  ];

  return (
    <section className="py-12 sm:py-28 bg-cream/40 relative overflow-hidden scroll-mt-20" id="trust">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Trust Header with Scroll Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-2xl mx-auto mb-8 sm:mb-16"
        >
          <span className="text-[10px] sm:text-xs uppercase tracking-widest font-bold text-leaf bg-leaf/10 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full inline-block mb-3 shadow-sm">
            TRANSPARENCY & GOVERNANCE
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-earth tracking-tight leading-tight">
            Your Trust Makes <br className="hidden sm:inline" />
            <span className="text-leaf italic font-normal">Our Mission Possible.</span>
          </h2>
          <p className="mt-3 sm:mt-4 text-xs sm:text-base text-earth/75 font-sans max-w-xl mx-auto leading-relaxed">
            DeepRoots Foundation operates with strict governance, complete accountability, and verified statutory compliance across all operations.
          </p>
        </motion.div>

        {/* Compact Grid of Trust Details with Staggered Entrance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6 mb-10 sm:mb-20">
          {trustItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.1 }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white border border-earth/10 shadow-sm hover:shadow-hover hover:border-leaf/40 transition-all duration-300 flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-leaf/10 text-leaf flex items-center justify-center mb-2.5 sm:mb-3 group-hover:bg-leaf group-hover:text-sun transition-all duration-300">
                    <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
                  </div>
                  <span className="block text-[10px] sm:text-[11px] font-bold text-earth/70 uppercase tracking-wider mb-1">
                    {item.label}
                  </span>
                  <h3 className="font-sans font-semibold text-xs sm:text-base text-earth mb-1 leading-snug group-hover:text-leaf transition-colors">
                    {item.value}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-earth/70 leading-relaxed font-sans">
                    {item.subtext}
                  </p>
                </div>
              </motion.div>
            );
          })}

          {/* Contact Box to complete the 4-card grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-earth text-white shadow-card flex flex-col justify-between border border-earth-light/20 cursor-pointer group hover:shadow-hover transition-all duration-300"
          >
            <div>
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/10 text-sun flex items-center justify-center mb-2.5 sm:mb-3 group-hover:bg-sun group-hover:text-earth transition-all duration-300">
                <Mail className="w-4 h-4" />
              </div>
              <span className="block text-[10px] sm:text-[11px] font-bold text-sun uppercase tracking-wider mb-1">
                OFFICIAL CONTACT INFORMATION
              </span>
              <h3 className="font-sans font-semibold text-xs sm:text-base text-ivory mb-2 leading-snug">
                Direct Communications Desk
              </h3>
              <div className="space-y-1.5 text-xs text-ivory/85 font-sans">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-sun shrink-0" />
                  <a
                    href="mailto:deeprootsfoundation2026@gmail.com"
                    className="hover:text-sun transition-colors underline break-all"
                  >
                    deeprootsfoundation2026@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-sun shrink-0" />
                  <a href="tel:+917620290895" className="hover:text-sun transition-colors">
                    +91 76202 90895
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <InstagramIcon className="w-3.5 h-3.5 text-sun shrink-0" />
                  <a
                    href="https://www.instagram.com/deeprootsfoundation/?utm_source=ig_web_button_share_sheet"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-sun transition-colors underline break-all"
                  >
                    @deeprootsfoundation
                  </a>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-ivory/60 mt-3 pt-2.5 border-t border-white/10">
              Response within 24-48 business hours.
            </p>
          </motion.div>
        </div>

        {/* Visually Strong Final CTA Block with Living Ambient Glows */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-2xl sm:rounded-3xl bg-earth text-white p-6 sm:p-12 lg:p-16 shadow-hover overflow-hidden border-2 border-leaf/30 text-center"
        >
          {/* Animated Living Glowing Orbs */}
          <motion.div
            animate={{ scale: [1, 1.25, 1], opacity: [0.25, 0.45, 0.25] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-leaf/40 blur-3xl pointer-events-none"
          />
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -left-20 -bottom-20 w-80 h-80 rounded-full bg-sun/25 blur-3xl pointer-events-none"
          />

          <div className="relative z-10 max-w-2xl mx-auto space-y-4 sm:space-y-6">
            <span className="text-[10px] sm:text-xs uppercase tracking-widest font-bold text-sun bg-white/10 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full inline-block border border-sun/30 shadow-sm">
              JOIN THE CAUSE TODAY
            </span>

            <h2 className="font-serif text-2xl sm:text-4xl lg:text-6xl text-ivory tracking-tight leading-tight">
              Be the Reason <br />
              <motion.span
                animate={{ color: ["#f5d000", "#fa9f19", "#f5d000"] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="italic font-normal inline-block"
              >
                Someone Finds Hope.
              </motion.span>
            </h2>

            <p className="text-xs sm:text-base lg:text-lg text-ivory/90 font-light leading-relaxed font-sans max-w-xl mx-auto">
              Your support can help DeepRoots Foundation work towards a future where food security, education, and dignity are within everyone’s reach.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-sm sm:max-w-none mx-auto">
              <motion.button
                onClick={() => scrollTo("donate")}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="relative w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-rust hover:bg-rust-hover text-white text-sm sm:text-base font-black uppercase tracking-wider px-7 sm:px-9 py-3.5 sm:py-4 rounded-full shadow-2xl border-2 border-rust-light/50 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-rust-light/50 cursor-pointer overflow-hidden group"
                aria-label="Donate Now - scroll back to donation selector"
              >
                {/* Light sweep */}
                <motion.span
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                  className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/35 to-transparent skew-x-12 pointer-events-none"
                />
                <Heart className="w-4 h-4 fill-white text-white group-hover:scale-125 transition-transform duration-300 relative z-10 shrink-0" />
                <span className="relative z-10 font-black">Donate Now</span>
              </motion.button>

              <motion.button
                onClick={() => scrollTo("beneficiaries")}
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-ivory border border-white/20 text-sm font-medium px-6 py-3.5 sm:py-4 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/40 cursor-pointer group"
              >
                <span>View Beneficiaries</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300 shrink-0" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
