import type { Metadata } from "next";
import {
  arenasHero,
  arenasModules,
  arenasStats,
  arenasProcess,
} from "@/lib/arenasData";

export const metadata: Metadata = {
  title: "Вираж для арены — one-pager",
  description:
    "Распечатываемый one-pager: Вираж как операционная платформа спортивной арены.",
  alternates: { canonical: "/virazh/arenas/brief" },
  robots: { index: false, follow: false },
};

/**
 * Print-optimized one-pager. Viewer opens the page, Cmd+P → Save as PDF.
 * Header/Footer are auto-hidden via `print:hidden` on the chrome.
 * A4: keep content ≤ ~1050px tall for landscape; here we go portrait.
 */
export default function BriefPage() {
  return (
    <main className="brief-root mx-auto w-full max-w-[780px] bg-white px-8 py-10 text-[13px] leading-snug text-black print:max-w-full print:px-10 print:py-8 print:shadow-none">
      <style>{`
        @page { size: A4; margin: 12mm; }
        @media print {
          html, body { background: white !important; }
        }
        .brief-root h2, .brief-root h3 { font-family: var(--font-sans); }
      `}</style>

      {/* Header strip */}
      <header className="flex items-start justify-between gap-6 border-b-2 border-black pb-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.3em] text-neutral-500">
            Бюро Цифровых Технологий · 2014
          </div>
          <h1 className="mt-2 text-3xl font-bold leading-tight tracking-tight">
            Вираж — операционная платформа арены
          </h1>
        </div>
        <div className="text-right text-[11px] leading-tight text-neutral-600">
          <div>access@digitalburo.tech</div>
          <div>t.me/digitalburo</div>
          <div className="mt-1 font-semibold text-black">Виталий Зарубин, CEO</div>
        </div>
      </header>

      {/* Positioning */}
      <section className="mt-5">
        <p className="text-[15px] leading-relaxed">
          {arenasHero.subtitle}
        </p>
      </section>

      {/* Stats row */}
      <section className="mt-6 grid grid-cols-3 gap-4 rounded-md bg-neutral-100 p-4">
        {arenasStats.map((s) => (
          <div key={s.label}>
            <div className="text-2xl font-bold tracking-tight">{s.value}</div>
            <div className="mt-1 text-[11px] leading-tight text-neutral-700">
              {s.label}
            </div>
            <div className="mt-1 text-[10px] text-neutral-500">{s.note}</div>
          </div>
        ))}
      </section>

      {/* Modules */}
      <section className="mt-6">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">
          Шесть модулей
        </h2>
        <div className="mt-3 grid grid-cols-2 gap-x-5 gap-y-3">
          {arenasModules.map((m) => (
            <div key={m.title}>
              <div className="text-[13px] font-semibold">{m.title}</div>
              <p className="mt-0.5 text-[11px] leading-snug text-neutral-700">
                {m.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className="mt-6">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">
          От договора до первого матча — 8-12 недель
        </h2>
        <ol className="mt-3 grid grid-cols-4 gap-3">
          {arenasProcess.map((p, i) => (
            <li key={p.title} className="rounded-md border border-neutral-300 p-3">
              <div className="text-[10px] font-mono text-neutral-500">
                0{i + 1} · {p.week}
              </div>
              <div className="mt-1 text-[12px] font-semibold">{p.title}</div>
              <p className="mt-1 text-[10.5px] leading-snug text-neutral-700">
                {p.description}
              </p>
            </li>
          ))}
        </ol>
      </section>

      {/* Client list */}
      <section className="mt-6 border-t border-neutral-300 pt-4">
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">
          В проде у
        </h2>
        <p className="mt-2 text-[13px] font-semibold">
          ХК Авангард · ХК Торпедо Нижний Новгород · ХК Динамо Москва · ХК Адмирал
          · ХК Трактор · ПФК Крылья Советов
        </p>
      </section>

      {/* Footer / CTA */}
      <footer className="mt-7 border-t-2 border-black pt-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-neutral-500">
              Следующий шаг
            </div>
            <div className="mt-1 text-[15px] font-semibold">
              Запросить стоимость — 30 минут с CEO
            </div>
            <div className="mt-1 text-[11px] text-neutral-600">
              Оцениваем на основе объёма событий, стека и задач сезона.
            </div>
          </div>
          <div className="text-right text-[11px] text-neutral-600">
            digitalburo.tech/virazh/arenas
          </div>
        </div>
      </footer>
    </main>
  );
}
