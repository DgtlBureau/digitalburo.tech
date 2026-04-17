import type { Metadata } from "next";
import { MdxContent } from "@/components/mdx/MdxContent";
import { getPage } from "@/lib/content";

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  description: "Политика обработки персональных данных digitalburo.tech.",
  alternates: { canonical: "/policy" },
  robots: { index: false, follow: true },
};

export default function PolicyPage() {
  const page = getPage("policy");
  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-16 md:py-24">
      <h1 className="mb-8 text-3xl font-semibold tracking-tight md:text-4xl">
        {page.frontmatter.title}
      </h1>
      <div className="text-sm leading-relaxed text-foreground/90 [&_p]:my-4">
        <MdxContent source={page.body} />
      </div>
    </main>
  );
}
