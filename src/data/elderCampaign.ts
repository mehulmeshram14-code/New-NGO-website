import { COST_PER_MEAL, formatINR, MAX_DONATION } from "@/data/donation";

export const ELDER_CAMPAIGN_PATH = "/campaign/no-elder-sleeps-hungry";
const BENEFICIARIES = "/campaign/hunger-free/beneficiaries";

/**
 * Copy for /campaign/no-elder-sleeps-hungry, from the "No Elder Sleeps Hungry" landing
 * page design. Campaign identity (name, levels, receipt wording) is in src/data/campaigns.ts.
 */
export const elderCampaign = {
  hero: {
    eyebrow: "No elder sleeps hungry · Starting in Amravati",
    titleLines: ["No one in India should sleep hungry.", "Least of all the people who raised it."],
    primaryCta: "Feed an Elder Today",
    secondaryCta: "See how the seva works",
    note: `${formatINR(COST_PER_MEAL)} = one warm meal · Payments secured by Razorpay`,
    image: "/photos/volunteer-serving-meal.jpg",
    imageAlt: "A DeepRoots volunteer serving a warm meal to an elder in Amravati",
  },

  problem: {
    eyebrow: "The problem",
    title: "India is getting older. Many of its elders are getting left behind.",
    stats: [
      { value: "149 million", label: "Indians aged 60 and above in 2022, about 10.5% of the population" },
      { value: "347 million", label: "elders India will be home to by 2050" },
      { value: "40%+", label: "of India's elderly fall in the poorest wealth group" },
    ],
    text: "Behind those numbers are real people. A widow whose children moved to the city. A farmer whose hands can't work the field anymore. A grandfather who eats once a day so the money lasts. Their hunger is quiet. They don't ask, and that's why it gets missed.",
    source: "Source: UNFPA & IIPS, India Ageing Report 2023",
  },

  whatWeDo: {
    eyebrow: "What we do",
    title: "One warm meal, every day, served with dignity.",
    paragraphs: [
      "Through our Elder Daily Food Seva, volunteers in Amravati cook fresh, simple meals and serve them to elders who can't cook for themselves or can't afford to.",
      "We don't hand out leftovers. We serve a meal we'd serve our own grandparents, and we sit with them while they eat.",
    ],
    steps: ["1. Nourish: meals first", "2. Educate: as support grows", "3. Empower: livelihoods next"],
    // No photo of the seva kitchen yet; replace with one of volunteers cooking when available.
    image: "/photos/team-with-banner.jpg",
    imageAlt: "DeepRoots volunteers with elders from the Elder Daily Food Seva in Amravati",
  },

  whyElders: {
    eyebrow: "Why elders first",
    title: "They fed us. Now it's our turn.",
    reasons: [
      { icon: "heart", title: "Hunger hits harder at 70", text: "A skipped meal means weakness, falls and illness that take a long time to heal." },
      { icon: "home", title: "Many live alone", text: "No one checks on them, and no one cooks." },
      { icon: "message", title: "They won't ask", text: "A generation that gave everything rarely asks for anything back." },
    ],
    closing: "A daily meal is food, and it's also a reason to believe someone still cares.",
  },

  faces: {
    eyebrow: "Faces of the seva",
    title: "These aren't numbers. They're Aaji and Ajoba.",
    description: `Meet some of the elders who get a warm meal from us every day in Amravati. Your ${formatINR(COST_PER_MEAL)} keeps their plate full tomorrow.`,
    label: "Elder Daily Food Seva · Amravati",
    people: [
      { name: "Saraswati Shantaram Maske", age: 80, src: `${BENEFICIARIES}/image3.jpeg` },
      { name: "Lilabai Kisanrao Tambatkar", age: 80, src: `${BENEFICIARIES}/image8.jpeg` },
      { name: "Sahebrao Wathodkar", age: 75, src: `${BENEFICIARIES}/image17.jpeg` },
      { name: "Godavari Prabhakar Gadave", age: 75, src: `${BENEFICIARIES}/image12.jpeg` },
    ],
  },

  donate: {
    eyebrow: "Donate",
    title: "Choose how many plates you fill.",
    description: `Every ${formatINR(COST_PER_MEAL)} is one warm meal for an elder in Amravati. Pick a tier or enter your own amount.`,
    checklist: ["Cooked fresh by volunteers", "Registered Section 8 company", "UPI, cards and net banking via Razorpay"],
  },

  sponsor: {
    eyebrow: "Sponsor a seva",
    title: "Mark a birthday, a memory, or a milestone with someone else's meal.",
    description: "Perfect for a parent's birthday, a remembrance day, or a CSR program with faces behind every rupee.",
    options: [
      { label: "Sponsor a day", amount: 10000, cta: "Sponsor a day" },
      { label: "Sponsor a week", amount: 70000, cta: "Sponsor a week", featured: true },
      { label: "Sponsor a month", amount: 300000, cta: "Sponsor a month" },
    ],
    largeGiftNote: `Gifts above ${formatINR(MAX_DONATION)}:`,
  },

  faq: [
    {
      question: "Will I get an 80G tax benefit?",
      answer:
        "We've applied for 80G approval and it hasn't been granted yet. Until then you'll get a donation acknowledgement, which can't be used to claim an 80G deduction. We'll update this page the day it's approved.",
    },
    {
      question: "Can I get a refund?",
      answer: "Donations used for meals are generally non-refundable. Duplicate or mistaken payments reported within 7 days are refunded.",
      link: { href: "/donation-policy", label: "Read the full donation policy" },
    },
    {
      question: "Is my payment safe?",
      answer: "Yes. Payments are processed by Razorpay. We never see or store your card or bank details.",
    },
  ],

  finalCta: {
    title: "Somewhere tonight, an elder is waiting for dinner. Let it be yours that reaches them.",
    button: `Feed an Elder for ${formatINR(COST_PER_MEAL)}`,
  },
};
