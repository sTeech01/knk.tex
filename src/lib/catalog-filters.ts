import type { Fabric, FabricCategory, FabricOrigin, ColorFamily } from "@/lib/types";

export type CatalogSort = "default" | "price-asc" | "price-desc" | "density-desc";

export type CatalogFilters = {
  query: string;
  categories: FabricCategory[];
  origins: FabricOrigin[];
  colorFamilies: ColorFamily[];
  widths: number[];
  priceMin?: number;
  priceMax?: number;
  sort: CatalogSort;
};

export function filterFabrics(fabrics: Fabric[], filters: CatalogFilters): Fabric[] {
  const query = filters.query.trim().toLowerCase();

  const filtered = fabrics.filter((fabric) => {
    if (query && !fabric.name.toLowerCase().includes(query)) return false;
    if (filters.categories.length && !filters.categories.includes(fabric.category))
      return false;
    if (filters.origins.length && !filters.origins.includes(fabric.origin))
      return false;
    if (
      filters.colorFamilies.length &&
      !fabric.colorFamilies.some((family) => filters.colorFamilies.includes(family))
    )
      return false;
    if (filters.widths.length && !filters.widths.includes(fabric.widthCm))
      return false;
    if (filters.priceMin !== undefined && fabric.priceUsd < filters.priceMin)
      return false;
    if (filters.priceMax !== undefined && fabric.priceUsd > filters.priceMax)
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
