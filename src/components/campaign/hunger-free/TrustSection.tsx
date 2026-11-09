"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, PieChart, Receipt } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { hungerFreeCampaign } from "@/data/hungerFreeCampaign";
import { siteConfig } from "@/data/siteConfig";

const { trust } = hungerFreeCampaign;
const ICONS = [Receipt, PieChart, MapPin];

export function TrustSection() {
  return (
    <section id="trust" className="py-24 md:py-32 bg-sand/40 scroll-mt-24">
      <div className="container mx-auto px-6 md:px-12">
        <SectionHeading subtitle={trust.eyebrow} title={trust.title} />
        <p className="mt-6 text-center text-muted max-w-xl mx-auto">{trust.description}</p>

        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trust.items.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="bg-white p-8 rounded-3xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-t-4 border-transparent hover:border-primary-green"
              >
                <span className="w-12 h-12 rounded-2xl bg-primary-green/10 text-primary-green flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5" />
                </span>
                <p className="text-xs font-bold uppercase tracking-widest text-accent-gold mb-2">{item.label}</p>
                <h3 className="font-sans text-lg font-bold text-charcoal mb-2 leading-snug">{item.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{item.description}</p>
              </motion.div>
            );
          })}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-primary-green text-white p-8 rounded-3xl shadow-md"
          >
            <span className="w-12 h-12 rounded-2xl bg-white/10 text-accent-gold flex items-center justify-center mb-5">
              <Mail className="w-5 h-5" />
            </span>
            <p className="text-xs font-bold uppercase tracking-widest text-accent-gold mb-2">Get in touch</p>
            <h3 className="font-sans text-lg font-bold !text-white mb-3 leading-snug">Questions about your donation?</h3>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="block text-sm text-white/85 hover:text-accent-gold underline underline-offset-4 break-all transition-colors"
            >
              {siteConfig.contact.email}
            </a>
            <a
              href={siteConfig.contact.phoneHref}
              className="mt-2 block text-sm text-white/85 hover:text-accent-gold transition-colors"
            >
              {siteConfig.contact.phone}
            </a>
            <p className="text-xs text-white/60 mt-4 pt-4 border-t border-white/15">
              We respond within 24–48 business hours.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
