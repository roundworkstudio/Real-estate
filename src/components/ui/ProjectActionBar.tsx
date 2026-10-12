"use client";

import { useEffect, useState } from "react";
import { PriceListRequest } from "@/components/tools/PriceListRequest";
import { FormattedPrice } from "@/components/ui/FormattedPrice";
import { WhatsAppLogo } from "@/components/ui/WhatsAppButton";
import { whatsAppUrlWithMessage } from "@/lib/site-config";

/**
 * Floating "From X · Price list · WhatsApp" bar for a project page. Shows
 * once `#project-hero` (which already carries these actions) has scrolled
 * away, and steps aside while `[data-action-bar-hide]` is on screen so it
 * never covers the closing call to action. Tucks away while scrolling down
 * (reading) and returns on any scroll up. Stays mounted when hidden so an
 * open price-list dialog isn't torn down with it.
 */
export function ProjectActionBar({
  project,
  developer,
  fromPriceAed,
}: {
  project: string;
  developer?: string;
  fromPriceAed: number;
}) {
  const [pastHero, setPastHero] = useState(false);
  const [nearEnd, setNearEnd] = useState(false);
  const [scrollingDown, setScrollingDown] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("project-hero");
    const ends = document.querySelectorAll("[data-action-bar-hide]");
    const heroObserver = new IntersectionObserver(([entry]) => setPastHero(!entry.isIntersecting), {
      rootMargin: "-20% 0px 0px 0px",
    });
    const endObserver = new IntersectionObserver((entries) =>
      setNearEnd(entries.some((entry) => entry.isIntersecting)),
    );
    if (hero) heroObserver.observe(hero);
    ends.forEach((el) => endObserver.observe(el));

    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - lastY) < 8) return;
      setScrollingDown(y > lastY);
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      heroObserver.disconnect();
      endObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const shown = pastHero && !nearEnd && !scrollingDown;

  return (
    <div
      aria-hidden={!shown}
      inert={!shown}
      className={`fixed inset-x-3 bottom-[calc(5.75rem+env(safe-area-inset-bottom))] z-30 transition-[opacity,transform] duration-500 ease-out md:inset-x-auto md:bottom-6 md:left-[max(2.5rem,calc((100vw-72rem)/2+2.5rem))] ${
        shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <div className="liquid-glass-light flex items-center gap-3 rounded-full py-1.5 pl-5 pr-1.5 md:gap-6">
        <div className="min-w-0 flex-1 leading-tight">
          <p className="truncate text-[11px] text-slate/60">{project}</p>
          <p className="whitespace-nowrap text-sm font-semibold text-slate">
            From <FormattedPrice amountAed={fromPriceAed} />
          </p>
        </div>
        <PriceListRequest project={project} developer={developer} variant="light" className="shrink-0" />
        <a
          href={whatsAppUrlWithMessage(`Hi Janvi, I'm looking at ${project} and have a few questions.`)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp Janvi"
          className="btn-hover relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0B6B35] text-white hover:bg-[#095a2c]"
        >
          <WhatsAppLogo className="h-5 w-5" />
        </a>
      </div>
    </div>
  );
}
