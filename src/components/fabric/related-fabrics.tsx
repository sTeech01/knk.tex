import { fabrics } from "@/data/fabrics";
import { FabricCardCompact } from "@/components/shared/fabric-card-compact";
import { SectionHeading } from "@/components/shared/section-heading";
import type { Fabric } from "@/lib/types";

export function RelatedFabrics({
  currentSlug,
  category,
}: {
  currentSlug: string;
  category: Fabric["category"];
}) {
  const related = fabrics
    .filter((fabric) => fabric.slug !== currentSlug)
    .sort((a, b) => Number(b.category === category) - Number(a.category === category))
    .slice(0, 5);

  if (related.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl border-t border-border px-6 py-20">
      <SectionHeading eyebrow="Каталог" title="Похожие ткани" />
      <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
        {related.map((fabric) => (
          <FabricCardCompact key={fabric.slug} fabric={fabric} />
        ))}
      </div>
    </section>
  );
}
