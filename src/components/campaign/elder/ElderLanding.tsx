import Image from "next/image";
import Link from "next/link";
import { Check, Heart, House, MessageCircle } from "lucide-react";
import { DonateButton } from "@/components/donation/DonateButton";
import { DonationCard } from "@/components/donation/DonationCard";
import { EmailText } from "@/components/ui/EmailText";
import { elderCampaign as copy } from "@/data/elderCampaign";
import { formatINR, mealsFor } from "@/data/donation";
import { siteConfig } from "@/data/siteConfig";

/*
 * Sections of the "No Elder Sleeps Hungry" landing page, top to bottom.
 * Server components; the only interactive pieces are <DonateButton> and <DonationCard>,
 * which need the surrounding <DonationProvider campaignId="no-elder-sleeps-hungry">.
 */

const container = "mx-auto max-w-6xl px-4 sm:px-6 md:px-12";
const eyebrowLight = "text-xs font-bold uppercase tracking-widest text-primary-green-deep";
const headingLight = "font-serif text-3xl leading-tight text-primary-brown md:text-4xl";
const greenButton =
  "inline-flex items-center justify-center gap-2 rounded-full bg-primary-green px-6 py-3.5 font-bold text-white transition-colors hover:bg-primary-green-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-green focus-visible:ring-offset-2";

export function ElderHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-sand bg-white/95 backdrop-blur print:hidden">
      <div className={`${container} flex h-[4.5rem] items-center justify-between gap-4`}>
        <Link href="/" className="flex min-w-0 items-center gap-3" aria-label={`${siteConfig.name} home`}>
          <Image src="/logo.png" alt="" width={44} height={44} className="h-9 w-9 shrink-0 object-contain sm:h-11 sm:w-11" />
          <span className="min-w-0">
            <span className="block whitespace-nowrap font-serif text-[15px] leading-tight text-primary-brown sm:text-lg">{siteConfig.name}</span>
            <span className="hidden truncate text-[10px] font-semibold uppercase tracking-[0.2em] text-muted sm:block">
              Nourish · Educate · Empower
            </span>
          </span>
        </Link>
        <DonateButton className={`${greenButton} shrink-0 px-4 py-2.5 text-sm sm:px-5`}>Feed an Elder</DonateButton>
      </div>
    </header>
  );
}

export function ElderHero() {
  const { hero } = copy;
  return (
    <section className="bg-sand/50 py-14 md:py-20">
      <div className={`${container} grid items-center gap-10 lg:grid-cols-2 lg:gap-14`}>
        <div>
          <span className="inline-block rounded-full border border-primary-brown/20 bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary-brown">
            {hero.eyebrow}
          </span>
          <h1 className="mt-6 text-4xl leading-[1.1] text-primary-brown md:text-5xl lg:text-[3.4rem]">
            {hero.titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
            <DonateButton className={greenButton}>{hero.primaryCta}</DonateButton>
            <a href="#what-we-do" className="font-semibold text-primary-brown underline underline-offset-4 hover:text-primary-green-deep">
              {hero.secondaryCta}
            </a>
          </div>
          <p className="mt-5 text-sm text-muted">{hero.note}</p>
        </div>
        <div className="relative aspect-[4/3] max-h-[34rem] w-full overflow-hidden rounded-3xl shadow-lg lg:aspect-[4/5]">
          <Image src={hero.image} alt={hero.imageAlt} fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover object-[center_75%]" />
        </div>
      </div>
    </section>
  );
}

export function ElderProblem() {
  const { problem } = copy;
  return (
    <section className="bg-primary-brown py-16 text-ivory md:py-24">
      <div className={container}>
        <p className="text-xs font-bold uppercase tracking-widest text-ivory/75">{problem.eyebrow}</p>
        <h2 className="mt-3 max-w-2xl font-serif text-3xl leading-tight text-white md:text-4xl">{problem.title}</h2>
        <ul className="mt-10 grid gap-4 sm:grid-cols-3">
          {problem.stats.map((stat) => (
            <li key={stat.value} className="rounded-2xl bg-white/10 p-6">
              <p className="font-serif text-4xl text-white md:text-5xl">{stat.value}</p>
              <p className="mt-3 text-sm leading-relaxed text-ivory/85">{stat.label}</p>
            </li>
          ))}
        </ul>
        <p className="mt-10 max-w-2xl leading-relaxed text-ivory/90">{problem.text}</p>
        <p className="mt-6 text-xs text-ivory/70">{problem.source}</p>
      </div>
    </section>
  );
}

export function ElderWhatWeDo() {
  const { whatWeDo } = copy;
  return (
    <section id="what-we-do" className="bg-white py-16 md:py-24">
      <div className={`${container} grid items-center gap-10 lg:grid-cols-2 lg:gap-14`}>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl">
          <Image src={whatWeDo.image} alt={whatWeDo.imageAlt} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
        </div>
        <div>
          <p className={eyebrowLight}>{whatWeDo.eyebrow}</p>
          <h2 className={`mt-3 ${headingLight}`}>{whatWeDo.title}</h2>
          {whatWeDo.paragraphs.map((p) => (
            <p key={p} className="mt-4 leading-relaxed text-charcoal/80">
              {p}
            </p>
          ))}
          <ul className="mt-6 flex flex-wrap gap-2">
            {whatWeDo.steps.map((step, i) => (
              <li
                key={step}
                className={
                  i === 0
                    ? "rounded-full bg-primary-green/15 px-3 py-1.5 text-xs font-semibold text-primary-green-deep"
                    : "rounded-full bg-sand px-3 py-1.5 text-xs font-semibold text-primary-brown"
                }
              >
                {step}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

const REASON_ICONS = { heart: Heart, home: House, message: MessageCircle } as const;

export function ElderWhyElders() {
  const { whyElders } = copy;
  return (
    <section className="bg-sand/50 py-16 md:py-24">
      <div className={container}>
        <p className={eyebrowLight}>{whyElders.eyebrow}</p>
        <h2 className={`mt-3 ${headingLight}`}>{whyElders.title}</h2>
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {whyElders.reasons.map((reason) => {
            const Icon = REASON_ICONS[reason.icon as keyof typeof REASON_ICONS];
            return (
              <li key={reason.title} className="rounded-2xl bg-white p-6">
                <Icon className="h-6 w-6 text-primary-green" aria-hidden="true" />
                <h3 className="mt-4 font-serif text-xl text-primary-brown">{reason.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal/80">{reason.text}</p>
              </li>
            );
          })}
        </ul>
        <p className="mt-10 max-w-2xl font-serif text-2xl leading-snug text-primary-brown">{whyElders.closing}</p>
      </div>
    </section>
  );
}

export function ElderFaces() {
  const { faces } = copy;
  return (
    <section className="bg-white py-16 md:py-24">
      <div className={container}>
        <p className={eyebrowLight}>{faces.eyebrow}</p>
        <h2 className={`mt-3 max-w-2xl ${headingLight}`}>{faces.title}</h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-charcoal/80">{faces.description}</p>
        <ul className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {faces.people.map((person) => (
            <li key={person.name} className="overflow-hidden rounded-2xl border border-sand">
              <div className="relative aspect-[4/3] bg-sand">
                <Image
                  src={person.src}
                  alt={`${person.name}, ${person.age}`}
                  fill
                  sizes="(min-width: 1024px) 22vw, 45vw"
                  className="object-cover object-top"
                />
              </div>
              <div className="p-4">
                <p className="font-bold leading-snug text-charcoal">
                  {person.name}, {person.age}
                </p>
                <p className="mt-1 text-xs text-muted">{faces.label}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function ElderDonate() {
  const { donate } = copy;
  return (
    <section className="bg-primary-green/10 py-16 md:py-24">
      <div className={`${container} grid items-start gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-14`}>
        <div className="lg:sticky lg:top-28">
          <p className={eyebrowLight}>{donate.eyebrow}</p>
          <h2 className={`mt-3 ${headingLight}`}>{donate.title}</h2>
          <p className="mt-4 leading-relaxed text-charcoal/80">{donate.description}</p>
          <ul className="mt-6 space-y-2">
            {donate.checklist.map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-primary-green-deep">
                <Check className="h-4 w-4 shrink-0" aria-hidden="true" /> {item}
              </li>
            ))}
          </ul>
        </div>
        <DonationCard />
      </div>
    </section>
  );
}

export function ElderSponsor() {
  const { sponsor } = copy;
  return (
    <section className="bg-white py-16 md:py-24">
      <div className={container}>
        <p className={eyebrowLight}>{sponsor.eyebrow}</p>
        <h2 className={`mt-3 max-w-2xl ${headingLight}`}>{sponsor.title}</h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-charcoal/80">{sponsor.description}</p>
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {sponsor.options.map((option) => (
            <li
              key={option.label}
              className={
                option.featured
                  ? "rounded-2xl border-2 border-primary-green bg-primary-green/5 p-6"
                  : "rounded-2xl border border-sand p-6"
              }
            >
              <p className="text-xs font-bold uppercase tracking-widest text-primary-green-deep">{option.label}</p>
              <p className="mt-3 font-serif text-3xl text-primary-brown">{formatINR(option.amount)}</p>
              <p className="mt-1 text-sm text-charcoal/80">{mealsFor(option.amount).toLocaleString("en-IN")} meals</p>
              <DonateButton
                amount={option.amount}
                className={
                  option.featured
                    ? `${greenButton} mt-5 px-5 py-2.5 text-sm`
                    : "mt-5 inline-flex rounded-full border-2 border-primary-green px-5 py-2 text-sm font-bold text-primary-green-deep transition-colors hover:bg-primary-green hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-green focus-visible:ring-offset-2"
                }
              >
                {option.cta}
              </DonateButton>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-charcoal/80">
          {sponsor.largeGiftNote}{" "}
          <Link href="/contact" className="font-semibold text-primary-green-deep underline underline-offset-4">
            talk to us directly
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

export function ElderFaq() {
  return (
    <section className="bg-sand/50 py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className={headingLight}>Questions donors ask</h2>
        <div className="mt-8 space-y-3">
          {copy.faq.map((item) => (
            <div key={item.question} className="rounded-2xl bg-white p-5 md:p-6">
              <h3 className="font-sans text-base font-bold text-charcoal">{item.question}</h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal/80">
                {item.answer}{" "}
                {item.link && (
                  <Link href={item.link.href} className="font-semibold text-primary-green-deep underline underline-offset-4">
                    {item.link.label}
                  </Link>
                )}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ElderFinalCta() {
  const { finalCta } = copy;
  return (
    <section className="bg-primary-brown py-16 text-center md:py-20 print:hidden">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h2 className="font-serif text-3xl leading-tight text-white md:text-4xl">{finalCta.title}</h2>
        <DonateButton
          amount={50}
          className="mt-8 inline-flex rounded-full bg-white px-7 py-3.5 font-bold text-primary-brown transition-colors hover:bg-ivory focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary-brown"
        >
          {finalCta.button}
        </DonateButton>
      </div>
    </section>
  );
}

export function ElderFooter() {
  const linkClass = "underline underline-offset-4 hover:text-white";
  return (
    <footer className="bg-primary-brown-deep py-10 text-sm text-ivory/85 print:hidden">
      <div className={`${container} grid gap-6 md:grid-cols-3`}>
        <div>
          <p className="font-serif text-lg text-white">{siteConfig.name}</p>
          <p className="mt-2">Section 8 company</p>
          <p className="whitespace-nowrap">CIN {siteConfig.cin}</p>
          <p>Amravati, Maharashtra · Working across Vidarbha</p>
        </div>
        <div className="space-y-1">
          <p>
            <a href={siteConfig.contact.phoneHref} className="hover:text-white">
              {siteConfig.contact.phone}
            </a>
          </p>
          <p>
            <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-white">
              <EmailText email={siteConfig.contact.email} />
            </a>
          </p>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2 md:content-start">
          <Link href="/privacy-policy" className={linkClass}>Privacy policy</Link>
          <Link href="/donation-policy" className={linkClass}>Donation policy</Link>
          <Link href="/transparency" className={linkClass}>Transparency</Link>
          {siteConfig.social.map((profile) => (
            <a key={profile.name} href={profile.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
              {profile.name}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
