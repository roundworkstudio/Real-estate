import { MessageCircle } from "lucide-react";
import { PLACEHOLDER_WHATSAPP_URL } from "@/lib/site-config";

/**
 * Site-wide sticky trigger — mounted in the root layout, not per-page.
 * Same placeholder number as WhatsAppBanner; see lib/site-config.ts's
 * note. No longer a client component — the magnetic hover pull (useMagnetic)
 * was removed 2026-09-27 at explicit request, which was the only reason
 * this needed to be one.
 *
 * Sits higher on mobile (`bottom-24`) so it clears MobileTabBar's pill nav
 * underneath it; reverts to its original corner position at `md` and up,
 * where the tab bar doesn't render.
 *
 * A green pulsing dot badge was added here 2026-09-27, then removed the
 * same day (explicit request) — moved instead to Nav's "Book a call"
 * button. See Nav.tsx's own note.
 */
export function WhatsAppFloatingButton() {
  return (
    <a
      href={PLACEHOLDER_WHATSAPP_URL}
      className="fixed bottom-24 right-4 z-50 inline-flex items-center gap-2 rounded-full bg-sovereign px-5 py-3 text-sm font-semibold text-white shadow-card transition-colors hover:bg-sovereign/90 md:bottom-6 md:right-6"
    >
      <MessageCircle size={18} />
      Ask an advisor
    </a>
  );
}
