import React from "react";
import { HeartHandshake, Users, Scale, TreePine, Sparkles } from "lucide-react";

const VALUES = [
  {
    icon: HeartHandshake,
    title: "Dignity First",
    description: "Every person is a partner, not a passive recipient of charity.",
  },
  {
    icon: Users,
    title: "Inclusion",
    description: "Support communities without discrimination based on caste, religion, gender or ability.",
  },
  {
    icon: Scale,
    title: "Evidence & Accountability",
    description: "Measure programme outcomes and communicate progress honestly.",
  },
  {
    icon: TreePine,
    title: "Community-Led Action",
    description: "Build programmes with communities rather than imposing solutions on them.",
  },
  {
    icon: Sparkles,
    title: "Local Roots, Global Standards",
    description: "Develop locally relevant solutions while maintaining high standards of responsibility and execution.",
  },
];

export default function MissionValuesSection() {
  return (
    <section className="py-24 bg-forest text-cream relative overflow-hidden" id="mission">
      {/* Decorative leaf / root watermark */}
      <div className="absolute right-0 bottom-0 pointer-events-none opacity-5 translate-x-1/4 translate-y-1/4">
        <svg width="600" height="600" viewBox="0 0 100 100" fill="currentColor">
          <circle cx="50" cy="50" r="45" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-gold">
            <span className="w-8 h-[2px] bg-gold"></span>
            <span>Purpose &amp; Direction</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl text-cream tracking-tight leading-tight">
            “Empowering communities. Transforming futures.”
          </h2>

          <p className="text-base sm:text-xl text-cream/90 leading-relaxed font-sans">
            End hunger as the first barrier standing between a person and their potential, then walk beside them towards education, work and a life of dignity.
          </p>
        </div>

        {/* Editorial Pull Quote Banner */}
        <div className="my-16 bg-deepgreen/70 rounded-2xl p-8 sm:p-12 border border-forest/40 shadow-editorial relative">
          <span className="font-serif text-6xl text-gold/30 absolute top-4 left-6 pointer-events-none select-none">
            “
          </span>
          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-3">
            <blockquote className="font-serif text-2xl sm:text-4xl text-cream italic leading-snug">
              “That first meal is not a favour. It is a right.”
            </blockquote>
            <p className="text-xs uppercase tracking-widest text-gold font-semibold">
              DeepRoots Foundation Guiding Principle
            </p>
          </div>
        </div>

        {/* Core Values 5-Card Layout */}
        <div className="space-y-6">
          <div className="border-b border-forest-light/20 pb-3 flex items-center justify-between">
            <h3 className="font-serif text-xl sm:text-2xl text-gold font-semibold tracking-wide">
              Our 5 Core Values
            </h3>
            <span className="text-xs uppercase tracking-widest text-cream/60">
              Guiding every field decision
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {VALUES.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div
                  key={val.title}
                  className="bg-deepgreen/50 p-6 rounded-xl border border-forest-light/15 hover:border-gold/40 transition-all hover:-translate-y-1 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-lg bg-forest/60 border border-forest-light/20 flex items-center justify-center text-gold">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="font-serif text-lg font-bold text-cream tracking-tight">
                      {val.title}
                    </h4>
                    <p className="text-sm text-cream/80 leading-relaxed font-sans">
                      {val.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-forest-light/10 text-[11px] font-mono text-gold/70">
                    0{idx + 1} / PRINCIPLE
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
