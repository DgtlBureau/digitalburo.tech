import type { Metadata } from "next";
import { getAllPosts } from "@/lib/content";
import { PostCard } from "@/components/blog/PostCard";

export const metadata: Metadata = {
  title: "Блог",
  description:
    "Статьи Бюро Цифровых Технологий о спорте, технологиях, CRM-системах для клубов и маркетинге.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-16 md:py-24">
      <header className="mb-10 md:mb-14">
        <p className="text-sm uppercase tracking-widest text-muted-foreground">Блог</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
          Цифровые технологии и спорт
        </h1>
        <p className="mt-4 max-w-2xl text-muted-foreground">
          {posts.length}{" "}
          {posts.length === 1 ? "статья" : posts.length < 5 ? "статьи" : "статей"} о CRM,
          болельщиках, управлении клубом и стадионом, технологиях в спорте.
        </p>
      </header>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.frontmatter.slug} post={post} />
        ))}
      </div>
    </main>
  );
}
