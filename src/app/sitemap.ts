import type { MetadataRoute } from "next";
import {
  getAllPosts,
  getAllPodcasts,
  getAllVacancies,
  podcastCleanSlug,
  vacancyCleanSlug,
} from "@/lib/content";
import { SITE_URL } from "@/lib/urls";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, priority: 1, changeFrequency: "weekly" },
    { url: `${SITE_URL}/virazh`, priority: 0.9, changeFrequency: "weekly" },
    { url: `${SITE_URL}/blog`, priority: 0.8, changeFrequency: "weekly" },
    { url: `${SITE_URL}/podcast`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${SITE_URL}/career`, priority: 0.7, changeFrequency: "weekly" },
    { url: `${SITE_URL}/leadership`, priority: 0.5, changeFrequency: "monthly" },
  ];

  const posts = getAllPosts().flatMap<MetadataRoute.Sitemap[number]>((p) => [
    {
      url: `${SITE_URL}/blog/tpost/${p.frontmatter.slug}`,
      lastModified: new Date(p.frontmatter.date),
      priority: 0.6,
      changeFrequency: "yearly",
    },
    {
      url: `${SITE_URL}/virazh/tpost/${p.frontmatter.slug}`,
      lastModified: new Date(p.frontmatter.date),
      priority: 0.5,
      changeFrequency: "yearly",
    },
  ]);

  const podcasts = getAllPodcasts().map<MetadataRoute.Sitemap[number]>((ep) => ({
    url: `${SITE_URL}/podcast/${podcastCleanSlug(ep)}`,
    priority: 0.5,
    changeFrequency: "yearly",
  }));

  const vacancies = getAllVacancies().map<MetadataRoute.Sitemap[number]>((v) => ({
    url: `${SITE_URL}/career/${vacancyCleanSlug(v)}`,
    priority: 0.6,
    changeFrequency: "monthly",
  }));

  return [...staticPages, ...posts, ...podcasts, ...vacancies];
}
