import { heroStats } from "@/lib/homeData";

export function StatsStrip() {
  return (
    <section className="border-b border-border bg-foreground text-background">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 md:py-16">
        <div className="grid gap-8 md:grid-cols-3">
          {heroStats.map((s) => (
            <div key={s.label}>
              <div className="text-5xl font-semibold tracking-tight md:text-6xl">
                {s.value}
              </div>
              <div className="mt-3 text-sm leading-relaxed opacity-80">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
