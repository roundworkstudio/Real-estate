"use client";

import Image, { type ImageProps } from "next/image";
import { useInView } from "@/lib/motion";

/**
 * Large photography scales from 1.08 → 1.00 as it scrolls into view,
 * inside an overflow-hidden frame — never affects opacity or layout, only
 * motion, so it's safe under the same "never hide content" rule Reveal
 * follows (see that component's note). Container className applies to the
 * overflow-hidden wrapper; the rest passes straight to next/image.
 */
export function RevealImage({
  containerClassName = "",
  className = "",
  alt,
  ...imageProps
}: ImageProps & { containerClassName?: string }) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div ref={ref} className={`overflow-hidden ${containerClassName}`}>
      <Image
        {...imageProps}
        alt={alt}
        className={`transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          inView ? "scale-100" : "scale-[1.08]"
        } ${className}`}
      />
    </div>
  );
}
