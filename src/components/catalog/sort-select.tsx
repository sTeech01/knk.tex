"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCatalogQuery } from "@/hooks/use-catalog-query";
import type { CatalogSort } from "@/lib/catalog-filters";

const sortOptions: { value: CatalogSort; label: string }[] = [
  { value: "default", label: "По умолчанию" },
  { value: "price-asc", label: "Сначала дешевле" },
  { value: "price-desc", label: "Сначала дороже" },
  { value: "density-desc", label: "По плотности" },
];

export function SortSelect() {
  const { searchParams, setParam } = useCatalogQuery();
  const currentSort = (searchParams.get("sort") as CatalogSort) ?? "default";

  return (
    <Select
      value={currentSort}
      onValueChange={(value) => setParam("sort", value === "default" ? null : value)}
    >
      <SelectTrigger className="w-full sm:w-56">
        <SelectValue placeholder="Сортировка" />
      </SelectTrigger>
      <SelectContent>
        {sortOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
