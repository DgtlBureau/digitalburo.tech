import type { MetadataRoute } from "next";
import {
  getAllPosts,
  getAllPodcasts,
  getAllVacancies,
  podcastCleanSlug,
  vacancyCleanSlug,
} from "@/lib/content";
import { postCanonicalPath } from "@/lib/canonical";
import { SITE_URL } from "@/lib/urls";

export const dynamic = "force-static";

const withSlash = (path: string): string =>
  path === "/" || path.endsWith("/") ? path : `${path}/`;
const abs = (path: string): string => `${SITE_URL}${withSlash(path)}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: abs("/"), priority: 1, changeFrequency: "weekly" },
    { url: abs("/virazh"), priority: 0.9, changeFrequency: "weekly" },
    { url: abs("/blog"), priority: 0.8, changeFrequency: "weekly" },
    { url: abs("/podcast"), priority: 0.7, changeFrequency: "monthly" },
    { url: abs("/career"), priority: 0.7, changeFrequency: "weekly" },
    { url: abs("/leadership"), priority: 0.5, changeFrequency: "monthly" },
  ];

  // Only canonical URLs in sitemap — per Google guidelines.
  // Dual-path posts (both /blog/tpost and /virazh/tpost render same MDX)
  // exist as routes, but only the one frontmatter.canonical points to is listed.
  const posts = getAllPosts().map<MetadataRoute.Sitemap[number]>((p) => ({
    url: abs(postCanonicalPath(p.frontmatter, "blog")),
    lastModified: new Date(p.frontmatter.date),
    priority: 0.6,
    changeFrequency: "yearly",
  }));

  const podcasts = getAllPodcasts().map<MetadataRoute.Sitemap[number]>((ep) => ({
    url: abs(`/podcast/${podcastCleanSlug(ep)}`),
    priority: 0.5,
    changeFrequency: "yearly",
  }));

  const vacancies = getAllVacancies().map<MetadataRoute.Sitemap[number]>((v) => ({
    url: abs(`/career/${vacancyCleanSlug(v)}`),
    priority: 0.6,
    changeFrequency: "monthly",
  }));

  return [...staticPages, ...posts, ...podcasts, ...vacancies];
}
