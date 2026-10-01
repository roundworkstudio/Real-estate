"use client";

import { useCallback, useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { useReducedMotion } from "motion/react";
import { AreaGuideCard, type AreaGuide } from "./AreaGuideCard";

export function MobileAreasCarousel({ areas }: { areas: AreaGuide[] }) {
  const prefersReducedMotion = useReducedMotion();
  const [autoplay] = useState(() =>
    Autoplay({
      delay: 2000,
    }),
  );
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { align: "start", loop: true },
    [autoplay],
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  const updateSelectedIndex = useCallback(() => {
    if (emblaApi) setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.on("select", updateSelectedIndex);
    emblaApi.on("reInit", updateSelectedIndex);

    return () => {
      emblaApi.off("select", updateSelectedIndex);
      emblaApi.off("reInit", updateSelectedIndex);
    };
  }, [emblaApi, updateSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;

    if (prefersReducedMotion) autoplay.stop();
    else autoplay.play();
  }, [autoplay, emblaApi, prefersReducedMotion]);

  return (
    <div className="mt-10 sm:hidden">
      <div
        ref={emblaRef}
        className="overflow-hidden touch-pan-y"
        aria-roledescription="carousel"
        aria-label="Area guides"
      >
        <div className="-ml-4 flex">
          {areas.map((area) => (
            <div
              key={area.name}
              className="min-w-0 flex-[0_0_88%] pl-4"
              aria-roledescription="slide"
            >
              <AreaGuideCard area={area} />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-center gap-2" aria-hidden>
        {areas.map((area, index) => (
          <span
            key={area.name}
            className={`h-1.5 rounded-full transition-[width,background-color] duration-300 ${
              index === selectedIndex ? "w-6 bg-royal-deep" : "w-1.5 bg-sand"
            }`}
          />
        ))}
      </div>
      <p className="mt-2 text-center text-xs text-slate/45">Swipe to explore</p>
    </div>
  );
}
