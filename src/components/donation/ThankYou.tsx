"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import confetti from "canvas-confetti";
import { ArrowLeft, Check, CircleCheck, Clock, House, Link2, MessageCircle, Printer, Share2 } from "lucide-react";
import { cn } from "@/components/ui/Button";
import { EmailText } from "@/components/ui/EmailText";
import { loadReceipt, type DonationReceipt } from "@/lib/donationReceipt";
import { amountInWords } from "@/lib/amountInWords";
import { getCampaign } from "@/data/campaigns";
import { formatINR } from "@/data/donation";
import { siteConfig } from "@/data/siteConfig";

const CONFETTI_COLORS = ["#597349", "#E89230", "#4A311D", "#EDE4D5"];

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Asia/Kolkata",
  });

/** Celebrate once per donation, not on every refresh. */
function celebrateOnce(reference: string) {
  const key = `deeproots:celebrated:${reference}`;
  try {
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
  } catch {
    // ignore
  }
  try {
    confetti({ particleCount: 90, spread: 80, origin: { y: 0.3 }, colors: CONFETTI_COLORS, disableForReducedMotion: true });
  } catch {
    // purely decorative
  }
}

// The receipt lives in sessionStorage, which only exists in the browser. useSyncExternalStore
// renders a placeholder on the server and reads storage on the client without a mismatch.
const noSubscribe = () => () => {};
const isClient = () => true;
const isServer = () => false;

export function ThankYou() {
  const hydrated = useSyncExternalStore(noSubscribe, isClient, isServer);
  // undefined = not in the browser yet; null = no receipt in this tab.
  const receipt = useMemo<DonationReceipt | null | undefined>(() => (hydrated ? loadReceipt() : undefined), [hydrated]);

  useEffect(() => {
    if (receipt?.status === "confirmed") celebrateOnce(receipt.reference);
  }, [receipt]);

  if (receipt === undefined) {
    return <div className="mx-auto h-96 max-w-2xl animate-pulse rounded-3xl bg-white/60" aria-hidden="true" />;
  }

  const campaign = getCampaign(receipt?.campaignId);
  const firstName = receipt?.donorName.trim().split(/\s+/)[0];

  return (
    <article className="mx-auto max-w-2xl overflow-hidden rounded-3xl border border-primary-green/10 bg-white shadow-lg print:max-w-none print:rounded-none print:border-0 print:shadow-none">
      {/* Header */}
      <header className="bg-primary-green-deep px-6 py-10 text-center md:px-10 print:hidden">
        <span className="mx-auto inline-flex rounded-2xl bg-white p-2 shadow-md">
          <Image src="/logo.png" alt="DeepRoots Foundation" width={72} height={72} className="h-16 w-16 object-contain" />
        </span>
        <h1 className="mt-5 text-4xl leading-tight text-white md:text-5xl">
          {firstName ? `Thank you, ${firstName}!` : "Thank you for caring!"}
        </h1>
        <p className="mx-auto mt-3 max-w-md text-lg text-ivory/85">
          {receipt ? (
            <>
              Your gift of <strong className="text-accent-gold-light">{formatINR(receipt.amount)}</strong> will serve{" "}
              {campaign.impact(receipt.amount)}.
            </>
          ) : (
            "Every gift becomes a warm, freshly cooked meal for someone who would otherwise go without."
          )}
        </p>
      </header>

      <div className="space-y-6 p-5 md:p-8">
        {receipt ? <Receipt receipt={receipt} /> : <NoReceipt />}

        {/* What the gift does */}
        <ul className="grid gap-3 sm:grid-cols-3 print:hidden">
          {campaign.highlights.map((h) => (
            <li key={h.title} className="rounded-2xl border border-sand bg-ivory p-4 text-center">
              <p className="font-bold text-charcoal">{h.title}</p>
              <p className="mt-1 text-xs text-muted">{h.text}</p>
            </li>
          ))}
        </ul>

        <ShareBox text={campaign.shareText} path={campaign.path} />

        <div className="flex flex-col gap-3 sm:flex-row print:hidden">
          <Link
            href={campaign.path}
            className="flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-primary-green px-5 py-3 font-bold text-primary-green transition-colors hover:bg-primary-green hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" /> Back to {campaign.id === "general" ? "donations" : "the campaign"}
          </Link>
          <Link
            href="/"
            className="flex flex-1 items-center justify-center gap-2 rounded-full border-2 border-sand px-5 py-3 font-bold text-charcoal transition-colors hover:border-primary-green hover:text-primary-green"
          >
            <House className="h-4 w-4" /> Homepage
          </Link>
        </div>

        <p className="border-t border-sand pt-5 text-center text-sm text-muted print:hidden">
          Questions about your donation? Call{" "}
          <a href={siteConfig.contact.phoneHref} className="font-semibold text-primary-green hover:underline">
            {siteConfig.contact.phone}
          </a>{" "}
          or email{" "}
          <a href={`mailto:${siteConfig.contact.email}`} className="font-semibold text-primary-green hover:underline">
            <EmailText email={siteConfig.contact.email} />
          </a>
          .
        </p>
      </div>
    </article>
  );
}

function Receipt({ receipt }: { receipt: DonationReceipt }) {
  const campaign = getCampaign(receipt.campaignId);
  const confirmed = receipt.status === "confirmed";

  const rows: [string, React.ReactNode][] = [
    ["Receipt no.", <span key="ref" className="font-mono">{receipt.reference}</span>],
    ["Date", formatDate(receipt.date)],
    ["Donor name", receipt.donorName],
    ["Cause", campaign.cause],
    ["Amount", <strong key="amt" className="text-lg text-charcoal">{formatINR(receipt.amount)}</strong>],
    ["Amount in words", amountInWords(receipt.amount)],
    ["Payment mode", "Online · Razorpay (UPI / card / net banking)"],
    ["Payment ID", <span key="pid" className="font-mono">{receipt.paymentId}</span>],
    ...(receipt.orderId ? ([["Order ID", <span key="oid" className="font-mono">{receipt.orderId}</span>]] as [string, React.ReactNode][]) : []),
    ["Status", confirmed ? "Received" : "Awaiting bank confirmation"],
  ];

  return (
    <>
      {/* Payment status */}
      <div
        role="status"
        className={cn(
          "flex items-start gap-3 rounded-2xl border p-4 print:hidden",
          confirmed ? "border-primary-green/30 bg-primary-green/10" : "border-accent-gold/40 bg-accent-gold/10"
        )}
      >
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white",
            confirmed ? "bg-primary-green" : "bg-accent-gold-deep"
          )}
        >
          {confirmed ? <CircleCheck className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
        </span>
        <div>
          <p className={cn("font-bold", confirmed ? "text-primary-green" : "text-primary-brown")}>
            {confirmed ? "Payment confirmed" : "We're confirming your payment"}
          </p>
          <p className="text-sm text-charcoal/80">
            {confirmed
              ? "Your donation has been received. Your receipt is below."
              : receipt.message ||
                "Your bank has authorised the payment. Confirmation usually takes a few minutes; you don't need to pay again."}
          </p>
        </div>
      </div>

      {/* Printable receipt */}
      <section aria-labelledby="receipt-title" className="rounded-2xl border border-sand print:border-charcoal/30">
        <div className="flex flex-col gap-3 border-b border-sand bg-ivory px-5 py-4 sm:flex-row sm:items-start sm:justify-between print:bg-white">
          <div>
            <p className="font-serif text-xl text-primary-green">{siteConfig.name}</p>
            <p className="text-xs text-muted">{siteConfig.contact.address}, Maharashtra</p>
            <p className="text-xs text-muted">Section 8 company · CIN {siteConfig.cin}</p>
          </div>
          <div className="sm:text-right">
            <h2 id="receipt-title" className="font-sans text-sm font-bold uppercase tracking-widest text-accent-gold-deep">
              Donation receipt
            </h2>
            <p className="text-xs text-muted">{formatDate(receipt.date)}</p>
          </div>
        </div>

        <dl className="divide-y divide-sand px-5">
          {rows.map(([label, value]) => (
            <div key={label} className="grid grid-cols-[8.5rem_1fr] gap-3 py-2.5 text-sm sm:grid-cols-[10rem_1fr]">
              <dt className="text-muted">{label}</dt>
              <dd className="min-w-0 break-words text-right font-semibold text-charcoal sm:text-left">{value}</dd>
            </div>
          ))}
        </dl>

        <p className="border-t border-sand bg-accent-gold/10 px-5 py-3 text-xs leading-relaxed text-primary-brown print:bg-white">
          <strong>About tax benefits:</strong> DeepRoots Foundation has applied for Section 80G approval. Until it is
          granted, this is an acknowledgement of your donation and cannot be used to claim an 80G deduction.
        </p>
      </section>

      <div className="flex flex-col items-center gap-2 print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-full bg-primary-green px-6 py-3 font-bold text-white transition-colors hover:bg-primary-green-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-green focus-visible:ring-offset-2"
        >
          <Printer className="h-4 w-4" /> Print or save as PDF
        </button>
        <p className="text-xs text-muted">Keep your receipt number for your records.</p>
      </div>
    </>
  );
}

function NoReceipt() {
  return (
    <div className="rounded-2xl border border-sand bg-ivory p-5 text-center">
      <p className="font-bold text-charcoal">Your receipt isn&rsquo;t available on this page</p>
      <p className="mt-1 text-sm text-muted">
        Receipts are shown right after a donation, in the same browser tab. If you&rsquo;ve donated and need a copy,
        contact us with your Razorpay payment ID and we&rsquo;ll send it to you.
      </p>
    </div>
  );
}

function ShareBox({ text, path }: { text: string; path: string }) {
  const [copied, setCopied] = useState(false);
  const hydrated = useSyncExternalStore(noSubscribe, isClient, isServer);
  // Absolute URL and Web Share support are only knowable in the browser.
  const url = hydrated ? new URL(path, window.location.origin).toString() : path;
  const canNativeShare = hydrated && typeof navigator.share === "function";

  const enc = encodeURIComponent;
  const links = [
    { name: "WhatsApp", href: `https://wa.me/?text=${enc(`${text} ${url}`)}`, icon: <MessageCircle className="h-4 w-4" /> },
    { name: "X", href: `https://twitter.com/intent/tweet?text=${enc(text)}&url=${enc(url)}`, icon: <span className="text-sm font-black">𝕏</span> },
    { name: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`, icon: <span className="text-sm font-black">f</span> },
    { name: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`, icon: <span className="text-xs font-black">in</span> },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: nothing else to do.
    }
  };

  const buttonClass =
    "inline-flex items-center gap-2 rounded-full border border-sand bg-white px-4 py-2 text-sm font-semibold text-charcoal transition-colors hover:border-primary-green hover:text-primary-green focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-green";

  return (
    <section aria-labelledby="share-title" className="rounded-2xl bg-sand/40 p-5 text-center print:hidden">
      <h2 id="share-title" className="flex items-center justify-center gap-2 font-sans text-base font-bold text-charcoal">
        <Share2 className="h-4 w-4 text-primary-green" /> Tell your friends
      </h2>
      <p className="mx-auto mt-1 max-w-md text-sm italic text-muted">&ldquo;{text}&rdquo;</p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {links.map((l) => (
          <a key={l.name} href={l.href} target="_blank" rel="noopener noreferrer" className={buttonClass}>
            <span aria-hidden="true" className="flex w-4 justify-center">{l.icon}</span>
            {l.name}
          </a>
        ))}
        <button type="button" onClick={copy} className={buttonClass}>
          {copied ? <Check className="h-4 w-4 text-primary-green" /> : <Link2 className="h-4 w-4" />}
          {copied ? "Copied" : "Copy link"}
        </button>
        {canNativeShare && (
          <button
            type="button"
            onClick={() => navigator.share({ text, url }).catch(() => undefined)}
            className={buttonClass}
          >
            <Share2 className="h-4 w-4" /> More
          </button>
        )}
      </div>
    </section>
  );
}
