"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

const updates = [
  {
    category: "Activities",
    number: "01",
    title: "The work starts with showing up",
    text: "Our Community Nutrition Programme will begin across the Melghat tribal belt and Vidarbha's urban-slum clusters, bringing real food and real dignity closer to children, mothers, and elderly people.",
    accent: "bg-primary-green",
  },
  {
    category: "Events",
    number: "02",
    title: "Three phases. One connected future.",
    text: "Food, then education, then livelihood. Every phase is designed to make the next possibility more reachable for the people and communities we serve.",
    accent: "bg-accent-gold",
  },
  {
    category: "Announcements",
    number: "03",
    title: "Follow the work honestly",
    text: "We will share updates from the field, the wins and the failures alike. Our early community of supporters deserves to see exactly where the work is going.",
    accent: "bg-primary-brown",
  },
];

export function StoriesCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const activeUpdate = updates[activeIndex];

  const move = (direction: 1 | -1) => {
    setActiveIndex((current) => (current + direction + updates.length) % updates.length);
  };

  useEffect(() => {
    if (isHovered) return;
    
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % updates.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [isHovered, activeIndex]);

  return (
    <div 
      className="mx-auto mt-16 max-w-5xl"
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="grid min-h-[24rem] overflow-hidden bg-white shadow-sm md:grid-cols-[0.35fr_1fr]">
        <div className={`relative flex flex-col justify-between p-8 text-ivory transition-colors duration-500 md:p-10 ${activeUpdate.accent}`}>
          <span className="font-serif text-7xl font-bold opacity-30">{activeUpdate.number}</span>
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-ivory/70">{activeUpdate.category}</p>
            <div className="mt-5 h-px w-16 bg-accent-gold" />
          </div>
        </div>

        <div className="flex flex-col justify-between p-8 md:p-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeUpdate.number}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            >
              <h2 className="max-w-xl font-editorial text-4xl font-bold leading-tight text-primary-green md:text-5xl">{activeUpdate.title}</h2>
              <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted">{activeUpdate.text}</p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex items-center justify-between gap-6 border-t border-primary-brown/10 pt-6">
            <div className="flex gap-2" aria-label="Story slides">
              {updates.map((update, index) => (
                <button
                  key={update.number}
                  type="button"
                  aria-label={`Show ${update.category}`}
                  onClick={() => setActiveIndex(index)}
                  className={`h-1.5 transition-all ${index === activeIndex ? "w-12 bg-primary-green" : "w-6 bg-primary-brown/20"}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button 
                type="button" 
                aria-label="Next story" 
                onClick={() => move(1)} 
                className="relative flex h-12 w-12 items-center justify-center rounded-full text-primary-green transition-colors hover:bg-primary-green/5"
              >
                <svg className="absolute inset-0 -rotate-90" width="48" height="48">
                  <circle
                    cx="24"
                    cy="24"
                    r="23"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                    className="text-primary-green/20"
                  />
                  <motion.circle
                    key={activeIndex}
                    cx="24"
                    cy="24"
                    r="23"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-primary-green"
                    strokeDasharray={2 * Math.PI * 23}
                    initial={{ strokeDashoffset: 2 * Math.PI * 23 }}
                    animate={{ strokeDashoffset: isHovered ? 2 * Math.PI * 23 : 0 }}
                    transition={{ duration: 4, ease: "linear" }}
                  />
                </svg>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
