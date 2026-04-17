import { Mail, Send } from "lucide-react";
import { ButtonLink } from "@/components/ui/button-link";

interface ContactCardProps {
  source?: string;
  emailSubject?: string;
}

export function ContactCard({
  source = "home",
  emailSubject = "Запрос с digitalburo.tech",
}: ContactCardProps) {
  const mailtoSubject = encodeURIComponent(`${emailSubject} (${source})`);

  return (
    <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
      <h3 className="text-2xl font-semibold tracking-tight">Свяжитесь с нами</h3>
      <p className="mt-2 text-muted-foreground">
        Коротко опишите задачу — ответим в течение дня.
      </p>
      <div className="mt-6 space-y-3">
        <ButtonLink
          href={`mailto:access@digitalburo.tech?subject=${mailtoSubject}`}
          size="lg"
          className="w-full"
        >
          <Mail className="size-4" />
          Написать на email
        </ButtonLink>
        <ButtonLink
          href="https://t.me/digitalburo"
          external
          size="lg"
          variant="outline"
          className="w-full"
        >
          <Send className="size-4" />
          Telegram @digitalburo
        </ButtonLink>
      </div>
      <div className="mt-6 space-y-2 border-t border-border pt-5 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">Email</span>
          <a href="mailto:access@digitalburo.tech" className="font-medium hover:underline">
            access@digitalburo.tech
          </a>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">CEO</span>
          <span className="font-medium">Виталий Зарубин</span>
        </div>
      </div>
    </div>
  );
}
