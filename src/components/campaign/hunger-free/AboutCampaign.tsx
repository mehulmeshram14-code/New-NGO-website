import Image from "next/image";
import { hungerFreeCampaign } from "@/data/hungerFreeCampaign";

export function AboutCampaign() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto grid gap-12 px-4 sm:px-6 md:px-12 lg:grid-cols-2 lg:gap-16">
        {hungerFreeCampaign.about.map((block) => (
          <article key={block.title} className="grid items-start gap-6 sm:grid-cols-[0.8fr_1fr]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
              <Image src={block.image} alt={block.imageAlt} fill sizes="(min-width: 1024px) 20vw, (min-width: 640px) 40vw, 100vw" className="object-cover" />
            </div>
            <div>
              <h2 className="text-3xl leading-tight text-primary-green">{block.title}</h2>
              <p className="mt-4 leading-relaxed text-muted">{block.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
