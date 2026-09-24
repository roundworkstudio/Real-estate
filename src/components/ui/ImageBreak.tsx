"use client";

import Image from "next/image";
import { useInView } from "@/lib/motion";

/**
 * Full-bleed photography break between long stacked sections, with a
 * glass-style stat card over it. Glass is permitted here specifically
 * because it sits over a moving/complex backdrop (a photo) — see
 * directives/anti-slop-ui.md's glass rule and Services.tsx's own note for
 * the same exception. Never reuse this pattern on fixed/sticky chrome or
 * once an element stops sitting over an image.
 *
 * The image scales 1.08 → 1.00 on scroll reveal — same treatment as large
 * hero photography sitewide, see RevealImage's note.
 */
export function ImageBreak({
  src,
  alt,
  eyebrow,
  value,
  label,
}: {
  src: string;
  alt: string;
  eyebrow?: string;
  value: string;
  label: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className="relative my-16 h-64 w-full overflow-hidden rounded-2xl sm:h-80"
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 1024px, 100vw"
        className={`object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          inView ? "scale-100" : "scale-[1.08]"
        }`}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to top, rgb(0 0 0 / 0.6), rgb(0 0 0 / 0.05) 55%)",
        }}
      />
      <div className="absolute bottom-6 left-6 right-6 sm:bottom-8 sm:left-8 sm:right-auto">
        <div className="inline-block rounded-2xl border border-white/15 bg-white/10 px-6 py-4 backdrop-blur-md">
          {eyebrow && <div className="text-xs font-medium text-white/70">{eyebrow}</div>}
          <div className="mt-1 text-2xl font-semibold tabular-nums text-white sm:text-3xl">
            {value}
          </div>
          <div className="mt-1 text-sm text-white/70">{label}</div>
        </div>
      </div>
    </div>
  );
}
