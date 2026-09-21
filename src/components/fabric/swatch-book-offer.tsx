import { Layers } from "lucide-react";
import { formatRub } from "@/lib/format";
import { company } from "@/data/company";
import { ConsultationButton } from "@/components/shared/consultation-button";

/**
 * Раскладка - набор образцов всей палитры ткани. Клиент покупает её,
 * чтобы выбрать цвет вживую, а не по экрану; при следующем заказе
 * стоимость раскладки вычитается из суммы. Механика заказчика.
 */
export function SwatchBookOffer({
  fabricName,
  colorsCount,
}: {
  fabricName: string;
  colorsCount: number;
}) {
  return (
    <div className="rounded-lg border border-border p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gold-soft text-gold-foreground">
            <Layers className="size-4" />
          </span>
          <div>
            <p className="font-medium">Раскладка оттенков</p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Все {colorsCount} цветов вживую - чтобы выбрать не по экрану.
            </p>
          </div>
        </div>
        <p className="shrink-0 font-heading text-xl font-semibold">
          {formatRub(company.swatchBookPriceRub)}
          <span className="text-accent">*</span>
        </p>
      </div>

      <p className="mt-3 flex gap-1.5 text-xs leading-relaxed text-muted-foreground">
        <span aria-hidden className="text-accent">
          *
        </span>
        {company.swatchBookNote}
      </p>

      <ConsultationButton
        subject={`Раскладка: ${fabricName}`}
        className="mt-4 h-10 w-full border border-navy bg-transparent text-sm font-medium text-navy hover:bg-navy hover:text-white sm:w-auto sm:px-6"
      >
        Заказать раскладку
      </ConsultationButton>
    </div>
  );
}
