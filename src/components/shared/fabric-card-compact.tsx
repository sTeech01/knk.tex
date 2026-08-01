import Link from "next/link";
import Image from "next/image";
import type { Fabric } from "@/lib/types";
import { formatUsd } from "@/lib/format";

export function FabricCardCompact({
  fabric,
}: {
  fabric: Fabric;
}) {
  return (
    <Link href={`/catalog/${fabric.slug}`} className="group flex flex-col">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
        <Image
          src={fabric.image}
          alt={`${fabric.name} - портьерная ткань, ${fabric.category.toLowerCase()}`}
          fill
          sizes="(min-width: 1024px) 16vw, 45vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
      </div>
      <div className="pt-3">
        <p className="text-sm font-medium leading-snug transition-colors group-hover:text-accent">
          {fabric.name}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {formatUsd(fabric.priceUsd)} / м
        </p>
      </div>
    </Link>
  );
}
