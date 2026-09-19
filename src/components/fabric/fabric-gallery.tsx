"use client";

import { useState } from "react";
import Image from "next/image";
import type { Fabric } from "@/lib/types";
import { cn } from "@/lib/utils";

type View = {
  /** null - общий вид ткани, иначе номер оттенка из палитры поставщика. */
  code: string | null;
  image: string;
  thumb: string;
  label: string;
};

export function FabricGallery({ fabric }: { fabric: Fabric }) {
  const views: View[] = [
    { code: null, image: fabric.image, thumb: fabric.image, label: "Общий вид" },
    ...(fabric.colors ?? []).map((color) => ({
      code: color.code,
      image: color.image,
      thumb: color.thumb,
      label: color.name ? `${color.code} - ${color.name}` : `Оттенок ${color.code}`,
    })),
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const active = views[activeIndex] ?? views[0];
  const hasPalette = views.length > 1;

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-muted lg:aspect-[3/4]">
        <Image
          src={active.image}
          alt={
            active.code
              ? `${fabric.name}, оттенок ${active.code} - ${fabric.category.toLowerCase()}, ${fabric.origin}`
              : `${fabric.name} - портьерная ткань, ${fabric.category.toLowerCase()}, ${fabric.origin}`
          }
          fill
          priority
          sizes="(min-width: 1024px) 45vw, 90vw"
          className="object-cover"
        />

        {active.code && (
          <span className="absolute left-3 top-3 rounded-md bg-navy/85 px-2.5 py-1 text-xs font-semibold text-white">
            Оттенок {active.code}
          </span>
        )}
      </div>

      {hasPalette && (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Палитра - {fabric.colors?.length} из {fabric.colorsCount} оттенков
          </p>

          <div className="mt-3 grid max-h-72 grid-cols-5 gap-2 overflow-y-auto pr-1 sm:grid-cols-6 lg:grid-cols-7">
            {views.map((view, index) => (
              <button
                key={`${view.code ?? "cover"}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-pressed={index === activeIndex}
                aria-label={view.label}
                title={view.label}
                className={cn(
                  "group relative aspect-square overflow-hidden rounded-md border-2 transition-colors",
                  index === activeIndex
                    ? "border-accent"
                    : "border-transparent hover:border-border"
                )}
              >
                <Image
                  src={view.thumb}
                  alt=""
                  fill
                  sizes="80px"
                  unoptimized={view.thumb !== fabric.image}
                  className="object-cover"
                />
                {view.code && (
                  <span className="absolute inset-x-0 bottom-0 bg-navy/75 py-0.5 text-center text-[10px] font-medium leading-tight text-white">
                    {view.code}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Обязательная оговорка о цветопередаче - требование заказчика:
          у ткани десятки оттенков, и экран покупателя передаёт их неточно. */}
      <p className="mt-4 flex gap-1.5 text-xs leading-relaxed text-muted-foreground">
        <span aria-hidden className="text-accent">
          *
        </span>
        <span>
          Оттенок на фотографии может отличаться от фактического цвета ткани -
          цветопередача зависит от настроек вашего экрана.{" "}
          {hasPalette
            ? "Перед заказом уточняйте оттенок по номеру у менеджера."
            : `Точный оттенок из ${fabric.colorsCount} доступных уточняйте у менеджера.`}
        </span>
      </p>
    </div>
  );
}
