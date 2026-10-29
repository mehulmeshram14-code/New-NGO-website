"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Message delivery failed");

      setSuccess(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error sending message");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-24 bg-cream-light border-t border-forest/10 relative" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-earth">
            <span className="w-8 h-[2px] bg-terracotta"></span>
            <span>Direct Communication</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl text-forest tracking-tight leading-tight">
            Connect With Our Ground Office
          </h2>

          <p className="text-base sm:text-lg text-charcoal/80 leading-relaxed font-sans">
            Have questions about our initiatives, wish to visit our ground centers in Amravati or Melghat, or need documentation? We are here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Official Contact Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-forest/15 shadow-sm space-y-6">
              <h3 className="font-serif text-2xl text-forest font-bold">
                Registered Information
              </h3>

              <div className="space-y-4 text-xs sm:text-sm text-charcoal/85">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-forest block">Headquarters Office:</strong>
                    <span>24/1/23, Gauri Shankar Nagar, Rukhmini Nagar, Amravati - 444606, Maharashtra</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-forest block">Official Email:</strong>
                    <a href="mailto:deeprootsfoundation2026@gmail.com" className="text-forest hover:underline">
                      deeprootsfoundation2026@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-terracotta flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-forest block">Telephone:</strong>
                    <span>+91 76202 90895</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-forest/10 space-y-2">
                <span className="text-[11px] font-bold text-forest uppercase tracking-wider block">
                  Ground Coordinators Available
                </span>
                <p className="text-xs text-charcoal-muted leading-relaxed">
                  Monday to Saturday: 9:30 AM to 6:30 PM IST. Weekend field visits organized by prior coordination.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-forest/15 shadow-editorial">
            {success ? (
              <div className="text-center py-10 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-forest mx-auto" />
                <h4 className="font-serif text-2xl text-forest font-bold">Message Delivered</h4>
                <p className="text-sm text-charcoal/80 max-w-md mx-auto">
                  Thank you for reaching out to DeepRoots Foundation. Our team will review your query and reply within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="mt-4 text-xs font-bold text-terracotta uppercase tracking-wider underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-charcoal block mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-forest/20 text-xs sm:text-sm bg-cream-light/50 focus:outline-none focus:ring-2 focus:ring-forest"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-charcoal block mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-forest/20 text-xs sm:text-sm bg-cream-light/50 focus:outline-none focus:ring-2 focus:ring-forest"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-charcoal block mb-1">Subject</label>
                  <input
                    type="text"
                    placeholder="Subject of inquiry (e.g. Field Visit, Donation Query)"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-forest/20 text-xs sm:text-sm bg-cream-light/50 focus:outline-none focus:ring-2 focus:ring-forest"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-charcoal block mb-1">Message *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Write your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-forest/20 text-xs sm:text-sm bg-cream-light/50 focus:outline-none focus:ring-2 focus:ring-forest"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-full bg-forest hover:bg-forest-dark text-white font-semibold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Send Message to DeepRoots</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
