"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import { CONTACT_SUBJECTS } from "@/data/contactForm";
import { siteConfig } from "@/data/siteConfig";
import { cn } from "@/components/ui/Button";

type Status = "idle" | "sending" | "sent" | "error";

const EMPTY = { name: "", email: "", subject: "", message: "", website: "" };

const fieldClass =
  "w-full rounded-xl border border-sand bg-ivory px-4 py-3 text-charcoal placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-primary-green focus:border-transparent transition";
const labelClass = "block text-sm font-bold text-charcoal mb-2";

export function ContactForm() {
  const [values, setValues] = useState(EMPTY);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [errorField, setErrorField] = useState<string | undefined>();

  const update =
    (key: keyof typeof EMPTY) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setValues((v) => ({ ...v, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    setError("");
    setErrorField(undefined);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        setError(data.error || "Something went wrong. Please try again.");
        setErrorField(data.field);
        setStatus("error");
        return;
      }
      setValues(EMPTY);
      setStatus("sent");
    } catch {
      setError("Network error. Please check your connection and try again.");
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div role="status" className="bg-white rounded-3xl shadow-md border border-primary-green/10 p-8 md:p-10 text-center">
        <span className="mx-auto w-14 h-14 rounded-full bg-primary-green/10 text-primary-green flex items-center justify-center">
          <CheckCircle2 className="w-7 h-7" />
        </span>
        <h3 className="mt-5 text-2xl text-primary-green">Thank you for reaching out</h3>
        <p className="mt-3 text-muted">
          Your message has been sent. We usually reply within 24–48 business hours.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-6 inline-flex items-center justify-center rounded-full border-2 border-primary-green px-6 py-3 font-bold text-primary-green hover:bg-primary-green hover:text-white transition-colors"
        >
          Send another message
        </button>
      </div>
    );
  }

  const invalid = (field: string) => status === "error" && errorField === field;
  const isSending = status === "sending";

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl shadow-md border border-primary-green/10 p-6 md:p-10 space-y-5"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="contact-name" className={labelClass}>
            Full name
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            autoComplete="name"
            required
            minLength={2}
            maxLength={100}
            value={values.name}
            onChange={update("name")}
            aria-invalid={invalid("name") || undefined}
            className={cn(fieldClass, invalid("name") && "ring-2 ring-red-400")}
          />
        </div>
        <div>
          <label htmlFor="contact-email" className={labelClass}>
            Email address
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={150}
            value={values.email}
            onChange={update("email")}
            aria-invalid={invalid("email") || undefined}
            className={cn(fieldClass, invalid("email") && "ring-2 ring-red-400")}
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-subject" className={labelClass}>
          Subject
        </label>
        <select
          id="contact-subject"
          name="subject"
          required
          value={values.subject}
          onChange={update("subject")}
          aria-invalid={invalid("subject") || undefined}
          className={cn(fieldClass, "appearance-none", !values.subject && "text-muted/70", invalid("subject") && "ring-2 ring-red-400")}
        >
          <option value="" disabled>
            Choose a subject
          </option>
          {CONTACT_SUBJECTS.map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="contact-message" className={labelClass}>
          Your message
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          minLength={10}
          maxLength={2000}
          rows={6}
          value={values.message}
          onChange={update("message")}
          aria-invalid={invalid("message") || undefined}
          className={cn(fieldClass, "resize-y", invalid("message") && "ring-2 ring-red-400")}
        />
      </div>

      {/* Honeypot: invisible to people and screen readers; bots tend to fill every field. */}
      <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={values.website} onChange={update("website")} />
      </div>

      {status === "error" && (
        <p role="alert" className="flex items-start gap-2 rounded-2xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>
            {error}{" "}
            {!errorField && (
              <>
                You can also write to{" "}
                <a href={`mailto:${siteConfig.contact.email}`} className="underline font-semibold">
                  {siteConfig.contact.email}
                </a>
                .
              </>
            )}
          </span>
        </p>
      )}

      <button
        type="submit"
        disabled={isSending}
        className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary-green px-8 py-4 text-lg font-bold text-white hover:bg-primary-brown transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary-green focus:ring-offset-2 disabled:opacity-60 disabled:pointer-events-none"
      >
        {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
        {isSending ? "Sending…" : "Send message"}
      </button>

      <p className="text-xs text-muted text-center">
        By sending this form you agree to our{" "}
        <Link href="/privacy-policy" className="underline">
          privacy policy
        </Link>
        .
      </p>
    </form>
  );
}
