"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageSquare } from "lucide-react";
import { BUBBLE_POP, useScrollBubble } from "@/lib/use-scroll-bubble";

/**
 * Compact mobile wordmark pill; the bottom tab bar remains the page nav.
 * After the page begins scrolling, a contact bubble pops in beside the
 * wordmark and the pair glides to centre; scrolling back to the top bursts
 * the bubble and the wordmark glides back (see .nav-bubble in globals.css).
 */
export function MobileTopBar() {
  const { phase, onBubbleAnimationEnd } = useScrollBubble();
  const shown = phase === "shown";

  return (
    <header className="mobile-top-bar pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center md:hidden">
      <div className="flex items-center">
        <Link
          href="/"
          className="glass-nav pointer-events-auto relative z-10 flex h-12 shrink-0 items-center justify-center rounded-full border border-white/10 bg-royal-deep/80 px-4 shadow-card"
        >
          <Image
            src="/brand/logo-mobile-light.svg"
            alt="Property with Janvi"
            width={690}
            height={135}
            preload
            className="h-auto w-[min(44vw,170px)]"
          />
        </Link>

        <Link
          href="/contact"
          aria-label="Contact Janvi"
          aria-hidden={!shown}
          tabIndex={shown ? 0 : -1}
          data-state={phase}
          data-pop={BUBBLE_POP}
          onAnimationEnd={onBubbleAnimationEnd}
          className={`nav-bubble glass-nav flex h-12 w-12 origin-left shrink-0 items-center justify-center rounded-full border border-white/10 bg-royal-deep/80 text-white shadow-card ${
            shown
              ? "pointer-events-auto ml-2 translate-x-0 scale-100 opacity-100"
              : "pointer-events-none -ml-12 translate-x-14 scale-50 opacity-0"
          }`}
        >
          <MessageSquare size={18} strokeWidth={1.8} />
        </Link>
      </div>
    </header>
  );
}
