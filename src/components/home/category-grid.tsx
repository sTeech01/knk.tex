import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { fabrics } from "@/data/fabrics";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { homeCopy } from "@/data/copy";
import type { FabricCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

const categoryDescriptions: Record<FabricCategory, string> = {
  Бархат: "Плотный ворс и тяжёлая драпировка для парадных интерьеров.",
  Сатин: "Гладкая фактура с лёгким блеском для мягких, текучих штор.",
  Канвас: "Прочное фактурное полотно для повседневной эксплуатации.",
  Блэкаут:
    "Полное затемнение и димаут - от приглушённого света до полной темноты.",
  "Подкладочная ткань": "Лёгкая изнаночная ткань для портьер и штор.",
};

// Ширина плитки на десктопе - задаёт неравномерный, «бенто»-ритм сетки
// вместо однотипных карточек одинакового размера. Пять категорий ложатся
// в три ряда: 7+5, 4+8 и последняя плитка во всю ширину.
const spanByIndex = [
  "lg:col-span-7",
  "lg:col-span-5",
  "lg:col-span-4",
  "lg:col-span-8",
  "lg:col-span-12",
];

export function CategoryGrid() {
  const categories = Array.from(
    new Map(
      fabrics.map((fabric) => [
        fabric.category,
        {
          category: fabric.category,
          count: fabrics.filter((f) => f.category === fabric.category).length,
          image: fabric.image,
        },
      ])
    ).values()
  );

  return (
    <section className="mx-auto max-w-7xl px-6 py-28">
      <Reveal>
        <SectionHeading
          eyebrow="Каталог"
          title={homeCopy.categoriesHeading}
          description={homeCopy.categoriesSubheading}
        />
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-12">
        {categories.map(({ category, count, image }, index) => (
          <Reveal
            key={category}
            delay={index * 0.05}
            className={cn(spanByIndex[index] ?? "lg:col-span-6")}
          >
            <Link
              href={`/catalog?category=${encodeURIComponent(category)}`}
              className="group relative flex h-72 flex-col justify-end overflow-hidden rounded-lg sm:h-80"
            >
              <Image
                src={image}
                alt={`Категория тканей: ${category}`}
                fill
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/25 to-transparent" />
              <div className="relative flex items-end justify-between p-6 text-white">
                <div>
                  <p className="text-xs uppercase tracking-wider text-gold">
                    {count} {count === 1 ? "вид" : "вида"} в каталоге
                  </p>
                  <h3 className="mt-1 font-heading text-2xl">{category}</h3>
                  <p className="mt-1 max-w-[30ch] text-sm text-mist/70">
                    {categoryDescriptions[category]}
                  </p>
                </div>
                <ArrowUpRight className="size-5 shrink-0 text-gold transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
