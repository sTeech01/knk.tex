import Link from "next/link";
import Image from "next/image";
import { navLinks } from "@/lib/nav";
import { Phone } from "lucide-react";
import { ConsultationButton } from "@/components/shared/consultation-button";
import { company } from "@/data/company";

export function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-3">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/images/logo.webp"
            alt="KNK TEX"
            width={267}
            height={400}
            className="h-7 w-auto"
            loading="eager"
          />
          <span className="font-heading text-base font-medium tracking-wide">
            KNK TEX
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-navy-soft transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-5 md:flex">
          {/* Оптовик часто просто звонит — номер не должен прятаться в подвале. */}
          <a
            href={company.phoneHref}
            className="hidden items-center gap-2 text-sm font-semibold whitespace-nowrap transition-colors hover:text-accent lg:flex"
          >
            <Phone className="size-4 text-accent" />
            {company.phone}
          </a>
          <ConsultationButton className="h-9 bg-navy px-4 text-sm font-medium text-white hover:bg-navy/90">
            Получить консультацию
          </ConsultationButton>
        </div>
      </div>
    </header>
  );
}
