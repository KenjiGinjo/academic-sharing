import Link from "next/link";
import { ArticleByline } from "@/components/ArticleByline";
import { ReadingTime } from "@/components/ReadingTime";
import type { BlogPostView } from "@/lib/content";

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
  posts: BlogPostView[];
  compact?: boolean;
}) {
  return (
    <ul className="divide-y divide-border border-y border-border">
      {posts.map((post) => (
        <li
          key={post.slug}
          className="relative py-6 transition hover:bg-accent-soft/40"
        >
          <h3 className="text-lg font-medium tracking-tight text-foreground">
            <Link
              href={`/blog/${post.slug}`}
              className="after:absolute after:inset-0 hover:text-accent-deep"
            >
              {post.title}
            </Link>
          </h3>
          <div className="mt-2">
            <ReadingTime minutes={post.readingMinutes} size="sm" />
          </div>
          <div className="relative z-10 mt-3">
            <ArticleByline date={post.date} author={post.author} />
          </div>
          <p
            className={`mt-3 max-w-3xl text-sm leading-relaxed text-muted ${
              compact ? "line-clamp-2" : ""
            }`}
          >
            {post.excerpt}
          </p>
          {post.tags.length ? (
            <div className="relative z-10 mt-3 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs tracking-wide text-accent-deep/80"
                >
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

export { formatDate } from "@/components/ArticleByline";
