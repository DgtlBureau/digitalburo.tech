import { Button } from "@/components/ui/button";
import { research } from "@/lib/homeData";

export function Research() {
  return (
    <section className="border-b border-border bg-foreground text-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-20 md:flex-row md:items-center md:justify-between md:py-28">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-widest opacity-70">Исследование</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
            {research.title}
          </h2>
          <p className="mt-4 opacity-80">{research.description}</p>
          <div className="mt-5 flex items-center gap-4 text-sm opacity-60">
            <span>{research.downloads}</span>
            <span aria-hidden>•</span>
            <span>{research.size}</span>
          </div>
        </div>
        <div>
          <Button variant="secondary" size="lg">
            Просмотреть исследование
          </Button>
        </div>
      </div>
    </section>
  );
}
