"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock, Tag, ArrowRight, X } from "lucide-react";

interface Story {
  id: string;
  category: "Activities" | "Events" | "Announcements";
  title: string;
  date: string;
  readTime: string;
  excerpt: string;
  image: string;
  fullContent: string;
}

const FIELD_STORIES: Story[] = [
  {
    id: "melghat",
    category: "Activities",
    title: "Ground Nutrition Outreach Across 6 Korku Tribal Hamlets in Melghat",
    date: "October 2026",
    readTime: "3 min read",
    excerpt:
      "Our field team navigated unpaved forest trails to provide freshly prepared, nutritious grain meals and micronutrient supplements to elderly persons and young mothers.",
    image: "/assets/images/daan-serving.jpg",
    fullContent:
      "Melghat, nestled in the Satpura hill ranges of Amravati district, has long wrestled with high rates of infant undernutrition. Working alongside local Anganwadi workers, DeepRoots field volunteers prepared warm, fortified khichdi, seasonal greens, and fresh buttermilk. Over 1,200 meals were served with warmth and dignity. Our monitoring team enrolled 34 underweight infants into our 90-day nutrition observation cohort.",
  },
  {
    id: "amravati",
    category: "Events",
    title: "Elderly Health & Nutritional Care Camp Hosted in Amravati",
    date: "October 2026",
    readTime: "4 min read",
    excerpt:
      "In collaboration with voluntary medical practitioners, DeepRoots hosted a Day of Care for 150+ senior citizens at our partner shelter in Rukhmini Nagar.",
    image: "/assets/images/community-smile.jpg",
    fullContent:
      "Many seniors living in shelters suffer from chronic digestive ailments compounded by poor nutritional absorption. A voluntary medical team conducted hemoglobin checks, blood pressure screenings, and personalized dietary consultations. Every elder was treated to a traditional, freshly prepared multi-course meal designed specifically for geriatric health.",
  },
  {
    id: "first-meal",
    category: "Announcements",
    title: "DeepRoots Launches 'First Meal' Initiative Across Vidarbha",
    date: "September 2026",
    readTime: "2 min read",
    excerpt:
      "A structured initiative to ensure no child sits in a classroom with an empty stomach, connecting morning breakfast with increased school attendance and retention.",
    image: "/assets/images/volunteer-serving-full.png",
    fullContent:
      "The 'First Meal' program is our flagship school-readiness nutrition intervention designed to eliminate classroom hunger before morning lessons begin. Studies show morning nutrition can boost school attendance by up to 28% and drastically improve cognitive focus. Our target is to guarantee daily morning meals for 10,000 children across Vidarbha over the next 18 months.",
  },
];

export default function FieldStoriesSection() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  const filteredStories =
    activeCategory === "All"
      ? FIELD_STORIES
      : FIELD_STORIES.filter((s) => s.category === activeCategory);

  return (
    <section className="py-24 bg-cream-light border-t border-forest/10 relative" id="stories">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-earth">
              <span className="w-8 h-[2px] bg-terracotta"></span>
              <span>Updates From the Field</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl text-forest tracking-tight leading-tight">
              “Real people. Real challenges. Work that continues.”
            </h2>
            <p className="text-sm sm:text-base text-charcoal/80 font-sans">
              Authentic reports, activities, and milestones from our ground interventions in Amravati, Melghat, and Gadchiroli.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0" role="tablist">
            {["All", "Activities", "Events", "Announcements"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all ${
                  activeCategory === cat
                    ? "bg-forest text-white shadow-sm"
                    : "bg-white text-charcoal border border-forest/15 hover:border-forest/40"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStories.map((story) => (
            <article
              key={story.id}
              className="bg-white rounded-2xl overflow-hidden border border-forest/15 shadow-sm hover:shadow-card hover:-translate-y-1 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-cream-dark">
                  <Image
                    src={story.image}
                    alt={story.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-forest/90 backdrop-blur-sm text-[10px] uppercase font-bold text-cream tracking-wider">
                    {story.category}
                  </span>
                </div>

                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-3 text-xs text-charcoal-muted">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-earth" />
                      {story.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-earth" />
                      {story.readTime}
                    </span>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-forest leading-snug">
                    {story.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-charcoal/80 leading-relaxed font-sans">
                    {story.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  type="button"
                  onClick={() => setSelectedStory(story)}
                  className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-terracotta hover:text-terracotta-dark transition-colors"
                >
                  <span>Read Full Report</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Story Detail Dialog */}
      {selectedStory && (
        <div
          className="fixed inset-0 z-50 bg-charcoal/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedStory(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedStory(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-cream-light text-charcoal/70 hover:text-charcoal"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold text-terracotta uppercase tracking-wider">
              <Tag className="w-3.5 h-3.5" />
              <span>{selectedStory.category} · {selectedStory.date}</span>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl text-forest font-bold leading-snug">
              {selectedStory.title}
            </h3>

            <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-cream-dark">
              <Image
                src={selectedStory.image}
                alt={selectedStory.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="text-sm text-charcoal/85 leading-relaxed space-y-3 font-sans">
              <p>{selectedStory.fullContent}</p>
            </div>

            <div className="pt-4 border-t border-forest/10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-charcoal-muted">
                Reporting from Amravati / Vidarbha
              </span>
              <Link
                href="/donate"
                onClick={() => setSelectedStory(null)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-terracotta text-white text-xs uppercase font-semibold tracking-wider px-5 py-2.5 rounded-full"
              >
                <span>Support This Work with a Meal &rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
