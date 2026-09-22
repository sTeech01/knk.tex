import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { fabrics } from "@/data/fabrics";
import { categoryHref, getCategoryPageByCategory } from "@/data/categories";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { homeCopy } from "@/data/copy";
import type { FabricCategory } from "@/lib/types";
import { cn } from "@/lib/utils";
import { plural } from "@/lib/plural";

const categoryDescriptions: Record<FabricCategory, string> = {
  Бархат: "Плотный ворс и тяжёлая драпировка для парадных интерьеров.",
  Сатин: "Гладкая фактура с лёгким блеском для мягких, текучих штор.",
  Канвас: "Прочное фактурное полотно для повседневной эксплуатации.",
  Блэкаут:
    "Полное затемнение и димаут — от приглушённого света до полной темноты.",
  "Подкладочная ткань": "Лёгкая изнаночная ткань для портьер и штор.",
};

/**
 * Порядок и размер плиток задаются вручную, а не по порядку в товарной
 * матрице. Канвас — самый ходовой, он крупно наверху. Внизу крупно
 * бархат: заказчик считает его самым презентабельным. Подкладочная
 * ткань ушла в обычный квадрат — широкой полосой она смотрелась бедно.
 *
 * Раскладка на десктопе: 12 / 4+4+4 / 12.
 */
const tileLayout: {
  category: FabricCategory;
  span: string;
  height: string;
}[] = [
  {
    category: "Канвас",
    // На планшете канвас тоже во всю ширину — остальные четыре ложатся
    // ровными парами, без одинокой плитки в конце.
    span: "sm:col-span-2 lg:col-span-12",
    height: "h-80 lg:h-[26rem]",
  },
  { category: "Блэкаут", span: "lg:col-span-4", height: "h-72 lg:h-80" },
  { category: "Сатин", span: "lg:col-span-4", height: "h-72 lg:h-80" },
  {
    category: "Подкладочная ткань",
    span: "lg:col-span-4",
    height: "h-72 lg:h-80",
  },
  {
    category: "Бархат",
    // На планшете бархат в паре с подкладочной, а не во всю ширину:
    // иначе подкладочная осталась бы одна с пустой половиной ряда.
    span: "lg:col-span-12",
    height: "h-72 lg:h-96",
  },
];

const defaultTile = { span: "lg:col-span-6", height: "h-72 lg:h-80" };

function kindsLabel(count: number): string {
  return `${count} ${plural(count, ["вид", "вида", "видов"])}`;
}

export function CategoryGrid() {
  const byCategory = new Map<FabricCategory, { count: number; image: string }>();
  for (const fabric of fabrics) {
    const existing = byCategory.get(fabric.category);
    byCategory.set(fabric.category, {
      count: (existing?.count ?? 0) + 1,
      image: existing?.image ?? fabric.image,
    });
  }

  // Сначала категории в заданном порядке, затем всё, что появилось
  // в данных, но ещё не попало в раскладку — чтобы новая категория
  // не пропала с главной молча.
  const ordered = [
    ...tileLayout
      .filter((tile) => byCategory.has(tile.category))
      .map((tile) => ({ ...tile, ...byCategory.get(tile.category)! })),
    ...[...byCategory.entries()]
      .filter(([category]) => !tileLayout.some((t) => t.category === category))
      .map(([category, data]) => ({ category, ...defaultTile, ...data })),
  ];

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
        {ordered.map(({ category, count, image, span, height }, index) => (
          <Reveal
            key={category}
            delay={index * 0.05}
            className={span}
          >
            <Link
              href={categoryHref(category)}
              className={cn(
                "group relative flex flex-col justify-end overflow-hidden rounded-lg",
                height
              )}
            >
              <Image
                src={image}
                alt={
                  getCategoryPageByCategory(category)?.imageAlt ??
                  `Категория тканей: ${category}`
                }
                fill
                quality={88}
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {/* Затемнение нейтральное и прижато к низу плитки: синий
                  оверлей перекрашивал ткань, а плитка должна показывать
                  её настоящий цвет. Ступени подобраны так, чтобы подпись
                  читалась и на низкой полосе подкладочной ткани. */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 from-12% via-black/32 via-50% to-transparent" />
              <div className="relative flex items-end justify-between p-6 text-white">
                <div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <h3 className="font-heading text-3xl lg:text-4xl">{category}</h3>
                    <span className="rounded-full bg-white/90 px-3 py-1 text-sm font-semibold text-navy">
                      {kindsLabel(count)}
                    </span>
                  </div>
                  <p className="mt-2 max-w-[34ch] text-sm text-white/80">
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
