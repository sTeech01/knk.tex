import type { Fabric, FabricCategory, ColorFamily } from "@/lib/types";
import { convertUsdToRub } from "@/lib/currency";

export type CatalogSort = "default" | "price-asc" | "price-desc" | "density-desc";

export type CatalogFilters = {
  query: string;
  categories: FabricCategory[];
  colorFamilies: ColorFamily[];
  widths: number[];
  /** Границы цены — в рублях: покупатель видит только рублёвые цены. */
  priceMin?: number;
  priceMax?: number;
  sort: CatalogSort;
};

export function filterFabrics(
  fabrics: Fabric[],
  filters: CatalogFilters,
  rateUsdToRub: number
): Fabric[] {
  const query = filters.query.trim().toLowerCase();

  const filtered = fabrics.filter((fabric) => {
    if (query && !fabric.name.toLowerCase().includes(query)) return false;
    if (filters.categories.length && !filters.categories.includes(fabric.category))
      return false;
    if (
      filters.colorFamilies.length &&
      !fabric.colorFamilies.some((family) => filters.colorFamilies.includes(family))
    )
      return false;
    if (filters.widths.length && !filters.widths.includes(fabric.widthCm))
      return false;
    const priceRub = convertUsdToRub(fabric.priceUsd, rateUsdToRub);
    if (filters.priceMin !== undefined && priceRub < filters.priceMin)
      return false;
    if (filters.priceMax !== undefined && priceRub > filters.priceMax)
      return false;
    return true;
  });

  switch (filters.sort) {
    case "price-asc":
      return [...filtered].sort((a, b) => a.priceUsd - b.priceUsd);
    case "price-desc":
      return [...filtered].sort((a, b) => b.priceUsd - a.priceUsd);
    case "density-desc":
      return [...filtered].sort((a, b) => b.densityGsm - a.densityGsm);
    default:
      return filtered;
  }
}
