/**
 * Single project page, ordered the way a buyer decides: the headline facts
 * and both actions in the hero, Janvi's view, the homes themselves, what
 * it costs to pay for one, then where it is. Build progress lives in the
 * hero stats rather than a section of its own. A
 * floating action bar keeps "Price list" and WhatsApp in reach after the
 * hero scrolls away.
 *
 * Project metadata (developer pack facts, site plan, payment structure)
 * only exists for some projects, e.g. not Ramhan Island. Sections that
 * depend on it are left out rather than shown half-empty.
 */
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { developments, getDevelopment, developmentStats, JANVIS_TAKE, JANVIS_TAKE_HIGHLIGHT } from "@/lib/developments";
import type { PaymentStructureId } from "@/lib/paymentPlan";
import { isReady } from "@/lib/project-facts";
import { whatsAppUrlWithMessage } from "@/lib/site-config";
import { LocationMap } from "@/components/ui/LocationMap";
import { PriceListRequest } from "@/components/tools/PriceListRequest";
import { DevelopmentAnalytics } from "@/components/tools/DevelopmentAnalytics";
import { RevealImage } from "@/components/ui/RevealImage";
import { KineticTextReveal } from "@/components/ui/kinetic-text-reveal";
import { ProjectStats, SampleChip } from "@/components/ui/ProjectStats";
import { PaymentTimeline } from "@/components/ui/PaymentTimeline";
import { JanviTake } from "@/components/ui/JanviTake";
import { AmenityTiles } from "@/components/ui/AmenityTiles";
import { SectionNav } from "@/components/ui/SectionNav";
import { UnitTypeTabs } from "@/components/ui/UnitTypeTabs";
import { SelectedUnitProvider } from "@/components/ui/SelectedUnit";
import { ProjectActionBar } from "@/components/ui/ProjectActionBar";
import { ExploreNext } from "@/components/ui/ExploreNext";
import { WhatsAppLogo } from "@/components/ui/WhatsAppButton";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";

export function generateStaticParams() {
  return developments.map((d) => ({ slug: d.slug }));
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-royal">{eyebrow}</p>
      <h2 className="mt-1.5 text-2xl font-semibold text-slate sm:text-3xl">{title}</h2>
    </div>
  );
}

export default async function DevelopmentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const development = getDevelopment(slug);
  if (!development) notFound();

  const stats = developmentStats(development);
  const meta = development.meta;
  const developer = meta?.developer ?? development.properties[0].developer;
  const heroImage = meta?.heroImage ?? development.properties[0].image;
  const offPlan = !isReady(development);
  const paymentStructureId: PaymentStructureId = meta?.paymentStructureId ?? "60-40";
  const take = JANVIS_TAKE[slug];
  const next = developments.find((d) => d.slug !== slug);

  const sections = [
    { id: "overview", label: "Overview" },
    { id: "homes", label: "Homes" },
    { id: "payment", label: offPlan ? "Payment plan" : "Costs" },
    { id: "location", label: "Location" },
    ...(next ? [{ id: "other-projects", label: "Other projects" }] : []),
  ];

  return (
    <main>
      <section id="project-hero" className="relative flex flex-col justify-end overflow-hidden">
        <Image src={heroImage.src} alt={heroImage.alt} fill preload sizes="100vw" className="object-cover" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgb(30 22 18 / 0.72), rgb(30 22 18 / 0.12) 50%, rgb(30 22 18 / 0)), linear-gradient(to right, rgb(30 22 18 / 0.3), rgb(30 22 18 / 0) 55%)",
          }}
        />
        <Nav compactStyle />

        <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-end gap-6 px-4 pb-10 pt-24 sm:px-10 md:grid-cols-[1fr_minmax(0,26rem)] md:items-stretch md:gap-10 md:pb-16 md:pt-32">
          <div className="flex flex-col md:justify-between">
            <Link
              href="/developments"
              className="liquid-glass btn-hover group inline-flex w-fit items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium text-white"
            >
              <ArrowLeft size={13} className="transition-transform duration-300 group-hover:-translate-x-0.5" /> Projects
            </Link>
            <div>
              <p className="mt-5 text-sm font-medium text-white/75">
                {developer ? `${developer} · ` : ""}
                {development.city}
              </p>
              <h1 className="mt-1 text-5xl font-semibold leading-[1.02] text-white sm:text-7xl">
                <KineticTextReveal text={development.name} stagger={0.09} delay={0.15} />
              </h1>
            </div>
          </div>

          <div className="liquid-glass liquid-glass--tint rounded-[1.75rem] p-4 text-white sm:p-5 md:self-end">
            <ProjectStats development={development} onDark />
            {meta?.paymentStructureId && (
              <PaymentTimeline
                structureId={paymentStructureId}
                fromPriceAed={stats.minPriceAed}
                tone="dark"
                className="mt-4 border-t border-white/20 pt-4"
              />
            )}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <PriceListRequest project={development.name} developer={developer} variant="onDark" />
              <a
                href={whatsAppUrlWithMessage(`Hi Janvi, I'm looking at ${development.name} and have a few questions.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-hover relative inline-flex items-center justify-center gap-2 rounded-full bg-[#0B6B35] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#095a2c]"
              >
                <WhatsAppLogo className="h-4 w-4" /> WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <SectionNav items={sections} showAfterId="project-hero" />

      <SelectedUnitProvider className="mx-auto max-w-6xl px-4 sm:px-10">
        <section id="overview" className="scroll-mt-24 pt-14 md:pt-20">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-[1.2fr_1fr] md:gap-16">
            <div>
              <SectionHeading eyebrow="Overview" title={`About ${development.name}`} />
              {meta?.description && (
                <p className="mt-4 max-w-xl leading-relaxed text-slate/75">{meta.description}</p>
              )}
              {take && (
                <JanviTake quote={take} highlight={JANVIS_TAKE_HIGHLIGHT[slug]} size="lg" className="mt-8 max-w-xl" />
              )}
              {developer && (
                <div className="liquid-glass-light mt-8 max-w-xl rounded-2xl px-5 py-4">
                  <p className="text-xs font-medium text-slate/60">Developer</p>
                  <p className="mt-1 text-lg font-semibold text-slate">{developer}</p>
                  {meta?.developerRecord && (
                    <p className="mt-1 text-sm text-slate/70">
                      {meta.developerRecord.delivered} projects delivered · {meta.developerRecord.onTime}
                      {meta.developerRecord.isSample && <SampleChip />}
                    </p>
                  )}
                </div>
              )}
            </div>
            {meta?.amenities && meta.amenities.length > 0 && (
              <div>
                <p className="text-xs font-medium text-slate/60">On the doorstep</p>
                <AmenityTiles amenities={meta.amenities} className="mt-3" />
              </div>
            )}
          </div>
        </section>

        <section id="homes" className="scroll-mt-24 pt-20 md:pt-28">
          <SectionHeading
            eyebrow="Homes"
            title={stats.unitCount === 1 ? "The home for sale" : `${stats.unitCount} homes for sale`}
          />
          <div className="mt-6">
            <UnitTypeTabs properties={development.properties} project={development.name} />
          </div>
        </section>

        <section id="payment" className="scroll-mt-24 pt-20 md:pt-28">
          <SectionHeading
            eyebrow={offPlan ? "Payment plan" : "Costs"}
            title={offPlan ? "How you'd pay for it" : "What it costs to own"}
          />
          <div className="mt-6">
            <DevelopmentAnalytics
              properties={development.properties}
              defaultPaymentStructureId={paymentStructureId}
              paymentStructureIds={meta?.paymentStructureId ? [meta.paymentStructureId] : undefined}
              handoverMonths={meta?.handoverMonths}
            />
          </div>
        </section>

        <section id="location" className="scroll-mt-24 pt-20 md:pt-28">
          <SectionHeading eyebrow="Location" title={meta?.siteplanImage ? "Site plan and map" : "On the map"} />
          <div className={`mt-6 grid grid-cols-1 gap-6 ${meta?.siteplanImage ? "md:grid-cols-2" : ""}`}>
            {meta?.siteplanImage && (
              <figure>
                <RevealImage
                  src={meta.siteplanImage.src}
                  alt={meta.siteplanImage.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  containerClassName="relative aspect-[4/3] w-full rounded-2xl shadow-card"
                  className="object-cover"
                />
                <figcaption className="mt-2 text-xs text-slate/60">Site plan</figcaption>
              </figure>
            )}
            <LocationMap query={`${development.name}, ${development.city}`} />
          </div>
        </section>

        <section id="other-projects" data-action-bar-hide className="scroll-mt-24 pb-20 pt-20 md:pt-28">
          {next && (
            <ExploreNext
              eyebrow="Next project"
              title={next.name}
              body={JANVIS_TAKE[next.slug] ?? `${next.properties.length} homes in ${next.city}.`}
              href={`/developments/${next.slug}`}
              cta={`See ${next.name}`}
              image={next.meta?.heroImage ?? next.properties[0].image}
            />
          )}
          <Link
            href="/developments"
            className="group mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate/70 transition-colors hover:text-slate"
          >
            <ArrowLeft size={14} className="transition-transform duration-300 group-hover:-translate-x-1" /> All projects
          </Link>
        </section>
      </SelectedUnitProvider>

      <div data-action-bar-hide>
        <Footer />
      </div>

      <ProjectActionBar project={development.name} developer={developer} fromPriceAed={stats.minPriceAed} />
    </main>
  );
}
