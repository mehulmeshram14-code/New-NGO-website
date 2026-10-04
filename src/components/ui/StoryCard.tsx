"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface StoryCardProps {
  title: string;
  category: string;
  location: string;
  excerpt: string;
  image: string;
}

export function StoryCard({ title, category, location, excerpt, image }: StoryCardProps) {
  return (
    <motion.article 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group cursor-pointer"
    >
      <div className="relative h-[400px] w-full overflow-hidden rounded-2xl mb-6">
        <Image 
          src={image} 
          alt={title} 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-700" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-muted">
          <span className="text-accent-terracotta">{category}</span>
          <span>&bull;</span>
          <span>{location}</span>
        </div>
        <h3 className="font-editorial text-2xl md:text-3xl font-bold text-primary-green group-hover:text-accent-terracotta transition-colors">
          {title}
        </h3>
        <p className="text-muted line-clamp-2">
          {excerpt}
        </p>
        <div className="text-primary-green font-bold text-sm uppercase tracking-wider pt-2 group-hover:text-accent-terracotta transition-colors">
          Read Story &rarr;
        </div>
      </div>
    </motion.article>
  );
}
