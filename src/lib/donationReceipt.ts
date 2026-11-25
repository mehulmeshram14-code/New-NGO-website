import { CAMPAIGN_IDS, type CampaignId } from "@/data/campaigns";

/**
 * Hand-off from the donation form to the universal /thank-you page.
 *
 * The receipt is built from the server's verify-payment response and kept in this tab's
 * sessionStorage, so nothing appears in the URL (a link can't be edited into a fake
 * receipt) and a refresh still shows it. A different tab or device sees a generic thank-you.
 */
export interface DonationReceipt {
  reference: string;
  paymentId: string;
  orderId?: string;
  amount: number;
  donorName: string;
  campaignId: CampaignId;
  /** ISO date of capture, or of verification when still pending. */
  date: string;
  status: "confirmed" | "pending";
  message?: string;
}

const STORAGE_KEY = "deeproots:lastDonation";

export function saveReceipt(receipt: DonationReceipt) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(receipt));
  } catch {
    // Storage blocked (private mode etc.): the thank-you page falls back to a generic message.
  }
}

/** Returns the stored receipt only if every field has the expected shape. */
export function loadReceipt(): DonationReceipt | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const r = JSON.parse(raw) as Partial<DonationReceipt>;
    const valid =
      typeof r.reference === "string" &&
      typeof r.paymentId === "string" &&
      typeof r.donorName === "string" &&
      typeof r.amount === "number" &&
      Number.isFinite(r.amount) &&
      r.amount > 0 &&
      typeof r.date === "string" &&
      !Number.isNaN(Date.parse(r.date)) &&
      (r.status === "confirmed" || r.status === "pending") &&
      (CAMPAIGN_IDS as readonly string[]).includes(r.campaignId as string);
    return valid ? (r as DonationReceipt) : null;
  } catch {
    return null;
  }
}
