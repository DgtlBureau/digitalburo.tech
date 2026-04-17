#!/usr/bin/env node
/**
 * Builds public/rss.xml from content/blog at build time.
 * Runs before `next build` so the XML ends up in public/ and is emitted verbatim.
 */
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const BLOG_DIR = join(ROOT, "content", "blog");
const OUT = join(ROOT, "public", "rss.xml");
const SITE_URL = "https://digitalburo.tech";

function escapeXml(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const body = match[1];
  const fm = {};
  const lines = body.split("\n");
  let currentKey = null;
  for (const line of lines) {
    const kv = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
    if (kv) {
      currentKey = kv[1];
      let value = kv[2].trim();
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1).replace(/\\"/g, '"');
      }
      fm[currentKey] = value;
    }
  }
  return fm;
}

function readPosts() {
  const entries = readdirSync(BLOG_DIR, { withFileTypes: true });
  const posts = [];
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const mdxPath = join(BLOG_DIR, entry.name, "index.mdx");
    try {
      const raw = readFileSync(mdxPath, "utf8");
      const fm = parseFrontmatter(raw);
      if (fm.title && fm.slug && fm.date) posts.push(fm);
    } catch {
      // skip unreadable
    }
  }
  posts.sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  return posts;
}

function render(posts) {
  const items = posts
    .map((p) => {
      const link = `${SITE_URL}/blog/tpost/${p.slug}`;
      const pubDate = new Date(p.date).toUTCString();
      return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${escapeXml(p.description || "")}</description>
      <pubDate>${pubDate}</pubDate>
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Бюро Цифровых Технологий — Блог</title>
    <link>${SITE_URL}/blog</link>
    <description>Цифровые технологии и спорт: CRM, болельщики, управление клубом и стадионом.</description>
    <language>ru-RU</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;
}

const posts = readPosts();
mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, render(posts), "utf8");
console.log(`[rss] wrote ${posts.length} items → ${OUT}`);
