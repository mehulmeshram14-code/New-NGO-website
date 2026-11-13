import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { hungerFreeCampaign } from "@/data/hungerFreeCampaign";

/** Native <details> accordion: keyboard- and screen-reader-accessible without JavaScript. */
export function CampaignFaq() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6">
        <p className="text-sm font-bold uppercase tracking-widest text-accent-gold-deep">Before you donate</p>
        <h2 className="mt-2 text-3xl text-primary-green md:text-4xl">Questions donors ask</h2>

        <div className="mt-8 divide-y divide-sand rounded-3xl border border-sand">
          {hungerFreeCampaign.faq.map((item) => (
            <details key={item.question} className="group px-5 py-1 md:px-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-bold text-charcoal marker:hidden [&::-webkit-details-marker]:hidden">
                {item.question}
                <ChevronDown className="h-5 w-5 shrink-0 text-primary-green transition-transform group-open:rotate-180" aria-hidden="true" />
              </summary>
              <div className="pb-5 leading-relaxed text-muted">
                <p>{item.answer}</p>
                {item.link && (
                  <Link href={item.link.href} className="mt-2 inline-block font-semibold text-primary-green underline underline-offset-4">
                    {item.link.label}
                  </Link>
                )}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
