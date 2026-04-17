import { loadDir } from "./loader";
import { PodcastFrontmatterSchema, type Podcast } from "./types";

function parseEpisodeNumber(title: string): number | null {
  const match = title.match(/^(\d+)\.\s/);
  return match ? parseInt(match[1], 10) : null;
}

function cleanSlug(slug: string): string {
  return slug.replace(/^[a-z0-9]{10}-\d+-/, "").replace(/^[a-z0-9]{10}-/, "");
}

let cache: Podcast[] | null = null;

export function getAllPodcasts(): Podcast[] {
  if (cache) return cache;

  const docs = loadDir("podcast", PodcastFrontmatterSchema);
  const podcasts = docs.map<Podcast>((doc) => ({
    ...doc,
    episodeNumber: parseEpisodeNumber(doc.frontmatter.title),
  }));

  podcasts.sort((a, b) => (a.episodeNumber ?? 0) - (b.episodeNumber ?? 0));
  cache = podcasts;
  return podcasts;
}

export function getPodcastBySlug(slug: string): Podcast | null {
  return (
    getAllPodcasts().find(
      (p) => cleanSlug(p.frontmatter.slug) === slug || p.frontmatter.slug === slug,
    ) ?? null
  );
}

export function podcastCleanSlug(podcast: Podcast): string {
  return cleanSlug(podcast.frontmatter.slug);
}
