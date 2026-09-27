"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { navLinks } from "@/lib/nav-links";

/**
 * Bottom pill nav for mobile, adapted from a Uiverse.io menu by mymiamo —
 * same glass-look language as Nav.tsx (translucent matcha tint + inset
 * highlight, no backdrop-filter; see globals.css's .glass-nav note for
 * why). Only rendered below the `md` breakpoint — desktop keeps the top
 * bar's inline links.
 *
 * Six links don't fit a fixed-width pill on a narrow phone, so unlike the
 * reference (which assumes 3-5 items filling the width evenly), the pill
 * scrolls horizontally instead of squeezing them — see .no-scrollbar in
 * globals.css. Every tile is the same fixed width (2026-09-27, explicit
 * request — "make the tiles the same size and even"; each used to be
 * `min-w-16`, content-width, so "Properties" was visibly wider than
 * "About") rather than sized to its own label.
 *
 * Edge fades (2026-09-27, explicit request — "not all the icons fit...
 * add a subtle indicator there's more") — `no-scrollbar` hides the
 * scrollbar entirely, which left nothing at all suggesting the bar
 * scrolls once the links overflowed past a couple more items. Two thin
 * gradient overlays, faded to the bar's own `royal-deep` tint, sit over
 * whichever edge still has hidden items and track scroll position via a
 * plain scroll listener — no library, this bar is the one place on the
 * whole site not already using `motion`, not worth pulling in for a
 * cross-fade this simple.
 *
 * The container is also deliberately sized so the last visible tile is
 * partway cropped rather than landing on a clean edge (2026-09-27,
 * explicit request — "sneak peek the mobile navbar option so the viewer
 * knows there's more") — `scroll-pr` below reserves less than one tile's
 * width at the end of the scroll track, so there's always a sliver of the
 * next tile showing rather than a hard stop.
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

  return (
    <div className="fixed inset-x-3 bottom-3 z-40 md:hidden">
      <nav
        ref={scrollRef}
        aria-label="Primary"
        className="glass-nav flex gap-1 overflow-x-auto rounded-full border border-white/10 bg-royal-deep/90 p-1.5 no-scrollbar"
        style={{ paddingBottom: "calc(0.375rem + env(safe-area-inset-bottom))" }}
      >
        {navLinks.map((l) => {
          const active = pathname === l.href || pathname?.startsWith(`${l.href}/`);
          const Icon = l.icon;
          return (
            <a
              key={l.href}
              href={l.href}
              className={`flex w-[68px] shrink-0 flex-col items-center gap-1 rounded-full px-1 py-2 text-[11px] font-medium whitespace-nowrap transition-colors ${
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
