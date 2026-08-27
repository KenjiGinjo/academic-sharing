import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArticleByline } from "@/components/ArticleByline";
import { ContentBody } from "@/components/ContentBody";
import { ReadingTime } from "@/components/ReadingTime";
import { getPublishedTutorial } from "@/lib/content";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tutorial = await getPublishedTutorial(slug);
  if (!tutorial) return {};
  return { title: tutorial.title, description: tutorial.description };
}

export default async function TutorialDetailPage({ params }: Props) {
  const { slug } = await params;
  const tutorial = await getPublishedTutorial(slug);
  if (!tutorial) notFound();
  if (tutorial.href !== `/tutorial/${slug}`) redirect(tutorial.href);

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <Link
        href="/tutorial"
        className="group inline-flex items-center gap-2 text-sm text-muted transition hover:text-accent-deep"
      >
        <span aria-hidden className="transition group-hover:-translate-x-0.5">
          ←
        </span>
        All tutorials
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-[200px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            Chapters
          </p>
          <nav className="mt-4 space-y-1" aria-label="Chapters">
            {tutorial.chapters.map((chapter, index) => (
              <a
                key={chapter.id}
                href={`#${chapter.id}`}
                className="block rounded-md px-3 py-2 text-sm text-foreground/80 transition hover:bg-accent-soft hover:text-accent-deep"
              >
                <span className="mr-2 text-muted">{index + 1}.</span>
                {chapter.title}
              </a>
            ))}
          </nav>
        </aside>

        <article>
          <div className="max-w-3xl">
            <header className="border-b border-border pb-8">
              <h1 className="font-display text-3xl tracking-tight text-foreground sm:text-4xl">
                {tutorial.title}
              </h1>
              <div className="mt-4">
                <ReadingTime minutes={tutorial.readingMinutes} />
              </div>
              <div className="mt-5">
                <ArticleByline
                  date={tutorial.date}
                  author={tutorial.author}
                  showRole
                  size="md"
                />
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted">
                <span className="rounded-sm bg-accent-soft px-2 py-0.5 font-medium text-accent-deep">
                  {tutorial.level}
                </span>
                <span>{tutorial.chapterCount} chapters</span>
                {tutorial.tags.map((tag) => (
                  <span key={tag}>#{tag}</span>
                ))}
              </div>
              <p className="mt-4 text-base leading-relaxed text-muted">
                {tutorial.description}
              </p>
            </header>

            <div className="mt-10 space-y-14">
              {tutorial.chapters.map((chapter, index) => (
                <section key={chapter.id} id={chapter.id} className="scroll-mt-28">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-accent">
                    Chapter {index + 1}
                  </p>
                  <h2 className="mt-2 text-2xl font-medium tracking-tight text-foreground">
                    {chapter.title}
                  </h2>
                  <div className="mt-4">
                    <ContentBody content={chapter.content} />
                  </div>
                </section>
              ))}
            </div>
          </div>

          <footer className="mt-16 border-t border-border pt-8">
            <Link
              href="/tutorial"
              className="group inline-flex items-center gap-2 text-sm text-muted transition hover:text-accent-deep"
            >
              <span aria-hidden className="transition group-hover:-translate-x-0.5">
                ←
              </span>
              All tutorials
            </Link>
          </footer>
        </article>
      </div>
    </div>
  );
}
