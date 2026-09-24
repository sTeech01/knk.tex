import { NextResponse } from "next/server";

type LeadPayload = {
  name?: string;
  phone?: string;
  comment?: string;
};

/** Потолок тела запроса. Заявка - три коротких поля, килобайта хватает с запасом. */
const MAX_BODY_BYTES = 4 * 1024;

/** Ограничения на длину полей: всё, что длиннее, - не заявка, а попытка засорить канал. */
const MAX_NAME = 100;
const MAX_PHONE = 30;
const MAX_COMMENT = 1000;

/** Не больше пяти заявок с одного адреса за десять минут. */
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;

/*
 * Счётчик живёт в памяти процесса. На Vercel процессов несколько и они
 * недолговечны, поэтому лимит не абсолютный: при большом числе инстансов
 * настойчивый отправитель пройдёт больше пяти раз. Задача здесь скромнее -
 * поднять цену массовой отправки с нуля до заметной. Жёсткий лимит требует
 * общего хранилища (Vercel KV или Upstash), это отдельная задача на момент
 * подключения Telegram-бота.
 */
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimit(key: string) {
  const now = Date.now();

  // Чистим просроченные записи, чтобы карта не росла бесконечно.
  if (hits.size > 5000) {
    for (const [ip, entry] of hits) {
      if (entry.resetAt <= now) hits.delete(ip);
    }
  }

  const entry = hits.get(key);
  if (!entry || entry.resetAt <= now) {
    hits.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return { allowed: true, retryAfterSec: 0 };
  }

  entry.count += 1;
  if (entry.count > RATE_LIMIT) {
    return {
      allowed: false,
      retryAfterSec: Math.ceil((entry.resetAt - now) / 1000),
    };
  }
  return { allowed: true, retryAfterSec: 0 };
}

function clientKey(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

/**
 * Телефон в логах превращается в маску вида +7999***4455. По ней в логе
 * Vercel видно, что заявки разные, но сам номер - персональные данные -
 * за пределы сервера не уезжает.
 */
function maskPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 8) return "***";
  return `${digits.slice(0, 4)}***${digits.slice(-4)}`;
}

export async function POST(request: Request) {
  const { allowed, retryAfterSec } = rateLimit(clientKey(request));
  if (!allowed) {
    return NextResponse.json(
      { ok: false, error: "too_many_requests" },
      { status: 429, headers: { "Retry-After": String(retryAfterSec) } }
    );
  }

  // Отсекаем крупный запрос по заголовку, не читая тело.
  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return NextResponse.json(
      { ok: false, error: "payload_too_large" },
      { status: 413 }
    );
  }

  // Заголовку верить нельзя, поэтому проверяем и фактический размер.
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json(
      { ok: false, error: "payload_too_large" },
      { status: 413 }
    );
  }

  let payload: LeadPayload;
  try {
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  if (typeof payload !== "object" || payload === null) {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const phone = typeof payload.phone === "string" ? payload.phone.trim() : "";
  const comment =
    typeof payload.comment === "string" ? payload.comment.trim() : "";

  if (!name || !phone) {
    return NextResponse.json(
      { ok: false, error: "name_and_phone_required" },
      { status: 400 }
    );
  }

  if (
    name.length > MAX_NAME ||
    phone.length > MAX_PHONE ||
    comment.length > MAX_COMMENT
  ) {
    return NextResponse.json(
      { ok: false, error: "field_too_long" },
      { status: 400 }
    );
  }

  // В номере должно остаться хотя бы 10 цифр - иначе это не телефон.
  if (phone.replace(/\D/g, "").length < 10) {
    return NextResponse.json(
      { ok: false, error: "invalid_phone" },
      { status: 400 }
    );
  }

  // TODO: подключить реальную доставку заявки (email/Telegram-бот/CRM-вебхук).
  // Пока заявка только валидируется. В лог пишем факт заявки без имени и
  // номера: логи Vercel хранятся на серверах за пределами РФ, и складывать
  // туда персональные данные нельзя.
  console.log("[lead] новая заявка:", {
    phoneMask: maskPhone(phone),
    hasComment: comment.length > 0,
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
