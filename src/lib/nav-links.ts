import {
  Home,
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
 */
export const navLinks: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/properties", label: "Properties", icon: Home },
  // Index not yet in SITEMAP.md (only /developments/[slug] is planned
  // there) — see app/developments/page.tsx's top comment.
  { href: "/developments", label: "Projects", icon: Building2 },
  { href: "/portfolio", label: "Portfolio", icon: Briefcase },
  { href: "/insights", label: "Insights", icon: Newspaper },
  { href: "/about", label: "About", icon: User },
  // Not yet in SITEMAP.md — see app/invest/page.tsx's top comment.
  { href: "/invest", label: "Invest", icon: TrendingUp },
];
