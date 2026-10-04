"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { team } from "@/data/team";
import Image from "next/image";

export function TeamSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  return (
    <section id="team" ref={containerRef} className="py-32 bg-ivory relative overflow-hidden">
      {/* Background decoration */}
      <motion.div 
        className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-green/5 rounded-full blur-3xl pointer-events-none"
        style={{ y: useTransform(scrollYProgress, [0, 1], [-200, 200]) }}
      />
      <motion.div 
        className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-accent-gold/10 rounded-full blur-3xl pointer-events-none"
        style={{ y: useTransform(scrollYProgress, [0, 1], [200, -200]) }}
      />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <motion.div 
          className="max-w-3xl mx-auto text-center mb-24"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <p className="mb-5 text-sm font-bold uppercase tracking-[0.2em] text-accent-gold">
            Core Team
          </p>
          <h2 className="font-editorial text-4xl md:text-6xl font-bold text-primary-green mb-6 leading-tight">
            Meet the people driving the movement
          </h2>
          <p className="text-lg text-muted leading-relaxed">
            DeepRoots Foundation started with people from Vidarbha who chose to act instead of looking away. 
            Meet the founders and team who are on the ground every day.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 max-w-5xl mx-auto">
          {team.map((member, index) => (
            <TeamMemberCard key={member.id} member={member} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TeamMemberCard({ member, index }: { member: any, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.7, 
        delay: index * 0.15,
        ease: "easeOut"
      }}
      whileHover={{ y: -8 }}
      className="group relative overflow-hidden rounded-3xl aspect-[3/4] cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500 bg-charcoal"
    >
      {/* Background Image with Zoom on Hover */}
      <motion.div
        className="absolute inset-0 w-full h-full origin-center"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Image
          src={member.image}
          alt={member.name}
          fill
          className="object-cover object-center opacity-90 group-hover:opacity-100 transition-opacity duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </motion.div>

      {/* Gradient Overlay for Text Readability - Becomes darker on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />

      {/* Content Container */}
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 flex flex-col justify-end translate-y-24 group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]">
        <h3 className="font-editorial text-3xl font-bold !text-white mb-1 drop-shadow-md">
          {member.name}
        </h3>
        <p className="text-accent-gold font-bold uppercase tracking-widest text-xs mb-4">
          {member.role}
        </p>
        
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out delay-100">
          <p className="text-ivory/90 text-sm leading-relaxed line-clamp-4">
            {member.bio}
          </p>
          <div className="mt-5 pt-4 border-t border-ivory/20">
            <button className="text-xs font-semibold text-ivory hover:text-accent-gold transition-colors flex items-center gap-2 tracking-wide uppercase">
              Read Story <span className="text-lg leading-none transform group-hover:translate-x-1 transition-transform">&rarr;</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
