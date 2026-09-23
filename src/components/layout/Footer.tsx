/**
 * Placeholder values only — a real BRN/ORN, address, and social links must
 * come from the client before this ships. BRN/ORN stay bracketed rather
 * than filled with an invented number: those are real regulatory IDs, and
 * a plausible-looking fake one is the kind of placeholder that's
 * dangerous if it ever slipped into production unnoticed. The address
 * uses an obviously-fake street name instead, since that carries no such
 * risk and layout benefits from real text width.
 */
export function Footer() {
  return (
    <footer className="border-t border-slate/10 px-6 py-10 text-sm text-slate/60 sm:px-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="font-medium text-slate">Janvi Real Estate</div>
          <div className="mt-1">
            BRN [pending] · ORN [pending] · 123 Placeholder Street, Abu Dhabi
          </div>
        </div>
        <div className="flex gap-6">
          <a href="/privacy" className="hover:text-slate">
            Privacy
          </a>
          <a href="/contact" className="hover:text-slate">
            Contact
          </a>
        </div>
      </div>
      <div className="mt-6 text-xs text-slate/40">
        © {new Date().getFullYear()} Janvi Real Estate. All rights reserved.
      </div>
    </footer>
  );
}
