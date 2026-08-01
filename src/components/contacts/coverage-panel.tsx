import Link from "next/link";
import { ArrowRight, Globe2 } from "lucide-react";
import { company } from "@/data/company";

export function CoveragePanel() {
  return (
    <div className="flex h-full flex-col justify-between gap-8 rounded-lg bg-graphite p-8 text-white">
      <div>
        <span className="flex size-11 items-center justify-center rounded-full bg-gold/15 text-gold">
          <Globe2 className="size-5" />
        </span>
        <h3 className="mt-5 font-heading text-2xl">{company.city}</h3>
        <p className="mt-3 max-w-sm text-sm text-ivory/70">
          У компании нет розничного шоурума - консультации и оформление заявок
          проходят дистанционно, а грузы отправляются транспортными компаниями
          в любой регион России.
        </p>
      </div>
      <Link
        href="/delivery"
        className="group inline-flex items-center gap-2 text-sm font-medium text-gold"
      >
        Расписание доставки
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}
