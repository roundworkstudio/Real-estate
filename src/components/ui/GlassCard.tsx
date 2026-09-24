"use client";

import { useTilt3D } from "@/lib/motion";

/**
 * 3D tilt + glass sheen + glass-pane edge, combined — the pointer-tracked
 * interactivity from lib/motion.ts's useTilt3D, wrapped so any card or
 * photo frame can opt in without repeating the ref/className/sheen-div
 * boilerplate. `pane` controls whether the bright top-edge highlight +
 * border shows (on by default — it reads correctly on both an opaque
 * card and a photo frame, see globals.css's .glass-pane note); turn it
 * off if a caller already draws its own border.
 */
export function GlassCard({
  children,
  className = "",
  maxDeg = 8,
  pane = true,
}: {
  children: React.ReactNode;
  className?: string;
  maxDeg?: number;
  pane?: boolean;
}) {
  const ref = useTilt3D<HTMLDivElement>(maxDeg);

  return (
    <div
      ref={ref}
      className={`glass-tilt relative ${pane ? "glass-pane" : ""} ${className}`}
    >
      {children}
      <div className="glass-sheen" />
    </div>
  );
}
