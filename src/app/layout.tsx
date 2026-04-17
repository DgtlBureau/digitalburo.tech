import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://digitalburo.tech"),
  title: {
    default: "Бюро Цифровых Технологий — Операционная система клуба и стадиона",
    template: "%s — Бюро Цифровых Технологий",
  },
  description:
    "CRM Вираж, мобильные приложения и программы лояльности для клубов КХЛ и РПЛ. В проде у Авангарда, Торпедо, Динамо, Адмирала. В спорте с 2014.",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://digitalburo.tech",
    siteName: "Бюро Цифровых Технологий",
    images: [
      {
        url: "/images/og-default.jpg",
        width: 1680,
        height: 882,
        alt: "Бюро Цифровых Технологий — операционная система клуба и стадиона",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    types: {
      "application/rss+xml": "/rss.xml",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Header />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
