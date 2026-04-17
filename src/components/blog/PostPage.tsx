import Image from "next/image";
import Link from "next/link";
import { MdxContent } from "@/components/mdx/MdxContent";
import { JsonLd } from "@/components/JsonLd";
import type { Post } from "@/lib/content";
import { absoluteUrl } from "@/lib/urls";

const dateFormatter = new Intl.DateTimeFormat("ru-RU", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function PostPage({
  post,
  variant,
}: {
  post: Post;
  variant: "blog" | "virazh";
}) {
  const { frontmatter, body, readingMinutes } = post;
  const canonicalPath = `/${variant}/tpost/${frontmatter.slug}`;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: frontmatter.title,
    description: frontmatter.description,
    image: frontmatter.ogImage ? absoluteUrl(frontmatter.ogImage) : undefined,
    datePublished: frontmatter.date,
    author: {
      "@type": "Organization",
      name: "Бюро Цифровых Технологий",
    },
    publisher: {
      "@type": "Organization",
      name: "Бюро Цифровых Технологий",
      url: "https://digitalburo.tech",
    },
    mainEntityOfPage: absoluteUrl(canonicalPath),
  };

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 md:py-20">
      <JsonLd data={articleSchema} />
      <nav className="mb-8 text-sm text-muted-foreground">
        <Link
          href={variant === "virazh" ? "/virazh" : "/blog"}
          className="hover:text-foreground"
        >
          ← {variant === "virazh" ? "Вираж" : "Блог"}
        </Link>
      </nav>
      <header className="mb-10">
        <div className="mb-4 flex items-center gap-3 text-xs uppercase tracking-widest text-muted-foreground">
          <time dateTime={frontmatter.date}>
            {dateFormatter.format(new Date(frontmatter.date))}
          </time>
          <span aria-hidden>•</span>
          <span>{readingMinutes} мин</span>
          {frontmatter.tags.length > 0 ? (
            <>
              <span aria-hidden>•</span>
              <span>{frontmatter.tags.join(", ")}</span>
            </>
          ) : null}
        </div>
        <h1 className="text-3xl font-semibold tracking-tight md:text-5xl md:leading-tight">
          {frontmatter.title}
        </h1>
        {frontmatter.description ? (
          <p className="mt-5 text-lg text-muted-foreground md:text-xl">
            {frontmatter.description}
          </p>
        ) : null}
      </header>
      {frontmatter.ogImage ? (
        <div className="relative mb-10 aspect-[16/9] overflow-hidden rounded-2xl bg-muted">
          <Image
            src={frontmatter.ogImage}
            alt={frontmatter.title}
            fill
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover"
            priority
          />
        </div>
      ) : null}
      <div className="post-body">
        <MdxContent source={body} />
      </div>
    </main>
  );
}
