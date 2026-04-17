import type { Metadata } from "next";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/button-link";
import { getAllVacancies, vacancyCleanSlug } from "@/lib/content";
import { careerValues, careerIntern } from "@/lib/careerData";

export const metadata: Metadata = {
  title: "Карьера",
  description:
    "Вакансии в Бюро Цифровых Технологий — разработчики, продакт-менеджеры, B2B-продажи для спортивной индустрии.",
  alternates: { canonical: "/career" },
};

export default function CareerPage() {
  const vacancies = getAllVacancies();

  return (
    <main>
      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 md:py-32">
          <p className="text-sm uppercase tracking-widest text-muted-foreground">
            Карьера
          </p>
          <h1 className="mt-3 max-w-4xl text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
            Стать частью команды в Бюро Цифровых Технологий
          </h1>
          <p className="mt-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
            Карьерные возможности в компании, которая меняет игру. Мы делаем лучший софт
            для спортивной индустрии — и ищем тех, кто хочет это делать вместе с нами.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="#vacancies" size="lg">
              Смотреть вакансии
            </ButtonLink>
            <ButtonLink
              href="mailto:access@digitalburo.tech?subject=Резюме"
              size="lg"
              variant="outline"
            >
              Отправить CV
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-muted/20">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 md:py-28">
          <p className="text-sm uppercase tracking-widest text-muted-foreground">
            Ценности
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Ценности, которых мы придерживаемся
          </h2>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {careerValues.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl border border-border bg-card p-6"
              >
                <h3 className="text-xl font-semibold tracking-tight">{v.title}</h3>
                <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                  {v.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="vacancies" className="border-b border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 md:py-28">
          <p className="text-sm uppercase tracking-widest text-muted-foreground">
            Активные вакансии
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            {vacancies.length}{" "}
            {vacancies.length === 1 ? "вакансия" : vacancies.length < 5 ? "вакансии" : "вакансий"}
          </h2>
          <ul className="mt-10 divide-y divide-border border-y border-border">
            {vacancies.map((v) => {
              const href = `/career/${vacancyCleanSlug(v)}`;
              return (
                <li key={v.frontmatter.slug}>
                  <Link
                    href={href}
                    className="group flex flex-col gap-2 py-6 transition-colors hover:bg-muted/30 md:flex-row md:items-center md:justify-between md:gap-8 md:px-2"
                  >
                    <div>
                      <h3 className="text-xl font-semibold tracking-tight group-hover:text-primary">
                        {v.frontmatter.title}
                      </h3>
                      {v.frontmatter.description ? (
                        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                          {v.frontmatter.description}
                        </p>
                      ) : null}
                    </div>
                    <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground">
                      Подробнее →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="border-b border-border bg-foreground text-background">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-16 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
              {careerIntern.title}
            </h2>
            <p className="mt-3 max-w-2xl opacity-80">{careerIntern.description}</p>
          </div>
          <ButtonLink
            href="mailto:access@digitalburo.tech?subject=Стажировка"
            size="lg"
            variant="secondary"
          >
            Подать заявку
          </ButtonLink>
        </div>
      </section>
    </main>
  );
}
