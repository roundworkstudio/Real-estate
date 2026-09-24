"use client";

import { MessageCircle } from "lucide-react";
import { useMagnetic } from "@/lib/motion";

/**
 * Site-wide sticky trigger — mounted in the root layout, not per-page.
 * Same placeholder number as WhatsAppBanner; see its note. Magnetic pull
 * on hover — a real, always-available action, unlike AISearchBar's
 * disabled "Search" button, which deliberately doesn't get this treatment
 * (no point making a non-functional button feel more tactile).
 */
const WHATSAPP_NUMBER = "971500000000";

export function WhatsAppFloatingButton() {
  const ref = useMagnetic<HTMLAnchorElement>();

  return (
    <a
      ref={ref}
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      className="fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 rounded-full bg-sovereign px-5 py-3 text-sm font-semibold text-white shadow-card transition-colors hover:bg-sovereign/90"
    >
      <MessageCircle size={18} />
      Ask an advisor
    </a>
  );
}
