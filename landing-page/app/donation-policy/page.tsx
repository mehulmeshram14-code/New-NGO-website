import React from "react";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, HeartHandshake } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Donation & Refund Policy | DeepRoots Foundation",
  description: "Official donation, fund utilization, and cancellation guidelines for DeepRoots Foundation.",
};

export default function DonationPolicyPage() {
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
            <HeartHandshake className="w-4 h-4 text-forest" />
            <span>Financial Integrity &amp; Transparency</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl text-forest font-bold">
            Donation &amp; Refund Policy
          </h1>

          <div className="text-xs text-charcoal-muted border-b border-forest/10 pb-4">
            Official Policy · DeepRoots Foundation · Section 8 Non-Profit (CIN: U88900ME2026NPL476439)
          </div>

          <div className="prose prose-sm max-w-none text-charcoal/85 space-y-4 font-sans leading-relaxed">
            <h2 className="font-serif text-xl text-forest font-bold pt-2">1. Direct Grassroots Allocation</h2>
            <p>
              100% of contributions received under the <em>First Meal</em> initiative are directed toward food grain procurement, kitchen operations, fortified nutrition delivery, and educational bridging in underserved Vidarbha villages.
            </p>

            <h2 className="font-serif text-xl text-forest font-bold pt-2">2. Payment Verification &amp; Acknowledgements</h2>
            <p>
              Online payments verified via payment gateway signatures receive an automated on-screen and digital acknowledgement. Manual bank transfers and direct UPI payments remain in <strong>Awaiting Verification</strong> status until matched against official bank statements by our accounts team, preventing premature or false donation claims.
            </p>

            <h2 className="font-serif text-xl text-forest font-bold pt-2">3. Cancellation &amp; Refund Guidelines</h2>
            <p>
              As donations represent voluntary charitable gifts deployed rapidly to field meal distributions, donations are generally non-refundable once deployed. However, if an erroneous duplicate transaction or unauthorized charge occurs:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm">
              <li>Notify our accounts department within <strong>7 days</strong> of the transaction date.</li>
              <li>Provide proof of transfer, transaction reference (UTR), donor email, and bank statement extract.</li>
              <li>Valid refund claims are processed back to the original source account within 7 to 10 banking days.</li>
            </ul>

            <h2 className="font-serif text-xl text-forest font-bold pt-2">4. 80G Tax Exemption Notice</h2>
            <p>
              DeepRoots Foundation has submitted its application for Section 80G approval with the Income Tax Department. In keeping with our strict transparency policy, we issue official donation receipts immediately while clearly clarifying that statutory 80G tax certificates will be available upon receipt of formal departmental endorsement.
            </p>

            <div className="p-4 bg-cream-light rounded-xl border border-forest/15 font-mono text-xs mt-6">
              Accounts Office: deeprootsfoundation2026@gmail.com<br />
              DeepRoots Foundation, Rukhmini Nagar, Amravati - 444606, Maharashtra
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
