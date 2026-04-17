import { loadDir } from "./loader";
import { VacancyFrontmatterSchema, type Vacancy } from "./types";

function cleanSlug(slug: string): string {
  return slug.replace(/^[a-z0-9]{10}-/, "");
}

let cache: Vacancy[] | null = null;

export function getAllVacancies(): Vacancy[] {
  if (cache) return cache;
  cache = loadDir("vacancies", VacancyFrontmatterSchema);
  return cache;
}

export function getVacancyBySlug(slug: string): Vacancy | null {
  return (
    getAllVacancies().find(
      (v) => cleanSlug(v.frontmatter.slug) === slug || v.frontmatter.slug === slug,
    ) ?? null
  );
}

export function vacancyCleanSlug(vacancy: Vacancy): string {
  return cleanSlug(vacancy.frontmatter.slug);
}
