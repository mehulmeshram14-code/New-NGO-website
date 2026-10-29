import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Phone, MapPin, ShieldCheck, Heart } from "lucide-react";
import InstagramIcon from "@/components/icons/InstagramIcon";

export default function CompactFooter() {
  return (
    <footer className="bg-earth text-ivory/90 border-t border-earth-light/20 pt-10 pb-8 sm:pt-14 sm:pb-10">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 sm:pb-10 border-b border-white/10 items-start">
          {/* Brand Identity & Mission (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 sm:gap-3.5 group focus:outline-none focus:ring-2 focus:ring-sun rounded-lg"
              aria-label="DeepRoots Foundation Home"
            >
              <div className="relative w-12 h-12 sm:w-16 sm:h-16 shrink-0 transition-all duration-300 group-hover:scale-105">
                {/* Soft ambient golden halo on dark footer */}
                <div className="absolute -inset-1 rounded-full bg-sun/20 blur-md opacity-40 group-hover:opacity-80 transition-opacity pointer-events-none" />
                <div className="relative w-full h-full rounded-full overflow-hidden p-0.5">
                  <Image
                    src="/assets/images/logo.png"
                    alt="DeepRoots Foundation Logo"
                    width={64}
                    height={64}
                    className="object-contain w-full h-full"
                  />
                  {/* Subtle shimmer sweep on hover */}
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 pointer-events-none" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-samarkan text-2xl sm:text-3xl text-ivory font-normal tracking-wide leading-none group-hover:text-sun transition-colors">
                  DeepRoots Foundation
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-ivory/80 leading-relaxed font-sans max-w-sm">
              Dedicated to addressing hunger, improving nutrition, expanding education, and empowering underserved communities.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <a
                href="#donate"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-rust-light hover:text-white transition-colors uppercase tracking-wider"
              >
                <Heart className="w-3.5 h-3.5 fill-rust-light text-rust-light" />
                <span>Support the Cause</span>
              </a>
            </div>
          </div>

          {/* Official Contact Details (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-bold text-sun">
              Official Contact
            </h4>
            <div className="space-y-2 text-xs text-ivory/80 font-sans">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-sun shrink-0 mt-0.5" />
                <span>24/1/23, Gauri Shankar Nagar, Rukhmini Nagar, Amravati - 444606, Maharashtra</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-sun shrink-0" />
                <a
                  href="mailto:deeprootsfoundation2026@gmail.com"
                  className="hover:text-sun transition-colors break-all"
                >
                  deeprootsfoundation2026@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-sun shrink-0" />
                <a href="tel:+917620290895" className="hover:text-sun transition-colors">
                  +91 76202 90895
                </a>
              </div>
            </div>
          </div>

          {/* Legal Policies & Links (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-bold text-sun">
              Policies & Governance
            </h4>
            <ul className="space-y-2 text-xs text-ivory/80 font-sans">
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:text-sun transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-sun/80" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/donation-policy"
                  className="hover:text-sun transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-sun/80" />
                  <span>Donation Policy</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="hover:text-sun transition-colors flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-sun/80" />
                  <span>Administrative Portal</span>
                </Link>
              </li>
            </ul>

            <div className="pt-3">
              <a
                href="https://www.instagram.com/deeprootsfoundation/?utm_source=ig_web_button_share_sheet"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sun hover:opacity-85 transition-opacity"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-5 h-5 text-sun stroke-[2.2] shrink-0" />
                <span className="font-bold text-base text-sun tracking-tight">Instagram</span>
              </a>
            </div>
          </div>
        </div>

        {/* Legal Disclosures & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-ivory/70 font-sans">
          <div className="flex items-center gap-2 text-center md:text-left">
            <ShieldCheck className="w-3.5 h-3.5 text-sun shrink-0" />
            <span>
              DeepRoots Foundation · Committed to transparent governance and grassroots community nourishment across Vidarbha.
            </span>
          </div>

          <div className="text-center md:text-right shrink-0">
            © {new Date().getFullYear()} DeepRoots Foundation. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
