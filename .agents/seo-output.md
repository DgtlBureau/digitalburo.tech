# SEO Audit — digitalburo.tech
Date: 2026-04-17
Auditor: SEO agent
Scope: Next.js 16 static export (`output: 'export'`), GitHub Pages, RU-only

---

## TL;DR

- **Canonical war is live.** Every dual-path post (`/blog/tpost/<slug>` + `/virazh/tpost/<slug>` = 42×2 = 84 URLs, both in sitemap, both emitting self-referential canonicals). `blog/tpost/[slug]/page.tsx` ignores `frontmatter.canonical` entirely. Google will deduplicate ~42 posts on its own, and will likely pick whichever one earns more links/signals — not what we specified in MDX.
- **2 canonicals point to 404s.** `xj33umds91` → `/virazh/tpost/top5-crm-sport-organizations/` (no such page); `crj6jx9kf1` → `/virazh/tpost/crj6jx9kf1-hk-admiral-stanovitsya-blizhe-kbolelschi/` (no such page). Both are valid slugs in the old Tilda system but were never mapped to real routes. P0.
- **Trailing-slash mismatch sitemap vs canonical.** Sitemap emits `/blog/tpost/slug` (no slash). Pages emit `<link rel=canonical href="...slug/">` (with slash, because `trailingSlash: true`). Google will normalize but loses a minor signal.
- **No Open Graph image on any hub page** (home, /virazh, /blog, /career, /podcast, /leadership, /policy). Social previews will render as text-only. Quick site-level fallback fix.
- **Meta-refresh redirects are correctly configured.** 10 × `/tpost/<slug>` + 4 × legacy language pages have meta refresh 0s + canonical-to-new + noindex,follow. Google treats 0s meta-refresh as 301 — this is the only valid option on GH Pages.
- **JSON-LD Organization is thin.** Missing `address`, `contactPoint`, `founder`, `foundingDate`, `description` richness — fine for launch, not fine for Knowledge Graph.
- **Robust fundamentals**: `metadataBase`, titleTemplate, `lang="ru"`, `og:locale=ru_RU`, robots.txt + sitemap autowiring, RSS valid, 42 posts indexed, noindex on /policy, policy not in sitemap.

---

## P0 — Blockers

### P0-1. Canonical war across 42 dual-path blog posts
**Location**: `src/app/blog/tpost/[slug]/page.tsx:25` and `src/app/virazh/tpost/[slug]/page.tsx:24`

**Problem**: Same MDX is rendered at two URLs, and each emits a self-referential canonical. Examples verified in `out/`:
- `/blog/tpost/9h0j7oa2b1.../` → `<link rel=canonical href=".../blog/tpost/9h0j7oa2b1.../">`
- `/virazh/tpost/9h0j7oa2b1.../` → `<link rel=canonical href=".../virazh/tpost/9h0j7oa2b1.../">`

Frontmatter says `canonical: https://digitalburo.tech/virazh/tpost/9h0j7oa2b1...` — i.e. the virazh path should be canonical — but the blog route ignores `frontmatter.canonical` entirely. Google sees two identical pages with each claiming to be canonical → will cluster them and pick one on its own signal (likely the older/more-linked URL from Tilda era, which was `/blog/tpost/...` for most posts since the Tilda blog lived at `/blog/`).

**Impact**: Lost control of which URL ranks. Split link equity. Google Search Console will flag "Duplicate without user-selected canonical" for half the posts.

**Fix** — make both routes honor `frontmatter.canonical`, exactly like the virazh route already does:

```typescript
// src/app/blog/tpost/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  const { frontmatter } = post;

  const canonical = frontmatter.canonical
    ? (frontmatter.canonical.startsWith("http")
        ? frontmatter.canonical.replace("https://digitalburo.tech", "")
        : frontmatter.canonical)
    : `/blog/tpost/${slug}`;

  return {
    title: frontmatter.title,
    description: frontmatter.description,
    alternates: { canonical },
    openGraph: {
      type: "article",
      title: frontmatter.title,
      description: frontmatter.description,
      url: `/blog/tpost/${slug}`,
      images: frontmatter.ogImage ? [frontmatter.ogImage] : undefined,
      publishedTime: frontmatter.date,
    },
  };
}
```

Apply the same pattern on the virazh route (it already works, but extract a shared helper). Net result: of 42 posts, ~22 have `canonical: .../blog/...` and ~20 have `canonical: .../virazh/...`. After the fix, both URL variants for a given post will emit the **same** canonical pointing to the chosen variant — Google will treat the other one as a proper duplicate and pass link equity to the canonical.

### P0-2. Two posts canonical → 404
**Location**: `content/blog/xj33umds91-top-5-rossiiskih-crm-dlya-sportivnih-klu/index.mdx:10` and `content/blog/crj6jx9kf1-stat-blizhe-kbolelschikam-i-interesnee-d/index.mdx:12`

**Problem**:
```yaml
# xj33umds91-top-5-rossiiskih-crm-dlya-sportivnih-klu/index.mdx
canonical: "https://digitalburo.tech/virazh/tpost/top5-crm-sport-organizations"

# crj6jx9kf1-stat-blizhe-kbolelschikam-i-interesnee-d/index.mdx
aliases: ["https://digitalburo.tech/virazh/tpost/crj6jx9kf1-hk-admiral-stanovitsya-blizhe-kbolelschi"]
# and canonical (line 10) also points to the hk-admiral variant
```

Both referenced slugs do NOT exist in `generateStaticParams()` (verified: no matching dir under `out/virazh/tpost/`). After the P0-1 fix, the blog variant will emit `canonical=...virazh/tpost/top5-crm-sport-organizations/` — a **dangling canonical to a 404**. Google treats canonical-to-404 as "site doesn't know what's canonical" — will deindex or self-canonicalize.

**Fix** — two options:
1. **Preferred**: fix the frontmatter to point to a real slug. These are Tilda-era vanity slugs that were never ported. Edit the two MDX files:
   ```yaml
   # xj33umds91/index.mdx
   canonical: "https://digitalburo.tech/blog/tpost/xj33umds91-top-5-rossiiskih-crm-dlya-sportivnih-klu"

   # crj6jx9kf1/index.mdx
   canonical: "https://digitalburo.tech/blog/tpost/crj6jx9kf1-stat-blizhe-kbolelschikam-i-interesnee-d"
   aliases: []
   ```
2. **Alternative**: add slug aliases in the content loader and create the pretty-slug routes as additional `generateStaticParams`.

Option 1 is simpler and doesn't leak URL structure; recommend it.

### P0-3. Sitemap lists BOTH canonical and non-canonical URL for every dual-path post
**Location**: `src/app/sitemap.ts:23-36`

**Problem**: Sitemap should only contain canonical URLs. Right now it emits 84 article URLs (42 × 2) — half of which are non-canonical duplicates. Per Google's sitemap guidelines: "You should only include canonical URLs in your sitemap."

```typescript
// Current (wrong):
const posts = getAllPosts().flatMap((p) => [
  { url: `${SITE_URL}/blog/tpost/${p.frontmatter.slug}`, ... },
  { url: `${SITE_URL}/virazh/tpost/${p.frontmatter.slug}`, ... },
]);
```

**Fix** — use the post's declared canonical:
```typescript
const posts = getAllPosts().map<MetadataRoute.Sitemap[number]>((p) => {
  const canonicalPath = p.frontmatter.canonical
    ? p.frontmatter.canonical.replace(SITE_URL, "")
    : `/blog/tpost/${p.frontmatter.slug}`;
  return {
    url: `${SITE_URL}${canonicalPath}`,
    lastModified: new Date(p.frontmatter.date),
    priority: 0.6,
    changeFrequency: "yearly",
  };
});
```

This drops the sitemap from ~108 URLs to ~66 (42 canonicals + 16 statics/podcasts/vacancies) — exactly what we want.

---

## P1 — High priority

### P1-1. No og:image on hub/landing pages
**Location**: `src/app/layout.tsx` (openGraph config), `src/app/page.tsx`, `src/app/virazh/page.tsx`, `src/app/blog/page.tsx`, `src/app/career/page.tsx`, `src/app/podcast/page.tsx`, `src/app/leadership/page.tsx`

**Problem**: verified in `out/*.html` — only article pages (which pull from `frontmatter.ogImage`) ever emit `og:image`. Share-to-Telegram/VK/LinkedIn of the homepage = text card only.

**Fix** — add a site-level fallback in `layout.tsx`:
```typescript
// src/app/layout.tsx
export const metadata: Metadata = {
  ...
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://digitalburo.tech",
    siteName: "Бюро Цифровых Технологий",
    images: [{
      url: "/images/og-default.png",
      width: 1200,
      height: 630,
      alt: "Бюро Цифровых Технологий — Digital для спортивных клубов",
    }],
  },
  ...
};
```
Create `/public/images/og-default.png` (1200×630). Next.js will inherit this into every page that doesn't override `openGraph.images`. Optionally override on `/virazh` with a product-specific image.

### P1-2. One blog post lacks ogImage
**Location**: `content/blog/ks0gxfo571-kak-perevesti-kompaniyu-v-evropu-kakie-z/index.mdx`

**Problem**: only MDX file of 42 without `ogImage:` frontmatter. After P1-1 it will inherit the site-level default — acceptable. Still worth adding an image specific to the post for rich Telegram previews.

**Fix**: either add `ogImage:` pointing to an existing image in `/public/images/blog/...` or rely on site fallback.

### P1-3. Trailing-slash mismatch between sitemap and canonical
**Location**: `next.config.ts:5` (`trailingSlash: true`) + `src/app/sitemap.ts`

**Problem**: Confirmed in build output:
- sitemap.xml: `<loc>https://digitalburo.tech/blog</loc>` (no slash)
- `/blog/index.html` head: `<link rel=canonical href="https://digitalburo.tech/blog/">` (with slash)

Google will usually normalize, but this emits a weak signal (sitemap and canonical should match exactly). Easy fix — make sitemap generate trailing slashes to match:

**Fix**:
```typescript
// src/app/sitemap.ts
const trailing = (p: string) => (p.endsWith("/") ? p : p + "/");

const staticPages: MetadataRoute.Sitemap = [
  { url: `${SITE_URL}/`, ... },  // already has slash
  { url: `${SITE_URL}${trailing("/virazh")}`, ... },
  ...
];

// For posts:
{ url: `${SITE_URL}${trailing(canonicalPath)}`, ... }
```

### P1-4. Article JSON-LD missing `dateModified` and using Organization as author
**Location**: `src/components/blog/PostPage.tsx:24-41`

**Problem**: Article schema has `datePublished` only. Google's Article rich result guidelines recommend `dateModified` (falls back to datePublished if not available). Author as Organization is allowed but Person is preferred for E-E-A-T signals (reviewer bias: Google's 2023+ docs recommend Person where possible).

**Fix** — add dateModified (optionally from a new frontmatter `updated` field, fall back to `date`), and keep Organization author but enrich:
```typescript
const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: frontmatter.title,
  description: frontmatter.description,
  image: frontmatter.ogImage ? absoluteUrl(frontmatter.ogImage) : undefined,
  datePublished: frontmatter.date,
  dateModified: frontmatter.updated ?? frontmatter.date,
  author: frontmatter.author
    ? { "@type": "Person", name: frontmatter.author }
    : {
        "@type": "Organization",
        name: "Бюро Цифровых Технологий",
        url: "https://digitalburo.tech",
      },
  publisher: {
    "@type": "Organization",
    name: "Бюро Цифровых Технологий",
    url: "https://digitalburo.tech",
    logo: {
      "@type": "ImageObject",
      url: "https://digitalburo.tech/images/home/_.jpg",
      width: 600,
      height: 60,
    },
  },
  mainEntityOfPage: absoluteUrl(canonicalPath),
};
```
(Publisher.logo is REQUIRED by Google for Article rich results; currently missing.)

Also — `canonicalPath` in PostPage is derived from `variant` only. After the P0-1 fix the component should instead use `frontmatter.canonical` so that `mainEntityOfPage` matches the link-tag canonical:
```typescript
const canonicalPath = frontmatter.canonical
  ? frontmatter.canonical.replace("https://digitalburo.tech", "")
  : `/${variant}/tpost/${frontmatter.slug}`;
```

### P1-5. Organization schema too thin for Knowledge Graph
**Location**: `src/app/page.tsx:19-29`

**Problem**: Current Organization schema has name/url/logo/email/sameAs only. Missing fields that feed the Knowledge Graph: `description` is there (good), but no `address`, `contactPoint`, `founder`, `foundingDate`, no additional `sameAs` (LinkedIn? VK? YouTube?).

**Fix** (add what's known, skip what isn't):
```typescript
const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Бюро Цифровых Технологий",
  alternateName: ["БЦТ", "Digital Buro"],
  url: "https://digitalburo.tech",
  logo: "https://digitalburo.tech/images/home/_.jpg",
  email: "access@digitalburo.tech",
  sameAs: [
    "https://t.me/digitalburo",
    // add: LinkedIn company page, VK, YouTube if exist
  ],
  description:
    "Digital-агентство для спортивных клубов и федераций. CRM, мобильные приложения, программы лояльности.",
  foundingDate: "2014",  // set to actual
  contactPoint: {
    "@type": "ContactPoint",
    email: "access@digitalburo.tech",
    contactType: "sales",
    areaServed: "RU",
    availableLanguage: ["Russian", "English"],
  },
};
```

Also consider emitting Organization once in `layout.tsx` (so it's on every page) instead of only on `/`. Google currently does not require site-wide Organization but it strengthens entity consolidation.

### P1-6. SoftwareApplication on /virazh missing key fields
**Location**: `src/app/virazh/page.tsx:22-36`

**Problem**: `offers.price: "0"` + `priceCurrency: "RUB"` — Google will validate this as "free product" (misleading). If pricing is on-request, omit `offers.price` OR use `priceSpecification` with `priceType: "NegotiatedPrice"`. Also missing: `aggregateRating` (if you have testimonials, you can derive), `operatingSystem` is an OK comma-separated but schema.org expects URL-like or single value — consider listing as an array.

**Fix**:
```typescript
const productSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "CRM Вираж",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web, iOS, Android",
  description: "...",
  url: "https://digitalburo.tech/virazh",
  publisher: {
    "@type": "Organization",
    name: "Бюро Цифровых Технологий",
    url: "https://digitalburo.tech",
  },
  offers: {
    "@type": "Offer",
    priceCurrency: "RUB",
    priceSpecification: {
      "@type": "PriceSpecification",
      priceCurrency: "RUB",
      description: "По запросу — стоимость зависит от объёма клуба",
    },
    availability: "https://schema.org/InStock",
    url: "https://digitalburo.tech/virazh#contact",
  },
};
```

### P1-7. robots.txt `host` directive uses full URL (wrong format)
**Location**: `src/app/robots.ts:15`

**Problem**: Yandex `Host:` directive expects bare hostname, not URL. Current output:
```
Host: https://digitalburo.tech
```
Should be:
```
Host: digitalburo.tech
```
(Also: `Host:` is deprecated by Yandex as of 2018, but still respected. Low impact but cosmetic.)

**Fix**:
```typescript
return {
  rules: [{ userAgent: "*", allow: "/", disallow: ["/policy"] }],
  sitemap: `${SITE_URL}/sitemap.xml`,
  host: SITE_URL.replace(/^https?:\/\//, ""),
};
```

### P1-8. `Disallow: /policy` blocks crawling but page has noindex meta
**Location**: `src/app/robots.ts:12`, `src/app/policy/page.tsx:9`

**Problem**: Double-negative. Either `noindex` (via meta) OR `Disallow` in robots, not both. If crawler is blocked by `Disallow`, it never sees the `noindex` tag — so the URL can still be indexed if discovered elsewhere (just with "no description available"). Standard fix: remove `Disallow: /policy` and keep `noindex`.

**Fix**:
```typescript
// src/app/robots.ts
return {
  rules: [{ userAgent: "*", allow: "/" }],
  sitemap: `${SITE_URL}/sitemap.xml`,
  host: "digitalburo.tech",
};
```
Page already has `robots: { index: false, follow: false }` — but change `follow: false` → `follow: true` (there's nothing sensitive on /policy, we want Google to follow the footer links out of it):
```typescript
// src/app/policy/page.tsx
robots: { index: false, follow: true },
```

---

## P2 — Medium priority

### P2-1. Policy page canonical is self-referential on a noindex page
**Location**: `src/app/policy/page.tsx:8`

Emitting `alternates: { canonical: "/policy" }` on a `noindex` page doesn't hurt but doesn't help either. Optional: drop canonical on /policy.

### P2-2. Twitter card inheritance is site-default `summary_large_image` but no site-level twitter:image
**Location**: `src/app/layout.tsx:28-30`

Twitter will auto-fall-back to `og:image`, so as long as P1-1 is fixed this works. Verify on twitter card validator post-deploy.

### P2-3. Sitemap lastmod missing on podcast/vacancy URLs
**Location**: `src/app/sitemap.ts:38-48`

Both podcasts and vacancies lack `lastModified`. Google uses lastmod to decide crawl priority. Podcasts/vacancies are timeless — OK to omit. For vacancies add a `date` field to frontmatter (`VacancyFrontmatterSchema` would need an optional `date` field) so freshness signals are correct.

### P2-4. BreadcrumbList schema missing on article pages
**Location**: `src/components/blog/PostPage.tsx`

Not blocking, but breadcrumbs in SERP are a conversion lever. Add to Article pages:
```typescript
const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Главная", item: "https://digitalburo.tech/" },
    { "@type": "ListItem", position: 2, name: variant === "virazh" ? "Вираж" : "Блог",
      item: `https://digitalburo.tech/${variant === "virazh" ? "virazh" : "blog"}` },
    { "@type": "ListItem", position: 3, name: frontmatter.title,
      item: absoluteUrl(canonicalPath) },
  ],
};
```

### P2-5. No WebSite schema with SearchAction
**Location**: `src/app/page.tsx`

Site has no search, so SearchAction might be cosmetic. WebSite schema anyway strengthens entity signals:
```typescript
const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Бюро Цифровых Технологий",
  url: "https://digitalburo.tech",
  inLanguage: "ru-RU",
  publisher: { "@id": "#org" },  // reference Organization via @id
};
```

### P2-6. Meta-refresh redirects have `noindex,follow` which may suppress 301-like behavior
**Location**: `scripts/generate-redirects.mjs:44-47`

**Context**: Google documented in 2023 ([dev docs](https://developers.google.com/search/docs/crawling-indexing/301-redirects#types-of-redirects)) that instant meta-refresh (≤0s) counts as a permanent redirect. But some SEO tests show that if the redirect page itself carries `noindex`, Google occasionally treats it as "intentionally hidden" and may not consolidate signals to the target URL. Recommendation: drop `noindex` on the redirect page, keep `follow`. Since the page has a canonical to the new URL + 0s refresh + JS replace, Google has three strong signals.

**Fix** in `scripts/generate-redirects.mjs`:
```js
<meta name="robots" content="noindex,follow"> ← remove this line
```
Or keep it — both are acceptable. Leaning toward removal for safety on the 10 high-value redirect pages (podcast/vacancy slugs).

### P2-7. `title.template` collides with branded titles
**Location**: `src/app/layout.tsx:16-19` + every page

The template is `"%s — Бюро Цифровых Технологий"`. When a page sets `title: "Блог"` the rendered result is `"Блог — Бюро Цифровых Технологий"` (51 chars — OK). When the title is already long (e.g. an article title of 80 chars), the composed title hits 100+ chars and gets truncated in SERP (~60 char limit).

Audit sample: `"Дети-спортсмены как актив: цифровые платформы и новый подход к тренировкам — Бюро Цифровых Технологий"` = 104 chars. **Truncated in Google SERP.**

**Fix**: allow frontmatter to opt out of the template for long titles. Use `title: { absolute: frontmatter.title }` in `generateMetadata` when the title alone exceeds 55 chars:
```typescript
title: frontmatter.title.length > 55
  ? { absolute: frontmatter.title }
  : frontmatter.title,
```

### P2-8. No `robots: { googleBot: ... }` directive
**Location**: `src/app/layout.tsx`

Optional — but worth adding to hint Google crawler behavior:
```typescript
robots: {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
},
```
`max-image-preview: large` is required for image rich results to show full images in SERP.

### P2-9. RSS feed lacks per-item guid uniqueness check and image/enclosure
**Location**: `scripts/generate-rss.mjs:64-77`

Items include `<guid>` and `<title>` but no `<enclosure>` or `<media:content>`. Readers show a placeholder. Easy fix — add enclosure with `ogImage`:
```js
${p.ogImage ? `<enclosure url="${SITE_URL}${p.ogImage}" type="image/jpeg" length="0"/>` : ""}
```
Also add `<author>` and `<category>` from `tags`.

### P2-10. Missing `hreflang` — RU-only but no explicit declaration
**Location**: `src/app/layout.tsx` (or page-level alternates)

Site is RU-only; `html lang="ru"` + `og:locale=ru_RU` are present. Optional: add explicit `alternates.languages` to each page, which emits `<link rel=alternate hreflang>`:
```typescript
alternates: {
  canonical: "/",
  languages: {
    "ru-RU": "/",
    "x-default": "/",
  },
},
```
Not required for RU-only, but when EN is added later (per `docs/COPY_PLAN.md` Фаза 11) this scaffolding is needed.

---

## P3 — Nice to have

- **Favicons**: only `favicon.ico` (256×256). Add `/apple-touch-icon.png` (180×180), `/icon-192.png`, `/icon-512.png` for PWA manifest. Declare via `icons` in `layout.tsx`.
- **`/rss.xml` discovery**: already linked via `alternates.types` in layout — good. Also add `<link>` in header manually (redundant but explicit). Add `rel="alternate"` + `title="Блог БЦТ"` to rss link.
- **`Sitemap` link from RSS self-ref**: `<atom:link rel="self">` present — good.
- **`humans.txt`**: nice touch for showing team on big sites. Skip for now.
- **`security.txt`**: good practice under `/.well-known/`. Skip.
- **Image filenames**: `IMG_3532.JPG`, `IMG_4012.JPG` — non-descriptive. Rename to topic-aligned slugs for alt-less keyword signal. Low impact.
- **`rel="me"` on social links in footer**: helps with IndieWeb but minor for Google.
- **Structured data for podcast episodes** — `PodcastEpisode` schema with `associatedMedia` (audio url). Currently no audio embed, so moot until audio is added.
- **FAQPage schema** where appropriate (e.g., `/blog/tpost/7xm137vie1-kak-vibrat-crm-...` is a chek-list post — good FAQ candidate).

---

## Page-by-Page Audit

| Page | Title | Desc | Canonical | OG image | Schema | In sitemap |
|------|-------|------|-----------|----------|--------|------------|
| `/` | ✅ (43 ch) | ✅ (151 ch) | ✅ `/` | ❌ | Organization | ✅ |
| `/virazh` | ✅ (28 ch) | ✅ (153 ch) | ✅ `/virazh` | ❌ | SoftwareApplication (offers.price issue) | ✅ |
| `/blog` | ✅ (4 ch) | ✅ (88 ch) | ✅ `/blog` | ❌ | — | ✅ |
| `/career` | ✅ (7 ch) | ✅ (110 ch) | ✅ `/career` | ❌ | — | ✅ |
| `/podcast` | ✅ (43 ch) | ✅ (144 ch) | ✅ `/podcast` | ❌ | — | ✅ |
| `/leadership` | ✅ (9 ch) | ✅ (77 ch) | ✅ `/leadership` | ❌ | — | ✅ |
| `/policy` | ✅ | ✅ | self (noindex) | ❌ | — | ❌ (correct) |
| `/blog/tpost/<42>` | ✅ | ✅ | **bug — self-ref** | ✅ (41/42) | Article (no dateModified, no publisher.logo) | ✅ |
| `/virazh/tpost/<42>` | ✅ | ✅ | **frontmatter — 2 broken** | ✅ (41/42) | Article | ✅ |
| `/podcast/<6>` | ✅ | ✅ | self | ❌ | — | ✅ |
| `/career/<4>` | ✅ | ✅ | self | ❌ | — | ✅ |
| `/tpost/<10>` redirect | — | — | → new URL | — | — | ❌ (correct) |
| `/ru`, `/buro`, `/bureau_en`, `/oldpage` redirect | — | — | → `/` | — | — | ❌ (correct) |

---

## Structured Data Status

| Schema | Status | Location | Issues |
|--------|--------|----------|--------|
| Organization | Present | `/` | thin; missing `foundingDate`, `contactPoint`, richer `sameAs` |
| SoftwareApplication | Present | `/virazh` | `offers.price: "0"` misleading |
| Article | Present | `/blog/tpost/*`, `/virazh/tpost/*` | no `dateModified`, no `publisher.logo`, `mainEntityOfPage` decoupled from canonical |
| BreadcrumbList | **Missing** | — | add to article pages |
| WebSite | **Missing** | — | add to `/` |
| PodcastSeries / PodcastEpisode | **Missing** | `/podcast/*` | — |
| JobPosting | **Missing** | `/career/[slug]` | — valuable for Google for Jobs (ru-Hohlohlohlo); low priority if only 4 vacancies |
| FAQPage | **Missing** | select how-to posts | — |

---

## Sitemap Analysis

- Built: `out/sitemap.xml` emitted, 100 `<loc>` entries total.
- Composition: 6 static + 42×2 posts + 6 podcasts + 4 vacancies = 100 ✓ math checks out.
- Should shrink to ~62 after P0-3 fix (drop non-canonical post duplicates).
- `/policy` correctly excluded.
- `/tpost/<old>` redirect pages correctly NOT in sitemap (good — don't index meta-refresh pages).
- `lastModified` only on posts — consider adding to podcasts/vacancies.
- Trailing-slash normalization needed (P1-3).

---

## Redirect Integrity Check

All 14 redirects emitted to `public/` at build time via `scripts/generate-redirects.mjs`.

| Source (Tilda URL) | Target | Method | Notes |
|---|---|---|---|
| `/tpost/ayz5zzj661-1-iskusstvo-zakaznoi-razrabotki/` | `/podcast/iskusstvo-zakaznoi-razrabotki/` | meta refresh 0s + JS replace + canonical | ✅ correct |
| `/tpost/ndpfff4ll1-2-kak-ustroen-internet/` | `/podcast/kak-ustroen-internet/` | same | ✅ |
| `/tpost/4rgihsday1-3-kak-python-razrabotchik-prevraschaetsy/` | `/podcast/kak-python-razrabotchik-prevraschaetsy/` | same | ✅ |
| `/tpost/lubrbml771-4-pochemu-gospodryadi-peredayut-druzyam/` | `/podcast/pochemu-gospodryadi-peredayut-druzyam/` | same | ✅ |
| `/tpost/tzvjfmakz1-5-snachala-distributsiya-zatem-produkt/` | `/podcast/snachala-distributsiya-zatem-produkt/` | same | ✅ |
| `/tpost/p33fpx4f71-6-kak-vibirayut-yazik-programmirovaniya/` | `/podcast/kak-vibirayut-yazik-programmirovaniya/` | same | ✅ |
| `/tpost/9pyckxd3n1-flutter-razrabotchik/` | `/career/flutter-razrabotchik/` | same | ✅ |
| `/tpost/yo0iei17a1-middle-php-laravel-web-razrabotchik/` | `/career/middle-php-laravel-web-razrabotchik/` | same | ✅ |
| `/tpost/g1vvl19a91-menedzher-po-b2b-prodazham/` | `/career/menedzher-po-b2b-prodazham/` | same | ✅ |
| `/tpost/ji623k2n61-middle-project-manager/` | `/career/middle-project-manager/` | same | ✅ |
| `/ru/` | `/` | same | ✅ |
| `/buro/` | `/` | same | ✅ |
| `/bureau_en/` | `/` | same | ✅ |
| `/oldpage/` | `/` | same | ✅ |

**Verdict**: implementation is correct for GH Pages. See P2-6 re: optional `noindex` removal.

---

## Tilda URL Parity Check

From `docs/COPY_PLAN.md` inventory of old sitemap-feed-*.xml + sitemap.xml:

### Static pages (Tilda sitemap.xml, 5 URLs)
| Old URL | Status | New URL |
|---|---|---|
| `/` | ✅ kept | `/` |
| `/leadership` | ✅ kept | `/leadership` |
| `/career` | ✅ kept | `/career` |
| `/virazh` | ✅ kept | `/virazh` |
| `/blog` | ✅ kept | `/blog` |

### Blog posts (sitemap-feed-707520631191.xml, 42 URLs)
| Old URL pattern | Status |
|---|---|
| `/blog/tpost/<slug>` × 42 | ✅ all 42 render, canonical issue per P0-1 |
| `/virazh/tpost/<slug>` × 13 (aliases) | ✅ all 13 alias URLs render too (and 29 additional ones that weren't aliases — will be soft-duplicate) |

### Podcasts (sitemap-feed-664348139671.xml, 6 URLs)
| Old URL | Status | New URL |
|---|---|---|
| `/tpost/ayz5zzj661-1-...` through `/tpost/p33fpx4f71-6-...` | ✅ 6/6 redirected | `/podcast/<clean-slug>` |

### Vacancies (sitemap-feed-210136015421.xml, 4 URLs)
| Old URL | Status | New URL |
|---|---|---|
| `/tpost/9pyckxd3n1-flutter-razrabotchik` | ✅ | `/career/flutter-razrabotchik` |
| `/tpost/yo0iei17a1-...` | ✅ | `/career/middle-php-laravel-web-razrabotchik` |
| `/tpost/g1vvl19a91-...` | ✅ | `/career/menedzher-po-b2b-prodazham` |
| `/tpost/ji623k2n61-...` | ✅ | `/career/middle-project-manager` |

### Special URLs (not in sitemap)
| Old URL | Status | Notes |
|---|---|---|
| `/policy` | ✅ kept (noindex) | — |
| `/ru` | ✅ redirect → `/` | — |
| `/buro` | ✅ redirect → `/` | — |
| `/bureau_en` | ✅ redirect → `/` | — |
| `/oldpage` | ✅ redirect → `/` | — |
| `pageXXXX.html` legacy Tilda | ❓ unknown | `docs/COPY_PLAN.md` flagged "скорее всего уже мёртвые" — check Google Search Console "Pages" > "Not indexed" report after deploy; add redirects if any still receive traffic |

**Verdict**: All known Tilda URLs covered. The one outstanding unknown is whether any `pageXXXX.html` URLs exist in the wild with inbound links. This is a GSC-only question post-deploy (P3 follow-up).

### Known broken canonicals pointing to slugs that never existed

| Broken canonical in frontmatter | Post file |
|---|---|
| `/virazh/tpost/top5-crm-sport-organizations` | `content/blog/xj33umds91-top-5-rossiiskih-crm-dlya-sportivnih-klu/index.mdx` |
| `/virazh/tpost/crj6jx9kf1-hk-admiral-stanovitsya-blizhe-kbolelschi` | `content/blog/crj6jx9kf1-stat-blizhe-kbolelschikam-i-interesnee-d/index.mdx` |

These slugs show up in the Tilda migration as "canonical alias Tilda had set" but were never exposed as actual routes. Fix via P0-2.

---

## Search Console Prep (post-deploy checklist)

Before GSC submission:
1. **DNS propagation**: confirm `digitalburo.tech` points to GH Pages A/AAAA records, CNAME for `www`. `out/CNAME` file exists (verified).
2. **HTTPS enforced**: GH Pages auto-issues; verify `https://digitalburo.tech` responds 200 and HTTP → HTTPS redirects.
3. **Verification meta tag**: add to `src/app/layout.tsx` metadata:
   ```typescript
   verification: {
     google: "GOOGLE_VERIFICATION_CODE",
     yandex: "YANDEX_VERIFICATION_CODE",  // Yandex.Webmaster matters for RU
   },
   ```
   Or use DNS TXT record verification (preferred — no HTML change needed).

In GSC (and Yandex.Webmaster):
1. **Add property** `https://digitalburo.tech/` (URL prefix).
2. **Verify** via DNS TXT.
3. **Submit sitemap** `https://digitalburo.tech/sitemap.xml`.
4. **Request indexing** on key pages: `/`, `/virazh`, `/blog`, top 5 posts by current Tilda traffic.
5. **Change of address** tool: NOT needed (domain unchanged). But if any posts move from `/blog/tpost/X` to `/virazh/tpost/X` canonical after P0-1 fix, GSC will reprocess via the updated sitemap.
6. **Monitor "Pages" > "Not indexed"** for first 2 weeks:
   - `Duplicate, Google chose different canonical` — expected for ~40 non-canonical duplicates. Should resolve after P0-3 sitemap fix.
   - `Alternate page with proper canonical tag` — good, means P0-1 worked.
   - `Soft 404` — should be zero; if present, means the dangling canonical in P0-2 is biting.
7. **Yandex.Webmaster**: add site, confirm `Host:` directive in robots.txt. Submit `/rss.xml` as additional feed.
8. **Monitor Core Web Vitals** at `PageSpeed Insights`. Static export should score high; watch LCP on `/blog/tpost/*` (hero image via next/image unoptimized + priority — should be fine).

---

## Quick Wins (ordered by effort)

1. **5 min**: fix 2 broken canonicals in MDX frontmatter (P0-2).
2. **5 min**: drop `Disallow: /policy` from robots.ts, change policy `follow: false` → `follow: true` (P1-8).
3. **10 min**: fix `Host:` directive format (P1-7).
4. **15 min**: add site-level `og:image` fallback in layout.tsx + create default OG PNG (P1-1).
5. **20 min**: make `blog/tpost/[slug]` honor `frontmatter.canonical` (P0-1). Biggest SEO win.
6. **20 min**: switch sitemap to emit canonical URLs only + trailing slashes (P0-3 + P1-3).
7. **30 min**: enrich Article + Organization JSON-LD (P1-4, P1-5).
8. **1 hr**: add BreadcrumbList, WebSite schemas (P2-4, P2-5).

---

## For Next Agent (CMO)

**Handoff notes**:

1. **Don't launch before P0-1, P0-2, P0-3 are fixed.** Canonical war + dangling canonicals will cause GSC indexing churn for weeks.
2. **After P0 fixes, push a new sitemap and request re-crawl in GSC**. Google usually re-verifies canonicals within 3-7 days for a known domain.
3. **The brand term "Бюро Цифровых Технологий"** is the anchor in all titles. It's 28 chars alone — eats most of SERP title budget. Consider shortening the `titleTemplate` to `"%s | БЦТ"` for article pages where the article title is long (see P2-7).
4. **The `/virazh` product page** is the highest-intent page (prospective-customer CRM buyers). It has thin Open Graph (no image) and a weak SoftwareApplication schema. After P1-1 and P1-6 fixes, this page should become a conversion workhorse.
5. **42 blog posts × 2 URLs each** means 84 URLs in current sitemap. After canonical fix, ~42 will de-index. This is EXPECTED and HEALTHY — GSC will show a drop in "Indexed pages" from ~108 to ~66, then stabilize. Set expectations with leadership before panic.
6. **RSS feed is live at `/rss.xml`** — good for both syndication and as a freshness signal. Telegram channels, Yandex Zen, and some RU-specific readers (e.g., Inoreader, Feedly) will pick it up. Consider linking it in the footer.
7. **No analytics integrated yet** — per `docs/COPY_PLAN.md` Phase 5, GA4 + Yandex.Metrika planned but not implemented. CMO should block launch on at least Yandex.Metrika (RU SEO needs it for Яндекс Поиск signals).
8. **Legacy `/tpost/pageXXXX.html`** URLs from Tilda may still be in the wild. Monitor GSC "Not indexed > Not found (404)" for first 30 days.

