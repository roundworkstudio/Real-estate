/**
 * Developments index — groups current listings by project. SITEMAP.md
 * plans `/developments/[slug]` but not an index; adding one here since
 * browsing by project is the actual ask, same "not yet in SITEMAP.md, flag
 * it" pattern as /invest and /analytics.
 */
import { developments, developmentStats } from "@/lib/developments";
import { DevelopmentCard } from "@/components/ui/DevelopmentCard";
import { Reveal } from "@/components/ui/Reveal";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";

export default function DevelopmentsPage() {
  return (
    <main>
      <div className="relative bg-slate">
        <Nav />
        <div className="h-20" />
      </div>

      <section className="mx-auto max-w-5xl px-6 py-16 sm:px-10">
        <h1 className="text-3xl font-semibold text-slate sm:text-4xl">Projects</h1>
        <p className="mt-3 max-w-xl text-slate/70">
          Current listings grouped by development, with project-level
          figures pulled live from the listings in each one.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-2">
          {developments.map((d, i) => (
            <Reveal key={d.slug} delayMs={i * 100}>
              <DevelopmentCard development={d} stats={developmentStats(d)} />
            </Reveal>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
