import type { Metadata } from "next";
import { company } from "@/data/company";
import { fabrics } from "@/data/fabrics";
import { filterFabrics, type CatalogFilters, type CatalogSort } from "@/lib/catalog-filters";
import { getUsdToRubRate } from "@/lib/currency";
import { SearchBar } from "@/components/catalog/search-bar";
import { SortSelect } from "@/components/catalog/sort-select";
import { FiltersPanel } from "@/components/catalog/filters-panel";
import { MobileFilters } from "@/components/catalog/mobile-filters";
import { FabricGrid } from "@/components/catalog/fabric-grid";
import { breadcrumbJsonLd } from "@/lib/schema";
import type { FabricCategory, ColorFamily } from "@/lib/types";

export const metadata: Metadata = {
  title: "Каталог портьерных тканей",
  description:
    "Каталог портьерных тканей KNK TEX: бархат, сатин, канвас, блэкаут, димаут и подкладочные ткани. Поиск, фильтры по категории, ширине, плотности и цене.",
  alternates: { canonical: "/catalog" },
};

function parseList<T extends string>(value: string | undefined): T[] {
  return (value ?? "").split(",").filter(Boolean) as T[];
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const getParam = (key: string) => {
    const value = params[key];
    return Array.isArray(value) ? value[0] : value;
  };

  const filters: CatalogFilters = {
    query: getParam("q") ?? "",
    categories: parseList<FabricCategory>(getParam("category")),
    colorFamilies: parseList<ColorFamily>(getParam("color")),
    widths: parseList(getParam("width")).map(Number),
    priceMin: getParam("priceMin") ? Number(getParam("priceMin")) : undefined,
    priceMax: getParam("priceMax") ? Number(getParam("priceMax")) : undefined,
    sort: (getParam("sort") as CatalogSort) ?? "default",
  };

  const rateUsdToRub = await getUsdToRubRate();
  const filteredFabrics = filterFabrics(fabrics, filters, rateUsdToRub);

  const jsonLd = breadcrumbJsonLd([
    { name: "Главная", path: "/" },
    { name: "Каталог", path: "/catalog" },
  ]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Ассортимент
        </span>
        <h1 className="mt-3 font-heading text-4xl">Каталог тканей</h1>
        <p className="mt-3 text-muted-foreground">
          {fabrics.length} видов портьерных тканей. Минимальный заказ -{" "}
          {company.minOrderLabel} по каждой позиции.
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <SearchBar />
        </div>
        <div className="flex gap-3">
          <MobileFilters rateUsdToRub={rateUsdToRub} />
          <SortSelect />
        </div>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-28">
            <FiltersPanel rateUsdToRub={rateUsdToRub} />
          </div>
        </aside>

        <div>
          <p className="mb-5 text-sm text-muted-foreground">
            Найдено: {filteredFabrics.length}
          </p>
          <FabricGrid fabrics={filteredFabrics} rateUsdToRub={rateUsdToRub} />
        </div>
      </div>
    </div>
  );
}
