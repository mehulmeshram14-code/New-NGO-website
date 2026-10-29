import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, ArrowRight } from "lucide-react";

export default function ClosingCtaSection() {
  return (
    <section className="py-24 bg-forest text-cream relative overflow-hidden">
      {/* Background radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(197,106,72,0.15),transparent)]"></div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-deepgreen/70 border border-forest-light/20 text-gold text-xs font-bold uppercase tracking-widest">
          <span>Our Ongoing Commitment</span>
        </div>

        <h2 className="font-serif text-4xl sm:text-6xl text-cream tracking-tight leading-tight">
          “Not perfection. Presence.”
        </h2>

        <p className="text-base sm:text-xl text-cream/85 leading-relaxed max-w-2xl mx-auto font-sans">
          We may not always get everything right. But we believe in showing up, learning honestly and treating every person we serve as a partner in building a more dignified future.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/donate"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-terracotta hover:bg-terracotta-dark text-white font-semibold text-sm sm:text-base uppercase tracking-wider px-8 py-4 rounded-full shadow-terracotta transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Heart className="w-5 h-5 fill-white" />
            <span>Donate a Meal</span>
          </Link>

          <Link
            href="/#get-involved"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-cream/10 hover:bg-cream/20 text-cream font-medium text-sm sm:text-base px-8 py-4 rounded-full border border-cream/20 transition-all"
          >
            <span>Join the First Meal Movement</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="pt-10 flex items-center justify-center gap-4 text-xs text-cream/60">
          <span>Amravati</span>
          <span>•</span>
          <span>Melghat</span>
          <span>•</span>
          <span>Gadchiroli</span>
          <span>•</span>
          <span>Vidarbha, Maharashtra</span>
        </div>
      </div>
    </section>
  );
}
