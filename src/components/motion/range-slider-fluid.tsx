"use client";
// beui.dev/components/motion/range-slider

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect } from "react";

import { SPRING_GLIDE, SPRING_PRESS } from "@/lib/ease";
import { type SliderOptions, useSlider } from "@/lib/hooks/use-slider";
import { TOUCH_GESTURE_CLASS } from "@/lib/touch";
import { cn } from "@/lib/utils";

export interface FluidSliderProps extends SliderOptions {
  /** Text shown on the left of the track. */
  label?: string;
  /** Formats the value shown on the right. */
  format?: (value: number) => string;
  className?: string;
  /** Colour context for the same pill slider on light or deep panels. */
  tone?: "dark" | "light";
  orientation?: "horizontal" | "vertical";
}

/**
 * Thumbless slider: the whole pill is the control. The fill glides to the new
 * value behind a rounded liquid cap, and the label reads inverted wherever the
 * fill has covered it.
 */
export function FluidSlider({
  label,
  // The value arrives already snapped to the step. Rounding it again would
  // only make the label and the announcement disagree with aria-valuenow.
  format = (v) => `${v}%`,
  className,
  tone = "light",
  orientation = "horizontal",
  ...options
}: FluidSliderProps) {
  const reduce = useReducedMotion();
  const { percent, current, dragging, trackProps, sliderProps } = useSlider({
    ...options,
    orientation,
    formatValueText: options.formatValueText ?? format,
  });

  const target = useMotionValue(percent);
  useEffect(() => {
    target.set(percent);
  }, [percent, target]);
  const smooth = useSpring(target, SPRING_GLIDE);
  const pos = reduce ? target : smooth;
  // Reveal the fill by clipping a full-width layer rather than animating its
  // width: at 0% the clip is empty, so no hairline of a sub-pixel-wide box is
  // left behind, and the label inside is never scaled or re-laid out.
  const uncovered = useTransform(pos, (v) => 100 - v);
  const horizontalClipPath = useMotionTemplate`inset(0 ${uncovered}% 0 0 round 9999px)`;
  const verticalClipPath = useMotionTemplate`inset(${uncovered}% 0 0 0 round 9999px)`;
  const clipPath = orientation === "vertical" ? verticalClipPath : horizontalClipPath;

  const row = (
    <>
      {label ? <span className="truncate">{label}</span> : <span />}
      <span className="tabular-nums">{format(current)}</span>
    </>
  );

  return (
    <motion.div
      {...trackProps}
      animate={reduce ? undefined : { scale: dragging ? 1.03 : 1 }}
      transition={SPRING_PRESS}
      className={cn(
        orientation === "vertical" ? "relative flex h-48 w-14 touch-none overflow-hidden rounded-full shadow-[inset_0_1px_2px_rgb(46_36_32_/_0.08)]" : "relative flex h-12 w-full touch-none overflow-hidden rounded-full shadow-[inset_0_1px_2px_rgb(46_36_32_/_0.08)]",
        tone === "dark" ? "bg-white/10" : "bg-slate/10",
        TOUCH_GESTURE_CLASS,
        options.disabled
          ? "pointer-events-none opacity-50"
          : "cursor-grab active:cursor-grabbing",
        className,
      )}
    >
      {/* uncovered label — sits on the muted track */}
      <div className={cn("pointer-events-none absolute inset-0 flex items-center justify-between text-sm font-medium", orientation === "vertical" ? "flex-col px-1 py-3 text-center text-[10px] leading-tight" : "px-5", tone === "dark" ? "text-white/75" : "text-slate")}>
        {row}
      </div>

      {/* fill + the same label, both clipped to the value, so the text inverts
          as the fill covers it and lines up glyph for glyph with the copy
          underneath. The clip's rounded right edge is the liquid cap. */}
      <motion.div className="absolute inset-0" style={{ clipPath }}>
        <div className="absolute inset-0 bg-gradient-to-r from-royal to-sovereign" />
        <div className={cn("pointer-events-none absolute inset-0 flex items-center justify-between text-sm font-medium text-white", orientation === "vertical" ? "flex-col px-1 py-3 text-center text-[10px] leading-tight" : "px-5")}>
          {row}
        </div>
      </motion.div>

      {/* focusable, keyboard-controlled handle surface. The ring is inset — an
          outset one is clipped away by the track's overflow-hidden. */}
      <button
        type="button"
        {...sliderProps}
        className="absolute inset-0 touch-none rounded-full outline-none ring-inset ring-royal/45 focus-visible:ring-4"
      />
    </motion.div>
  );
}
