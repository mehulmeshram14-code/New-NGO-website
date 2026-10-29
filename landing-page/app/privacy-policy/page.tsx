import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | DeepRoots Foundation",
  description: "Privacy policy and donor data protection commitment of DeepRoots Foundation.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="pt-32 pb-24 bg-cream min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-forest hover:text-terracotta transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-forest/15 shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold text-forest uppercase tracking-widest">
            <Shield className="w-4 h-4 text-forest" />
            <span>Transparency &amp; Data Protection</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl text-forest font-bold">
            Privacy Policy
          </h1>

          <div className="text-xs text-charcoal-muted border-b border-forest/10 pb-4">
            Last Updated: October 2026 · DeepRoots Foundation (Section 8 Non-Profit · CIN: U88900ME2026NPL476439)
          </div>

          <div className="prose prose-sm max-w-none text-charcoal/85 space-y-4 font-sans leading-relaxed">
            <h2 className="font-serif text-xl text-forest font-bold pt-2">1. Our Commitment to Privacy</h2>
            <p>
              DeepRoots Foundation (“we”, “our”, “us”) respects the privacy of our donors, volunteers, partners, and beneficiaries. We collect only the minimum necessary information required to process contributions, generate statutory receipts, and coordinate grassroots programmes.
            </p>

            <h2 className="font-serif text-xl text-forest font-bold pt-2">2. Information We Collect</h2>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
              <li><strong>Donor Information:</strong> Name, email address, optional contact number, and PAN number (strictly when requested by the donor for tax receipt generation).</li>
              <li><strong>Payment References:</strong> Bank transaction identifiers, UTR reference numbers, and payment gateway order IDs. <em>We never store credit/debit card numbers, CVVs, or UPI PINs.</em></li>
              <li><strong>Volunteer &amp; Partner Submissions:</strong> Contact person, organizational scope, and skills submitted willingly through our engagement forms.</li>
            </ul>

            <h2 className="font-serif text-xl text-forest font-bold pt-2">3. How Information Is Used</h2>
            <p>
              Your information is used strictly to issue donation acknowledgements, communicate field updates when opted in, and comply with statutory regulatory filings in India. We do not sell, rent, or trade donor records to commercial third parties under any circumstances.
            </p>

            <h2 className="font-serif text-xl text-forest font-bold pt-2">4. Beneficiary Protection &amp; Child Safety</h2>
            <p>
              In our field storytelling, DeepRoots Foundation upholds strict consent guidelines. We never depict beneficiaries, especially children or tribal residents, in a manner that compromises their dignity or safety.
            </p>

            <h2 className="font-serif text-xl text-forest font-bold pt-2">5. Contact Us Regarding Your Data</h2>
            <p>
              To request a copy of your recorded contributions, update your contact details, or request deletion of non-statutory records, write to:
            </p>
            <div className="p-4 bg-cream-light rounded-xl border border-forest/15 font-mono text-xs">
              Privacy Officer, DeepRoots Foundation<br />
              24/1/23, Gauri Shankar Nagar, Rukhmini Nagar, Amravati - 444606, Maharashtra<br />
              Email: deeprootsfoundation2026@gmail.com
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
