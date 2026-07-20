import Link from "next/link";
import { BrandLogo } from "./BrandLogo";
import { HeroVisual } from "./HeroVisual";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(165deg, var(--hero-from) 0%, var(--hero-to) 55%, #fbfcfb 100%)",
        }}
      />
      <div className="hero-grid absolute inset-0" aria-hidden />
      <div className="relative mx-auto grid min-h-[78vh] w-full max-w-6xl items-center gap-12 px-5 py-20 sm:px-8 sm:py-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-8 xl:gap-12">
        <div>
          <div className="fade-up">
            <BrandLogo
              className="text-4xl text-foreground sm:text-5xl md:text-6xl"
              markClassName="h-12 w-12 text-accent-deep sm:h-14 sm:w-14 md:h-16 md:w-16"
            />
          </div>
          <h1 className="fade-up-delay mt-6 max-w-2xl text-2xl font-medium leading-snug tracking-tight text-foreground sm:text-3xl md:text-4xl">
            Practical Notes and Tutorials for Neuroscience and AI
          </h1>
          <p className="fade-up-delay mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Where neural science meets intelligence.
          </p>
          <div className="fade-up-delay mt-10 flex flex-wrap gap-3">
            <Link
              href="/tutorial"
              className="inline-flex h-11 items-center rounded-md bg-accent px-5 text-sm font-medium text-white transition hover:bg-accent-deep"
            >
              Explore Tutorials
            </Link>
            <Link
              href="/blog"
              className="inline-flex h-11 items-center rounded-md border border-border bg-surface px-5 text-sm font-medium text-foreground transition hover:border-accent/40 hover:text-accent-deep"
            >
              Read Blog
            </Link>
          </div>
        </div>

        <div className="hero-visual-enter pointer-events-none select-none lg:justify-self-end">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
