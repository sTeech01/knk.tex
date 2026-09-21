"use client";

import { useState } from "react";
import Image from "next/image";
import type { Fabric } from "@/lib/types";
import { cn } from "@/lib/utils";

export function FabricGallery({ fabric }: { fabric: Fabric }) {
  const colors = fabric.colors ?? [];
  const hasPalette = colors.length > 0;

  // null - презентационное фото. Карточка открывается на нём: это
  // постановочный кадр, а не снимок оттенка, и именно его заказчик хочет
  // видеть первым. В сетку палитры он не попадает - там только
  // пронумерованные оттенки; при выборе цвета кадр меняется на оттенок.
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const activeColor = activeIndex === null ? null : colors[activeIndex];

  // Цвет презентационного фото известен - показываем его номер, чтобы
  // кадр не выглядел безымянным отдельным цветом.
  const badgeCode = activeColor ? activeColor.code : fabric.coverCode;
  const mainImage = activeColor ? activeColor.image : fabric.image;

  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-muted lg:aspect-[3/4]">
        {/* Миниатюра выбранного оттенка уже загружена сеткой палитры - она
            появляется сразу по клику, пока догружается полный кадр. Без
            неё браузер держал старое фото до загрузки нового, и клик
            выглядел так, будто ничего не произошло. */}
        {activeColor && (
          <Image
            src={activeColor.thumb}
            alt=""
            aria-hidden
            fill
            unoptimized
            sizes="45vw"
            className="scale-105 object-cover blur-[2px]"
          />
        )}
        <Image
          // Ключ пересоздаёт картинку при смене кадра: новый стартует
          // прозрачным, и под ним видна миниатюра.
          key={mainImage}
          src={mainImage}
          alt={
            badgeCode
              ? `${fabric.name}, оттенок ${badgeCode} - портьерная ткань, ${fabric.category.toLowerCase()}`
              : `${fabric.name} - портьерная ткань, ${fabric.category.toLowerCase()}`
          }
          fill
          loading="eager"
          fetchPriority="high"
          quality={88}
          sizes="(min-width: 1024px) 45vw, 90vw"
          className="object-cover"
        />

        {badgeCode && (
          <span className="absolute left-3 top-3 rounded-md bg-navy/85 px-2.5 py-1 text-xs font-semibold text-white">
            Оттенок {badgeCode}
          </span>
        )}
      </div>

      {hasPalette && (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Палитра - {colors.length} из {fabric.colorsCount} оттенков
          </p>

          <div className="mt-3 grid max-h-72 grid-cols-5 gap-2 overflow-y-auto pr-1 sm:grid-cols-6 lg:grid-cols-7">
            {colors.map((color, index) => {
              const label = color.name
                ? `${color.code} - ${color.name}`
                : `Оттенок ${color.code}`;
              return (
                <button
                  key={color.code}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-pressed={index === activeIndex}
                  aria-label={label}
                  title={label}
                  className={cn(
                    "group relative aspect-square overflow-hidden rounded-md border-2 transition-colors",
                    index === activeIndex
                      ? "border-accent"
                      : "border-transparent hover:border-border"
                  )}
                >
                  <Image
                    src={color.thumb}
                    alt=""
                    fill
                    sizes="80px"
                    unoptimized
                    className="object-cover"
                  />
                  <span className="absolute inset-x-0 bottom-0 bg-navy/75 py-0.5 text-center text-[10px] font-medium leading-tight text-white">
                    {color.code}
                  </span>
                </button>
              );
            })}
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
