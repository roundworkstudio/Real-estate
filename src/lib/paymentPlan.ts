/**
 * Off-plan / structured payment plan and closing-fee transparency.
 *
 * The transfer fee is emirate-specific, not a single UAE-wide number: 4%
 * to the Dubai Land Department in Dubai, versus 2% to the Abu Dhabi
 * Municipality/DMT in Abu Dhabi. Both sample listings are in Abu Dhabi, so
 * applying the Dubai rate there would be a real factual error, not just a
 * rough placeholder — this keys off Property.city rather than hard-coding
 * one emirate's rate. All figures are illustrative typical-structure
 * estimates, not a specific developer's or trustee's published fees —
 * confirm exact terms per deal.
 */
import type { Property } from "./types";

export type PaymentStructureId = "60-40" | "50-50" | "post-handover" | "wadeem-adib";

export type Milestone = { label: string; percentOfPrice: number };

/** UAE Nationals receive a 5% rebate from MODON on this plan
 * (non-transferable) — stated on the same brochure page as the schedule
 * below, not modelled into the milestone amounts themselves since it's a
 * buyer-category discount, not a timing change. */
export const WADEEM_UAE_NATIONAL_REBATE_NOTE =
  "UAE Nationals receive a 5% rebate from MODON on this plan (non-transferable).";

export const PAYMENT_STRUCTURES: Record<
  PaymentStructureId,
  { name: string; milestones: Milestone[] }
> = {
  /** Wadeem Gardens' actual published structure ("First of its Kind
   * Financial Solution", Wadeem Gardens.pdf) — 25% of the total price from
   * the buyer, 75% financed by Abu Dhabi Islamic Bank (ADIB) across
   * construction and post-handover. Quoted exactly as shown, including the
   * pack's own "ADB"/"AEB" milestone labels (most likely shorthand for
   * ADIB-financed construction and post-handover tranches). */
  "wadeem-adib": {
    name: "MODON x ADIB plan (Wadeem Gardens)",
    milestones: [
      { label: "Down payment", percentOfPrice: 5 },
      { label: "Month 8", percentOfPrice: 5 },
      { label: "Month 14", percentOfPrice: 5 },
      { label: "Month 20", percentOfPrice: 5 },
      { label: "ADIB construction financing (20%)", percentOfPrice: 20 },
      { label: "Handover, Month 48", percentOfPrice: 5 },
      { label: "Post-handover, Month 54 (ADIB financed)", percentOfPrice: 55 },
    ],
  },
  "60-40": {
    name: "60/40 construction plan",
    milestones: [
      { label: "Booking, on signing SPA", percentOfPrice: 10 },
      { label: "20% construction milestone", percentOfPrice: 15 },
      { label: "40% construction milestone", percentOfPrice: 15 },
      { label: "60% construction milestone", percentOfPrice: 20 },
      { label: "Handover", percentOfPrice: 40 },
    ],
  },
  "50-50": {
    name: "50/50 handover plan",
    milestones: [
      { label: "Booking, on signing SPA", percentOfPrice: 10 },
      { label: "50% construction milestone", percentOfPrice: 40 },
      { label: "Handover", percentOfPrice: 50 },
    ],
  },
  "post-handover": {
    name: "Post-handover plan, 1% monthly",
    milestones: [
      { label: "Booking, on signing SPA", percentOfPrice: 10 },
      { label: "Construction milestones, to handover", percentOfPrice: 40 },
      { label: "Handover", percentOfPrice: 10 },
      { label: "Post-handover, 1% per month for 40 months", percentOfPrice: 40 },
    ],
  },
};

const TRANSFER_FEE_RATE_BY_CITY: Record<Property["city"], number> = {
  Dubai: 0.04,
  "Abu Dhabi": 0.02,
};

const TRANSFER_FEE_LABEL_BY_CITY: Record<Property["city"], string> = {
  Dubai: "Transfer fee (Dubai Land Department, 4%)",
  "Abu Dhabi": "Transfer fee (Abu Dhabi Municipality/DMT, 2%)",
};

const TRANSFER_ADMIN_FEE_AED = 580;
const AGENCY_FEE_RATE = 0.02;
const VAT_RATE = 0.05;
const TRUSTEE_REGISTRATION_FEE_AED = 4_200;

export type FeeBreakdown = {
  transferFeeLabel: string;
  transferFeeAed: number;
  transferAdminFeeAed: number;
  agencyFeeAed: number;
  agencyVatAed: number;
  trusteeRegistrationFeeAed: number;
  totalUpfrontFeesAed: number;
};

export function calculateFees(priceAed: number, city: Property["city"]): FeeBreakdown {
  const transferFeeAed = priceAed * TRANSFER_FEE_RATE_BY_CITY[city];
  const agencyFeeAed = priceAed * AGENCY_FEE_RATE;
  const agencyVatAed = agencyFeeAed * VAT_RATE;
  const totalUpfrontFeesAed =
    transferFeeAed +
    TRANSFER_ADMIN_FEE_AED +
    agencyFeeAed +
    agencyVatAed +
    TRUSTEE_REGISTRATION_FEE_AED;

  return {
    transferFeeLabel: TRANSFER_FEE_LABEL_BY_CITY[city],
    transferFeeAed,
    transferAdminFeeAed: TRANSFER_ADMIN_FEE_AED,
    agencyFeeAed,
    agencyVatAed,
    trusteeRegistrationFeeAed: TRUSTEE_REGISTRATION_FEE_AED,
    totalUpfrontFeesAed,
  };
}

export function calculateMilestoneSchedule(priceAed: number, structureId: PaymentStructureId) {
  return PAYMENT_STRUCTURES[structureId].milestones.map((m) => ({
    ...m,
    amountAed: priceAed * (m.percentOfPrice / 100),
  }));
}

export function totalInitialCapitalRequired(
  priceAed: number,
  city: Property["city"],
  structureId: PaymentStructureId,
): number {
  const firstMilestone = PAYMENT_STRUCTURES[structureId].milestones[0];
  const bookingAed = priceAed * (firstMilestone.percentOfPrice / 100);
  const fees = calculateFees(priceAed, city);
  return bookingAed + fees.totalUpfrontFeesAed;
}
