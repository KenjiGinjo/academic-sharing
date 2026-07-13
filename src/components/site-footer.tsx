import Link from "next/link";
import { BrandLogo } from "./BrandLogo";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <BrandLogo
            className="text-2xl text-foreground"
            markClassName="h-8 w-8 text-accent-deep"
          />
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
            Where neural science meets intelligence — notes, tutorials, and
            people exploring neuroscience and AI.
          </p>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
            Explore
          </p>
          <ul className="mt-4 space-y-2 text-sm text-foreground/85">
            <li>
              <Link href="/blog" className="hover:text-accent-deep">
                Blog
              </Link>
            </li>
            <li>
              <Link href="/tutorial" className="hover:text-accent-deep">
                Tutorial
              </Link>
            </li>
            <li>
              <Link href="/people" className="hover:text-accent-deep">
                People
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">
            More
          </p>
          <ul className="mt-4 space-y-2 text-sm text-foreground/85">
            <li>
              <a
                href="https://github.com"
                className="hover:text-accent-deep"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
            </li>
            <li>
              <span className="text-muted">CG NeurAI</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-6xl px-5 py-5 text-xs text-muted sm:px-8">
          © {new Date().getFullYear()} CG NeurAI.
        </p>
      </div>
    </footer>
  );
}
