"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { getCampaign, type Campaign, type CampaignId } from "@/data/campaigns";

export type DonationStep = "amount" | "details" | "done";

/** Id of the donation card; used for scroll targets and the sticky bar's visibility check. */
export const DONATION_CARD_ID = "donate";

interface DonationContextValue {
  /** The campaign every donation on this page belongs to (levels, wording, receipt). */
  campaign: Campaign;
  /** Amount chosen from the preset buttons (ignored while customInput is non-empty). */
  presetAmount: number;
  /** Raw digits typed into "Other amount". */
  customInput: string;
  /** The amount that will actually be charged. */
  amount: number;
  step: DonationStep;
  setStep: (step: DonationStep) => void;
  choosePreset: (amount: number) => void;
  setCustomInput: (digits: string) => void;
  /**
   * Picks an amount from elsewhere on the page (level cards, sponsorships, sticky bar),
   * resets to step 1 and scrolls the donation card into view.
   */
  startDonation: (amount?: number) => void;
}

const DonationContext = createContext<DonationContextValue | null>(null);

export function DonationProvider({ campaignId, children }: { campaignId: CampaignId; children: ReactNode }) {
  const campaign = getCampaign(campaignId);
  const [presetAmount, setPresetAmount] = useState(campaign.defaultAmount);
  const [customInput, setCustomInputState] = useState("");
  const [step, setStep] = useState<DonationStep>("amount");

  const amount = customInput ? parseInt(customInput, 10) || 0 : presetAmount;

  const choosePreset = useCallback((value: number) => {
    setPresetAmount(value);
    setCustomInputState("");
  }, []);

  const setCustomInput = useCallback((digits: string) => {
    setCustomInputState(digits.replace(/\D/g, "").slice(0, 7));
  }, []);

  const startDonation = useCallback(
    (value?: number) => {
      if (value !== undefined) {
        // Preset buttons only cover the giving levels; other amounts (e.g. sponsorships)
        // go into "Other amount" so the donor can see exactly what they chose.
        if (campaign.levels.some((level) => level.amount === value)) {
          setPresetAmount(value);
          setCustomInputState("");
        } else {
          setCustomInputState(String(value));
        }
      }
      setStep("amount");
      const card = document.getElementById(DONATION_CARD_ID);
      card?.scrollIntoView({ behavior: "smooth", block: "center" });
      // Move keyboard focus to the card so screen-reader and keyboard users land there too.
      card?.focus({ preventScroll: true });
    },
    [campaign]
  );

  const value = useMemo(
    () => ({ campaign, presetAmount, customInput, amount, step, setStep, choosePreset, setCustomInput, startDonation }),
    [campaign, presetAmount, customInput, amount, step, choosePreset, setCustomInput, startDonation]
  );

  return <DonationContext.Provider value={value}>{children}</DonationContext.Provider>;
}

export function useDonation() {
  const ctx = useContext(DonationContext);
  if (!ctx) throw new Error("useDonation must be used inside <DonationProvider>.");
  return ctx;
}
