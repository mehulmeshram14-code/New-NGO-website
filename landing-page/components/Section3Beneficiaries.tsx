
"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Heart,
  ShieldCheck,
  Lock,
} from "lucide-react";

interface BeneficiaryPhoto {
  id: string;
  src: string;
  name?: string;
  age?: string | number;
  label: string;
}

// Authenticated field photographs - 13 completely unique photographs (no duplicates, no repeats across rows)
const ROW_1_PHOTOS: BeneficiaryPhoto[] = [
  {
    id: "bp-3",
    src: "/assets/images/beneficiaries/image3.jpeg",
    name: "Saraswati Shantaram Maske",
    age: "80",
    label: "Elder Daily Food Seva Beneficiary",
  },
  { id: "bp-drive", src: "/assets/images/beneficiaries/image-drive.jpeg", label: "Community Meal Distribution" },
  {
    id: "bp-4",
    src: "/assets/images/beneficiaries/image4.jpeg",
    name: "Sunita Rajendra Ghadge",
    age: "60",
    label: "Warm Meal Seva Beneficiary",
  },
  {
    id: "bp-6",
    src: "/assets/images/beneficiaries/image6.jpeg",
    name: "Savita Bhalchandra Kulkarni",
    age: "64",
    label: "Elder Nutrition Seva Beneficiary",
  },
  {
    id: "bp-9",
    src: "/assets/images/beneficiaries/image9.jpeg",
    name: "Urmila Daulatrao Kukade",
    age: "70",
    label: "Nutritious Food Seva Beneficiary",
  },
  {
    id: "bp-11",
    src: "/assets/images/beneficiaries/image11.jpeg",
    name: "Nirmala Kisanrao Patil",
    age: "65",
    label: "Seated Community Food Seva Beneficiary",
  },
  {
    id: "bp-14",
    src: "/assets/images/beneficiaries/image14.jpeg",
    name: "Mangla Ganesh Vijaykar",
    age: "57",
    label: "Fresh Meal Kit Beneficiary",
  },
  {
    id: "bp-15",
    src: "/assets/images/beneficiaries/image15.jpeg",
    name: "Varsha Sunil Dhotre",
    age: "43",
    label: "Doorstep Nutrition Seva Beneficiary",
  },
];

const ROW_2_PHOTOS: BeneficiaryPhoto[] = [
  {
    id: "bp-8",
    src: "/assets/images/beneficiaries/image8.jpeg",
    name: "Lilabai Kisanrao Tambatkar",
    age: "80",
    label: "Elder Food Nutrition Beneficiary",
  },
  {
    id: "bp-12",
    src: "/assets/images/beneficiaries/image12.jpeg",
    name: "Godavari Prabhakar Gadave",
    age: "75",
    label: "Elder Nutrition Seva Beneficiary",
  },
  {
    id: "bp-16",
    src: "/assets/images/beneficiaries/image16.jpeg",
    name: "Geeta Damuji Yadav",
    age: "52",
    label: "Nutrition Meal Kit Beneficiary",
  },
  {
    id: "bp-17",
    src: "/assets/images/beneficiaries/image17.jpeg",
    name: "Sahebrao Wathodkar",
    age: "75",
    label: "Community Seva Beneficiary",
  },
  {
    id: "bp-18",
    src: "/assets/images/beneficiaries/image18.jpeg",
    name: "Ishwardas Kodumal Gangwani",
    age: "64",
    label: "Hot Meal Seva Beneficiary",
  },
  {
    id: "bp-19",
    src: "/assets/images/beneficiaries/image19.jpeg",
    name: "Mangla Bana Bakode",
    age: "74",
    label: "Village Outreach Seva Beneficiary",
  },
  {
    id: "bp-20",
    src: "/assets/images/beneficiaries/image20.jpeg",
    name: "Sudhakar Kapse",
    age: "75",
    label: "Grassroots Relief Seva Beneficiary",
  },
  {
    id: "bp-21",
    src: "/assets/images/beneficiaries/image21.jpeg",
    name: "Vinod Wante",
    age: "55",
    label: "Daily Food Seva Beneficiary",
  },
];

export default function Section3Beneficiaries() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      className="py-14 sm:py-24 bg-ivory relative overflow-hidden scroll-mt-20 select-none"
      id="beneficiaries"
      aria-label="Beneficiary Field Photographs"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rust/10 text-rust text-xs font-bold uppercase tracking-wider mb-3 shadow-sm border border-rust/20">
            <ShieldCheck className="w-4 h-4 text-rust" />
            <span>Official Beneficiary Field Records</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-earth tracking-tight leading-tight">
            Every Meal Reaches a Real Soul.
          </h2>
          <p className="mt-3 text-xs sm:text-base text-earth/75 leading-relaxed font-sans max-w-xl mx-auto">
            Authentic ground photographs from our daily community kitchen and rural food distribution drives across Vidarbha.
          </p>
        </motion.div>
      </div>

      {/* AUTOMATED CONTINUOUS SCROLLING RIBBON 1 (DRIFTING LEFT) */}
      <div
        className="marquee-container relative w-full overflow-x-hidden py-2 sm:py-3"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
        }}
      >
        <div className="marquee-track-left gap-4 sm:gap-6 px-4">
          {[...ROW_1_PHOTOS, ...ROW_1_PHOTOS].map((photo, idx) => (
            <BeneficiaryCard key={`row1-${photo.id}-${idx}`} photo={photo} />
          ))}
        </div>
      </div>

      {/* AUTOMATED CONTINUOUS SCROLLING RIBBON 2 (DRIFTING RIGHT) */}
      <div
        className="marquee-container relative w-full overflow-x-hidden py-2 sm:py-3 mt-3 sm:mt-4"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 5%, black 95%, transparent)",
        }}
      >
        <div className="marquee-track-right gap-4 sm:gap-6 px-4">
          {[...ROW_2_PHOTOS, ...ROW_2_PHOTOS].map((photo, idx) => (
            <BeneficiaryCard key={`row2-${photo.id}-${idx}`} photo={photo} />
          ))}
        </div>
      </div>

      {/* BOTTOM ACTION CTA */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 sm:mt-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6 }}
          className="p-6 sm:p-8 rounded-3xl bg-cream/70 border-2 border-rust/30 shadow-card flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div className="text-left">
            <h3 className="font-serif text-lg sm:text-2xl font-bold text-earth">
              Support More Beneficiaries Today
            </h3>
            <p className="text-xs sm:text-sm text-earth/75 mt-1 font-sans">
              Choose your contribution to help fund daily cooking and warm meal delivery across underserved communities.
            </p>
          </div>

          <motion.button
            type="button"
            onClick={() => scrollTo("donate")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-rust hover:bg-rust-hover text-white text-xs sm:text-sm font-black uppercase tracking-wider px-8 py-3.5 rounded-full shadow-lg border-2 border-rust-light/50 transition-all cursor-pointer shrink-0"
          >
            <Heart className="w-4 h-4 fill-white text-white" />
            <span>Donate Now</span>
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}

// ============================================================================
// BENEFICIARY CARD WITH COMPREHENSIVE ANTI-THEFT WATERMARK SYSTEM
// ============================================================================
function BeneficiaryCard({ photo }: { photo: BeneficiaryPhoto }) {
  const displayName = photo.name || photo.label;

  return (
    <div
      className="group relative w-[220px] sm:w-[280px] md:w-[320px] h-[300px] sm:h-[380px] shrink-0 rounded-2xl sm:rounded-3xl overflow-hidden bg-earth shadow-card border-2 border-earth/15 hover:border-rust/40 transition-all duration-300 hover:shadow-2xl select-none"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* 1. Underlying Photograph */}
      <Image
        src={photo.src}
        alt={`${displayName} - DeepRoots Foundation Field Archive`}
        fill
        draggable={false}
        sizes="(max-width: 640px) 220px, (max-width: 1024px) 280px, 320px"
        className="object-cover object-center pointer-events-none group-hover:scale-105 transition-transform duration-700 ease-out"
      />

      {/* 2. Full-Surface Repeating Diagonal SVG Watermark Grid */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none select-none z-10 opacity-30 group-hover:opacity-40 transition-opacity"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id={`wm-grid-${photo.id}`}
            width="170"
            height="110"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(-30)"
          >
            <text
              x="10"
              y="35"
              fill="white"
              fontSize="10"
              fontWeight="900"
              fontFamily="sans-serif"
              letterSpacing="1.5"
            >
              DEEPROOTS FOUNDATION
            </text>
            <text
              x="25"
              y="75"
              fill="white"
              fontSize="7"
              fontWeight="700"
              fontFamily="sans-serif"
              letterSpacing="1"
            >
              OFFICIAL FIELD RECORD · DO NOT REUSE
            </text>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#wm-grid-${photo.id})`} />
      </svg>

      {/* 3. Top Hallmark Badge */}
      <div className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/55 backdrop-blur-md border border-white/30 text-white shadow-md pointer-events-none select-none">
        <ShieldCheck className="w-3.5 h-3.5 text-rust-light" />
        <span className="text-[9px] font-bold tracking-wider uppercase">
          DeepRoots Verified
        </span>
      </div>

      {/* 4. Bottom Label */}
      <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 bg-gradient-to-t from-black/95 via-black/60 to-transparent text-white z-20 pointer-events-none select-none">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <Lock className="w-3 h-3 text-rust-light shrink-0" />
            <span className="text-[11px] sm:text-xs font-bold text-white tracking-wide truncate">
              {displayName}
            </span>
          </div>
          {photo.age && (
            <span className="shrink-0 text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full bg-rust/90 border border-rust-light/40 text-white shadow-sm tracking-wide">
              Age {photo.age}
            </span>
          )}
        </div>
        {photo.name && photo.label && (
          <p className="text-[9px] sm:text-[10px] text-white/70 mt-0.5 pl-4.5 truncate font-sans">
            {photo.label}
          </p>
        )}
      </div>

      {/* 5. Anti-Theft Security Shield Overlay */}
      <div
        className="absolute inset-0 z-30 cursor-default select-none bg-transparent"
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        style={{
          WebkitTouchCallout: "none",
          userSelect: "none",
        }}
      />
    </div>
  );
}
