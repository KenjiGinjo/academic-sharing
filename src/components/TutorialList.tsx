import Link from "next/link";
import { AuthorBadge } from "@/components/AuthorBadge";
import type { TutorialView } from "@/lib/content";

export function TutorialList({ items }: { items: TutorialView[] }) {
  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li
          key={item.slug}
          className="relative border border-border bg-surface px-5 py-6 transition hover:border-accent/35 hover:bg-accent-soft/30 sm:px-7"
        >
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
            <span className="rounded-sm bg-accent-soft px-2 py-0.5 font-medium text-accent-deep">
              {item.level}
            </span>
            <span>{item.chapterCount} chapters</span>
            {item.tags.map((tag) => (
              <span key={tag}>#{tag}</span>
            ))}
          </div>
          <h3 className="mt-3 text-xl font-medium tracking-tight text-foreground">
            <Link
              href={`/tutorial/${item.slug}`}
              className="after:absolute after:inset-0 hover:text-accent-deep"
            >
              {item.title}
            </Link>
          </h3>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
            {item.description}
          </p>
          {item.author ? (
            <div className="relative z-10 mt-4">
              <AuthorBadge author={item.author} />
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
