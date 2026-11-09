import type { Metadata } from "next";
import { LegalContactBlock, LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy | DeepRoots Foundation",
  description: "How DeepRoots Foundation collects, uses, and protects the information of donors, volunteers, partners, and beneficiaries.",
  alternates: { canonical: "/privacy-policy" },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage eyebrow="Data protection" title="Privacy Policy" updated="Last updated: November 2026">
      <h2>1. Our commitment to privacy</h2>
      <p>
        DeepRoots Foundation (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) respects the privacy of our donors,
        volunteers, partners, and beneficiaries. We collect only the information needed to process contributions, issue
        receipts, and coordinate our programmes.
      </p>

      <h2>2. Information we collect</h2>
      <ul>
        <li>
          <strong>Donor information:</strong> name, email address and phone number, all optional, entered when you donate.
        </li>
        <li>
          <strong>Payment references:</strong> payment gateway order and payment IDs, and bank transaction (UTR) references
          for direct transfers. <em>We never see or store card numbers, CVVs, or UPI PINs.</em>
        </li>
        <li>
          <strong>Contact, volunteer and partner enquiries:</strong> the details you choose to submit through our contact
          form.
        </li>
      </ul>

      <h2>3. Services that process your data</h2>
      <ul>
        <li>
          <strong>Razorpay</strong> processes online donations. Your payment details are entered directly into
          Razorpay&rsquo;s secure checkout and are governed by Razorpay&rsquo;s own privacy policy.
        </li>
        <li>
          <strong>Google Forms</strong> collects messages sent through our contact form, under Google&rsquo;s privacy policy.
        </li>
      </ul>

      <h2>4. How information is used</h2>
      <p>
        Your information is used only to acknowledge donations, reply to your enquiries, share programme updates when you
        have opted in, and meet statutory obligations in India. We do not sell, rent, or trade donor records to anyone.
      </p>

      <h2>5. Beneficiary protection and child safety</h2>
      <p>
        We follow consent guidelines in our field storytelling and never depict beneficiaries, especially children, in a
        way that compromises their dignity or safety.
      </p>

      <h2>6. Your data requests</h2>
      <p>
        To request a copy of your recorded contributions, update your details, or ask us to delete records we are not
        legally required to keep, write to:
      </p>
      <LegalContactBlock label="Privacy Officer" />
    </LegalPage>
  );
}
