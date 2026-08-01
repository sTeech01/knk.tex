import { formatRub, formatUsd } from "@/lib/format";
import { convertUsdToRub } from "@/lib/currency";
import { cn } from "@/lib/utils";

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
        {formatUsd(priceUsd)}
        <span className="text-muted-foreground font-sans text-[0.55em] font-normal">
          {" "}/ м
        </span>
      </span>
      <span className="text-sm text-muted-foreground">
        ≈ {formatRub(rub)} / м
      </span>
    </div>
  );
}
