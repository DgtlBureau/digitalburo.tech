import { testimonials } from "@/lib/homeData";

export function Testimonials() {
  return (
    <section className="border-b border-border bg-muted/20">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 md:py-28">
        <div className="mb-12">
          <p className="text-sm uppercase tracking-widest text-muted-foreground">
            Отзывы клиентов
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            О нас говорят
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <figure
              key={t.author}
              className="flex flex-col justify-between rounded-2xl border border-border bg-card p-6"
            >
              <blockquote className="text-foreground/90 leading-relaxed">
                «{t.quote}»
              </blockquote>
              <figcaption className="mt-5 text-sm">
                <div className="font-semibold">{t.author}</div>
                <div className="text-muted-foreground">{t.role}</div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
