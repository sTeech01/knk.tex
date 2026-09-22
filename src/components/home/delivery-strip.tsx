import Link from "next/link";
import { ArrowRight, Truck } from "lucide-react";
import { Reveal } from "@/components/shared/reveal";
import { carriersCount } from "@/data/delivery-schedule";
import { cityPages } from "@/data/cities";
import { plural } from "@/lib/plural";

/**
 * Блок доставки на главной (его требует ТЗ). Заменил прежний баннер
 * «Минимальный заказ»: про минимальный заказ теперь говорят первый экран,
 * преимущества и шаги заказа, а вопрос «как привезут» оставался без ответа.
 */
export function DeliveryStrip() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20">
      <Reveal>
        <div className="flex flex-col gap-8 rounded-lg bg-navy px-6 py-10 text-white sm:px-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-5">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold sm:size-14">
              <Truck className="size-6" />
            </span>
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl">
                Доставка по Москве — бесплатно
              </h2>
              <p className="mt-2 max-w-xl text-white/75">
                По России отгружаем {carriersCount}{" "}
                {plural(carriersCount, [
                  "транспортной компанией",
                  "транспортными компаниями",
                  "транспортными компаниями",
                ])}{" "}
                - Деловые Линии, ПЭК, СДЭК и другими — с понедельника по субботу.
              </p>
              <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-white/60">
                <span>Поставки:</span>
                {cityPages.map((city) => (
                  <Link
                    key={city.slug}
                    href={`/portyernye-tkani-optom/${city.slug}`}
                    className="underline underline-offset-4 transition-colors hover:text-gold"
                  >
                    {city.name}
                  </Link>
                ))}
              </p>
            </div>
          </div>

          <Link
            href="/delivery"
            className="group inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-lg border border-white/30 px-7 font-medium transition-colors hover:border-gold hover:text-gold"
          >
            Расписание отгрузок
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
