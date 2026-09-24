"use client";

import { useEffect, useRef } from "react";

/**
 * Some browsers (mobile Safari, and apparently this project's preview
 * tooling) don't reliably honour the `autoPlay` attribute even when muted.
 * Calling .play() imperatively on mount is the standard fallback — it's a
 * no-op where autoplay already worked.
 *
 * That fallback still raced the video's own readiness: calling .play()
 * immediately on mount, before the browser has buffered enough to play
 * (readyState < HAVE_FUTURE_DATA), can get silently dropped rather than
 * queued — the video ends up loaded (readyState 4) but never actually
 * started, with no error to catch. Waiting for the `canplay` event (or
 * checking readyState in case it fired before this effect ran) closes
 * that race.
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
    const video = ref.current;
    if (!video) return;

    function attemptPlay() {
      video?.play().catch(() => {
        // Autoplay blocked entirely (rare for muted video) — the poster
        // frame stays visible, which is an acceptable fallback.
      });
    }

    if (video.readyState >= 3 /* HAVE_FUTURE_DATA */) {
      attemptPlay();
    } else {
      video.addEventListener("canplay", attemptPlay, { once: true });
      return () => video.removeEventListener("canplay", attemptPlay);
    }
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
