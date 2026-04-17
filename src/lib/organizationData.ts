import { SITE_URL } from "./urls";

export const ORG_ID = `${SITE_URL}/#organization`;
export const PERSON_ID = `${SITE_URL}/#ceo`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

export const organizationData = {
  name: "Бюро Цифровых Технологий",
  alternateName: ["БЦТ", "Digital Buro"],
  url: SITE_URL,
  logo: `${SITE_URL}/images/home/_.jpg`,
  email: "access@digitalburo.tech",
  telegram: "https://t.me/digitalburo",
  foundingDate: "2014",
  description:
    "Digital-агентство для спортивных клубов и федераций. CRM Вираж, мобильные приложения, программы лояльности. Клиенты — Авангард, Торпедо, Динамо, Адмирал, Крылья Советов.",
  areaServed: "RU",
};

export const ceoData = {
  name: "Виталий Зарубин",
  jobTitle: "Генеральный директор",
  worksFor: organizationData.name,
  email: organizationData.email,
  sameAs: [organizationData.telegram],
};

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: organizationData.name,
    alternateName: organizationData.alternateName,
    url: organizationData.url,
    logo: {
      "@type": "ImageObject",
      url: organizationData.logo,
    },
    email: organizationData.email,
    description: organizationData.description,
    foundingDate: organizationData.foundingDate,
    sameAs: [organizationData.telegram],
    contactPoint: {
      "@type": "ContactPoint",
      email: organizationData.email,
      contactType: "sales",
      areaServed: organizationData.areaServed,
      availableLanguage: ["Russian"],
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: SITE_URL,
    name: organizationData.name,
    inLanguage: "ru-RU",
    publisher: { "@id": ORG_ID },
  };
}

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: ceoData.name,
    jobTitle: ceoData.jobTitle,
    worksFor: { "@id": ORG_ID },
    email: ceoData.email,
    sameAs: ceoData.sameAs,
  };
}
