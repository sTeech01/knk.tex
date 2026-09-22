import { Truck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DayPills } from "@/components/delivery/day-pills";
import type { DeliveryGroup, WeekDay } from "@/lib/types";

const shortDay: Record<WeekDay, string> = {
  Понедельник: "понедельникам",
  Вторник: "вторникам",
  Среда: "средам",
  Четверг: "четвергам",
  Пятница: "пятницам",
  Суббота: "субботам",
};

/** «по понедельникам, средам и пятницам» — вместо сухого перечня дат. */
function daysSentence(days: WeekDay[]): string {
  const words = days.map((day) => shortDay[day]);
  if (words.length === 1) return `по ${words[0]}`;
  return `по ${words.slice(0, -1).join(", ")} и ${words[words.length - 1]}`;
}

export function DeliveryGroupCard({ group }: { group: DeliveryGroup }) {
  return (
    <div className="flex flex-col gap-5 rounded-lg border border-border p-6">
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gold-soft text-gold-foreground">
          <Truck className="size-5" />
        </span>
        <div>
          <h3 className="font-heading text-lg">Отгрузка {daysSentence(group.days)}</h3>
          <p className="text-sm text-muted-foreground">
            {group.carriers.length}{" "}
            {group.carriers.length === 1
              ? "транспортная компания"
              : group.carriers.length < 5
                ? "транспортные компании"
                : "транспортных компаний"}
          </p>
        </div>
      </div>

      <DayPills activeDays={group.days} />

      <div className="flex flex-wrap gap-2">
        {group.carriers.map((carrier) => (
          <Badge key={carrier} variant="outline" className="font-normal">
            {carrier}
          </Badge>
        ))}
      </div>
    </div>
  );
}
