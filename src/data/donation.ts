/**
 * Single source of truth for donation amounts. Imported by the donation form
 * (browser) AND by the server-side validation, so the limits cannot drift apart.
 */
export const COST_PER_MEAL = 50; // ₹ per freshly cooked meal

export const MIN_DONATION = COST_PER_MEAL; // one meal
export const MAX_DONATION = 500000; // above this, donors are asked to contact us

export const mealsFor = (amount: number) => Math.floor(amount / COST_PER_MEAL);

export const formatINR = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;

export interface DonationLevel {
  amount: number;
  /** Short name for the giving level (Hindi/Marathi words, written in English). */
  name: string;
  description: string;
  /** Small label on the card, e.g. "Popular". */
  badge?: string;
}

export const DEFAULT_AMOUNT = 1000;

export const donationLevels: DonationLevel[] = [
  { amount: 500, name: "Thali", description: "Warm meals, cooked and served fresh." },
  { amount: 1000, name: "Parivaar", description: "Meals for families who need them most." },
  { amount: 2500, name: "Angan", description: "A whole courtyard of homes eats.", badge: "Popular" },
  { amount: 5000, name: "Gali", description: "A full lane eats tonight." },
  { amount: 10000, name: "Mohalla", description: "A full day of meal seva for a neighbourhood." },
  { amount: 25000, name: "Gaon", description: "Meals that reach across a village.", badge: "Best impact" },
];

/**
 * Large, fixed gifts for families, businesses and CSR teams.
 * A meal seva day is 200 meals (₹10,000); week and month are multiples of that.
 */
export const sponsorships = [
  { title: "Sponsor a meal seva day", amount: 10000, detail: "A full day of freshly cooked meals for a community." },
  { title: "Sponsor a week", amount: 70000, detail: "Seven days of meal seva, cooked and served by our volunteers." },
  { title: "Sponsor a month", amount: 300000, detail: "For businesses and CSR teams: thirty days of meal seva." },
];
