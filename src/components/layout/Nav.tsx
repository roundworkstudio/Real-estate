import { Button } from "@/components/ui/Button";

const links = [
  { href: "/properties", label: "Properties" },
  // Index not yet in SITEMAP.md (only /developments/[slug] is planned
  // there) — see app/developments/page.tsx's top comment.
  { href: "/developments", label: "Projects" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/areas", label: "Areas" },
  { href: "/insights", label: "Insights" },
  { href: "/about", label: "About" },
  // Not yet in SITEMAP.md — see app/invest/page.tsx's top comment.
  { href: "/invest", label: "Invest" },
  // Not yet in SITEMAP.md — see app/analytics/page.tsx's top comment.
  { href: "/analytics", label: "Analytics" },
];

export function Nav() {
  return (
    <header className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-6 py-6 sm:px-10">
      {/* Wordmark placeholder — real logo pending, see brand-guidelines.md */}
      <a href="/" className="text-lg font-semibold text-white">
        Janvi
      </a>
      <nav className="hidden items-center gap-8 md:flex">
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="text-sm text-white/80 transition-colors hover:text-white"
          >
            {l.label}
          </a>
        ))}
      </nav>
      <Button variant="primary" className="text-sm">
        Book a call
      </Button>
    </header>
  );
}
