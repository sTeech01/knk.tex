import { Hash, Layers, Maximize2, Package, Palette, Truck } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { homeCopy } from "@/data/copy";
import { company } from "@/data/company";
import { fabrics, totalShades } from "@/data/fabrics";
import { carriersCount } from "@/data/delivery-schedule";
import { formatRub } from "@/lib/format";
import { plural } from "@/lib/plural";

const maxShadesInFabric = Math.max(...fabrics.map((fabric) => fabric.colorsCount));
const maxWidthCm = Math.max(...fabrics.map((fabric) => fabric.widthCm));

/**
 * Преимущества собраны только из проверяемых фактов: все числа берутся из
 * данных каталога и расписания, а не пишутся вручную. Никаких «лет на
 * рынке» и «тысяч клиентов» — их нечем подтвердить.
 */
const advantages = [
  {
    icon: Palette,
    title: "Широкая палитра",
    text: `${totalShades} ${plural(totalShades, ["оттенок", "оттенка", "оттенков"])} в каталоге и до ${maxShadesInFabric} в одной ткани — цвет подбирается под проект, а не проект под цвет.`,
  },
  {
    icon: Hash,
    title: "Оттенок по номеру",
    text: "Каждый цвет снят отдельно и подписан номером поставщика. Называете номер менеджеру — и речь точно об одном и том же оттенке.",
  },
  {
    icon: Layers,
    title: "Раскладка вживую",
    text: `Все цвета ткани можно заказать раскладкой за ${formatRub(company.swatchBookPriceRub)} и выбрать не по экрану. Её стоимость вычитается из следующего заказа.`,
  },
  {
    icon: Package,
    title: "От одного рулона",
    text: "Не нужно брать большую партию, чтобы запустить новую ткань в работу: минимальный заказ — один рулон.",
  },
  {
    icon: Maximize2,
    title: "Широкое полотно",
    text: `Ширина до ${maxWidthCm} см: высокие портьеры шьются цельным полотнищем, без горизонтального шва.`,
  },
  {
    icon: Truck,
    title: "Доставка без хлопот",
    text: `По Москве — бесплатно. По России — ${carriersCount} ${plural(carriersCount, ["транспортная компания", "транспортные компании", "транспортных компаний"])} с отгрузкой с понедельника по субботу.`,
  },
];

export function Advantages() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-28">
      <Reveal>
        <SectionHeading
          eyebrow="Почему мы"
          title={homeCopy.advantagesHeading}
          description={homeCopy.advantagesSubheading}
        />
      </Reveal>

      <div className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {advantages.map((advantage, index) => (
          <Reveal key={advantage.title} delay={index * 0.05}>
            <div className="flex flex-col gap-4">
              <span className="flex size-12 items-center justify-center rounded-full bg-gold-soft text-gold-foreground">
                <advantage.icon className="size-5" />
              </span>
              <div>
                <h3 className="font-heading text-xl">{advantage.title}</h3>
                <p className="mt-2 text-muted-foreground">{advantage.text}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
