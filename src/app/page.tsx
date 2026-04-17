import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { Hero } from "@/components/home/Hero";
import { StatsStrip } from "@/components/home/StatsStrip";
import { Cases } from "@/components/home/Cases";
import { ClientLogos } from "@/components/home/ClientLogos";
import { Platforms } from "@/components/home/Platforms";
import { Consultation } from "@/components/home/Consultation";
import { Testimonials } from "@/components/home/Testimonials";
import { Contact } from "@/components/home/Contact";
import {
  organizationSchema,
  websiteSchema,
  personSchema,
} from "@/lib/organizationData";

export const metadata: Metadata = {
  title: "Операционная система для клубов и стадионов",
  description:
    "CRM Вираж, мобильные приложения и программы лояльности для клубов КХЛ и РПЛ. В проде у Авангарда, Торпедо, Динамо, Адмирала. В спорте с 2014.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={[organizationSchema(), websiteSchema(), personSchema()]} />
      <Hero />
      <StatsStrip />
      <ClientLogos />
      <Platforms />
      <Cases />
      <Testimonials />
      <Consultation />
      <Contact />
    </>
  );
}
