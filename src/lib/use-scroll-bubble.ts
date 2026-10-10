"use client";

import { useEffect, useState, type AnimationEvent } from "react";

export type BubblePhase = "hidden" | "shown" | "popped";

/** Which exit effect the contact bubble plays; both live in globals.css. */
export const BUBBLE_POP: "burst" | "dissolve" = "dissolve";

/**
 * Scroll state for the top bar plus the contact bubble's phase. "popped"
 * only follows "shown", so the exit never plays on first load; it hands
 * back to "hidden" when the exit keyframes finish (see .nav-bubble in
 * globals.css). The bubble hides at half the threshold it shows at, so
 * hovering around the threshold can't flicker it in and out.
 */
export function useScrollBubble(threshold = 80) {
  const [scrolled, setScrolled] = useState(false);
  const [phase, setPhase] = useState<BubblePhase>("hidden");

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      setScrolled(y > threshold);
      setPhase((p) => {
        if (y > threshold) return "shown";
        if (y < threshold / 2 && p === "shown") return "popped";
        return p;
      });
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  function onBubbleAnimationEnd(e: AnimationEvent<HTMLElement>) {
    if (e.target === e.currentTarget && e.animationName.startsWith("nav-bubble-pop")) {
      setPhase((p) => (p === "popped" ? "hidden" : p));
    }
  }

  return { scrolled, phase, onBubbleAnimationEnd };
}
