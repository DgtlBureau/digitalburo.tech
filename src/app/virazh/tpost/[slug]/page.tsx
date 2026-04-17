import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostPage } from "@/components/blog/PostPage";
import { getAllPostSlugs, getPostBySlug } from "@/lib/content";
import { postCanonicalPath } from "@/lib/canonical";

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
  const canonical = postCanonicalPath(frontmatter, "virazh");

  return {
    title: frontmatter.title,
    description: frontmatter.description,
    alternates: { canonical },
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
