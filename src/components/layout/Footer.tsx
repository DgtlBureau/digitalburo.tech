import Link from "next/link";
import { footerSections, SITE_NAME } from "@/lib/nav";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-border/60 bg-muted/30">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <div>
          <div className="text-lg font-semibold tracking-tight">{SITE_NAME}</div>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            Digital-агентство для спортивных клубов и федераций. CRM, мобильные приложения,
            программы лояльности.
          </p>
        </div>
        {footerSections.map((section) => (
          <div key={section.title}>
            <div className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
              {section.title}
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              {section.links.map((link) => (
                <li key={link.href}>
                  {"external" in link && link.external ? (
                    <a
                      href={link.href}
                      className="text-foreground/80 hover:text-foreground"
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href} className="text-foreground/80 hover:text-foreground">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-2 px-4 py-5 text-xs text-muted-foreground md:flex-row md:items-center">
          <span>© {year} {SITE_NAME}. Все права защищены.</span>
          <Link href="/policy" className="hover:text-foreground">
            Политика конфиденциальности
          </Link>
        </div>
      </div>
    </footer>
  );
}
