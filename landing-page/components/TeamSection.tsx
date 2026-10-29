import React from "react";
import Image from "next/image";
import { Users, Award, Shield } from "lucide-react";

const TEAM_MEMBERS = [
  {
    name: "Prayas Sarvadhikari",
    role: "Founder",
    bio: "Passionate about grassroots child nutrition, education access, and sustainable village development across Vidarbha.",
    initials: "PS",
  },
  {
    name: "Utkarsh Meshram",
    role: "Co-Founder",
    bio: "Dedicated to community mobilization, volunteer logistics, and dignified food distribution across remote rural hamlets.",
    initials: "UM",
  },
  {
    name: "Sadanand Shinde",
    role: "Secretary",
    bio: "Overseeing regulatory compliance, institutional governance, and financial transparency for DeepRoots Foundation.",
    initials: "SS",
  },
  {
    name: "Founding Member (Operations)",
    role: "Founding Team Member",
    bio: "Field operations and tribal community liaison (role finalization in progress).",
    initials: "FM",
    isPlaceholder: true,
  },
  {
    name: "Founding Member (Education)",
    role: "Founding Team Member",
    bio: "Curriculum development and school bridge learning coordinator (role finalization in progress).",
    initials: "FM",
    isPlaceholder: true,
  },
];

export default function TeamSection() {
  return (
    <section className="py-24 bg-cream relative" id="team">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-earth">
            <span className="w-8 h-[2px] bg-terracotta"></span>
            <span>People Behind the Mission</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl text-forest tracking-tight leading-tight">
            “Five people who decided watching was no longer enough.”
          </h2>

          <p className="text-base sm:text-lg text-charcoal/80 leading-relaxed font-sans">
            DeepRoots Foundation was founded by youth from Vidarbha who witnessed classroom hunger and remote distress firsthand. We believe in being present on the ground, serving with dignity, and holding ourselves accountable to every community we touch.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEAM_MEMBERS.map((member) => (
            <div
              key={member.name}
              className={`p-6 rounded-2xl border transition-all ${
                member.isPlaceholder
                  ? "bg-cream-light/60 border-forest/10 border-dashed"
                  : "bg-white border-forest/15 shadow-sm hover:shadow-card hover:-translate-y-1"
              } flex flex-col justify-between`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-serif font-bold text-base ${
                      member.isPlaceholder
                        ? "bg-cream-dark text-charcoal-muted"
                        : "bg-forest-subtle text-forest border border-forest/20"
                    }`}
                  >
                    {member.initials}
                  </div>
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full ${
                      member.isPlaceholder
                        ? "bg-charcoal/5 text-charcoal-muted"
                        : "bg-terracotta/10 text-terracotta"
                    }`}
                  >
                    {member.role}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="font-serif text-xl font-bold text-forest">
                    {member.name}
                  </h3>
                  <p className="text-xs text-charcoal/80 leading-relaxed font-sans">
                    {member.bio}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-forest/10 flex items-center justify-between text-[11px] text-charcoal-muted">
                <span>Vidarbha Ground Team</span>
                <span className="text-forest font-semibold">DeepRoots Foundation</span>
              </div>
            </div>
          ))}
        </div>

        {/* Real Ground Presence Card */}
        <div className="bg-forest rounded-3xl p-8 sm:p-10 text-cream grid grid-cols-1 lg:grid-cols-12 gap-8 items-center border border-forest-light/20">
          <div className="lg:col-span-8 space-y-3">
            <span className="text-xs uppercase tracking-widest text-gold font-bold block">
              Grassroots Commitment
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-cream font-medium">
              Ground leadership from Amravati to the Satpura ranges.
            </h3>
            <p className="text-sm text-cream/80 leading-relaxed max-w-2xl">
              Our team operates directly from our registered office at Rukhmini Nagar, Amravati. We collaborate with village sarpanchs, anganwadi workers, and district doctors to ensure food and educational support reach the most vulnerable families without bureaucratic delays.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
            <div className="p-4 rounded-xl bg-deepgreen/80 border border-forest-light/20 text-xs space-y-1">
              <span className="text-gold font-bold block">Office Address:</span>
              <span>24/1/23, Gauri Shankar Nagar, Rukhmini Nagar, Amravati - 444606</span>
            </div>
            <div className="p-4 rounded-xl bg-deepgreen/80 border border-forest-light/20 text-xs space-y-1">
              <span className="text-gold font-bold block">Direct Hotline:</span>
              <span>+91 76202 90895 / contact@deeprootsfoundation.org</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
