"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { company } from "@/data/company";

type Status = "idle" | "submitting" | "success" | "error" | "rate-limited";

/** Текст заявки для мессенджера — менеджер видит всё без переспрашивания. */
function whatsappLink(name: string, phone: string, comment: string): string {
  const text = [
    "Здравствуйте! Заявка с сайта KNK TEX.",
    `Имя: ${name}`,
    `Телефон: ${phone}`,
    comment,
  ]
    .filter(Boolean)
    .join("\n");
  return `${company.whatsapp}?text=${encodeURIComponent(text)}`;
}

export function ConsultationForm({
  subject,
  className,
}: {
  subject?: string;
  className?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [sent, setSent] = useState({ name: "", phone: "", comment: "" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();
    const comment = String(formData.get("comment") ?? "").trim();

    setStatus("submitting");
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, comment }),
      });
      // Сервер ограничивает частоту заявок. Повторная отправка тут не
      // поможет, поэтому и сообщение другое - со ссылкой на мессенджер.
      if (response.status === 429) {
        setStatus("rate-limited");
        return;
      }
      if (!response.ok) throw new Error("request_failed");

      setSent({ name, phone, comment });
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <CheckCircle2 className="size-10 text-accent" />
        <p className="font-heading text-lg">Заявка отправлена</p>
        <p className="max-w-xs text-sm text-muted-foreground">
          Менеджер свяжется с вами в рабочее время. Удобнее в мессенджере —
          продублируйте заявку, ответим там.
        </p>
        {/* Экран не закрывается сам: раньше окно пропадало через 1,8 с,
            и кнопку мессенджера никто не успел бы увидеть. */}
        <a
          href={whatsappLink(sent.name, sent.phone, sent.comment)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex h-11 items-center gap-2 rounded-lg border border-border px-5 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
        >
          <MessageCircle className="size-4" />
          Продублировать в WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="grid gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="name">Имя</Label>
          <Input id="name" name="name" required autoComplete="name" />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="phone">Телефон</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="+7 900 000-00-00"
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor="comment">Комментарий</Label>
          <Textarea
            id="comment"
            name="comment"
            rows={3}
            defaultValue={subject ? `Интересует: ${subject}` : undefined}
            placeholder="Например: ткань, номера оттенков, примерный метраж"
          />
        </div>

        {status === "rate-limited" && (
          <p className="text-sm text-destructive">
            С этого адреса уже отправлено несколько заявок. Напишите нам в{" "}
            <a href={company.telegram} className="underline">
              Telegram
            </a>{" "}
            или позвоните — {company.phone}.
          </p>
        )}

        {status === "error" && (
          <p className="text-sm text-destructive">
            Не удалось отправить заявку. Попробуйте ещё раз или напишите нам в{" "}
            <a href={company.telegram} className="underline">
              Telegram
            </a>
            .
          </p>
        )}

        <Button
          type="submit"
          disabled={status === "submitting"}
          className="mt-1 h-11 text-base"
        >
          {status === "submitting" && (
            <Loader2 className="size-4 animate-spin" />
          )}
          Отправить заявку
        </Button>
        <p className="text-xs text-muted-foreground">
          Нажимая кнопку, вы соглашаетесь на{" "}
          <Link
            href="/privacy"
            className="underline underline-offset-2 hover:text-foreground"
          >
            обработку персональных данных
          </Link>
          .
        </p>
      </div>
    </form>
  );
}
