import Link from "next/link";
import Image from "next/image";
import type { Fabric } from "@/lib/types";
import { PriceTag } from "@/components/shared/price-tag";

export function FabricCard({
  fabric,
  rateUsdToRub,
  priority = false,
}: {
  fabric: Fabric;
  rateUsdToRub: number;
  priority?: boolean;
}) {
  return (
    <Link href={`/catalog/${fabric.slug}`} className="group flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-muted">
        <Image
          src={fabric.image}
          alt={`${fabric.name} - портьерная ткань, ${fabric.category.toLowerCase()}`}
          fill
          loading={priority ? "eager" : undefined}
          fetchPriority={priority ? "high" : undefined}
          quality={88}
          sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 90vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 pt-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-heading text-lg leading-snug transition-colors group-hover:text-accent">
            {fabric.name}
          </h3>
          <PriceTag
            priceUsd={fabric.priceUsd}
            rateUsdToRub={rateUsdToRub}
            size="sm"
            className="shrink-0 items-end text-right"
          />
        </div>

        <p className="line-clamp-2 text-sm text-muted-foreground">
          {fabric.shortDescription}
        </p>

        <p className="mt-1 truncate text-xs uppercase tracking-wide text-navy-soft/70">
          {fabric.category} · {fabric.widthCm} см · {fabric.densityGsm} г/м²
        </p>
      </div>
    </Link>
  );
}
