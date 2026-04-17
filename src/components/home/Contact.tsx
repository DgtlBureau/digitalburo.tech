import { ContactCard } from "@/components/forms/ContactCard";

export function Contact() {
  return (
    <section id="contact" className="border-b border-border">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-[1.1fr_1fr]">
          <div>
            <p className="text-sm uppercase tracking-widest text-muted-foreground">
              Свяжитесь с нами
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-5xl">
              Мы всегда рады новым партнёрам и амбициозным задачам.
            </h2>
            <p className="mt-6 text-muted-foreground">
              Заполните форму или напишите нам в Telegram — ответим в течение дня.
            </p>
            <dl className="mt-8 space-y-4 text-sm">
              <div>
                <dt className="text-muted-foreground">Email</dt>
                <dd>
                  <a
                    href="mailto:access@digitalburo.tech"
                    className="text-lg font-medium hover:underline"
                  >
                    access@digitalburo.tech
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Telegram</dt>
                <dd>
                  <a
                    href="https://t.me/digitalburo"
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-lg font-medium hover:underline"
                  >
                    @digitalburo
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">CEO</dt>
                <dd className="text-lg font-medium">Виталий Зарубин</dd>
              </div>
            </dl>
          </div>
          <ContactCard source="home" emailSubject="Заявка с главной" />
        </div>
      </div>
    </section>
  );
}
