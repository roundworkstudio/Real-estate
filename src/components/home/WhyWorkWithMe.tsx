import { MessageCircle } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { GlassCard } from "@/components/ui/GlassCard";
import { PLACEHOLDER_WHATSAPP_URL } from "@/lib/site-config";

/**
 * Replaces Services (2026-09-30) and absorbs Testimonials into one
 * full-bleed section. Same photography + dark-scrim treatment as the
 * old Services section — see Services.tsx's comment for the contrast
 * and no-backdrop-filter rationale, which all still applies here.
 *
 * LAYOUT FILLER — bio copy, credentials, and testimonials are
 * placeholders. See docs/client-inputs-required.md. Headshot uses the
 * plain initial until the client-supplied portrait is ready (see
 * AboutPreview's old comment on why the frame grab was removed).
 */

const whyPoints = [
  {
    title: "Investor-first analysis",
    desc: "Every listing comes with a yield model, not just a floor plan. Numbers before viewings.",
  },
  {
    title: "Off-market access",
    desc: "Deals reach clients on WhatsApp before they're listed — Wadeem Gardens is the most recent example.",
  },
  {
    title: "UAE market depth",
    desc: "Abu Dhabi and Dubai, across all price bands, with emirate-specific transfer fee and ownership rules.",
  },
  {
    title: "End-to-end service",
    desc: "Search, negotiation, DLD registration, and ongoing letting management under one point of contact.",
  },
];

/**
 * LAYOUT FILLER — not real testimonials. Placeholder attribution uses
 * role nouns (never a fabricated full name) so this can't be mistaken
 * for a genuine endorsement if it slips into a screenshot.
 */
const testimonials = [
  {
    quote:
      "Placeholder quote standing in for a real testimonial — length and tone representative of what will replace it.",
    attribution: "A. Buyer, Saadiyat Island",
  },
  {
    quote:
      "Placeholder quote — a little shorter to test layout variance across different testimonial lengths.",
    attribution: "S. Seller, Yas Island",
  },
  {
    quote:
      "Placeholder quote from an investor's perspective rather than an owner-occupier's.",
    attribution: "M. Investor, Al Reem Island",
  },
];

export function WhyWorkWithMe() {
  return (
    <section className="relative overflow-hidden px-6 py-24 sm:px-10 sm:py-32">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/media/hero/ramhan-villa-hero.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgb(0 0 0 / 0.6), rgb(0 0 0 / 0.5))",
        }}
      />

      <div className="relative">
        {/* About + why grid */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left: about */}
          <Reveal>
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-5">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-white/10 text-2xl font-semibold text-white">
                  J
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-white">Janvi</h1>
                  <div className="mt-0.5 text-sm text-white/60">
                    Licensed real estate consultant · UAE
                  </div>
                </div>
              </div>
              <p className="max-w-md text-white/75 leading-relaxed">
                Placeholder bio — roughly fifty words, standing in for the real
                one. Covers years active, specialism, and what makes her
                approach different, in her own words rather than generated copy,
                once the real bio is supplied.
              </p>
              <a
                href={PLACEHOLDER_WHATSAPP_URL}
                className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/20"
              >
                <span className="pulse-dot h-2 w-2 rounded-full bg-[#25D366]" />
                <MessageCircle size={16} />
                Book a call
              </a>
            </div>
          </Reveal>

          {/* Right: why work with me cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {whyPoints.map((p, i) => (
              <Reveal key={p.title} delayMs={i * 80}>
                <GlassCard className="rounded-2xl bg-white/10 p-5 hover:border-royal/50">
                  <div className="text-sm font-semibold text-white">{p.title}</div>
                  <p className="mt-2 text-sm text-white/65 leading-relaxed">
                    {p.desc}
                  </p>
                </GlassCard>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <Reveal delayMs={200}>
          <div className="mt-16 border-t border-white/15 pt-12">
            <div className="text-xs font-medium uppercase tracking-widest text-white/40">
              What clients say
            </div>
            <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-3">
              {testimonials.map((t) => (
                <div key={t.attribution}>
                  <p className="text-white/75 leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <div className="mt-4 text-xs font-medium text-white/40">
                    {t.attribution}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
