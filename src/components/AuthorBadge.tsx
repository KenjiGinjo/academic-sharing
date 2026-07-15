import Link from "next/link";
import type { AuthorRef } from "@/lib/content";

export function AuthorBadge({
  author,
  showRole = false,
  size = "sm",
}: {
  author?: AuthorRef | null;
  showRole?: boolean;
  size?: "sm" | "md";
}) {
  if (!author) return null;

  const avatarSize = size === "md" ? "h-9 w-9 text-xs" : "h-6 w-6 text-[10px]";
  const content = (
    <>
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
      <span className="min-w-0">
        <span className="block truncate font-medium text-foreground/90">
          {author.name}
        </span>
        {showRole && author.role ? (
          <span className="block truncate text-xs text-muted">{author.role}</span>
        ) : null}
      </span>
    </>
  );

  const className = "inline-flex max-w-full items-center gap-2 text-sm";

  if (author.href) {
    return (
      <Link href={author.href} className={`${className} hover:text-accent-deep`}>
        {content}
      </Link>
    );
  }

  return <span className={className}>{content}</span>;
}
