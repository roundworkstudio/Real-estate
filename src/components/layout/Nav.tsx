"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { useScrollingFlag } from "@/lib/motion";
import { navLinks } from "@/lib/nav-links";
import { PLACEHOLDER_TEL_URL } from "@/lib/site-config";

/**
 * Fixed header that morphs on scroll: fully transparent/blend-in over the
 * hero at the top of the page, matcha-tinted glass bar past ~80px. Text
 * stays white in both states — the scrolled bar is a dark matcha tint
 * (royal-deep), not a light one, specifically so `.glass-nav`'s inset
 * highlight (light catching the top edge) actually reads against it; the
 * same highlight on a light bar would be white-on-near-white.
 *
 * Inset from the viewport edges at all times, rounded-2xl by default and
 * morphing to a full pill (rounded-full) once scrolled — explicit request
 * 2026-09-27, overriding this component's earlier stance (see git history)
 * that the shape should never change, only colour/opacity, to avoid a
 * jump. In practice `border-radius` transitions smoothly like any other
 * property here (`transition-[border-radius,...]` below) and nothing else
 * shifts — padding and content positions are unchanged, so it reads as a
 * morph, not a jump. Matches MobileTabBar's shape language, which is
 * already a full pill at all times.
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
 *
 * Desktop link hover treatment (2026-09-27) — pill fill + shine sweep +
 * lift on each link — is the `.nav-link` class in globals.css, adapted
 * from a pasted reference navbar. See that rule's own comment for what was
 * and wasn't carried over.
 *
 * Hidden below `md` (2026-09-27, explicit request) — MobileTabBar already
 * covers every link from the same `lib/nav-links.ts` list at the bottom of
 * the screen, so this top bar was redundant chrome on mobile (just the
 * logo + a "Book a call" button neither of which had room to earn their
 * keep at that width). Contact actions remain available in the page content.
 *
 * The nine inner pages that wrap this in their own `bg-slate` block (to
 * centre it vertically — see each page's own `h-28` comment) hide that
 * wrapper on mobile too (2026-09-27, explicit request — "remove the brown
 * menu bar from the top" on mobile): `Nav` disappearing below `md` still
 * left an empty `bg-slate` block behind, since only `Nav` itself had the
 * `hidden md:grid` — the wrapper didn't know to go with it.
 *
 * The wordmark links home, so the page links do not repeat it.
 *
 * Three-column grid, not `flex justify-between` (2026-09-27, fixed after
 * the links visibly sat left-of-centre with a much bigger gap before the
 * button than after the logo). `justify-between` only equalises the *gaps*
 * between three flex children — with a narrow logo and a wider button,
 * that pins the middle nav off-centre, not centred in the bar. A
 * `[1fr_auto_1fr]` grid instead sizes the two outer columns off whatever's
 * left after the (auto-width) nav column, so the links land in the actual
 * centre of the bar regardless of how the logo and button compare in width.
 *
 * The stacked wordmark occupies the left column. The nav links and CTA
 * remain centred against it in the 80px-tall header.
 *
 * "Book a call" carries the green pulsing dot now, not WhatsAppFloating
 * Button (2026-09-27, explicit request — moved from one to the other).
 * Same `.pulse-dot`/WhatsApp-green exception as WhatsAppBanner's response-
 * time dot (see that component's note); a phone line doesn't have its own
 * brand green the way WhatsApp does, but the "live/available now" meaning
 * is the same, so it reuses the same treatment rather than inventing a
 * second one. `px-6`, not the shared Button's default `px-5`, so the dot
 * reads as deliberately placed rather than cramped against the label.
 */
export function Nav() {
  const [scrolled, setScrolled] = useState(false);
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
      className={`fixed inset-x-3 top-3 z-30 hidden border px-6 py-2 transition-[border-radius,background-color,border-color,box-shadow] duration-300 sm:inset-x-6 sm:top-4 sm:px-8 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center ${
        scrolled
          ? "glass-nav rounded-full border-white/10 bg-royal-deep/85 shadow-card"
          : "rounded-2xl border-transparent bg-transparent"
      }`}
    >
      <Link href="/" className="flex h-16 items-center">
        <Image
          src="/brand/logo-desktop-light.svg"
          alt="Property with Janvi"
          width={600}
          height={315}
          priority
          className="h-16 w-auto"
        />
      </Link>
      <nav className="hidden h-10 items-center gap-1 md:flex">
        {navLinks.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="nav-link flex h-10 items-center px-3.5 text-sm text-white/80 hover:text-white"
          >
            {l.label}
          </a>
        ))}
      </nav>
      <Button
        href={PLACEHOLDER_TEL_URL}
        variant="primary"
        className="h-10 justify-self-end px-6 text-sm"
      >
        <span className="pulse-dot h-2 w-2 rounded-full bg-[#25D366]" />
        Book a call
      </Button>
    </header>
  );
}
