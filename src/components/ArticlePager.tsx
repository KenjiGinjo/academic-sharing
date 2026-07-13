import Link from "next/link";

export type PagerItem = {
  href: string;
  title: string;
  meta?: string;
};

type ArticlePagerProps = {
  newer?: PagerItem | null;
  older?: PagerItem | null;
  collectionHref: string;
  collectionLabel: string;
};

export function ArticlePager({
  newer,
  older,
  collectionHref,
  collectionLabel,
}: ArticlePagerProps) {
  if (!newer && !older) {
    return (
      <footer className="mt-16 border-t border-border pt-10">
        <Link
          href={collectionHref}
          className="text-sm font-medium text-accent-deep transition hover:text-accent"
        >
          Browse all {collectionLabel}
        </Link>
      </footer>
    );
  }

  return (
    <footer className="mt-16 border-t border-border pt-10">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
        Keep reading
      </p>

      <div className="mt-6 grid gap-8 sm:grid-cols-2 sm:gap-10">
        <PagerSlot
          align="start"
          label="Newer"
          item={newer}
          emptyHint="You’re on the latest post"
        />
        <PagerSlot
          align="end"
          label="Older"
          item={older}
          emptyHint="No older posts"
        />
      </div>

      <div className="mt-10">
        <Link
          href={collectionHref}
          className="group inline-flex items-center gap-2 text-sm text-muted transition hover:text-accent-deep"
        >
          <span aria-hidden className="transition group-hover:-translate-x-0.5">
            ←
          </span>
          All {collectionLabel}
        </Link>
      </div>
    </footer>
  );
}

function PagerSlot({
  label,
  item,
  align,
  emptyHint,
}: {
  label: string;
  item?: PagerItem | null;
  align: "start" | "end";
  emptyHint: string;
}) {
  const alignClass = align === "end" ? "sm:items-end sm:text-right" : "items-start text-left";

  if (!item) {
    return (
      <div className={`flex flex-col ${alignClass}`}>
        <span className="text-xs uppercase tracking-[0.14em] text-muted/70">
          {label}
        </span>
        <p className="mt-2 text-sm text-muted/60">{emptyHint}</p>
      </div>
    );
  }

  return (
    <div className={`flex flex-col ${alignClass}`}>
      <span className="text-xs font-medium uppercase tracking-[0.14em] text-accent">
        {label}
      </span>
      <Link
        href={item.href}
        className="group mt-2 block max-w-sm outline-none"
      >
        <span className="block text-lg font-medium leading-snug tracking-tight text-foreground transition group-hover:text-accent-deep group-focus-visible:text-accent-deep">
          {item.title}
        </span>
        {item.meta ? (
          <span className="mt-1.5 block text-sm text-muted">{item.meta}</span>
        ) : null}
      </Link>
    </div>
  );
}
