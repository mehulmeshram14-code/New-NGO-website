"use client";

import { SectionHeading } from "../ui/SectionHeading";
import { ProjectCard } from "../ui/ProjectCard";
import { projects } from "@/data/projects";

export function FocusAreas() {
  return (
    <section className="py-24 bg-sand">
      <div className="container mx-auto px-6 md:px-12">
        <SectionHeading 
          title="Where We Work. Where It Matters." 
          className="mb-16"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
          {projects.map((project, index) => (
            <ProjectCard 
              key={project.id}
              {...project}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
