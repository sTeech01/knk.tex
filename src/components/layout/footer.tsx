import Link from "next/link";
import Image from "next/image";
import { Mail, MessageCircle, Phone, Send } from "lucide-react";
import { navLinks } from "@/lib/nav";
import { company } from "@/data/company";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/70 bg-navy text-mist">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-4">
        <div className="md:col-span-1">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src="/images/logo.png"
              alt="KNK TEX"
              width={36}
              height={39}
              className="h-8 w-auto"
            />
            <span className="font-heading text-lg font-semibold">
              KNK TEX
            </span>
          </Link>
          <p className="mt-4 max-w-[26ch] text-sm text-mist/60">
            {company.tagline}
          </p>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-mist/50">
            Навигация
          </h3>
          <nav className="mt-4 flex flex-col gap-2.5">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-mist/80 transition-colors hover:text-gold"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-mist/50">
            Контакты
          </h3>
          <div className="mt-4 flex flex-col gap-2.5 text-sm text-mist/80">
            <a
              href={company.phoneHref}
              className="flex items-center gap-2 transition-colors hover:text-gold"
            >
              <Phone className="size-4 text-gold" />
              {company.phone}
            </a>
            <a
              href={`mailto:${company.email}`}
              className="flex items-center gap-2 transition-colors hover:text-gold"
            >
              <Mail className="size-4 text-gold" />
              {company.email}
            </a>
            <a
              href={company.telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition-colors hover:text-gold"
            >
              <Send className="size-4 text-gold" />
              Telegram
            </a>
            <a
              href={company.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 transition-colors hover:text-gold"
            >
              <MessageCircle className="size-4 text-gold" />
              WhatsApp
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-mist/50">
            Условия работы
          </h3>
          <div className="mt-4 flex flex-col gap-2.5 text-sm text-mist/80">
            <p>Минимальный заказ - {company.minOrderLabel}</p>
            <p>{company.freeDeliveryNote}</p>
            <p>
              {company.workingHours.split(", ").map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
            <p>{company.city}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-mist/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-6 text-xs text-mist/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {company.name}. Все права защищены.</p>
          <p>Сайт носит информационный характер и не является публичной офертой.</p>
        </div>
      </div>
    </footer>
  );
}
