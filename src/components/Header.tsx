import Link from "next/link";
import { BrandLogo } from "./BrandLogo";

const nav = [
  { href: "/blog", label: "Blog" },
  { href: "/tutorial", label: "Tutorial" },
  { href: "/people", label: "People" },
];

export function Header({ pathname = "/" }: { pathname?: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="text-lg text-foreground transition-colors hover:text-accent-deep sm:text-xl"
          aria-label="CG NeurAI home"
        >
          <BrandLogo markClassName="h-8 w-8 text-accent-deep" />
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          {nav.map((item) => {
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-md px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-accent-soft text-accent-deep"
                    : "text-muted hover:bg-surface hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
