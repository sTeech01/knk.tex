import { SectionHeading } from "@/components/shared/section-heading";
import { Reveal } from "@/components/shared/reveal";
import { ConsultationButton } from "@/components/shared/consultation-button";
import { homeCopy } from "@/data/copy";
import { company } from "@/data/company";
import { formatRub } from "@/lib/format";

/**
 * Сайт не магазин: корзины и оформления нет, заказ подтверждает менеджер.
 * Оптовику, привыкшему к интернет-магазинам, это неочевидно — без явных
 * шагов непонятно, что делать после выбора ткани. Блок снимает этот вопрос.
 */
const steps = [
  {
    title: "Выберите ткань и оттенок",
    text: "В каталоге у каждого цвета свой номер — запишите номера, которые подходят.",
  },
  {
    // Шаг намеренно необязательный: раньше он читался как условие, без
    // которого дальше не пройти, и заказ по фото выглядел невозможным.
    // Заголовок короткий не случайно: длинный вариант переносился на две
    // строки, и текст второго шага уезжал вниз относительно соседних плиток.
    title: "Можно посмотреть вживую",
    text: `Раскладка с образцами всей палитры стоит ${formatRub(company.swatchBookPriceRub)}, её стоимость вычитается из следующего заказа. Можно обойтись без неё и выбрать по фото в каталоге.`,
  },
  {
    title: "Оставьте заявку",
    text: "Менеджер перезвонит, подтвердит цену, метраж и сроки отгрузки.",
  },
  {
    title: "Получите ткань",
    text: "По Москве — бесплатная доставка, по России — удобной вам транспортной компанией.",
  },
];

export function HowToOrder() {
  return (
    <section className="bg-mist py-28">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <SectionHeading
            eyebrow="Порядок работы"
            title={homeCopy.howToOrderHeading}
            description={homeCopy.howToOrderSubheading}
          />
        </Reveal>

        <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => (
            // Reveal рендерит div, а прямым потомком <ol> может быть только
            // <li> - поэтому анимация внутри пункта, а не вокруг него.
            <li key={step.title}>
              <Reveal delay={index * 0.06} className="h-full">
                <div className="flex h-full flex-col rounded-lg border border-border bg-background p-6">
                  <span className="font-heading text-4xl font-light text-accent">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 font-heading text-lg">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{step.text}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal>
          <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
            <ConsultationButton className="h-12 bg-navy px-8 text-base font-medium text-white hover:bg-navy/90">
              Оставить заявку
            </ConsultationButton>
            <p className="text-sm text-muted-foreground">
              Минимальный заказ — {company.minOrderLabel}.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
