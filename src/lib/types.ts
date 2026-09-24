/**
 * Property model — minimal subset needed for homepage listing cards.
 * Field names match docs/property-page-spec.md so the full detail-page
 * model (investment analysis, off-plan fields, building context) extends
 * this rather than diverging from it. See PROJECT-BRIEF.md: build against
 * one typed Property model behind a single data-access module so the
 * listings source (manual, brokerage feed, or portal API) can be swapped
 * without touching page code.
 */
export type PropertyStatus = "new" | "under-offer" | "sold" | "off-plan";

/**
 * Investor-facing strategy tag, for the portfolio filter. Deliberately
 * scoped to what fits a solo agent selling/letting real listings — not a
 * fund's deal classification. "Fully subscribed" / "exited" style status
 * language belongs to a syndication vehicle raising pooled capital, which
 * isn't this business (see CONTENT-CHECKLIST.md's confirmed services:
 * buying, selling, letting, investment — no fund/sponsor role).
 */
export type PropertyStrategy =
  | "yield"
  | "off-plan"
  | "value-add"
  | "str"
  | "commercial";

export type Property = {
  slug: string;
  title: string;
  community: string;
  city: "Abu Dhabi" | "Dubai";
  priceAed: number;
  beds: number;
  /** Optional because it isn't always disclosed by the source (e.g. a
   * developer brochure that gives bedroom count and GSA but never states
   * bathroom count) — omit rather than guess a plausible-sounding number,
   * same rule as leaving grossYield/expectedAnnualRentAed null. */
  baths?: number;
  sqft: number;
  /** Plot area, for villas — distinct from `sqft` (gross saleable/built-up
   * area). Optional: meaningless for an apartment. */
  plotSqft?: number;
  status: PropertyStatus;
  strategy: PropertyStrategy;
  /** Gross yield, e.g. 0.061 for 6.1%. Null when not yet known for this listing. */
  grossYield: number | null;
  /** docs/property-page-spec.md: "Client enters, or from comparable listings." */
  expectedAnnualRentAed: number | null;
  image: { src: string; alt: string };
  /** Additional gallery images, for the property detail page. */
  gallery?: { src: string; alt: string }[];
};

export function pricePerSqft(p: Property): number {
  return Math.round(p.priceAed / p.sqft);
}
