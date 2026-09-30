import { ProjectCard } from "@/components/ui/ProjectCard";
import { Reveal } from "@/components/ui/Reveal";
import { developments, developmentStats } from "@/lib/developments";

/**
 * Replaces FeaturedListings (2026-09-27, explicit request): the homepage
 * now leads with projects (grouped developments), not individual unit
 * listings — those live on their own page, /properties, linked from both
 * the nav ("Properties") and Hero's "View listings" CTA. Same "pending
 * real inventory" placeholder-slot pattern FeaturedListings used, since
 * there are currently only two developments (Wadeem Gardens real, Ramhan
 * Island placeholder) — see lib/developments.ts.
 */
export function FeaturedProjects() {
  return (
    <section className="px-6 py-20 sm:px-10">
      <Reveal as="div">
        <h2 className="text-2xl font-semibold text-slate sm:text-3xl">
          Featured projects
        </h2>
      </Reveal>

      <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-x-8 sm:gap-y-12 lg:grid-cols-3">
        {developments.map((d, i) => (
          <Reveal key={d.slug} delayMs={i * 100}>
            <ProjectCard development={d} stats={developmentStats(d)} />
          </Reveal>
        ))}

        <Reveal delayMs={developments.length * 100}>
          <div className="flex aspect-[4/3] flex-col items-center justify-center rounded-2xl border border-dashed border-slate/20 p-3 text-center text-xs text-slate/50 sm:aspect-auto sm:h-full sm:p-6 sm:text-sm">
            More projects pending real inventory
          </div>
        </Reveal>
      </div>
    </section>
  );
}
