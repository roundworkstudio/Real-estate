"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { prefersReducedMotion } from "@/lib/motion";

export type BouncyAccordionItem = {
  id: string;
  title: string;
  description?: string;
  /** A rendered icon element (e.g. `<TrendingUp size={18} />`), not a
   * component reference — callers on the server (property page is a
   * Server Component) can't pass a Lucide component function as a plain
   * prop across the server/client boundary, only already-rendered
   * elements. */
  icon?: ReactNode;
  content: ReactNode;
};

const spring = { type: "spring", stiffness: 260, damping: 26, mass: 0.9 } as const;

/**
 * Adapted from beui.dev's "Bouncy Accordion" block (2026-09-27, explicit
 * request — "where applicable use this", pointing at
 * `bunx --bun shadcn add @beui/bouncy-accordion`) — single-open accordion,
 * spring-driven expand instead of a linear ease, rebuilt on this site's
 * own primitives (`motion/react`, already a dependency — see
 * MorphingTabs/MarketCard) rather than installed from shadcn.
 *
 * Used on the property detail page to collapse its four deep-dive tools
 * (yield strategy, hold model, payment plan, before/after) — see that
 * page's own note on why those four specifically, not the whole page.
 * Unboxed rows (`divide-y`, no card background) rather than a bordered
 * accordion panel, matching this site's general "no container sprawl"
 * rule for anything that isn't a listing card.
 *
 * Falls back to an instant (no-spring) expand under
 * `prefers-reduced-motion`, per the source component's own accessibility
 * note.
 */
export function BouncyAccordion({
  items,
  value,
  defaultValue = null,
  onValueChange,
  collapsible = true,
  className = "",
}: {
  items: BouncyAccordionItem[];
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  collapsible?: boolean;
  className?: string;
}) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const active = value !== undefined ? value : internalValue;
  const transition = prefersReducedMotion() ? { duration: 0 } : spring;

  function toggle(id: string) {
    const next = active === id ? (collapsible ? null : active) : id;
    setInternalValue(next);
    onValueChange?.(next);
  }

  return (
    <div className={`divide-y divide-slate/10 border-t border-b border-slate/10 ${className}`}>
      {items.map((item) => {
        const isOpen = active === item.id;
        return (
          <div key={item.id}>
            <button
              type="button"
              onClick={() => toggle(item.id)}
              aria-expanded={isOpen}
              className="flex w-full items-center gap-3 py-4 text-left sm:gap-4 sm:py-5"
            >
              {item.icon && (
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-colors sm:h-10 sm:w-10 ${
                    isOpen ? "bg-royal text-white" : "bg-slate/5 text-slate/60"
                  }`}
                >
                  {item.icon}
                </span>
              )}
              <span className="flex-1">
                <span className="block text-base font-semibold text-slate sm:text-lg">{item.title}</span>
                {item.description && (
                  <span className="mt-0.5 block text-sm text-slate/60">{item.description}</span>
                )}
              </span>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={transition}
                className="shrink-0 text-slate/40"
              >
                <ChevronDown size={18} />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={transition}
                  className="overflow-hidden"
                >
                  <div className="pb-8 sm:pl-14">{item.content}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
