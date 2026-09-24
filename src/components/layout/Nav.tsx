"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useMagnetic, useScrollingFlag } from "@/lib/motion";

const links = [
  { href: "/properties", label: "Properties" },
  // Index not yet in SITEMAP.md (only /developments/[slug] is planned
  // there) — see app/developments/page.tsx's top comment.
  { href: "/developments", label: "Projects" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/areas", label: "Areas" },
  { href: "/insights", label: "Insights" },
  { href: "/about", label: "About" },
  // Not yet in SITEMAP.md — see app/invest/page.tsx's top comment.
  { href: "/invest", label: "Invest" },
  // Not yet in SITEMAP.md — see app/analytics/page.tsx's top comment.
  { href: "/analytics", label: "Analytics" },
];

/**
 * Fixed header that morphs on scroll: transparent/blend-in over the hero
 * at the top of the page, solid canvas bar past ~80px. Deliberately a
 * solid background, not `backdrop-filter: blur()` — directives/
 * anti-slop-ui.md bans backdrop-filter on fixed/sticky elements outright
 * ("Content scrolling beneath it lags" — measured on the first build
 * attempt). CurrencyVisaToolbar already established the same solid-bg
 * workaround for a sticky bar; this is the same trick for the header.
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
      className={`fixed inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-6 transition-colors duration-300 sm:px-10 ${
        scrolled ? "bg-canvas/95 shadow-card" : "bg-transparent"
      }`}
    >
      {/* Wordmark placeholder — real logo pending, see brand-guidelines.md */}
      <a
        href="/"
        className={`text-lg font-semibold transition-colors duration-300 ${
          scrolled ? "text-slate" : "text-white"
        }`}
      >
        Janvi
      </a>
      <nav className="hidden items-center gap-8 md:flex">
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className={`text-sm transition-colors duration-300 ${
              scrolled ? "text-slate/70 hover:text-slate" : "text-white/80 hover:text-white"
            }`}
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
