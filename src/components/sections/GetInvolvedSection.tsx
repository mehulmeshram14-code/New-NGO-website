"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "../ui/SectionHeading";
import { Button } from "../ui/Button";

const options = [
  {
    title: "DONATE",
    description: "Help provide food and essential support to communities in need.",
    button: "Donate Now",
    href: "/donate",
    variant: "secondary" as const,
    btnClass: "bg-accent-gold text-white hover:bg-primary-green hover:text-white"
  },
  {
    title: "VOLUNTEER",
    description: "Give your time, skills, or energy to make a direct impact.",
    button: "Become a Volunteer",
    href: "/get-involved#volunteer",
    variant: "secondary" as const,
    btnClass: "bg-primary-green text-white hover:bg-primary-brown hover:text-white"
  },
  {
    title: "PARTNER",
    description: "Work with us through CSR, institutions, or community partnerships.",
    button: "Partner With Us",
    href: "/get-involved#partner",
    variant: "secondary" as const,
    btnClass: "bg-primary-brown text-white hover:bg-primary-green hover:text-white"
  }
];

export function GetInvolvedSection() {
  return (
    <section className="py-24 md:py-32 bg-ivory">
      <div className="container mx-auto px-6 md:px-12 text-center">
        <SectionHeading 
          title="You don't have to change the world alone."
          className="mb-16 text-charcoal"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {options.map((opt, i) => (
            <motion.div
              key={opt.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              whileHover={{ y: -10 }}
              className="bg-white p-10 rounded-3xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col items-center border-t-4 border-transparent hover:border-primary-green"
            >
              <h3 className="text-2xl font-sans font-bold text-charcoal mb-4">{opt.title}</h3>
              <p className="text-muted mb-8 flex-grow">{opt.description}</p>
              <Button href={opt.href} variant={opt.variant} className={`w-full transition-colors duration-300 ${opt.btnClass}`}>
                {opt.button}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
