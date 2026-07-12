import Link from "next/link";

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
          className="font-display text-lg tracking-tight text-foreground transition-colors hover:text-accent-deep sm:text-xl"
        >
          Academic Sharing
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
