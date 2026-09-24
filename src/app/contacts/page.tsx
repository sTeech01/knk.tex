import type { Metadata } from "next";
import { ContactChannels } from "@/components/contacts/contact-channels";
import { RequisitesRow } from "@/components/contacts/requisites-card";
import { CoveragePanel } from "@/components/contacts/coverage-panel";
import { ConsultationForm } from "@/components/shared/consultation-form";
import { breadcrumbJsonLd } from "@/lib/schema";
import { JsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: "Контакты",
  description:
    "Контакты KNK TEX: телефон, Telegram, WhatsApp, email и режим работы. Оставьте заявку — менеджер свяжется с вами по вопросам оптовых поставок портьерных тканей.",
  alternates: { canonical: "/contacts" },
};

export default function ContactsPage() {
  const jsonLd = breadcrumbJsonLd([
    { name: "Главная", path: "/" },
    { name: "Контакты", path: "/contacts" },
  ]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <JsonLd data={jsonLd} />

      <div className="max-w-2xl">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
          Связь с нами
        </span>
        <h1 className="mt-3 font-heading text-4xl">Контакты</h1>
        <p className="mt-3 text-muted-foreground">
          Свяжитесь с нами удобным способом или оставьте заявку — менеджер
          перезвонит и подберёт условия поставки.
        </p>
      </div>

      <div className="mt-12 grid items-start gap-6 lg:grid-cols-2 lg:gap-10">
        <div className="flex flex-col gap-4">
          <ContactChannels />
          <RequisitesRow />
        </div>

        <div className="flex flex-col gap-6">
          <CoveragePanel />
          <div className="rounded-lg border border-border p-6">
            <h3 className="font-heading text-lg">Оставить заявку</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Ответим в течение рабочего дня.
            </p>
            <div className="mt-5">
              <ConsultationForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
