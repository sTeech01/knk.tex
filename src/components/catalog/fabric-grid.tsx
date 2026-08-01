import { PackageSearch } from "lucide-react";
import type { Fabric } from "@/lib/types";
import { FabricCard } from "@/components/shared/fabric-card";

export function FabricGrid({
  fabrics,
  rateUsdToRub,
}: {
  fabrics: Fabric[];
  rateUsdToRub: number;
}) {
  if (fabrics.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border py-20 text-center">
        <PackageSearch className="size-8 text-muted-foreground" />
        <p className="font-heading text-lg">Ничего не найдено</p>
        <p className="max-w-xs text-sm text-muted-foreground">
          Попробуйте изменить условия поиска или сбросить фильтры.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {fabrics.map((fabric, index) => (
        <FabricCard
          key={fabric.slug}
          fabric={fabric}
          rateUsdToRub={rateUsdToRub}
          priority={index < 3}
        />
      ))}
    </div>
  );
}
