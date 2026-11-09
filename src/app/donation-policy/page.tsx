import type { Metadata } from "next";
import { LegalContactBlock, LegalPage } from "@/components/layout/LegalPage";

export const metadata: Metadata = {
  title: "Donation & Refund Policy | DeepRoots Foundation",
  description: "Donation, fund utilisation, refund, and tax-exemption guidelines for DeepRoots Foundation.",
  alternates: { canonical: "/donation-policy" },
};

export default function DonationPolicyPage() {
  return (
    <LegalPage eyebrow="Financial integrity" title="Donation & Refund Policy" updated="Last updated: November 2026">
      <h2>1. Use of funds</h2>
      <p>
        Contributions to our <em>First Meal</em> and <em>Hunger Free Vidarbha</em> initiatives are directed towards food
        procurement, kitchen operations, nutrition delivery, and educational support in underserved communities across
        Vidarbha.
      </p>

      <h2>2. Payment verification and acknowledgements</h2>
      <p>
        Online payments are confirmed with the payment gateway on our server before they are recorded, and you receive an
        on-screen acknowledgement with a unique reference that you can print or save. Direct bank and UPI transfers stay in{" "}
        <strong>awaiting verification</strong> status until our accounts team matches them against the bank statement.
      </p>

      <h2>3. Cancellations and refunds</h2>
      <p>
        Donations are voluntary charitable gifts and are generally non-refundable once deployed. If a duplicate or
        unauthorised transaction occurs:
      </p>
      <ul>
        <li>
          Notify us within <strong>7 days</strong> of the transaction date.
        </li>
        <li>Share the transaction reference (payment ID or UTR), the email used, and proof of the debit.</li>
        <li>Valid refunds are returned to the original payment method within 7 to 10 banking days.</li>
      </ul>

      <h2>4. 80G tax exemption</h2>
      <p>
        DeepRoots Foundation has applied for Section 80G approval with the Income Tax Department. Until that approval is
        granted, the receipts we issue are donation acknowledgements only and cannot be used to claim an 80G deduction.
      </p>

      <LegalContactBlock label="Accounts Office" />
    </LegalPage>
  );
}
