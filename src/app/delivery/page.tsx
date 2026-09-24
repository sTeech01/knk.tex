import type { Metadata } from "next";
import { BadgeCheck } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { carriersCount, deliverySchedule } from "@/data/delivery-schedule";
import { DeliveryGroupCard } from "@/components/delivery/delivery-group-card";
import { breadcrumbJsonLd } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";
import { company } from "@/data/company";
import type { WeekDay } from "@/lib/types";

export const metadata: Metadata = {
  title: "Доставка",
  description: `Расписание отгрузок портьерных тканей KNK TEX: ${carriersCount} транспортных компаний по всей России. Доставка по Москве — бесплатно.`,
  alternates: { canonical: "/delivery" },
};

const tabs: { value: "all" | WeekDay; label: string }[] = [
  { value: "all", label: "Все дни" },
  { value: "Понедельник", label: "Пн" },
  { value: "Вторник", label: "Вт" },
  { value: "Среда", label: "Ср" },
  { value: "Четверг", label: "Чт" },
  { value: "Пятница", label: "Пт" },
  { value: "Суббота", label: "Сб" },
];

export default function DeliveryPage() {
  const jsonLd = breadcrumbJsonLd([
    { name: "Главная", path: "/" },
    { name: "Доставка", path: "/delivery" },
  ]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <JsonLd data={jsonLd} />

      <div className="max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Логистика
        </span>
        <h1 className="mt-3 font-heading text-4xl">Доставка</h1>
        <p className="mt-3 text-muted-foreground">
          Отгружаем ткани {carriersCount} транспортными компаниями по всей
          России. Выберите день недели, чтобы увидеть, кто отгружает в этот
          день. Минимальный заказ — {company.minOrderLabel}.
        </p>
      </div>

      {/* Бесплатная доставка по Москве — заказчик просил вынести отдельно. */}
      <div className="mt-8 flex items-center gap-4 rounded-lg border border-gold/30 bg-gold-soft/40 px-5 py-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gold text-gold-foreground">
          <BadgeCheck className="size-5" />
        </span>
        <div>
          <p className="font-heading text-lg">Доставка по Москве — бесплатно</p>
          <p className="text-sm text-muted-foreground">
            По России — отгрузка любой транспортной компанией из списка ниже.
          </p>
        </div>
      </div>

      {/* География отгрузок — обычным текстом, а не списком ссылок:
          заказчик просил, чтобы названия городов работали как ключевые
          слова в описании, а не как отдельные пункты меню. */}
      <p className="mt-6 max-w-3xl text-sm text-muted-foreground">
        Отгружаем портьерные ткани оптом в Москву и Санкт-Петербург, в города
        Центральной России — Иваново, Ярославль, Нижний Новгород, Воронеж,
        Тверь, Кострому — и на юг: Краснодар, Ростов-на-Дону, Волгоград, Сочи.
        Работаем с Казанью, Екатеринбургом, Самарой, Уфой, Челябинском,
        Новосибирском, Пермью, Омском и другими городами России.
      </p>

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
              : deliverySchedule.filter((group) =>
                  group.days.includes(tab.value as WeekDay)
                );

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
        Список транспортных компаний и дни отгрузки уточняются у менеджера при
        оформлении заявки — расписание может обновляться.
      </p>
    </div>
  );
}
