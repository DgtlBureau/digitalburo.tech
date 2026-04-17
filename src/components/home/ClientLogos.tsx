import Image from "next/image";
import { clientLogos } from "@/lib/homeData";

export function ClientLogos() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto w-full max-w-6xl px-4 py-16">
        <p className="text-center text-sm uppercase tracking-widest text-muted-foreground">
          Нам доверяют клубы КХЛ, РПЛ и федерации
        </p>
        <div className="mt-8 grid grid-cols-2 gap-8 sm:grid-cols-4 lg:grid-cols-8">
          {clientLogos.map((logo) => (
            <div
              key={logo.name}
              className="flex h-14 items-center justify-center opacity-60 transition-opacity hover:opacity-100"
              title={logo.name}
            >
              <Image
                src={logo.src}
                alt={logo.name}
                width={120}
                height={48}
                className="max-h-12 w-auto object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
