"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useCatalogQuery } from "@/hooks/use-catalog-query";
import {
  fabricCategories,
  fabricOrigins,
  colorFamilyOptions,
  widthOptions,
  priceRange,
} from "@/data/fabrics";
import { formatUsd } from "@/lib/format";

function CheckboxGroup({
  paramKey,
  options,
  formatLabel,
}: {
  paramKey: string;
  options: readonly (string | number)[];
  formatLabel?: (option: string | number) => string;
}) {
  const { searchParams, toggleListParam } = useCatalogQuery();
  const selected = (searchParams.get(paramKey) ?? "").split(",").filter(Boolean);

  return (
    <div className="flex flex-col gap-3">
      {options.map((option) => {
        const value = String(option);
        const id = `${paramKey}-${value}`;
        return (
          <div key={value} className="flex items-center gap-2.5">
            <Checkbox
              id={id}
              checked={selected.includes(value)}
              onCheckedChange={() => toggleListParam(paramKey, value)}
            />
            <Label htmlFor={id} className="cursor-pointer font-normal">
              {formatLabel ? formatLabel(option) : value}
            </Label>
          </div>
        );
      })}
    </div>
  );
}

function PriceFilter() {
  const { searchParams, setParam } = useCatalogQuery();
  const currentMin = Number(searchParams.get("priceMin") ?? priceRange.min);
  const currentMax = Number(searchParams.get("priceMax") ?? priceRange.max);
  const [localValue, setLocalValue] = useState<[number, number]>([
    currentMin,
    currentMax,
  ]);

  return (
    <div className="flex flex-col gap-4 px-1">
      <Slider
        min={priceRange.min}
        max={priceRange.max}
        step={0.5}
        value={localValue}
        onValueChange={(value) => setLocalValue(value as [number, number])}
        onValueCommit={(value) => {
          setParam("priceMin", String(value[0]));
          setParam("priceMax", String(value[1]));
        }}
      />
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{formatUsd(localValue[0])}</span>
        <span>{formatUsd(localValue[1])}</span>
      </div>
    </div>
  );
}

export function FiltersPanel() {
  const { searchParams, clearAll } = useCatalogQuery();
  const hasFilters = Array.from(searchParams.keys()).length > 0;

  return (
    <div className="flex flex-col gap-1">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-heading text-lg">Фильтры</h2>
        {hasFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
          >
            Сбросить всё
          </Button>
        )}
      </div>

      <Accordion
        type="multiple"
        defaultValue={["category", "origin", "width", "color", "price"]}
      >
        <AccordionItem value="category">
          <AccordionTrigger>Категория</AccordionTrigger>
          <AccordionContent>
            <CheckboxGroup paramKey="category" options={fabricCategories} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="origin">
          <AccordionTrigger>Производство</AccordionTrigger>
          <AccordionContent>
            <CheckboxGroup paramKey="origin" options={fabricOrigins} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="width">
          <AccordionTrigger>Ширина полотна</AccordionTrigger>
          <AccordionContent>
            <CheckboxGroup
              paramKey="width"
              options={widthOptions}
              formatLabel={(option) => `${option} см`}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="color">
          <AccordionTrigger>Цветовая гамма</AccordionTrigger>
          <AccordionContent>
            <CheckboxGroup paramKey="color" options={colorFamilyOptions} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger>Цена, $/м</AccordionTrigger>
          <AccordionContent>
            <PriceFilter />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
