"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import indiaMap from "@svg-maps/india";
import { SectionHeading } from "../ui/SectionHeading";
import { ImpactCounter } from "../ui/ImpactCounter";
import { impact } from "@/data/impact";

type IndiaMapLocation = {
  id: string;
  name: string;
  path: string;
};

export function ImpactSection() {
  return (
    <section className="relative overflow-hidden bg-ivory py-20 md:py-28">
      <div className="absolute inset-x-0 top-0 h-1 bg-primary-green" />
      <div className="container relative mx-auto px-6 md:px-12">
        <SectionHeading
          title="Our Impact"
          className="mb-8 text-charcoal"
        />

        <div className="relative mx-auto max-w-6xl overflow-hidden border-y border-primary-brown/10 bg-white/50 px-4 py-8 md:px-12 md:py-12">
          <div className="pointer-events-none absolute inset-0 opacity-60" aria-hidden="true">
            <span className="impact-hand impact-hand-left" />
            <span className="impact-hand impact-hand-right" />
          </div>

          <div className="relative grid items-center gap-10 lg:grid-cols-[0.9fr_1.2fr_0.9fr]">
            <div className="hidden gap-4 sm:grid grid-cols-2 lg:block">
              <div className="impact-photo impact-photo-one">
                <Image src="https://images.unsplash.com/photo-1594708767771-a7502209ff51?q=80&w=1200&auto=format&fit=crop" alt="Community meal programme" fill className="object-cover" />
              </div>
              <div className="impact-photo impact-photo-two">
                <Image src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=1200&auto=format&fit=crop" alt="Children learning together" fill className="object-cover" />
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative mx-auto w-full max-w-[24rem]"
            >
              <svg viewBox={indiaMap.viewBox} role="img" aria-labelledby="impact-map-title impact-map-description" className="india-impact-map h-auto w-full drop-shadow-xl">
                <title id="impact-map-title">India map highlighting Vidarbha</title>
                <desc id="impact-map-description">A warm illustrated map of India with Maharashtra and Vidarbha highlighted as the foundation&apos;s region of work.</desc>
                {indiaMap.locations.map((location: IndiaMapLocation) => (
                  <path
                    key={location.id}
                    d={location.path}
                    aria-label={location.name}
                    className={location.id === "mh" ? "india-state india-state-maharashtra" : "india-state"}
                  />
                ))}
                <path
                  d="M177 345 C198 341 222 350 230 370 C235 390 223 411 204 420 C185 423 169 409 165 389 C163 371 166 355 177 345Z"
                  className="india-vidarbha"
                />
                <circle cx="200" cy="380" r="8" className="india-map-marker" />
                <circle cx="200" cy="380" r="20" className="india-map-pulse" />
                <path d="M205 376 278 328" className="india-map-callout" />
                <text x="285" y="323" className="india-map-label">VIDARBHA</text>
                <text x="285" y="340" className="india-map-subtitle">Maharashtra, India</text>
              </svg>
            </motion.div>

            <div className="hidden gap-4 sm:grid grid-cols-2 lg:block">
              <div className="impact-photo impact-photo-three">
                <Image src="https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=1200&auto=format&fit=crop" alt="Mother and child" fill className="object-cover" />
              </div>
              <div className="impact-photo impact-photo-four">
                <Image src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1200&auto=format&fit=crop" alt="Rural agricultural fields" fill className="object-cover" />
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-12 grid w-full max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3 md:gap-8">
          {impact.map((stat, index) => (
            <ImpactCounter
              key={stat.id}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
