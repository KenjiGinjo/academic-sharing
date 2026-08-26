import Link from "next/link";
import type { ReactNode } from "react";
import type { AuthorRef } from "@/lib/content";

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
  showRole = false,
  size = "sm",
}: {
  date: string;
  author?: AuthorRef | null;
  showRole?: boolean;
  size?: "sm" | "md";
}) {
  const dateEl = (
    <time dateTime={date} className="text-sm text-muted">
      {formatDate(date)}
    </time>
  );

  if (!author) return dateEl;

  const avatarSize = size === "md" ? "h-9 w-9 text-xs" : "h-7 w-7 text-[10px]";
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
    <div className="flex flex-col gap-1.5">
      <div className="flex max-w-full items-center gap-2.5">
        {wrapAuthor(author.href, avatar)}
        <div className="min-w-0">
          {wrapAuthor(author.href, name)}
          {role}
        </div>
      </div>
      {dateEl}
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
