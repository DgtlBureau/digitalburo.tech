import Link from "next/link";
import Image from "next/image";
import type { Post } from "@/lib/content";

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function PostCard({ post }: { post: Post }) {
  const { frontmatter, readingMinutes } = post;
  const href = `/blog/tpost/${frontmatter.slug}`;
  const date = dateFormatter.format(new Date(frontmatter.date));

  return (
    <article className="group flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 transition-colors hover:border-foreground/30">
      {frontmatter.ogImage ? (
        <Link href={href} className="relative block aspect-[16/9] overflow-hidden rounded-xl bg-muted">
          <Image
            src={frontmatter.ogImage}
            alt={frontmatter.title}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>
      ) : null}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <time dateTime={frontmatter.date}>{date}</time>
          <span aria-hidden>•</span>
          <span>{readingMinutes} мин</span>
        </div>
        <h3 className="text-lg font-semibold tracking-tight leading-snug">
          <Link href={href} className="transition-colors group-hover:text-primary">
            {frontmatter.title}
          </Link>
        </h3>
        {frontmatter.description ? (
          <p className="text-sm text-muted-foreground line-clamp-3">{frontmatter.description}</p>
        ) : null}
      </div>
    </article>
  );
}
