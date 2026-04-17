import readingTime from "reading-time";
import { loadDir } from "./loader";
import { PostFrontmatterSchema, type Post } from "./types";

let cache: Post[] | null = null;

export function getAllPosts(): Post[] {
  if (cache) return cache;

  const docs = loadDir("blog", PostFrontmatterSchema);
  const posts = docs.map<Post>((doc) => ({
    ...doc,
    readingMinutes: Math.max(1, Math.round(readingTime(doc.body).minutes)),
  }));

  posts.sort((a, b) => b.frontmatter.date.localeCompare(a.frontmatter.date));
  cache = posts;
  return posts;
}

export function getPostBySlug(slug: string): Post | null {
  return getAllPosts().find((p) => p.frontmatter.slug === slug) ?? null;
}

export function getAllPostSlugs(): string[] {
  return getAllPosts().map((p) => p.frontmatter.slug);
}

export function getAllTags(): string[] {
  const tags = new Set<string>();
  for (const p of getAllPosts()) {
    for (const t of p.frontmatter.tags) tags.add(t);
  }
  return Array.from(tags).sort();
}
