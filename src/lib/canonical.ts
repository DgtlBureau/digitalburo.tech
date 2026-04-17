import type { PostFrontmatter } from "./content/types";
import { SITE_URL } from "./urls";

/**
 * Resolve the canonical URL path for a blog post.
 * Posts exist under two routes (/blog/tpost/<slug> and /virazh/tpost/<slug>).
 * Frontmatter `canonical` decides which one Google should treat as primary.
 * Returns an absolute-path ("/foo/bar") — Next's `alternates.canonical` resolves
 * it against `metadataBase`.
 */
export function postCanonicalPath(
  frontmatter: PostFrontmatter,
  fallbackVariant: "blog" | "virazh" = "blog",
): string {
  const c = frontmatter.canonical;
  if (!c) return `/${fallbackVariant}/tpost/${frontmatter.slug}`;
  if (c.startsWith("http")) {
    try {
      return new URL(c).pathname;
    } catch {
      return `/${fallbackVariant}/tpost/${frontmatter.slug}`;
    }
  }
  return c.startsWith("/") ? c : `/${c}`;
}

export function toAbsoluteCanonical(path: string): string {
  return `${SITE_URL}${path}`;
}
