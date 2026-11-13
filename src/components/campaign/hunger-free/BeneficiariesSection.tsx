"use client";

import Image from "next/image";
import { Heart, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { hungerFreeCampaign, type Beneficiary } from "@/data/hungerFreeCampaign";

const { beneficiaries } = hungerFreeCampaign;

const FADE_EDGES = {
  maskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
  WebkitMaskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
};

function MarqueeRow({ photos, direction }: { photos: Beneficiary[]; direction: "left" | "right" }) {
  return (
    <div className="campaign-marquee overflow-hidden py-2" style={FADE_EDGES}>
      {/* Rendered twice so the -50% translate loops seamlessly. */}
      <div className={`campaign-marquee-track campaign-marquee-${direction} gap-5 px-4`}>
        {[...photos, ...photos].map((photo, idx) => (
          <BeneficiaryCard key={`${photo.id}-${idx}`} photo={photo} hidden={idx >= photos.length} />
        ))}
      </div>
    </div>
  );
}

function BeneficiaryCard({ photo, hidden }: { photo: Beneficiary; hidden: boolean }) {
  const displayName = photo.name ?? photo.label;

  return (
    <figure
      aria-hidden={hidden || undefined}
      onContextMenu={(e) => e.preventDefault()}
      className="group relative w-[220px] sm:w-[260px] md:w-[300px] h-[300px] sm:h-[360px] shrink-0 rounded-3xl overflow-hidden bg-primary-green shadow-md select-none"
    >
      <Image
        src={photo.src}
        alt={hidden ? "" : `${displayName}, DeepRoots Foundation beneficiary`}
        fill
        draggable={false}
        sizes="(max-width: 640px) 220px, (max-width: 768px) 260px, 300px"
        className="object-cover pointer-events-none transition-transform duration-700 group-hover:scale-105"
      />

      {/* Watermark: these are real beneficiaries, discourage reuse of their photos. */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-25" aria-hidden="true">
        <defs>
          <pattern id={`wm-${photo.id}`} width="170" height="110" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)">
            <text x="10" y="35" fill="white" fontSize="10" fontWeight="800" letterSpacing="1.5" fontFamily="sans-serif">
              DEEPROOTS FOUNDATION
            </text>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#wm-${photo.id})`} />
      </svg>

      <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider">
        <ShieldCheck className="w-3.5 h-3.5 text-accent-gold-light" /> Field record
      </span>

      <figcaption className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-white">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-bold truncate">{displayName}</span>
          {photo.age && (
            <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-accent-gold-deep text-white">
              Age {photo.age}
            </span>
          )}
        </div>
        {photo.name && <p className="text-xs text-white/70 mt-0.5 truncate">{photo.label}</p>}
      </figcaption>
    </figure>
  );
}

export function BeneficiariesSection() {
  return (
    <section id="beneficiaries" className="py-24 md:py-32 bg-ivory overflow-hidden scroll-mt-24">
      <div className="container mx-auto px-6 md:px-12 mb-12">
        <SectionHeading subtitle={beneficiaries.eyebrow} title={beneficiaries.title} />
        <p className="mt-6 text-center text-muted max-w-xl mx-auto">{beneficiaries.description}</p>
      </div>

      <div className="space-y-4">
        <MarqueeRow photos={beneficiaries.rowOne} direction="left" />
        <MarqueeRow photos={beneficiaries.rowTwo} direction="right" />
      </div>

      <div className="container mx-auto px-6 md:px-12 mt-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto bg-white p-8 md:p-10 rounded-3xl shadow-md border-t-4 border-primary-green flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left"
        >
          <div>
            <h3 className="text-2xl text-primary-green">Support more families today</h3>
            <p className="text-muted mt-2">
              Your contribution funds daily cooking and warm meal delivery across underserved communities.
            </p>
          </div>
          <Button
            href="#donate"
            className="shrink-0 gap-2 bg-accent-gold-deep text-white hover:bg-primary-green focus:ring-accent-gold-deep transition-colors duration-300"
          >
            <Heart className="w-4 h-4 fill-white" /> Donate Now
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
