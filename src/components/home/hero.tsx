import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { HeroBackground } from "@/components/home/hero-background";
import { homeCopy } from "@/data/copy";
import { company } from "@/data/company";
import { fabrics } from "@/data/fabrics";

export function Hero() {
  return (
    <section className="relative flex items-center justify-center overflow-hidden bg-navy">
      <HeroBackground />

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center px-6 py-20 text-center lg:py-28">
        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.18em] text-gold sm:gap-4 sm:tracking-[0.3em]">
          <span className="hidden h-px w-8 bg-gold/40 sm:block" />
          {homeCopy.heroEyebrow}
          <span className="hidden h-px w-8 bg-gold/40 sm:block" />
        </div>

        <h1 className="mt-5 font-heading text-4xl leading-[1.12] text-white sm:text-5xl lg:text-6xl">
          {homeCopy.heroHeadline}
        </h1>

        <p className="mt-5 max-w-lg text-balance text-base text-mist/70 sm:text-lg">
          {homeCopy.heroSubheadline}
        </p>

        <Link
          href="/catalog"
          className="group mt-8 inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-mist/25 px-7 text-sm font-medium text-white transition-colors hover:border-gold hover:text-gold"
        >
          {homeCopy.heroSecondaryCta}
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </Link>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs uppercase tracking-wider text-mist/45">
          <span>{fabrics.length} тканей в каталоге</span>
          <span className="size-1 rounded-full bg-mist/25" aria-hidden />
          <span>Китай и Турция - напрямую</span>
          <span className="size-1 rounded-full bg-mist/25" aria-hidden />
          <span>Заказ {company.minOrderLabel}</span>
        </div>
      </div>
    </section>
  );
}
