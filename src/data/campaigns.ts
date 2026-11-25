import { DEFAULT_AMOUNT, donationLevels, formatINR, mealsFor, type DonationLevel } from "@/data/donation";

/**
 * Every place a donation can come from. The donation form sends only a campaign `id`;
 * the server validates it against this list and stores the official `name`, and the
 * universal /thank-you page uses the same entry to build the receipt and share links.
 *
 * To add a campaign: add an entry here, then render it inside
 * <DonationProvider campaignId="…"> with a <DonationCard campaignId="…" />.
 */
export const CAMPAIGN_IDS = ["hunger-free", "no-elder-sleeps-hungry", "general"] as const;
export type CampaignId = (typeof CAMPAIGN_IDS)[number];

/** Wording on the donation card that varies per campaign. */
export interface DonationCardCopy {
  /** Show each level's name and description on the amount buttons. */
  detailedLevels: boolean;
  customPlaceholder: string;
  /** Step 1 button text. */
  continueLabel: (amount: number) => string;
  /** Small print under the step 1 button. */
  footnote?: string;
  /** Colour of the main buttons. */
  accent: "gold" | "green";
}

export interface Campaign {
  id: CampaignId;
  /** Stored on the donation record and shown in the Razorpay dashboard. */
  name: string;
  /** "Cause" line on the receipt. */
  cause: string;
  /** Short description shown in the Razorpay checkout window. */
  purpose: string;
  /** Page to send donors back to, and the link they share. */
  path: string;
  /** Completes "Your gift of ₹X will serve …" on the thank-you page. */
  impact: (amount: number) => string;
  /** Pre-written message for the share buttons (the link is appended). */
  shareText: string;
  highlights: { title: string; text: string }[];
  /** Amount buttons on the donation card, and which one starts selected. */
  levels: DonationLevel[];
  defaultAmount: number;
  card: DonationCardCopy;
}

const mealsText = (amount: number, suffix = "") => {
  const n = mealsFor(amount);
  return `${n.toLocaleString("en-IN")} freshly cooked ${n === 1 ? "meal" : "meals"}${suffix}`;
};

const defaultCard: DonationCardCopy = {
  detailedLevels: false,
  customPlaceholder: "Other amount",
  continueLabel: (amount) => `Continue · ${formatINR(amount)}`,
  accent: "gold",
};

/** Giving levels for No Elder Sleeps Hungry, worded for elders (see the landing page design). */
const elderLevels: DonationLevel[] = [
  { amount: 500, name: "Thali", description: "10 warm meals for an elder" },
  { amount: 1000, name: "Parivaar", description: "20 meals for elders this week", badge: "Most chosen" },
  { amount: 2500, name: "Angan", description: "50 meals for elders in one neighbourhood" },
  { amount: 5000, name: "Gali", description: "100 meals. A full lane of elders fed" },
  { amount: 10000, name: "Mohalla", description: "200 meals. A full day of seva" },
  { amount: 25000, name: "Gaon", description: "500 meals. A village of elders fed" },
];

export const campaigns: Record<CampaignId, Campaign> = {
  "hunger-free": {
    id: "hunger-free",
    name: "Hunger Free - Vidarbha",
    cause: "Hunger Free Vidarbha — meal seva",
    purpose: "Hunger relief in Vidarbha",
    path: "/campaign/hunger-free",
    impact: (amount) => mealsText(amount, " for families in Vidarbha who would otherwise go without"),
    shareText:
      "I just helped serve fresh meals to families in Vidarbha with DeepRoots Foundation. ₹50 is one warm meal — join me:",
    highlights: [
      { title: "Fresh meals", text: "Cooked and served by our volunteers" },
      { title: "Real people", text: "Elders and families in Amravati who often go without" },
      { title: "Your receipt", text: "Keep the reference below for your records" },
    ],
    levels: donationLevels,
    defaultAmount: DEFAULT_AMOUNT,
    card: defaultCard,
  },
  "no-elder-sleeps-hungry": {
    id: "no-elder-sleeps-hungry",
    name: "No Elder Sleeps Hungry - Amravati",
    cause: "Elder Daily Food Seva — Amravati",
    purpose: "Warm meals for elders in Amravati",
    path: "/campaign/no-elder-sleeps-hungry",
    impact: (amount) => mealsText(amount, " for elders in Amravati who would otherwise go without"),
    shareText:
      "I just fed an elder in Amravati with DeepRoots Foundation's Elder Daily Food Seva. ₹50 is one warm meal — join me:",
    highlights: [
      { title: "Cooked fresh", text: "A meal we'd serve our own grandparents" },
      { title: "Served with dignity", text: "Volunteers sit with elders while they eat" },
      { title: "Your receipt", text: "Keep the reference below for your records" },
    ],
    levels: elderLevels,
    defaultAmount: 1000,
    card: {
      detailedLevels: true,
      customPlaceholder: "Even ₹50 feeds one elder tonight",
      continueLabel: (amount) => `Donate ${formatINR(amount)} · Feed ${mealsFor(amount).toLocaleString("en-IN")} meals`,
      footnote: "80G approval applied for. You'll receive a donation acknowledgement.",
      accent: "green",
    },
  },
  general: {
    id: "general",
    name: "General Donation",
    cause: "Food security & community upliftment",
    purpose: "Food security & community upliftment",
    path: "/donate",
    impact: (amount) => mealsText(amount, " for people who would otherwise go without"),
    shareText: "I just supported DeepRoots Foundation's work on food security in Vidarbha. Join me:",
    highlights: [
      { title: "Food first", text: "Fresh meals for families who need them most" },
      { title: "Rooted in Vidarbha", text: "A local team working in local communities" },
      { title: "Your receipt", text: "Keep the reference below for your records" },
    ],
    levels: donationLevels,
    defaultAmount: DEFAULT_AMOUNT,
    card: defaultCard,
  },
};

export const getCampaign = (id: string | undefined | null): Campaign =>
  id && id in campaigns ? campaigns[id as CampaignId] : campaigns.general;
