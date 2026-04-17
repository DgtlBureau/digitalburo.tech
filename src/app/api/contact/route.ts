import { NextResponse } from "next/server";
import { ContactPayloadSchema } from "@/lib/contactSchema";
import { escapeHtml, sendEmail, sendTelegram } from "@/lib/notify";

export async function POST(req: Request) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = ContactPayloadSchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  // Honeypot tripped — pretend success, don't notify
  if (parsed.data.company_website && parsed.data.company_website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const { name, contact, message, source } = parsed.data;
  const subject = `Заявка с сайта — ${source}`;
  const text = [
    `Заявка (источник: ${source})`,
    ``,
    `Имя: ${name}`,
    `Контакт: ${contact}`,
    ``,
    `Сообщение:`,
    message,
  ].join("\n");

  const html = `
    <h2>${escapeHtml(subject)}</h2>
    <p><strong>Имя:</strong> ${escapeHtml(name)}</p>
    <p><strong>Контакт:</strong> ${escapeHtml(contact)}</p>
    <p><strong>Сообщение:</strong></p>
    <p style="white-space: pre-wrap">${escapeHtml(message)}</p>
  `;

  const telegramText = [
    `<b>🔔 Заявка с digitalburo.tech</b>`,
    `Источник: <code>${escapeHtml(source)}</code>`,
    ``,
    `<b>Имя:</b> ${escapeHtml(name)}`,
    `<b>Контакт:</b> ${escapeHtml(contact)}`,
    ``,
    `${escapeHtml(message)}`,
  ].join("\n");

  const results = await Promise.allSettled([
    sendEmail({ subject, html, text }),
    sendTelegram(telegramText),
  ]);

  const failed = results.filter((r) => r.status === "rejected");
  if (failed.length === results.length) {
    console.error("[api/contact] All delivery channels failed", failed);
    return NextResponse.json({ error: "Delivery failed" }, { status: 502 });
  }

  if (failed.length > 0) {
    console.warn("[api/contact] Partial delivery failure", failed);
  }

  return NextResponse.json({ ok: true });
}
