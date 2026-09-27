import type { Property } from "./types";
import { pricePerSqft } from "./types";

export type MarketSnapshotOutcome = {
  id: string;
  label: string;
  value: string;
  sharePercent: number;
  tone?: "royal" | "sovereign";
};

export type MarketSnapshotCard = {
  id: string;
  category: string;
  title: string;
  status: string;
  volume: string;
  outcomes: MarketSnapshotOutcome[];
};

function avg(nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function formatAed(n: number): string {
  return `AED ${Math.round(n).toLocaleString("en-AE")}`;
}

/**
 * Three real, derived cuts of `sampleProperties` — by community, by
 * investor strategy tag, and by price bracket — built for MarketCard's
 * outcome-bar layout. Every count, average, and share here comes straight
 * out of the property list at render time; nothing is invented, so the
 * bars can't drift out of sync with the data (see MarketCard's own note
 * on why this exists instead of a price-direction forecast).
 */
export function buildMarketSnapshotCards(properties: Property[]): MarketSnapshotCard[] {
  const total = properties.length;

  const byCommunity = new Map<string, Property[]>();
  for (const p of properties) {
    byCommunity.set(p.community, [...(byCommunity.get(p.community) ?? []), p]);
  }
  const communities = [...byCommunity.entries()].sort((a, b) => b[1].length - a[1].length);

  const offPlanCount = properties.filter((p) => p.status === "off-plan").length;
  const readyCount = total - offPlanCount;

  const priceBracketAed = 9_000_000;
  const underBracket = properties.filter((p) => p.priceAed < priceBracketAed).length;
  const overBracket = total - underBracket;

  return [
    {
      id: "by-community",
      category: "Sample",
      title: "Listings by community",
      status: `${total} sample listings`,
      volume: "Share of current sample inventory, by community.",
      outcomes: communities.map(([community, list], i) => ({
        id: community,
        label: community,
        value: `${list.length} · ${formatAed(avg(list.map(pricePerSqft)))}/sqft avg`,
        sharePercent: Math.round((list.length / total) * 100),
        tone: i === 0 ? "royal" : "sovereign",
      })),
    },
    {
      id: "by-strategy",
      category: "Sample",
      title: "Off-plan vs. ready",
      status: `${total} sample listings`,
      volume: "Split of current sample inventory by delivery status.",
      outcomes: [
        {
          id: "off-plan",
          label: "Off-plan",
          value: `${offPlanCount} listing${offPlanCount === 1 ? "" : "s"}`,
          sharePercent: Math.round((offPlanCount / total) * 100),
          tone: "royal",
        },
        {
          id: "ready",
          label: "Ready / new",
          value: `${readyCount} listing${readyCount === 1 ? "" : "s"}`,
          sharePercent: Math.round((readyCount / total) * 100),
          tone: "sovereign",
        },
      ],
    },
    {
      id: "by-price",
      category: "Sample",
      title: "Price brackets",
      status: `${total} sample listings`,
      volume: `Split at ${formatAed(priceBracketAed)}.`,
      outcomes: [
        {
          id: "under",
          label: `Under ${formatAed(priceBracketAed)}`,
          value: `${underBracket} listing${underBracket === 1 ? "" : "s"}`,
          sharePercent: Math.round((underBracket / total) * 100),
          tone: "royal",
        },
        {
          id: "over",
          label: `${formatAed(priceBracketAed)}+`,
          value: `${overBracket} listing${overBracket === 1 ? "" : "s"}`,
          sharePercent: Math.round((overBracket / total) * 100),
          tone: "sovereign",
        },
      ],
    },
  ];
}
