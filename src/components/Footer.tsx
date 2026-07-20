import Link from "next/link";
import { BrandLogo } from "./BrandLogo";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      {/* <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <BrandLogo
            className="text-lg text-foreground"
            markClassName="h-8 w-8 text-accent-deep"
          />
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
            Where neural science meets intelligence — notes, tutorials, and
            people exploring neuroscience and AI.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            Explore
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link href="/blog" className="text-foreground/80 hover:text-accent">
                Blog
              </Link>
            </li>
            <li>
              <Link
                href="/tutorial"
                className="text-foreground/80 hover:text-accent"
              >
                Tutorial
              </Link>
            </li>
            <li>
              <Link
                href="/people"
                className="text-foreground/80 hover:text-accent"
              >
                People
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            More
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a
                href="https://github.com"
                className="text-foreground/80 hover:text-accent"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </li>
            <li>
              <span className="text-muted">CG NeuroAI</span>
            </li>
          </ul>
        </div>
      </div> */}
      <div className="border-t border-border">
        <p className="mx-auto max-w-6xl px-5 py-5 text-xs text-muted sm:px-8">
          © {new Date().getFullYear()} CG NeuroAI.
        </p>
      </div>
    </footer>
  );
}
