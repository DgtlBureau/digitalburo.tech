import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button-link";
import { ContactCard } from "@/components/forms/ContactCard";
import { JsonLd } from "@/components/JsonLd";
import { getAllPosts } from "@/lib/content";
import { ORG_ID, organizationData } from "@/lib/organizationData";
import { absoluteUrl } from "@/lib/urls";
import {
  virazhHero,
  virazhValueProps,
  virazhStats,
  virazhBenefits,
  virazhEcosystem,
} from "@/lib/virazhData";

export const metadata: Metadata = {
  title: "Вираж — операционная система клуба и стадиона",
  description:
    "Единая платформа: билеты, CRM, программа лояльности, мобильное приложение, предиктивная аналитика. В проде у Авангарда, Торпедо, Динамо.",
  alternates: { canonical: "/virazh" },
};

const productSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "CRM Вираж",
  applicationCategory: "BusinessApplication",
  operatingSystem: ["Web", "iOS", "Android"],
  description:
    "Операционная платформа для спортивных клубов и стадионов: билеты, CRM, программа лояльности, мобильное приложение, предиктивная аналитика.",
  url: absoluteUrl("/virazh"),
  publisher: {
    "@id": ORG_ID,
    "@type": "Organization",
    name: organizationData.name,
    url: organizationData.url,
  },
  offers: {
    "@type": "Offer",
    priceCurrency: "RUB",
    availability: "https://schema.org/InStock",
    url: absoluteUrl("/virazh/#contact"),
    priceSpecification: {
      "@type": "PriceSpecification",
      priceCurrency: "RUB",
      description: "Корпоративные тарифы — обсуждается индивидуально",
    },
  },
};

export default function VirazhPage() {
  const latestPosts = getAllPosts().slice(0, 3);

  return (
    <main>
      <JsonLd data={productSchema} />

      {/* Hero */}
      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-24 md:py-36">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {virazhHero.eyebrow}
          </p>
          <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
            {virazhHero.title}
          </h1>
          <p className="mt-8 max-w-3xl text-lg text-muted-foreground md:text-xl">
            {virazhHero.subtitle}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="#contact" size="lg">
              Раскрыть потенциал клуба
            </ButtonLink>
            <ButtonLink href="#contact" size="lg" variant="outline">
              Демо →
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border bg-foreground text-background">
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-16 md:grid-cols-3">
          {virazhStats.map((s) => (
            <div key={s.label}>
              <div className="text-5xl font-semibold tracking-tight md:text-6xl">
                {s.value}
              </div>
              <div className="mt-2 text-sm uppercase tracking-widest opacity-70">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Value props */}
      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 md:py-28">
          <p className="text-sm uppercase tracking-widest text-muted-foreground">
            Из любви к игре
          </p>
          <h2 className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">
            Работа с партнерами, выкуп абонементов, запуск акций — успех при
            использовании правильного инструмента
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {virazhValueProps.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <h3 className="text-xl font-semibold tracking-tight">{v.title}</h3>
                <p className="mt-3 text-muted-foreground">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-b border-border bg-muted/20">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 md:py-28">
          <p className="text-sm uppercase tracking-widest text-muted-foreground">
            Преимущества Виража
          </p>
          <h2 className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">
            Трансформируем то, как работает клуб изнутри
          </h2>
          <p className="mt-4 max-w-3xl text-muted-foreground">
            Улучшаем сбор, фильтрацию и обработку данных, реализацию маркетингового
            потенциала. Каждая функция в системе направлена на совершенствование процессов
            и достижение максимального результата.
          </p>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {virazhBenefits.map((b) => (
              <div
                key={b.title}
                className="rounded-2xl border border-border bg-card p-8"
              >
                <h3 className="text-2xl font-semibold tracking-tight">{b.title}</h3>
                <p className="mt-3 text-muted-foreground">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI assistant */}
      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 md:py-28">
          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-widest text-muted-foreground">
              Вираж AI-ассистент
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
              Планшет руководителя с предиктивной аналитикой
            </h2>
            <p className="mt-4 text-muted-foreground">
              ИИ-ассистент проводит предиктивную аналитику метрик и предоставляет
              уникальные рекомендации на основе ваших данных в режиме реального времени —
              для повышения показателей и запуска новых маркетинговых кампаний.
            </p>
          </div>
        </div>
      </section>

      {/* Ecosystem */}
      <section className="border-b border-border bg-muted/20">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 md:py-28">
          <p className="text-sm uppercase tracking-widest text-muted-foreground">
            Экосистема
          </p>
          <h2 className="mt-2 max-w-3xl text-3xl font-semibold tracking-tight md:text-4xl">
            Решение покрывает полный спектр задач клуба и федерации
          </h2>
          <p className="mt-4 max-w-3xl text-muted-foreground">
            Система позволяет легко провести интеграцию и начать работу как раз к старту
            сезона.
          </p>
          <ul className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {virazhEcosystem.map((item) => (
              <li
                key={item}
                className="rounded-xl border border-border bg-card p-5 text-foreground/90"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Latest news */}
      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 md:py-28">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-widest text-muted-foreground">
                Новости
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
                Последние статьи
              </h2>
            </div>
            <Link
              href="/blog"
              className="hidden text-sm font-medium text-muted-foreground hover:text-foreground md:inline"
            >
              Все статьи →
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {latestPosts.map((post) => (
              <Link
                key={post.frontmatter.slug}
                href={`/virazh/tpost/${post.frontmatter.slug}`}
                className="group flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-foreground/30"
              >
                <div className="text-xs uppercase tracking-widest text-muted-foreground">
                  {new Date(post.frontmatter.date).toLocaleDateString("ru-RU", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </div>
                <h3 className="text-lg font-semibold tracking-tight group-hover:text-primary">
                  {post.frontmatter.title}
                </h3>
                {post.frontmatter.description ? (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {post.frontmatter.description}
                  </p>
                ) : null}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="border-b border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 md:py-28">
          <div className="grid gap-12 md:grid-cols-[1.1fr_1fr]">
            <div>
              <p className="text-sm uppercase tracking-widest text-muted-foreground">
                Свяжитесь с нами
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-5xl">
                Увидеть, как устроен «Вираж»
              </h2>
              <p className="mt-6 text-muted-foreground">
                Сопоставим с вашими потребностями и задачами. Вместе с БЦТ вы достигнете
                поставленных целей. Заполните форму — и мы свяжемся.
              </p>
            </div>
            <ContactCard source="virazh" emailSubject="Запрос по Виражу" />
          </div>
        </div>
      </section>
    </main>
  );
}
