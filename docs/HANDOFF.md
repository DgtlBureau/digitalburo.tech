# Handoff — Вираж / Digital Buro redesign

**Сессия:** 2026-04-16 (owner: Виталий Зарубин, CEO БЦТ)
**Контекст чата:** zarubin_site → стратегия на перезапуск Виража + миграцию digitalburo.tech с Tilda
**Цель:** за 2 месяца перезапустить digitalburo.tech с новым позиционированием Виража, мигрировать блог, сделать product-сайт revolutionary уровня

---

## TL;DR (30 секунд)

- **Продукт:** Вираж — CRM для хоккейных клубов. На Tilda. Есть в проде: ХК Авангард, Торпедо НН, Динамо Мск, Адмирал.
- **Решение:** позиционируемся как **"Операционная система клуба и стадиона"** (Teamworks/Manager360 паттерн)
- **5 модулей:** Revenue OS, Fan Platform, Operations, Brand, Intelligence
- **Главный сдвиг:** продаём **CEO/CFO**, а не маркетологу. От CRM → к digital-трансформации.
- **Рынок:** РФ-first (там деньги), i18n-ready сайт (EN/СНГ/MENA — потом)
- **Архитектура сайта:** `digitalburo.tech/` (корпоративный) + `/virazh/*` (продукт) + `/blog/*` (сохраняем)
- **Стек:** Next.js 15 + Tailwind + shadcn (reuse из `zarubin_site`)
- **Блог мигрирован:** 42 поста с Tilda в MDX, слаги 1:1, картинки скачаны
- **Репо:** `github.com/DgtlBureau/digitalbureau.tech` (пустой, ждёт init)

---

## Контекст

**Digitalburo.tech** — агентство цифровых технологий в спорте. Блог тянет SEO, но сайт на Tilda устарел. Продукт Вираж (CRM для клубов) в отдельной папке `/virazh` тоже на Tilda.

**Прямой конкурент:** [selloutdigital.ru/capital](https://selloutdigital.ru/capital) — "аналитическая CRM для спорта", такой же feature-list подход, нет pricing, те же клиенты (Альфа Капитал).

**Референсы:**
- [teamworks.com](https://teamworks.com) — "Operating System for Sports", 5 продуктовых линеек, $500M+ raise, 7000+ teams
- [manager360.online](https://manager360.online) — "технологии с которых начинается спорт" (упомянут как пример vertical OS паттерна)
- [klientiks.ru/erp](https://klientiks.ru/erp), [medesk.ru/medcrm](https://www.medesk.ru/medcrm) — РФ ERP для клиник, валидируют паттерн "ОС для вертикали"

---

## Стратегические решения

### 1. Позиционирование

**Старое:** "CRM-платформа для спортивных клубов"
**Новое:** **"Вираж. Операционная система для спортивного клуба и стадиона."**

Sub-tagline: *"Всё для фанатов, бренда, команды и выручки — на одной платформе."*

**Почему сдвиг:** CEO/CFO клуба покупает "цифровую трансформацию" (чек ×3), а не "CRM-инструмент" маркетологу. Manager360/Клиентикс/Teamworks — все прошли этот путь.

### 2. Продуктовая архитектура (5 модулей)

| # | Модуль | Кому продаёт | Статус |
|---|---|---|---|
| 1 | **Revenue OS** (= Stadium System) | CFO, CEO | merge с Stadium System, дорабатывается |
| 2 | **Fan Platform** | CMO | в проде (Авангард/Торпедо) |
| 3 | **Operations** | COO, билетный отдел | в проде |
| 4 | **Brand** | CEO (agency wrap) | БЦТ делает сейчас |
| 5 | **Intelligence** | стратег, спонсоры | roadmap Q3–Q4 2026 |

**Manager360 паттерн:** продаём Fan+Ops+Brand как работающий фундамент сегодня, Revenue OS и Intelligence в roadmap → клиент платит за настоящее+будущее в комплекте.

### 3. ICP-лестница

1. **Якорь:** КХЛ-клубы (текущая база — Авангард, Торпедо, Динамо, Адмирал)
2. **≤ 6 мес:** РПЛ, ВХЛ, ВТБ баскетбол, федерации
3. **SEO long-tail:** падел-клубы (BLUE OCEAN!), футбольные школы, единоборства, стрелковые
4. **≥ 12 мес:** целые лиги (КХЛ/РПЛ), СНГ, MENA

### 4. Дифференциация против Capital

- У Capital — только tool. У нас — **platform + agency** (research + design + dev + SLA)
- У Capital — нет pricing. У нас — **показать диапазон** (anti-Capital USP)
- У Capital — feature list. У нас — **outcome-based** (кейсы с цифрами)

### 5. Рынок

**РФ-first, EN-ready.** NOT go international now. Причины:
- В РФ платящие клиенты, product-market fit, деньги
- Teamworks = $500M, без VC мы EN проиграем
- Чек КХЛ-клуба 5-10M₽/год → 30 клиентов = бизнес
- Сайт i18n с дня 1 — без commitment, просто не блокер

**Roadmap:** 2026 РФ → 2027 СНГ → 2028 MENA (Саудиты/UAE активно покупают спорт-инфраструктуру).

---

## Архитектура сайта

### Домен и структура

**Один домен `digitalburo.tech`, два этажа:**

```
digitalburo.tech/                   корпоративный: агентство, манифест, карьера
digitalburo.tech/blog/              блог (SEO authority — сохраняем)
digitalburo.tech/virazh/            product hub (Hero + 5 модулей)
digitalburo.tech/virazh/products/   /fan, /ops, /brand, /intelligence, /revenue
digitalburo.tech/virazh/industries/ /hockey, /football, /basketball, /padel, /martial-arts, /shooting
digitalburo.tech/virazh/cases/      /avangard, /torpedo, /dynamo, /admiral, ...
digitalburo.tech/virazh/solutions/  programmatic SEO (30+ страниц)
digitalburo.tech/virazh/pricing     ⚡ transparency = anti-Capital USP
digitalburo.tech/virazh/research    gated PDFs (как в текущей презе)
```

**Почему один домен, а не поддомен/отдельный:**
- Блог имеет SEO authority — не делим
- Меньше работы, 1 Next.js проект
- Будущий path: если Вираж выстрелит через 6 мес → virazh.ru + 301, ничего не теряется

### Programmatic SEO матрица

`/virazh/solutions/crm-dlya-[sport]-[segment]`

**Приоритет по реальным SEO-данным (из GSC):**
- `crm-dlya-hokkeynogo-kluba` (uplift существующих позиций 25-30)
- `crm-dlya-padel-kluba` ⭐ **BLUE OCEAN** — 8+ падел-запросов идут на главный digitalburo.tech, ниша пустая
- `crm-dlya-futbolnoy-shkoly` (6+ показов)
- `crm-dlya-kluba-edinoborstv` (91 показ)
- `crm-dlya-strelkovogo-kluba` (26 показов)
- `crm-dlya-prodazhi-biletov` (72 показа)

---

## Блог — МИГРАЦИЯ ГОТОВА ✅

Вся работа — в `/Users/vitaliy/Documents/virazh-blog-migration/`:

```
posts/                  42 поста × index.mdx (frontmatter + markdown body)
  [slug]/index.mdx
images/                 63 MB, 90 картинок со Tildacdn, все локально
  [slug]/
raw-html/               11 MB, сырой HTML каждой статьи (для диффа/ре-парсинга)
manifest.json           каталог: title, slug, date, tags, aliases, og:*, imgs
reports/report.md       отчёт по миграции
scripts/migrate.py      переиспользуемый скрипт (кеширует raw-html, поддерживает re-run)
blog-urls.txt           36 URL из /blog/tpost/
virazh-urls.txt         20 URL из /virazh/tpost/
```

**Покрытие:**
- title: 42/42
- description: 42/42 (20 с fallback из body, т.к. Tilda их не заполнила)
- date: 42/42 (Mar 2023 → Sep 2025)
- og:image: 41/42 (1 пост без картинки на оригинале)
- body: 42/42 (avg 7539 chars)
- aliases: 13 постов в обоих путях (/blog + /virazh)

**Верификация (3 поста сравнены с live):** разница текста 1-3% (whitespace от MD-конверсии), картинки 1:1.

**Frontmatter schema (пример):**
```yaml
---
title: "Почему в России никому не нужна спортивная CRM"
slug: "4rh1x58601-pochemu-v-rossii-nikomu-ne-nuzhna-sporti"
postId: "4rh1x58601"
description: "..."
date: "2024-11-25"
author: "Виталий Зарубин"
tags: ["Спорт", "IT"]
ogImage: "/images/4rh1x58601-.../87925ba4.jpg"
ogImageRemote: "https://static.tildacdn.com/..."
canonical: "https://digitalburo.tech/virazh/tpost/..."
canonicalSource: "https://digitalburo.tech/blog/tpost/..."
aliases: ["https://digitalburo.tech/virazh/tpost/..."]
type: "article"
---
```

**При переносе в Next.js:**
- Copy `posts/` → `content/blog/` (или `content/posts/`)
- Copy `images/` → `public/blog/` (и обновить пути в MDX `/images/` → `/blog/`)
- Настроить роутинг: `/blog/tpost/[slug]` + `/virazh/tpost/[slug]` → один handler
- 301 в будущем с `/virazh/tpost/` на `/blog/tpost/` (или наоборот) для canonical

---

## Стек

**Базу брать из `/Users/vitaliy/Documents/zarubin_site`** (проверенная):

- Next.js 15 (App Router)
- Tailwind CSS
- shadcn/ui
- i18n (uk/en/ru ready)
- MDX-движок для блога
- next-sitemap
- pageMetadata + schema.org utils уже написаны (см. `src/utils/`)
- TypeScript strict
- ESLint + Prettier

**Экономия минимум 2 недели** по сравнению с scratch-scaffold.

---

## 2-месячный execution план

| Нед | Что делаем |
|---|---|
| 1 | Init digitalbureau.tech репо: Next.js scaffold, бренд-система, дизайн-токены |
| 2 | Главная digitalburo.tech + миграция блога (`/blog/*`) + 2 якорных кейса (Авангард, Торпедо) с цифрами |
| 3 | `/virazh` hero + страницы модулей Fan, Ops, Brand |
| 4 | Revenue OS, Intelligence (roadmap-style), Industries: hockey + football |
| 5 | 15 programmatic SEO страниц (приоритет: падел + единоборства) |
| 6 | Ещё 15 SEO + Research/Pricing |
| 7 | Полировка, внутренние линки блог → /virazh/solutions, SEO audit |
| 8 | **Launch:** PR "БЦТ запускает Вираж как ОС клуба", outreach 50 клубов КХЛ/РПЛ, demo-дни |

---

## Дизайн-язык

- Teamworks premium + русская сдержанность
- Тёмно-синий/зелёный (сохраняем бренд БЦТ)
- Большие цифры (как в текущей презентации)
- Video-hero с аренами (материал есть у клиентов)
- Typography уровня stadium-poster (крупный bold sans)
- НЕ корпорат, НЕ айти-лендос — как сайт крупного клуба

---

## Что ОСТАЛОСЬ обсудить

1. **Stadium System** — реально ли это отдельный продукт сегодня или label в презентации? Нужно слить с Виражом и выкинуть дубль.
2. **Pricing diapason** — начальный диапазон цен по модулям (от X до Y ₽/сезон). Без этого anti-Capital USP не сработает.
3. **Названия модулей** — на русском (Выручка/Фанаты/Операции/Бренд/Аналитика) или английском (Revenue/Fan/Ops/Brand/Intelligence)? Рекомендация: англ.
4. **Дизайн-токены и бренд** — сохраняем текущий БЦТ гайд или переделываем под Teamworks-style?
5. **Spec doc:** ещё НЕ написан. В brainstorming skill: следующий шаг = `docs/superpowers/specs/2026-04-16-virazh-stadium-os-design.md`, потом ревью, потом → writing-plans.

---

## Полезные ссылки

### Проект
- digitalburo.tech — текущий сайт (Tilda)
- digitalburo.tech/virazh — текущий лендинг продукта (Tilda)
- digitalburo.tech/blog — блог, SEO-якорь
- github.com/DgtlBureau/digitalbureau.tech — пустой репо, ждёт init

### Рынок
- selloutdigital.ru/capital — прямой конкурент
- teamworks.com — global reference
- manager360.online — паттерн vertical OS
- klientiks.ru/erp — РФ vertical OS в медицине (паттерн)

### Артефакты сессии
- `/Users/vitaliy/Documents/virazh-blog-migration/` — блог-миграция (42 поста, скрипты, manifest, raw HTML)
- `/Users/vitaliy/Documents/research/https___digitalburo/` — GSC SEO data (основной сайт)
- `/Users/vitaliy/Documents/research/https___digitalburo-virazh/` — GSC SEO data (virazh)
- `/Users/vitaliy/Downloads/Презентация x БЦТ___.pdf` — текущая презентация клиентам (34 стр)
- `/Users/vitaliy/Documents/zarubin_site/` — stack-донор (Next.js 15 + Tailwind + shadcn)

### Клиенты (кейсы для сайта)
- ХК Авангард (Омск, КХЛ) — приложение + CRM
- ХК Торпедо Нижний Новгород (КХЛ) — приложение + CRM Вираж (15,291 проходов, 12,388 билетов в CRM)
- ХК Динамо Москва (КХЛ) — CRM + веб-сайты
- ХК Адмирал (Владивосток, КХЛ) — техподдержка
- ПФК Крылья Советов (Самара, РПЛ) — развитие
- ХК Трактор (КХЛ) — программа лояльности
- ХК Норильск — сайт + fan engagement
- Russian Drift Series — CRM для гоночной серии
- Stocks.Soccer — fantasy football стартап
- Grid Capital — финтех (неспорт)

---

## Следующий шаг при возобновлении

Открыть этот файл → подтвердить решения (или скорректировать) → дальше два пути:

**Быстрый старт:**
1. Init Next.js в `digitalbureau.tech/` из `zarubin_site` (копировать структуру app/, src/components/, config)
2. Скопировать `virazh-blog-migration/posts/` → `content/blog/`, `images/` → `public/blog/`
3. Поднять `pnpm dev`, поправить роутинг `/blog/tpost/[slug]`
4. Первый коммит в пустой репо

**Сначала spec (рекомендуется):**
1. Написать `docs/superpowers/specs/2026-04-16-virazh-stadium-os-design.md`
2. Ревью → implementation plan (superpowers:writing-plans skill)
3. Implementation по плану

Новый чат начни с: *"Продолжаем с HANDOFF.md в digitalbureau.tech/. Коротко сверстай что помнишь, и давай [init / spec]."*
