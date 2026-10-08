"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowRight, MapPin } from "lucide-react";

/**
 * Chapter break between area groups on the Properties page. The photo opens
 * out from an inset frame and drifts in parallax as it scrolls through, with
 * the same warm top-right sunlight as the hero so each area reads as the
 * next scene of the same walk.
 *
 * Deliberately light on facts: unit counts, price ranges and project detail
 * live on the Projects page, and this links there rather than repeating it.
 */
export function AreaStory({
  community,
  place,
  blurb,
  image,
  projectHref,
}: {
  community: string;
  place: string;
  blurb: string;
  image: string;
  projectHref: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const progress = useSpring(scrollYProgress, { stiffness: 110, damping: 30, mass: 0.4 });

  const clipPath = useTransform(
    progress,
    [0, 0.4],
    ["inset(10% 7% 10% 7% round 2rem)", "inset(0% 0% 0% 0% round 2rem)"],
  );
  const imageY = useTransform(progress, [0, 1], ["-8%", "8%"]);
  const textOpacity = useTransform(progress, [0.15, 0.4], [0, 1]);
  const textY = useTransform(progress, [0.15, 0.4], [24, 0]);
  const sunOpacity = useTransform(progress, [0.2, 0.5, 0.9], [0.4, 1, 0.6]);

  return (
    <motion.div
      ref={ref}
      style={reduceMotion ? undefined : { clipPath }}
      className="relative flex min-h-52 items-end overflow-hidden rounded-[2rem] sm:min-h-64"
    >
      <motion.div className="absolute -inset-y-[10%] inset-x-0" style={reduceMotion ? undefined : { y: imageY }}>
        <Image src={image} alt="" fill sizes="(min-width: 1152px) 1152px, 100vw" className="object-cover" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-r from-slate/85 via-slate/45 to-slate/5" />
      <motion.div
        className="absolute inset-0 mix-blend-soft-light"
        style={{
          opacity: reduceMotion ? 0.8 : sunOpacity,
          background: "radial-gradient(ellipse 60% 80% at 95% 0%, rgb(255 212 140 / 0.95), transparent 70%)",
        }}
      />
      <motion.div
        className="relative flex max-w-lg flex-col p-6 pt-14 text-white sm:p-10 sm:pt-16"
        style={reduceMotion ? undefined : { opacity: textOpacity, y: textY }}
      >
        <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.16em] text-white/75">
          <MapPin size={13} /> {place}
        </p>
        <h3 className="mt-2 text-2xl font-semibold leading-tight sm:text-4xl">{community}</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/80">{blurb}</p>
        <Link
          href={projectHref}
          className="group/link mt-4 inline-flex w-fit items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-3.5 py-1.5 text-xs font-medium text-white backdrop-blur-md transition hover:bg-white hover:text-slate"
        >
          Explore the project
          <ArrowRight size={13} className="transition-transform group-hover/link:translate-x-0.5" />
        </Link>
      </motion.div>
    </motion.div>
  );
}
