"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { company } from "@/data/company";

type Status = "idle" | "submitting" | "success" | "error";

export function ConsultationForm({
  subject,
  onSuccess,
  className,
}: {
  subject?: string;
  onSuccess?: () => void;
  className?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "");
    const phone = String(formData.get("phone") ?? "");
    const comment = String(formData.get("comment") ?? "");

    setStatus("submitting");
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, comment }),
      });
      if (!response.ok) throw new Error("request_failed");

      setStatus("success");
      form.reset();
      setTimeout(() => onSuccess?.(), 1800);
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-3 py-8 text-center">
        <CheckCircle2 className="size-10 text-accent" />
        <p className="font-heading text-lg">Заявка отправлена</p>
        <p className="text-sm text-muted-foreground">
          Мы свяжемся с вами в ближайшее рабочее время.
        </p>
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
            placeholder="Например: интересует ткань и условия поставки"
          />
        </div>

        {status === "error" && (
          <p className="text-sm text-destructive">
            Не удалось отправить заявку. Попробуйте ещё раз или напишите нам в{" "}
            <a href={company.telegram} className="underline">
              Telegram
            </a>
            .
          </p>
        )}

        <Button type="submit" disabled={status === "submitting"} className="mt-1">
          {status === "submitting" && (
            <Loader2 className="size-4 animate-spin" />
          )}
          Отправить заявку
        </Button>
        <p className="text-xs text-muted-foreground">
          Нажимая кнопку, вы соглашаетесь на обработку персональных данных.
        </p>
      </div>
    </form>
  );
}
