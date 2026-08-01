import { cn } from "@/lib/utils";
import type { WeekDay } from "@/lib/types";

const weekDays: { day: WeekDay; short: string }[] = [
  { day: "Понедельник", short: "Пн" },
  { day: "Вторник", short: "Вт" },
  { day: "Среда", short: "Ср" },
  { day: "Четверг", short: "Чт" },
  { day: "Пятница", short: "Пт" },
  { day: "Суббота", short: "Сб" },
];

export function DayPills({ activeDays }: { activeDays: WeekDay[] }) {
  return (
    <div className="flex gap-1.5">
      {weekDays.map(({ day, short }) => {
        const active = activeDays.includes(day);
        return (
          <span
            key={day}
            title={day}
            className={cn(
              "flex size-8 items-center justify-center rounded-full text-xs font-medium",
              active
                ? "bg-gold text-gold-foreground"
                : "bg-muted text-muted-foreground/50"
            )}
          >
            {short}
          </span>
        );
      })}
    </div>
  );
}
