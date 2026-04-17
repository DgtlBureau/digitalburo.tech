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
