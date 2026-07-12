import Link from "next/link";
import type { Tutorial } from "@/data/tutorials";

export function TutorialList({ items }: { items: Tutorial[] }) {
  return (
    <ul className="space-y-6">
      {items.map((item) => (
        <li key={item.slug}>
          <Link
            href={`/tutorial/${item.slug}`}
            className="group block border-b border-border pb-6 transition-colors hover:border-accent/40"
          >
            <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
              <span className="rounded-sm bg-accent-soft px-2 py-0.5 text-accent-deep">
                {item.level}
              </span>
              <span>{item.chapterCount} chapters</span>
              <span aria-hidden>•</span>
              <span>{item.tags.join(" · ")}</span>
            </div>
            <h2 className="mt-3 font-display text-2xl tracking-tight text-foreground transition-colors group-hover:text-accent-deep">
              {item.title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
              {item.description}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
