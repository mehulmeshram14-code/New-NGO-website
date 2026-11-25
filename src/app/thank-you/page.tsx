import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ThankYou } from "@/components/donation/ThankYou";

export const metadata: Metadata = {
  title: "Thank you | DeepRoots Foundation",
  description: "Thank you for your donation to DeepRoots Foundation.",
  // Personal receipts: keep this page out of search results.
  robots: { index: false, follow: false },
};

/**
 * Universal thank-you page for every campaign. The donation form saves the
 * server-verified receipt for this tab (see src/lib/donationReceipt.ts) and
 * redirects here; the campaign id inside it decides the wording, cause and links.
 */
export default function ThankYouPage() {
  return (
    <>
      <div className="print:hidden">
        <Navbar />
      </div>
      <main className="flex-1 bg-ivory px-4 pt-32 pb-20 sm:px-6 print:p-0">
        <ThankYou />
      </main>
      <div className="print:hidden">
        <Footer />
      </div>
    </>
  );
}
