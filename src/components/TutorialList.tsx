import Link from "next/link";
import type { Tutorial } from "@/data/tutorials";

export function TutorialList({ items }: { items: Tutorial[] }) {
  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item.slug}>
          <Link
            href={`/tutorial/${item.slug}`}
            className="group block border border-border bg-surface px-5 py-6 transition hover:border-accent/35 hover:bg-accent-soft/30 sm:px-7"
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
            <h3 className="mt-3 text-xl font-medium tracking-tight text-foreground group-hover:text-accent-deep">
              {item.title}
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
              {item.description}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
