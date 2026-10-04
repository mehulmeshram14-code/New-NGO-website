"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { gallery } from "@/data/gallery";
import { SectionHeading } from "../ui/SectionHeading";

export function GallerySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"]);

  return (
    <section ref={containerRef} className="py-16 md:py-20 bg-sand overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 mb-8">
        <SectionHeading title="Moments of Impact" />
      </div>

      <div className="relative w-full flex overflow-hidden">
        <motion.div 
          style={{ x }}
          className="flex gap-4 md:gap-6 px-6 md:px-12 pb-8 w-max cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ right: 0, left: -2000 }} // Note: rough constraint for drag
        >
          {gallery.map((img) => (
            <div key={img.id} className="relative w-[180px] h-[240px] md:w-[220px] md:h-[300px] shrink-0 rounded-2xl overflow-hidden group">
              <Image 
                src={img.image}
                alt={img.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span className="text-accent-gold text-xs font-bold uppercase tracking-wider mb-2">{img.category}</span>
                <span className="text-white font-editorial text-xl">{img.title}</span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
