import { MessageCircle } from "lucide-react";

/**
 * WhatsApp lead-gen banner. Green here is a scoped exception to
 * brand-guidelines.md's rule that sovereign green is reserved for
 * positive financial figures (yield, ROI) — it's WhatsApp's own near-
 * universal brand convention, not a new arbitrary accent colour, so it's
 * used only on WhatsApp-specific elements (this banner, the floating
 * trigger), nowhere else.
 *
 * PLACEHOLDER: the phone number (matches the placeholder already used in
 * ContactSection/Footer) and the "< 5 mins" response-time claim are both
 * unverified — replace with the real WhatsApp Business number and a
 * defensible figure before this ships.
 */
const WHATSAPP_NUMBER = "971500000000"; // placeholder — see note above

export function WhatsAppBanner() {
  return (
    <div className="grid grid-cols-1 gap-8 rounded-2xl border border-slate/10 bg-canvas p-8 shadow-card sm:grid-cols-2 sm:items-center sm:gap-10 sm:p-10">
      <div>
        <h2 className="text-2xl font-semibold text-slate sm:text-3xl">
          Get private off-market deals on WhatsApp
        </h2>
        <p className="mt-3 text-slate/70">
          Instant pro forma access the moment a deal is available, before
          it&apos;s listed anywhere else.
        </p>
        <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-sovereign/10 px-3.5 py-1.5 text-sm font-medium text-sovereign">
          <span className="h-2 w-2 rounded-full bg-sovereign" />
          Avg. response time: &lt; 5 mins
        </div>
      </div>

      <div className="flex justify-center sm:justify-end">
        <a
          href={`https://wa.me/${WHATSAPP_NUMBER}`}
          className="inline-flex items-center gap-2.5 rounded-full bg-sovereign px-7 py-4 text-base font-semibold text-white shadow-card transition-colors hover:bg-sovereign/90"
        >
          <MessageCircle size={22} />
          Chat on WhatsApp now
        </a>
      </div>
    </div>
  );
}
