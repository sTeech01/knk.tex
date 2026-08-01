import type { Metadata } from "next";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { deliverySchedule } from "@/data/delivery-schedule";
import { DeliveryGroupCard } from "@/components/delivery/delivery-group-card";
import { breadcrumbJsonLd } from "@/lib/schema";
import { company } from "@/data/company";
import type { DeliveryDirection } from "@/lib/types";

export const metadata: Metadata = {
  title: "Доставка",
  description:
    "Расписание отправок портьерных тканей KNK TEX транспортными компаниями по направлениям «Юг» и «Север».",
  alternates: { canonical: "/delivery" },
};

const tabs: { value: "all" | DeliveryDirection; label: string }[] = [
  { value: "all", label: "Все направления" },
  { value: "Юг", label: "Юг" },
  { value: "Север", label: "Север" },
];

export default function DeliveryPage() {
  const jsonLd = breadcrumbJsonLd([
    { name: "Главная", path: "/" },
    { name: "Доставка", path: "/delivery" },
  ]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Логистика
        </span>
        <h1 className="mt-3 font-heading text-4xl">Доставка</h1>
        <p className="mt-3 text-muted-foreground">
          Отправляем ткани транспортными компаниями по всей России.
          Актуальное расписание отправок по дням недели - ниже. Минимальный
          заказ - от {company.minOrderMeters} метров.
        </p>
      </div>

      <Tabs defaultValue="all" className="mt-10">
        <TabsList className="flex-wrap">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => {
          const groups =
            tab.value === "all"
              ? deliverySchedule
              : deliverySchedule.filter((group) => group.direction === tab.value);

          return (
            <TabsContent key={tab.value} value={tab.value} className="mt-8">
              <div className="grid gap-6 lg:grid-cols-2">
                {groups.map((group) => (
                  <DeliveryGroupCard key={group.id} group={group} />
                ))}
              </div>
            </TabsContent>
          );
        })}
      </Tabs>

      <p className="mt-10 text-sm text-muted-foreground">
        Список транспортных компаний и дни отправки уточняются у менеджера при
        оформлении заявки - расписание может обновляться.
      </p>
    </div>
  );
}
