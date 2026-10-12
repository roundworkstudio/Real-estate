"use client";

import { createContext, useContext, useState } from "react";
import type { Property } from "@/lib/types";

/**
 * One picked home shared across a project page, so choosing "5 bed" in
 * Homes also reruns the payment figures below. Outside a provider each
 * caller keeps its own pick.
 */
const SelectedUnitContext = createContext<{ slug: string | null; setSlug: (slug: string) => void } | null>(null);

export function SelectedUnitProvider({ children, className }: { children: React.ReactNode; className?: string }) {
  const [slug, setSlug] = useState<string | null>(null);
  return (
    <SelectedUnitContext.Provider value={{ slug, setSlug }}>
      <div className={className}>{children}</div>
    </SelectedUnitContext.Provider>
  );
}

export function useSelectedUnit(sorted: Property[]) {
  const shared = useContext(SelectedUnitContext);
  const [localSlug, setLocalSlug] = useState(sorted[0].slug);
  const slug = shared ? (shared.slug ?? sorted[0].slug) : localSlug;
  const setSlug = shared ? shared.setSlug : setLocalSlug;
  const home = sorted.find((p) => p.slug === slug) ?? sorted[0];
  return { home, setSlug, isShared: shared !== null };
}
