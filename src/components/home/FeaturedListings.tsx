import { PropertyCard } from "@/components/ui/PropertyCard";
import { sampleProperties } from "@/lib/sample-properties";

export function FeaturedListings() {
  return (
    <section className="px-6 py-20 sm:px-10">
      <h2 className="text-2xl font-semibold text-slate sm:text-3xl">
        Featured listings
      </h2>

      <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {sampleProperties.map((p) => (
          <PropertyCard key={p.slug} property={p} />
        ))}

        {/* Real inventory is one open client input — see
            docs/client-inputs-required.md. Rough placeholder slot rather
            than a third fabricated listing. */}
        <div className="flex aspect-[3/4] flex-col items-center justify-center rounded-2xl border border-dashed border-slate/20 p-6 text-center text-sm text-slate/50">
          More listings pending real inventory
        </div>
      </div>
    </section>
  );
}
