"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "./Button";

interface ProjectCardProps {
  title: string;
  category: string;
  description: string;
  image: string;
  delay?: number;
}

export function ProjectCard({ title, category, description, image, delay = 0 }: ProjectCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      viewport={{ once: true, margin: "-5%" }}
      whileHover={{ y: -4 }}
      className="group flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative h-64 overflow-hidden">
        <Image 
          src={image} 
          alt={title} 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-8 flex flex-col flex-grow">
        <span className="text-accent-terracotta text-sm font-bold tracking-widest uppercase mb-2">
          {category}
        </span>
        <h3 className="font-editorial text-2xl font-bold text-primary-green mb-4">
          {title}
        </h3>
        <p className="text-muted mb-6 flex-grow">
          {description}
        </p>
        <Button variant="ghost" className="self-start px-0 hover:bg-transparent hover:text-accent-terracotta">
          Learn More &rarr;
        </Button>
      </div>
    </motion.div>
  );
}
