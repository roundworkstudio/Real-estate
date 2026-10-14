/**
 * About: who Janvi is, her track record, how she works, where she works,
 * and how to reach her. /areas redirects to #areas here (next.config.ts).
 *
 * Still waiting on Janvi (keep visible gaps honest rather than invented):
 * BIO is a draft built from what the site already shows, for her to
 * approve or rewrite; TRACK_RECORD figures carry Sample chips; there are
 * no testimonials until real, attributable ones arrive.
 */
import Image from "next/image";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { Reveal } from "@/components/ui/Reveal";
import { StackedSteps } from "@/components/insights/StackedSteps";
import type { BuyingStep } from "@/lib/insights";
import { StatFigure } from "@/components/ui/StatFigure";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import { TRACK_RECORD } from "@/components/home/CredibilityNumbers";
import { AreasPreview } from "@/components/home/AreasPreview";
import {
  PLACEHOLDER_EMAIL,
  PLACEHOLDER_PHONE_NUMBER_DISPLAY,
  PLACEHOLDER_TEL_URL,
  PLACEHOLDER_WHATSAPP_URL,
  WHATSAPP_BROADCAST_LIVE,
} from "@/lib/site-config";

const PORTRAIT = {
  src: "/media/people/janvi-about.jpg",
  alt: "Janvi showing the living room of a furnished villa",
};

const ROLE = "Property consultant · Abu Dhabi & Dubai";

const BIO = [
  "I help buyers and investors find the right home in Abu Dhabi and Dubai, with a focus on villas and new launches like Wadeem Gardens on Hudayriyat Island.",
  "Before you view anything, you’ll see what it costs to buy, what it could rent for and how the payment plan works. Then I handle the viewings, paperwork and handover, and keep you updated on WhatsApp.",
];

const HOW_I_WORK: BuyingStep[] = [
  {
    title: "Numbers before viewings",
    body: "Every home on this site comes with its payment plan, rental yield and five-year growth worked out, so you know whether it fits before you travel.",
  },
  {
    title: "Abu Dhabi first, Dubai too",
    body: "Most of my homes are Abu Dhabi villas, and I cover Dubai’s main communities. I know the rules in both: DARI registration in Abu Dhabi, DLD in Dubai.",
  },
  {
    title: "Launches as they open",
    body: WHATSAPP_BROADCAST_LIVE
      ? "Clients on my WhatsApp list get new launches and EOI dates as soon as developers release them, with my view on whether they’re worth it."
      : "I follow new launches and EOI dates as developers release them, and tell you honestly whether they’re worth it.",
  },
  {
    title: "One contact, start to finish",
    body: "Search, negotiation, the SPA and registration, snagging at handover, then letting once you have the keys.",
  },
];

function SectionHeading({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-royal">{eyebrow}</p>
      <h2 className="mt-3 text-2xl font-semibold text-slate sm:text-3xl">{title}</h2>
      {intro && <p className="mt-3 leading-relaxed text-slate/70">{intro}</p>}
    </div>
  );
}

function ContactActions({ onDark = false }: { onDark?: boolean }) {
  const secondary = onDark
    ? "liquid-glass text-white"
    : "bg-slate/[0.05] text-slate shadow-[inset_0_1px_2px_rgb(46_36_32/0.08)] hover:bg-slate/[0.08]";
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:flex sm:flex-wrap sm:items-center">
      <WhatsAppButton href={PLACEHOLDER_WHATSAPP_URL} variant="green" compact className="col-span-2 justify-center">
        Message on WhatsApp
      </WhatsAppButton>
      <a
        href={PLACEHOLDER_TEL_URL}
        className={`btn-hover relative inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium ${secondary}`}
      >
        <Phone className="h-4 w-4" aria-hidden />
        Call
      </a>
      <a
        href={`mailto:${PLACEHOLDER_EMAIL}`}
        className={`btn-hover relative inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium ${secondary}`}
      >
        <Mail className="h-4 w-4" aria-hidden />
        Email
      </a>
    </div>
  );
}

export default function AboutPage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-royal-deep">
        <Nav compactStyle />

        <div className="relative h-[86svh] min-h-[620px] md:hidden">
          <Image
            src={PORTRAIT.src}
            alt={PORTRAIT.alt}
            fill
            preload
            sizes="100vw"
            className="object-cover object-[50%_35%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate/95 via-slate/15 via-45% to-slate/30" />
          <div className="absolute inset-x-0 bottom-0 px-4 pb-5">
            <div className="px-2">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/75">Property consultant</p>
              <h1 className="mt-2 text-5xl font-semibold tracking-[-0.03em] text-white">Janvi</h1>
              <p className="mt-2 text-sm text-white/75">Abu Dhabi &amp; Dubai</p>
            </div>
            <div className="liquid-glass liquid-glass--tint mt-5 rounded-[1.75rem] p-3">
              <ContactActions onDark />
            </div>
          </div>
        </div>

        <div className="mx-auto hidden max-w-6xl grid-cols-[minmax(0,1fr)_minmax(0,24rem)] items-center gap-16 px-10 pb-20 pt-36 md:grid">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-sovereign">{ROLE}</p>
            <h1 className="mt-4 text-7xl font-semibold tracking-[-0.035em] text-white">Janvi</h1>
            <div className="mt-6 max-w-xl space-y-4 text-lg leading-relaxed text-white/80">
              {BIO.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <div className="mt-8">
              <ContactActions onDark />
            </div>
          </div>
          <figure className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-[0_40px_80px_-40px_rgb(0_0_0/0.8)]">
            <Image src={PORTRAIT.src} alt={PORTRAIT.alt} fill preload sizes="24rem" className="object-cover object-[50%_40%]" />
            <figcaption className="liquid-glass liquid-glass--tint absolute inset-x-4 bottom-4 rounded-2xl px-4 py-3 text-sm text-white">
              Janvi on a villa viewing
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="mx-auto max-w-6xl space-y-4 px-6 pt-12 text-[17px] leading-relaxed text-slate/80 sm:px-10 md:hidden">
        {BIO.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-10 sm:py-24">
        <SectionHeading eyebrow="Track record" title="The numbers so far" />
        <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {TRACK_RECORD.map((s, i) => (
            <Reveal key={s.label} delayMs={i * 80}>
              <div className="liquid-glass-light flex h-full items-center justify-center rounded-[1.5rem] px-3 py-7 sm:py-10">
                <StatFigure {...s} sample />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16 sm:px-10 sm:pb-24">
        <SectionHeading eyebrow="How I work" title="What you get working with me" />
        <div className="mt-10">
          <StackedSteps steps={HOW_I_WORK} className="space-y-[5vh]" />
        </div>
      </section>

      <section id="areas" className="mx-auto max-w-6xl scroll-mt-24 sm:pb-8">
        <AreasPreview embedded />
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20 pt-10 sm:px-10">
        <div className="rounded-[2rem] bg-royal-deep p-7 text-white sm:p-12">
          <h2 className="text-2xl font-semibold sm:text-4xl">Thinking about buying?</h2>
          <p className="mt-3 max-w-lg leading-relaxed text-white/75">
            Tell me what you’re looking for and your budget, and I’ll come back with homes that fit.
          </p>
          <div className="mt-7">
            <ContactActions onDark />
          </div>
          <div className="mt-8 flex flex-col gap-2 border-t border-white/10 pt-5 text-sm text-white/60 sm:flex-row sm:justify-between">
            <p>
              {PLACEHOLDER_PHONE_NUMBER_DISPLAY} · {PLACEHOLDER_EMAIL}
            </p>
            <p>
              Selling instead?{" "}
              <Link href="/valuation" className="text-sovereign underline-offset-4 hover:underline">
                Request a valuation
              </Link>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
