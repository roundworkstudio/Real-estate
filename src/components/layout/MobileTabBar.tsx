"use client";

import { usePathname } from "next/navigation";
import { navLinks } from "@/lib/nav-links";

/**
 * Bottom pill nav for mobile, adapted from a Uiverse.io menu by mymiamo —
 * same glass-look language as Nav.tsx (translucent matcha tint + inset
 * highlight, no backdrop-filter; see globals.css's .glass-nav note for
 * why). Only rendered below the `md` breakpoint — desktop keeps the top
 * bar's inline links.
 *
 * Eight links don't fit a fixed-width pill, so unlike the reference (which
 * assumes 3-5 items filling the width evenly), each item here has a fixed
 * min-width and the pill scrolls horizontally instead of squeezing them —
 * see .no-scrollbar in globals.css.
 */
export function MobileTabBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary"
      className="glass-nav fixed inset-x-3 bottom-3 z-40 flex gap-1 overflow-x-auto rounded-full border border-white/10 bg-royal-deep/90 p-1.5 no-scrollbar md:hidden"
      style={{ paddingBottom: "calc(0.375rem + env(safe-area-inset-bottom))" }}
    >
      {navLinks.map((l) => {
        const active = pathname === l.href || pathname?.startsWith(`${l.href}/`);
        const Icon = l.icon;
        return (
          <a
            key={l.href}
            href={l.href}
            className={`flex min-w-16 shrink-0 flex-col items-center gap-1 rounded-full px-3 py-2 text-[11px] font-medium transition-colors ${
              active ? "bg-white/15 text-white" : "text-white/70 active:bg-white/10"
            }`}
          >
            <Icon size={18} strokeWidth={1.75} />
            <span>{l.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
