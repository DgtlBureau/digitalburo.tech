import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MdxContent } from "@/components/mdx/MdxContent";
import { ButtonLink } from "@/components/ui/button-link";
import { JsonLd } from "@/components/JsonLd";
import {
  getAllVacancies,
  getVacancyBySlug,
  vacancyCleanSlug,
  type Vacancy,
} from "@/lib/content";
import { absoluteUrl } from "@/lib/urls";
import { ORG_ID, organizationData } from "@/lib/organizationData";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getAllVacancies().map((v) => ({ slug: vacancyCleanSlug(v) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const vacancy = getVacancyBySlug(slug);
  if (!vacancy) return {};
  return {
    title: vacancy.frontmatter.title,
    description: vacancy.frontmatter.description ?? undefined,
    alternates: { canonical: `/career/${slug}` },
    openGraph: {
      type: "article",
      title: vacancy.frontmatter.title,
      description: vacancy.frontmatter.description ?? undefined,
      url: `/career/${slug}`,
    },
  };
}

/**
 * Compute validThrough = today + 180 days. Rebuilt on every deploy, so the
 * posting stays "fresh" to Google for Jobs as long as the vacancy is on the
 * site. Static build date is good enough — if a vacancy closes, delete the MDX.
 */
function validThrough(): string {
  const d = new Date();
  d.setDate(d.getDate() + 180);
  return d.toISOString().split("T")[0];
}

function jobPostingSchema(vacancy: Vacancy, slug: string) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: vacancy.frontmatter.title,
    description: vacancy.frontmatter.description ?? vacancy.frontmatter.title,
    datePosted: new Date().toISOString().split("T")[0],
    validThrough: validThrough(),
    employmentType: "FULL_TIME",
    hiringOrganization: {
      "@id": ORG_ID,
      "@type": "Organization",
      name: organizationData.name,
      sameAs: organizationData.url,
      logo: organizationData.logo,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressCountry: "RU",
      },
    },
    applicantLocationRequirements: {
      "@type": "Country",
      name: "Russia",
    },
    jobLocationType: "TELECOMMUTE",
    url: absoluteUrl(`/career/${slug}/`),
    directApply: false,
  };
}

function breadcrumbSchema(title: string, slug: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Главная", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Карьера", item: absoluteUrl("/career/") },
      { "@type": "ListItem", position: 3, name: title, item: absoluteUrl(`/career/${slug}/`) },
    ],
  };
}

export default async function VacancyPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const vacancy = getVacancyBySlug(slug);
  if (!vacancy) notFound();

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12 md:py-20">
      <JsonLd
        data={[jobPostingSchema(vacancy, slug), breadcrumbSchema(vacancy.frontmatter.title, slug)]}
      />
      <nav className="mb-8 text-sm text-muted-foreground">
        <Link href="/career" className="hover:text-foreground">
          ← Все вакансии
        </Link>
      </nav>
      <header className="mb-10">
        <p className="text-sm uppercase tracking-widest text-muted-foreground">
          Вакансия
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-5xl md:leading-tight">
          {vacancy.frontmatter.title}
        </h1>
        {vacancy.frontmatter.description ? (
          <p className="mt-5 text-lg text-muted-foreground md:text-xl">
            {vacancy.frontmatter.description}
          </p>
        ) : null}
      </header>
      <div className="post-body">
        <MdxContent source={vacancy.body} />
      </div>
      <div className="mt-12 rounded-2xl border border-border bg-card p-8">
        <h2 className="text-2xl font-semibold tracking-tight">Откликнуться</h2>
        <p className="mt-2 text-muted-foreground">
          Отправьте CV на{" "}
          <a href="mailto:access@digitalburo.tech" className="underline hover:text-foreground">
            access@digitalburo.tech
          </a>{" "}
          или напишите в Telegram.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <ButtonLink
            href={`mailto:access@digitalburo.tech?subject=Отклик на вакансию: ${encodeURIComponent(
              vacancy.frontmatter.title,
            )}`}
            size="lg"
          >
            Написать на почту
          </ButtonLink>
          <ButtonLink href="https://t.me/digitalburo" external size="lg" variant="outline">
            Telegram
          </ButtonLink>
        </div>
      </div>
    </main>
  );
}
