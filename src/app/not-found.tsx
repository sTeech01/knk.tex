import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-32 text-center">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
        Ошибка 404
      </span>
      <h1 className="mt-4 font-heading text-4xl">Страница не найдена</h1>
      <p className="mt-4 text-muted-foreground">
        Возможно, ткань была переименована или страница больше не существует.
        Загляните в каталог - там собраны все доступные позиции.
      </p>
      <Link
        href="/catalog"
        className="group mt-8 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-navy px-8 text-sm font-medium text-white transition-colors hover:bg-navy/90"
      >
        Перейти в каталог
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}
