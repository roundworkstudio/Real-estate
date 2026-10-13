"use client";

/**
 * The hero's glass "on this page" bar. When the links don't fit (mostly on
 * phones) the clipped edge fades out and an arrow appears, so it reads as
 * scrollable rather than complete.
 */
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const FADE = "2.5rem";

export function JumpDock({ links, status }: { links: { href: string; label: string }[]; status: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const [edges, setEdges] = useState({ start: false, end: false });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () =>
      setEdges({
        start: el.scrollLeft > 4,
        end: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
      });
    const observer = new ResizeObserver(update);
    observer.observe(el);
    el.addEventListener("scroll", update, { passive: true });
    return () => {
      observer.disconnect();
      el.removeEventListener("scroll", update);
    };
  }, []);

  const nudge = (dir: 1 | -1) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.7, behavior: "smooth" });

  const mask = `linear-gradient(to right, ${edges.start ? "transparent" : "#000"}, #000 ${edges.start ? FADE : "0"}, #000 calc(100% - ${edges.end ? FADE : "0px"}), ${edges.end ? "transparent" : "#000"})`;

  return (
    <div className="liquid-glass liquid-glass--tint mt-7 flex items-center rounded-full p-1.5 sm:mt-9">
      {status}
      {edges.start && (
        <button
          type="button"
          onClick={() => nudge(-1)}
          aria-label="Show earlier sections"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/85 transition-colors hover:bg-white/15"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
      )}
      <nav
        ref={ref}
        aria-label="On this page"
        className="no-scrollbar flex min-w-0 flex-1 gap-1 overflow-x-auto sm:pl-1.5"
        style={{ maskImage: mask, WebkitMaskImage: mask }}
      >
        {links.map((l, i) => (
          <a
            key={l.href}
            href={l.href}
            className={`shrink-0 rounded-full px-4 py-2.5 text-[13px] font-medium whitespace-nowrap transition-colors sm:px-5 sm:text-sm ${
              i === 0 ? "bg-white text-slate shadow-[0_6px_16px_-8px_rgb(0_0_0/0.5)]" : "text-white/85 hover:bg-white/15 hover:text-white"
            }`}
          >
            {l.label}
          </a>
        ))}
      </nav>
      {edges.end && (
        <button
          type="button"
          onClick={() => nudge(1)}
          aria-label="Show more sections"
          className="liquid-glass flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
