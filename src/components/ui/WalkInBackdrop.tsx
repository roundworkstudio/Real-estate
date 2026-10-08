"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Hero photo that slowly pushes in towards the doorway as the page scrolls,
 * with warm light from inside growing stronger — a "walking in" feel.
 * The fade mask lives on the outer wrapper so it stays put while the photo
 * zooms. Door position differs per breakpoint because the mobile crop is
 * offset (object-position 68%); keep the origin and glow in sync with it.
 */
export function WalkInBackdrop({
  src,
  className,
}: {
  src: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });
  const scale = useTransform(progress, [0, 1], [1, 1.28]);
  const glow = useTransform(progress, [0, 0.8], [0.15, 0.75]);

  return (
    <div ref={ref} className={cn("pointer-events-none overflow-hidden", className)}>
      <motion.div
        className="absolute inset-0 origin-[85%_66%] will-change-transform sm:origin-[74.5%_66%]"
        style={reduceMotion ? undefined : { scale }}
      >
        <Image
          src={src}
          alt=""
          fill
          preload
          sizes="100vw"
          className="object-cover object-[68%_center] sm:object-center"
        />
        <motion.div
          className="absolute left-[85%] top-[66%] h-[45%] w-[32%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#f3c97a] mix-blend-soft-light blur-3xl sm:left-[74.5%] sm:w-[18%]"
          style={{ opacity: reduceMotion ? 0.3 : glow }}
        />
      </motion.div>
    </div>
  );
}
