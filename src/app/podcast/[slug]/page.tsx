import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MdxContent } from "@/components/mdx/MdxContent";
import {
  getAllPodcasts,
  getPodcastBySlug,
  podcastCleanSlug,
} from "@/lib/content";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getAllPodcasts().map((p) => ({ slug: podcastCleanSlug(p) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const ep = getPodcastBySlug(slug);
  if (!ep) return {};
  return {
    title: ep.frontmatter.title,
    description: ep.frontmatter.description ?? undefined,
    alternates: { canonical: `/podcast/${slug}` },
  };
}

export default async function PodcastEpisodePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const ep = getPodcastBySlug(slug);
  if (!ep) notFound();

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 md:py-20">
      <nav className="mb-8 text-sm text-muted-foreground">
        <Link href="/podcast" className="hover:text-foreground">
          ← Все эпизоды
        </Link>
      </nav>
      <header className="mb-10">
        <p className="text-sm uppercase tracking-widest text-muted-foreground">
          Эпизод{ep.episodeNumber ? ` ${ep.episodeNumber}` : ""}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl md:leading-tight">
          {ep.frontmatter.title.replace(/^\d+\.\s/, "")}
        </h1>
        {ep.frontmatter.description ? (
          <p className="mt-5 text-lg text-muted-foreground md:text-xl">
            {ep.frontmatter.description}
          </p>
        ) : null}
      </header>
      <div className="post-body">
        <MdxContent source={ep.body} />
      </div>
    </main>
  );
}
