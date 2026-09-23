import { MessageCircle } from "lucide-react";

/**
 * Site-wide sticky trigger — mounted in the root layout, not per-page.
 * Same placeholder number as WhatsAppBanner; see its note.
 */
const WHATSAPP_NUMBER = "971500000000";

export function WhatsAppFloatingButton() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-sovereign px-5 py-3 text-sm font-semibold text-white shadow-card transition-colors hover:bg-sovereign/90"
    >
      <MessageCircle size={18} />
      Ask an advisor
    </a>
  );
}
