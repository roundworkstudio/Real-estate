"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { navLinks } from "@/lib/nav-links";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Bottom pill nav for mobile, adapted from a Uiverse.io menu by mymiamo —
 * same glass-look language as Nav.tsx (translucent matcha tint + inset
 * highlight, no backdrop-filter; see globals.css's .glass-nav note for
 * why). Only rendered below the `md` breakpoint — desktop keeps the top
 * bar's inline links.
 *
 * Seven links (six on desktop — see nav-links.ts's "Home" note) don't fit
 * a fixed-width pill on a narrow phone, so unlike the reference (which
 * assumes 3-5 items filling the width evenly), the pill scrolls
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
 * 2. A genuine sneak peek — tile width + gap are tuned (2026-09-27,
 *    "make it show 5 1/2 icons") so a 375px-wide phone shows exactly
 *    5.5 tiles: five in full, a sixth cropped clean down the middle,
 *    rather than an incidental few-pixel sliver from whatever the width
 *    happened to divide down to.
 * 3. A one-time scroll nudge — 700ms after mount, if there's anything to
 *    scroll to, the bar eases a few pixels right and back on its own
 *    (native smooth-scroll, no manual animation loop). A still image only
 *    communicates "cropped," not "scrollable"; a single small motion
 *    reads as a gesture hint without nagging on every visit. Skipped
 *    under `prefers-reduced-motion`.
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
    if (!el || prefersReducedMotion()) return;
    if (el.scrollWidth <= el.clientWidth + 4) return;

    let nudgeBack: number;
    const nudgeOut = window.setTimeout(() => {
      el.scrollTo({ left: 28, behavior: "smooth" });
      nudgeBack = window.setTimeout(() => {
        el.scrollTo({ left: 0, behavior: "smooth" });
      }, 450);
    }, 700);

    return () => {
      window.clearTimeout(nudgeOut);
      window.clearTimeout(nudgeBack);
    };
  }, []);

  return (
    <div className="fixed inset-x-3 bottom-3 z-40 md:hidden">
      <nav
        ref={scrollRef}
        aria-label="Primary"
        className="glass-nav flex gap-0.5 overflow-x-auto rounded-full border border-white/10 bg-royal-deep/90 p-1.5 no-scrollbar"
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
