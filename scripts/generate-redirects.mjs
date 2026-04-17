#!/usr/bin/env node
/**
 * Emits static HTML pages into public/ that perform meta-refresh + JS redirect.
 * GitHub Pages serves static HTML, so this is how we keep SEO-safe 301-ish behavior
 * (technically meta refresh = 301-lite, but Google treats it as permanent).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PUBLIC = join(ROOT, "public");

const PODCAST_REDIRECTS = [
  ["ayz5zzj661-1-iskusstvo-zakaznoi-razrabotki", "iskusstvo-zakaznoi-razrabotki"],
  ["ndpfff4ll1-2-kak-ustroen-internet", "kak-ustroen-internet"],
  ["4rgihsday1-3-kak-python-razrabotchik-prevraschaetsy", "kak-python-razrabotchik-prevraschaetsy"],
  ["lubrbml771-4-pochemu-gospodryadi-peredayut-druzyam", "pochemu-gospodryadi-peredayut-druzyam"],
  ["tzvjfmakz1-5-snachala-distributsiya-zatem-produkt", "snachala-distributsiya-zatem-produkt"],
  ["p33fpx4f71-6-kak-vibirayut-yazik-programmirovaniya", "kak-vibirayut-yazik-programmirovaniya"],
];

const VACANCY_REDIRECTS = [
  ["9pyckxd3n1-flutter-razrabotchik", "flutter-razrabotchik"],
  ["yo0iei17a1-middle-php-laravel-web-razrabotchik", "middle-php-laravel-web-razrabotchik"],
  ["g1vvl19a91-menedzher-po-b2b-prodazham", "menedzher-po-b2b-prodazham"],
  ["ji623k2n61-middle-project-manager", "middle-project-manager"],
];

const LEGACY_PAGES = [
  ["ru", "/"],
  ["buro", "/"],
  ["bureau_en", "/"],
  ["oldpage", "/"],
];

function renderRedirect(target) {
  const absolute = `https://digitalburo.tech${target}`;
  return `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta http-equiv="refresh" content="0; url=${target}">
<link rel="canonical" href="${absolute}">
<meta name="robots" content="noindex,follow">
<title>Перенаправление…</title>
<script>window.location.replace(${JSON.stringify(target)});</script>
</head>
<body style="font-family:system-ui,-apple-system,sans-serif;padding:2rem">
<p>Страница переехала. Если вас не перенаправило автоматически — <a href="${target}">перейти вручную</a>.</p>
</body>
</html>
`;
}

function emit(relativePath, target) {
  const outDir = join(PUBLIC, relativePath);
  mkdirSync(outDir, { recursive: true });
  const file = join(outDir, "index.html");
  writeFileSync(file, renderRedirect(target), "utf8");
}

let count = 0;
for (const [oldSlug, newSlug] of PODCAST_REDIRECTS) {
  emit(`tpost/${oldSlug}`, `/podcast/${newSlug}/`);
  count++;
}
for (const [oldSlug, newSlug] of VACANCY_REDIRECTS) {
  emit(`tpost/${oldSlug}`, `/career/${newSlug}/`);
  count++;
}
for (const [slug, target] of LEGACY_PAGES) {
  emit(slug, target);
  count++;
}

console.log(`[redirects] wrote ${count} legacy redirect pages into public/`);
