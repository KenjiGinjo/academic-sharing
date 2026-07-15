"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AuthorBadge } from "@/components/AuthorBadge";
import { formatDate } from "@/components/BlogList";
import type { CarouselItemView } from "@/lib/content";

export function FeaturedCarousel({ items }: { items: CarouselItemView[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    if (items.length <= 1 || paused) return;
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % items.length);
      setAnimKey((k) => k + 1);
    }, 5500);
    return () => window.clearInterval(timer);
  }, [items.length, paused]);

  if (!items.length) return null;

  const item = items[index] ?? items[0];
  const goTo = (next: number) => {
    setIndex(next);
    setAnimKey((k) => k + 1);
  };

  return (
    <section
      className="relative overflow-hidden border-b border-border"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Recent recommendations"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #eef4f1 0%, var(--background) 72%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 top-0 h-64 w-64 rounded-full bg-accent/5 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
        {/* Section chrome — intentionally quieter than the featured piece */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-border/80 pb-5">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
              Recommended
            </p>
            <h2 className="mt-1.5 text-sm font-medium tracking-wide text-muted sm:text-base">
              Recent from the archive
            </h2>
          </div>

          {items.length > 1 ? (
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs tabular-nums text-muted">
                {String(index + 1).padStart(2, "0")}
                <span className="mx-1 text-border">/</span>
                {String(items.length).padStart(2, "0")}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() =>
                    goTo((index - 1 + items.length) % items.length)
                  }
                  className="inline-flex h-8 w-8 items-center justify-center text-muted transition hover:text-accent-deep"
                  aria-label="Previous"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M11.25 3.75 6 9l5.25 5.25"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => goTo((index + 1) % items.length)}
                  className="inline-flex h-8 w-8 items-center justify-center text-muted transition hover:text-accent-deep"
                  aria-label="Next"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M6.75 3.75 12 9l-5.25 5.25"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ) : null}
        </div>

        {/* Featured piece — primary visual weight */}
        <article
          key={animKey}
          className="carousel-slide relative grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end"
        >
          <div className="min-w-0 border-l-2 border-accent pl-5 sm:pl-7">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-md bg-accent-soft px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-deep">
                {item.kind === "blog" ? "Blog" : "Tutorial"}
              </span>
              <time
                dateTime={item.date}
                className="text-sm text-muted"
              >
                {formatDate(item.date)}
              </time>
            </div>

            <h3 className="mt-4 max-w-3xl font-display text-3xl leading-[1.15] tracking-tight text-foreground sm:text-4xl md:text-[2.75rem]">
              <Link
                href={item.href}
                className="transition-colors hover:text-accent-deep"
              >
                {item.title}
              </Link>
            </h3>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              {item.excerpt}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
              <AuthorBadge author={item.author} size="md" showRole />
              <Link
                href={item.href}
                className="inline-flex h-10 items-center rounded-md bg-accent px-4 text-sm font-medium text-white transition hover:bg-accent-deep"
              >
                Read article →
              </Link>
            </div>
          </div>

          {items.length > 1 ? (
            <nav
              className="hidden w-44 shrink-0 flex-col gap-1 lg:flex"
              aria-label="Featured items"
            >
              {items.map((slide, i) => {
                const active = i === index;
                return (
                  <button
                    key={`${slide.kind}-${slide.slug}`}
                    type="button"
                    onClick={() => goTo(i)}
                    className={`rounded-md px-3 py-2.5 text-left transition ${
                      active
                        ? "bg-surface shadow-[inset_0_0_0_1px_var(--border)]"
                        : "hover:bg-surface/70"
                    }`}
                    aria-current={active ? "true" : undefined}
                  >
                    <span
                      className={`block text-[10px] font-semibold uppercase tracking-[0.14em] ${
                        active ? "text-accent" : "text-muted/70"
                      }`}
                    >
                      {slide.kind === "blog" ? "Blog" : "Tutorial"}
                    </span>
                    <span
                      className={`mt-1 block line-clamp-2 text-sm leading-snug ${
                        active
                          ? "font-medium text-foreground"
                          : "text-muted"
                      }`}
                    >
                      {slide.title}
                    </span>
                  </button>
                );
              })}
            </nav>
          ) : null}
        </article>

        {items.length > 1 ? (
          <div
            className="mt-10 flex gap-2 lg:hidden"
            role="tablist"
            aria-label="Slides"
          >
            {items.map((slide, i) => (
              <button
                key={`${slide.kind}-${slide.slug}`}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Slide ${i + 1}: ${slide.title}`}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index
                    ? "w-8 bg-accent"
                    : "w-4 bg-border hover:bg-muted/50"
                }`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
