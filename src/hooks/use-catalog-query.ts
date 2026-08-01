"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export function useCatalogQuery() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setParam = useCallback(
    (key: string, value: string | string[] | null) => {
      const params = new URLSearchParams(searchParams.toString());

      if (value === null || value.length === 0) {
        params.delete(key);
      } else if (Array.isArray(value)) {
        params.set(key, value.join(","));
      } else {
        params.set(key, value);
      }

      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const toggleListParam = useCallback(
    (key: string, item: string) => {
      const current = (searchParams.get(key) ?? "")
        .split(",")
        .filter(Boolean);
      const next = current.includes(item)
        ? current.filter((v) => v !== item)
        : [...current, item];
      setParam(key, next);
    },
    [searchParams, setParam]
  );

  const clearAll = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [pathname, router]);

  return { searchParams, setParam, toggleListParam, clearAll };
}
