import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Check } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { fabrics, getFabricBySlug } from "@/data/fabrics";
import { getUsdToRubRate } from "@/lib/currency";
import { breadcrumbJsonLd, productJsonLd } from "@/lib/schema";
import { FabricGallery } from "@/components/fabric/fabric-gallery";
import { FabricSpecs } from "@/components/fabric/fabric-specs";
import { MetersCalculator } from "@/components/fabric/meters-calculator";
import { RelatedFabrics } from "@/components/fabric/related-fabrics";
import { PriceTag } from "@/components/shared/price-tag";
import { ConsultationButton } from "@/components/shared/consultation-button";
import { Badge } from "@/components/ui/badge";
import { company } from "@/data/company";
import { categoryHref } from "@/data/categories";
import { fabricDescription, fabricKeywords } from "@/lib/seo";

export function generateStaticParams() {
  return fabrics.map((fabric) => ({ slug: fabric.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const fabric = getFabricBySlug(slug);
  if (!fabric) return {};

  const title = `${fabric.name} - ${fabric.category.toLowerCase()} для штор оптом`;
  const description = fabricDescription(fabric);
  return {
    title,
    description,
    keywords: fabricKeywords(fabric),
    alternates: { canonical: `/catalog/${fabric.slug}` },
    openGraph: {
      title,
      description,
      images: [{ url: fabric.image }],
    },
  };
}

export default async function FabricPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const fabric = getFabricBySlug(slug);
  if (!fabric) notFound();

  const rateUsdToRub = await getUsdToRubRate();

  const breadcrumbData = breadcrumbJsonLd([
    { name: "Главная", path: "/" },
    { name: "Каталог", path: "/catalog" },
    { name: fabric.name, path: `/catalog/${fabric.slug}` },
  ]);
  const productData = productJsonLd(fabric, rateUsdToRub);

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productData) }}
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
            <BreadcrumbLink asChild>
              <Link href={categoryHref(fabric.category)}>
                {fabric.category}
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{fabric.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="mt-8 grid gap-10 lg:grid-cols-2 lg:gap-16">
        <FabricGallery fabric={fabric} />

        <div className="flex flex-col gap-6">
          <div>
            <Badge variant="secondary" className="mb-3">
              {fabric.category}
            </Badge>
            <h1 className="font-heading text-3xl sm:text-4xl">{fabric.name}</h1>
            <p className="mt-3 text-muted-foreground">{fabric.description}</p>
          </div>

          <ul className="flex flex-col gap-2">
            {fabric.highlights.map((highlight) => (
              <li key={highlight} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 size-4 shrink-0 text-accent" />
                {highlight}
              </li>
            ))}
          </ul>

          <PriceTag priceUsd={fabric.priceUsd} rateUsdToRub={rateUsdToRub} size="lg" />

          <div>
            <ConsultationButton
              subject={fabric.name}
              className="h-12 w-full bg-navy text-base font-semibold text-white hover:bg-navy/90 sm:w-auto sm:px-10"
            >
              Получить консультацию
            </ConsultationButton>

            <p className="mt-3 text-xs text-muted-foreground">
              Минимальный заказ - {company.minOrderLabel}.
            </p>
          </div>

          <div className="flex flex-col gap-6 rounded-lg border border-border bg-muted/40 p-6">
            <FabricSpecs fabric={fabric} />
            <div className="border-t border-border" />
            <MetersCalculator priceUsd={fabric.priceUsd} rateUsdToRub={rateUsdToRub} />
          </div>
        </div>
      </div>

      <RelatedFabrics
        currentSlug={fabric.slug}
        category={fabric.category}
        rateUsdToRub={rateUsdToRub}
      />
    </div>
  );
}
