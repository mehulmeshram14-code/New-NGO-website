"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { hungerFreeCampaign } from "@/data/hungerFreeCampaign";

const { finalCta } = hungerFreeCampaign;

export function FinalCtaSection() {
  return (
    <section className="py-24 md:py-32 bg-ivory">
      <div className="container mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden rounded-3xl bg-primary-green px-6 py-16 md:px-16 md:py-20 text-center"
        >
          <div className="absolute -right-24 -top-24 w-80 h-80 rounded-full bg-accent-gold/20 blur-3xl pointer-events-none" />
          <div className="absolute -left-24 -bottom-24 w-80 h-80 rounded-full bg-primary-brown/40 blur-3xl pointer-events-none" />

          <div className="relative max-w-2xl mx-auto">
            <span className="text-accent-gold font-bold tracking-widest uppercase text-sm">{finalCta.eyebrow}</span>
            <h2 className="mt-4 text-4xl md:text-6xl font-serif !text-white leading-tight">
              {finalCta.titleLead} <br />
              <span className="italic !text-accent-gold">{finalCta.titleAccent}</span>
            </h2>
            <p className="mt-6 text-white/85 text-lg leading-relaxed">{finalCta.description}</p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                href="#donate"
                size="lg"
                className="gap-2 bg-accent-gold text-white hover:bg-white hover:text-primary-green focus:ring-accent-gold transition-colors duration-300"
              >
                <Heart className="w-5 h-5 fill-current" /> Donate Now
              </Button>
              <Button
                href="#beneficiaries"
                variant="outline"
                size="lg"
                className="border-ivory text-ivory hover:bg-ivory hover:text-charcoal transition-colors duration-300"
              >
                View Beneficiaries
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
