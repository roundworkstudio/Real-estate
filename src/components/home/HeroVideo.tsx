"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { posterSrc } from "@/lib/poster";

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
function playWhenReady(video: HTMLVideoElement) {
  const attempt = () => {
    video.play().catch(() => {
      // Autoplay blocked entirely (rare for muted video) — the poster
      // frame stays visible, which is an acceptable fallback.
    });
  };
  if (video.readyState >= 3 /* HAVE_FUTURE_DATA */) {
    attempt();
  } else {
    video.addEventListener("canplay", attempt, { once: true });
  }
}

export type HeroClip = {
  src: string;
  poster: string;
  /**
   * Cut to the next clip once this clip reaches this many seconds, instead
   * of waiting for it to play out to its own end — used to keep a clip
   * shorter than its source file (e.g. the source is 16s but only the first
   * 8s belong in the loop). Omit to play the clip to its natural end.
   */
  switchAt?: number;
};

/**
 * Plays a sequence of clips in order, crossfading between them, looping back
 * to the first once the last one finishes. Originally a fixed two-clip
 * component (poolview cut short, then the front-entrance clip); generalised
 * 2026-09-27 to an arbitrary-length sequence when two more clips (the
 * facade approach and the pool/waterfront-with-flag shot) were added to the
 * loop. See Hero.tsx for the actual sequence and why.
 *
 * `preload` is scoped to the active clip and the one queued next. Hidden
 * clips carry neither a poster request nor an active decoder; the five web
 * files are trimmed/compressed fast-start H.264 rather than the original
 * full-duration camera exports.
 */
export function HeroVideo({ clips }: { clips: HeroClip[] }) {
  const refs = useRef<(HTMLVideoElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const next = (active + 1) % clips.length;

  useEffect(() => {
    const video = refs.current[active];
    const clip = clips[active];
    if (!video || !clip) return;

    const goToNext = () => setActive((i) => (i + 1) % clips.length);

    // A clip that switches early can have many seconds left. Pause every
    // hidden element before starting the next one so it no longer decodes
    // video frames behind the visible hero.
    refs.current.forEach((candidate, index) => {
      if (candidate && index !== active) candidate.pause();
    });
    video.currentTime = 0;
    playWhenReady(video);

    if (clip.switchAt != null) {
      const switchAt = clip.switchAt;
      const onTimeUpdate = () => {
        if (video.currentTime >= switchAt) goToNext();
      };
      video.addEventListener("timeupdate", onTimeUpdate);
      return () => video.removeEventListener("timeupdate", onTimeUpdate);
    }

    video.addEventListener("ended", goToNext, { once: true });
    return () => video.removeEventListener("ended", goToNext);
  }, [active, clips]);

  return (
    <div className="absolute inset-0 h-full w-full">
      {/* Painted first, so it is the hero's largest paint; the same-sized
          videos fading in over it don't register as later, larger paints. */}
      {clips[0] && (
        <Image src={clips[0].poster} alt="" fill preload sizes="100vw" className="object-cover" />
      )}
      {clips.map((clip, i) => (
        <video
          key={clip.src}
          ref={(el) => {
            refs.current[i] = el;
          }}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
          style={{ opacity: active === i ? 1 : 0 }}
          src={clip.src}
          poster={active === i && i !== 0 ? posterSrc(clip.poster, 1080, 1920) : undefined}
          muted
          playsInline
          preload={i === active || i === next ? "auto" : "none"}
        />
      ))}
    </div>
  );
}
