export interface DonationTier {
  amount: number;
  description: string;
  isPopular?: boolean;
}

/**
 * Amount options shared by every donation form on the site.
 * Keep minAmount/maxAmount in sync with CreateDonationOrderSchema in src/lib/validation.ts,
 * which enforces the same limits on the server.
 */
export const donationOptions = {
  defaultAmount: 1350,
  minAmount: 10,
  maxAmount: 500000,
  tiers: [
    { amount: 350, description: "Nourish 5 warm, wholesome meals." },
    { amount: 550, description: "Support weekly nutrition for a family." },
    { amount: 1350, description: "Provide essential food rations for 2 weeks.", isPopular: true },
    { amount: 2000, description: "Sponsor a community distribution drive." },
    { amount: 5000, description: "Support community hunger relief programmes." },
  ] satisfies DonationTier[],
};

/** Donations made from /donate rather than a specific campaign page. */
export const generalDonation = {
  campaignName: "General Donation",
  purpose: "Food security & community upliftment",
  eyebrow: "Donate",
  title: "Your contribution can become someone's first meal.",
  description:
    "Choose an amount, pay securely through Razorpay, and get an on-screen receipt you can print or save.",
};
