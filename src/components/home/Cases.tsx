import Image from "next/image";
import { cases } from "@/lib/homeData";

export function Cases() {
  return (
    <section className="border-b border-border bg-muted/20">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 md:py-28">
        <div className="mb-12 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-widest text-muted-foreground">
              Развиваем спортклубы и не только
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
              Кейсы
            </h2>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cases.map((c) => (
            <article
              key={c.name}
              className="group relative flex min-h-[280px] flex-col justify-end overflow-hidden rounded-2xl border border-border bg-card p-6"
            >
              <div className="absolute inset-0 -z-10">
                <Image
                  src={c.image}
                  alt={c.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover opacity-40 transition-opacity duration-500 group-hover:opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-card/40" />
              </div>
              <div className="relative">
                <h3 className="text-xl font-semibold tracking-tight">{c.name}</h3>
                <p className="mt-2 text-sm text-foreground/80">{c.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {c.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-border/80 bg-background/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
