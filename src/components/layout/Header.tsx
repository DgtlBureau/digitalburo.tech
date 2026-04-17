import Link from "next/link";
import { primaryNav, SITE_SHORT } from "@/lib/nav";
import { ButtonLink } from "@/components/ui/button-link";

export function Header() {
  return (
    <header className="print:hidden sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-foreground text-background text-sm font-bold">
            {SITE_SHORT[0]}
          </span>
          <span className="hidden sm:inline">{SITE_SHORT}</span>
        </Link>
        <nav className="hidden md:flex items-center gap-7 text-sm">
          {primaryNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <ButtonLink href="/#contact" size="sm">
            Связаться
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}
