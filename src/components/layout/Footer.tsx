import Link from "next/link";
import { Mail } from "lucide-react";
import { CurrencySwitcher } from "@/components/tools/CurrencySwitcher";
import { PLACEHOLDER_PHONE_NUMBER_DISPLAY, PLACEHOLDER_EMAIL, PLACEHOLDER_WHATSAPP_URL } from "@/lib/site-config";

function WhatsAppLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="#25D366"
    >
      <path d="M12.04 2a9.84 9.84 0 0 0-8.42 14.91L2.05 22l5.2-1.53A9.82 9.82 0 0 0 12.04 21h.01a9.91 9.91 0 0 0 9.9-9.9A9.85 9.85 0 0 0 12.04 2Zm0 17.33a8.22 8.22 0 0 1-4.2-1.15l-.3-.18-3.08.91.82-3-.2-.31a8.26 8.26 0 1 1 7 3.83Zm4.71-5.37c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.16.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.24-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.84-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.87.85-.87 2.07s.89 2.4 1.01 2.57c.12.17 1.75 2.67 4.24 3.75.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.11-.23-.17-.48-.29Z" />
    </svg>
  );
}

function iCloudMailIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 12c0-2.5 2-4.5 4.5-4.5 .3-1.5 1.8-2.5 3.5-2.5 1.7 0 3.2 1 3.5 2.5 2.5 0 4.5 2 4.5 4.5 0 2.8-2.2 5-5 5H7c-2.8 0-5-2.2-5-5Z" />
      <path d="M8 16l2-2 2 2m0 0l2-2 2 2" />
    </svg>
  );
}

/**
 * Footer with contact information: WhatsApp number and email address.
 */
export function Footer() {
  return (
    <footer className="border-t border-slate/10 px-6 pt-10 pb-[calc(7rem+env(safe-area-inset-bottom))] text-sm text-slate/75 sm:px-10 md:pb-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="font-medium text-slate">Janvi Real Estate</div>
          <div className="mt-1">
            BRN [pending] · ORN [pending] · 123 Placeholder Street, Abu Dhabi
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:items-end">
          <div className="flex items-center gap-3">
            <a
              href={PLACEHOLDER_WHATSAPP_URL}
              className="inline-flex items-center gap-2 text-slate/75 hover:text-slate transition-colors"
              title="Chat on WhatsApp"
            >
              <WhatsAppLogo className="h-5 w-5" />
              <span>{PLACEHOLDER_PHONE_NUMBER_DISPLAY}</span>
            </a>
          </div>

          <a
            href={`mailto:${PLACEHOLDER_EMAIL}`}
            className="inline-flex items-center gap-2 text-slate/75 hover:text-slate transition-colors"
            title="Send an email"
          >
            <Mail size={20} className="text-blue-500" />
            <span>{PLACEHOLDER_EMAIL}</span>
          </a>
        </div>

        <div className="flex gap-6">
          <Link href="/privacy" className="hover:text-slate">
            Privacy
          </Link>
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CurrencySwitcher />
        <div className="text-xs text-slate/65">
          © {new Date().getFullYear()} Janvi Real Estate. All rights reserved.
          Prices convert at illustrative rates, not a live quote.
        </div>
      </div>
    </footer>
  );
}
