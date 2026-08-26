import Link from "next/link";
import type { ReactNode } from "react";
import type { AuthorRef } from "@/lib/content";
import { formatReadingTime } from "@/lib/reading-time";

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function ArticleByline({
  date,
  author,
  readingMinutes,
  showRole = false,
  size = "sm",
}: {
  date: string;
  author?: AuthorRef | null;
  readingMinutes: number;
  showRole?: boolean;
  size?: "sm" | "md";
}) {
  const meta = (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
      <time dateTime={date}>{formatDate(date)}</time>
      <span aria-hidden className="text-border">
        ·
      </span>
      <ReadingTimeChip minutes={readingMinutes} />
    </p>
  );

  if (!author) return meta;

  const avatarSize = size === "md" ? "h-10 w-10 text-sm" : "h-8 w-8 text-[11px]";
  const avatar = (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent-soft font-semibold text-accent-deep ${avatarSize}`}
      aria-hidden
    >
      {author.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={author.avatarUrl}
          alt=""
          className="h-full w-full object-cover"
        />
      ) : (
        author.initials
      )}
    </span>
  );

  const name = (
    <span className="block truncate text-sm font-medium text-foreground/90">
      {author.name}
    </span>
  );
  const role =
    showRole && author.role ? (
      <span className="block truncate text-xs text-muted">{author.role}</span>
    ) : null;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex max-w-full items-center gap-2.5">
        {wrapAuthor(author.href, avatar)}
        <div className="min-w-0">
          {wrapAuthor(author.href, name)}
          {role}
        </div>
      </div>
      {meta}
    </div>
  );
}

function wrapAuthor(href: string | null | undefined, children: ReactNode) {
  if (!href) return children;
  return (
    <Link href={href} className="hover:text-accent-deep">
      {children}
    </Link>
  );
}

function ReadingTimeChip({ minutes }: { minutes: number }) {
  const label = formatReadingTime(minutes);
  return (
    <span
      className="inline-flex items-center rounded-md border border-border bg-surface px-1.5 py-px text-xs text-muted"
      title={label}
    >
      {label}
    </span>
  );
}
