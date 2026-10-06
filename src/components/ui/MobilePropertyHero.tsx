"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, type PanInfo } from "motion/react";
import { ArrowLeft, BedDouble, Heart, Images, MapPin, Ruler } from "lucide-react";

type PropertyImage = { src: string; alt: string };

export function MobilePropertyHero({
  gallery,
  title,
  community,
  city,
  priceDisplay,
  beds,
  status,
  phoneUrl,
}: {
  gallery: PropertyImage[];
  title: string;
  community: string;
  city: string;
  priceDisplay: string;
  beds: number;
  status: string;
  phoneUrl: string;
}) {
  const [heroImage, setHeroImage] = useState(0);
  const galleryRef = useRef<HTMLDivElement>(null);
  const slides = gallery.length > 1 ? gallery.slice(1) : gallery;
  const showingMainPhoto = heroImage === 0;

  useEffect(() => {
    const element = galleryRef.current;
    if (!element) return;

    const nudgeDistance = 72;
    const interval = window.setInterval(() => {
      const maxScroll = element.scrollWidth - element.clientWidth;
      if (maxScroll <= 4) return;

      if (element.scrollLeft < 8) {
        element.scrollTo({ left: Math.min(nudgeDistance, maxScroll), behavior: "smooth" });
      } else if (element.scrollLeft <= nudgeDistance + 8) {
        element.scrollTo({ left: 0, behavior: "smooth" });
      }
    }, 4500);

    return () => window.clearInterval(interval);
  }, []);

  function handleSwipe(_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) {
    const moved = Math.abs(info.offset.x) > 45 || Math.abs(info.velocity.x) > 450;
    if (!moved || slides.length < 2) return;
    setHeroImage((current) =>
      info.offset.x < 0
        ? (current + 1) % slides.length
        : (current - 1 + slides.length) % slides.length,
    );
  }

  return (
    <section className="bg-gradient-to-b from-mist/70 to-canvas px-4 pb-8 pt-20 sm:hidden">
      <div className="mx-auto max-w-md">
        <div className="relative h-[min(88vw,330px)] overflow-hidden rounded-[2rem] border-2 border-white/80 bg-slate shadow-[0_25px_65px_-35px_rgba(58,45,40,.8)]">
          <AnimatePresence initial={false}>
            <motion.img
              key={slides[heroImage]?.src}
              src={slides[heroImage]?.src}
              alt={slides[heroImage]?.alt}
              className="absolute inset-0 h-full w-full object-cover"
              initial={{ opacity: 0, x: 36 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -36 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleSwipe}
              style={{ touchAction: "pan-y" }}
            />
          </AnimatePresence>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate/90 via-slate/15 to-transparent" />
          <Link
            href="/properties"
            aria-label="Back to properties"
            className="absolute left-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-canvas/75 text-slate shadow-sm backdrop-blur-sm"
          >
            <ArrowLeft size={18} />
          </Link>
          <button
            type="button"
            aria-label="Add to wishlist"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/60 bg-canvas/75 text-slate shadow-sm backdrop-blur-sm"
          >
            <Heart size={19} />
          </button>
          <AnimatePresence initial={false}>
            {showingMainPhoto && (
              <motion.div
                key="hero-copy"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-4 left-4 right-4 text-white"
              >
                <div className="flex items-center gap-1.5 text-xs text-white/80">
                  <MapPin size={14} />
                  {community}, {city}
                </div>
                <h1 className="mt-1 max-w-[18rem] text-2xl font-semibold leading-tight">{title}</h1>
                <div className="mt-3 flex flex-wrap gap-2 text-xs">
                  <span className="rounded-full bg-slate/70 px-3 py-1.5 backdrop-blur-sm">{priceDisplay}</span>
                  <span className="rounded-full bg-slate/70 px-3 py-1.5 backdrop-blur-sm">
                    <BedDouble className="mr-1 inline" size={13} />
                    {beds} beds
                  </span>
                  <span className="rounded-full bg-slate/70 px-3 py-1.5 capitalize backdrop-blur-sm">{status}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-2 flex justify-center gap-1.5">
          {slides.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              aria-label={"Show image " + (index + 1)}
              onClick={() => setHeroImage(index)}
              className={index === heroImage ? "h-1.5 w-5 rounded-full bg-royal-deep" : "h-1.5 w-1.5 rounded-full bg-slate/25"}
            />
          ))}
        </div>

        <div className="mt-3 rounded-[1.75rem] border border-white/80 bg-white/60 p-4 shadow-[0_18px_45px_-35px_rgba(58,45,40,.45)] backdrop-blur-md">
          <h2 className="text-xl font-semibold text-slate">{community} Villa</h2>
          <div className="mt-3 flex gap-3">
            <div className="flex w-12 shrink-0 flex-col items-center justify-between rounded-2xl border border-white/80 bg-white/55 py-2 text-royal-deep">
              <BedDouble size={17} />
              <Ruler size={17} />
              <Images size={17} />
            </div>
            <div ref={galleryRef} className="flex min-w-0 flex-1 gap-2 overflow-x-auto no-scrollbar touch-pan-x">
              {slides.slice(1).map((img) => (
                <button
                  key={img.src}
                  type="button"
                  onClick={() => setHeroImage(slides.findIndex((slide) => slide.src === img.src))}
                  className="w-20 shrink-0 overflow-hidden rounded-2xl"
                  aria-label={"Show " + img.alt}
                >
                  <img src={img.src} alt={img.alt} className="aspect-square w-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto no-scrollbar">
          {["Facilities", "Offers", "Host", "Location"].map((label, index) => (
            <button
              key={label}
              type="button"
              className={index === 0
                ? "shrink-0 rounded-full border border-royal-deep bg-royal-deep px-5 py-2.5 text-xs font-medium text-white transition hover:bg-royal"
                : "shrink-0 rounded-full border border-white/80 bg-white/60 px-5 py-2.5 text-xs font-medium text-slate transition hover:bg-white/80"}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="sticky bottom-3 z-10 mt-4 flex items-center justify-between rounded-[1.5rem] border border-white/80 bg-white/70 px-4 py-3 shadow-[0_18px_45px_-28px_rgba(58,45,40,.55)] backdrop-blur-xl">
          <div>
            <p className="text-xs text-slate/55">Guide price</p>
            <p className="text-xl font-semibold text-slate">{priceDisplay}</p>
          </div>
          <a href={phoneUrl} className="rounded-full bg-royal-deep px-5 py-3 text-xs font-medium text-white transition hover:bg-royal">
            Book a call
          </a>
        </div>
      </div>
    </section>
  );
}
