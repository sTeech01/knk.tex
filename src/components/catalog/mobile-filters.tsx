"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { FiltersPanel } from "@/components/catalog/filters-panel";

export function MobileFilters() {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <Button
        type="button"
        variant="outline"
        className="h-11 gap-2"
        onClick={() => setOpen(true)}
      >
        <SlidersHorizontal className="size-4" />
        Фильтры
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="bottom"
          className="max-h-[85svh] overflow-y-auto rounded-t-2xl border-none pt-2"
        >
          <div className="mx-auto h-1.5 w-10 shrink-0 rounded-full bg-border" />
          <SheetTitle className="sr-only">Фильтры каталога</SheetTitle>
          <div className="px-4 pb-8 pt-2">
            <FiltersPanel />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
