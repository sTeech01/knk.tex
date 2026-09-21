import { formatRub } from "@/lib/format";
import { convertUsdToRub } from "@/lib/currency";
import { cn } from "@/lib/utils";

/**
 * Цена показывается только в рублях. Базовая цена хранится в долларах
 * и пересчитывается по курсу ЦБ на день открытия страницы, но сам
 * долларовый ценник покупателю не показывается - по решению заказчика.
 */
export function PriceTag({
  priceUsd,
  rateUsdToRub,
  size = "md",
  className,
}: {
  priceUsd: number;
  rateUsdToRub: number;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const rub = convertUsdToRub(priceUsd, rateUsdToRub);

  return (
    <div className={cn("flex flex-col", className)}>
      <span
        className={cn(
          "font-heading font-semibold text-foreground",
          size === "sm" && "text-lg",
          size === "md" && "text-2xl",
          size === "lg" && "text-3xl"
        )}
      >
        {formatRub(rub)}
        <span className="text-muted-foreground font-sans text-[0.55em] font-normal">
          {" "}/ м
        </span>
      </span>
    </div>
  );
}
