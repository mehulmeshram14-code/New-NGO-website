import React from "react";
import CompactHeader from "@/components/CompactHeader";
import Section1Hero from "@/components/Section1Hero";
import Section2Donation from "@/components/Section2Donation";
import Section3Beneficiaries from "@/components/Section3Beneficiaries";
import Section4TrustFinalCta from "@/components/Section4TrustFinalCta";
import CompactFooter from "@/components/CompactFooter";

export default function LandingPage() {
  // Authoritative JSON-LD structured schema for search engines & donors
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NGO",
    name: "DeepRoots Foundation",
    alternateName: "DeepRoots Foundation",
    url: "https://deeprootsfoundation.org",
    logo: "https://deeprootsfoundation.org/assets/images/logo.png",
    description:
      "DeepRoots Foundation works to address hunger, food security, nutrition, and education across underserved communities.",
    foundingDate: "2026",
    taxID: "U88900ME2026NPL476439",
    nonprofitStatus: "Nonprofit501c3",
    address: {
      "@type": "PostalAddress",
      streetAddress: "24/1/23, Gauri Shankar Nagar, Rukhmini Nagar",
      addressLocality: "Amravati",
      addressRegion: "Maharashtra",
      postalCode: "444606",
      addressCountry: "IN",
    },
    areaServed: ["Amravati", "Vidarbha", "Maharashtra", "India"],
    knowsAbout: [
      "Food Security",
      "Hunger Relief",
      "Child Nutrition",
      "Community Empowerment",
      "Education",
    ],
  };

  return (
    <div className="min-h-screen flex flex-col bg-ivory text-earth selection:bg-rust selection:text-white">
      {/* Search Engine & Rich Snippets Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Compact Navigation Header */}
      <CompactHeader />

      {/* Main Content with EXACTLY FOUR MAIN SECTIONS */}
      <main id="main-content" className="flex-1">
        {/* Section 1: Hero Section */}
        <Section1Hero />

        {/* Section 2: Donation Section */}
        <Section2Donation />

        {/* Section 3: Beneficiary Stories Section */}
        <Section3Beneficiaries />

        {/* Section 4: Trust + Final CTA Section */}
        <Section4TrustFinalCta />
      </main>

      {/* Compact Legal & Contact Footer */}
      <CompactFooter />
    </div>
  );
}
