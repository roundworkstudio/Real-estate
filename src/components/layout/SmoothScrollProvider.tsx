"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { prefersReducedMotion } from "@/lib/motion";
import { registerScroller } from "@/lib/scroll-lock";

/**
 * Inertial smooth scroll for the whole page (mouse wheel and touch), not
 * just anchor-link jumps — Lenis animates the native `window.scrollTo`
 * rather than transforming a wrapper element, so `position: fixed`/
 * `sticky` (Nav, CurrencyVisaToolbar) keep working exactly as before; see
 * lib/motion.ts's useScrollingFlag, which listens to the native `scroll`
 * event and doesn't care whether Lenis or the user's own gesture drove it.
 * `anchors: true` gives every `href="#..."` jump link already built this
 * session (InsightToolCard's "Explore", the hero's scroll-down chevron)
 * the same eased motion instead of an instant snap.
 *
 * Does nothing under prefers-reduced-motion or on touch-first devices —
 * native scrolling is both smoother and more reliable there, especially
 * around the mobile video stack's horizontal swipe gesture.
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const usesTouch =
      window.matchMedia("(pointer: coarse)").matches ||
      navigator.maxTouchPoints > 0;
    if (prefersReducedMotion() || usesTouch) return;

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 3), // ease-out cubic, matches Reveal's easing
      anchors: true,
      autoRaf: true,
    });
    registerScroller(lenis);

    return () => {
      registerScroller(null);
      lenis.destroy();
    };
  }, []);

  return children;
}
