import type { Metadata } from "next";
import { MdxContent } from "@/components/mdx/MdxContent";
import { getPage } from "@/lib/content";

export const metadata: Metadata = {
  title: "Манифест",
  description:
    "Манифест Бюро Цифровых Технологий. О том, как мы делаем продукты для спорта.",
  alternates: { canonical: "/leadership" },
};

export default function LeadershipPage() {
  const page = getPage("leadership");
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-16 md:py-28">
      <p className="text-sm uppercase tracking-widest text-muted-foreground">
        Манифест
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
        Бюро Цифровых Технологий
      </h1>
      <p className="mt-6 text-lg text-muted-foreground md:text-xl">
        Основные темы «Манифеста» — интеграция приложений, обзор функций, обслуживание
        пользователей.
      </p>
      <div className="mt-12 border-t border-border pt-10">
        <MdxContent source={page.body} />
      </div>
    </main>
  );
}
