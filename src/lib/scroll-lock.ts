"use client";

type Scroller = { stop: () => void; start: () => void };

let scroller: Scroller | null = null;
let locks = 0;

/** SmoothScrollProvider registers its Lenis instance so locks can pause it —
 * Lenis drives window.scrollTo, which `overflow: hidden` alone doesn't stop. */
export function registerScroller(next: Scroller | null) {
  scroller = next;
  if (scroller && locks > 0) scroller.stop();
}

export function lockScroll() {
  locks += 1;
  if (locks > 1) return;
  const root = document.documentElement;
  const scrollbar = window.innerWidth - root.clientWidth;
  root.style.overflow = "hidden";
  if (scrollbar > 0) root.style.paddingRight = `${scrollbar}px`;
  scroller?.stop();
}

export function unlockScroll() {
  locks = Math.max(0, locks - 1);
  if (locks > 0) return;
  const root = document.documentElement;
  root.style.overflow = "";
  root.style.paddingRight = "";
  scroller?.start();
}
