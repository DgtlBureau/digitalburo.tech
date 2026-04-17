export const SITE_NAME = "Бюро Цифровых Технологий";
export const SITE_SHORT = "БЦТ";

export const primaryNav = [
  { href: "/virazh", label: "Клубы" },
  { href: "/virazh/arenas", label: "Арены" },
  { href: "/blog", label: "Блог" },
  { href: "/podcast", label: "Подкаст" },
  { href: "/career", label: "Карьера" },
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
    title: "Вираж",
    links: [
      { href: "/virazh", label: "Для клуба" },
      { href: "/virazh/arenas", label: "Для арены" },
      { href: "/virazh/arenas/brief", label: "One-pager" },
    ],
  },
  {
    title: "Контент",
    links: [
      { href: "/blog", label: "Блог" },
      { href: "/podcast", label: "Подкаст" },
      { href: "/rss.xml", label: "RSS" },
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
