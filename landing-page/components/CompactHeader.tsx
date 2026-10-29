"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useSpring } from "framer-motion";
import { Heart } from "lucide-react";

export default function CompactHeader() {
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-ivory/95 backdrop-blur-md shadow-subtle py-2.5 sm:py-3 border-b border-earth/10"
          : "bg-ivory/90 backdrop-blur-sm py-3 sm:py-4 border-b border-transparent"
      }`}
    >
      {/* Scroll Progress Bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-leaf via-saffron to-sun origin-left z-50"
        style={{ scaleX }}
      />

      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-1.5 sm:gap-4">
          {/* Brand Logo & Name */}
          <Link
            href="/"
            className="flex items-center gap-2 sm:gap-3.5 group focus:outline-none focus:ring-2 focus:ring-leaf rounded-lg p-0.5 sm:p-1 min-w-0"
            aria-label="DeepRoots Foundation Home"
          >
            <motion.div
              className="relative w-11 h-11 sm:w-16 sm:h-16 md:w-[68px] md:h-[68px] shrink-0"
              animate={{
                y: [0, -2.5, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              whileHover={{
                scale: 1.08,
                rotate: [0, -1.5, 1.5, 0],
                transition: { duration: 0.35 },
              }}
            >
              {/* Soft living ambient aura glow */}
              <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-leaf/25 via-saffron/20 to-sun/20 blur-md opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500 pointer-events-none" />

              {/* Logo container with shimmer sweep */}
              <div className="relative w-full h-full rounded-full overflow-hidden p-0.5 flex items-center justify-center">
                <Image
                  src="/assets/images/logo.png"
                  alt="DeepRoots Foundation Logo"
                  width={72}
                  height={72}
                  className="object-contain w-full h-full scale-110 drop-shadow-sm group-hover:drop-shadow-md transition-all duration-300"
                  priority
                />
                {/* Sunlight shimmer sweep across the leaves */}
                <motion.div
                  className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent skew-x-12 pointer-events-none"
                  animate={{
                    translateX: ["-120%", "220%"],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 4.5,
                    repeatDelay: 2,
                    ease: "easeInOut",
                  }}
                />
              </div>
            </motion.div>
            <div className="flex flex-col min-w-0 justify-center">
              <span className="font-samarkan text-[16px] min-[360px]:text-[18px] min-[400px]:text-xl sm:text-2xl md:text-3xl text-earth font-normal tracking-wide leading-none group-hover:text-leaf transition-colors whitespace-nowrap">
                DeepRoots Foundation
              </span>
            </div>
          </Link>

          {/* Compact Right Actions */}
          <div className="flex items-center gap-2 sm:gap-6 shrink-0">
            <a
              href="#beneficiaries"
              onClick={(e) => scrollToSection(e, "beneficiaries")}
              className="hidden sm:inline-block text-xs sm:text-sm font-semibold text-earth/80 hover:text-rust transition-colors relative group py-1"
            >
              <span>Beneficiaries</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-rust transition-all duration-300 group-hover:w-full" />
            </a>

            <motion.a
              href="#donate"
              onClick={(e) => scrollToSection(e, "donate")}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.96 }}
              className="relative inline-flex items-center gap-1.5 sm:gap-2 bg-rust hover:bg-rust-hover text-white font-black text-[11px] sm:text-sm uppercase tracking-wider px-3 sm:px-6 py-2 sm:py-3 rounded-full shadow-md border border-rust-light/50 transition-colors focus:outline-none focus:ring-2 focus:ring-rust-light focus:ring-offset-2 overflow-hidden shrink-0"
            >
              {/* Subtle light shimmer sweep */}
              <motion.span
                animate={{ x: ["-100%", "200%"] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
                className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/35 to-transparent skew-x-12 pointer-events-none"
              />
              <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-white text-white relative z-10 animate-pulse shrink-0" />
              <span className="relative z-10 font-black">
                Donate<span className="hidden min-[380px]:inline"> Now</span>
              </span>
            </motion.a>
          </div>
        </div>
      </div>
    </header>
  );
}
