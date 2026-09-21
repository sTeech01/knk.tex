"use client";

import { useState } from "react";
import Image from "next/image";
import type { Fabric } from "@/lib/types";
import { cn } from "@/lib/utils";

type View = {
  /** Номер оттенка; null - раскладка или ткань без отснятой палитры. */
  code: string | null;
  image: string;
  thumb: string;
  label: string;
};

export function FabricGallery({ fabric }: { fabric: Fabric }) {
  const colors = fabric.colors ?? [];
  const hasPalette = colors.length > 0;

  // В палитре только пронумерованные оттенки. Безымянный «общий вид»
  // убран: покупатели принимали его за отдельный цвет без номера.
  // Раскладка (набор образцов) встаёт первой, когда появится её фото.
  const views: View[] = hasPalette
    ? [
        ...(fabric.swatchImage
          ? [
              {
                code: null,
                image: fabric.swatchImage,
                thumb: fabric.swatchImage,
                label: "Раскладка",
              },
            ]
          : []),
        ...colors.map((color) => ({
          code: color.code,
          image: color.image,
          thumb: color.thumb,
          label: color.name
            ? `${color.code} - ${color.name}`
            : `Оттенок ${color.code}`,
        })),
      ]
    : [{ code: null, image: fabric.image, thumb: fabric.image, label: fabric.name }];

  // Открываемся на оттенке с презентационного фото: первый кадр остаётся
  // самым выигрышным, но уже с настоящим номером.
  const coverIndex = fabric.coverCode
    ? views.findIndex((view) => view.code === fabric.coverCode)
    : -1;
  const [activeIndex, setActiveIndex] = useState(Math.max(0, coverIndex));
  const active = views[activeIndex] ?? views[0];

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-muted lg:aspect-[3/4]">
        {/* Миниатюра нового оттенка уже загружена сеткой палитры - она
            появляется сразу по клику, пока догружается полный кадр. Без
            неё браузер держал старое фото до загрузки нового, и клик
            выглядел так, будто ничего не произошло. */}
        {hasPalette && (
          <Image
            src={active.thumb}
            alt=""
            aria-hidden
            fill
            unoptimized
            sizes="45vw"
            className="scale-105 object-cover blur-[2px]"
          />
        )}
        <Image
          // Ключ пересоздаёт картинку при смене оттенка: новый кадр
          // стартует прозрачным, и под ним видна миниатюра.
          key={active.image}
          src={active.image}
          alt={
            active.code
              ? `${fabric.name}, оттенок ${active.code} - портьерная ткань, ${fabric.category.toLowerCase()}`
              : `${fabric.name} - портьерная ткань, ${fabric.category.toLowerCase()}`
          }
          fill
          loading="eager"
          fetchPriority="high"
          quality={88}
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
            Палитра - {colors.length} из {fabric.colorsCount} оттенков
          </p>

          <div className="mt-3 grid max-h-72 grid-cols-5 gap-2 overflow-y-auto pr-1 sm:grid-cols-6 lg:grid-cols-7">
            {views.map((view, index) => (
              <button
                key={`${view.code ?? view.label}-${index}`}
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
                  unoptimized
                  className="object-cover"
                />
                <span className="absolute inset-x-0 bottom-0 bg-navy/75 py-0.5 text-center text-[10px] font-medium leading-tight text-white">
                  {view.code ?? view.label}
                </span>
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
