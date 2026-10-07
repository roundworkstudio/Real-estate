"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion, type PanInfo } from "motion/react";
import { ArrowLeft, BedDouble, House, LayoutGrid, MapPin, Waves } from "lucide-react";
import { CompareToggle } from "@/components/tools/CompareToggle";
import { FormattedPrice } from "@/components/ui/FormattedPrice";

type PropertyImage = { src: string; alt: string };

export function MobilePropertyHero({
  gallery,
  title,
  slug,
  community,
  city,
  priceAed,
  beds,
  status,
  phoneUrl,
  mobileSections,
}: {
  gallery: PropertyImage[];
  title: string;
  slug: string;
  community: string;
  city: string;
  priceAed: number;
  beds: number;
  status: string;
  phoneUrl: string;
  mobileSections: Record<string, ReactNode>;
}) {
  const [heroImage, setHeroImage] = useState(0);
  const [activeSection, setActiveSection] = useState("About");
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
          <CompareToggle
            slug={slug}
            className="absolute right-4 top-4 h-11 w-11 border border-white/60 bg-canvas/75"
          />
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
                  <span className="rounded-full bg-slate/70 px-3 py-1.5 backdrop-blur-sm">
                    <FormattedPrice amountAed={priceAed} />
                  </span>
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
              <Waves size={17} aria-label="Pool amenity" />
              <House size={17} aria-label="Villa" />
              <LayoutGrid size={17} aria-label="Floor plan" />
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

        <div className="mt-4 grid grid-cols-2 gap-2">
          {["About", "Investment analysis", "Yield strategy simulator", "5 year hold & appreciation", "Payment plan & fee transparency"].map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => setActiveSection(label)}
              className={`${label === "About" ? "col-span-2 " : ""}${activeSection === label
                ? "min-w-0 rounded-full border border-white/30 bg-royal-deep/80 px-3 py-2.5 text-xs font-medium leading-tight text-white shadow-[inset_0_1px_0_rgba(255,255,255,.28),0_8px_24px_-16px_rgba(58,45,40,.65)] backdrop-blur-xl transition hover:bg-royal-deep/90"
                : "min-w-0 rounded-full border border-white/70 bg-white/35 px-3 py-2.5 text-xs font-medium leading-tight text-slate shadow-[inset_0_1px_0_rgba(255,255,255,.65),0_8px_24px_-16px_rgba(58,45,40,.45)] backdrop-blur-xl transition hover:bg-white/55"}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="sticky bottom-3 z-10 mt-4 flex items-center justify-between rounded-[1.5rem] border border-white/65 bg-white/35 px-4 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,.72),0_18px_45px_-28px_rgba(58,45,40,.55)] backdrop-blur-xl">
          <div>
            <p className="text-xs text-slate/55">Guide price</p>
            <p className="text-xl font-semibold text-slate">
              <FormattedPrice amountAed={priceAed} />
            </p>
          </div>
          <a href={phoneUrl} className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-[#285943]/90 px-5 py-3 text-xs font-medium text-white shadow-[inset_0_1px_0_rgba(255,255,255,.2),0_8px_20px_-12px_rgba(40,89,67,.75)] backdrop-blur-xl transition hover:bg-[#214a38]">
            <span className="pulse-dot h-2 w-2 rounded-full bg-[#25D366]" />
            Book a call
          </a>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="mt-5 min-w-0 overflow-hidden border-t border-slate/10 pt-6"
          >
            {mobileSections[activeSection]}
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}
