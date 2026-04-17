# CMO / Marketing Psychology Audit — digitalburo.tech
Date: 2026-04-17
Author: CMO agent
Scope: `/`, `/virazh`, `/career`, `/leadership`, blog surface signals
Source of truth for strategy: `/Users/vitaliy/Documents/digitalburo.tech/docs/HANDOFF.md`

---

## TL;DR

1. **The site currently serves "мелкий маркетолог клуба", not a whale.** Home hero ("Развиваем технологии в спорте" + "аудит и консультации, автоматизация") reads as digital agency generalist. A director of СКА Арена or Мегаспорт bounces in 5 seconds because nothing here signals "stadium-grade operating system". The strategic shift ("Операционная система клуба и стадиона" / digital transformation sale to CEO/CFO) is decided in HANDOFF.md but NOT YET REFLECTED on any public surface.
2. **The authority is buried.** 6 KHL clubs as clients is the single strongest signal БЦТ owns — but logos sit after a vague hero, the best testimonial (Константин, ХК Авангард) is 3rd out of 5, and cases show generic "Разработали сайт" descriptions instead of "15 291 проходов, 12 388 билетов через CRM". Trophy cabinet exists, nobody points at it.
3. **Biases underused almost everywhere.** Zero anchoring (stats live only on `/virazh`, not home), zero loss aversion (season timing is the whole business — "успеем к сезону" is hinted once on `/virazh`), zero scarcity, reciprocity broken (research CTA says "Просмотреть" but isn't actually gated or delivered), no named authority on CEO (10+ лет, 4 млн заказов, etc. aren't in hero), and the testimonials mix fintech (Grid Capital) with hockey — dilutes the in-group signal.
4. **Tone is too agency-neutral, not sports.** Copy talks about "бизнес-процессы", "маркетинговый потенциал", "data-driven" — language of generic B2B SaaS. It doesn't sound like it was written BY someone who has been inside a клубная раздевалка. The `/virazh` H2 "Трансформируем то, как работает клуб изнутри" is copy-writer-ese, not an operator's sentence. Manifesto page loads an MDX file — content quality there is the single highest-leverage place to establish in-group tone, and it wasn't audited (flagged below).
5. **Arena persona has nothing on the site.** No case study about an arena (vs. a club), no TCO/capex language, no "единая система для билетов + F&B + доступа + парковки", no mention of ticketing/KHL/РПЛ partners as integration logos, no pricing anchor, no "рассчитать окупаемость за сезон" calculator. `/virazh/arenas` is the right next step — this audit flags 14 topics it must cover (see section below).

**Verdict:** the site as shipped is a competent replacement for the old Tilda site for a *club-level* customer. For the *arena-director whale* it is invisible. P0 fixes below close the gap without shipping `/virazh/arenas`; `/virazh/arenas` closes the rest.

---

## P0 — Fix before anyone serious lands

### P0-1. Home hero doesn't match the positioning in HANDOFF.md
- **Current:** "Развиваем технологии в спорте" + "Спортивный софт, операционные бизнес-процессы, аудит и консультации, автоматизация"
- **Problem:** This is a generic agency tagline. An arena director reads "аудит и консультации, автоматизация" and thinks "это не мой поставщик, это подрядчик среднего звена." It doesn't say WHAT the company does, WHO they do it for, or WHY to stay.
- **The decided positioning** (HANDOFF.md line 41) is "Операционная система для спортивного клуба и стадиона" — it is NOT on the home page. The `/virazh` hero also doesn't use it — it says "Система управления болельщиками спортивных клубов", which is the old CRM framing.
- **Fix:** rewrite hero H1 to put positioning on the page. Options in "Hero headline tests" section below. Before a single new page gets built, the two heroes (`/` and `/virazh`) need to be aligned with the OS positioning, or every next action (ads, outreach, `/virazh/arenas`) will fight against the home page.

### P0-2. `/virazh` hero stats are on the wrong page
- Stats block ("4 млн заказов / 2 млн запросов / 250 000 пользователей") lives on `/virazh` under a muted dark band. These are the single strongest anchoring numbers the company owns. They should be on the home page, near the hero, BEFORE the case cards. Currently the home has no numbers above the fold — nothing anchors the reader's sense of scale.
- **Fix:** add a 3-number strip on home right below hero, before logos. Same three stats + "10+ лет в спорте" + "6 клубов КХЛ". Also: on `/virazh`, the value "4 млн заказов" needs context — "заказов чего, за какой период, в какой системе?" Without the footnote it reads like unverified marketing. A CFO will not anchor on a number they can't source.

### P0-3. The best testimonial is 3rd, not 1st
- Current order (`src/lib/homeData.ts` testimonials array): Дима (Orbita.vc) → Алексей (Grid Capital) → **Константин (Коммерческий директор, ХК Авангард)** → Сергей (ХК Трактор) → Лена (Go).
- For a sports-audience reader, Orbita.vc and Grid Capital are noise — they dilute the in-group signal ("these guys do hockey" becomes "these guys do startups"). The first thing a КХЛ commercial director should see is another КХЛ commercial director endorsing. Константин + Сергей should be positions #1 and #2. Дима/Алексей/Лена belong on `/leadership` or a separate "what partners say" section, not on the home testimonial wall.
- **Fix:** reorder array — Константин → Сергей → Лена → (Дима + Алексей drop from home, move to `/leadership` or agency credibility page).

### P0-4. Case cards have generic descriptions, no numbers
- Current: "Динамо — разработали сайт и запустили программу лояльности". "Торпедо" (the best case per HANDOFF.md — 15 291 проходов, 12 388 билетов) isn't even in the cases array on home. "Авангард" says "Разработали лучшее мобильное приложение по версии КХЛ за 2021 год" (good! — but it's 1 of 10 generic lines).
- **Problem:** for a whale, "разработали сайт" is noise. The single most unique company asset — real production numbers from КХЛ clubs — is not being deployed as proof.
- **Fix:** replace 3–4 of the 10 case cards with number-led cards. Suggested (flag [CLAIM: verify from HANDOFF + real data]):
  - *Торпедо НН — 15 291 проход через приложение, 12 388 билетов в CRM за сезон*
  - *Авангард — приложение года КХЛ 2021, программа лояльности для 250 000 пользователей*
  - *Трактор — программа лояльности [X тыс участников за первые Y месяцев]*
  - Drop or demote: OAZIS (вахтовый метод), SportERP, Т-Лига, АТОМ (автомобили), Капитальный прыжок (банк) — these are non-sports and hurt the "мы про спорт" signal on the home page of a sports-tech company.

### P0-5. Research block is broken reciprocity
- Section says "Топ-15 Best Practices", "Скачано 234 раза", "PDF 4.4 Mb" → button: "Просмотреть исследование". No click handler is shown in the component; the PDF is not delivered; and "Скачано 234 раза" claims social proof without actually being a lead magnet.
- **Problem:** this is a triple miss — reciprocity (no download → no gift → no obligation), commitment-and-consistency (no email capture → no follow-up), and credibility (claim without action = suspicion).
- **Fix (P0):** either (a) wire it up as a real gated email-for-PDF lead magnet with a form → PDF to inbox, OR (b) pull the block entirely until ready. Keeping it live as-is actively hurts trust for a detail-oriented buyer.

### P0-6. CTAs are generic
- Home: "Оставить заявку" + "Посмотреть CRM Вираж"
- `/virazh`: "Раскрыть потенциал клуба" + "Демо →"
- Problem: "Оставить заявку" is the default B2B Russian CTA of 2014. "Раскрыть потенциал клуба" is copywriter-ese — every club gets that promise. None of these create commitment or a specific next step.
- **Fix:** single-action, time-bounded, outcome-bounded CTAs:
  - Primary home CTA: "Демо Виража за 30 минут" (specific, time-anchored)
  - Secondary: "Скачать кейс ХК Торпедо (PDF)" (reciprocity + commitment)
  - On `/virazh`: "Посмотреть 3 экрана Виража" (low-friction) + "Сверить процессы клуба с Виражом за 30 минут"

### P0-7. Arena persona is invisible
- Home `Platforms` section lists "Система коммуникаций клуба" and "Система управления стадионом" as two boxes → both link to `/virazh`. There's no separate arena page, no arena case, no arena language.
- **Problem:** if a директор СКА Арены lands, his first thought is "ok, but where's the stadium story?" The `/virazh` page he lands on talks about "болельщиков" and "маркетинга" — both are club problems, not arena problems.
- **Fix (pre-`/virazh/arenas`):** on home `Platforms`, the "Система управления стадионом" card should click to a dedicated URL (even a stub) — not recycle the club page. And the description should carry arena vocabulary: "билеты + F&B + доступ + парковка + retail в одной системе", "окупаемость сезона", not "продвинутая CRM специально для стадионов" (вот это и есть агентский язык, который продаёт CRM, а не трансформацию).

---

## P1 — High-impact quick wins

### P1-1. Move testimonials above `Research` and `Consultation`
- Current order: Hero → ClientLogos → Cases → Platforms → Research → Consultation → Testimonials → Contact.
- Problem: a skeptical reader sees 5 content blocks before a human voice appears. Testimonials are the trust gear change — should be right after Cases, before asking for attention on Platforms/Research/Consultation.
- Suggested: Hero → ClientLogos → Cases → **Testimonials** → Platforms → Research → Consultation → Contact. Or even: Hero (with stats strip) → ClientLogos → **Testimonials (1–2 marquee quotes from КХЛ directors)** → Cases (with numbers) → Platforms → Research → Contact.

### P1-2. CEO authority in the hero
- Виталий Зарубин is named only in the Contact block at the bottom. `Consultation` section implies "Отвечает CEO" but doesn't name him. For a Russian B2B audience the face + name of the founder is a trust primer — especially with a personal network like the existing client base (which was almost certainly closed CEO-to-CEO).
- Fix: add a small byline above the hero CTA — "Виталий Зарубин, CEO · 10 лет в спортивных технологиях · клиенты: Авангард, Торпедо, Динамо". Or a photo tile in the sidebar.

### P1-3. Credentials in the eyebrow aren't specific enough
- Current eyebrow: "Бюро Цифровых Технологий · с 2014"
- "с 2014" is 12 years of credit — good — but it's read as generic. Compare to the stats strip (fix P0-2): a reader's eyes will anchor on numbers, not dates.
- Try: "с 2014 · клиенты: 6 клубов КХЛ · 4 млн заказов обработано"

### P1-4. ClientLogos subhead can do more work
- Current: "Нам доверяют клубы КХЛ, РПЛ и федерации"
- Stronger: "Рабочие инсталляции: ХК Авангард, Торпедо НН, Динамо, Адмирал, Трактор. Партнёры: Газпром, ВФВ" — turns 8 logos into a sentence a journalist/analyst could quote. Also: the current line claims "РПЛ" but only ПФК Крылья Советов is РПЛ and it's not in the 8 logos. Either add Крылья or soften the line to "клубы КХЛ и спортивные федерации".

### P1-5. `/virazh` hero subtitle is still CRM-era
- "Главная отечественная CRM-платформа для роста прибыли с продаж, повышения ценности активов клуба и data-driven маркетинга."
- Three problems: (1) "Главная отечественная" is an unverifiable claim (what's the benchmark?); (2) list of three abstracts ("рост прибыли", "ценность активов", "data-driven маркетинг") isn't a sentence, it's a bag; (3) "CRM-платформа" contradicts the "Operating System" positioning.
- Rewrite per HANDOFF.md sub-tagline: *"Всё для фанатов, бренда, команды и выручки — на одной платформе. В проде у Авангарда, Торпедо, Динамо."*

### P1-6. `/virazh` "Преимущества" trio is fluff
- Title: "Трансформируем то, как работает клуб изнутри" → 3 cards: Персонализация / Операции / Результат.
- "Персонализация" is also the first `valueProps` card ten sections above. Duplicate. "Результат: data-driven подход к достижению результата" is tautology. A CFO who reads this feels "writer didn't think about this block, cards were forced into 3."
- Fix: reduce to 3 concrete outcomes, each with a number or mechanism. E.g. *"Сезон в данных: 12 000+ билетов автоматически попадают в CRM без ручного ввода"*, *"Единая карта болельщика: абонемент, приложение, лояльность, билет — 1 аккаунт"*, *"AI-ассистент: ответы CFO на 3 клика без запроса в аналитику"*.

### P1-7. Blog isn't surfaced on home
- Home page has zero link to blog. `/virazh` shows 3 latest posts but sorted by date — latest are Sep 2025, so that's fine. But the best thought-leadership posts for an arena-director reader (e.g. "Система управления стадионом — новый запрос" is literally in the blog list) are not curated.
- Fix: add a "Что мы пишем о спортивной индустрии" strip on home with 3 handpicked posts — ideally 1 arena-oriented, 1 CRM/CFO-oriented, 1 hockey-specific. The 42 posts are SEO gold AND thought leadership — right now they're siloed in `/blog` with no discovery path from home.

### P1-8. Contact block says "Мы всегда рады новым партнёрам и амбициозным задачам"
- This reads like an agency looking for clients. A whale reads it as "они свободны, значит ниша не насыщена, значит риск".
- Fix: state the filter, not the openness. E.g. "Работаем с клубами КХЛ/РПЛ и аренами от 5 000 зрителей. Для оценки проекта пришлите вводные — ответим в течение рабочего дня."

---

## P2 — Medium priority

### P2-1. `Consultation` section positioning
- "Экспресс-консультация за 5 минут · 15 лет опыта за 5 минут · Отвечает CEO в Telegram voice" — this is nice for long-tail (падел клубы, единоборства) but may *hurt* the arena-director pitch. A CEO of Мегаспорт doesn't want a voice message reply — he wants a structured intro call with a deck. The block says "we're scrappy" which cuts against "we run stadium ops".
- Suggestion: keep this section, but gate its visibility by audience. Since this is one page for all audiences right now, consider moving the consultation block below the arena/club CTA, or reframing as "Для быстрых вопросов" (small channel) vs. "Для серьёзных проектов — структурированный демо-сеанс" (main CTA).

### P2-2. Manifesto page surfaces tone — but wasn't loaded
- `/leadership` is a standalone MDX renderer. The home page subtitle doesn't link to it. Not a single home section references the manifesto. For in-group trust in a conservative Russian B2B market, the manifesto is where the CEO's voice lives — it should be 1 click from hero, with a pullquote on home.
- Fix: add a small "О том, как мы работаем" card in `Consultation` or below `Platforms` with a pullquote from the manifesto and "читать манифест →".
- [Flag to self: haven't read the MDX content of `/content/pages/leadership.mdx` — if the manifesto is generic, rewriting it should be higher than P2.]

### P2-3. `/virazh` "Последние статьи" is chronological, not strategic
- First 3 posts = newest 3 from a 42-post corpus. Whatever ranked latest in the migration is what readers see.
- Fix: curate 3 marquee posts (Операционная система / CFO / кейс Торпедо) as a hand-picked "Must reads for a CEO" block. Chronological feed goes at the bottom or on `/blog`.

### P2-4. Schema.org Product has `price: 0`
- `productSchema` in `/virazh/page.tsx` says `priceCurrency: "RUB", price: "0", description: "Свяжитесь для расчёта"`. Google may render this as "Free" in rich results. Worse, "price: 0" on a platform that's going to sell for 5–50M₽ a year is a signal pollution.
- Fix: remove `offers.price`, or use `Offer: AggregateOffer` with a priceRange (anti-Capital USP from HANDOFF.md line 69 explicitly says "show range"). If no range yet, drop `offers` entirely.

### P2-5. Career page — hero is solid, one tweak
- "Карьерные возможности в компании, которая меняет игру. Мы делаем лучший софт для спортивной индустрии — и ищем тех, кто хочет это делать вместе с нами."
- "Лучший софт" is a claim — backs up with what? The career page has no portfolio numbers, no client list. A senior candidate from Yandex or Avito will Google БЦТ in 20 seconds — so the home page has to do the selling. But on the career page, specificity wins over "лучший".
- Minor fix: replace "лучший софт" with "софт, которым пользуется 250 000 болельщиков в КХЛ каждый сезон" or similar. Same pattern as P1-3.

### P2-6. Career values copy is generic (standard B2B/HR set)
- Открытость / Свобода / Развитие / Адаптация / Всегда на связи / Неравнодушие. These are 6 words that describe any 15-person digital shop in Moscow.
- Fix: if you keep 6 values, make 3 of them specific to the domain. E.g. "Спортивная насмотренность: каждый сотрудник ездит хотя бы на 1 матч клиента в сезон", "Data reading: аналитика — обязательный навык вне зависимости от роли", "Работаем в цикле сезона: релизы под старт, а не под квартал". Values that couldn't be pasted into Mindbox's career page.

### P2-7. Home metadata description is 2 clients too many, 1 too thin
- Current: "CRM Вираж, мобильные приложения и маркетинг для клубов КХЛ и РПЛ. Клиенты: ХК Торпедо, ХК Адмирал, ПФК Крылья Советов. 10+ лет в спорте."
- Торпедо is great. Адмирал is a smaller club (Владивосток) — not the strongest anchor. Авангард is missing, which is the biggest name in the portfolio. Also, "10+ лет в спорте" contradicts hero eyebrow "с 2014" (= 12 years).
- Fix: "Операционная система для клубов КХЛ и стадионов. В проде у ХК Авангард, Торпедо, Динамо. CRM Вираж, приложения, программы лояльности — с 2014."

### P2-8. Meta `title` pattern for home
- Current: "Digital-агентство для спортивных клубов".
- This is a search-intent mismatch with the stated positioning. A CFO Googling "операционная система клуба" / "управление стадионом CRM" doesn't hit this title. Shift to "Операционная система для клубов и стадионов — БЦТ" or "Вираж и БЦТ — операционная система спортивного клуба".

---

## P3 — Nice to have

- **P3-1.** Add a "Видео в раздевалке / на арене" loop hero on `/virazh` — material exists per HANDOFF.md dev notes. Kinetic hero × sports = instant in-group signal.
- **P3-2.** Add integration logos (KHL, РПЛ, ticketing system brands like Радарио/Кассир/Интикетс, billing) as a strip on `/virazh`. Shows "вас не отключат от системы для продажи билетов" without writing that sentence.
- **P3-3.** Add a "В прессе о нас" strip IF there are media mentions (RB.ru, VC.ru, Matchtv interview). If there aren't, this is a content/PR item, not a site item.
- **P3-4.** Add a tiny "Подкаст/интервью" embed if Виталий has a video interview with a KHL exec. In-group bond is fastest when the viewer sees founder on turf.
- **P3-5.** Research block — even after fixing reciprocity (P0-5), consider 3 separate downloadable artefacts (Методичка клуба / Методичка стадиона / Чек-лист подготовки к сезону). Gives 3 entry points for different personas.
- **P3-6.** Add "Для кого" persona switcher on `/virazh` (Клуб / Стадион / Федерация / Падел-клуб). Light client-side toggle that swaps 3 headlines. Pattern Teamworks uses.
- **P3-7.** Add a quiet "Сравнение с Capital" card on `/virazh` — per HANDOFF.md this is a stated anti-Capital USP. Don't name them; just list the 3 differences (platform vs tool, pricing shown, outcome-based proof). Reads as confidence without naming a fight.

---

## Hero headline tests

### Home (`/`) — 5 alternatives

Each goes with a reason, a bias, and a persona fit.

1. **"Операционная система клуба и стадиона"**
   - *Bias: category reframing (Eugene Schwartz's "next stage of awareness").* Moves buyer from "CRM-tool shopper" to "OS buyer" — different budget line.
   - *Persona: arena director, CEO, CFO.* Fits the HANDOFF.md strategic shift directly.
   - *Risk:* abstract. Needs a stats strip + proof row below to land.

2. **"Единая платформа для КХЛ, РПЛ и спортивных федераций"**
   - *Bias: social proof in the headline itself + in-group.* Doesn't say what it does — tells who uses it.
   - *Persona: decision-maker who Googles "CRM КХЛ" or is sent a link by their network.*
   - *Risk:* still reads CRM-ish. Best as subhead beneath a stronger H1.

3. **"Перестраиваем операционку клуба за один сезон"**
   - *Bias: loss aversion + time anchor + outcome frame.* Season is the real deadline.
   - *Persona: CEO/COO of an arena or club that had a bad sales year.*
   - *Risk:* implies services+product (consultancy flavor). Only use if БЦТ sells bundled transformation, which per HANDOFF.md they do.

4. **"10 лет операционки спорта в одной платформе"**
   - *Bias: authority (10 years) + bundling.*
   - *Persona: CEO/CFO who buys based on track record.*
   - *Risk:* close to the current generic tone. Needs the stats strip to carry weight.

5. **"В проде у Авангарда, Торпедо и Динамо — операционная система спортивного клуба"**
   - *Bias: social proof + specificity + in-group (three KHL names).*
   - *Persona: КХЛ peer (other 25+ clubs); arena director who knows these names.*
   - *Risk:* long, breaks 6-word headline rule. Works only if typography lets two lines breathe. Strongest directional candidate for the current target of whale-hunting KHL.

**Recommendation:** primary H1 = #1 ("Операционная система клуба и стадиона"), eyebrow = "БЦТ · в проде у Авангарда, Торпедо, Динамо · с 2014", subtitle = "5 модулей — фанаты, билеты, бренд, выручка, аналитика. На одной платформе." CTA primary = "Демо за 30 минут", secondary = "Скачать кейс Торпедо (PDF)".

### `/virazh` — 5 alternatives

1. **"Вираж. Операционная система клуба и стадиона."**
   - *Bias: product naming + category reframe.* The brand carries the promise.
   - *Persona: CEO/CFO already shown the deck, now verifying online.*
   - *Fit: matches HANDOFF.md sub-tagline structure.*

2. **"Один Вираж — все процессы клуба."**
   - *Bias: chunking/mental model consolidation + cost-reduction frame (CFOs love "один" instead of "восемь подрядчиков").*
   - *Persona: CFO/COO sick of managing 8 vendors (билеты, CRM, мобайл, сайт, лояльность, email, аналитика, спонсорка).*

3. **"CRM, билеты, лояльность, приложение, аналитика — одна система."**
   - *Bias: anti-fragmentation + explicit feature anchor.*
   - *Persona: маркетолог клуба / операционный директор, сравнивающий Вираж с Capital.*
   - *Risk:* still reads as feature list. Use as H2, not H1.

4. **"Выручку клуба считают в Вираже."**
   - *Bias: outcome + social proof (implied "так делают все, кто на Вираже").*
   - *Persona: CFO; CEO; коммерческий директор.*
   - *Good hook if Revenue OS is in prod — per HANDOFF.md it's in development, so careful with tense.*

5. **"Сезон на одной платформе: болельщики, билеты, бренд, выручка."**
   - *Bias: temporal anchor (сезон = natural urgency) + bundling.*
   - *Persona: CEO/CFO mid-preseason planning.*

**Recommendation:** primary H1 = #1 ("Вираж. Операционная система клуба и стадиона."), subtitle = HANDOFF.md tagline "Всё для фанатов, бренда, команды и выручки — на одной платформе. В проде у Авангарда, Торпедо, Динамо". CTA primary = "Посмотреть Вираж: 3 экрана (демо)", secondary = "Как внедряли в Торпедо НН — кейс-PDF".

---

## Missing page content (for arena-director persona)

The user is next building `/virazh/arenas`. For a COO/CEO of СКА Арены, Мегаспорт, ВТБ Арены, ЦСКА Арены, or a new-built regional arena to stay 90 seconds on the page, it must cover:

1. **Arena-specific hero** — vocabulary that signals "this isn't a club CRM with a rename". Words that do the work: "посадка", "проходы", "F&B", "мерч", "парковка", "access control", "yield management", "turnover per seat", "событийный календарь", "non-matchday revenue".

2. **A named arena case study** — even a small one. If no arena currently uses Вираж end-to-end (probable per HANDOFF.md — strategy is young), use an "arena mode of клуб-кейс" reframe: "ХК Торпедо — арена Нагорная: 15 291 проходов через единую систему". If literally no arena installation exists, say so plainly: "Вираж в 2026 запускается на 2 площадках, заявки на участие — [CTA]" (scarcity + early-access framing). Do NOT fake an arena case.

3. **TCO / okupáemost block** — CFOs at arenas think in TCO over 3–5 years. Page needs: "Во сколько обходится фрагментированный стек (билетная система + CRM + касса + мерч + приложение + лояльность)?" vs "Вираж как единый стек". Visual: 2 columns, 5–6 line items each, total annual spend. Even a diapason (HANDOFF.md explicitly says anti-Capital USP is showing price) beats nothing.

4. **Integration diagram** — what does Вираж plug into on an arena stack? Ticketing vendors (Радарио/Кассир/Интикетс/Qtickets/local custom), access control (турникеты, RFID), кассовые системы F&B, CCTV, парковка. Even a static schematic with 6 boxes and "мы не ломаем существующий стек, мы становимся single-pane".

5. **Matchday + non-matchday coverage** — arena directors think in utilization rate. A club is 40 matches/year; an arena is 200 events/year (concerts, corporate, кубковые, выставки). Page needs: "Вираж работает не только на матчах клуба — концерт, турнир, корпоратив, выставка — всё в одной событийной CRM".

6. **Ops & capacity planning story** — personalization of fan offers is a club story. An arena story is "как мы управляем нагрузкой на F&B в 3-ем перерыве", "как предсказываем опоздания на матч по данным парковки", "как сегментируем абонементщика vs разового зрителя на скидку на мерч". 3 operational use-cases, not 3 marketing use-cases.

7. **Roles row** — who on the arena team uses Вираж? CFO (отчёты + non-matchday P&L), COO (операционная панель), директор билетной программы (ценообразование, yield), директор по маркетингу (сегментация, рассылки, лояльность), директор F&B (прогноз спроса), служба безопасности (проходы, инциденты). 6 mini-cards. This says "мы думали про всех людей в вашем здании, не только про маркетолога".

8. **Compliance/security signal** — Russian arena = критическая инфраструктура. ФЗ-152 (персональные данные), возможно ФЗ-54 (ККТ). One paragraph saying "хранение данных в РФ, сертификат ФСТЭК [если есть] / соответствие 152-ФЗ". Without this a security officer blocks the deal.

9. **Migration/implementation timeline** — "подключение к сезону" — realistic 8–12 week plan. Arena director buys confidence that he won't blow up midseason: "первые 4 недели — data migration, 5–8 — пилотный матч, 9–12 — полный рольаут". Not a Gantt chart — just 3 phases.

10. **Scalability + future modules** — per HANDOFF.md, 5 модулей, 2 в roadmap. Page should show: what's in prod today (Fan, Ops, Brand), what's being built (Revenue OS = Stadium System merge), what's Q3–Q4 (Intelligence). Manager360 pattern — buyer sees they're buying a platform, not a point product.

11. **Decision-maker objections FAQ** — "Чем вы отличаетесь от Capital?", "Чем отличаетесь от Klientiks/Cliniki пакетов?", "А если вы закроетесь через 2 года?" (key worry for sub-50-person vendor selling to 50M₽ budget). 4–6 Qs.

12. **Analyst / media / awards row** — even one. If КХЛ назвал приложение Авангарда лучшим в 2021, that line belongs on `/virazh/arenas` in a "Нас видят в индустрии" block. If no awards, replace with "Спикеры на [SportsTech forum]" or "Гости подкаста [X]". Needs one external validation line.

13. **Pricing anchor** — per HANDOFF.md line 69: "показать диапазон". Three tiers, rough ranges, even "от X млн ₽/сезон, полная картина — после интро-звонка". Arena directors reject vendors who hide price. If pricing is entirely non-public, use a self-calculator: "оцените цену — 3 вопроса" (ops size / events per year / fan base).

14. **Two-CTA ending** — different from home. "Демо за 30 минут с CEO" + "Интро-встреча с коммерческим директором Торпедо" (реальный клиент в качестве референса — peer-to-peer CTA is a killer move for arena buyers because it's a whale-to-whale intro).

---

## Cognitive biases currently underused

From the marketing-psychology skill bank — biases not currently exploited or under-deployed, with concrete placement suggestions:

| Bias | Currently | Suggested placement |
|---|---|---|
| **Anchoring** | Stats only on `/virazh`, not home, no context for "4 млн заказов" | Home hero stat strip: "4 млн заказов · 250 000 пользователей · 6 клубов КХЛ · 10 лет". Add period footnote ("за сезон 2024/25") to source the claim. |
| **Social proof (specific)** | Logo wall (8 logos); testimonials block | Add 1 named quote above the fold in the hero ("— Константин, ком. дир ХК Авангард"). Use "250 000 активных пользователей" somewhere as a specific social-proof number. |
| **Authority (named)** | CEO appears only in footer contact | Add Виталий's name + role + tenure in eyebrow or near hero CTA. Consider an "О лидере" card on `/virazh` linking to `/leadership`. |
| **Loss aversion** | Zero | "Без Виража клуб теряет Х% выручки в межсезонье" / "Сезон не ждёт — подключаемся за 8 недель". Put on `/virazh` near the bottom + in `/virazh/arenas`. |
| **Scarcity** | Zero | "Берём 3–5 новых клубов в сезон 2025/26" (if true — flag [CLAIM: verify]) on a banner. Or, if Intelligence is limited-beta: "Intelligence-модуль — 3 пилотных клиента, заявки до [дата]". |
| **Reciprocity** | Broken — research claims but doesn't deliver | Fix P0-5: gated PDF with email capture. Send 3-email sequence after download (kickstarts consistency bias). |
| **Commitment & consistency** | Zero micro-commitments on the page | Add lightweight yes-steps: "Читайте 1 кейс → вы наш читатель → получите второй кейс". Via email sequence after research download. |
| **Category authority** | Implicit | Claim the category explicitly: "Мы называем это Operating System for Sports. По-русски — операционной системой клуба." Naming the category = owning it. Cf. Teamworks. |
| **Contrast (vs. Capital)** | Zero | A "sound of silence" card comparing Вираж vs. tool-only competitor without naming them. Per P3-7. |
| **In-group bias / tribe** | Partial — logos convey, copy doesn't | Rewrite 2–3 CTAs in sports language ("К сезону готов?", "Свистнули Вираж", "Разбор игры — 30 минут"). Careful: overcooked is cringe for conservative CFOs. 1–2 micro-uses max. |
| **Endowment effect** | Zero | Free audit / free "Cверка операционки со стандартом Виража" — user walks away with a personalized document they wrote answers into. Now they feel it's partly theirs. |
| **IKEA effect** | Zero | Calculator: "Оцените окупаемость Виража в сезон" — user plugs 3 numbers, gets a result. They now co-authored the case for the purchase. |
| **Peak-end rule** | Weak | Last thing the reader sees on `/virazh` is a generic contact form. Make the end memorable — a single powerful line + 1 photo of team on-site at a KHL arena. |
| **Narrative transportation** | Zero | One long-form case study written as a story (6 paragraphs, not a card). "Как мы за 1 межсезонье перевели Торпедо на Вираж" — dated, named, numbered. Currently buried as a blog post at best. |
| **Status quo / switching cost reduction** | Weak | "Работаете на самописной CRM? Мы мигрируем данные бесплатно к первому матчу сезона." Named, specific, removes the biggest objection. |

---

## Content strategy signals (blog leverage)

**Current state:**
- 42 posts migrated with MDX, full SEO metadata, images local. Excellent foundation.
- Home page: 0 links to blog. `/virazh`: 3 latest posts shown chronologically.
- Blog index page exists and works, but discovery from sales surfaces is broken.

**Blog is the biggest underused asset on the site.** The post titles visible in `content/blog/` include:
- `pochemu-v-rossii-nikomu-ne-nuzhna-sporti` (contrarian authority piece — classic thought leadership)
- `sistema-upravleniya-stadionom-novii-zapr` (literally the arena positioning story)
- `audit-biznes-protsessov-na-sportivnih-ob`
- `kak-sportivnie-klubi-rossii-vistraivayut`
- `top-5-oshibok-pri-vnedrenii-crm-v-sporti`
- `marketing-hokkeinog...` (hockey CFO language)
- `avtomatizatsiya-marketinga-kluba-crm-ras`
- `ii-v-industrii-upravleniya-zdaniyami` (AI + building management — arena tie-in!)

These posts answer exactly the questions a CEO/CFO of a club or arena types into Google before a vendor call. They are Виталий's voice, dated, published. They are the single strongest "this team thinks about the problem" signal that exists on this domain.

**Surface plan:**

1. **Home — add a "Что мы пишем" strip** (between Consultation and Contact). 3 handpicked posts:
   - One arena piece: "Система управления стадионом — новый запрос"
   - One CFO piece: "Почему в России никому не нужна спортивная CRM" (contrarian — great for breaking the "they sell me a CRM" frame)
   - One hockey peer piece: "Цифра на табло — как спортивные клубы приходят к цифровой трансформации"
   Use real post titles — pulled manually, not auto-sorted.

2. **`/virazh` — replace chronological feed with editorial picks.** Same pattern, curated for product-evaluating reader.

3. **`/virazh/arenas` (new) — dedicated "Arena Insight" block** with 3–5 arena-focused posts. Use post filter by tag or manual list.

4. **Per-post upgrades (separate sprint):**
   - Every blog post should have a CTA to "Разобрать ваш клуб с Виталием (30 мин)" inline after the 3rd paragraph and at the end.
   - Add "Похожие материалы" at the bottom, curated.
   - Add author byline card with Виталий's photo and "Связаться с автором" button.

5. **New content bets (quarterly):** 3 pillar posts aimed at arena director keyword intent:
   - "Операционная система арены: что это и зачем" (категорийный)
   - "Как посчитать TCO единой системы vs 7 отдельных" (CFO-magnet)
   - "Сезон без факапов: 12-недельный план подключения новой платформы к матчам" (операционная, near-term buyer)
   Plus 1 padel blue-ocean piece per HANDOFF.md SEO priority.

6. **Internal linking:** from the 42 posts → `/virazh/[module]` / `/virazh/arenas` / `/virazh/solutions/*` as they get built. Blog is where Google finds keyword clusters; product pages is where conversion happens. The two need to be stapled together.

7. **LinkedIn/email recycling:** top 10 posts should be turned into LinkedIn carousels + a monthly-digest email to the outreach list of 50 clubs from HANDOFF.md week-8 plan. 42 existing posts = ~10 months of distribution already paid for.

---

## Tone & register check

**Audience:** Russian B2B, sports management. Directors typically 40+, ex-спортсмены или ex-управленцы крупных ФПГ. Conservative. Prefer formal "вы", skeptical of startup language, respect numbers.

**Current site tone:**

- *Home hero*: "Развиваем технологии в спорте · Спортивный софт, операционные бизнес-процессы, аудит и консультации, автоматизация" — neutral/corporate, safe but forgettable. Not too startup-y, not too formal. Score: 5/10 — won't offend, won't memorable.
- *`/virazh` hero*: "Главная отечественная CRM-платформа для роста прибыли с продаж..." — "главная отечественная" leans patriotic-marketing. Reads as trying. Score: 4/10.
- *Career hero*: "Стать частью команды в Бюро Цифровых Технологий · ...которая меняет игру. Мы делаем лучший софт..." — "меняет игру" is cringe-adjacent; "лучший" is undefended. Score: 5/10 for a dev reader, 3/10 for a senior.
- *Consultation section*: "Когда хочешь сделать, но не знаешь как правильно, некого спросить, GPT выдает очевидную воду" — this is the ONE place on the site where the voice sounds human. Feels written by someone who actually works with clients. Keep that tone. Score: 8/10.
- *Research claim*: "Скачано 234 раза" — reads like Tilda-era template copy. Too specific to be impressive, too small to be authoritative.

**What's missing:** no "хоккейный" in-group vocabulary anywhere except в логотипах клубов. For a КХЛ ком. дир reading the page — zero clues that these are "our guys". The single best way to fix: one sentence in the hero / about block that only an insider could have written. Something like: "Мы рядом с ком. диром клуба каждую пятницу — от чертёжа абонементной воронки до ловли багов за час до матча." 1 sentence. Rest stays.

**Avoid adding:** "revolutionary", "cutting-edge", "seamless", "unlock", "take to the next level", "game-changing". Site is mostly clean of these — good. `/virazh` has 1 mild offender: "раскрыть потенциал клуба". Replace.

**Keep:** the numbers-first instinct (stats section on `/virazh`), the tabular tone on `Platforms` section, the clean typography.

---

## Summary of cross-page wins (if only doing P0)

1. Rewrite home H1 to positioning line (P0-1).
2. Add 3–4 number stat strip to home below hero (P0-2).
3. Reorder testimonials: Константин first (P0-3).
4. Replace 4 generic case cards with 4 number-led sports cards, drop non-sports cards from home (P0-4).
5. Fix or kill the research block (P0-5).
6. Rewrite both home and `/virazh` CTAs to specific, bounded actions (P0-6).
7. Make `Platforms` "Система управления стадионом" link to a dedicated URL (stub OK) and rewrite its description in arena vocabulary (P0-7).

Rough impact estimate: lifts "a COO of an arena reads past the fold" from ~0% today to plausibly 30–40%. Core product pages (`/virazh`, `/virazh/arenas`) close the rest.

---

## Open questions for user (flag to owner)

- **[VERIFY]** Is "4 млн заказов / 2 млн запросов/мес / 250 000 пользователей" — what's the time period and which installation? (Needed before adding to home stats strip.)
- **[VERIFY]** "Берём 3–5 новых клубов в сезон" — is this actually true? Scarcity claim must be real.
- **[DECIDE]** Drop Orbita.vc + Grid Capital testimonials from home, or keep on dedicated agency-history page?
- **[DECIDE]** English module names (Revenue/Fan/Ops/Brand/Intelligence) vs Russian (Выручка/Фанаты/Операции/Бренд/Аналитика) — per HANDOFF.md open question #3. Our copy recommendation: English for nav/category labels (sounds like platform, not feature), Russian for body copy and value-prop descriptions.
- **[DECIDE]** Is there a single arena installation ready to name as the anchor case for `/virazh/arenas`? If no — how to frame the page honestly without faking proof.
- **[ACCESS]** The `/leadership` MDX page was not audited here (content is in `content/pages/leadership.mdx`, which we didn't read). Recommend a follow-up read specifically for voice/tone since manifesto is load-bearing for in-group trust.

---

*End of audit. No site files were modified in producing this report.*
