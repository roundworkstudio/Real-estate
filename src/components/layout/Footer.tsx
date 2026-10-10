import Link from "next/link";
import { Mail } from "lucide-react";
import { WhatsAppLogo } from "@/components/ui/WhatsAppButton";
import { CurrencySwitcher } from "@/components/tools/CurrencySwitcher";
import { PLACEHOLDER_PHONE_NUMBER_DISPLAY, PLACEHOLDER_EMAIL, PLACEHOLDER_WHATSAPP_URL } from "@/lib/site-config";

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
              <WhatsAppLogo className="h-5 w-5 text-[#25D366]" />
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
          <Link href="/contact" className="hover:text-slate">
            Contact
          </Link>
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
