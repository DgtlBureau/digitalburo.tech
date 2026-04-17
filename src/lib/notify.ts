import { Resend } from "resend";

const RESEND_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.RESEND_FROM ?? "notifications@digitalburo.tech";
const RESEND_TO = process.env.RESEND_TO ?? "access@digitalburo.tech";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export type LeadNotification = {
  subject: string;
  html: string;
  text: string;
};

export async function sendEmail(notification: LeadNotification): Promise<void> {
  if (!RESEND_KEY) {
    console.warn("[notify] RESEND_API_KEY missing — skipping email");
    return;
  }
  const resend = new Resend(RESEND_KEY);
  const result = await resend.emails.send({
    from: RESEND_FROM,
    to: RESEND_TO,
    subject: notification.subject,
    html: notification.html,
    text: notification.text,
  });
  if (result.error) {
    throw new Error(`Resend error: ${result.error.message}`);
  }
}

export async function sendTelegram(text: string): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn("[notify] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID missing — skipping Telegram");
    return;
  }
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Telegram API ${res.status}: ${body}`);
  }
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
