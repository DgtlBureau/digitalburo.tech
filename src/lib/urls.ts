export const SITE_URL = "https://digitalburo.tech";

export function absoluteUrl(path: string): string {
  if (path.startsWith("http")) return path;
  if (!path.startsWith("/")) path = `/${path}`;
  return `${SITE_URL}${path}`;
}

export function blogPostUrl(slug: string, variant: "blog" | "virazh" = "blog") {
  return `/${variant}/tpost/${slug}`;
}
