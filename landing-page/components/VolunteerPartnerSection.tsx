"use client";

import React, { useState } from "react";
import { HandHeart, Building2, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function VolunteerPartnerSection() {
  const [activeTab, setActiveTab] = useState<"volunteer" | "partner">("volunteer");

  // Volunteer State
  const [volName, setVolName] = useState("");
  const [volEmail, setVolEmail] = useState("");
  const [volPhone, setVolPhone] = useState("");
  const [volCity, setVolCity] = useState("");
  const [volInterest, setVolInterest] = useState("");
  const [volAvailability, setVolAvailability] = useState("Weekends");
  const [volMessage, setVolMessage] = useState("");
  const [volSubmitting, setVolSubmitting] = useState(false);
  const [volSuccess, setVolSuccess] = useState(false);
  const [volError, setVolError] = useState("");

  // Partner State
  const [prtOrg, setPrtOrg] = useState("");
  const [prtContact, setPrtContact] = useState("");
  const [prtEmail, setPrtEmail] = useState("");
  const [prtPhone, setPrtPhone] = useState("");
  const [prtType, setPrtType] = useState("");
  const [prtMessage, setPrtMessage] = useState("");
  const [prtSubmitting, setPrtSubmitting] = useState(false);
  const [prtSuccess, setPrtSuccess] = useState(false);
  const [prtError, setPrtError] = useState("");

  const handleVolunteerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setVolError("");
    setVolSubmitting(true);

    try {
      const res = await fetch("/api/volunteer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: volName,
          email: volEmail,
          phone: volPhone,
          city: volCity,
          interest: volInterest || "General Volunteer",
          availability: volAvailability,
          message: volMessage,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");

      setVolSuccess(true);
      setVolName("");
      setVolEmail("");
      setVolPhone("");
      setVolCity("");
      setVolMessage("");
    } catch (err: unknown) {
      setVolError(err instanceof Error ? err.message : "Error submitting application");
    } finally {
      setVolSubmitting(false);
    }
  };

  const handlePartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPrtError("");
    setPrtSubmitting(true);

    try {
      const res = await fetch("/api/partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationName: prtOrg,
          contactName: prtContact,
          email: prtEmail,
          phone: prtPhone,
          partnershipType: prtType || "General CSR Collaboration",
          message: prtMessage,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");

      setPrtSuccess(true);
      setPrtOrg("");
      setPrtContact("");
      setPrtEmail("");
      setPrtPhone("");
      setPrtMessage("");
    } catch (err: unknown) {
      setPrtError(err instanceof Error ? err.message : "Error submitting proposal");
    } finally {
      setPrtSubmitting(false);
    }
  };

  return (
    <section className="py-24 bg-cream relative" id="get-involved">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-earth">
            <span className="w-8 h-[2px] bg-terracotta"></span>
            <span>Participate Beyond Donations</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl text-forest tracking-tight leading-tight">
            “Be part of something that takes root.”
          </h2>

          <p className="text-base sm:text-lg text-charcoal/80 leading-relaxed font-sans">
            Whether through personal time and mentorship or institutional CSR partnerships, your presence amplifies long-term change across Vidarbha.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-forest/20 gap-4" role="tablist">
          <button
            type="button"
            onClick={() => setActiveTab("volunteer")}
            className={`pb-3 font-serif text-lg sm:text-xl font-bold flex items-center gap-2 transition-all border-b-2 -mb-[2px] ${
              activeTab === "volunteer"
                ? "border-forest text-forest"
                : "border-transparent text-charcoal-muted hover:text-charcoal"
            }`}
          >
            <HandHeart className="w-5 h-5 text-terracotta" />
            <span>Become a Volunteer</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("partner")}
            className={`pb-3 font-serif text-lg sm:text-xl font-bold flex items-center gap-2 transition-all border-b-2 -mb-[2px] ${
              activeTab === "partner"
                ? "border-forest text-forest"
                : "border-transparent text-charcoal-muted hover:text-charcoal"
            }`}
          >
            <Building2 className="w-5 h-5 text-forest" />
            <span>Partner With Us (CSR)</span>
          </button>
        </div>

        {/* Tab Content 1: Volunteer */}
        {activeTab === "volunteer" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 space-y-4">
              <h3 className="font-serif text-2xl text-forest font-bold">
                Lend Your Hands, Voice &amp; Heart
              </h3>
              <p className="text-sm text-charcoal/85 leading-relaxed font-sans">
                Our volunteer family consists of college students, teachers, working professionals, and retired citizens across Amravati and surrounding regions.
              </p>

              <div className="space-y-3 pt-2 text-xs text-charcoal/80">
                <div className="p-3 bg-white rounded-xl border border-forest/10 flex items-start gap-2.5">
                  <span className="text-base">🍲</span>
                  <div>
                    <strong className="text-forest block">Food Preparation &amp; Distribution</strong>
                    <span>Assist morning cooking, packaging, and dignified distribution in hamlets.</span>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-forest/10 flex items-start gap-2.5">
                  <span className="text-base">📚</span>
                  <div>
                    <strong className="text-forest block">Remedial Education Mentorship</strong>
                    <span>Tutor children in reading, arithmetic, and creative arts on weekends.</span>
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-forest/10 flex items-start gap-2.5">
                  <span className="text-base">💻</span>
                  <div>
                    <strong className="text-forest block">Digital &amp; Creative Skills</strong>
                    <span>Help tell community stories, maintain records, and manage awareness campaigns.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-forest/15 shadow-editorial">
              {volSuccess ? (
                <div className="text-center py-10 space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-forest mx-auto" />
                  <h4 className="font-serif text-2xl text-forest font-bold">Application Received!</h4>
                  <p className="text-sm text-charcoal/80 max-w-md mx-auto">
                    Thank you for stepping forward. Our volunteer coordinator in Amravati will connect with you via email or phone within 48 hours.
                  </p>
                  <button
                    type="button"
                    onClick={() => setVolSuccess(false)}
                    className="mt-4 text-xs font-bold text-terracotta uppercase tracking-wider underline"
                  >
                    Submit another application
                  </button>
                </div>
              ) : (
                <form onSubmit={handleVolunteerSubmit} className="space-y-4">
                  {volError && (
                    <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      <span>{volError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-charcoal block mb-1">Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Your name"
                        value={volName}
                        onChange={(e) => setVolName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-forest/20 text-xs sm:text-sm bg-cream-light/50 focus:outline-none focus:ring-2 focus:ring-forest"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-charcoal block mb-1">Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="email@example.com"
                        value={volEmail}
                        onChange={(e) => setVolEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-forest/20 text-xs sm:text-sm bg-cream-light/50 focus:outline-none focus:ring-2 focus:ring-forest"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-charcoal block mb-1">Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="10-digit number"
                        value={volPhone}
                        onChange={(e) => setVolPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-forest/20 text-xs sm:text-sm bg-cream-light/50 focus:outline-none focus:ring-2 focus:ring-forest"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-charcoal block mb-1">City / Region in Maharashtra *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Amravati, Nagpur, Pune"
                        value={volCity}
                        onChange={(e) => setVolCity(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-forest/20 text-xs sm:text-sm bg-cream-light/50 focus:outline-none focus:ring-2 focus:ring-forest"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-charcoal block mb-1">Area of Contribution *</label>
                      <select
                        value={volInterest}
                        onChange={(e) => setVolInterest(e.target.value)}
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl border border-forest/20 text-xs sm:text-sm bg-cream-light/50 focus:outline-none focus:ring-2 focus:ring-forest"
                      >
                        <option value="">Select your skill / interest</option>
                        <option value="Food Preparation & Distribution">Food Preparation &amp; Distribution</option>
                        <option value="Child Education & Mentoring">Child Education &amp; Mentoring</option>
                        <option value="Health & Nutrition Camps">Health &amp; Nutrition Camps</option>
                        <option value="Content & Social Awareness">Content &amp; Social Awareness</option>
                        <option value="Melghat Field Drives">Melghat Field Drives</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-xs font-bold text-charcoal block mb-1">Availability</label>
                      <select
                        value={volAvailability}
                        onChange={(e) => setVolAvailability(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-forest/20 text-xs sm:text-sm bg-cream-light/50 focus:outline-none focus:ring-2 focus:ring-forest"
                      >
                        <option value="Weekends">Weekends only</option>
                        <option value="Weekdays">Weekdays</option>
                        <option value="Monthly Drives">Monthly drives</option>
                        <option value="Remote / Digital">Remote / Digital only</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-charcoal block mb-1">Short Note / Message</label>
                    <textarea
                      rows={3}
                      placeholder="Tell us what motivates you to work with DeepRoots..."
                      value={volMessage}
                      onChange={(e) => setVolMessage(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-forest/20 text-xs sm:text-sm bg-cream-light/50 focus:outline-none focus:ring-2 focus:ring-forest"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={volSubmitting}
                    className="w-full py-3.5 rounded-full bg-forest hover:bg-forest-dark text-white font-semibold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    {volSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting Application...</span>
                      </>
                    ) : (
                      <span>Submit Volunteer Application</span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Tab Content 2: Partner / CSR */}
        {activeTab === "partner" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 space-y-4">
              <h3 className="font-serif text-2xl text-forest font-bold">
                Institutional &amp; CSR Collaboration
              </h3>
              <p className="text-sm text-charcoal/85 leading-relaxed font-sans">
                DeepRoots Foundation partners with corporates, philanthropic trusts, and educational institutions committed to accountable, sustainable hunger eradication in rural Vidarbha.
              </p>

              <div className="p-4 bg-white rounded-2xl border border-forest/15 shadow-sm space-y-2 text-xs text-charcoal/80">
                <span className="text-[10px] uppercase font-bold text-earth tracking-wider block">
                  Why Partner With DeepRoots?
                </span>
                <ul className="space-y-1.5 list-disc pl-4 font-sans">
                  <li>Section 8 Non-profit compliance and complete audit integrity</li>
                  <li>Direct community immersion without multi-tier brokerages</li>
                  <li>Quarterly photo documentation and impact monitoring</li>
                  <li>Customized nutrition drives tailored to CSR mandates</li>
                </ul>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-forest/15 shadow-editorial">
              {prtSuccess ? (
                <div className="text-center py-10 space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-forest mx-auto" />
                  <h4 className="font-serif text-2xl text-forest font-bold">Proposal Received!</h4>
                  <p className="text-sm text-charcoal/80 max-w-md mx-auto">
                    Thank you for your interest in partnering. Our CSR liaison officer will review your inquiry and schedule an introductory discussion.
                  </p>
                  <button
                    type="button"
                    onClick={() => setPrtSuccess(false)}
                    className="mt-4 text-xs font-bold text-forest uppercase tracking-wider underline"
                  >
                    Submit another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePartnerSubmit} className="space-y-4">
                  {prtError && (
                    <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      <span>{prtError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-charcoal block mb-1">Company / Foundation Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="Organisation Name"
                        value={prtOrg}
                        onChange={(e) => setPrtOrg(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-forest/20 text-xs sm:text-sm bg-cream-light/50 focus:outline-none focus:ring-2 focus:ring-forest"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-charcoal block mb-1">Contact Person *</label>
                      <input
                        type="text"
                        required
                        placeholder="Representative full name"
                        value={prtContact}
                        onChange={(e) => setPrtContact(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-forest/20 text-xs sm:text-sm bg-cream-light/50 focus:outline-none focus:ring-2 focus:ring-forest"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-charcoal block mb-1">Corporate Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="contact@company.com"
                        value={prtEmail}
                        onChange={(e) => setPrtEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-forest/20 text-xs sm:text-sm bg-cream-light/50 focus:outline-none focus:ring-2 focus:ring-forest"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-charcoal block mb-1">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="Contact number"
                        value={prtPhone}
                        onChange={(e) => setPrtPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-forest/20 text-xs sm:text-sm bg-cream-light/50 focus:outline-none focus:ring-2 focus:ring-forest"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-charcoal block mb-1">Partnership Focus *</label>
                    <select
                      value={prtType}
                      onChange={(e) => setPrtType(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl border border-forest/20 text-xs sm:text-sm bg-cream-light/50 focus:outline-none focus:ring-2 focus:ring-forest"
                    >
                      <option value="">Select scope</option>
                      <option value="CSR Child Nutrition Program (Melghat)">CSR Child Nutrition Program (Melghat)</option>
                      <option value="Women SHG Livelihood Grant">Women’s SHG Livelihood Grant</option>
                      <option value="Food Grain & Kitchen Infrastructure Support">Food Grain &amp; Kitchen Infrastructure Support</option>
                      <option value="Employee Giving / Matching Drive">Employee Giving / Matching Drive</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-charcoal block mb-1">Proposal Brief</label>
                    <textarea
                      rows={3}
                      placeholder="Outline your company's CSR priorities or partnership goals..."
                      value={prtMessage}
                      onChange={(e) => setPrtMessage(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-forest/20 text-xs sm:text-sm bg-cream-light/50 focus:outline-none focus:ring-2 focus:ring-forest"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={prtSubmitting}
                    className="w-full py-3.5 rounded-full bg-forest hover:bg-forest-dark text-white font-semibold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    {prtSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Sending Inquiry...</span>
                      </>
                    ) : (
                      <span>Send Partnership Inquiry</span>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
