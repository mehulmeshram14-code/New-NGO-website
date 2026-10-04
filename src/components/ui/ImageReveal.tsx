"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface ImageRevealProps {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
}

export function ImageReveal({ src, alt, className, imageClassName }: ImageRevealProps) {
  return (
    <motion.div 
      className={`relative overflow-hidden ${className}`}
      initial={{ opacity: 0, scale: 1.05 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true, margin: "-10%" }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className={`object-cover ${imageClassName}`}
      />
    </motion.div>
  );
}
