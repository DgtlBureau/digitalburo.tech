# Schema Markup Plan — digitalburo.tech
Date: 2026-04-17
Author: SEO Specialist agent

## TL;DR

1. **JobPosting (P0)** — 4 vacancies at `/career/[slug]` are the single biggest rich-result win on the site. Google's "Jobs" experience pulls directly from JobPosting and bypasses the normal SERP. Effort is low; data is already in MDX.
2. **BreadcrumbList (P0)** — cheap, site-wide. Unlocks the breadcrumb trail above the blue link on mobile SERPs for 50+ detail pages (blog, virazh/tpost, career, podcast).
3. **WebSite + SearchAction (P1)** — tiny one-time payload on `/` that makes the sitelinks search box eligible. Even without real search, Google indexes search URLs; we can point to `/blog?q=` (or skip the action if we don't want fake results).
4. **PodcastSeries / PodcastEpisode (P2)** — no audio today, so schema is advisory; recommend deferring to `BlogPosting` with `podcastSeries` cross-link once MP3s exist. Until then use Article-like markup already in place.
5. **Person (Виталий Зарубин) (P2)** — improves Knowledge Panel / author E-E-A-T signals, especially for the blog where all 42 posts currently attribute to `Organization`. Add on `/leadership` and reference from `author` field on Articles.

Everything else (FAQPage, Service, LocalBusiness) is P3 — either not-yet-built content or not applicable to a remote-first agency.

---

## Priority list

| Priority | Schema | Page(s) | Effort | SERP feature unlocked |
|----------|--------|---------|--------|------------------------|
| P0 | JobPosting | `/career/[slug]` (4 pages) | S | Google Jobs rich result |
| P0 | BreadcrumbList | blog post, virazh/tpost, career/[slug], podcast/[slug] | S | Breadcrumb trail in SERP |
| P1 | WebSite + SearchAction | `/` | XS | Sitelinks searchbox |
| P1 | ItemList / CollectionPage | `/blog`, `/podcast`, `/career` | S | Carousel eligibility, topical clustering |
| P2 | Person (Виталий Зарубин) | `/leadership`, referenced from Article `author` | S | Author Knowledge Panel, E-E-A-T |
| P2 | AboutPage | `/leadership` (wrap existing content) | XS | Semantic page typing |
| P2 | PodcastSeries / PodcastEpisode | `/podcast`, `/podcast/[slug]` | S | Podcast result (needs audio to unlock) |
| P3 | Keep SoftwareApplication + enrich with aggregateRating | `/virazh` | S | Review stars — only with real reviews |
| P3 | FAQPage | `/virazh/arenas` (planned) | S | FAQ accordion in SERP |
| P3 | Service | `/virazh/arenas` (planned) | S | Service pack |
| P3 | LocalBusiness / ProfessionalService | skip (remote-first) | — | — |
| P3 | ContactPage | if `/contact` is built | XS | Semantic page typing |

Legend: XS = <15 min, S = <1 hour, M = half-day.

---

## Schema specs

### 1. JobPosting (P0)

**Where**: `src/app/career/[slug]/page.tsx` — inject inside the page component, above the `<main>` return.

**Why**: Vacancies are the highest-intent, lowest-competition pages on the site. JobPosting is a Google-supported rich result with its own dedicated "Jobs" experience. Without the markup these 4 pages effectively don't compete in job search.

```jsonld
{
  "@context": "https://schema.org",
  "@type": "JobPosting",
  "title": "Менеджер по B2B Продажам",
  "description": "<HTML-escaped full vacancy body — must be HTML, not Markdown>",
  "identifier": {
    "@type": "PropertyValue",
    "name": "Бюро Цифровых Технологий",
    "value": "g1vvl19a91-menedzher-po-b2b-prodazham"
  },
  "datePosted": "2023-12-14",
  "validThrough": "2026-12-31",
  "employmentType": "FULL_TIME",
  "hiringOrganization": {
    "@type": "Organization",
    "name": "Бюро Цифровых Технологий",
    "sameAs": "https://digitalburo.tech",
    "logo": "https://digitalburo.tech/images/home/_.jpg"
  },
  "jobLocationType": "TELECOMMUTE",
  "applicantLocationRequirements": {
    "@type": "Country",
    "name": "Russia"
  },
  "directApply": false,
  "applicantContactPoint": {
    "@type": "ContactPoint",
    "email": "access@digitalburo.tech",
    "url": "https://t.me/digitalburo"
  },
  "baseSalary": {
    "@type": "MonetaryAmount",
    "currency": "RUB",
    "value": {
      "@type": "QuantitativeValue",
      "value": "[TBD]",
      "unitText": "MONTH"
    }
  }
}
```

**Data sources**:
- `title`, `description`, `slug` → `content/vacancies/*.mdx` frontmatter + body
- `datePosted` → trailing date at end of each vacancy MDX (e.g. `2023-12-14` in B2B Sales). If missing, use file mtime.
- `hiringOrganization` → shared `organizationData.ts` (see Schema dependencies)
- `validThrough` → **invented; mark as [TBD]**. Google requires this — recommend "current MDX date + 180 days" as build-time calc.
- `baseSalary` → **NOT in MDX**. Either (a) add to frontmatter schema as `salaryMin`/`salaryMax`/`salaryCurrency` and fill in; or (b) omit the field entirely (Google will show a warning but still index).
- `employmentType` → all current vacancies are hybrid/remote full-time; hardcode `FULL_TIME` (or add to frontmatter).
- `jobLocationType: TELECOMMUTE` + `applicantLocationRequirements: Country Russia` — BCT is remote-first per vacancy MDX ("Дистанционный формат работы").

**Gotchas**:
- `description` must be HTML. Render the MDX to HTML at build time (server component → renderToStaticMarkup, or a small `mdxToHtml` helper) before JSON.stringify. Plain text loses formatting and hurts the rich result.
- `validThrough` must be in the future; stale vacancies get dropped. Add a content policy: update validThrough every 90 days or auto-compute from `date + 180d`.
- Do NOT use `JobLocation` with a physical address unless БЦТ has an office. Using TELECOMMUTE is the correct shape for remote roles in Google's 2023+ guidelines.
- If multiple postings for the same role exist across sites (hh.ru, Habr Career), set `identifier.value` consistently so Google can dedupe.

---

### 2. BreadcrumbList (P0)

**Where**:
- `src/components/blog/PostPage.tsx` — both `/blog/tpost/[slug]` and `/virazh/tpost/[slug]` (same component, different `variant`)
- `src/app/career/[slug]/page.tsx`
- `src/app/podcast/[slug]/page.tsx`

**Why**: Breadcrumbs render in SERP above the blue link on mobile and replace the raw URL on desktop. Nearly zero cost; compounding visual uplift across 50+ detail pages.

```jsonld
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Главная",
      "item": "https://digitalburo.tech/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Блог",
      "item": "https://digitalburo.tech/blog"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "CRM для спортивного клуба: зачем и какую выбрать",
      "item": "https://digitalburo.tech/blog/tpost/abc123-crm-dlya-sportivnogo-kluba"
    }
  ]
}
```

**Per-variant trail**:
- Blog post: Главная → Блог → {post.title}
- Virazh post: Главная → Вираж → {post.title}
- Vacancy: Главная → Карьера → {vacancy.title}
- Podcast episode: Главная → Подкаст → {ep.title}

**Data sources**:
- Breadcrumb names from hardcoded section labels (see `src/lib/nav.ts`)
- URLs from `absoluteUrl()` in `src/lib/urls.ts`
- Last item from the current page's frontmatter

**Gotchas**:
- The last item's `item` URL is optional (Google auto-fills with canonical) but we should include it for consistency.
- Do NOT add breadcrumbs on the homepage — it's the root and Google ignores single-item lists.
- For Virazh-variant blog posts, the trail should be `Главная → Вираж → {title}` (not `Вираж → Статьи → {title}`) because there's no intermediate index page under `/virazh/`.

---

### 3. WebSite + SearchAction (P1)

**Where**: `src/app/page.tsx` — add a second `<JsonLd>` alongside the existing Organization schema, or combine into a `@graph`.

**Why**: Unlocks Sitelinks Searchbox in Google. Even without real search functionality, we can point at `/blog?q=` — the blog already loads all 42 posts client-side and we could add a basic filter, or just omit SearchAction and stick to core WebSite typing.

```jsonld
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://digitalburo.tech/#website",
  "url": "https://digitalburo.tech/",
  "name": "Бюро Цифровых Технологий",
  "alternateName": "БЦТ",
  "inLanguage": "ru-RU",
  "publisher": { "@id": "https://digitalburo.tech/#organization" },
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://digitalburo.tech/blog?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```

**Data sources**:
- Hardcoded constants; move to `organizationData.ts`.

**Gotchas**:
- If `/blog?q=` does not actually filter, **drop the `potentialAction`** — Google penalizes bogus SearchAction targets. The plain WebSite block still earns the ID-ref for publisher relations.
- Set `@id` so other schemas (Article, JobPosting) can reference via `{ "@id": "..." }` instead of re-declaring the publisher.

---

### 4. ItemList / CollectionPage (P1)

**Where**:
- `src/app/blog/page.tsx` — `CollectionPage` wrapping `ItemList` of posts
- `src/app/podcast/page.tsx` — same pattern
- `src/app/career/page.tsx` — same pattern

**Why**: Signals "this is an index of items" to Google. Combined with good internal linking, helps clustered indexing (all 42 blog posts crawled from one seed). Not a rich result on its own but reinforces topical authority.

```jsonld
{
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": "https://digitalburo.tech/blog#collection",
  "url": "https://digitalburo.tech/blog",
  "name": "Блог",
  "description": "Статьи Бюро Цифровых Технологий о спорте, технологиях, CRM-системах для клубов и маркетинге.",
  "isPartOf": { "@id": "https://digitalburo.tech/#website" },
  "mainEntity": {
    "@type": "ItemList",
    "numberOfItems": 42,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "url": "https://digitalburo.tech/blog/tpost/abc-slug",
        "name": "Post title here"
      }
      /* ...repeat for all posts */
    ]
  }
}
```

**Data sources**:
- `getAllPosts()` / `getAllPodcasts()` / `getAllVacancies()` from `src/lib/content/`
- Canonical URLs via existing `absoluteUrl()` helper

**Gotchas**:
- `numberOfItems` must match the array length exactly; otherwise Google may flag the markup as inconsistent.
- Truncating `itemListElement` to 10 items is fine but set `numberOfItems` to the full count — useful when blog grows past 100.
- For `/podcast`, use `@type: "CollectionPage"` now; once audio exists, swap to `PodcastSeries` (see spec 7).

---

### 5. Person — Виталий Зарубин (P2)

**Where**:
- Standalone block on `src/app/leadership/page.tsx`
- Referenced by `@id` from `author` field in `PostPage.tsx` Article schema (replace current `author: Organization`)

**Why**: The `/leadership` page is literally Vitaly's manifesto; Google currently has no entity binding between "Виталий Зарубин" (mentioned in testimonials, podcast intros, and the manifesto page) and a Person node. With a Person schema + `sameAs` links, Google can build author Knowledge Panel signals and attribute E-E-A-T to all 42 posts.

```jsonld
{
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://digitalburo.tech/#vitaly-zarubin",
  "name": "Виталий Зарубин",
  "jobTitle": "Генеральный директор, основатель",
  "worksFor": { "@id": "https://digitalburo.tech/#organization" },
  "url": "https://digitalburo.tech/leadership",
  "sameAs": [
    "https://t.me/digitalburo",
    "[TBD — LinkedIn URL]",
    "[TBD — personal Telegram vs company]"
  ],
  "knowsAbout": [
    "Спортивный маркетинг",
    "CRM-системы",
    "Программы лояльности",
    "Заказная разработка"
  ],
  "email": "access@digitalburo.tech"
}
```

**Data sources**:
- `jobTitle` → `content/pages/leadership.mdx` line 27 ("Генеральный директор БЦТ")
- `name` → `content/pages/leadership.mdx` line 25
- `sameAs` → need to confirm from user: does Vitaly have a public LinkedIn? Is `t.me/digitalburo` the company channel or personal? Mark both as `[TBD]`.
- `knowsAbout` → inferred from podcast + blog topic clusters.

**Gotchas**:
- Don't add `image` unless the photo is on-site and crawlable (the Tilda-hosted photo URLs in MDX won't qualify).
- If the author wants to be on podcasts as a distinct node, keep the Person `@id` stable and reuse it from PodcastEpisode `actor`/`author` later.

---

### 6. AboutPage wrapper (P2)

**Where**: `src/app/leadership/page.tsx` — wrap the Person schema in an AboutPage context.

**Why**: Pure semantic typing — tells Google "this page is about the organization's leadership," not a blog post or product.

```jsonld
{
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": "https://digitalburo.tech/leadership#about",
  "url": "https://digitalburo.tech/leadership",
  "name": "Манифест — Бюро Цифровых Технологий",
  "isPartOf": { "@id": "https://digitalburo.tech/#website" },
  "about": { "@id": "https://digitalburo.tech/#organization" },
  "mainEntity": { "@id": "https://digitalburo.tech/#vitaly-zarubin" }
}
```

**Data sources**: Hardcoded + refs to Organization and Person.

**Gotchas**: Pair with Person schema (spec 5) in the same `@graph` array.

---

### 7. PodcastSeries + PodcastEpisode (P2 — conditional)

**Where**:
- `PodcastSeries` on `src/app/podcast/page.tsx`
- `PodcastEpisode` on `src/app/podcast/[slug]/page.tsx`

**Why**: `PodcastSeries` and `PodcastEpisode` are the canonical types. BUT: **Google's Podcast rich result requires an `associatedMedia.contentUrl` that points to an actual audio file (MP3/MP4/AAC)**. Without that, the page won't be eligible for the podcast carousel.

**Recommendation**:
- **Today** (no audio files): use `CollectionPage` + `Article` (for episodes). Markup is valid schema.org but not eligible for the podcast rich result. Still useful for semantic clarity.
- **When MP3s ship**: upgrade each episode page to `PodcastEpisode` with `associatedMedia`, and the index page to `PodcastSeries`.

**PodcastSeries (deferred until audio exists)**:

```jsonld
{
  "@context": "https://schema.org",
  "@type": "PodcastSeries",
  "@id": "https://digitalburo.tech/podcast#series",
  "name": "Искусство заказной разработки",
  "description": "Подкаст Бюро Цифровых Технологий о том, как устроена заказная IT-разработка, где ошибаются заказчики и как выбирают технологии.",
  "url": "https://digitalburo.tech/podcast",
  "inLanguage": "ru-RU",
  "publisher": { "@id": "https://digitalburo.tech/#organization" },
  "webFeed": "[TBD — RSS feed URL once syndicated]"
}
```

**PodcastEpisode (deferred)**:

```jsonld
{
  "@context": "https://schema.org",
  "@type": "PodcastEpisode",
  "url": "https://digitalburo.tech/podcast/1-iskusstvo-zakaznoi-razrabotki",
  "name": "Искусство заказной разработки",
  "episodeNumber": 1,
  "partOfSeries": { "@id": "https://digitalburo.tech/podcast#series" },
  "associatedMedia": {
    "@type": "MediaObject",
    "contentUrl": "[TBD — URL to MP3]",
    "encodingFormat": "audio/mpeg"
  },
  "datePublished": "[TBD]",
  "description": "..."
}
```

**Today's interim (text-only) — use Article on each episode page**:

```jsonld
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Искусство заказной разработки",
  "author": { "@id": "https://digitalburo.tech/#vitaly-zarubin" },
  "publisher": { "@id": "https://digitalburo.tech/#organization" },
  "datePublished": "[TBD — no date in podcast MDX]",
  "mainEntityOfPage": "https://digitalburo.tech/podcast/1-iskusstvo-zakaznoi-razrabotki",
  "isPartOf": { "@id": "https://digitalburo.tech/podcast#series" }
}
```

**Data sources**:
- Title + description → `content/podcast/*.mdx` frontmatter
- `episodeNumber` → already parsed in `src/lib/content/podcasts.ts` via `parseEpisodeNumber`
- `datePublished` → **not in frontmatter** — either add to schema (`PodcastFrontmatterSchema`) or fall back to file mtime

**Gotchas**:
- Do not fabricate `contentUrl` — Google will drop the schema and may flag the domain.
- The `PodcastFrontmatterSchema` in `types.ts` doesn't have a `date` field; needs extension.

---

### 8. Virazh: keep SoftwareApplication, enrich rather than switch to Product (P3)

**Where**: `src/app/virazh/page.tsx` (already in place)

**Recommendation**: **Keep SoftwareApplication.** Do NOT switch to Product.

**Rationale**:
- `SoftwareApplication` is the more specific type for SaaS/CRM and triggers the software-specific rich result card (rating, price, OS, category).
- `Product` with `offers`+`aggregateRating` triggers review stars in commerce SERPs, but BCT doesn't have public user reviews at scale — inventing `aggregateRating.reviewCount: 1` would be a manual-action risk.
- You can still add `aggregateRating` to `SoftwareApplication` when real data exists (e.g., a G2/Capterra import).

**Enrichment to add**:

```jsonld
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": "https://digitalburo.tech/virazh#app",
  "name": "CRM Вираж",
  "applicationCategory": "BusinessApplication",
  "applicationSubCategory": "CRM",
  "operatingSystem": "Web, iOS, Android",
  "description": "CRM-платформа для спортивных клубов — управление болельщиками, билетами, программой лояльности, предиктивная аналитика.",
  "inLanguage": "ru-RU",
  "featureList": [
    "Модуль коммуникаций",
    "Модуль транзакций",
    "Мобильное приложение",
    "Интегрированный виджет билетной системы",
    "Email/Push маркетинговые кампании",
    "Модуль предиктивной аналитики",
    "Программа лояльности",
    "AI-ассистент руководителя"
  ],
  "offers": {
    "@type": "Offer",
    "priceCurrency": "RUB",
    "price": "0",
    "availability": "https://schema.org/InStock",
    "priceSpecification": {
      "@type": "PriceSpecification",
      "priceCurrency": "RUB",
      "valueAddedTaxIncluded": true,
      "description": "Стоимость по запросу"
    },
    "url": "https://digitalburo.tech/virazh#contact"
  },
  "provider": { "@id": "https://digitalburo.tech/#organization" },
  "audience": {
    "@type": "BusinessAudience",
    "audienceType": "Спортивные клубы, федерации, стадионы"
  }
}
```

**Data sources**:
- `featureList` → already in `src/lib/virazhData.ts` as `virazhEcosystem`
- Clients (ХК Торпедо, ХК Адмирал, ПФК Крылья Советов) → belongs in Organization `brand` / `subjectOf`, not here

**Gotchas**:
- `price: "0"` without an offer is a Google warning. Either (a) add a real starting price once available, (b) drop `offers` entirely, or (c) use `price: "0"` with `priceSpecification.description` explaining "по запросу" as above. Option (c) is the least bad.
- Do NOT add `aggregateRating` without at least 3 independently-sourced reviews.

---

### 9. FAQPage for /virazh/arenas (P3 — planned page)

**Where**: `src/app/virazh/arenas/page.tsx` (not yet built)

**Why**: FAQ rich results dominate vertical space in SERP and are perfect for evaluation-stage arena prospects.

```jsonld
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Подходит ли платформа для арены без собственной билетной системы?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Да. Вираж интегрируется с Kassir.ru, Ticketland, Яндекс.Афишей и собственной билетной системой через API."
      }
    },
    {
      "@type": "Question",
      "name": "Сколько времени занимает внедрение?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "От 6 до 12 недель в зависимости от наличия исторических данных о посетителях и количества интеграций."
      }
    },
    {
      "@type": "Question",
      "name": "Можно ли использовать платформу для некоммерческих мероприятий?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Да. В Вираже реализованы гибкие механики лояльности и приглашений без денежной компоненты."
      }
    },
    {
      "@type": "Question",
      "name": "Где хранятся данные болельщиков?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "В защищённом облаке на территории РФ, в соответствии с 152-ФЗ «О персональных данных»."
      }
    },
    {
      "@type": "Question",
      "name": "Как считается стоимость?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Абонентская плата + опционально процент от оборота билетной выручки. Финальный расчёт — по запросу."
      }
    }
  ]
}
```

**Data sources**:
- **ALL question/answer pairs above are [TBD]** — placeholder copy. Must be replaced with real, page-visible FAQ content before shipping (Google requires the Q&A text to appear on-page word-for-word).

**Gotchas**:
- As of 2023, Google restricts FAQ rich results to authoritative government and health sites for most queries. B2B SaaS may still show but expect inconsistent rendering. Still worth adding for semantic markup even without rich result.
- Every answer must match visible HTML exactly.

---

### 10. Service for /virazh/arenas (P3 — planned)

**Where**: `src/app/virazh/arenas/page.tsx`

**Why**: Signals "we provide a platform-as-a-service for arenas." Complements SoftwareApplication on `/virazh` (product) with Service (deliverable/engagement).

```jsonld
{
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Arena management platform",
  "name": "Платформа для управления спортивной ареной",
  "provider": { "@id": "https://digitalburo.tech/#organization" },
  "areaServed": {
    "@type": "Country",
    "name": "Russia"
  },
  "audience": {
    "@type": "BusinessAudience",
    "audienceType": "Стадионы, ледовые арены, многофункциональные комплексы"
  },
  "offers": {
    "@type": "Offer",
    "priceCurrency": "RUB",
    "price": "0",
    "priceSpecification": {
      "@type": "PriceSpecification",
      "description": "По запросу"
    }
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Модули платформы",
    "itemListElement": [
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Билетный модуль" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Кейтеринг и F&B" } },
      { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Программа лояльности арены" } }
    ]
  }
}
```

**Data sources**: All placeholder content [TBD] — replace with actual copy once `/virazh/arenas` is built.

**Gotchas**:
- Service + SoftwareApplication can coexist on different URLs referring to the same offering — that's fine. Don't duplicate both on one page.
- `hasOfferCatalog` items should match the visible module list on the page.

---

### 11. LocalBusiness / ProfessionalService — SKIP

**Where**: N/A

**Why skip**: BCT is remote-first. The vacancies explicitly say "Дистанционный формат работы." There's no public office address, no hours of operation, no walk-in clientele. Adding `LocalBusiness` with a fake address is a manual-action risk.

**If this changes**: If BCT registers a physical office (e.g., a Moscow coworking anchor), add `ProfessionalService` (not `LocalBusiness`, which is for consumer-facing retail) to Organization. Needed fields: `address` (PostalAddress), `telephone`, `openingHoursSpecification`, `priceRange` ("$$$").

---

### 12. ContactPage — future `/contact`

**Where**: `src/app/contact/page.tsx` if built.

**Why**: Semantic typing for the contact page; pairs with `ContactPoint` inside Organization.

```jsonld
{
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "url": "https://digitalburo.tech/contact",
  "name": "Контакты",
  "mainEntity": {
    "@id": "https://digitalburo.tech/#organization"
  }
}
```

Not urgent; only if/when the page is created.

---

## Schema dependencies

Schemas reference each other via `@id`. Centralize the shared nodes:

```
Organization (home)
  └── publisher-of → Article
  └── hiringOrganization-of → JobPosting
  └── provider-of → SoftwareApplication, Service
  └── about-of → AboutPage
  └── publisher-of → PodcastSeries
  └── publisher-of → WebSite

Person (Виталий Зарубин)
  └── worksFor → Organization
  └── author-of → Article (when migrated from Organization author)
  └── mainEntity-of → AboutPage

WebSite
  └── publisher → Organization
  └── isPartOf-target-of → CollectionPage, AboutPage

Article / JobPosting / PodcastEpisode
  └── have BreadcrumbList siblings on the same page
```

### Recommended single source of truth: `src/lib/organizationData.ts`

Create a new file with stable schema fragments reused everywhere:

```ts
// src/lib/organizationData.ts
export const SITE_URL = "https://digitalburo.tech";

export const organizationNode = {
  "@type": "Organization",
  "@id": `${SITE_URL}/#organization`,
  name: "Бюро Цифровых Технологий",
  alternateName: "БЦТ",
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/images/home/_.jpg`,
  email: "access@digitalburo.tech",
  sameAs: ["https://t.me/digitalburo"],
  description:
    "Digital-агентство для спортивных клубов и федераций. CRM, мобильные приложения, программы лояльности.",
} as const;

export const organizationRef = { "@id": `${SITE_URL}/#organization` };

export const personVitalyNode = {
  "@type": "Person",
  "@id": `${SITE_URL}/#vitaly-zarubin`,
  name: "Виталий Зарубин",
  jobTitle: "Генеральный директор, основатель",
  worksFor: organizationRef,
  url: `${SITE_URL}/leadership`,
  sameAs: [
    "https://t.me/digitalburo",
    // "[TBD] LinkedIn URL",
  ],
} as const;

export const personVitalyRef = { "@id": `${SITE_URL}/#vitaly-zarubin` };

export const websiteNode = {
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: `${SITE_URL}/`,
  name: "Бюро Цифровых Технологий",
  inLanguage: "ru-RU",
  publisher: organizationRef,
} as const;
```

Then each page imports the ref and composes a `@graph`:

```ts
import { organizationNode, websiteNode } from "@/lib/organizationData";

const homeGraph = {
  "@context": "https://schema.org",
  "@graph": [organizationNode, websiteNode],
};
// <JsonLd data={homeGraph} />
```

This approach:
1. Removes duplication (home + virazh + blog each re-declare publisher today)
2. Lets Google reconcile entities via shared `@id`
3. Makes updating the logo/email/sameAs a single-file change
4. Scales cleanly when Person/Organization needs new fields (e.g., VATID, NAICS)

---

## Implementation order (recommended)

1. **Build `src/lib/organizationData.ts`** (foundation; 15 min)
2. **Ship JobPosting on `/career/[slug]`** (P0; biggest SERP win; 1h incl. MDX→HTML conversion for `description`)
3. **Ship BreadcrumbList everywhere** (P0; 45 min as a shared helper component `<BreadcrumbsJsonLd />`)
4. **Refactor existing Organization + Article schemas to use `@id` refs** from step 1 (30 min; zero user-facing change)
5. **Add WebSite node on home** (10 min; drop SearchAction if blog search isn't real)
6. **Add Person + AboutPage on `/leadership`** (30 min; needs sameAs confirmation from user)
7. **Enrich SoftwareApplication on `/virazh`** with featureList + provider ref (15 min)
8. **CollectionPage + ItemList on `/blog`, `/podcast`, `/career`** (30 min)
9. **Defer PodcastSeries/PodcastEpisode** until MP3s exist
10. **Defer FAQPage + Service** until `/virazh/arenas` ships

---

## Validation checklist

Before merging any schema changes, validate each page with:
- [ ] Google Rich Results Test (https://search.google.com/test/rich-results) — no warnings for the targeted result type
- [ ] Schema.org Validator (https://validator.schema.org) — zero errors, warnings acceptable
- [ ] View-source: `<script type="application/ld+json">` appears before closing `</body>` and contains escaped `\u003c` instead of literal `<`
- [ ] Static export: `pnpm build` produces the JSON-LD in the static HTML (open `out/career/g1vvl19a91-menedzher-po-b2b-prodazham/index.html` and grep for `JobPosting`)
- [ ] No `[TBD]` strings in production output — fail build if found (add a postbuild grep)

---

## Open questions for human

1. **Vitaly's LinkedIn URL** — needed for `Person.sameAs`. Company Telegram (`t.me/digitalburo`) vs personal — is there a separate one?
2. **Salary ranges for JobPosting** — we can ship without, but Google will flag. Acceptable to ship without, or add ranges to vacancy frontmatter?
3. **`validThrough` policy for vacancies** — auto-compute (date + 180d) or manual per-vacancy field?
4. **Sitelinks SearchAction** — do we want to implement real search on `/blog?q=`? If not, drop the SearchAction node.
5. **Podcast audio files** — when (if) will MP3s be hosted? Affects spec 7 timing.
6. **aggregateRating for Virazh** — are there public reviews/case studies we can cite (G2, Capterra, клубная публикация)?
