"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { Button } from "../ui/Button";
import { AnimatedText } from "../ui/AnimatedText";
import { landingContent } from "@/data/landingContent";
import { useRef } from "react";

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <section ref={containerRef} className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-primary-green">
      {/* Documentary-style hero image with parallax */}
      <motion.div style={{ y }} className="absolute inset-0 w-full h-full">
        <Image
          src="/hero-bg.jpeg"
          alt="DeepRoots Foundation Hero"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
      </motion.div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-6 md:px-12 pt-20 flex flex-col items-center text-center">
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-accent-gold drop-shadow-sm font-bold tracking-widest uppercase text-sm md:text-base mb-6"
        >
          {landingContent.opening.eyebrow}
        </motion.span>
        
        <AnimatedText 
          text={landingContent.opening.title}
          className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold !text-white drop-shadow-lg max-w-4xl mb-8 leading-tight justify-center"
          as="h1"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="!text-white drop-shadow-md text-lg md:text-xl max-w-2xl mb-12 font-medium"
        >
          {landingContent.opening.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Button href="/donate" variant="secondary" size="lg" className="bg-accent-gold text-white hover:bg-primary-green transition-colors duration-300">
            {landingContent.opening.cta}
          </Button>
          <Button href="/work" variant="outline" size="lg" className="border-ivory text-ivory hover:bg-ivory hover:text-charcoal transition-colors duration-300">
            Learn More
          </Button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-sand/60"
      >
          <span className="text-xs uppercase tracking-widest text-sand/70">Scroll</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-px h-12 bg-gradient-to-b from-sand/70 to-transparent"
        />
      </motion.div>
    </section>
  );
}
