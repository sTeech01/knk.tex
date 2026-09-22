import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { categoryPages, getCategoryPageBySlug } from "@/data/categories";
import { fabrics } from "@/data/fabrics";
import { company } from "@/data/company";
import { getUsdToRubRate } from "@/lib/currency";
import { breadcrumbJsonLd } from "@/lib/schema";
import { FabricCard } from "@/components/shared/fabric-card";
import { ConsultationButton } from "@/components/shared/consultation-button";

export function generateStaticParams() {
  return categoryPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getCategoryPageBySlug(slug);
  if (!page) return {};

  return {
    // Заголовок задаётся целиком: шаблон «%s - KNK TEX» из layout здесь
    // не нужен, название компании уже стоит в конце title.
    title: { absolute: page.title },
    description: page.description,
    alternates: { canonical: `/catalog/kategoriya/${page.slug}` },
    openGraph: {
      title: page.title,
      description: page.description,
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getCategoryPageBySlug(slug);
  if (!page) notFound();

  const items = fabrics.filter((fabric) => fabric.category === page.category);
  const rateUsdToRub = await getUsdToRubRate();

  const jsonLd = breadcrumbJsonLd([
    { name: "Главная", path: "/" },
    { name: "Каталог", path: "/catalog" },
    { name: page.category, path: `/catalog/kategoriya/${page.slug}` },
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
            <BreadcrumbPage>{page.category}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-8 max-w-3xl">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          {page.category}
        </span>
        <h1 className="mt-3 font-heading text-4xl">{page.h1}</h1>
        <p className="mt-4 text-muted-foreground">{page.intro}</p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((fabric, index) => (
          <FabricCard
            key={fabric.slug}
            fabric={fabric}
            rateUsdToRub={rateUsdToRub}
            priority={index === 0}
          />
        ))}
      </div>

      <div className="mt-16 grid gap-10 border-t border-border pt-12 lg:grid-cols-2">
        {page.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="font-heading text-2xl">{section.heading}</h2>
            <p className="mt-3 text-muted-foreground">{section.body}</p>
          </section>
        ))}
      </div>

      <div className="mt-14 flex flex-col items-start gap-5 rounded-lg border border-gold/30 bg-gold-soft/40 px-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div>
          <h2 className="font-heading text-xl">Нужен подбор под проект?</h2>
          <p className="mt-1 max-w-xl text-sm text-muted-foreground">
            Менеджер подберёт оттенок по номеру и рассчитает поставку.
            Минимальный заказ — {company.minOrderLabel}. {company.freeDeliveryNote}.
          </p>
        </div>
        <ConsultationButton
          subject={page.category}
          className="h-11 shrink-0 bg-navy px-8 text-sm font-medium text-white hover:bg-navy/90"
        >
          Получить консультацию
        </ConsultationButton>
      </div>
    </div>
  );
}
