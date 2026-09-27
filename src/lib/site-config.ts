/**
 * Placeholder contact number, shared across every "Book a call"/WhatsApp
 * CTA site-wide. All-zeros UAE-format number — real enough for layout
 * width, impossible to mistake for a genuine line. Previously duplicated
 * as a local `WHATSAPP_NUMBER` const in WhatsAppFloatingButton.tsx and
 * WhatsAppBanner.tsx (same value, two copies); centralised here 2026-09-27
 * during a dead-link/dead-CTA cleanup so every "Book a call" button could
 * point at the same number instead of introducing a third copy. Replace
 * with the real number in one place once the client supplies it — see
 * docs/client-inputs-required.md.
 */
export const PLACEHOLDER_PHONE_NUMBER = "971500000000";
export const PLACEHOLDER_PHONE_NUMBER_DISPLAY = "+971 50 000 0000";
export const PLACEHOLDER_WHATSAPP_URL = `https://wa.me/${PLACEHOLDER_PHONE_NUMBER}`;
export const PLACEHOLDER_TEL_URL = `tel:+${PLACEHOLDER_PHONE_NUMBER}`;
