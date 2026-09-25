"use client";

import { useMemo, useState } from "react";
import { Calculator } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatRub } from "@/lib/format";
import { convertUsdToRub } from "@/lib/currency";
import { company } from "@/data/company";

export function MetersCalculator({
  priceUsd,
  rateUsdToRub,
}: {
  priceUsd: number;
  rateUsdToRub: number;
}) {
  // Стартовое значение — один рулон: это и есть минимальный заказ.
  const [meters, setMeters] = useState<number>(company.metersPerRoll);

  const totalUsd = useMemo(() => meters * priceUsd, [meters, priceUsd]);
  const totalRub = useMemo(
    () => convertUsdToRub(totalUsd, rateUsdToRub),
    [totalUsd, rateUsdToRub]
  );

  /*
   * Ткань идёт рулонами от 30 погонных метров, отрезать меньше нельзя -
   * считать 20 метров было не просто неточно, а невозможно к исполнению.
   * Пока поле в фокусе, значение не трогаем: иначе набранная первой цифра
   * «3» мгновенно превращалась бы в 30 и дописать её не выходило.
   */
  function clampToMinimum() {
    setMeters((current) => Math.max(current, company.metersPerRoll));
  }

  return (
    <div>
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <Calculator className="size-4 text-accent" />
        Калькулятор стоимости
      </div>

      <div className="mt-4 flex flex-wrap items-end gap-6">
        <div className="grid gap-1.5">
          <Label htmlFor="meters">Количество погонных метров</Label>
          <Input
            id="meters"
            type="number"
            min={company.metersPerRoll}
            value={meters}
            onChange={(event) => setMeters(Math.max(0, Number(event.target.value)))}
            onBlur={clampToMinimum}
            className="h-11 max-w-40"
          />
        </div>

        <div>
          {/* Не «ориентировочная»: сумма за ткань точная, просто без
              доставки — про неё сказано ниже. */}
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Стоимость ткани
          </p>
          <p className="font-heading text-2xl">{formatRub(totalRub)}</p>
        </div>
      </div>

      {/* Подсказка постоянная, а не всплывает при вводе меньшего числа:
          она объясняет границу заранее, до того как поле поправит значение
          само. Про «от 1 рулона» здесь намеренно не пишем - эта формула
          живёт отдельно и без метража. */}
      <p className="mt-4 text-xs text-muted-foreground">
        Ткань отгружается рулонами, поэтому расчёт начинается от{" "}
        {company.metersPerRoll} погонных метров.
      </p>
      {/* Прежний текст — «расчёт ориентировочный и не является публичной
          офертой» — был неточен: цена настоящая, она пересчитывается из
          долларов по курсу ЦБ и на сегодня именно такая. Оговорка про
          менеджера остаётся: корзины на сайте нет, а на итог влияют
          метраж и доставка. */}
      <p className="mt-2 text-xs text-muted-foreground">
        Расчёт — по курсу ЦБ РФ на сегодня, завтра сумма может отличаться.
        Окончательную стоимость с доставкой подтверждает менеджер.
      </p>
    </div>
  );
}
