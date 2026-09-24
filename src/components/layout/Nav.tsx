"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useMagnetic, useScrollingFlag } from "@/lib/motion";
import { navLinks } from "@/lib/nav-links";

/**
 * Fixed header that morphs on scroll: fully transparent/blend-in over the
 * hero at the top of the page, matcha-tinted glass bar past ~80px. Text
 * stays white in both states — the scrolled bar is a dark matcha tint
 * (royal-deep), not a light one, specifically so `.glass-nav`'s inset
 * highlight (light catching the top edge) actually reads against it; the
 * same highlight on a light bar would be white-on-near-white.
 *
 * Rounded and inset from the viewport edges at all times (not just when
 * scrolled) — a floating pill, matching MobileTabBar's shape language for
 * the same bar's mobile equivalent. It's rounded in both states so
 * scrolling only ever morphs colour/opacity, never the shape itself —
 * changing the inset/radius only on scroll would shift the logo, links
 * and button position at the same moment the color changes, which reads
 * as a jump rather than a morph.
 *
 * Deliberately a translucent solid background, not `backdrop-filter:
 * blur()` — directives/anti-slop-ui.md bans backdrop-filter on
 * fixed/sticky elements outright ("Content scrolling beneath it lags" —
 * measured on the first build attempt). CurrencyVisaToolbar already
 * established the same solid-bg workaround for a sticky bar; `.glass-nav`
 * (box-shadow only, not blur — see globals.css) carries the "glassy" look
 * instead.
 *
 * Mounts useScrollingFlag here rather than in a separate root component —
 * Nav is already the one thing every page renders, so it's the natural
 * single mount point for a site-wide effect.
 */
export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const bookACallRef = useMagnetic<HTMLButtonElement>();
  useScrollingFlag();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 80);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-3 top-3 z-30 flex items-center justify-between rounded-2xl border px-6 py-5 transition-colors duration-300 sm:inset-x-6 sm:top-4 sm:px-8 ${
        scrolled
          ? "glass-nav border-white/10 bg-royal-deep/85 shadow-card"
          : "border-transparent bg-transparent"
      }`}
    >
      {/* Wordmark placeholder — real logo pending, see brand-guidelines.md */}
      <a href="/" className="text-lg font-semibold text-white">
        Janvi
      </a>
      <nav className="hidden items-center gap-8 md:flex">
        {navLinks.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="text-sm text-white/80 transition-colors hover:text-white"
          >
            {l.label}
          </a>
        ))}
      </nav>
      <Button ref={bookACallRef} variant="primary" className="text-sm">
        Book a call
      </Button>
    </header>
  );
}
