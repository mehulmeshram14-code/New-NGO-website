"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface ImpactCounterProps {
  value: number;
  suffix?: string;
  label: string;
  delay?: number;
}

export function ImpactCounter({ value, suffix = "", label, delay = 0 }: ImpactCounterProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [displayValue, setDisplayValue] = useState(0);
  const formattedValue = displayValue >= 1000
    ? `${(displayValue / 1000).toFixed(displayValue % 1000 === 0 ? 0 : 1)}K`
    : displayValue.toLocaleString();

  useEffect(() => {
    if (!isInView) return;

    const duration = 1400;
    const startTime = performance.now();
    let animationFrame = 0;

    const updateValue = (currentTime: number) => {
      const progress = Math.min((currentTime - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(value * easedProgress));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(updateValue);
      }
    };

    animationFrame = requestAnimationFrame(updateValue);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, value]);
  
  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      whileHover={{ y: -5 }}
      className="flex min-h-44 w-full flex-col items-center justify-center rounded-3xl border-b-4 border-transparent bg-white p-6 text-center shadow-md transition-all duration-300 hover:border-primary-green sm:p-8"
    >
      <span className="font-serif text-4xl md:text-5xl font-bold text-primary-green mb-3">
        {formattedValue}{suffix}
      </span>
      <span className="text-sm uppercase tracking-widest font-bold text-charcoal">
        {label}
      </span>
    </motion.div>
  );
}
