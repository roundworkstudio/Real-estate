/**
 * Off-plan / structured payment plan and closing-fee transparency.
 *
 * The transfer fee is emirate-specific, not a single UAE-wide number: 4%
 * to the Dubai Land Department in Dubai, versus 2% registered through
 * ADREC's DARI platform in Abu Dhabi. Both sample listings are in Abu Dhabi, so
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
  { name: string; milestones: Milestone[]; splitLabel: string }
> = {
  /** Wadeem Gardens' actual published structure ("First of its Kind
   * Financial Solution", Wadeem Gardens.pdf) — 25% of the total price from
   * the buyer, 75% financed by Abu Dhabi Islamic Bank (ADIB) across
   * construction and post-handover. Quoted exactly as shown, including the
   * pack's own "ADB"/"AEB" milestone labels (most likely shorthand for
   * ADIB-financed construction and post-handover tranches). */
  "wadeem-adib": {
    name: "MODON x ADIB plan (Wadeem Gardens)",
    splitLabel: "25 / 75",
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
    splitLabel: "60 / 40",
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
    splitLabel: "50 / 50",
    milestones: [
      { label: "Booking, on signing SPA", percentOfPrice: 10 },
      { label: "50% construction milestone", percentOfPrice: 40 },
      { label: "Handover", percentOfPrice: 50 },
    ],
  },
  "post-handover": {
    name: "Post-handover plan, 1% monthly",
    splitLabel: "50 / 50",
    milestones: [
      { label: "Booking, on signing SPA", percentOfPrice: 10 },
      { label: "Construction milestones, to handover", percentOfPrice: 40 },
      { label: "Handover", percentOfPrice: 10 },
      { label: "Post-handover, 1% per month for 40 months", percentOfPrice: 40 },
    ],
  },
};

export type PlanSegment = { percent: number; payer: "you" | "bank"; when: string };

/** Who pays what, in time order, summarising the milestones above for a
 * single bar. Must sum to 100 and agree with the milestone list. */
export const PLAN_TIMELINES: Partial<
  Record<PaymentStructureId, { financedBy: string; youPayOver: string; segments: PlanSegment[] }>
> = {
  "wadeem-adib": {
    financedBy: "ADIB",
    youPayOver: "4 years",
    segments: [
      { percent: 5, payer: "you", when: "Today" },
      { percent: 15, payer: "you", when: "Months 8–20" },
      { percent: 20, payer: "bank", when: "During construction" },
      { percent: 5, payer: "you", when: "Handover, month 48" },
      { percent: 55, payer: "bank", when: "After handover" },
    ],
  },
};

/* Abu Dhabi (checked October 2026 against ADREC/DARI guidance):
   - Registration is 2% of the price via DARI. By law it's split 50/50 with
     the seller or developer unless the SPA says otherwise, so the full 2%
     shown here is the most a buyer would pay.
   - DARI charges AED 450 + 5% VAT to register an off-plan sale.
   - There's no trustee office fee; that's a Dubai cost.
   - Agency commission is 2%, capped at AED 500,000 (Resolution 183 of
     2017), plus VAT. Off-plan bought from the developer carries none, as
     the developer pays the agent.
   Dubai figures are the long-standing DLD 4%, admin and trustee fees. */
const VAT_RATE = 0.05;
const AGENCY_FEE_RATE = 0.02;
const ABU_DHABI_AGENCY_FEE_CAP_AED = 500_000;
const DARI_ADMIN_FEE_AED = 450 * (1 + VAT_RATE);
const DUBAI_ADMIN_FEE_AED = 580;
const DUBAI_TRUSTEE_FEE_AED = 4_000 * (1 + VAT_RATE);

export type FeeLine = { label: string; amountAed: number };

export type FeeBreakdown = {
  lines: FeeLine[];
  totalUpfrontFeesAed: number;
};

export function calculateFees(
  priceAed: number,
  city: Property["city"],
  status?: Property["status"],
): FeeBreakdown {
  const offPlan = status === "off-plan";
  const lines: FeeLine[] = [];

  if (city === "Abu Dhabi") {
    lines.push({ label: "Registration fee (DARI, 2%, often split with the seller)", amountAed: priceAed * 0.02 });
    lines.push({ label: "DARI admin fee (incl. VAT)", amountAed: DARI_ADMIN_FEE_AED });
  } else {
    lines.push({ label: "Transfer fee (Dubai Land Department, 4%)", amountAed: priceAed * 0.04 });
    lines.push({ label: "DLD admin fee", amountAed: DUBAI_ADMIN_FEE_AED });
    if (!offPlan) lines.push({ label: "Trustee office fee (incl. VAT)", amountAed: DUBAI_TRUSTEE_FEE_AED });
  }

  if (!offPlan) {
    const agencyFeeAed =
      city === "Abu Dhabi"
        ? Math.min(priceAed * AGENCY_FEE_RATE, ABU_DHABI_AGENCY_FEE_CAP_AED)
        : priceAed * AGENCY_FEE_RATE;
    lines.push({ label: "Agency fee (2%)", amountAed: agencyFeeAed });
    lines.push({ label: "VAT on agency fee (5%)", amountAed: agencyFeeAed * VAT_RATE });
  }

  return { lines, totalUpfrontFeesAed: lines.reduce((sum, l) => sum + l.amountAed, 0) };
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
  status?: Property["status"],
): number {
  const firstMilestone = PAYMENT_STRUCTURES[structureId].milestones[0];
  const bookingAed = priceAed * (firstMilestone.percentOfPrice / 100);
  const fees = calculateFees(priceAed, city, status);
  return bookingAed + fees.totalUpfrontFeesAed;
}
