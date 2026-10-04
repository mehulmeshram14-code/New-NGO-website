"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "./Button";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
  align?: "left" | "center" | "right";
}

export function SectionHeading({ title, subtitle, className, align = "center" }: SectionHeadingProps) {
  return (
    <div className={cn(
      "flex flex-col gap-4",
      align === "center" && "items-center text-center",
      align === "left" && "items-start text-left",
      align === "right" && "items-end text-right",
      className
    )}>
      {subtitle && (
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-accent-terracotta font-bold tracking-widest uppercase text-sm"
        >
          {subtitle}
        </motion.span>
      )}
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-3xl md:text-5xl font-editorial font-bold text-primary-green max-w-2xl leading-tight"
      >
        {title}
      </motion.h2>
    </div>
  );
}
