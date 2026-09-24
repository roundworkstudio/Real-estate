"use client";

import { useEffect, useRef, useState } from "react";

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Fires once, the first time the element crosses the viewport threshold —
 * not every time it re-enters. Every consumer (Reveal, RevealImage,
 * useCountUp) needs the same "once per page load" behaviour per
 * docs/what-worked.md's count-up rule, generalised here so it isn't
 * reimplemented per component. Reduced motion and a missing
 * IntersectionObserver both resolve to `true` immediately — never leave
 * content stuck invisible waiting on a script that won't run it (anti-slop
 * rule: "No element is left invisible if JS or the observer fails").
 */
export function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (prefersReducedMotion() || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Counts from 0 to `value` once `active` turns true, ease-out over
 * `durationMs`. The starting displayed value is `value` itself (not 0) —
 * see StatFigure's original note: correctness must not depend on the
 * animation running, only its motion does.
 */
export function useCountUp(value: number, active: boolean, durationMs = 1400) {
  const [display, setDisplay] = useState(value);
  const animated = useRef(false);

  useEffect(() => {
    if (!active || animated.current) return;
    animated.current = true;

    if (prefersReducedMotion()) {
      setDisplay(value);
      return;
    }

    const start = performance.now();
    let frame: number;
    function tick(now: number) {
      const t = Math.min((now - start) / durationMs, 1);
      setDisplay(value * easeOutCubic(t));
      if (t < 1) frame = requestAnimationFrame(tick);
      else setDisplay(value);
    }
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, value, durationMs]);

  return display;
}

/**
 * Toggles `is-scrolling` on <html> while the page is actively scrolling,
 * clearing it ~150ms after scrolling stops. Backs the `.hover-lift` rule
 * in globals.css — directives/anti-slop-ui.md requires hover effects be
 * suppressed while scrolling (content moving under a stationary cursor
 * can otherwise spuriously trigger :hover). Call once, near the root
 * (Nav mounts on every page, so it owns this).
 */
export function useScrollingFlag() {
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    function onScroll() {
      document.documentElement.classList.add("is-scrolling");
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        document.documentElement.classList.remove("is-scrolling");
      }, 150);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timeout);
      document.documentElement.classList.remove("is-scrolling");
    };
  }, []);
}

/**
 * "Magnetic" button pull: while the pointer is within `radius` px of the
 * element's centre, the element translates a fraction of the way toward
 * it (`strength`), springing back via CSS transition on mouseleave.
 * Applied via ref rather than state so the drag itself doesn't re-render
 * React on every mousemove — only the transform style updates.
 */
export function useMagnetic<T extends HTMLElement>(radius = 60, strength = 0.35) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    function reset() {
      if (el) el.style.transform = "";
    }

    function onMove(e: MouseEvent) {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < radius + rect.width / 2) {
        el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
      } else {
        reset();
      }
    }

    window.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", reset);
    return () => {
      window.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", reset);
    };
  }, [radius, strength]);

  return ref;
}
