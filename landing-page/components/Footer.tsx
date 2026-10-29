import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, ShieldCheck, Heart, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-deepgreen text-cream border-t border-forest/20 pt-16 pb-12" id="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-forest/30">
          {/* Col 1: Identity & Mission */}
          <div className="space-y-4 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-12 h-12 shrink-0">
                <Image
                  src="/assets/images/logo.png"
                  alt="DeepRoots Foundation"
                  width={48}
                  height={48}
                  className="object-contain w-full h-full"
                />
              </div>
              <div>
                <span className="font-serif text-2xl text-cream font-medium tracking-tight block">
                  DeepRoots
                </span>
                <span className="text-[10px] tracking-widest uppercase text-gold font-semibold block">
                  Foundation
                </span>
              </div>
            </Link>
            <p className="text-sm text-cream/80 leading-relaxed pt-2">
              DeepRoots Foundation works to address hunger as the first barrier between people and their potential across Vidarbha, Maharashtra. Food is where our story starts; it is not where it ends.
            </p>
            <div className="pt-2">
              <Link
                href="/donate"
                className="inline-flex items-center gap-2 bg-terracotta hover:bg-terracotta-dark text-white text-xs font-semibold uppercase tracking-wider px-4 py-2.5 rounded-full transition-all"
              >
                <Heart className="w-3.5 h-3.5 fill-white" />
                <span>Support First Meal</span>
              </Link>
            </div>
          </div>

          {/* Col 2: Navigation & Programmes */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg text-gold font-semibold tracking-wide">
              Our Programmes
            </h4>
            <ul className="space-y-2.5 text-sm text-cream/80">
              <li>
                <Link href="/#programmes" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-terracotta"></span>
                  Hunger &amp; Nutrition (First Meal)
                </Link>
              </li>
              <li>
                <Link href="/#programmes" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-gold"></span>
                  Education &amp; Foundational Literacy
                </Link>
              </li>
              <li>
                <Link href="/#programmes" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-forest-light"></span>
                  Livelihood &amp; Women’s SHGs
                </Link>
              </li>
              <li>
                <Link href="/#programmes" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cream/40"></span>
                  Community Upliftment &amp; Dignity
                </Link>
              </li>
              <li className="pt-2">
                <Link href="/#about" className="hover:text-white transition-colors text-xs text-gold/90 font-medium">
                  About Our Roots in Vidarbha &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Official Registrations & Governance */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg text-gold font-semibold tracking-wide">
              Transparency &amp; Governance
            </h4>
            <div className="bg-forest/40 p-4 rounded-xl border border-forest/30 space-y-3 text-xs text-cream/85">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-gold font-bold block">
                  Corporate Identity Number (CIN)
                </span>
                <span className="font-mono text-cream font-medium">U88900ME2026NPL476439</span>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider text-gold font-bold block">
                  Registered Office Address
                </span>
                <span className="leading-snug block">
                  24/1/23, Gauri Shankar Nagar, Rukhmini Nagar, Amravati - 444606, Maharashtra
                </span>
              </div>
              <div className="pt-1 border-t border-forest/30">
                <div className="flex items-start gap-1.5 text-[11px] text-cream/70">
                  <ShieldCheck className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                  <span>
                    80G status: Approval application in process with Department of Income Tax. Acknowledgement receipts issued for all contributions.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Col 4: Contact & Geographic Focus */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg text-gold font-semibold tracking-wide">
              Ground Presence
            </h4>
            <p className="text-xs text-cream/80">
              Active community work, shelter feeding and educational bridging across Vidarbha:
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 bg-forest/50 rounded-full border border-forest/40 text-cream/90">
                Melghat
              </span>
              <span className="px-2.5 py-1 bg-forest/50 rounded-full border border-forest/40 text-cream/90">
                Gadchiroli
              </span>
              <span className="px-2.5 py-1 bg-forest/50 rounded-full border border-forest/40 text-cream/90">
                Amravati
              </span>
              <span className="px-2.5 py-1 bg-forest/50 rounded-full border border-forest/40 text-cream/90">
                Yavatmal
              </span>
            </div>

            <div className="pt-2 space-y-2 text-xs text-cream/80">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold" />
                <a href="mailto:deeprootsfoundation2026@gmail.com" className="hover:text-white transition-colors">
                  deeprootsfoundation2026@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold" />
                <span>+91 76202 90895</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
                <span>Amravati Headquarters, Maharashtra</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cream/60">
          <p>
            &copy; {new Date().getFullYear()} DeepRoots Foundation. All rights reserved. Registered under Section 8 of the Companies Act.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-cream transition-colors">
              Privacy Policy
            </Link>
            <Link href="/donation-policy" className="hover:text-cream transition-colors">
              Donation &amp; Refund Policy
            </Link>
            <Link href="/admin" className="hover:text-cream transition-colors text-cream/40">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
