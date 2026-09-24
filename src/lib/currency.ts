/**
 * Multi-currency conversion for the analytics suite. Rates are fixed and
 * illustrative — not a live feed — so every figure they touch should read
 * as "approximate", not as a quote. AED is the source of truth throughout
 * the rest of the site (UAE market, per brand-guidelines.md); this module
 * only converts for display inside the analytics suite.
 */
export type CurrencyCode = "AED" | "USD" | "EUR" | "GBP" | "INR" | "USDT" | "BTC";

export const CURRENCIES: { code: CurrencyCode; label: string }[] = [
  { code: "AED", label: "AED" },
  { code: "USD", label: "USD" },
  { code: "EUR", label: "EUR" },
  { code: "GBP", label: "GBP" },
  { code: "INR", label: "INR" },
  { code: "USDT", label: "USDT" },
  { code: "BTC", label: "BTC" },
];

/** Units of each currency per 1 AED. Fixed, illustrative — AED is pegged to
 * USD at 3.6725; the rest are approximate market rates as of this build,
 * not refreshed live. */
const UNITS_PER_AED: Record<CurrencyCode, number> = {
  AED: 1,
  USD: 1 / 3.6725,
  EUR: 1 / 3.98,
  GBP: 1 / 4.64,
  INR: 22.6,
  USDT: 1 / 3.6725,
  BTC: 1 / 3.6725 / 65_000,
};

const DECIMALS: Record<CurrencyCode, number> = {
  AED: 0,
  USD: 0,
  EUR: 0,
  GBP: 0,
  INR: 0,
  USDT: 0,
  BTC: 6,
};

export function convert(amountAed: number, currency: CurrencyCode): number {
  return amountAed * UNITS_PER_AED[currency];
}

export function formatCurrency(amountAed: number, currency: CurrencyCode): string {
  const value = convert(amountAed, currency);
  const formatted = value.toLocaleString("en-US", {
    minimumFractionDigits: DECIMALS[currency],
    maximumFractionDigits: DECIMALS[currency],
  });
  if (currency === "BTC") return `₿${formatted}`;
  return `${currency} ${formatted}`;
}

/** UAE federal rule, applied uniformly regardless of emirate: a single
 * property purchase at or above this price qualifies for the 10-year
 * Golden Visa (real estate route). */
export const GOLDEN_VISA_THRESHOLD_AED = 2_000_000;

export function goldenVisaStatus(priceAed: number): {
  eligible: boolean;
  shortfallAed: number;
} {
  const eligible = priceAed >= GOLDEN_VISA_THRESHOLD_AED;
  return { eligible, shortfallAed: eligible ? 0 : GOLDEN_VISA_THRESHOLD_AED - priceAed };
}
