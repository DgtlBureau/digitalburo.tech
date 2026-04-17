# COPY_PLAN — Клонирование digitalburo.tech с Tilda в Next.js

**Дата:** 2026-04-16
**Цель:** перенести текущий сайт `digitalburo.tech` (Tilda) в Next.js в этом репо, сохранив 100% контента и URL. Редизайн/Virazh-оверхол — отдельный этап после клона.

---

## Что уже вытащено (в `migration/`)

```
migration/
├── static/          4 страницы × .mdx   Главная, Манифест (/leadership), Карьера, Вираж
├── podcasts/        6 эпизодов × .mdx   /tpost/... (серия «Искусство заказной разработки» 1–6)
├── vacancies/       4 вакансии × .mdx   Flutter, PHP Laravel, B2B Sales, Middle PM
├── blog/
│   ├── posts/       42 статьи × index.mdx  (из предыдущей миграции)
│   └── images/      63 MB, 90+ картинок
├── images/          Картинки со static/: home (117), career (22), leadership (6), virazh (35)
├── raw-html/        14 × .html    сырой HTML (для ре-парсинга при правках)
├── scrape.py        скрипт извлечения /tpost/... (podcasts + vacancies)
├── extract_static.py скрипт Tilda-aware для статических страниц
├── manifest.json
└── static-manifest.json
```

**Итого на диске:** 79 MB, 241 картинка, 56 MDX-страниц (4 static + 6 podcasts + 4 vacancies + 42 blog).

---

## Полная карта контента digitalburo.tech

### Из sitemap.xml (5 URL)
| URL | Тип | Файл |
|---|---|---|
| `/` | landing | `migration/static/home.mdx` |
| `/leadership` | manifesto | `migration/static/leadership.mdx` |
| `/career` | jobs landing | `migration/static/career.mdx` |
| `/virazh` | product landing | `migration/static/virazh.mdx` |
| `/blog` | blog index | → генерится из `blog/posts/` |

### Из sitemap-feed-707520631191.xml (42 URL) — БЛОГ
42 поста под `/blog/tpost/<slug>` и `/virazh/tpost/<slug>`. Часть постов доступна по обоим путям (13 постов — aliases).
→ `migration/blog/posts/<slug>/index.mdx`

### Из sitemap-feed-664348139671.xml (6 URL) — ПОДКАСТЫ
`/tpost/ayz5zzj661-1-iskusstvo-zakaznoi-razrabotki` ... `/tpost/p33fpx4f71-6-kak-vibirayut-yazik`
Серия из 6 эпизодов «Искусство заказной разработки».
→ `migration/podcasts/<slug>.mdx`

### Из sitemap-feed-210136015421.xml (4 URL) — ВАКАНСИИ
`/tpost/9pyckxd3n1-flutter-razrabotchik`
`/tpost/yo0iei17a1-middle-php-laravel-web-razrabotchik`
`/tpost/g1vvl19a91-menedzher-po-b2b-prodazham`
`/tpost/ji623k2n61-middle-project-manager`
→ `migration/vacancies/<slug>.mdx`

### Что **не в sitemap** (видно по robots.txt disallow, проверить отдельно):
- `/policy` — политика конфиденциальности (disallow, но страница живёт)
- `/ru`, `/buro`, `/bureau_en` — старые языковые версии (вероятно redirect на /)
- `pageXXXX.html` — legacy Tilda pages (скорее всего уже мёртвые)

**Действие:** проверить вручную какие живые, добавить в scrape позже.

---

## Целевая структура Next.js

```
app/
├── layout.tsx                         общий layout + Header/Footer
├── page.tsx                           "/" — главная (content из migration/static/home.mdx)
├── leadership/page.tsx                "/leadership"
├── career/
│   ├── page.tsx                       "/career" — лендинг вакансий
│   └── [slug]/page.tsx                "/career/flutter-razrabotchik" и т.д.
├── virazh/
│   ├── page.tsx                       "/virazh"
│   └── tpost/[slug]/page.tsx          "/virazh/tpost/..." — блог под virazh
├── blog/
│   ├── page.tsx                       "/blog" — индекс (42 поста)
│   └── tpost/[slug]/page.tsx          "/blog/tpost/..."
├── podcast/
│   ├── page.tsx                       "/podcast" — индекс (6 эпизодов) — НОВОЕ, не было индекса
│   └── [slug]/page.tsx                "/podcast/1-iskusstvo-zakaznoi-razrabotki"
├── policy/page.tsx                    "/policy"
├── sitemap.ts
├── robots.ts
└── not-found.tsx

content/
├── pages/
│   ├── home.mdx
│   ├── leadership.mdx
│   ├── career.mdx
│   └── virazh.mdx
├── blog/<slug>/index.mdx              42 файла
├── podcast/<slug>.mdx                 6 файлов
└── vacancies/<slug>.mdx               4 файла

public/
└── images/
    ├── home/, leadership/, career/, virazh/    из migration/images/
    ├── blog/<slug>/                             из migration/blog/images/
    ├── podcast/<slug>/
    └── vacancies/<slug>/
```

### URL mapping (сохраняем SEO 1:1)
| Было на Tilda | Станет в Next.js | 301? |
|---|---|---|
| `/` | `/` | — |
| `/leadership` | `/leadership` | — |
| `/career` | `/career` | — |
| `/virazh` | `/virazh` | — |
| `/blog` | `/blog` | — |
| `/blog/tpost/<slug>` | `/blog/tpost/<slug>` | — |
| `/virazh/tpost/<slug>` | `/virazh/tpost/<slug>` | — |
| `/tpost/<podcast-slug>` | `/podcast/<slug-без-id>` | **301** со старого пути |
| `/tpost/<vacancy-slug>` | `/career/<slug-без-id>` | **301** со старого пути |
| `/policy` | `/policy` | — (проверить, есть ли) |

**Важно:** 13 постов имеют оба канонических пути (`/blog/tpost/...` и `/virazh/tpost/...`) — aliases в frontmatter. Рендерим из одного MDX по обоим путям, canonical = основной путь из `canonical` в frontmatter.

---

## Стек

**Базу брать из `/Users/vitaliy/Documents/zarubin_site`** (проверенная), но с апгрейдом:

| Слой | zarubin_site | В этом проекте |
|---|---|---|
| Next.js | 14 App Router | **15** (апгрейд, React 19) |
| Styling | Tailwind 3 | **Tailwind 4** |
| UI kit | своя `ui-kit/` (не shadcn) | **shadcn/ui** поверх Radix |
| MDX | `gray-matter` + `remark` | **`next-mdx-remote` / `@next/mdx`** |
| i18n | нет | **`next-intl`** (ru-default, en позже) — каркас сразу, EN-контент после |
| Forms | Formik | **react-hook-form + zod** (современнее) |
| Email | Resend | Resend (оставляем) |
| Sitemap | `next-sitemap` | `next-sitemap` |
| Fonts | — | `next/font` (локальные) |
| Images | next/image | next/image + remote-patterns для tildacdn (временно) |
| Analytics | — | GA4 + Yandex.Metrika (как на Tilda) |

**Что reuse из zarubin_site руками:**
- `src/utils/getCaseMetadata.ts`, `getMainBannerMetadata.ts` — паттерн MDX-индекса
- `src/utils/faqSchema.ts` — JSON-LD
- `src/utils/contentTrimming.ts`
- `next-sitemap.config.mjs` — базовый конфиг

---

## Фазы работ

### Фаза 1 — Scaffold + инфра (2-3 дня)
- [ ] `pnpm create next-app@latest` (Next 15, TS, Tailwind 4, App Router, src/, Turbopack)
- [ ] shadcn init, базовые компоненты (button, card, input, dialog)
- [ ] `next-intl` настройка: middleware, `[locale]` layout, ru default
- [ ] MDX pipeline: `@next/mdx` + `gray-matter` frontmatter, типы через zod
- [ ] `public/images/` копия из `migration/`
- [ ] `.env` заготовка (Resend API, GA4 id, YM id)
- [ ] ESLint/Prettier из zarubin_site
- [ ] CI: простой `pnpm build` на push (GitHub Actions)

### Фаза 2 — Блог (3-4 дня)
- [ ] Тип `Post` (zod schema из frontmatter)
- [ ] Loader `getAllPosts()`, `getPostBySlug()`
- [ ] Роут `/blog` — листинг с фильтрацией по tags, пагинация (42 поста / 9 на странице)
- [ ] Роут `/blog/tpost/[slug]`
- [ ] Роут `/virazh/tpost/[slug]` — тот же handler, canonical разный
- [ ] MDX компоненты: `<Figure>`, `<Quote>`, `<Callout>`
- [ ] JSON-LD `Article` + `BreadcrumbList`
- [ ] RSS feed `/rss.xml`
- [ ] sitemap.xml (динамический)
- [ ] **Тест:** 42 поста рендерятся, картинки грузятся, canonical корректный

### Фаза 3 — Статические страницы (2-3 дня)
- [ ] `/` — главная. Контент из `migration/static/home.mdx`. Пересобрать в нормальные секции (Hero / Кейсы / Клиенты / CTA), сохранив весь текст.
- [ ] `/leadership` — манифест. Чистая type-heavy страница.
- [ ] `/career` — лендинг + лист вакансий (из `vacancies/`). Фильтр по направлениям.
- [ ] `/career/[slug]` — детальная вакансия с формой отклика.
- [ ] `/virazh` — лендинг продукта. Ключевая страница, много контента (35 картинок, 59 блоков). Разбить на секции.
- [ ] `/policy` — если живая, спарсить и перенести.

### Фаза 4 — Подкасты + вакансии как контент-типы (1-2 дня)
- [ ] `/podcast` — индекс (новая страница, не было на Tilda). 6 эпизодов.
- [ ] `/podcast/[slug]` — страница эпизода, плеер-embed.
- [ ] `/career/[slug]` — уже сделано в Фазе 3.
- [ ] 301 redirects с `/tpost/<old-slug>` → `/podcast/<slug>` и `/career/<slug>` (в `next.config` redirects).

### Фаза 5 — Формы + интеграции (1-2 дня)
- [ ] Форма «Свяжитесь с нами» (главная, career, virazh) → Resend
- [ ] Форма отклика на вакансию → Resend с прикреплением CV
- [ ] Anti-spam: honeypot + Turnstile/hCaptcha
- [ ] GA4 + Yandex.Metrika
- [ ] OG images статические + динамические (`/api/og`)

### Фаза 6 — SEO + finish (1-2 дня)
- [ ] Все meta-теги 1:1 с Tilda (title, description из migration frontmatter)
- [ ] JSON-LD: Organization, WebSite, SiteNavigationElement
- [ ] 301 карта целиком (next.config redirects): `/tpost/<podcast>`, `/tpost/<vacancy>`, `/ru`, `/buro`, `/bureau_en`, legacy `pageXXXX.html`
- [ ] hreflang теги на будущее (пока только ru)
- [ ] Lighthouse ≥ 90 по всем четырём метрикам на ключевых страницах
- [ ] Smoke-test: все 42 поста возвращают 200

### Фаза 7 — Деплой (1 день)
- [ ] Домен `digitalburo.tech` с Tilda на Vercel (или сервер клиента — решить)
- [ ] DNS cut-over окно
- [ ] Search Console: отправить новую sitemap, подтвердить 301
- [ ] Мониторинг 404/500 первые сутки

**Итого: ~12-14 рабочих дней на голый клон без редизайна.**

---

## Что **НЕ входит** в этот план (отдельные эпики)

- Редизайн в Teamworks-style — Фаза 8+ (после клона)
- Virazh product hub с 5 модулями — Фаза 9+ (требует решения 5 открытых вопросов из `HANDOFF.md`)
- Programmatic SEO 30+ страниц — Фаза 10+
- i18n EN-контент (перевод) — Фаза 11+
- Pricing page — Фаза 12+ (нужен диапазон цен)

---

## Открытые вопросы до старта Фазы 1

1. **Package manager:** `pnpm` / `npm` / `bun`? (рекомендую `pnpm`, как в `zarubin_site`)
2. **Хостинг:** Vercel (default) / свой сервер? Влияет на конфиг сборки.
3. **Next 15 точно?** Или играем в безопасность и берём Next 14 как в `zarubin_site`?
4. **Shadcn vs своя ui-kit?** Shadcn даст скорость + редизайн позже. Своя — сохранит визуальную преемственность с zarubin_site, если это важно.
5. **`/policy` — живая?** Проверить, если есть — добавить в scrape.
6. **Tilda-формы — собирать ли submit-endpoint?** Или сразу на Resend? (Ответ очевиден — Resend, но убедиться).

---

## Follow-ups после клона

- Проверить все страницы через GSC: нет ли ещё URL, которые мы не видим в sitemap
- Загрузить `migration/raw-html/` в git LFS или `.gitignore`-нуть (79 MB в обычном git — плохо)
- Решить политику картинок: хранить в `public/images/` или отдавать через CDN/Cloudflare Images (всё равно 63+ MB)
