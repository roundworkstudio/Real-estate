import {
  Home,
  List,
  Building2,
  Briefcase,
  Newspaper,
  User,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

/**
 * Single source of truth for site navigation — both Nav.tsx (desktop top
 * bar) and MobileTabBar.tsx (mobile bottom bar) render from this list, so
 * adding/renaming a link never has to happen in two places. Icons are
 * only used by the mobile tab bar (a text-only top nav doesn't need
 * them), but live here anyway rather than in a second list.
 *
 * Down from 8 entries to 6 (2026-09-27, explicit request): Analytics
 * folded into Insights (one page, two sections — see app/insights/page.tsx)
 * and Areas folded into About (same pattern — see app/about/page.tsx).
 * /analytics and /areas still resolve via next.config.ts's `redirects()`.
 *
 * "Home" added back 2026-09-27 (explicit request, mobile-only via
 * `mobileOnly`) — desktop's logo already links home, so a text "Home"
 * link there would be redundant chrome next to it; MobileTabBar has no
 * equivalent logo, so it gets an explicit entry. Properties' icon swapped
 * from `Home` to `List` the same request ("give properties a list icon")
 * — it had been sitting on the home icon only because nothing else
 * needed it yet.
 */
export const navLinks: {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Shown in MobileTabBar only — filtered out of Nav's desktop links. */
  mobileOnly?: boolean;
}[] = [
  { href: "/", label: "Home", icon: Home, mobileOnly: true },
  { href: "/properties", label: "Properties", icon: List },
  // Index not yet in SITEMAP.md (only /developments/[slug] is planned
  // there) — see app/developments/page.tsx's top comment.
  { href: "/developments", label: "Projects", icon: Building2 },
  { href: "/portfolio", label: "Portfolio", icon: Briefcase },
  { href: "/insights", label: "Insights", icon: Newspaper },
  { href: "/about", label: "About", icon: User },
  // Not yet in SITEMAP.md — see app/invest/page.tsx's top comment.
  { href: "/invest", label: "Invest", icon: TrendingUp },
];
