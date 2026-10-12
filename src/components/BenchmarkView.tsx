import Link from "next/link";
import { ContentBody } from "@/components/ContentBody";
import { formatScore, type RankedEntry } from "@/lib/benchmark";
import { parseStoredContent } from "@/lib/blocks";

export function BenchmarkView({
  items,
  activeSlug,
  current,
}: {
  items: { slug: string; name: string }[];
  activeSlug?: string;
  current: {
    name: string;
    description: string;
    info: string;
    ranked: RankedEntry[];
  } | null;
}) {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <div className="md:grid md:grid-cols-[13.5rem_minmax(0,1fr)] md:gap-12">
        <nav aria-label="Benchmarks">
          <p className="mb-3 hidden text-xs font-semibold uppercase tracking-[0.16em] text-muted md:block">
            Benchmarks
          </p>
          {items.length ? (
            <ul className="flex gap-1 overflow-x-auto pb-1 md:flex-col md:gap-0.5 md:overflow-visible md:border-r md:border-border md:pb-0 md:pr-6">
              {items.map((item) => {
                const active = item.slug === activeSlug;
                return (
                  <li key={item.slug} className="shrink-0 md:shrink">
                    <Link
                      href={`/benchmark/${item.slug}`}
                      aria-current={active ? "page" : undefined}
                      className={`block rounded-md px-3 py-2 text-sm md:px-2 ${
                        active
                          ? "bg-accent-soft font-medium text-accent-deep"
                          : "text-muted hover:bg-surface hover:text-foreground"
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-muted">No benchmarks yet.</p>
          )}
        </nav>

        {current ? (
          <article className="min-w-0 pt-8 md:pt-0">
            <h1 className="font-display text-4xl tracking-tight text-foreground sm:text-5xl">
              {current.name}
            </h1>
            {current.description ? (
              <p className="mt-5 max-w-3xl whitespace-pre-wrap text-lg leading-relaxed text-muted">
                {current.description}
              </p>
            ) : null}

            <section className="mt-12" aria-label="Leaderboard">
              {current.ranked.length ? (
                <ol className="space-y-6">
                  {current.ranked.map((entry) => (
                    <li key={`${entry.rank}-${entry.name}`}>
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium ${
                            entry.rank === 1
                              ? "bg-accent text-white"
                              : "bg-border text-foreground"
                          }`}
                        >
                          {entry.rank}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-sm text-foreground sm:text-base">
                          {entry.name}
                        </span>
                        <span className="shrink-0 font-mono text-sm tabular-nums text-foreground">
                          {formatScore(entry.score)}
                        </span>
                      </div>
                      <div className="mt-2 ml-11 h-2.5 overflow-hidden rounded-full bg-accent-soft">
                        <div
                          className={`h-full rounded-full ${
                            entry.rank === 1 ? "bg-accent" : "bg-muted"
                          }`}
                          style={{ width: `${entry.barPercent}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="text-sm text-muted">No results yet.</p>
              )}
            </section>

            {hasInfo(current.info) ? (
              <section className="mt-12 border-t border-border pt-8">
                <ContentBody content={current.info} />
              </section>
            ) : null}
          </article>
        ) : (
          <div className="pt-8 md:pt-0">
            <h1 className="font-display text-4xl tracking-tight">Benchmark</h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
              Leaderboards will show up here once they are published.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function hasInfo(raw: string) {
  const blocks = parseStoredContent(raw);
  if (!blocks?.length) return false;
  return blocks.some((block) => {
    const content = block.content;
    if (typeof content === "string") return content.trim().length > 0;
    if (!Array.isArray(content)) return false;
    return content.some((item) => {
      if (typeof item === "string") return item.trim().length > 0;
      if (item && typeof item === "object" && "text" in item) {
        return String(item.text ?? "").trim().length > 0;
      }
      return Boolean(item);
    });
  });
}
