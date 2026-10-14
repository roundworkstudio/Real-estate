import {
  PLACEHOLDER_WHATSAPP_URL,
  WHATSAPP_BROADCAST_LIVE,
  WHATSAPP_BROADCAST_URL,
} from "@/lib/site-config";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";

/**
 * WhatsApp lead banner. Green here is a scoped exception to
 * brand-guidelines.md's monochromatic-palette rule — it's WhatsApp's own
 * near-universal brand convention, used only on WhatsApp-specific elements.
 *
 * Until WHATSAPP_BROADCAST_LIVE is switched on, this invites a direct
 * message rather than promising launch alerts from a list that doesn't
 * exist yet. No response-time claim until Janvi confirms one.
 */
const COPY = WHATSAPP_BROADCAST_LIVE
  ? {
      title: "New launches on WhatsApp",
      body: "Join Janvi’s list for new launches and EOI dates as developers release them, with her view on which are worth a look.",
      cta: "Join the list",
      href: WHATSAPP_BROADCAST_URL,
    }
  : {
      title: "Questions about a home? Ask on WhatsApp",
      body: "Message Janvi about any home, project or area. Voice notes and photos are welcome, and she replies herself.",
      cta: "Chat on WhatsApp",
      href: PLACEHOLDER_WHATSAPP_URL,
    };

export function WhatsAppBanner() {
  return (
    <div className="grid grid-cols-1 gap-8 rounded-2xl border border-slate/10 bg-canvas p-8 shadow-card sm:grid-cols-2 sm:items-center sm:gap-10 sm:p-10">
      <div>
        <h2 className="text-2xl font-semibold text-slate sm:text-3xl">{COPY.title}</h2>
        <p className="mt-3 text-slate/70">{COPY.body}</p>
      </div>

      <div className="flex justify-center sm:justify-end">
        <WhatsAppButton
          href={COPY.href}
          variant="green"
          className="w-full max-w-[260px] sm:w-auto sm:max-w-none"
        >
          {COPY.cta}
        </WhatsAppButton>
      </div>
    </div>
  );
}
