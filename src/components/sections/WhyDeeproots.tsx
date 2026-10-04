"use client";

import { motion } from "framer-motion";
import { Button } from "../ui/Button";
import { ImageReveal } from "../ui/ImageReveal";

export function WhyDeeproots() {
  return (
    <section className="py-24 md:py-32 bg-ivory">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          <div className="order-2 lg:order-1 why-image-stage">
            <span className="why-image-accent" aria-hidden="true" />
            <ImageReveal
              src="/food-security.png"
              alt="Community meal gathering"
              className="why-image-shape w-full aspect-[4/5] rounded-3xl"
            />
          </div>

          <div className="order-1 lg:order-2 flex flex-col items-start">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-editorial text-4xl md:text-5xl lg:text-6xl font-bold text-primary-green mb-8 leading-tight"
            >
              A meal is more than food.
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-6 text-lg md:text-xl text-muted font-serif italic border-l-2 border-accent-terracotta pl-6 mb-8"
            >
              <p>“For a child, it can mean the strength to stay in school.</p>
              <p>For a mother, it can mean one less impossible choice.</p>
              <p>For a family, it can mean a little more hope for tomorrow.”</p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-charcoal/80 mb-10 text-lg leading-relaxed"
            >
              DeepRoots Foundation exists to address hunger at its roots — while creating pathways toward education, dignity and sustainable community development.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <Button href="/about" variant="primary">
                Learn About Our Mission
              </Button>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
