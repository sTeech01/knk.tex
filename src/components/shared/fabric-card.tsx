import Link from "next/link";
import Image from "next/image";
import type { Fabric } from "@/lib/types";
import { PriceTag } from "@/components/shared/price-tag";
import { plural } from "@/lib/plural";

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
    // z-10 при наведении: увеличенное окно перекрывает соседние карточки,
    // а не подлезает под них.
    <Link
      href={`/catalog/${fabric.slug}`}
      className="group relative z-0 flex flex-col hover:z-10"
    >
      {/* Растёт само окно, а фотография внутри остаётся в тех же границах:
          раньше увеличивался снимок при неподвижной рамке, и края ткани
          уезжали в обрез. Закупщику нужен весь кадр целиком, крупнее. */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-muted transition-transform duration-500 ease-out group-hover:scale-[1.04]">
        <Image
          src={fabric.image}
          alt={`${fabric.name} — портьерная ткань, ${fabric.category.toLowerCase()}`}
          fill
          loading={priority ? "eager" : undefined}
          fetchPriority={priority ? "high" : undefined}
          quality={88}
          sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 90vw"
          className="object-cover"
        />
        {/* Число оттенков — главное отличие одной ткани от другой для
            закупщика, поэтому оно на фото, а не в мелкой строке внизу. */}
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-navy backdrop-blur-sm">
          {fabric.colorsCount}{" "}
          {plural(fabric.colorsCount, ["оттенок", "оттенка", "оттенков"])}
        </span>
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
