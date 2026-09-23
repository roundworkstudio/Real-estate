"use client";

import { useEffect, useRef } from "react";

/**
 * Some browsers (mobile Safari, and apparently this project's preview
 * tooling) don't reliably honour the `autoPlay` attribute even when muted.
 * Calling .play() imperatively on mount is the standard fallback — it's a
 * no-op where autoplay already worked.
 */
export function HeroVideo({
  src,
  poster,
}: {
  src: string;
  poster: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    ref.current?.play().catch(() => {
      // Autoplay blocked entirely (rare for muted video) — the poster
      // frame stays visible, which is an acceptable fallback.
    });
  }, []);

  return (
    <video
      ref={ref}
      className="absolute inset-0 h-full w-full object-cover"
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
    />
  );
}
