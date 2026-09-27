"use client";

import { useId, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";

export type MorphingTabsItem = {
  id: string;
  label: string;
  content: ReactNode;
};

/**
 * Adapted from beui.dev's "Morphing Tabs" block (2026-09-27, explicit
 * request — "clean and tidies up pages"). First pass tried to reproduce
 * the source's fused-tab/panel shape (a dark rail with the active tab
 * growing up and merging into the card via concave corner cutouts), but
 * that read as fussy and imprecise here rather than clean — reverted
 * 2026-09-27 ("inaccurate... need to be clean bubble tabs") to a plain
 * segmented control: a rounded-full rail, a sliding `royal` bubble behind
 * whichever label is active (`layoutId` still does the gliding — that
 * part of the source's interaction survives), sitting as its own element
 * just above the content card rather than welded to it.
 *
 * Dropped drag-to-reorder and closable tabs — those assume an open-ended
 * list of rooms, but every caller here is a fixed 2-item split of a page
 * that used to be two stacked sections. Warm-mono palette throughout
 * (`royal`/`slate`/`canvas`), not the source's dark stage / white card.
 *
 * `value`/`onValueChange` are optional — pass them only when a caller
 * needs to pick the initial tab itself (e.g. from a URL hash); otherwise
 * this manages its own state.
 */
export function MorphingTabs({
  items,
  value,
  onValueChange,
  ariaLabel = "Tabs",
  className = "",
}: {
  items: MorphingTabsItem[];
  value?: string;
  onValueChange?: (id: string) => void;
  ariaLabel?: string;
  className?: string;
}) {
  const layoutId = useId();
  const [internalValue, setInternalValue] = useState(items[0]?.id);
  const active = value ?? internalValue;
  const activeItem = items.find((i) => i.id === active) ?? items[0];

  function select(id: string) {
    setInternalValue(id);
    onValueChange?.(id);
  }

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label={ariaLabel}
        className="inline-flex gap-1 rounded-full bg-slate/5 p-1"
      >
        {items.map((item) => {
          const isActive = item.id === active;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => select(item.id)}
              className="relative rounded-full px-5 py-2 text-sm font-medium"
            >
              {isActive && (
                <motion.span
                  layoutId={`${layoutId}-bubble`}
                  className="absolute inset-0 rounded-full bg-royal"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span
                className={`relative z-10 transition-colors ${
                  isActive ? "text-white" : "text-slate/60 hover:text-slate"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      <div className="relative mt-4 overflow-hidden rounded-2xl bg-canvas shadow-card">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeItem?.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {activeItem?.content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
