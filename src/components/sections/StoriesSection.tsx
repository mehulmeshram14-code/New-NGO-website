"use client";

import { SectionHeading } from "../ui/SectionHeading";
import { StoryCard } from "../ui/StoryCard";
import { stories } from "@/data/stories";
import { Button } from "../ui/Button";

export function StoriesSection() {
  return (
    <section className="py-24 bg-ivory">
      <div className="container mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <SectionHeading 
            title="Stories From the Field" 
            align="left"
            className="mb-0"
          />
          <Button href="/stories" variant="outline" className="shrink-0">
            View All Stories
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {stories.map((story) => (
            <StoryCard 
              key={story.id}
              {...story}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
