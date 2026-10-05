/**
 * Real contact number for WhatsApp and phone CTAs site-wide.
 */
export const PLACEHOLDER_PHONE_NUMBER = "971555881148";
export const PLACEHOLDER_PHONE_NUMBER_DISPLAY = "+971 55 588 1148";
export const PLACEHOLDER_WHATSAPP_URL = `https://wa.me/${PLACEHOLDER_PHONE_NUMBER}`;
export const PLACEHOLDER_TEL_URL = `tel:+${PLACEHOLDER_PHONE_NUMBER}`;

/**
 * Placeholder contact address for ContactForm's `mailto:` handoff
 * (2026-09-27) — `.example` is an IANA-reserved TLD set aside specifically
 * for documentation/placeholder use (RFC 2606), guaranteed to never
 * resolve to a real mailbox, same "real enough for layout, impossible to
 * mistake for genuine" rule as the phone number above. Replace once the
 * client supplies a real inbox — see docs/client-inputs-required.md.
 */
export const PLACEHOLDER_EMAIL = "hello@janvi-realestate.example";
