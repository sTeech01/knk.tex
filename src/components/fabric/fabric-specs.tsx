import { Ruler } from "lucide-react";
import type { Fabric } from "@/lib/types";

export function FabricSpecs({ fabric }: { fabric: Fabric }) {
  const specs = [
    { label: "Ширина полотна", value: `${fabric.widthCm} см` },
    { label: "Плотность", value: `${fabric.densityGsm} г/м²` },
    { label: "Количество цветов", value: fabric.colorsCount },
    { label: "Производство", value: fabric.origin },
  ];

  return (
    <div>
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <Ruler className="size-4 text-accent" />
        Характеристики
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4">
        {specs.map((spec) => (
          <div key={spec.label}>
            <dt className="text-xs uppercase tracking-wide text-muted-foreground">
              {spec.label}
            </dt>
            <dd className="mt-1 font-heading text-lg">{spec.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
