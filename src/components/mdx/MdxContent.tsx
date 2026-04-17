import { MDXRemote } from "next-mdx-remote/rsc";
import Image from "next/image";
import Link from "next/link";
import type { ComponentProps } from "react";

const components = {
  h1: (props: ComponentProps<"h1">) => (
    <h1 className="mt-12 mb-6 text-3xl font-semibold tracking-tight md:text-4xl" {...props} />
  ),
  h2: (props: ComponentProps<"h2">) => (
    <h2 className="mt-10 mb-4 text-2xl font-semibold tracking-tight md:text-3xl" {...props} />
  ),
  h3: (props: ComponentProps<"h3">) => (
    <h3 className="mt-8 mb-3 text-xl font-semibold tracking-tight md:text-2xl" {...props} />
  ),
  p: (props: ComponentProps<"p">) => (
    <p className="my-5 leading-7 text-foreground/90" {...props} />
  ),
  ul: (props: ComponentProps<"ul">) => (
    <ul className="my-5 list-disc pl-6 [&>li]:my-2" {...props} />
  ),
  ol: (props: ComponentProps<"ol">) => (
    <ol className="my-5 list-decimal pl-6 [&>li]:my-2" {...props} />
  ),
  blockquote: (props: ComponentProps<"blockquote">) => (
    <blockquote className="my-6 border-l-4 border-border pl-6 italic text-foreground/80" {...props} />
  ),
  hr: () => <hr className="my-12 border-border" />,
  a: ({ href, ...props }: ComponentProps<"a">) => {
    if (!href) return <a {...props} />;
    const isInternal = href.startsWith("/") || href.startsWith("#");
    if (isInternal) {
      return (
        <Link
          href={href}
          className="underline decoration-primary/40 underline-offset-4 hover:decoration-primary"
          {...props}
        />
      );
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className="underline decoration-primary/40 underline-offset-4 hover:decoration-primary"
        {...props}
      />
    );
  },
  img: ({ src, alt }: ComponentProps<"img">) => {
    if (!src || typeof src !== "string") return null;
    const isLocal = src.startsWith("/");
    if (!isLocal) {
      return (
        // remote images: fall back to native img to avoid next.config remotePatterns churn
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt ?? ""}
          className="my-6 h-auto w-full rounded-lg border border-border"
          loading="lazy"
        />
      );
    }
    return (
      <Image
        src={src}
        alt={alt ?? ""}
        width={1600}
        height={900}
        className="my-6 h-auto w-full rounded-lg border border-border"
        sizes="(max-width: 768px) 100vw, 768px"
      />
    );
  },
  code: (props: ComponentProps<"code">) => (
    <code className="rounded bg-muted px-1.5 py-0.5 text-sm" {...props} />
  ),
  pre: (props: ComponentProps<"pre">) => (
    <pre className="my-6 overflow-x-auto rounded-lg bg-muted p-4 text-sm" {...props} />
  ),
};

function sanitizeMdx(raw: string): string {
  // MDX treats `<http://x>` as a JSX tag and breaks. Convert Tilda-era
  // autolinks and bare `<url>` forms into proper markdown links.
  return raw
    .replace(/<(https?:\/\/[^\s>]+)>/g, "[$1]($1)")
    .replace(/<(mailto:[^\s>]+)>/g, "[$1]($1)");
}

export async function MdxContent({ source }: { source: string }) {
  return (
    <div className="prose-content">
      <MDXRemote source={sanitizeMdx(source)} components={components} />
    </div>
  );
}
