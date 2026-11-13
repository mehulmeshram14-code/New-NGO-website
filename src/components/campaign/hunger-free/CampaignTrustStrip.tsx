import { BadgeCheck, FileCheck, Landmark, Lock, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/data/siteConfig";

const tiles = [
  { icon: Landmark, title: "Registered non-profit", detail: "Section 8 company", code: siteConfig.cin },
  { icon: MapPin, title: "Based in Amravati", detail: "Working across Vidarbha" },
  { icon: Lock, title: "Secure payment", detail: "UPI, cards, net banking via Razorpay" },
  { icon: FileCheck, title: "Instant receipt", detail: "With a unique reference" },
  { icon: BadgeCheck, title: "80G applied for", detail: "Tax receipts once approved" },
  { icon: Phone, title: "Here to help", detail: siteConfig.contact.phone, href: siteConfig.contact.phoneHref },
];

export function CampaignTrustStrip() {
  return (
    <section aria-label="Why you can trust this donation" className="bg-ivory py-12 md:py-16">
      <ul className="container mx-auto grid grid-cols-2 gap-3 px-4 sm:px-6 md:grid-cols-3 md:px-12 lg:grid-cols-6">
        {tiles.map(({ icon: Icon, title, detail, href, code }) => (
          <li key={title} className="rounded-2xl border border-sand bg-white p-4 text-center">
            <Icon className="mx-auto h-6 w-6 text-primary-green" aria-hidden="true" />
            <p className="mt-2 text-sm font-bold text-charcoal">{title}</p>
            <p className="mt-0.5 break-words text-xs text-muted">
              {href ? (
                <a href={href} className="hover:text-primary-green hover:underline">
                  {detail}
                </a>
              ) : (
                detail
              )}
            </p>
            {code && (
              // Registration numbers stay on one line; they shrink rather than wrap mid-number.
              <p className="mt-1 whitespace-nowrap font-mono text-[10px] tracking-tight text-muted">CIN {code}</p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
