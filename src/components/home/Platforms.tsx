import Link from "next/link";
import { platforms } from "@/lib/homeData";

export function Platforms() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto w-full max-w-6xl px-4 py-20 md:py-28">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-widest text-muted-foreground">
            Собственные платформы
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">
            Платформы БЦТ
          </h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {platforms.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl border border-border bg-card p-8"
            >
              <h3 className="text-2xl font-semibold tracking-tight">{p.title}</h3>
              <p className="mt-3 text-muted-foreground">{p.description}</p>
              <div className="mt-6">
                <Link
                  href="/virazh"
                  className="text-sm font-medium underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
                >
                  Смотреть презентацию →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
