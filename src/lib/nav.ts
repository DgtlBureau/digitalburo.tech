export const SITE_NAME = "Бюро Цифровых Технологий";
export const SITE_SHORT = "БЦТ";

export const primaryNav = [
  { href: "/virazh", label: "Вираж" },
  { href: "/blog", label: "Блог" },
  { href: "/podcast", label: "Подкаст" },
  { href: "/career", label: "Карьера" },
  { href: "/leadership", label: "Манифест" },
] as const;

export const footerSections = [
  {
    title: "Компания",
    links: [
      { href: "/leadership", label: "Манифест" },
      { href: "/career", label: "Карьера" },
      { href: "/policy", label: "Политика конфиденциальности" },
    ],
  },
  {
    title: "Продукты",
    links: [
      { href: "/virazh", label: "CRM Вираж" },
      { href: "/blog", label: "Блог" },
      { href: "/podcast", label: "Подкаст" },
    ],
  },
  {
    title: "Контакты",
    links: [
      { href: "mailto:access@digitalburo.tech", label: "access@digitalburo.tech" },
      { href: "https://t.me/digitalburo", label: "Telegram", external: true },
    ],
  },
] as const;
