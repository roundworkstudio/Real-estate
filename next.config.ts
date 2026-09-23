import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // The in-app preview browser used during development refuses to render
    // an <img> whose response carries Content-Disposition: attachment —
    // which is exactly what Next's /_next/image optimizer sets on every
    // response. Static files under public/ don't carry that header and
    // load fine, so disabling optimization avoids the endpoint entirely.
    // Revisit before launch: Vercel's own image optimization in production
    // is a separate code path and may not have this issue — test there
    // before assuming this restriction still applies.
    unoptimized: true,
  },
};

export default nextConfig;
