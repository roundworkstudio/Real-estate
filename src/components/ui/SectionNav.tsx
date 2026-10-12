"use client";

import { useEffect, useState } from "react";

/**
 * Vertical tabs pinned to the right edge for a long page. The tab for
 * whichever section sits a quarter of the way down the screen is active.
 * Hidden until `#showAfterId` has scrolled away. Below 1360px there's no
 * margin wide enough for labels, so the tabs shrink to markers in the
 * gutter, which name their section only on hover. Nothing pops out on
 * its own there, since a label in the gutter would land on the text.
 * Lenis (SmoothScrollProvider, `anchors: true`) animates the jumps.
 */
export function SectionNav({
  items,
  showAfterId,
}: {
  items: { id: string; label: string }[];
  showAfterId?: string;
}) {
  const [active, setActive] = useState(items[0]?.id);
  const [shown, setShown] = useState(!showAfterId);

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.find((entry) => entry.isIntersecting);
        if (!hit) return;
        setActive(hit.target.id);
      },
      { rootMargin: "-22% 0px -70% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [items]);

  useEffect(() => {
    const anchor = showAfterId ? document.getElementById(showAfterId) : null;
    if (!anchor) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShown(!entry.isIntersecting),
      { rootMargin: "-20% 0px 0px 0px" },
    );
    observer.observe(anchor);
    return () => observer.disconnect();
  }, [showAfterId]);

  return (
    <nav
      aria-label="On this page"
      inert={!shown}
      className={`fixed right-1 top-1/2 z-30 -translate-y-1/2 transition-[opacity,translate] duration-500 ease-out min-[1360px]:right-6 ${
        shown ? "opacity-100" : "pointer-events-none translate-x-3 opacity-0"
      }`}
    >
      <ul className="liquid-glass-light hidden flex-col gap-0.5 rounded-2xl p-1.5 min-[1360px]:flex">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={active === item.id ? "location" : undefined}
              className={`block whitespace-nowrap rounded-xl px-3.5 py-2 text-sm font-medium transition-colors ${
                active === item.id ? "liquid-pill text-white" : "text-slate/65 hover:text-slate"
              }`}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
      <ul className="flex flex-col min-[1360px]:hidden">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-label={item.label}
              aria-current={active === item.id ? "location" : undefined}
              className="group relative flex h-7 w-5 items-center justify-center"
            >
              <span
                aria-hidden
                className={`block w-1 rounded-full transition-all duration-300 ${
                  active === item.id ? "h-5 bg-slate" : "h-1 bg-slate/30 group-hover:bg-slate/60"
                }`}
              />
              <span
                aria-hidden
                className="liquid-glass-light pointer-events-none absolute right-full top-1/2 mr-1 -translate-y-1/2 translate-x-1 whitespace-nowrap rounded-[4px] px-3 py-1.5 text-xs font-medium tracking-wide text-slate opacity-0 backdrop-blur-xl transition-[opacity,translate] duration-300 ease-out group-hover:translate-x-0 group-hover:opacity-100 max-md:hidden"
              >
                {item.label}
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
