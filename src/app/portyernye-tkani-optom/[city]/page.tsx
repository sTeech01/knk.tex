import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { BadgeCheck, Truck } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { cityPages, getCityPageBySlug, nationalCarriers } from "@/data/cities";
import { carriersCount, deliverySchedule } from "@/data/delivery-schedule";
import { categoryHref } from "@/data/categories";
import { fabrics } from "@/data/fabrics";
import { company } from "@/data/company";
import { getUsdToRubRate } from "@/lib/currency";
import { breadcrumbJsonLd } from "@/lib/schema";
import { FabricCard } from "@/components/shared/fabric-card";
import { ConsultationButton } from "@/components/shared/consultation-button";
import { DayPills } from "@/components/delivery/day-pills";

export function generateStaticParams() {
  return cityPages.map((page) => ({ city: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  const page = getCityPageBySlug(city);
  if (!page) return {};

  return {
    title: { absolute: page.title },
    description: page.description,
    alternates: { canonical: `/portyernye-tkani-optom/${page.slug}` },
    openGraph: { title: page.title, description: page.description },
  };
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  const page = getCityPageBySlug(city);
  if (!page) notFound();

  const rateUsdToRub = await getUsdToRubRate();

  // Ткани выстраиваются в порядке спроса именно в этом городе — это и
  // делает страницы разными по существу, а не подменой названия города.
  const ordered = page.focusCategories.flatMap((category) =>
    fabrics.filter((fabric) => fabric.category === category)
  );
  const rest = fabrics.filter(
    (fabric) => !page.focusCategories.includes(fabric.category)
  );
  const items = [...ordered, ...rest];

  // Дни отгрузки берутся из общего расписания, а не дублируются.
  const carriers = nationalCarriers
    .map((name) => {
      const group = deliverySchedule.find((g) => g.carriers.includes(name));
      return group ? { name, days: group.days } : null;
    })
    .filter((carrier) => carrier !== null);

  const jsonLd = breadcrumbJsonLd([
    { name: "Главная", path: "/" },
    { name: "Каталог", path: "/catalog" },
    { name: page.name, path: `/portyernye-tkani-optom/${page.slug}` },
  ]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Главная</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/catalog">Каталог</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{page.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-8 max-w-3xl">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Поставки: {page.name}
        </span>
        <h1 className="mt-3 font-heading text-4xl">{page.h1}</h1>
        <p className="mt-4 text-muted-foreground">{page.intro}</p>
      </div>

      {page.freeDelivery && (
        <div className="mt-8 flex items-center gap-4 rounded-lg border border-gold/30 bg-gold-soft/40 px-5 py-4">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gold text-gold-foreground">
            <BadgeCheck className="size-5" />
          </span>
          <p className="font-heading text-lg">{company.freeDeliveryNote}</p>
        </div>
      )}

      <section className="mt-12">
        <h2 className="font-heading text-2xl">{page.focus.heading}</h2>
        <p className="mt-3 max-w-3xl text-muted-foreground">{page.focus.body}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {page.focusCategories.map((category) => (
            <Link
              key={category}
              href={categoryHref(category)}
              className="rounded-full border border-border px-4 py-1.5 text-sm transition-colors hover:border-accent hover:text-accent"
            >
              {category}
            </Link>
          ))}
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((fabric, index) => (
            <FabricCard
              key={fabric.slug}
              fabric={fabric}
              rateUsdToRub={rateUsdToRub}
              priority={index === 0}
            />
          ))}
        </div>
      </section>

      <section className="mt-16 border-t border-border pt-12">
        <h2 className="font-heading text-2xl">{page.delivery.heading}</h2>
        <p className="mt-3 max-w-3xl text-muted-foreground">{page.delivery.body}</p>

        {!page.freeDelivery && carriers.length > 0 && (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {carriers.map((carrier) => (
              <div
                key={carrier.name}
                className="flex flex-col gap-3 rounded-lg border border-border p-5"
              >
                <div className="flex items-center gap-2 font-medium">
                  <Truck className="size-4 text-accent" />
                  {carrier.name}
                </div>
                <DayPills activeDays={carrier.days} />
              </div>
            ))}
          </div>
        )}

        <p className="mt-6 text-sm text-muted-foreground">
          Полное расписание всех {carriersCount}{" "}
          транспортных компаний -{" "}
          <Link href="/delivery" className="underline underline-offset-4 hover:text-foreground">
            на странице доставки
          </Link>
          .
        </p>
      </section>

      <div className="mt-14 flex flex-col items-start gap-5 rounded-lg border border-gold/30 bg-gold-soft/40 px-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <h2 className="font-heading text-xl">Заказ с поставкой в {page.nameTo}</h2>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Менеджер подберёт оттенки по номерам и согласует доставку.
            Минимальный заказ — {company.minOrderLabel}.
          </p>
        </div>
        <ConsultationButton
          subject={`Поставка: ${page.name}`}
          className="h-11 shrink-0 bg-navy px-8 text-sm font-semibold text-white hover:bg-navy/90"
        >
          Получить консультацию
        </ConsultationButton>
      </div>
    </div>
  );
}
