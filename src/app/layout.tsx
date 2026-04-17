import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
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
    default: "Бюро Цифровых Технологий — digital для спортивных клубов",
    template: "%s — Бюро Цифровых Технологий",
  },
  description:
    "CRM Вираж, мобильные приложения и маркетинг для клубов КХЛ и РПЛ. Клиенты: ХК Торпедо, ХК Адмирал, ПФК Крылья Советов.",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://digitalburo.tech",
    siteName: "Бюро Цифровых Технологий",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
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
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
