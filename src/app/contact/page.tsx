/**
 * Contact — reached from the scroll bubble in the top bar (mobile and the
 * desktop compact nav). Direct routes first (WhatsApp, call, email) since
 * that's how most buyers reach Janvi, then the enquiry form. The form has
 * no backend yet; ContactForm hands off to `mailto:` (see its own note).
 * The office address is still pending from the client, same as the
 * footer's bracketed BRN/ORN.
 */
import type { Metadata } from "next";
import { Lock, Mail, MapPin, Phone } from "lucide-react";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { ContactForm } from "@/components/home/ContactForm";
import { WhatsAppButton } from "@/components/ui/WhatsAppButton";
import {
  PLACEHOLDER_EMAIL,
  PLACEHOLDER_PHONE_NUMBER_DISPLAY,
  PLACEHOLDER_TEL_URL,
  PLACEHOLDER_WHATSAPP_URL,
} from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact · Janvi Real Estate",
  description:
    "Talk to Janvi about buying or investing in Abu Dhabi and Dubai property, on WhatsApp, by phone or by email.",
};

const ROUTES = [
  {
    href: PLACEHOLDER_TEL_URL,
    icon: Phone,
    label: "Call",
    value: PLACEHOLDER_PHONE_NUMBER_DISPLAY,
  },
  {
    href: `mailto:${PLACEHOLDER_EMAIL}`,
    icon: Mail,
    label: "Email",
    value: PLACEHOLDER_EMAIL,
  },
];

export default function ContactPage() {
  return (
    <main>
      <div className="relative hidden bg-slate md:block">
        <Nav compactStyle />
        <div className="h-20" />
      </div>

      <section className="mx-auto max-w-6xl px-6 pt-28 pb-16 sm:px-10 md:pt-16">
        <h1 className="max-w-xl text-3xl font-semibold leading-tight text-slate sm:text-5xl">
          Talk to Janvi
        </h1>
        <p className="mt-4 max-w-xl text-slate/75 sm:text-lg">
          Buying to live in, investing, or just weighing up Abu Dhabi and
          Dubai. Messages go to Janvi directly, not a call centre.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.15fr] lg:gap-10">
          <div className="flex flex-col gap-4">
            <div className="liquid-glass-light rounded-[2rem] p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-slate">
                Quickest: WhatsApp
              </h2>
              <p className="mt-1 text-sm text-slate/75">
                Send a message any time. Voice notes and photos welcome.
              </p>
              <WhatsAppButton
                href={PLACEHOLDER_WHATSAPP_URL}
                variant="green"
                className="mt-5 w-full"
              >
                Chat on WhatsApp
              </WhatsAppButton>
            </div>

            <ul className="liquid-glass-light divide-y divide-slate/10 rounded-[2rem] px-6 sm:px-8">
              {ROUTES.map(({ href, icon: Icon, label, value }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="group flex items-center gap-4 py-4"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-royal-deep/10 text-royal-deep">
                      <Icon size={18} aria-hidden />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs font-medium text-slate/65">
                        {label}
                      </span>
                      <span className="block truncate text-slate group-hover:text-royal-deep">
                        {value}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
              <li className="flex items-center gap-4 py-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-royal-deep/10 text-royal-deep">
                  <MapPin size={18} aria-hidden />
                </span>
                <span>
                  <span className="block text-xs font-medium text-slate/65">
                    Office
                  </span>
                  <span className="block text-slate">
                    [pending] · Abu Dhabi
                  </span>
                </span>
              </li>
            </ul>
          </div>

          <div className="liquid-glass-light rounded-[2rem] bg-white/60 p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-slate">
              Send an enquiry
            </h2>
            <p className="mt-1 mb-5 text-sm text-slate/75">
              Tell Janvi your budget, timeline and what you&rsquo;re looking
              for, and she&rsquo;ll come back with options that fit.
            </p>
            <ContactForm />
            <p className="mt-5 flex items-center gap-1.5 text-xs text-slate/65">
              <Lock size={12} aria-hidden /> Goes to Janvi directly. No
              mailing lists.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
