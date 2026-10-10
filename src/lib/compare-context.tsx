"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { sampleProperties } from "@/lib/sample-properties";
import type { Property } from "@/lib/types";

const STORAGE_KEY = "janvi-compare-slugs";
export const COMPARE_LIMIT = 3;

type CompareContextValue = {
  slugs: string[];
  properties: Property[];
  toggle: (slug: string) => void;
  has: (slug: string) => boolean;
  clear: () => void;
  open: boolean;
  setOpen: (open: boolean) => void;
};

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as unknown;
        if (Array.isArray(parsed)) {
          // Restoring from sessionStorage after hydration: an external
          // system, not derivable during render without a mismatch.
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setSlugs(
            parsed.filter(
              (slug): slug is string =>
                typeof slug === "string" &&
                sampleProperties.some((p) => p.slug === slug),
            ).slice(0, COMPARE_LIMIT),
          );
        }
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
  }, [ready, slugs]);

  const toggle = useCallback((slug: string) => {
    setSlugs((current) => {
      if (current.includes(slug)) {
        const next = current.filter((item) => item !== slug);
        if (next.length < 2) setOpen(false);
        return next;
      }
      if (current.length >= COMPARE_LIMIT) return current;
      return [...current, slug];
    });
  }, []);

  const has = useCallback((slug: string) => slugs.includes(slug), [slugs]);

  const clear = useCallback(() => {
    setSlugs([]);
    setOpen(false);
  }, []);

  const properties = useMemo(
    () =>
      slugs
        .map((slug) => sampleProperties.find((p) => p.slug === slug))
        .filter((p): p is Property => Boolean(p)),
    [slugs],
  );

  const value = useMemo<CompareContextValue>(
    () => ({ slugs, properties, toggle, has, clear, open, setOpen }),
    [slugs, properties, toggle, has, clear, open],
  );

  return (
    <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
  );
}

export function useCompare(): CompareContextValue {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within a CompareProvider");
  return ctx;
}
