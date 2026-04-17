import { z } from "zod";

export const PostFrontmatterSchema = z.object({
  title: z.string(),
  slug: z.string(),
  postId: z.string().optional(),
  description: z.string().optional().default(""),
  date: z.string(),
  author: z.string().optional().default(""),
  tags: z.array(z.string()).optional().default([]),
  keywords: z.string().optional(),
  ogImage: z.string().nullable().optional(),
  ogImageRemote: z.string().nullable().optional(),
  canonical: z.string().optional(),
  canonicalSource: z.string().optional(),
  aliases: z.array(z.string()).optional().default([]),
  type: z.string().optional(),
});

export type PostFrontmatter = z.infer<typeof PostFrontmatterSchema>;

export const PodcastFrontmatterSchema = z.object({
  title: z.string(),
  slug: z.string(),
  url: z.string().optional(),
  description: z.string().nullable().optional(),
  ogImage: z.string().nullable().optional(),
  ogImageRemote: z.string().nullable().optional(),
  kind: z.literal("podcast").optional(),
});

export type PodcastFrontmatter = z.infer<typeof PodcastFrontmatterSchema>;

export const VacancyFrontmatterSchema = z.object({
  title: z.string(),
  slug: z.string(),
  url: z.string().optional(),
  description: z.string().nullable().optional(),
  ogImage: z.string().nullable().optional(),
  ogImageRemote: z.string().nullable().optional(),
  kind: z.literal("vacancy").optional(),
});

export type VacancyFrontmatter = z.infer<typeof VacancyFrontmatterSchema>;

export const PageFrontmatterSchema = z.object({
  title: z.string(),
  slug: z.string(),
  url: z.string().optional(),
  description: z.string().optional().default(""),
  ogImage: z.string().nullable().optional(),
  ogImageRemote: z.string().nullable().optional(),
  imagesCount: z.number().optional(),
  textBlocksCount: z.number().optional(),
});

export type PageFrontmatter = z.infer<typeof PageFrontmatterSchema>;

export interface ContentDocument<T> {
  frontmatter: T;
  body: string;
  sourcePath: string;
}

export type Post = ContentDocument<PostFrontmatter> & {
  readingMinutes: number;
};

export type Podcast = ContentDocument<PodcastFrontmatter> & {
  episodeNumber: number | null;
};

export type Vacancy = ContentDocument<VacancyFrontmatter>;
export type Page = ContentDocument<PageFrontmatter>;
