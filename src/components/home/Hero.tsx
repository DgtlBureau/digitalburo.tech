import { ButtonLink } from "@/components/ui/button-link";
import { heroEyebrow, heroTitle, heroSubtitle } from "@/lib/homeData";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="mx-auto w-full max-w-6xl px-4 py-24 md:py-36">
        <p className="mb-6 text-sm font-medium uppercase tracking-[0.2em] text-muted-foreground">
          {heroEyebrow}
        </p>
        <h1 className="max-w-4xl text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
          {heroTitle}
        </h1>
        <p className="mt-8 max-w-3xl text-lg text-muted-foreground md:text-xl">
          {heroSubtitle}
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href="/virazh/arenas" size="lg">
            Вираж для арены
          </ButtonLink>
          <ButtonLink href="/virazh" size="lg" variant="outline">
            Вираж для клуба
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
