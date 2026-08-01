import Image from "next/image";
import type { Fabric } from "@/lib/types";

export function FabricGallery({ fabric }: { fabric: Fabric }) {
  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-muted lg:aspect-[3/4]">
      <Image
        src={fabric.image}
        alt={`${fabric.name} - портьерная ткань, ${fabric.category.toLowerCase()}, ${fabric.origin}`}
        fill
        priority
        sizes="(min-width: 1024px) 45vw, 90vw"
        className="object-cover"
      />
    </div>
  );
}
