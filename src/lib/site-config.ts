/**
 * Real contact number for WhatsApp and phone CTAs site-wide.
 */
export const PLACEHOLDER_PHONE_NUMBER = "971555881148";
export const PLACEHOLDER_PHONE_NUMBER_DISPLAY = "+971 55 588 1148";
export const PLACEHOLDER_WHATSAPP_URL = `https://wa.me/${PLACEHOLDER_PHONE_NUMBER}`;
export const whatsAppUrlWithMessage = (message: string) =>
  `${PLACEHOLDER_WHATSAPP_URL}?text=${encodeURIComponent(message)}`;
export const PLACEHOLDER_TEL_URL = `tel:+${PLACEHOLDER_PHONE_NUMBER}`;

/**
 * Real contact email for footer and contact CTAs.
 */
export const PLACEHOLDER_EMAIL = "janvi.p@psiassets.com";

/**
 * No WhatsApp broadcast list exists yet. While false, copy invites a direct
 * message instead of promising launch alerts; flip to true once the list is
 * running and the join link below points at it.
 */
export const WHATSAPP_BROADCAST_LIVE = false;
export const WHATSAPP_BROADCAST_URL = whatsAppUrlWithMessage(
  "Hi Janvi, please add me to your list for new launches and EOI dates.",
);
