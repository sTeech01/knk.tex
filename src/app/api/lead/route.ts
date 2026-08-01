import { NextResponse } from "next/server";

type LeadPayload = {
  name?: string;
  phone?: string;
  comment?: string;
};

export async function POST(request: Request) {
  let payload: LeadPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const name = payload.name?.trim();
  const phone = payload.phone?.trim();

  if (!name || !phone) {
    return NextResponse.json(
      { ok: false, error: "name_and_phone_required" },
      { status: 400 }
    );
  }

  // TODO: подключить реальную доставку заявки (email/Telegram-бот/CRM-вебхук).
  // Пока заявка только валидируется и логируется на сервере.
  console.log("[lead] новая заявка:", {
    name,
    phone,
    comment: payload.comment?.trim() || null,
    receivedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true });
}
