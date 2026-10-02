import { PLACEHOLDER_PHONE_NUMBER_DISPLAY } from "@/lib/site-config";
import { ContactForm } from "./ContactForm";

/**
 * Phone/WhatsApp use the shared all-zeros placeholder number
 * (lib/site-config.ts — real UAE format for layout width, impossible to
 * mistake for a real line) rather than a fabricated number that could pass
 * as genuine. The form itself is ContactForm — see that component's own
 * note on why a valid submit hands off to `mailto:` instead of faking a
 * "message sent" state against a form with no backend.
 */
export function ContactSection() {
  return (
    <section id="contact" className="px-6 py-14 sm:px-10 sm:py-20">
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
            <div>Phone: {PLACEHOLDER_PHONE_NUMBER_DISPLAY}</div>
            <div>WhatsApp: {PLACEHOLDER_PHONE_NUMBER_DISPLAY}</div>
          </div>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
