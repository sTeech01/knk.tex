import { Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DayPills } from "@/components/delivery/day-pills";
import type { DeliveryGroup } from "@/lib/types";

export function DeliveryGroupCard({ group }: { group: DeliveryGroup }) {
  return (
    <div className="flex flex-col gap-5 rounded-lg border border-border p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gold-soft text-gold-foreground">
            <Truck className="size-5" />
          </span>
          <div>
            <h3 className="font-heading text-lg">{group.title}</h3>
            <p className="text-sm text-muted-foreground">{group.description}</p>
          </div>
        </div>
      </div>

      <DayPills activeDays={group.days} />

      <div>
        <p className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">
          Транспортные компании ({group.carriers.length})
        </p>
        <div className="flex flex-wrap gap-2">
          {group.carriers.map((carrier) => (
            <Badge key={carrier} variant="outline" className="font-normal">
              {carrier}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
