/**
 * Stopgap map embed — no API key, no signup, works today. Uses Google's
 * unofficial `output=embed` iframe endpoint (not the documented Maps
 * Embed API), so it carries Google branding/ads, offers no styling
 * control, and could break without notice since it isn't a supported
 * product. Swap for Mapbox once there's a token: same query string
 * becomes a styled, interactive map that matches the brand palette, and
 * the same integration covers the /portfolio deal map too. See the
 * conversation this was flagged in, or ask for the Mapbox wiring directly.
 */
export function LocationMap({ query }: { query: string }) {
  return (
    <div className="aspect-[16/9] w-full overflow-hidden rounded-2xl shadow-card sm:aspect-[21/9]">
      <iframe
        title={`Map: ${query}`}
        src={`https://maps.google.com/maps?q=${encodeURIComponent(query)}&output=embed`}
        className="h-full w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
