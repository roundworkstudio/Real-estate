"use client";

/**
 * Mobile-only swipe stack for the VideoTour section (2026-09-30).
 * Adapts the kokonutui card-stack pattern (beui.dev/docs/cards/card-stack)
 * for portrait video clips:
 *  - Back cards peek below the front card (scale + y offset)
 *  - Front card is draggable; swipe left = next, right = prev
 *  - Video plays imperatively when the card is front AND section is in view
 *  - No native controls (ambient footage, no need to seek on mobile)
 *
 * Desktop gets the unchanged 3-column grid with controls — this component
 * is only mounted under `sm:hidden` in VideoTour.tsx.
 *
 * `prefersReducedMotion` disables rotation and spring transitions per
 * WCAG 2.1 §2.3.3.
 */

import { useRef, useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, useReducedMotion } from "motion/react";
import type { PanInfo } from "motion/react";
import { useInView } from "@/lib/motion";

const SWIPE_THRESHOLD = 60;

type Clip = { src: string; poster: string };

function StackCard({
  clip,
  stackPos, // 0 = front, 1 = middle, 2 = back
  isInView,
  onSwipeLeft,
  onSwipeRight,
  noMotion,
}: {
  clip: Clip;
  stackPos: number;
  isInView: boolean;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  noMotion: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-6, 0, 6]);
  const isDraggable = stackPos === 0;

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (stackPos === 0 && isInView) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [stackPos, isInView]);

  function onDragEnd(_: PointerEvent, info: PanInfo) {
    if (info.offset.x < -SWIPE_THRESHOLD) onSwipeLeft();
    else if (info.offset.x > SWIPE_THRESHOLD) onSwipeRight();
  }

  const scales =   [1,    0.93, 0.86];
  // y values chosen so back cards visually peek below the front card.
  // Peek = y - containerHeight/2 * (1 - scale); for 426px card: min y for peek
  // at scale 0.93 ≈ 15px, scale 0.86 ≈ 30px. Using 26/46 for ~11/16px peeks.
  const yOffsets = [0,    26,   46];
  const opacities = [1,   0.75, 0.50];
  const zIndexes  = [3,   2,    1];

  return (
    <motion.div
      className="absolute top-0 left-0 right-0"
      animate={{
        scale:   scales[stackPos]   ?? 0.86,
        y:       yOffsets[stackPos] ?? 22,
        opacity: opacities[stackPos] ?? 0.44,
      }}
      style={{
        zIndex: zIndexes[stackPos] ?? 0,
        x: isDraggable ? x : 0,
        rotate: isDraggable && !noMotion ? rotate : 0,
      }}
      drag={isDraggable ? "x" : false}
      dragConstraints={{ left: -200, right: 200 }}
      dragElastic={0.15}
      onDragEnd={isDraggable ? onDragEnd : undefined}
      transition={
        noMotion
          ? { duration: 0.1 }
          : { type: "spring", stiffness: 260, damping: 28 }
      }
    >
      <div className="h-full w-full overflow-hidden rounded-2xl shadow-card">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          style={{ pointerEvents: "none", userSelect: "none" }}
          src={clip.src}
          poster={clip.poster}
          muted
          loop
          playsInline
          preload={stackPos === 0 ? "auto" : "none"}
        />
      </div>
    </motion.div>
  );
}

export function VideoSwipeStack({ clips }: { clips: Clip[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const noMotion = useReducedMotion() ?? false;
  const { ref: containerRef, inView } = useInView<HTMLDivElement>();

  const next = () => setActiveIndex((i) => (i + 1) % clips.length);
  const prev = () => setActiveIndex((i) => (i - 1 + clips.length) % clips.length);

  // Compute stack position for each clip, render back cards first (below front in z-order)
  const orderedByDepth = clips
    .map((clip, i) => ({
      clip,
      stackPos: (i - activeIndex + clips.length) % clips.length,
    }))
    .sort((a, b) => b.stackPos - a.stackPos);

  return (
    <div ref={containerRef} className="select-none">
      {/* Stack — extra bottom margin to give room for peeking back cards */}
      <div className="relative mx-auto w-full max-w-[240px]">
        <div className="relative aspect-[9/16] mb-14">
          {orderedByDepth.map(({ clip, stackPos }) => (
            <StackCard
              key={clip.src}
              clip={clip}
              stackPos={stackPos}
              isInView={inView}
              onSwipeLeft={next}
              onSwipeRight={prev}
              noMotion={noMotion}
            />
          ))}
        </div>
      </div>

      {/* Pagination dots */}
      <div className="flex justify-center gap-2">
        {clips.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActiveIndex(i)}
            aria-label={`Go to clip ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === activeIndex ? "w-5 bg-slate" : "w-1.5 bg-slate/25"
            }`}
          />
        ))}
      </div>

      <p className="mt-2 text-center text-xs text-slate/40">
        Swipe to browse
      </p>
    </div>
  );
}
