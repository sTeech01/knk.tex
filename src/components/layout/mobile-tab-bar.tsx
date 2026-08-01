"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, LayoutGrid, MessageCircle, Phone, Truck } from "lucide-react";
import { useConsultation } from "@/components/shared/consultation-provider";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/", label: "Главная", icon: Home },
  { href: "/catalog", label: "Каталог", icon: LayoutGrid },
] as const;

const tabsAfter = [
  { href: "/delivery", label: "Доставка", icon: Truck },
  { href: "/contacts", label: "Контакты", icon: Phone },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname.startsWith(href);
}

export function MobileTabBar() {
  const pathname = usePathname();
  const { open } = useConsultation();

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Основная навигация"
    >
      <div className="mx-auto flex max-w-md items-center justify-around px-2 py-1.5">
        {tabs.map((tab) => {
          const active = isActive(pathname, tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-lg py-1.5 text-[0.65rem] font-medium transition-colors active:scale-95",
                active ? "text-accent" : "text-muted-foreground"
              )}
            >
              <tab.icon className="size-5" strokeWidth={active ? 2.25 : 1.75} />
              {tab.label}
            </Link>
          );
        })}

        <button
          type="button"
          onClick={() => open()}
          className="flex flex-1 flex-col items-center gap-1 py-0.5 text-[0.65rem] font-medium text-muted-foreground transition-transform active:scale-95"
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-gold text-gold-foreground shadow-sm">
            <MessageCircle className="size-[18px]" strokeWidth={2} />
          </span>
          Заявка
        </button>

        {tabsAfter.map((tab) => {
          const active = isActive(pathname, tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-lg py-1.5 text-[0.65rem] font-medium transition-colors active:scale-95",
                active ? "text-accent" : "text-muted-foreground"
              )}
            >
              <tab.icon className="size-5" strokeWidth={active ? 2.25 : 1.75} />
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
