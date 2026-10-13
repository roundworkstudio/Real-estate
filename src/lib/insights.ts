/**
 * Figures shown on the Insights page. Every number here has a named source
 * and an "as of" date; update both together. Fee amounts are not repeated
 * here: the page computes them from lib/paymentPlan.ts so they always match
 * the calculators.
 */

export const INSIGHTS_AS_OF = "October 2026";

export type BoardRow = { label: string; value: string; note: string };

export const MARKET_BOARD: BoardRow[] = [
  { label: "Villa values", value: "+12% Y/Y", note: "Abu Dhabi villa capital values, year to Q2 2026 (ValuStrat)" },
  { label: "Villa yields", value: "4.3-4.8%", note: "Gross rental yield, premium villa communities (Bayut H1 2026; Sands of Wealth)" },
  { label: "Registration", value: "2% DARI", note: "Abu Dhabi transfer fee on the price, set by ADREC" },
  { label: "Service charge", value: "AED 6-20", note: "Per sqft a year, typical range for Abu Dhabi villa communities" },
];

export type Takeaway = { title: string; emphasis: string; body: string };

export const TAKEAWAYS: Takeaway[] = [
  {
    title: "Price growth is doing the",
    emphasis: "heavy lifting",
    body: "Premium villas yield 4.3–4.8% gross, which comes to roughly 3.5–4% after service charges and management. Most of the return has come from rising values, so buy for location and build quality rather than rental income.",
  },
  {
    title: "Don’t plan on",
    emphasis: "12% a year",
    body: "Villa values rose about 12% in the year to mid-2026. Growth usually slows over a five to ten year hold, so the calculators below start at 5% a year and let you test anything from 2.5% to 8.5%.",
  },
  {
    title: "Off-plan changes the",
    emphasis: "cash flow",
    body: "On a plan like Wadeem Gardens’ you fund 25% over about four years and the bank funds the other 75%. There’s no rent until you get the keys, so budget for the years in between.",
  },
];

export type BuyingStep = { title: string; body: string };

export const OFF_PLAN_STEPS: BuyingStep[] = [
  {
    title: "Reserve the home",
    body: "Pay the booking amount (5% on Wadeem Gardens) and sign the reservation form. Janvi checks the unit, price and plan against the developer’s current price list first.",
  },
  {
    title: "Sign the SPA and register",
    body: "The sale and purchase agreement fixes the payment schedule and who pays the 2% registration fee. The contract is then registered on DARI, Abu Dhabi’s property platform.",
  },
  {
    title: "Pay as it’s built",
    body: "Instalments follow the SPA schedule and go into the project’s escrow account, not straight to the developer. On Wadeem Gardens you pay three 5% instalments by month 20, and ADIB funds 20% during construction.",
  },
  {
    title: "Handover",
    body: "You pay the last 5% at handover, around month 48 on Wadeem Gardens, and ADIB finances the remaining 55%. You inspect the home for snags before taking the keys and the title deed.",
  },
  {
    title: "Move in or let it",
    body: "Rent starts from handover. Long-term leases in Abu Dhabi are registered on Tawtheeq, which protects you and your tenant.",
  },
];

export const SOURCES = [
  "ValuStrat Abu Dhabi Real Estate Review, Q2 2026: villa capital values.",
  "Bayut Abu Dhabi Sales Market Report, H1 2026; Sands of Wealth, May 2026: villa gross yields.",
  "Abu Dhabi Real Estate Centre (ADREC) and DARI: registration, admin and agency fee rules.",
  "Dubai Land Department: Dubai transfer, admin and trustee fees.",
];
