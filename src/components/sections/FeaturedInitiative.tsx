"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "../ui/Button";

export function FeaturedInitiative() {
  return (
    <section className="bg-primary-green-deep text-ivory py-24 md:py-32">
      <div className="container mx-auto px-6 md:px-12 text-center flex flex-col items-center">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-accent-gold-light font-bold tracking-widest uppercase text-sm mb-6"
        >
          Featured Initiative: First Meal
        </motion.span>

        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="font-editorial text-4xl md:text-5xl lg:text-7xl font-bold max-w-4xl mb-10 leading-tight"
        >
          One meal. One moment. One beginning.
        </motion.h2>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="relative w-full max-w-5xl aspect-video rounded-3xl overflow-hidden mb-12 shadow-2xl"
        >
          <Image 
            src="/photos/volunteer-serving-meal.jpg"
            alt="A DeepRoots volunteer serving a meal to elder-care residents in Amravati"
            fill
            className="object-cover"
          />
        </motion.div>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-lg md:text-xl text-ivory/80 max-w-3xl mb-12"
        >
          “First Meal is DeepRoots Foundation’s food-security initiative, created to bring nutritious food and dignity closer to communities experiencing hunger.”
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button href="/campaign/hunger-free" variant="secondary" size="lg">
            Support First Meal
          </Button>
          <Button href="/work#phase-1" variant="outline" size="lg" className="border-ivory text-ivory hover:bg-ivory hover:text-primary-green focus:ring-ivory">
            Learn More
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
