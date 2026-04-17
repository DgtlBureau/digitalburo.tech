import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button-link";
import { JsonLd } from "@/components/JsonLd";
import { ORG_ID, organizationData } from "@/lib/organizationData";
import { absoluteUrl } from "@/lib/urls";
import {
  arenasHero,
  arenasModules,
  arenasStats,
  arenasWhy,
  arenasProcess,
  arenasRoles,
  arenasFAQ,
} from "@/lib/arenasData";

export const metadata: Metadata = {
  title: "Вираж для арены — операционная платформа стадиона",
  description:
    "Билеты, F&B, лояльность, доступ, парковка и ретейл арены в одной событийной CRM. 8-12 недель от договора до первого матча. Кейс ХК Торпедо: 15 291 проход, 12 388 билетов.",
  alternates: { canonical: "/virazh/arenas" },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Вираж — операционная платформа спортивной арены",
  serviceType: "Sports venue operations software and consulting",
  description:
    "Единая платформа для операционной деятельности спортивной арены: билеты, F&B, программа лояльности, мобильное приложение, access control, парковка, ретейл. Внедрение за сезон, SLA-поддержка.",
  url: absoluteUrl("/virazh/arenas/"),
  provider: {
    "@id": ORG_ID,
    "@type": "Organization",
    name: organizationData.name,
    url: organizationData.url,
  },
  areaServed: {
    "@type": "Country",
    name: "Russia",
  },
  audience: {
    "@type": "BusinessAudience",
    name: "Директора спортивных арен и стадионов",
  },
  offers: {
    "@type": "Offer",
    url: absoluteUrl("/virazh/arenas/#contact"),
    priceCurrency: "RUB",
    priceSpecification: {
      "@type": "PriceSpecification",
      priceCurrency: "RUB",
      description: "Корпоративные тарифы — обсуждается индивидуально после интро-встречи",
    },
    availability: "https://schema.org/InStock",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: arenasFAQ.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Главная", item: absoluteUrl("/") },
    { "@type": "ListItem", position: 2, name: "Вираж", item: absoluteUrl("/virazh/") },
    {
      "@type": "ListItem",
      position: 3,
      name: "Для арен",
      item: absoluteUrl("/virazh/arenas/"),
    },
  ],
};

export default function ArenasPage() {
  return (
    <main>
      <JsonLd data={[serviceSchema, faqSchema, breadcrumbSchema]} />

      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-24 md:py-36">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {arenasHero.eyebrow}
          </p>
          <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
            {arenasHero.title}
          </h1>
          <p className="mt-8 max-w-3xl text-lg text-muted-foreground md:text-xl">
            {arenasHero.subtitle}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="#contact" size="lg">
              Запросить стоимость
            </ButtonLink>
            <ButtonLink
              href="/virazh/arenas/brief"
              size="lg"
              variant="outline"
            >
              One-pager (PDF)
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Stats — real Torpedo numbers */}
      <section className="border-b border-border bg-foreground text-background">
        <div className="mx-auto w-full max-w-6xl px-4 py-16 md:py-20">
          <p className="mb-10 text-sm uppercase tracking-widest opacity-70">
            Что уже работает на Вираже
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            {arenasStats.map((s) => (
              <div key={s.label}>
                <div className="text-5xl font-semibold tracking-tight md:text-6xl">
                  {s.value}
                </div>
                <div className="mt-3 text-sm leading-relaxed opacity-80">
                  {s.label}
                </div>
                <div className="mt-1 text-xs opacity-50">{s.note}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 md:py-28">
          <p className="text-sm uppercase tracking-widest text-muted-foreground">
            Экосистема
          </p>
          <h2 className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">
            6 модулей под полный цикл операционки арены
          </h2>
          <p className="mt-4 max-w-3xl text-muted-foreground">
            Не ломаем существующий стек — становимся single-pane поверх ваших
            ticketing-, кассовых и access-систем. 200 событий в год: матчи,
            концерты, корпоративы, турниры, выставки.
          </p>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {arenasModules.map((m) => (
              <article
                key={m.title}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <h3 className="text-xl font-semibold tracking-tight">{m.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {m.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Why not a tool */}
      <section className="border-b border-border bg-muted/20">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 md:py-28">
          <p className="text-sm uppercase tracking-widest text-muted-foreground">
            Почему не просто CRM
          </p>
          <h2 className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">
            {arenasWhy.title}
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {arenasWhy.rows.map((r) => (
              <div key={r.title} className="rounded-2xl border border-border bg-card p-8">
                <h3 className="text-xl font-semibold tracking-tight">{r.title}</h3>
                <p className="mt-3 text-muted-foreground">{r.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 md:py-28">
          <p className="text-sm uppercase tracking-widest text-muted-foreground">
            Процесс внедрения
          </p>
          <h2 className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">
            От договора до первого матча — 8-12 недель
          </h2>
          <ol className="mt-12 grid gap-5 md:grid-cols-4">
            {arenasProcess.map((p, i) => (
              <li
                key={p.title}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <div className="text-sm font-mono text-muted-foreground">
                  0{i + 1} · {p.week}
                </div>
                <h3 className="mt-3 text-lg font-semibold tracking-tight">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                  {p.description}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Roles */}
      <section className="border-b border-border bg-muted/20">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 md:py-28">
          <p className="text-sm uppercase tracking-widest text-muted-foreground">
            Для всей команды арены
          </p>
          <h2 className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">
            Роли, которые работают в Вираже
          </h2>
          <dl className="mt-12 grid gap-3 md:grid-cols-2">
            {arenasRoles.map((r) => (
              <div
                key={r.role}
                className="flex flex-col gap-1 rounded-xl border border-border bg-card p-5 md:flex-row md:items-baseline md:gap-6"
              >
                <dt className="text-base font-semibold tracking-tight md:w-56">
                  {r.role}
                </dt>
                <dd className="text-sm text-muted-foreground">{r.uses}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-3xl px-4 py-20 md:py-28">
          <p className="text-sm uppercase tracking-widest text-muted-foreground">
            Вопросы и ответы
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            FAQ
          </h2>
          <div className="mt-10 space-y-6">
            {arenasFAQ.map((item) => (
              <details
                key={item.q}
                className="group rounded-2xl border border-border bg-card p-6"
              >
                <summary className="cursor-pointer list-none text-lg font-semibold tracking-tight [&::-webkit-details-marker]:hidden">
                  <span className="flex items-start justify-between gap-4">
                    <span>{item.q}</span>
                    <span className="mt-1 text-xl text-muted-foreground transition-transform group-open:rotate-45">
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-4 text-muted-foreground leading-relaxed">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="border-b border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 md:py-28">
          <div className="grid gap-12 md:grid-cols-[1.2fr_1fr]">
            <div>
              <p className="text-sm uppercase tracking-widest text-muted-foreground">
                Следующий шаг
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-5xl">
                Запросить стоимость
              </h2>
              <p className="mt-6 text-muted-foreground">
                Оцениваем вместе — на основе вашего объёма событий, текущего
                стека и задач сезона. 30 минут с Виталием Зарубиным, CEO БЦТ.
              </p>
              <p className="mt-4 text-muted-foreground">
                Дополнительно можем организовать интро-встречу с коммерческим
                директором ХК Торпедо — чтобы услышать про Вираж от
                действующего клиента.
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6 md:p-8">
              <h3 className="text-2xl font-semibold tracking-tight">
                Связаться с CEO
              </h3>
              <p className="mt-2 text-muted-foreground">
                Напишите коротко про арену — посадка, объём событий, текущий стек.
                Ответим в течение рабочего дня.
              </p>
              <div className="mt-6 space-y-3">
                <ButtonLink
                  href="mailto:access@digitalburo.tech?subject=Запрос%20по%20арене%20-%20Вираж"
                  size="lg"
                  className="w-full"
                >
                  Написать на email
                </ButtonLink>
                <ButtonLink
                  href="https://t.me/digitalburo"
                  external
                  size="lg"
                  variant="outline"
                  className="w-full"
                >
                  Telegram @digitalburo
                </ButtonLink>
              </div>
              <div className="mt-6 space-y-2 border-t border-border pt-5 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Email</span>
                  <a
                    href="mailto:access@digitalburo.tech"
                    className="font-medium hover:underline"
                  >
                    access@digitalburo.tech
                  </a>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">CEO</span>
                  <span className="font-medium">Виталий Зарубин</span>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12">
            <Link
              href="/virazh"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              ← Вираж для клубов
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
