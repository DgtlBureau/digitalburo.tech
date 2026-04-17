import type { Metadata } from "next";
import Link from "next/link";
import { getAllPodcasts, podcastCleanSlug } from "@/lib/content";

export const metadata: Metadata = {
  title: "Подкаст «Искусство заказной разработки»",
  description:
    "Подкаст Бюро Цифровых Технологий о том, как устроена заказная IT-разработка, где ошибаются заказчики и как выбирают технологии.",
  alternates: { canonical: "/podcast" },
};

export default function PodcastIndexPage() {
  const episodes = getAllPodcasts();

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-16 md:py-24">
      <header className="mb-12">
        <p className="text-sm uppercase tracking-widest text-muted-foreground">
          Подкаст
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-6xl">
          Искусство заказной разработки
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
          Серия разговоров о том, как устроены IT-проекты под заказ, где ошибаются
          заказчики и как выбираются технологии.
        </p>
      </header>

      <ol className="divide-y divide-border border-y border-border">
        {episodes.map((ep) => {
          const href = `/podcast/${podcastCleanSlug(ep)}`;
          return (
            <li key={ep.frontmatter.slug}>
              <Link
                href={href}
                className="group flex flex-col gap-3 py-8 transition-colors hover:bg-muted/30 md:flex-row md:items-center md:gap-8 md:px-2"
              >
                <div className="w-16 flex-none font-mono text-4xl font-semibold text-muted-foreground md:w-20 md:text-5xl">
                  {String(ep.episodeNumber ?? "—").padStart(2, "0")}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold tracking-tight group-hover:text-primary md:text-2xl">
                    {ep.frontmatter.title.replace(/^\d+\.\s/, "")}
                  </h2>
                  {ep.frontmatter.description ? (
                    <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                      {ep.frontmatter.description}
                    </p>
                  ) : null}
                </div>
                <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground md:self-center">
                  Слушать →
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </main>
  );
}
