import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { Hero } from "@/components/home/Hero";
import { Cases } from "@/components/home/Cases";
import { ClientLogos } from "@/components/home/ClientLogos";
import { Platforms } from "@/components/home/Platforms";
import { Research } from "@/components/home/Research";
import { Consultation } from "@/components/home/Consultation";
import { Testimonials } from "@/components/home/Testimonials";
import { Contact } from "@/components/home/Contact";

export const metadata: Metadata = {
  title: "Digital-агентство для спортивных клубов",
  description:
    "CRM Вираж, мобильные приложения и маркетинг для клубов КХЛ и РПЛ. Клиенты: ХК Торпедо, ХК Адмирал, ПФК Крылья Советов. 10+ лет в спорте.",
  alternates: { canonical: "/" },
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Бюро Цифровых Технологий",
  url: "https://digitalburo.tech",
  logo: "https://digitalburo.tech/images/home/_.jpg",
  email: "access@digitalburo.tech",
  sameAs: ["https://t.me/digitalburo"],
  description:
    "Digital-агентство для спортивных клубов и федераций. CRM, мобильные приложения, программы лояльности.",
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={orgSchema} />
      <Hero />
      <ClientLogos />
      <Cases />
      <Platforms />
      <Research />
      <Consultation />
      <Testimonials />
      <Contact />
    </>
  );
}
