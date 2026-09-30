"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { animate } from "motion";
import { navLinks } from "@/lib/nav-links";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Bottom pill nav for mobile, adapted from a Uiverse.io menu by mymiamo —
 * same glass-look language as Nav.tsx (translucent matcha tint + inset
 * highlight, no backdrop-filter; see globals.css's .glass-nav note for
 * why). Only rendered below the `md` breakpoint — desktop keeps the top
 * bar's inline links.
 *
 * The five links fit on most phones. On narrower screens the pill scrolls
 * horizontally instead of squeezing them — see .no-scrollbar in
 * globals.css. Every tile is the same fixed width (2026-09-27, explicit
 * request — "make the tiles the same size and even"; each used to be
 * `min-w-16`, content-width, so "Properties" was visibly wider than
 * "About") rather than sized to its own label.
 *
 * Three ways this bar signals "there's more" past the visible edge, all
 * from the same explicit requests ("not all the icons fit... add a
 * subtle indicator", then "sneak peak... a gesture to scroll across"):
 * 1. Edge fades — `no-scrollbar` hides the scrollbar entirely, which left
 *    nothing suggesting the bar scrolls. Two thin gradient overlays,
 *    faded to the bar's own `royal-deep` tint, sit over whichever edge
 *    still has hidden items and track scroll position via a plain scroll
 *    listener — no library, this bar is the one place on the whole site
 *    not already using `motion`, not worth pulling in for a fade this
 *    simple.
 * 2. Equal tile widths keep the labels aligned and allow a partial next
 *    tab to show when the viewport is too narrow for all five.
 * 3. A recurring scroll nudge (2026-09-27, "slide the bar back and forth
 *    ever so slightly every 5 seconds" — was a one-off on mount before
 *    this) — every 5s, if there's still anything to scroll to, the bar
 *    eases 10px in whichever direction has room and back to wherever it
 *    already was. Relative to the current scroll position rather than a
 *    fixed 0/28, so it doesn't fight wherever the visitor has actually
 *    scrolled to. Skipped under `prefers-reduced-motion`.
 *
 *    Animated with `motion`'s standalone `animate()` (2026-09-27, "more
 *    jiggly — more smooth less rigid — like a glide") driving `scrollLeft`
 *    directly, not `element.scrollTo({behavior:"smooth"})` — the native
 *    smooth-scroll only offers one fixed browser-defined ease curve, no
 *    spring/bounce control, which read as mechanical rather than a glide.
 *    A soft, underdamped spring (low stiffness, low damping) gives it a
 *    slight organic overshoot on both legs instead. Worth the import
 *    here specifically since this is the one motion this bar needed
 *    physics-like easing for — everywhere else on the bar stayed plain
 *    CSS transitions.
 */
export function MobileTabBar() {
  const pathname = usePathname();
  const scrollRef = useRef<HTMLElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    function update() {
      if (!el) return;
      setCanScrollLeft(el.scrollLeft > 4);
      setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    }

    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const spring = { type: "spring", stiffness: 200, damping: 14, mass: 0.6 } as const;
    let controls: ReturnType<typeof animate> | undefined;

    const interval = window.setInterval(() => {
      if (prefersReducedMotion()) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (maxScroll <= 4) return;

      const start = el.scrollLeft;
      const delta = 10;
      const target = start + delta <= maxScroll ? start + delta : Math.max(0, start - delta);

      controls = animate(start, target, {
        ...spring,
        onUpdate: (v) => {
          el.scrollLeft = v;
        },
        onComplete: () => {
          controls = animate(target, start, {
            ...spring,
            onUpdate: (v) => {
              el.scrollLeft = v;
            },
          });
        },
      });
    }, 5000);

    return () => {
      window.clearInterval(interval);
      controls?.stop();
    };
  }, []);

  return (
    <div className="fixed inset-x-3 bottom-3 z-40 md:hidden">
      <nav
        ref={scrollRef}
        aria-label="Primary"
        className="glass-nav flex gap-0.5 overflow-x-auto rounded-full border border-white/10 bg-royal-deep/90 p-1.5 no-scrollbar min-[350px]:justify-center"
        style={{ paddingBottom: "calc(0.375rem + env(safe-area-inset-bottom))" }}
      >
        {navLinks.map((l) => {
          const active = pathname === l.href || pathname?.startsWith(`${l.href}/`);
          const Icon = l.icon;
          return (
            <a
              key={l.href}
              href={l.href}
              className={`flex w-[61px] shrink-0 flex-col items-center gap-1 rounded-full py-2 text-[11px] font-medium whitespace-nowrap transition-colors ${
                active ? "bg-white/15 text-white" : "text-white/70 active:bg-white/10"
              }`}
            >
              <Icon size={18} strokeWidth={1.75} />
              <span>{l.label}</span>
            </a>
          );
        })}
      </nav>
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-y-0 left-0 w-8 rounded-l-full bg-gradient-to-r from-royal-deep/90 to-transparent transition-opacity duration-200 ${
          canScrollLeft ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-y-0 right-0 w-8 rounded-r-full bg-gradient-to-l from-royal-deep/90 to-transparent transition-opacity duration-200 ${
          canScrollRight ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
