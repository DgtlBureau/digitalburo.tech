# Аудит-саммари — digitalburo.tech

Дата: 2026-04-17
Источники: `.agents/it-output.md`, `.agents/seo-output.md`, `.agents/schema-output.md`, `.agents/cmo-output.md`
Commit scope: начиная с `1b1df08`

---

## TL;DR

- **0 security blockers.** Проект чистый для static export: нет API, нет секретов, нет `process.env` в `src/`. JSON-LD и meta-refresh безопасны.
- **3 SEO P0:** canonical war на 84 URL'ах (42 дубль-пути блога) + 2 канонических ссылаются на 404 + sitemap индексирует не-канонические дубли.
- **Позиционирование не съехало на сайт:** стратегический сдвиг «Операционная система клуба и стадиона» (из HANDOFF.md) не виден ни на главной, ни на `/virazh`. Arena-директор bounce'ит за 5 секунд.
- **Trophy cabinet зарыт:** 6 КХЛ-клубов — сильнейший актив, но на них не указывают. Лучший отзыв (ХК Авангард) — 3-й из 5, смешан с Grid Capital и Orbita.
- **Быстрые SEO-победы дешевы:** 7 неиспользуемых зависимостей, og:image fallback, Yandex Host директивы, JobPosting schema — все за пару часов.

---

## План фиксов — 4 коммита, по ROI

### Коммит A — SEO P0/P1 fixes (~45 мин)
Самый важный: чиним canonical'ы и sitemap до пуша в GSC, иначе индексация пойдёт вразнос.

- **P0-1** (`src/app/blog/tpost/[slug]/page.tsx`): blog route игнорирует `frontmatter.canonical`, эмитит self-ref. Фикс: так же как virazh route — читать frontmatter.
- **P0-2** (`content/blog/xj33umds91-.../index.mdx`, `content/blog/crj6jx9kf1-.../index.mdx`): canonical ссылается на Tilda-era slug'и, которые никогда не существовали в Next. Фикс: поменять canonical на реальные `/blog/tpost/<slug>`.
- **P0-3** (`src/app/sitemap.ts`): sitemap эмитит 42×2 URL'а (и canonical и не-canonical). Фикс: только canonical из frontmatter, итого ~62 URL вместо ~108.
- **P1-1** (`src/app/layout.tsx`): нет site-level og:image fallback. Фикс: добавить `/images/og-default.png` (1200×630) + дефолт в metadata.
- **P1-3** (`src/app/sitemap.ts`): trailingSlash mismatch — sitemap без `/`, canonical с `/`. Фикс: нормализовать.
- **P1-4** (`src/components/blog/PostPage.tsx`): Article schema без `dateModified` и `publisher.logo`. Фикс: добавить оба поля.
- **P1-5** (`src/app/page.tsx`): Organization schema слабая — нет `foundingDate`, `contactPoint`, `alternateName`. Фикс: обогатить.
- **P1-6** (`src/app/virazh/page.tsx`): SoftwareApplication `offers.price: "0"` — Google читает как "Free". Фикс: `priceSpecification` с "ByQuote".
- **P1-7** (`src/app/robots.ts`): Yandex `Host:` ждёт хостнейм без протокола. Фикс: `SITE_URL.replace(/^https?:\/\//, "")`.
- **P1-8** (`src/app/robots.ts`, `src/app/policy/page.tsx`): `Disallow: /policy` + meta noindex — двойное отрицание, crawler не видит meta. Фикс: убрать Disallow, `follow: true` на policy.
- **P0-5 SEO** (`src/app/virazh/tpost/[slug]/page.tsx:30`): fragile string-replace `https://digitalburo.tech`. Фикс: `new URL(...).pathname`.

### Коммит B — Schema расширения (~1 час)
- **JobPosting** на `/career/[slug]` — единственный способ попасть в Google for Jobs. 4 вакансии сейчас невидимы.
- **BreadcrumbList** на блоге/подкасте/вакансиях (~50 страниц) — rich result в SERP.
- **WebSite** + `@graph` с `@id` на главной — связывает Organization, Person, Publisher через единый источник `src/lib/organizationData.ts`.
- **Опционально**: Service schema на `/virazh/arenas` (одновременно с постройкой страницы) и FAQPage там же.

### Коммит C — Code cleanup (~20 мин)
IT P1-1, P1-2:
- `pnpm remove resend react-hook-form @hookform/resolvers next-intl sonner next-themes` + удалить `src/components/ui/sonner.tsx` и `<Toaster>` из layout.
- Удалить неиспользуемые shadcn примитивы: `badge.tsx`, `card.tsx`, `input.tsx`, `label.tsx`, `separator.tsx`, `sheet.tsx`, `textarea.tsx`.
- Проверить `tw-animate-css`, `@tailwindcss/typography`, `shadcn` (в devDeps) — если не используются, вынести/удалить.
- `scripts/generate-rss.mjs`: заменить хэндрольный парсер frontmatter на `gray-matter` (который уже есть).

### Коммит D — Позиционирование + `/virazh/arenas` (~2 часа)
Объединяем CMO-фиксы с постройкой арена-страницы, чтобы сообщение было единым.

**Home (`src/app/page.tsx` + `src/lib/homeData.ts`):**
- **P0-1 CMO**: H1 → «Операционная система клуба и стадиона» (из HANDOFF.md)
- **P0-2 CMO**: добавить stats-strip ниже hero (4 млн заказов / 250 000 пользователей / 6 клубов КХЛ / 10 лет)
- **P0-3 CMO**: testimonials — переставить (Константин ХК Авангард → первым; Сергей ХК Трактор → вторым; Grid Capital + Orbita — убрать или перенести на /leadership)
- **P0-4 CMO**: case cards — 3-4 заменить на number-led (Торпедо НН 15 291 проход / Авангард приложение КХЛ 2021); non-sports убрать (OAZIS / АТОМ / Капитальный прыжок)
- **P0-5 CMO**: Research block — снять со страницы до готовности gated PDF (держать сломанный триггер вредно)
- **P0-6 CMO**: CTAs → «Демо Виража за 30 минут» + «Скачать кейс Торпедо (PDF)» (PDF позже)
- **P1-1 CMO**: перенести Testimonials выше Platforms/Research (Hero → Logos → Cases → Testimonials → Platforms → Consultation → Contact)
- **P0-7 CMO**: Platforms — карточка «Система управления стадионом» должна ссылаться на `/virazh/arenas` с arena-языком

**`/virazh` (`src/app/virazh/page.tsx` + `src/lib/virazhData.ts`):**
- H1 → «Вираж. Операционная система клуба и стадиона.»
- Subtitle → «Всё для фанатов, бренда, команды и выручки — на одной платформе. В проде у Авангарда, Торпедо, Динамо.»
- **P1-6 CMO**: Преимущества-трио переписать на конкретные механики (единая карта болельщика, AI-ассистент, автоматические билеты в CRM)

**Новая `/virazh/arenas` + `/virazh/arenas/brief`:**
Структура по плану (`misty-forging-glade.md`). Ключевые акценты из CMO-аудита:
1. Hero с arena-вокабуляром (посадка/проходы/F&B/yield/non-matchday)
2. Stats strip (пусто или арена-специфичные)
3. 6 модулей (ticketing/F&B/loyalty/sponsorship/access/parking+retail)
4. TCO блок (1 стек vs 7) — anti-fragmentation
5. Integration signal (ticketing, 152-ФЗ compliance)
6. Matchday + non-matchday coverage
7. Roles (CFO/COO/билет/маркетинг/F&B/безопасность)
8. 12-недельный таймлайн внедрения
9. Кейс Торпедо (арена-рефрейм: «15 291 проходов через единую систему»)
10. FAQ → **FAQPage schema**
11. Двойной CTA: «Запросить стоимость» + «Интро-встреча с ком.диром Торпедо» (peer-to-peer)

**Обвязка:**
- `src/lib/nav.ts`: добавить «Арены» в primaryNav
- `src/app/sitemap.ts`: добавить `/virazh/arenas`, исключить `/virazh/arenas/brief`
- Service + FAQPage + BreadcrumbList JSON-LD

---

## Что откладываем в follow-ups

### IT — infrastructural
- **P1-3**: `<Section>` + `<SectionHeader>` extraction (~2h) — не блокер, делаем когда правим copy в следующий раз.
- **P2-2 IT**: migration-only fields (`imagesCount`, `textBlocksCount`, `url`) в схемах — косметика.
- **P2-4 IT**: podcast slug regex дубль в podcasts.ts/vacancies.ts — 30 мин extraction.
- **P3 IT**: MdxContent remote/local detection, Header mobile nav toggle, Research.tsx dead Button.

### SEO — пост-деплой
- **P2-4 SEO**: BreadcrumbList на статьях (включено в Коммит B).
- **P2-5 SEO**: WebSite schema (включено в Коммит B).
- **P2-6 SEO**: meta-refresh `noindex,follow` — оставить или убрать. Нейтрально, оставляем как есть.
- **P2-7 SEO**: Long title truncation (>55 ch). Требует доработки `generateMetadata` в блог-посте. ~30 мин.
- **P2-8 SEO**: `robots.googleBot.max-image-preview: large`. Добавить в layout.

### Schema — depth pass (после первого деплоя)
- PodcastSeries + PodcastEpisode (текстовые эпизоды без аудио — валидно, но слабый signal)
- CollectionPage / ItemList на /blog и /podcast индексах
- AboutPage для /leadership, ContactPage когда появится
- LocalBusiness — пропускаем (удалённая команда)

### CMO — content & strategy
- **P0-5 CMO**: Research gated PDF — отдельный sprint: собрать PDF «Топ-15 Best Practices» и поднять Formspree для email-capture (или Mailchimp).
- **P1-2 CMO**: CEO fotka + name в hero. Нужно фото.
- **P2-2 CMO**: Manifesto MDX не читали — прогон контента. Отдельно.
- **P3-1 CMO**: Video hero на `/virazh` (материал из клубов).
- **P3-2 CMO**: Integration logos (КХЛ, РПЛ, Радарио и т.п.).

### Выяснить у пользователя (флаги)
- **[VERIFY]** Стат-числа «4 млн заказов / 2 млн запросов / 250 000 пользователей» — период и инсталляция?
- **[VERIFY]** «Берём 3-5 новых клубов в сезон 2025/26» — правда?
- **[DECIDE]** Grid Capital + Orbita testimonials — убрать с home?
- **[DECIDE]** EN vs RU названия модулей Виража?
- **[DECIDE]** Цифры внутри Торпедо-кейса — можно публиковать?
- **[DECIDE]** Есть ли арена с живой инсталляцией для `/virazh/arenas` или делаем «заявки на пилот 2025/26»?

---

## Обновлённый порядок действий

1. ✅ Коммит A: SEO P0/P1 — чистим canonical'ы, sitemap, robots, og (45 мин)
2. ✅ Коммит B: Schema — JobPosting + BreadcrumbList + WebSite/@graph (1 час)
3. ✅ Коммит C: Cleanup — unused deps + dead shadcn (20 мин)
4. ✅ Коммит D: Positioning + `/virazh/arenas` + `/virazh/arenas/brief` (2 часа)
5. Финальный прогон `pnpm build` + probe локально
6. Отчёт пользователю: что сделано, открытые вопросы, что в follow-ups

**Оценка:** ~4-5 часов работы от сейчас до полного финала. Если пользователь вернётся раньше — остановлюсь на том, что уже закоммичено.
