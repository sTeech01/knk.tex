"use client";

import { Search, X } from "lucide-react";
import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { useCatalogQuery } from "@/hooks/use-catalog-query";

export function SearchBar() {
  const { searchParams, setParam } = useCatalogQuery();
  const urlQuery = searchParams.get("q") ?? "";
  const [value, setValue] = useState(urlQuery);
  const [syncedQuery, setSyncedQuery] = useState(urlQuery);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Отражаем внешние изменения URL (например, сброс фильтров), не перезаписывая
  // то, что пользователь только что ввёл сам - паттерн "adjusting state during render".
  if (urlQuery !== syncedQuery) {
    setSyncedQuery(urlQuery);
    setValue(urlQuery);
  }

  function handleChange(next: string) {
    setValue(next);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setParam("q", next || null);
    }, 300);
  }

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={value}
        onChange={(event) => handleChange(event.target.value)}
        placeholder="Поиск по названию ткани…"
        className="h-11 pl-9 pr-9"
        aria-label="Поиск по названию ткани"
      />
      {value && (
        <button
          type="button"
          onClick={() => handleChange("")}
          aria-label="Очистить поиск"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
