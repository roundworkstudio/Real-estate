"use client";

import { motion, useReducedMotion } from "motion/react";

/**
 * Adapted from Kokonut UI's MIT-licensed Shimmer Text component by
 * @dorianbaffier. The highlight uses the site's warm camel tone so it stays
 * consistent with the existing brand palette and remains legible over video.
 * https://kokonutui.com
 */
export function HeroShimmerHeading() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.h1
      initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.5 }}
      className="max-w-2xl text-4xl font-semibold sm:text-6xl"
    >
      <motion.span
        animate={
          prefersReducedMotion
            ? undefined
            : { backgroundPosition: ["200% center", "-200% center"] }
        }
        transition={{
          duration: 8,
          ease: "linear",
          repeat: Number.POSITIVE_INFINITY,
        }}
        className="bg-gradient-to-r from-white via-[#d8bfa7] to-white bg-[length:200%_100%] bg-clip-text text-transparent"
      >
        Abu Dhabi and Dubai real estate,{" "}
        <span className="font-accent">presented like an investment.</span>
      </motion.span>
    </motion.h1>
  );
}
