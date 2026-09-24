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
 * Порядок категорий задаётся вручную, а не берётся из товарной матрицы:
 * наверху крупно сатин, внизу крупно бархат — решение заказчика.
 * Категории, которых здесь нет, добавляются в конец, чтобы новая
 * категория не пропала с главной молча.
 */
const categoryOrder: FabricCategory[] = [
  "Сатин",
  "Блэкаут",
  "Канвас",
  "Подкладочная ткань",
  "Бархат",
];

/**
 * Ширина плиток считается по факту, а не прописывается для каждой
 * категории: ткани без съёмки с сайта скрыты, и число категорий меняется.
 * Раньше раскладка была жёстко рассчитана на пять плиток, и когда
 * подкладочная ушла, в среднем ряду осталось две плитки из трёх —
 * треть ряда пустовала.
 *
 * Схема: первая плитка во всю ширину, последняя тоже, середина делится
 * поровну. Для четырёх категорий выходит 12 / 6+6 / 12, для пяти —
 * 12 / 4+4+4 / 12.
 */
function tileSpans(total: number): { span: string; height: string }[] {
  const hero = { span: "sm:col-span-2 lg:col-span-12", height: "h-80 lg:h-[26rem]" };
  if (total === 1) return [hero];
  if (total === 2) {
    return [hero, { span: "sm:col-span-2 lg:col-span-12", height: "h-72 lg:h-96" }];
  }

  const middleCount = total - 2;
  // Классы записаны целиком: Tailwind ищет их в тексте файла и класс,
  // собранный из кусков на лету, в сборку просто не попадёт.
  const middleSpan =
    middleCount % 3 === 0 ? "lg:col-span-4" : "lg:col-span-6";
  const middle = Array.from({ length: middleCount }, () => ({
    span: middleSpan,
    height: "h-72 lg:h-80",
  }));

  // На планшете две колонки. Если средних плиток нечётное число,
  // последняя встаёт в пару с одной из них, иначе идёт во всю ширину.
  const last = {
    span: middleCount % 2 === 0 ? "sm:col-span-2 lg:col-span-12" : "lg:col-span-12",
    height: "h-72 lg:h-96",
  };
  return [hero, ...middle, last];
}

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
  // в данных, но ещё не попало в список — чтобы новая категория
  // не пропала с главной молча.
  const categories = [
    ...categoryOrder.filter((category) => byCategory.has(category)),
    ...[...byCategory.keys()].filter(
      (category) => !categoryOrder.includes(category)
    ),
  ];
  const spans = tileSpans(categories.length);
  const ordered = categories.map((category, index) => ({
    category,
    ...byCategory.get(category)!,
    ...spans[index],
  }));

  // Подпись считается по факту, а не пишется руками: раньше здесь стояло
  // «Пять категорий... восемь видов», и после скрытия тканей без съёмки
  // цифры разошлись бы с тем, что видно на экране.
  const subheading =
    `${ordered.length} ${plural(ordered.length, ["категория", "категории", "категорий"])}: ` +
    `${ordered.map((tile) => tile.category.toLowerCase()).join(", ")} — ` +
    `${fabrics.length} ${plural(fabrics.length, ["вид", "вида", "видов"])} основы для штор.`;

  return (
    <section className="mx-auto max-w-7xl px-6 py-28">
      <Reveal>
        <SectionHeading
          eyebrow="Каталог"
          title={homeCopy.categoriesHeading}
          description={subheading}
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
