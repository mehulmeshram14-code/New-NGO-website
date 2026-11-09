"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { hungerFreeCampaign } from "@/data/hungerFreeCampaign";

const { hero } = hungerFreeCampaign;

export function CampaignHero() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[92vh] md:h-screen w-full flex items-center overflow-hidden bg-primary-green"
    >
      <motion.div style={{ y }} className="absolute inset-0 w-full h-full">
        <Image src={hero.image} alt={hero.imageAlt} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/20" />
      </motion.div>

      <div className="container relative z-10 mx-auto px-6 md:px-12 pt-28 pb-16">
        <div className="max-w-3xl text-center md:text-left">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="block text-accent-gold font-bold tracking-widest uppercase text-sm md:text-base mb-6"
          >
            {hero.eyebrow}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold !text-white drop-shadow-lg leading-tight mb-8"
          >
            {hero.titleLead} <br className="hidden md:inline" />
            <span className="italic !text-accent-gold">{hero.titleAccent}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-white/90 drop-shadow-md text-lg md:text-xl max-w-2xl mb-12 font-medium mx-auto md:mx-0"
          >
            {hero.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start"
          >
            <Button
              href="#donate"
              size="lg"
              className="bg-accent-gold text-white hover:bg-primary-green focus:ring-accent-gold gap-2 transition-colors duration-300"
            >
              <Heart className="w-5 h-5 fill-white" />
              Donate Now
            </Button>
            <Button
              href="#beneficiaries"
              variant="outline"
              size="lg"
              className="border-ivory text-ivory hover:bg-ivory hover:text-charcoal transition-colors duration-300"
            >
              See Who You Help
            </Button>
          </motion.div>
        </div>
      </div>

      <motion.a
        href="#donate"
        aria-label="Scroll to donation section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-sand/70"
      >
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <motion.span
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-px h-12 bg-gradient-to-b from-sand/70 to-transparent"
        />
      </motion.a>
    </section>
  );
}
