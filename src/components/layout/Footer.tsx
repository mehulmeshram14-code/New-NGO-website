import Link from "next/link";
import { siteConfig } from "@/data/siteConfig";

const footerLinks = [
  { name: "About", href: "/about" },
  { name: "Our Work", href: "/work" },
  { name: "Impact", href: "/impact" },
  { name: "Stories", href: "/stories" },
  { name: "Volunteer", href: "/get-involved#volunteer" },
  { name: "Partner", href: "/get-involved#partner" },
  { name: "Donate", href: "/donate" },
  { name: "Contact", href: "/contact" },
];

export function Footer() {
  return (
    <footer className="bg-primary-green text-ivory py-16">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="font-editorial text-3xl font-bold">{siteConfig.name}</h3>
            <p className="text-ivory/80 text-lg max-w-sm">
              Rooted in community. Growing hope.
            </p>
            <p className="text-ivory/70 max-w-md">
              {siteConfig.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-6 text-accent-gold uppercase tracking-wider text-sm">Navigation</h4>
            <ul className="grid grid-cols-2 gap-4">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-ivory/80 hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Socials */}
          <div>
            <h4 className="font-bold mb-6 text-accent-gold uppercase tracking-wider text-sm">Connect</h4>
            <ul className="space-y-4">
              <li className="text-ivory/80">{siteConfig.contact.email}</li>
              <li className="text-ivory/80">{siteConfig.contact.phone}</li>
              <li className="text-ivory/80">{siteConfig.contact.address}</li>
            </ul>
            <div className="flex gap-4 mt-6">
              <a href={siteConfig.social.instagram} className="text-ivory hover:text-accent-terracotta transition-colors" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href={siteConfig.social.linkedin} className="text-ivory hover:text-accent-terracotta transition-colors" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            </div>
          </div>
        </div>

        <div className="border-t border-ivory/20 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-ivory/60 gap-4">
          <p>&copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy-policy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/transparency" className="hover:text-white">Donation Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
