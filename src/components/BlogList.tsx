import Link from "next/link";
import type { BlogPost } from "@/data/blogs";

export function SectionHeading({
  eyebrow,
  title,
  href,
  linkLabel,
}: {
  eyebrow: string;
  title: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">
          {eyebrow}
        </p>
        <h2 className="mt-2 font-display text-2xl tracking-tight text-foreground sm:text-3xl">
          {title}
        </h2>
      </div>
      {href && linkLabel ? (
        <Link
          href={href}
          className="text-sm font-medium text-accent-deep transition hover:text-accent"
        >
          {linkLabel} →
        </Link>
      ) : null}
    </div>
  );
}

export function BlogList({
  posts,
  compact = false,
}: {
  posts: BlogPost[];
  compact?: boolean;
}) {
  return (
    <ul className="divide-y divide-border border-y border-border">
      {posts.map((post) => (
        <li key={post.slug}>
          <Link
            href={`/blog/${post.slug}`}
            className="group block py-6 transition hover:bg-accent-soft/40"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between">
              <h3 className="text-lg font-medium tracking-tight text-foreground group-hover:text-accent-deep">
                {post.title}
              </h3>
              <time className="shrink-0 text-sm text-muted" dateTime={post.date}>
                {formatDate(post.date)}
              </time>
            </div>
            <p
              className={`mt-2 max-w-3xl text-sm leading-relaxed text-muted ${
                compact ? "line-clamp-2" : ""
              }`}
            >
              {post.excerpt}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs tracking-wide text-accent-deep/80"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}
