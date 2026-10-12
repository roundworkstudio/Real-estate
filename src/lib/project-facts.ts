import type { Development } from "./developments";
import type { Property } from "./types";

/** "5 bed", or "5 bed · 4,200 sqft" when the project lists two 5-beds. */
export function unitLabel(property: Property, all: Property[]): string {
  const base = `${property.beds} bed`;
  const twins = all.filter((p) => p.beds === property.beds).length > 1;
  return twins ? `${base} · ${property.sqft.toLocaleString("en-AE")} sqft` : base;
}

/** Every listing in the project is already built. */
export function isReady(d: Development): boolean {
  return d.properties.every((p) => p.status !== "off-plan");
}

export function statusLabel(d: Development): string {
  if (d.meta?.salesStatus) return d.meta.salesStatus;
  const offPlan = d.properties.filter((p) => p.status === "off-plan").length;
  if (offPlan === d.properties.length) return "Off-plan";
  return offPlan === 0 ? "Ready to move" : "Off-plan & ready";
}

export function bedRange(d: Development): string {
  const beds = d.properties.map((p) => p.beds);
  const min = Math.min(...beds);
  const max = Math.max(...beds);
  return min === max ? `${min}` : `${min}–${max}`;
}

export function handoverShort(d: Development): string {
  return d.meta?.handoverShort ?? (isReady(d) ? "Ready" : "TBC");
}

/** Percent built, or null when there's no figure to show. */
export function builtPercent(d: Development): { percent: number; isSample: boolean } | null {
  if (d.meta?.construction) return d.meta.construction;
  return isReady(d) ? { percent: 100, isSample: false } : null;
}
