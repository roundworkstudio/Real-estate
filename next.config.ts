import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Insights+Analytics and About+Areas merged into single pages
  // (2026-09-27, explicit request) — these keep the old nav destinations
  // working rather than 404ing for anything that already links there.
  // `permanent: false` (307) deliberately, not 308: everything about this
  // site's structure is still rough-draft/provisional (see HANDOVER.md),
  // and a 308 gets cached hard by browsers — reversing course later would
  // be harder than it needs to be for a redirect this young.
  async redirects() {
    return [
      { source: "/analytics", destination: "/insights#tools", permanent: false },
      { source: "/areas", destination: "/about#areas", permanent: false },
    ];
  },
  images: {
    // The in-app preview browser used during development refuses to render
    // an <img> whose response carries Content-Disposition: attachment —
    // which is exactly what Next's /_next/image optimizer sets on every
    // response. Static files under public/ don't carry that header and
    // load fine, so disabling optimization avoids the endpoint entirely.
    // Revisit before launch: Vercel's own image optimization in production
    // is a separate code path and may not have this issue — test there
    // before assuming this restriction still applies.
    // Keep the workaround only in the local preview. Production on Vercel
    // should resize, compress, and cache these multi-megabyte source photos.
    unoptimized: process.env.NODE_ENV === "development",
  },
};

export default nextConfig;
