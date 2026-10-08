"use client";

import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { FileText, Lock, X } from "lucide-react";
import { PLACEHOLDER_EMAIL, whatsAppUrlWithMessage } from "@/lib/site-config";
import { lockScroll, unlockScroll } from "@/lib/scroll-lock";
import { WhatsAppLogo } from "@/components/ui/WhatsAppButton";

type Intent = "invest" | "live" | "both";

const INTENTS: { key: Intent; label: string; phrase: string }[] = [
  { key: "invest", label: "To invest", phrase: "as an investment" },
  { key: "live", label: "To live in", phrase: "as a home to live in" },
  { key: "both", label: "Both", phrase: "both as a home and an investment" },
];

const TRIGGER_STYLES = {
  light: "border border-slate/15 bg-white/70 text-slate hover:bg-white",
  glass: "liquid-glass text-white",
  onDark: "border border-white/30 bg-white/10 text-white backdrop-blur-md hover:bg-white/20",
} as const;

/**
 * Price list and availability request for one project. Two routes: a
 * pre-filled WhatsApp message, or a private request by email. There's no
 * form backend yet, so the email route hands off to `mailto:` the same way
 * ContactForm does rather than faking a "sent" state.
 */
export function PriceListRequest({
  project,
  developer,
  variant = "light",
  className = "",
}: {
  project: string;
  developer?: string;
  variant?: keyof typeof TRIGGER_STYLES;
  className?: string;
}) {
  const uid = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [intent, setIntent] = useState<Intent>("invest");
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      dialog.showModal();
      lockScroll();
      return () => {
        unlockScroll();
        if (dialog.open) dialog.close();
      };
    }
  }, [open]);

  const phrase = INTENTS.find((i) => i.key === intent)!.phrase;
  const message = `Hi Janvi, could you send me the latest price list and availability for ${project}? I'm interested ${phrase}.`;
  const canSubmit = name.trim().length > 0 && contact.trim().length > 0;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    const subject = encodeURIComponent(`Price list request: ${project}`);
    const body = encodeURIComponent(`${message}\n\n${name.trim()}\n${contact.trim()}`);
    window.location.href = `mailto:${PLACEHOLDER_EMAIL}?subject=${subject}&body=${body}`;
    setSubmitted(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setSubmitted(false);
          setOpen(true);
        }}
        className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${TRIGGER_STYLES[variant]} ${className}`}
      >
        <FileText size={15} aria-hidden />
        Price list
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby={`${uid}-title`}
        onClose={() => setOpen(false)}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(false);
        }}
        data-lenis-prevent
        className="m-0 mt-auto w-full max-w-none bg-transparent p-0 backdrop:bg-slate/55 backdrop:backdrop-blur-sm sm:m-auto sm:max-w-md"
      >
        <div className="liquid-glass-light max-h-[90dvh] overflow-y-auto rounded-t-[2rem] bg-canvas p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] text-slate sm:rounded-[2rem] sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-medium text-slate/70">
                {developer ? `${developer} · ` : ""}{project}
              </p>
              <h2 id={`${uid}-title`} className="mt-1 text-2xl font-semibold">
                Price list &amp; availability
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="-mr-2 -mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-slate/70 transition-colors hover:bg-slate/5 hover:text-slate"
            >
              <X size={20} />
            </button>
          </div>
          <p className="mt-2 text-sm text-slate/75">
            Current prices, floor plans and the units still available, sent to
            you personally by Janvi.
          </p>

          <fieldset className="mt-5">
            <legend className="text-xs font-medium text-slate/70">I&rsquo;m buying</legend>
            <div className="mt-2 grid grid-cols-3 gap-1 rounded-full bg-slate/5 p-1">
              {INTENTS.map((i) => (
                <label
                  key={i.key}
                  className={`cursor-pointer rounded-full py-2 text-center text-sm font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-royal/40 ${intent === i.key ? "liquid-pill text-white" : "text-slate/70 hover:text-slate"}`}
                >
                  <input
                    type="radio"
                    name={`${uid}-intent`}
                    value={i.key}
                    checked={intent === i.key}
                    onChange={() => setIntent(i.key)}
                    className="sr-only"
                  />
                  {i.label}
                </label>
              ))}
            </div>
          </fieldset>

          <a
            href={whatsAppUrlWithMessage(message)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 flex items-center justify-center gap-2.5 rounded-full bg-[#0B6B35] px-5 py-3.5 text-sm font-medium text-white transition-colors hover:bg-[#095a2c]"
          >
            <WhatsAppLogo className="h-5 w-5" />
            Request on WhatsApp
          </a>

          <div className="my-5 flex items-center gap-3 text-xs text-slate/65">
            <span className="h-px flex-1 bg-slate/10" />
            or request privately
            <span className="h-px flex-1 bg-slate/10" />
          </div>

          {submitted ? (
            <p className="rounded-2xl bg-white/70 px-4 py-3 text-sm text-slate/80">
              Your email app should have opened with the request ready to send.
              If it didn&rsquo;t, email{" "}
              <a href={`mailto:${PLACEHOLDER_EMAIL}`} className="font-medium text-royal-deep underline">
                {PLACEHOLDER_EMAIL}
              </a>
              .
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
              <label className="sr-only" htmlFor={`${uid}-name`}>Name</label>
              <input
                id={`${uid}-name`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
                autoComplete="name"
                className="w-full rounded-xl border border-slate/15 bg-white/80 px-4 py-3 text-sm placeholder:text-slate/50 focus:border-royal/40 focus:outline-none focus:ring-2 focus:ring-royal/30"
              />
              <label className="sr-only" htmlFor={`${uid}-contact`}>Email or phone</label>
              <input
                id={`${uid}-contact`}
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                placeholder="Email or phone"
                autoComplete="email"
                className="w-full rounded-xl border border-slate/15 bg-white/80 px-4 py-3 text-sm placeholder:text-slate/50 focus:border-royal/40 focus:outline-none focus:ring-2 focus:ring-royal/30"
              />
              <button
                type="submit"
                disabled={!canSubmit}
                className="rounded-full bg-royal-deep px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-royal-deep/90 disabled:opacity-50"
              >
                Send private request
              </button>
            </form>
          )}

          <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate/65">
            <Lock size={12} aria-hidden /> Goes to Janvi directly. No mailing lists.
          </p>
        </div>
      </dialog>
    </>
  );
}
