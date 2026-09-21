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
  colorFamilyOptions,
  widthOptions,
  priceRange,
} from "@/data/fabrics";
import { formatRub } from "@/lib/format";

/** Шаг ползунка и округление границ - по 50 ₽, чтобы не было «1 237 ₽». */
const PRICE_STEP_RUB = 50;

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

function PriceFilter({ rateUsdToRub }: { rateUsdToRub: number }) {
  const { searchParams, setParam } = useCatalogQuery();
  // Диапазон строится в рублях по сегодняшнему курсу ЦБ.
  const minRub =
    Math.floor((priceRange.min * rateUsdToRub) / PRICE_STEP_RUB) * PRICE_STEP_RUB;
  const maxRub =
    Math.ceil((priceRange.max * rateUsdToRub) / PRICE_STEP_RUB) * PRICE_STEP_RUB;
  const currentMin = Number(searchParams.get("priceMin") ?? minRub);
  const currentMax = Number(searchParams.get("priceMax") ?? maxRub);
  const [localValue, setLocalValue] = useState<[number, number]>([
    currentMin,
    currentMax,
  ]);

  return (
    <div className="flex flex-col gap-4 px-1">
      <Slider
        min={minRub}
        max={maxRub}
        step={PRICE_STEP_RUB}
        value={localValue}
        onValueChange={(value) => setLocalValue(value as [number, number])}
        onValueCommit={(value) => {
          setParam("priceMin", String(value[0]));
          setParam("priceMax", String(value[1]));
        }}
      />
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{formatRub(localValue[0])}</span>
        <span>{formatRub(localValue[1])}</span>
      </div>
    </div>
  );
}

export function FiltersPanel({ rateUsdToRub }: { rateUsdToRub: number }) {
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
        defaultValue={["category", "width", "color", "price"]}
      >
        <AccordionItem value="category">
          <AccordionTrigger>Категория</AccordionTrigger>
          <AccordionContent>
            <CheckboxGroup paramKey="category" options={fabricCategories} />
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
          <AccordionTrigger>Цена, ₽/м</AccordionTrigger>
          <AccordionContent>
            <PriceFilter rateUsdToRub={rateUsdToRub} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
