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

/** Сколько ждём ответа Telegram, прежде чем считать доставку неудачной. */
const TELEGRAM_TIMEOUT_MS = 5000;

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

/** Telegram ждёт HTML-разметку, поэтому текст от клиента экранируется. */
function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Отправка заявки менеджеру в Telegram.
 *
 * Токен и чат берутся из переменных окружения: репозиторий открыт, и
 * держать их в коде нельзя. Если переменные не заданы, отправка не
 * происходит - заявка уйдёт в лог целиком, и её будет видно.
 */
async function sendToTelegram(lead: {
  name: string;
  phone: string;
  comment: string;
}): Promise<{ ok: true } | { ok: false; reason: string }> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return { ok: false, reason: "telegram_not_configured" };

  const lines = [
    "<b>Новая заявка с сайта</b>",
    "",
    `<b>Имя:</b> ${escapeHtml(lead.name)}`,
    // Номер отдельной строкой и без разметки - так Telegram делает его
    // кликабельным, и менеджер звонит одним касанием.
    `<b>Телефон:</b> ${escapeHtml(lead.phone)}`,
  ];
  if (lead.comment) {
    lines.push("", `<b>Комментарий:</b>`, escapeHtml(lead.comment));
  }
  lines.push(
    "",
    new Date().toLocaleString("ru-RU", {
      timeZone: "Europe/Moscow",
      dateStyle: "short",
      timeStyle: "short",
    }) + " МСК"
  );

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: lines.join("\n"),
          parse_mode: "HTML",
        }),
        // Telegram отвечает быстро; ждать дольше нельзя - на том конце
        // человек смотрит на форму и не понимает, отправилась ли заявка.
        signal: AbortSignal.timeout(TELEGRAM_TIMEOUT_MS),
      }
    );

    if (!response.ok) {
      // Описание ошибки от Telegram помогает понять причину: неверный
      // chat_id после превращения группы в супергруппу, бот удалён из
      // чата, отозванный токен.
      const details = await response.text().catch(() => "");
      return {
        ok: false,
        reason: `telegram_http_${response.status} ${details.slice(0, 300)}`,
      };
    }
    return { ok: true };
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    return { ok: false, reason: `telegram_request_failed: ${reason}` };
  }
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

  const delivery = await sendToTelegram({ name, phone, comment });

  if (delivery.ok) {
    // В обычном логе - только факт заявки, без имени и номера: логи Vercel
    // хранятся на серверах за пределами РФ, и складывать туда персональные
    // данные незачем. Сама заявка уже у менеджера в Telegram.
    console.log("[lead] заявка доставлена:", {
      phoneMask: maskPhone(phone),
      hasComment: comment.length > 0,
      receivedAt: new Date().toISOString(),
    });
  } else {
    /*
     * Доставка не удалась - и это единственный случай, когда заявка пишется
     * в лог целиком. Иначе она исчезнет бесследно: клиент считает, что
     * оставил контакты, а менеджер о нём не узнает. Потерять заказ хуже,
     * чем оставить запись в логе, откуда её можно достать руками.
     */
    console.error("[lead] ЗАЯВКА НЕ ДОСТАВЛЕНА, причина:", delivery.reason, {
      name,
      phone,
      comment: comment || null,
      receivedAt: new Date().toISOString(),
    });
  }

  /*
   * Клиенту отвечаем успехом в любом случае. Заявку мы приняли и
   * записали; сбой на стороне Telegram - наша проблема, а не его, и
   * показывать ему ошибку значит потерять его совсем.
   */
  return NextResponse.json({ ok: true });
}
