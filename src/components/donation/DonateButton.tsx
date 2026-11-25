"use client";

import type { ReactNode } from "react";
import { useDonation } from "./DonationProvider";

/**
 * Any "donate" button outside the donation card. Optionally pre-selects an amount,
 * then scrolls to the card and focuses it. Must be inside a <DonationProvider>.
 */
export function DonateButton({
  amount,
  className,
  children,
}: {
  amount?: number;
  className?: string;
  children: ReactNode;
}) {
  const { startDonation } = useDonation();
  return (
    <button type="button" onClick={() => startDonation(amount)} className={className}>
      {children}
    </button>
  );
}
