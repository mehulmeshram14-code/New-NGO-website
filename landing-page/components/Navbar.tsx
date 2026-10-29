"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, Menu, X, ArrowUpRight } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-cream/95 backdrop-blur-md shadow-editorial py-3 border-b border-forest/10"
            : "bg-cream/80 backdrop-blur-sm py-4 border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo & Name */}
            <Link href="/" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-forest rounded-lg p-1">
              <div className="relative w-12 h-12 sm:w-16 sm:h-16 shrink-0 transition-transform duration-300 group-hover:scale-105">
                <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-forest/20 to-sun/20 blur-md opacity-60 group-hover:opacity-100 transition-opacity pointer-events-none" />
                <div className="relative w-full h-full rounded-full overflow-hidden p-0.5">
                  <Image
                    src="/assets/images/logo.png"
                    alt="DeepRoots Foundation Logo"
                    width={64}
                    height={64}
                    className="object-contain w-full h-full"
                    priority
                  />
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 pointer-events-none" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-samarkan text-2xl sm:text-3xl text-forest tracking-wide font-normal leading-none">
                  DeepRoots Foundation
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-charcoal" aria-label="Main Navigation">
              <Link href="/#about" className="hover:text-forest transition-colors">
                About Us
              </Link>
              <Link href="/#mission" className="hover:text-forest transition-colors">
                Mission &amp; Values
              </Link>
              <Link href="/#programmes" className="hover:text-forest transition-colors">
                Our Programmes
              </Link>
              <Link href="/#impact" className="hover:text-forest transition-colors">
                Impact &amp; Goals
              </Link>
              <Link href="/#team" className="hover:text-forest transition-colors">
                Our Team
              </Link>
              <Link href="/#stories" className="hover:text-forest transition-colors">
                Field Stories
              </Link>
              <Link href="/#get-involved" className="hover:text-forest transition-colors">
                Get Involved
              </Link>
              <Link href="/#contact" className="hover:text-forest transition-colors">
                Contact
              </Link>
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <Link
                href="/donate"
                className="hidden sm:inline-flex items-center gap-2 bg-terracotta hover:bg-terracotta-dark text-white text-xs sm:text-sm font-semibold uppercase tracking-wider px-4 sm:px-5 py-2.5 rounded-full shadow-terracotta transition-all transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-terracotta focus:ring-offset-2"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>Donate a Meal</span>
              </Link>

              {/* Mobile Menu Toggle Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-forest hover:bg-forest/5 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Accessible Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-charcoal/60 backdrop-blur-sm transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="fixed inset-y-0 right-0 w-full max-w-xs bg-cream p-6 shadow-2xl flex flex-col justify-between overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-forest/10">
                <div className="flex items-center gap-2">
                  <Image src="/assets/images/logo.png" alt="Logo" width={32} height={32} />
                  <span className="font-serif text-lg text-forest font-semibold">DeepRoots</span>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-charcoal hover:text-forest"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="my-3 px-3 py-1.5 bg-forest-subtle rounded-md text-[11px] font-semibold text-forest uppercase tracking-wider">
                Vidarbha Nutrition &amp; Community Upliftment
              </div>

              <nav className="flex flex-col gap-4 py-4 text-base font-medium text-charcoal">
                <Link
                  href="/#about"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-forest py-1 border-b border-forest/5"
                >
                  About Us &amp; Our Story
                </Link>
                <Link
                  href="/#mission"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-forest py-1 border-b border-forest/5"
                >
                  Mission &amp; Values
                </Link>
                <Link
                  href="/#programmes"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-forest py-1 border-b border-forest/5"
                >
                  Our 4 Programmes
                </Link>
                <Link
                  href="/#impact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-forest py-1 border-b border-forest/5"
                >
                  Impact &amp; Goals
                </Link>
                <Link
                  href="/#team"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-forest py-1 border-b border-forest/5"
                >
                  Founding Team
                </Link>
                <Link
                  href="/#stories"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-forest py-1 border-b border-forest/5"
                >
                  Field Updates
                </Link>
                <Link
                  href="/#get-involved"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-forest py-1 border-b border-forest/5"
                >
                  Volunteer &amp; Partner
                </Link>
                <Link
                  href="/#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="hover:text-forest py-1 border-b border-forest/5"
                >
                  Contact &amp; Office
                </Link>
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-xs text-charcoal-muted hover:text-forest pt-2"
                >
                  Staff Portal (Admin)
                </Link>
              </nav>
            </div>

            <div className="pt-6 border-t border-forest/10 space-y-3">
              <Link
                href="/donate"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-terracotta text-white font-semibold text-sm uppercase tracking-wider py-3 rounded-full shadow-terracotta"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>Donate a Meal</span>
              </Link>
              <div className="text-center text-[11px] text-charcoal-muted">
                Amravati · Melghat · Gadchiroli
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
