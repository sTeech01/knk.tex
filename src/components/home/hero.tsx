import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroSlider } from "@/components/home/hero-slider";
import { ConsultationButton } from "@/components/shared/consultation-button";
import { homeCopy } from "@/data/copy";
import { fabrics, totalShades } from "@/data/fabrics";
import { plural } from "@/lib/plural";

const maxWidthCm = Math.max(...fabrics.map((fabric) => fabric.widthCm));

/**
 * Цифры первого экрана — только проверяемые факты из данных каталога.
 * Раньше здесь стояло «8 тканей в каталоге»: для оптовика это звучит
 * бедно, хотя за восемью тканями стоит больше двухсот оттенков.
 */
const facts = [
  {
    value: String(totalShades),
    label: `${plural(totalShades, ["оттенок", "оттенка", "оттенков"])} в палитре`,
  },
  { value: "от 1 рулона", label: "минимальный заказ" },
  { value: `до ${maxWidthCm} см`, label: "ширина полотна" },
  { value: "бесплатно", label: "доставка по Москве" },
];

export function Hero() {
  return (
    <HeroSlider>
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center px-6 pb-24 pt-20 text-center lg:pb-28 lg:pt-28">
        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-gold sm:gap-4 sm:tracking-[0.3em]">
          <span className="hidden h-px w-8 bg-gold/40 sm:block" />
          {homeCopy.heroEyebrow}
          <span className="hidden h-px w-8 bg-gold/40 sm:block" />
        </div>

        {/* Крупный заголовок — на ступень легче остальных: в 600 при 60px
            гротеск выглядел грузно, в 500 — собранно и спокойно. */}
        <h1 className="mt-5 max-w-3xl font-heading text-4xl font-medium leading-[1.1] text-white sm:text-5xl lg:text-6xl">
          {homeCopy.heroHeadline}
        </h1>

        <p className="mt-5 max-w-xl text-balance text-base text-white/80 sm:text-lg">
          {homeCopy.heroSubheadline}
        </p>

        {/* Главное действие — заявка; каталог — второе. Раньше единственной
            кнопкой был каталог, и та в контурном, второстепенном стиле. */}
        <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
          <ConsultationButton className="h-12 w-full bg-gold px-8 text-base font-semibold text-gold-foreground hover:bg-gold/90 sm:w-auto">
            {homeCopy.heroPrimaryCta}
          </ConsultationButton>
          <Link
            href="/catalog"
            className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-white/35 px-7 text-base font-medium text-white transition-colors hover:border-gold hover:text-gold sm:w-auto"
          >
            {homeCopy.heroSecondaryCta}
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <dl className="mt-12 grid w-full max-w-3xl grid-cols-2 gap-x-6 gap-y-6 border-t border-white/15 pt-8 sm:grid-cols-4">
          {facts.map((fact) => (
            <div key={fact.label} className="flex flex-col items-center gap-1">
              <dt className="order-2 text-xs leading-snug text-white/65">
                {fact.label}
              </dt>
              <dd className="order-1 font-heading text-2xl text-white sm:text-3xl">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </HeroSlider>
  );
}
