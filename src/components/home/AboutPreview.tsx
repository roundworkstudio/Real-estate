import { Button } from "@/components/ui/Button";

/**
 * LAYOUT FILLER — not real content. Headshot, bio, and credentials are
 * all pending from the client (see docs/client-inputs-required.md). The
 * avatar is a plain initial, not a fabricated photo of a person.
 *
 * A real frame grab (IMG_8217.mov) was used here briefly and removed on
 * request — the source photo is still at
 * frontend/public/media/people/janvi-about.jpg if it's wanted again.
 */
export function AboutPreview() {
  return (
    <section className="px-6 py-20 sm:px-10">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 text-center sm:flex-row sm:items-center sm:text-left">
        <div className="flex h-28 w-28 shrink-0 items-center justify-center rounded-full bg-sand text-3xl font-semibold text-slate">
          J
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-slate sm:text-3xl">
            About
          </h2>
          <p className="mt-3 max-w-xl text-slate/70">
            Placeholder bio copy — roughly fifty words, standing in for the
            real one. Covers years active, specialism, and what makes her
            approach different, in her own words rather than generated
            copy, once the real bio is supplied.
          </p>
          <div className="mt-5">
            <Button variant="dark">Read more</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
