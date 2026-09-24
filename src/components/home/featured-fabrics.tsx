import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { fabrics } from "@/data/fabrics";
import { FabricCard } from "@/components/shared/fabric-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { homeCopy } from "@/data/copy";

export function FeaturedFabrics({ rateUsdToRub }: { rateUsdToRub: number }) {
  const featured = fabrics.slice(0, 4);
  if (featured.length === 0) return null;

  return (
    <section className="bg-mist py-28">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHeading
              eyebrow="Ассортимент"
              title={homeCopy.featuredHeading}
              description={homeCopy.featuredSubheading}
            />
            <Link
              href="/catalog"
              className="group inline-flex items-center gap-2 text-sm font-medium text-foreground"
            >
              Весь каталог
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((fabric, index) => (
            <Reveal key={fabric.slug} delay={index * 0.05}>
              <FabricCard fabric={fabric} rateUsdToRub={rateUsdToRub} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
