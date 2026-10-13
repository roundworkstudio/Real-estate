"use client";

import { useId, useState, type ReactNode } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, CalendarClock, MapPin, TrendingUp } from "lucide-react";
import { PROJECT_CARD_PRIMARY, ProjectPhotoCard } from "@/components/ui/ProjectPhotoCard";
import { growthSinceLaunch, type CompletedProject, type UpcomingLaunch } from "@/lib/developments";
import { whatsAppUrlWithMessage } from "@/lib/site-config";
import { FormattedPrice } from "@/components/ui/FormattedPrice";
import { LocationMap } from "@/components/ui/LocationMap";

export type ProjectMapPoint = { slug: string; name: string; area: string; query: string };

type Tab = "launching" | "current" | "completed";

/**
 * Launching soon / Selling now / Completed switcher for the Projects page:
 * the stages of an investment, from getting in early to seeing the result.
 * Selling-now rows are server-rendered and passed in as `current`; the map
 * underneath follows the active tab. The map embed takes a single location, so the tab's
 * projects are listed beside it and picking one re-centres the map.
 */
export function ProjectsShowcase({
  upcoming,
  current,
  currentPoints,
  completed,
}: {
  upcoming: UpcomingLaunch[];
  current: ReactNode;
  currentPoints: ProjectMapPoint[];
  completed: CompletedProject[];
}) {
  const [tab, setTab] = useState<Tab>("current");
  const id = useId();
  const reduceMotion = useReducedMotion();

  const upcomingPoints: ProjectMapPoint[] = upcoming.map((p) => ({
    slug: p.slug,
    name: p.isSample ? `${p.name} (sample)` : p.name,
    area: p.area,
    query: `${p.area}, ${p.city}`,
  }));

  const completedPoints: ProjectMapPoint[] = completed.map((p) => ({
    slug: p.slug,
    name: p.isSample ? `${p.name} (sample)` : p.name,
    area: p.area,
    query: `${p.area}, ${p.city}`,
  }));

  const tabs: { key: Tab; label: string; shortLabel: string; count: number }[] = [
    { key: "launching", label: "Launching soon", shortLabel: "Upcoming", count: upcoming.length },
    { key: "current", label: "Selling now", shortLabel: "Selling now", count: currentPoints.length },
    { key: "completed", label: "Completed", shortLabel: "Completed", count: completed.length },
  ];

  const points = tab === "launching" ? upcomingPoints : tab === "current" ? currentPoints : completedPoints;

  return (
    <>
      <div
        role="tablist"
        aria-label="Project status"
        className="liquid-glass-light mx-auto mt-8 flex w-full max-w-md rounded-full p-1 sm:mt-10 sm:w-fit sm:max-w-none"
      >
        {tabs.map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              role="tab"
              id={`${id}-${t.key}-tab`}
              aria-selected={active}
              aria-controls={`${id}-${t.key}-panel`}
              onClick={() => setTab(t.key)}
              className={`relative flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full px-3 py-2.5 text-sm font-medium transition-colors sm:flex-none sm:px-5 ${active ? "text-white" : "text-slate/70 hover:text-slate"}`}
            >
              {active && (
                <motion.span
                  layoutId={`${id}-pill`}
                  transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
                  className="liquid-pill absolute inset-0 rounded-full"
                />
              )}
              <span className="relative sm:hidden">{t.shortLabel}</span>
              <span className="relative hidden sm:inline">{t.label}</span>
              <span className={`relative hidden rounded-full px-1.5 text-xs sm:inline ${active ? "bg-white/20" : "bg-slate/10"}`}>{t.count}</span>
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`${id}-launching-panel`}
        aria-labelledby={`${id}-launching-tab`}
        hidden={tab !== "launching"}
        className="py-8 sm:py-14"
      >
        <p className="mx-auto mb-6 max-w-xl text-center text-sm text-slate/75">
          Register before launch and Janvi sends you the brochure, price list
          and allocation the moment the developer releases them.
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          {upcoming.map((p) => (
            <UpcomingCard key={p.slug} project={p} />
          ))}
        </div>
        {upcoming.some((p) => p.isSample) && (
          <p className="mt-5 text-center text-xs text-slate/70">
            Sample launches for layout. To be replaced with launches Janvi can offer early access to.
          </p>
        )}
      </div>

      <div role="tabpanel" id={`${id}-current-panel`} aria-labelledby={`${id}-current-tab`} hidden={tab !== "current"}>
        {current}
      </div>

      <div
        role="tabpanel"
        id={`${id}-completed-panel`}
        aria-labelledby={`${id}-completed-tab`}
        hidden={tab !== "completed"}
        className="py-8 sm:py-14"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          {completed.map((p) => (
            <CompletedCard key={p.slug} project={p} />
          ))}
        </div>
        {completed.some((p) => p.isSample) && (
          <p className="mt-5 text-center text-xs text-slate/70">
            Sample projects for layout. To be replaced with developments Janvi has sold into.
          </p>
        )}
      </div>

      <ProjectsMap key={tab} points={points} />
    </>
  );
}

function UpcomingCard({ project }: { project: UpcomingLaunch }) {
  const message = `Hi Janvi, please add me to the priority list for ${project.name} in ${project.area}.`;
  return (
    <ProjectPhotoCard
      image={project.image}
      sizes="(min-width: 640px) 50vw, 100vw"
      isSample={project.isSample}
      badge={
        <>
          <CalendarClock size={13} aria-hidden /> Expected {project.expectedLaunch}
        </>
      }
    >
      <p className="text-xs font-medium text-white/80">
        {project.developer} · {project.area}
      </p>
      <h3 className="mt-0.5 text-2xl font-semibold leading-tight">{project.name}</h3>
      <p className="mt-2 text-sm text-white/85">{project.pitch}</p>
      <div className="mt-3 border-t border-white/20 pt-3">
        <p className="text-xs text-white/70">Indicative price per sqft</p>
        <p className="mt-1 text-lg font-semibold">
          From <FormattedPrice amountAed={project.indicativePricePerSqftAed} compact={false} />
        </p>
      </div>
      <a href={whatsAppUrlWithMessage(message)} target="_blank" rel="noopener noreferrer" className={`mt-4 ${PROJECT_CARD_PRIMARY}`}>
        Get priority access
      </a>
    </ProjectPhotoCard>
  );
}

function CompletedCard({ project }: { project: CompletedProject }) {
  const growth = growthSinceLaunch(project);
  return (
    <ProjectPhotoCard
      image={project.image}
      sizes="(min-width: 640px) 50vw, 100vw"
      isSample={project.isSample}
      badge={`Completed ${project.completedYear}`}
    >
      <p className="text-xs font-medium text-white/80">
        {project.developer} · {project.area}
      </p>
      <h3 className="mt-0.5 text-2xl font-semibold leading-tight">{project.name}</h3>
      <div className="mt-3 flex items-end justify-between gap-4 border-t border-white/20 pt-3">
        <div>
          <p className="text-xs text-white/70">Per sqft, launch → today</p>
          <p className="mt-1 whitespace-nowrap text-sm font-medium">
            <FormattedPrice amountAed={project.launchPricePerSqftAed} compact={false} />
            {" → "}
            <FormattedPrice amountAed={project.currentPricePerSqftAed} compact={false} />
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="flex items-center justify-end gap-1 text-3xl font-semibold leading-none">
            <TrendingUp size={20} aria-hidden className="text-sovereign" />+{Math.round(growth)}%
          </p>
          <p className="mt-1 text-xs text-white/70">since launch</p>
        </div>
      </div>
      {project.caseStudyHref && (
        <Link href={project.caseStudyHref} className={`mt-4 gap-1.5 ${PROJECT_CARD_PRIMARY}`}>
          Read the case study <ArrowRight size={14} />
        </Link>
      )}
    </ProjectPhotoCard>
  );
}

function ProjectsMap({ points }: { points: ProjectMapPoint[] }) {
  const [selected, setSelected] = useState(points[0]?.slug);
  const active = points.find((p) => p.slug === selected) ?? points[0];
  if (!active) return null;

  return (
    <section aria-label="Project locations" className="pb-14">
      <div className="grid gap-4 sm:grid-cols-[14rem_1fr] sm:items-start">
        <ul className="no-scrollbar flex gap-2 overflow-x-auto sm:flex-col sm:overflow-visible">
          {points.map((p) => {
            const isActive = p.slug === active.slug;
            return (
              <li key={p.slug} className="shrink-0">
                <button
                  onClick={() => setSelected(p.slug)}
                  aria-pressed={isActive}
                  className={`flex w-full items-center gap-2.5 rounded-2xl border px-3.5 py-2.5 text-left transition-colors ${isActive ? "liquid-glass-light border-transparent text-slate" : "border-white/70 bg-white/40 text-slate/70 hover:bg-white/70"}`}
                >
                  <MapPin size={15} className={isActive ? "text-royal-deep" : "text-slate/50"} />
                  <span>
                    <span className="block text-sm font-medium leading-tight">{p.name}</span>
                    <span className="block text-xs text-slate/65">{p.area}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        <LocationMap key={active.slug} query={active.query} />
      </div>
    </section>
  );
}
