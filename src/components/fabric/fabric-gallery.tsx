import Image from "next/image";
import type { Fabric } from "@/lib/types";

export function FabricGallery({ fabric }: { fabric: Fabric }) {
  return (
    <div>
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

      {/* Обязательная оговорка о цветопередаче - требование заказчика:
          у ткани десятки оттенков, и экран покупателя передаёт их неточно. */}
      <p className="mt-3 flex gap-1.5 text-xs leading-relaxed text-muted-foreground">
        <span aria-hidden className="text-accent">
          *
        </span>
        <span>
          Оттенок на фотографии может отличаться от фактического цвета ткани -
          цветопередача зависит от настроек вашего экрана. Точный оттенок из{" "}
          {fabric.colorsCount} доступных уточняйте у менеджера.
        </span>
      </p>
    </div>
  );
}
