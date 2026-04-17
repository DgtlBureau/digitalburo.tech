import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostPage } from "@/components/blog/PostPage";
import { getAllPostSlugs, getPostBySlug } from "@/lib/content";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const { frontmatter } = post;
  // For dual-path posts, canonical points to whichever source was marked canonical
  // in the original migration (canonicalSource field). Otherwise virazh path wins here.
  const canonical = frontmatter.canonical ?? `/virazh/tpost/${slug}`;

  return {
    title: frontmatter.title,
    description: frontmatter.description,
    alternates: {
      canonical: canonical.startsWith("http")
        ? canonical.replace("https://digitalburo.tech", "")
        : canonical,
    },
    openGraph: {
      type: "article",
      title: frontmatter.title,
      description: frontmatter.description,
      url: `/virazh/tpost/${slug}`,
      images: frontmatter.ogImage ? [frontmatter.ogImage] : undefined,
      publishedTime: frontmatter.date,
    },
  };
}

export default async function VirazhPostRoute({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();
  return <PostPage post={post} variant="virazh" />;
}
