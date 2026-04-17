import { ButtonLink } from "@/components/ui/button-link";
import { consultation } from "@/lib/homeData";

export function Consultation() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 md:py-28">
        <div className="mb-12 max-w-3xl">
          <p className="text-sm uppercase tracking-widest text-muted-foreground">
            {consultation.subtitle}
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            {consultation.title}
          </h2>
          <p className="mt-4 text-muted-foreground">{consultation.intro}:</p>
          <ul className="mt-3 space-y-1 text-muted-foreground">
            {consultation.problems.map((p) => (
              <li key={p}>— {p}</li>
            ))}
          </ul>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {consultation.steps.map((s, i) => (
            <div
              key={s.title}
              className="rounded-2xl border border-border bg-card p-6"
            >
              <div className="text-sm font-mono text-muted-foreground">
                0{i + 1}
              </div>
              <h3 className="mt-3 text-xl font-semibold tracking-tight">
                {s.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <ButtonLink href="https://t.me/digitalburo" external size="lg" variant="outline">
            Задать вопрос в Telegram
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
