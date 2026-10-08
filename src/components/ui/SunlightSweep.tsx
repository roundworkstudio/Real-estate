"use client";

import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Keep masks/filters on the individual layers, never the wrapper: a mask on
 * the wrapper would isolate it, and the blend modes would stop reaching the
 * photo underneath.
 *
 * Late-afternoon sun falling on the archway from the upper right: a warm
 * wash that lifts the stone, plus soft blurred rays raking across the facade
 * and fading out towards the left. On scroll the light strengthens and the
 * rays sweep slowly leftwards, as if the sun is moving.
 */
export function SunlightSweep({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 28,
    mass: 0.5,
  });
  const washOpacity = useTransform(progress, [0, 0.6], [0.7, 1]);
  const raysOpacity = useTransform(progress, [0, 0.4, 1], [0.75, 1, 0.45]);
  const raysX = useTransform(progress, [0, 1], [0, -140]);

  return (
    <div ref={ref} aria-hidden className={cn("pointer-events-none overflow-hidden", className)}>
      <motion.div
        className="absolute inset-0 mix-blend-soft-light [mask-image:linear-gradient(to_bottom,black_55%,transparent_100%)]"
        style={{
          opacity: reduceMotion ? 0.85 : washOpacity,
          background:
            "radial-gradient(ellipse 75% 70% at 92% 4%, rgb(255 212 140 / 0.95) 0%, rgb(255 200 120 / 0.55) 35%, transparent 70%)",
        }}
      />

      <motion.div
        className="absolute -inset-x-[20%] -top-[10%] h-[120%] mix-blend-screen blur-xl [mask-image:linear-gradient(to_bottom_left,black_0%,rgb(0_0_0/0.6)_35%,transparent_70%)]"
        style={{
          opacity: reduceMotion ? 0.6 : raysOpacity,
          x: reduceMotion ? 0 : raysX,
          background:
            "repeating-linear-gradient(118deg, transparent 0px, transparent 70px, rgb(255 222 165 / 0.55) 110px, rgb(255 230 185 / 0.75) 135px, rgb(255 222 165 / 0.55) 160px, transparent 200px, transparent 290px)",
        }}
      />

      <div
        className="absolute right-[6%] top-0 h-1/2 w-1/2 rounded-full mix-blend-screen blur-3xl"
        style={{
          background: "radial-gradient(circle at 80% 10%, rgb(255 236 200 / 0.5), transparent 65%)",
        }}
      />
    </div>
  );
}
