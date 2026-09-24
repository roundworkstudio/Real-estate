"use client";

import { useInView } from "@/lib/motion";

/**
 * Fade-up-on-scroll wrapper: opacity 0 → 1, translateY 20px → 0, once per
 * element per page load. `delayMs` staggers a grid of these (index * 100
 * per the brief's "0.1s stagger" spec). Timing matches the brief exactly:
 * 0.6s, cubic-bezier(0.16, 1, 0.3, 1).
 *
 * Never a source of hidden content: useInView resolves to `true`
 * immediately under prefers-reduced-motion or without IntersectionObserver
 * support, so the element renders fully visible rather than waiting on a
 * script that might not run — anti-slop-ui.md's "no element left invisible
 * if JS or the observer fails" rule.
 */
export function Reveal({
  children,
  delayMs = 0,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delayMs?: number;
  className?: string;
  as?: "div" | "li";
}) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <Tag
      ref={ref as never}
      className={`transition-[opacity,transform] duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
        inView ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
      } ${className}`}
      style={{ transitionDelay: inView ? `${delayMs}ms` : "0ms" }}
    >
      {children}
    </Tag>
  );
}
