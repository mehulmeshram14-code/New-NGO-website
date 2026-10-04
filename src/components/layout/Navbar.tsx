"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Heart, ChevronDown } from "lucide-react";
import { Button } from "../ui/Button";

const navLinks = [
  { name: "Home", href: "/" },
  { 
    name: "About Us", 
    href: "/about",
    subLinks: [
      { name: "Core Team", href: "/about#team" },
      { name: "Our Mission", href: "/about#mission" },
      { name: "Focus Area", href: "/work" },
    ]
  },
  { name: "Impact", href: "/impact" },
  { name: "Blog & Updates", href: "/stories" },
  { name: "Contact Us", href: "/contact" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-24 bg-ivory/95 backdrop-blur-md shadow-sm">
      <div className="container mx-auto h-full px-6 md:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4 z-50">
          <Image src="/logo.png" alt="Foundation Logo" width={90} height={90} className="object-contain" />
          <span className="font-samarkan text-2xl md:text-3xl tracking-wide text-charcoal">
            deep roots foundation
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <div key={link.name} className="relative group h-full flex items-center" onMouseEnter={() => setActiveDropdown(link.name)} onMouseLeave={() => setActiveDropdown(null)}>
              {link.subLinks ? (
                <>
                  <Link href={link.href} className="text-sm font-semibold text-charcoal hover:text-primary-green transition-colors flex items-center gap-1 py-4">
                    {link.name}
                    <ChevronDown size={14} className={`transition-transform duration-200 ${activeDropdown === link.name ? 'rotate-180' : ''}`} />
                  </Link>
                  <div className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 w-48 transition-all duration-300 ${activeDropdown === link.name ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                    <div className="bg-white shadow-xl border border-gray-100 flex flex-col rounded-xl overflow-hidden">
                      {link.subLinks.map((subLink) => (
                        <Link key={subLink.name} href={subLink.href} className="px-5 py-3 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-primary-green transition-colors">
                          {subLink.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <Link href={link.href} className="text-sm font-semibold text-charcoal hover:text-primary-green transition-colors py-4">
                  {link.name}
                </Link>
              )}
            </div>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <Button href="/donate" variant="secondary" className="bg-primary-green text-white hover:bg-primary-green/90 transition-colors duration-300 rounded-full flex items-center gap-2">
            <Heart size={16} /> Donate Now
          </Button>
        </div>

        <button className="lg:hidden z-50 p-2 text-charcoal" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle Menu">
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-0 bg-ivory z-40 flex flex-col items-center justify-center gap-6 px-6 overflow-y-auto pt-20 pb-10"
            >
              {navLinks.map((link) => (
                <div key={link.name} className="flex flex-col items-center w-full">
                  <Link href={link.href} onClick={() => setMobileMenuOpen(false)} className="text-2xl font-serif font-bold text-charcoal hover:text-primary-green transition-colors mb-2">
                    {link.name}
                  </Link>
                  {link.subLinks && (
                    <div className="flex flex-col items-center gap-3 mt-2 mb-4 w-full bg-white/50 rounded-2xl py-4">
                      {link.subLinks.map(subLink => (
                        <Link key={subLink.name} href={subLink.href} onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-gray-600 hover:text-primary-green transition-colors">
                          {subLink.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <Button href="/donate" variant="secondary" className="mt-6 w-full max-w-xs bg-primary-green text-white rounded-full flex items-center justify-center gap-2 hover:bg-primary-green/90 py-4 text-lg" onClick={() => setMobileMenuOpen(false)}>
                <Heart size={20} /> Donate Now
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
