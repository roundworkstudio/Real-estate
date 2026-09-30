"use client";

/**
 * Mobile-only swipe stack for the VideoTour section (2026-09-30).
 * Adapts the kokonutui card-stack pattern (beui.dev/docs/cards/card-stack)
 * for portrait video clips:
 *  - Full-size portrait cards peek below the front card with vertical offsets
 *  - A short horizontal swipe triggers the swap without dragging the frame
 *  - Video plays imperatively when the card is front AND section is in view
 *  - No native controls (ambient footage, no need to seek on mobile)
 *
 * Desktop gets the unchanged 3-column grid with controls — this component
 * is only mounted under `sm:hidden` in VideoTour.tsx.
 *
 * `prefersReducedMotion` skips the stack transition per
 * WCAG 2.1 §2.3.3.
 */

import { useCallback, useRef, useEffect, useState } from "react";
import type { PointerEvent as ReactPointerEvent, KeyboardEvent as ReactKeyboardEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import { useInView } from "@/lib/motion";

const SWIPE_THRESHOLD = 36;

type Clip = { src: string; poster: string };

function StackCard({
  clip,
  stackPos, // 0 = front, 1 = middle, 2 = back
  isInView,
  interactionLocked,
  transitionPhase,
  onAdvance,
  onPhaseComplete,
  noMotion,
}: {
  clip: Clip;
  stackPos: number;
  isInView: boolean;
  interactionLocked: boolean;
  transitionPhase: "leaving" | "returning" | null;
  onAdvance: () => void;
  onPhaseComplete: () => void;
  noMotion: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const pointerStart = useRef<{ x: number; y: number; id: number } | null>(null);
  const isInteractive = stackPos === 0 && !interactionLocked;

  function clearGesture() {
    pointerStart.current = null;
  }

  function startGesture(event: ReactPointerEvent<HTMLDivElement>) {
    if (!isInteractive || event.button !== 0) return;
    pointerStart.current = { x: event.clientX, y: event.clientY, id: event.pointerId };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function finishGesture(event: ReactPointerEvent<HTMLDivElement>) {
    const start = pointerStart.current;
    clearGesture();
    if (!start || start.id !== event.pointerId || !isInteractive) return;
    const horizontal = Math.abs(event.clientX - start.x);
    const vertical = Math.abs(event.clientY - start.y);
    if (horizontal >= SWIPE_THRESHOLD && horizontal > vertical * 1.25) onAdvance();
  }

  function onKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (!isInteractive || (event.key !== "Enter" && event.key !== " ")) return;
    event.preventDefault();
    onAdvance();
  }

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (stackPos === 0 && isInView) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [stackPos, isInView]);

  // Every frame keeps the same 9:16 size; only its position and opacity change.
  const yOffsets = [0,    26,   46];
  const opacities = [1,   0.75, 0.50];
  const zIndexes  = [3,   2,    1];

  return (
    <motion.div
      className="absolute inset-0 h-full w-full cursor-pointer touch-pan-y"
      role={isInteractive ? "button" : undefined}
      tabIndex={isInteractive ? 0 : -1}
      aria-label={isInteractive ? "Swipe to show next video" : undefined}
      onPointerDown={startGesture}
      onPointerUp={finishGesture}
      onPointerCancel={clearGesture}
      onContextMenu={(event) => {
        if (isInteractive) event.preventDefault();
      }}
      onKeyDown={onKeyDown}
      onClick={(event) => {
        if (isInteractive && event.detail === 0) onAdvance();
      }}
      animate={{
        y:       yOffsets[stackPos] ?? 46,
        opacity: transitionPhase === "leaving" ? 0 : opacities[stackPos] ?? 0.5,
      }}
      onAnimationComplete={transitionPhase ? onPhaseComplete : undefined}
      style={{
        zIndex: transitionPhase === "leaving" ? 4 : zIndexes[stackPos] ?? 1,
      }}
      transition={
        noMotion
          ? { duration: 0.1 }
          : {
              y: { duration: 0.72, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: transitionPhase === "leaving" ? 0.62 : 0.42 },
            }
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
  const [transitioning, setTransitioning] = useState<{
    index: number;
    nextIndex: number;
    phase: "leaving" | "returning";
  } | null>(null);
  const noMotion = useReducedMotion() ?? false;
  const { ref: containerRef, inView } = useInView<HTMLDivElement>();

  const sendToBack = () => {
    if (transitioning || clips.length < 2) return;
    const nextIndex = (activeIndex + 1) % clips.length;
    if (noMotion) {
      setActiveIndex(nextIndex);
      return;
    }
    setTransitioning({ index: activeIndex, nextIndex, phase: "leaving" });
  };

  const completePhase = useCallback(() => {
    if (!transitioning) return;
    if (transitioning.phase === "leaving") {
      setTransitioning({ ...transitioning, phase: "returning" });
    } else {
      setActiveIndex(transitioning.nextIndex);
      setTransitioning(null);
    }
  }, [transitioning]);

  // The next clip rises during the fade; the outgoing clip stays centered
  // and upright while its layer moves behind the stack.
  const visualIndex = transitioning?.nextIndex ?? activeIndex;
  const orderedByDepth = clips
    .map((clip, i) => ({
      clip,
      index: i,
      stackPos: (i - visualIndex + clips.length) % clips.length,
    }))
    .sort((a, b) => b.stackPos - a.stackPos);

  return (
    <div ref={containerRef} className="select-none">
      {/* A fixed backing card frames the moving portrait video stack. */}
      <div className="relative mx-auto w-full max-w-[240px]">
        <div className="relative mb-20 aspect-[9/16]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-x-3 -top-3 -bottom-14 z-0 rounded-[1.65rem] border border-royal/20 bg-mist shadow-card"
          />
          {orderedByDepth.map(({ clip, index, stackPos }) => (
            <StackCard
              key={clip.src}
              clip={clip}
              stackPos={stackPos}
              isInView={inView}
              interactionLocked={transitioning !== null}
              transitionPhase={transitioning?.index === index ? transitioning.phase : null}
              onAdvance={sendToBack}
              onPhaseComplete={completePhase}
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
            onClick={() => {
              if (!transitioning) setActiveIndex(i);
            }}
            aria-label={`Go to clip ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === visualIndex ? "w-5 bg-slate" : "w-1.5 bg-slate/25"
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
