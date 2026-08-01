"use client";

import { useMemo, useState } from "react";
import { Calculator } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatRub, formatUsd } from "@/lib/format";
import { convertUsdToRub } from "@/lib/currency";
import { company } from "@/data/company";

export function MetersCalculator({
  priceUsd,
  rateUsdToRub,
}: {
  priceUsd: number;
  rateUsdToRub: number;
}) {
  const [meters, setMeters] = useState<number>(company.minOrderMeters);

  const totalUsd = useMemo(() => meters * priceUsd, [meters, priceUsd]);
  const totalRub = useMemo(
    () => convertUsdToRub(totalUsd, rateUsdToRub),
    [totalUsd, rateUsdToRub]
  );

  const belowMinimum = meters < company.minOrderMeters;

  return (
    <div>
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <Calculator className="size-4 text-accent" />
        Калькулятор стоимости
      </div>

      <div className="mt-4 flex flex-wrap items-end gap-6">
        <div className="grid gap-1.5">
          <Label htmlFor="meters">Количество метров</Label>
          <Input
            id="meters"
            type="number"
            min={1}
            value={meters}
            onChange={(event) => setMeters(Math.max(0, Number(event.target.value)))}
            className="h-11 max-w-40"
          />
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Ориентировочная стоимость
          </p>
          <p className="font-heading text-2xl">{formatUsd(totalUsd)}</p>
          <p className="text-sm text-muted-foreground">≈ {formatRub(totalRub)}</p>
        </div>
      </div>

      {belowMinimum && (
        <p className="mt-4 text-xs text-muted-foreground">
          Минимальный заказ - от {company.minOrderMeters} метров. Итоговая
          стоимость уточняется у менеджера.
        </p>
      )}
      <p className="mt-2 text-xs text-muted-foreground">
        Расчёт ориентировочный и не является публичной офертой.
      </p>
    </div>
  );
}
