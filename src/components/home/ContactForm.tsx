"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Loader2 } from "lucide-react";
import { PLACEHOLDER_EMAIL } from "@/lib/site-config";

type Values = { name: string; email: string; message: string };
type FieldErrors = Partial<Record<keyof Values, string>>;
type Status = "idle" | "loading" | "success";

const EMPTY_VALUES: Values = { name: "", email: "", message: "" };

function validate(values: Values): FieldErrors {
  const errors: FieldErrors = {};
  if (!values.name.trim()) errors.name = "Enter your name.";
  if (!values.email.trim()) errors.email = "Enter your email.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
    errors.email = "Enter a valid email address.";
  if (!values.message.trim()) errors.message = "Let us know what you're looking for.";
  return errors;
}

/**
 * Field flags an error only once it's left (`touched`), and the error
 * clears the moment the value is fixed — same rule as beui.dev's
 * "Sign Up Form" block (2026-09-27, explicit request — "use this style
 * for the get in touch section"). Rebuilt on this site's own primitives
 * (`motion/react`, already a dependency) rather than installed from
 * shadcn, and re-fielded for a contact enquiry (name/email/message) —
 * the source form's password field and strength meter don't apply here,
 * so only the touched-validation and animated-submit-lifecycle parts of
 * its style carried over.
 */
function Field({
  label,
  name,
  type = "text",
  as = "input",
  value,
  error,
  onChange,
  onBlur,
}: {
  label: string;
  name: string;
  type?: string;
  as?: "input" | "textarea";
  value: string;
  error?: string;
  onChange: (value: string) => void;
  onBlur: () => void;
}) {
  const inputClassName = `w-full rounded-lg border bg-canvas px-4 py-3 text-sm text-slate placeholder:text-slate/40 transition-colors focus:outline-none focus:ring-2 focus:ring-royal/30 ${
    error ? "border-red-400" : "border-slate/15 focus:border-royal/40"
  }`;

  return (
    <div>
      <label htmlFor={name} className="sr-only">
        {label}
      </label>
      {as === "textarea" ? (
        <textarea
          id={name}
          placeholder={label}
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={inputClassName}
        />
      ) : (
        <input
          id={name}
          type={type}
          placeholder={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          className={inputClassName}
        />
      )}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            className="mt-1.5 overflow-hidden text-xs text-red-500"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * No backend/endpoint exists to actually receive this yet (see
 * PROJECT-BRIEF.md / docs/client-inputs-required.md) — same honesty rule
 * as every other placeholder on this site, just applied to a form
 * instead of a stat. Rather than fake a "message sent" success against a
 * form that goes nowhere, a valid submit hands off to a `mailto:` link
 * (PLACEHOLDER_EMAIL — real once the client supplies an inbox), which is
 * a genuine, working action with no server required. The success state
 * says exactly that, not "we'll be in touch."
 */
export function ContactForm() {
  const [values, setValues] = useState<Values>(EMPTY_VALUES);
  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const errors = validate(values);

  function setField(field: keyof Values, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
  }

  function blurField(field: keyof Values) {
    setTouched((t) => ({ ...t, [field]: true }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });
    if (Object.keys(validate(values)).length > 0) return;

    setStatus("loading");
    await new Promise((resolve) => setTimeout(resolve, 500));

    const subject = encodeURIComponent(`Enquiry from ${values.name}`);
    const body = encodeURIComponent(`${values.message}\n\n— ${values.name} (${values.email})`);
    window.location.href = `mailto:${PLACEHOLDER_EMAIL}?subject=${subject}&body=${body}`;

    setStatus("success");
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <Field
        label="Name"
        name="name"
        value={values.name}
        error={touched.name ? errors.name : undefined}
        onChange={(v) => setField("name", v)}
        onBlur={() => blurField("name")}
      />
      <Field
        label="Email"
        name="email"
        type="email"
        value={values.email}
        error={touched.email ? errors.email : undefined}
        onChange={(v) => setField("email", v)}
        onBlur={() => blurField("email")}
      />
      <Field
        label="What are you looking for?"
        name="message"
        as="textarea"
        value={values.message}
        error={touched.message ? errors.message : undefined}
        onChange={(v) => setField("message", v)}
        onBlur={() => blurField("message")}
      />

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex w-fit items-center gap-2 self-start rounded-full bg-royal-deep px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-royal-deep/90 disabled:opacity-70"
      >
        <AnimatePresence mode="wait" initial={false}>
          {status === "loading" ? (
            <motion.span
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-2"
            >
              <Loader2 size={16} className="animate-spin" />
              Sending
            </motion.span>
          ) : status === "success" ? (
            <motion.span
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
              className="flex items-center gap-2"
            >
              <Check size={16} />
              Email client opened
            </motion.span>
          ) : (
            <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              Send
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </form>
  );
}
