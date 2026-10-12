/**
 * Starting assumptions for renting out a villa on a project page, shared by
 * the rental yield and 5-year growth tabs so both use the same rent.
 * A listing's own `expectedAnnualRentAed` always wins; these only fill gaps.
 *
 * Sources, checked October 2026:
 * - Gross yield 4.5%: Abu Dhabi premium villas yield 4.3–4.8% gross
 *   (Bayut H1 2026: Saadiyat 4.32%; Sands of Wealth, May 2026: Saadiyat
 *   4-bed 4.8%). Hudayriyat has no completed homes yet, so no measured
 *   yield exists; published 5–7% figures are projections.
 * - Service charge AED 8/sqft: Abu Dhabi villa communities run AED 6–20,
 *   e.g. Kayan Villas 2, a comparable off-plan beachfront villa project,
 *   publishes AED 7.5/sqft.
 * - Long-term lease: let 95% of the year, 5% management fee, tenant pays
 *   utilities.
 */
import type { Property } from "./types";
import { calculateYieldStrategy, STRATEGY_DEFAULTS } from "./yieldStrategy";

export const VILLA_GROSS_YIELD = 0.045;
export const VILLA_SERVICE_CHARGE_PER_SQFT_AED = 8;

export function defaultMonthlyRentAed(p: Property) {
  const annual = p.expectedAnnualRentAed ?? p.priceAed * VILLA_GROSS_YIELD;
  return Math.round(annual / 12 / 500) * 500;
}

export function defaultLongTermNetAed(p: Property) {
  const d = STRATEGY_DEFAULTS["long-term"];
  return calculateYieldStrategy({
    priceAed: p.priceAed,
    sqft: p.sqft,
    strategy: "long-term",
    nightlyRateAed: 0,
    monthlyRentAed: defaultMonthlyRentAed(p),
    occupancyPercent: d.occupancyPercent,
    serviceChargePerSqftAed: VILLA_SERVICE_CHARGE_PER_SQFT_AED,
    managementFeePercent: d.managementFeePercent,
    dewaMonthlyAed: d.dewaMonthlyAed,
  }).netAnnualIncomeAed;
}
