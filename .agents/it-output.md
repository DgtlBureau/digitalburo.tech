# IT Review — digitalburo.tech
Date: 2026-04-17
Commit scope: starting from 1b1df08

## TL;DR
- Security posture is clean for a static export: the only use of React's raw-HTML injection prop is in `JsonLd.tsx` (escapes `<` per Next.js guide) and the redirect HTML emitted by `scripts/generate-redirects.mjs` (no user input, JSON.stringify around the URL literal). No `/api` routes, no secrets in source, no `process.env.*` references in `src/`.
- Biggest win available: trim unused deps (`resend`, `react-hook-form`, `@hookform/resolvers`, `next-intl`, `sonner`, `next-themes`, and at least 5 shadcn primitives) — dead weight from the pre-refactor API form era. Estimated ~1–2 MB off `node_modules` and a faster CI install.
- Home / Virazh / Career pages share an identical "eyebrow + h2 + grid of card divs wrapped in a `border-b` section" pattern 6+ times. A tiny `<Section>` / `<SectionHeader>` extraction is the only real DRY win and will pay for itself the moment copy changes.
- Content loader is sensible (build-time only, zod-validated, module-level cache). One latent bug in `src/app/virazh/tpost/[slug]/page.tsx` L30–33: fragile string-strip of the domain to re-relativize `canonical`. Works today; will silently misfire if any MDX ever sets a canonical to a sibling domain.
- No TypeScript `any`, no `@ts-expect-error`, no loose casts in `src/`. Strict mode is real here. One minor `as ToasterProps["theme"]` cast in `sonner.tsx` and that file is itself a dead-code candidate.

## P0 — Blockers
None. This is a static export with zero server surface; the class of bug that would be a P0 doesn't exist in this codebase right now.

## P1 — High priority

### P1-1 · Remove unused runtime deps that ship into bundle analysis
**Path:** `package.json` L12–35
**Problem:** `resend`, `react-hook-form`, `@hookform/resolvers`, `next-intl`, `sonner`, `next-themes`, and `tw-animate-css` have zero imports in `src/**`. `resend` is a Node SDK that should never be in a static-export build dep list. `sonner` is only referenced via `src/components/ui/sonner.tsx` which is mounted in `layout.tsx` but nothing in the app calls `toast()`, so the `<Toaster>` provider ships for no reason.
**Evidence:** ripgrep for `resend|useForm|hookform|zodResolver|next-intl` in `src/` returns nothing. ripgrep for `toast\(` in `src/` returns nothing. ripgrep for `next-themes` returns one hit — `src/components/ui/sonner.tsx` — which is only used by the unused Toaster.
**Fix:**
  1. Delete `src/components/ui/sonner.tsx`.
  2. Remove `<Toaster>` import and render from `src/app/layout.tsx`.
  3. `pnpm remove resend react-hook-form @hookform/resolvers next-intl sonner next-themes tw-animate-css`.
  4. If you still want `tw-animate-css` (it is imported in `globals.css:2`), keep it — but verify it is actually used by any class names; I did not find any `animate-*` custom classes in the codebase.

### P1-2 · Delete dead shadcn UI primitives
**Path:** `src/components/ui/{badge,card,input,label,separator,sheet,textarea}.tsx`
**Problem:** None of these are imported anywhere in `src/**` (ripgrep `from.*@/components/ui/(badge|card|input|label|separator|sheet|textarea)` → no matches). Card in particular pulls a large Tailwind selector surface with `group/card` etc. — pure dead weight in the tree-shaker's diet.
**Fix:** Delete the files. If/when a form, sheet, or card with shadcn defaults is needed, re-add from `npx shadcn add <component>`. The only UI primitives actually used today are `button.tsx` + `button-link.tsx`.

### P1-3 · Page-section boilerplate duplicated 15+ times
**Paths:** `src/app/virazh/page.tsx`, `src/app/career/page.tsx`, `src/components/home/{Cases,Platforms,Consultation,Testimonials,Research,Contact}.tsx`
**Problem:** Nearly every section repeats:
```tsx
<section className="border-b border-border ...">
  <div className="mx-auto w-full max-w-6xl px-4 py-20 md:py-28">
    <p className="text-sm uppercase tracking-widest text-muted-foreground">{eyebrow}</p>
    <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
    ...
```
There are three spacing variants (`py-20 md:py-28`, `py-24 md:py-36`, `py-16 md:py-24`), two h2 sizes, and a recurring `max-w-6xl px-4` container. When copy or rhythm changes (it will), you will grep-and-edit 8 files.
**Fix:** Introduce `src/components/layout/Section.tsx` + `SectionHeader`:
```tsx
<Section tone="default|muted|invert" size="hero|default|compact" id="contact">
  <SectionHeader eyebrow="..." title="..." description="..." />
  {children}
</Section>
```
Replace ~15 call sites. Est. M effort (~2h), instantly readable pages, one source of truth for rhythm.

### P1-4 · Virazh/page.tsx inlines a PostCard variant
**Path:** `src/app/virazh/page.tsx` L200–224
**Problem:** The "Latest posts" grid duplicates `PostCard` logic but hardcodes `/virazh/tpost/${slug}` instead of `/blog/tpost/${slug}`. Same markup, different href prefix.
**Fix:** Extend `PostCard` with `variant?: "blog" | "virazh"` (mirror what `PostPage` already does) and use it here. Removes the date-formatting, image and line-clamp divergence.

### P1-5 · Canonical-URL rewrite is fragile
**Path:** `src/app/virazh/tpost/[slug]/page.tsx` L30–33
**Problem:**
```ts
canonical: canonical.startsWith("http")
  ? canonical.replace("https://digitalburo.tech", "")
  : canonical,
```
Next's `alternates.canonical` already handles absolute URLs correctly (`metadataBase` is set in root layout). The string-replace is defensive code that (a) is unnecessary and (b) silently produces a broken path if a post ever has a canonical pointing to `http://` or `https://www.digitalburo.tech`.
**Fix:** Just pass `canonical` through; Next will resolve it against `metadataBase`. If you need path-only, use `new URL(canonical, "https://digitalburo.tech").pathname`.

## P2 — Medium priority

### P2-1 · `getPage` literal-union leaks content assumptions
**Path:** `src/lib/content/pages.ts` L4
**Problem:** `slug: "home" | "leadership" | "career" | "virazh" | "policy"` — but only `"leadership"` and `"policy"` are actually called in code. The other three strings suggest a plan that did not ship, and any new page added requires editing two places (the MDX file + the union).
**Fix:** Widen to `string` and let the schema parse catch typos, or derive the union from a const array of known slugs.

### P2-2 · `PageFrontmatterSchema` contains migration-only fields
**Path:** `src/lib/content/types.ts` L46–55
**Problem:** `imagesCount`, `textBlocksCount`, `url` are Tilda-extraction artifacts that the app never reads. They should be removed (or moved to a `migration.*` nested object) so the schema documents what the app actually consumes. Same for `ogImageRemote`, `canonicalSource`, `postId` on `PostFrontmatterSchema`.
**Fix:** Trim the schemas. If MDX files contain extra keys, zod will ignore them — the schemas do not need to list them, and the noise is misleading.

### P2-3 · `sitemap.ts` emits `/virazh/tpost/*` for every post with only priority 0.5
**Path:** `src/app/sitemap.ts` L23–36
**Problem:** You are indexing both `/blog/tpost/<slug>` and `/virazh/tpost/<slug>` as separate entries. Given that `/virazh/tpost/<slug>` canonicalizes back to the blog (per `frontmatter.canonical` default in PostPage route), adding it to the sitemap actively tells Google to crawl duplicates that you have already marked as non-canonical. Counterproductive.
**Fix:** Drop the virazh duplicate from sitemap (keep the routes for backwards-compat, let canonical do its job). The virazh-tpost URLs do not belong in the index.

### P2-4 · Podcast slug matching has two slightly different regexes
**Paths:** `src/lib/content/podcasts.ts` L10, `src/lib/content/vacancies.ts` L4
**Problem:** Podcasts strip `^[a-z0-9]{10}-\d+-` first then `^[a-z0-9]{10}-`. Vacancies only strip `^[a-z0-9]{10}-`. This is correct today but duplicative. Extract a shared `stripTildaIdPrefix(slug, { numbered?: boolean })` helper in `loader.ts` or a new `slugs.ts`.
**Fix:** S-effort extraction. Will also matter if you ever touch MDX slugs.

### P2-5 · Module-level cache in content loaders
**Paths:** `src/lib/content/{posts,podcasts,vacancies}.ts` — `let cache: T[] | null = null`
**Problem:** Fine for `output: "export"` (build-time only, single process). Worth a comment saying so — any future switch to SSR/ISR will leak across requests or miss content updates. Cheap to document, invisible to fix.

### P2-6 · External-domain detection in `MdxContent` image handler
**Path:** `src/components/mdx/MdxContent.tsx` L51–76
**Problem:** The local-vs-remote check is `src.startsWith("/")`. Any MDX with `./relative.png` or `image.png` (no leading slash) falls through to the remote branch and ships a non-Next `<img>`. Given the migration corpus is known, this is probably fine, but worth hardening: `const isRemote = /^https?:\/\//.test(src)`.
**Fix:** Flip the test to explicitly detect remote, default to `<Image>`.

### P2-7 · `podcast` page strips `N. ` prefix client-side twice
**Paths:** `src/app/podcast/page.tsx` L45, `src/app/podcast/[slug]/page.tsx` L53
**Problem:** `title.replace(/^\d+\.\s/, "")` repeated. Not harmful, but duplicated. Add `displayTitle` to the `Podcast` type (computed once in the loader where `episodeNumber` is already parsed).

## P3 — Nice to have
- `src/components/ui/badge.tsx` uses `useRender` and `mergeProps` from `@base-ui/react` even though it is unused; removing the whole file (P1-2) drops this incidentally.
- `Header.tsx` has no mobile nav toggle — `primaryNav` is `hidden md:flex`. On mobile the only nav is the "Связаться" button. Might be intentional for now but flag for CMO/UX pass.
- `Header.tsx` logo uses `SITE_SHORT[0]` — literally the character "Б". Fine, but if `SITE_SHORT` ever changes to Latin chars the visual will break silently.
- `MdxContent.tsx` `img` component coerces `src` through `typeof src !== "string"` — that branch silently drops images that come through MDX as `StaticImport`. Unlikely given gray-matter, but worth a note.
- `Research.tsx` has a "Просмотреть исследование" `<Button variant="secondary">` that does nothing (no href, no onClick). Either wire it to a PDF link or use `ButtonLink`.
- `Cases.tsx` image `alt={c.name}` — probably fine, but for a bg image with `opacity-40` a decorative `alt=""` + `role="presentation"` would be more correct semantically.
- `footerSections` is declared `as const` but `{ external: true }` only exists on the Telegram link; the `"external" in link` narrowing in `Footer.tsx` L25 works but TS would be happier with a discriminated union.
- `scripts/generate-rss.mjs` hand-rolls a frontmatter parser (L25–44) instead of importing `gray-matter` like the runtime loader does. Two sources of truth. Use the same `gray-matter` dep that is already installed and drop 20 lines.
- `scripts/generate-redirects.mjs` hardcodes slug lists inline. If the MDX corpus ever gets another migration, this needs a manual edit. Low risk for now; medium cost when it bites.
- `robots.ts` `disallow: ["/policy"]` + `policy/page.tsx` sets `robots: { index: false }` — belt and suspenders, fine.
- `next.config.ts` is minimal and correct for `output: "export"`. No `images.remotePatterns`, which matches the `unoptimized: true` choice.
- `.github/workflows/deploy.yml` uses pinned major versions (`actions/checkout@v4` etc.) — fine; no secrets used; `NEXT_TELEMETRY_DISABLED=1` is set; runs on every push to main with concurrency cancel. Solid.

## Reusable patterns worth extracting

| Pattern | Where | Effort | Value |
|---|---|---|---|
| `<Section>` wrapper (border-b, max-w-6xl, py variants, tone invert/muted) | all page/home components, virazh, career | M (~2h) | High — 15+ call sites |
| `<SectionHeader eyebrow title description />` | home + virazh + career | S (~30min) | High — eyebrow/h2 copy-paste |
| `<PostCard variant="blog"\|"virazh">` merged | `virazh/page.tsx` latest posts + existing PostCard | S | Medium |
| `stripTildaIdPrefix(slug)` shared util | podcasts, vacancies loaders | S | Low-medium |
| `formatRuDate(date)` shared util | PostCard, PostPage, virazh/page.tsx | XS | Low |
| `<ContactSection title description source emailSubject />` | `home/Contact.tsx` + virazh contact block (lines 228–247) | S | Medium — two near-identical blocks |

## Unused deps to remove from package.json

Confirmed zero imports in `src/`:
- `resend` (6.12.0) — Node SDK, definitely client-unsafe, 0 usages
- `react-hook-form` (7.72.1)
- `@hookform/resolvers` (5.2.2)
- `next-intl` (4.9.1) — Russian-only site, no i18n runtime in use
- `sonner` (2.0.7) — remove together with `src/components/ui/sonner.tsx` and `<Toaster>` in `layout.tsx`
- `next-themes` (0.4.6) — only used by sonner.tsx; remove alongside
- `shadcn` (4.3.0) — CLI tool, belongs in `devDependencies` if anywhere, not in runtime deps

Keep-but-verify:
- `tw-animate-css` — imported in `globals.css:2`. Grep for actual `animate-*` class usage; if none, drop.
- `date-fns` — not imported by `src/` but is a peer dep of `@base-ui/react` (confirmed in `node_modules/@base-ui/react/package.json`). pnpm will hoist it via peer; you can remove from direct deps if strict-peer-deps is off, otherwise leave it.
- `@tailwindcss/typography` — imported nowhere in `globals.css` or JS. Remove unless a future `prose` pass is planned.
- `@types/mdx` — OK to keep as devDep, MDX plugin type surface.

Total cleanup: ~7 runtime deps. Easy P1.
