import { Button } from "@/components/ui/Button";

/**
 * Form UI only, not wired to send anywhere yet — no backend/endpoint
 * decided. Phone/WhatsApp use an all-zeros placeholder number (real UAE
 * format for layout width, impossible to mistake for a real line) rather
 * than a fabricated number that could pass as genuine.
 */
export function ContactSection() {
  return (
    <section className="px-6 py-20 sm:px-10">
      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold text-slate sm:text-3xl">
            Get in touch
          </h2>
          <p className="mt-4 max-w-sm text-slate/70">
            Buying, selling, or just want the real numbers on a building
            before you view it.
          </p>
          <div className="mt-6 space-y-1 text-sm text-slate/60">
            <div>Phone: +971 50 000 0000</div>
            <div>WhatsApp: +971 50 000 0000</div>
          </div>
        </div>

        <form className="flex flex-col gap-4">
          <input
            disabled
            placeholder="Name"
            className="rounded-lg border border-slate/15 bg-canvas px-4 py-3 text-sm placeholder:text-slate/40"
          />
          <input
            disabled
            placeholder="Email"
            className="rounded-lg border border-slate/15 bg-canvas px-4 py-3 text-sm placeholder:text-slate/40"
          />
          <textarea
            disabled
            placeholder="What are you looking for?"
            rows={4}
            className="rounded-lg border border-slate/15 bg-canvas px-4 py-3 text-sm placeholder:text-slate/40"
          />
          <Button variant="primary" className="self-start" disabled>
            Send
          </Button>
        </form>
      </div>
    </section>
  );
}
