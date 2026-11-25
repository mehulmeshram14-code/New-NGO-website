import { COST_PER_MEAL, formatINR, MAX_DONATION, MIN_DONATION } from "@/data/donation";
import { siteConfig } from "@/data/siteConfig";

export const HUNGER_FREE_PATH = "/campaign/hunger-free";
const IMAGE_BASE = "/campaign/hunger-free";

export interface Beneficiary {
  id: string;
  src: string;
  name?: string;
  age?: number;
  label: string;
}

export interface FaqItem {
  question: string;
  answer: string;
  link?: { href: string; label: string };
}

/**
 * Copy for /campaign/hunger-free. The campaign has just started, so the page makes
 * no achievement claims (no meals-served counters or targets); every number on it
 * is derived from the ₹50 cost of one meal.
 */
// Campaign identity (name, cause, receipt and share text) lives in src/data/campaigns.ts
// under the "hunger-free" id; this file is the page copy only.
export const hungerFreeCampaign = {
  hero: {
    eyebrow: "Hunger Free Vidarbha",
    titleLead: "No one in Vidarbha should",
    titleAccent: "sleep hungry.",
    description: `We've just begun. Our volunteers cook and serve fresh meals to elders and families in Amravati who often go without. Every ${formatINR(COST_PER_MEAL)} you give is one warm meal.`,
    image: `${IMAGE_BASE}/hero.jpg`,
    imageAlt: "A DeepRoots volunteer serving a fresh meal to elders seated on the floor",
    imageCaption: `Every ${formatINR(COST_PER_MEAL)} is a warm meal tonight.`,
  },

  tagline: {
    line: "Ek ghaas, ek aas.",
    translation: "One morsel, one hope.",
  },

  about: [
    {
      title: "What is Hunger Free Vidarbha?",
      text: "Hunger Free Vidarbha is DeepRoots Foundation's meal seva campaign, and it is where our work begins: volunteers preparing and serving fresh, nutritious meals, starting with elders and families in Amravati. As support grows, we will take meal seva to more communities across Vidarbha.",
      image: "/photos/volunteers-with-residents.jpg",
      imageAlt: "DeepRoots volunteers standing with elders after a meal",
    },
    {
      title: "Why a meal matters",
      text: "Vidarbha grows food for the whole country, yet many of its families still go to bed hungry, and in its tribal districts nearly a third of young children are malnourished. A warm meal is the most direct help we can give, and the first step towards the education and livelihood work we plan next.",
      image: "/photos/volunteer-serving-meal.jpg",
      imageAlt: "A volunteer pouring dal for an elder eating from a steel thali",
    },
  ],

  levels: {
    eyebrow: "Choose your level",
    title: "Every rupee is counted in meals",
    description: `${formatINR(COST_PER_MEAL)} cooks and serves one fresh meal. Pick a level and we'll set it in the donation form.`,
  },

  sponsor: {
    eyebrow: "Give big",
    title: "Sponsor meal seva",
    description: "For families, businesses and CSR teams who want to give at scale.",
  },

  beneficiaries: {
    eyebrow: "From the field",
    title: "The people you'll be feeding.",
    description: "Elders from our first meal seva in Amravati.",
    rowOne: [
      { id: "bp-3", src: `${IMAGE_BASE}/beneficiaries/image3.jpeg`, name: "Saraswati Shantaram Maske", age: 80, label: "Elder Daily Food Seva" },
      { id: "bp-drive", src: `${IMAGE_BASE}/beneficiaries/image-drive.jpeg`, label: "Meal Seva Beneficiary" },
      { id: "bp-4", src: `${IMAGE_BASE}/beneficiaries/image4.jpeg`, name: "Sunita Rajendra Ghadge", age: 60, label: "Warm Meal Seva" },
      { id: "bp-6", src: `${IMAGE_BASE}/beneficiaries/image6.jpeg`, name: "Savita Bhalchandra Kulkarni", age: 64, label: "Elder Nutrition Seva" },
      { id: "bp-9", src: `${IMAGE_BASE}/beneficiaries/image9.jpeg`, name: "Urmila Daulatrao Kukade", age: 70, label: "Nutritious Food Seva" },
      { id: "bp-11", src: `${IMAGE_BASE}/beneficiaries/image11.jpeg`, name: "Nirmala Kisanrao Patil", age: 65, label: "Community Food Seva" },
      { id: "bp-14", src: `${IMAGE_BASE}/beneficiaries/image14.jpeg`, name: "Mangla Ganesh Vijaykar", age: 57, label: "Fresh Meal Kit" },
      { id: "bp-15", src: `${IMAGE_BASE}/beneficiaries/image15.jpeg`, name: "Varsha Sunil Dhotre", age: 43, label: "Doorstep Nutrition Seva" },
    ] satisfies Beneficiary[],
    rowTwo: [
      { id: "bp-8", src: `${IMAGE_BASE}/beneficiaries/image8.jpeg`, name: "Lilabai Kisanrao Tambatkar", age: 80, label: "Elder Food Nutrition" },
      { id: "bp-12", src: `${IMAGE_BASE}/beneficiaries/image12.jpeg`, name: "Godavari Prabhakar Gadave", age: 75, label: "Elder Nutrition Seva" },
      { id: "bp-16", src: `${IMAGE_BASE}/beneficiaries/image16.jpeg`, name: "Geeta Damuji Yadav", age: 52, label: "Nutrition Meal Kit" },
      { id: "bp-17", src: `${IMAGE_BASE}/beneficiaries/image17.jpeg`, name: "Sahebrao Wathodkar", age: 75, label: "Community Seva" },
      { id: "bp-18", src: `${IMAGE_BASE}/beneficiaries/image18.jpeg`, name: "Ishwardas Kodumal Gangwani", age: 64, label: "Hot Meal Seva" },
      { id: "bp-19", src: `${IMAGE_BASE}/beneficiaries/image19.jpeg`, name: "Mangla Bana Bakode", age: 74, label: "Village Outreach Seva" },
      { id: "bp-20", src: `${IMAGE_BASE}/beneficiaries/image20.jpeg`, name: "Sudhakar Kapse", age: 75, label: "Grassroots Relief Seva" },
      { id: "bp-21", src: `${IMAGE_BASE}/beneficiaries/image21.jpeg`, name: "Vinod Wante", age: 55, label: "Daily Food Seva" },
    ] satisfies Beneficiary[],
  },

  faq: [
    {
      question: "Will I get an 80G tax receipt?",
      answer:
        "DeepRoots Foundation has applied for Section 80G approval. Until it is granted, we issue a donation acknowledgement with a unique reference, but it can't be used to claim an 80G deduction. We'll update this page once approval comes through.",
    },
    {
      question: `How does ${formatINR(COST_PER_MEAL)} help?`,
      answer: `${formatINR(COST_PER_MEAL)} covers one freshly cooked, nutritious meal, served by our volunteers. ${formatINR(1000)} serves 20 meals.`,
    },
    {
      question: "What is Hunger Free Vidarbha?",
      answer:
        "It is DeepRoots Foundation's meal seva campaign. We've just started, serving fresh meals to elders and families in Amravati, and we'll grow across Vidarbha as support grows.",
    },
    {
      question: "Can I give a different amount?",
      answer: `Yes. Enter any amount from ${formatINR(MIN_DONATION)} (one meal) under "Other amount". For gifts above ${formatINR(MAX_DONATION)}, please contact us directly.`,
    },
    {
      question: "Is the payment secure?",
      answer:
        "Payments are processed by Razorpay over an encrypted connection, by UPI, card or net banking. We never see or store your card, UPI or bank details, and every payment is verified on our server before it is recorded.",
    },
    {
      question: "Can I get a refund?",
      answer:
        "Donations are generally non-refundable once used for meals. If you made a duplicate or mistaken payment, tell us within 7 days and we'll refund it to the original payment method.",
      link: { href: "/donation-policy", label: "Read the donation & refund policy" },
    },
    {
      question: "Who do I contact for help?",
      answer: `Call us on ${siteConfig.contact.phone} or email ${siteConfig.contact.email}. Please keep your donation reference handy.`,
    },
  ] satisfies FaqItem[],

  finalCta: {
    title: "Feed someone tonight.",
    description: `${formatINR(COST_PER_MEAL)} is a warm meal. Start with one, or feed a whole lane.`,
    image: "/photos/team-with-banner.jpg",
    imageAlt: "The DeepRoots team with elders, holding the foundation's banner",
  },
};
