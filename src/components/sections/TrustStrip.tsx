"use client";

import { motion } from "framer-motion";

const values = [
  "FOOD SECURITY",
  "COMMUNITY",
  "EDUCATION",
  "DIGNITY"
];

export function TrustStrip() {
  return (
    <section className="bg-primary-brown py-8 border-y border-ivory/10">
      <div className="container mx-auto px-6">
        <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6 md:gap-24">
          {values.map((value, index) => (
            <motion.div
              key={value}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
              className="flex items-center"
            >
              <span className="text-ivory/90 font-bold tracking-[0.2em] uppercase text-sm md:text-base">
                {value}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
