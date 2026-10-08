"use client";

import { useEffect, useRef, useState } from "react";
import { posterSrc } from "@/lib/poster";

/**
 * Ambient looping clip that downloads nothing but its poster until it nears
 * the viewport, and pauses when it leaves. A plain `autoPlay` video starts
 * downloading on page load even inside a `display: none` breakpoint wrapper;
 * a hidden element never intersects, so this one never loads there.
 */
export function LazyVideo({ src, poster, className }: { src: string; poster: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(entry.isIntersecting);
        if (entry.isIntersecting) setLoaded(true);
      },
      { rootMargin: "200px 0px" },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = ref.current;
    if (!video || !loaded) return;
    if (visible) video.play().catch(() => {});
    else video.pause();
  }, [visible, loaded]);

  return (
    <video
      ref={ref}
      className={className}
      src={loaded ? src : undefined}
      poster={posterSrc(poster)}
      muted
      loop
      playsInline
      preload="none"
    />
  );
}
