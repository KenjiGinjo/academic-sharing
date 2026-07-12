import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate } from "@/components/BlogList";
import { blogs, getBlog } from "@/data/blogs";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return blogs.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlog(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlog(slug);
  if (!post) notFound();

  const index = blogs.findIndex((item) => item.slug === slug);
  const prev = index > 0 ? blogs[index - 1] : null;
  const next = index < blogs.length - 1 ? blogs[index + 1] : null;

  return (
    <article className="mx-auto w-full max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
      <Link
        href="/blog"
        className="text-sm text-muted transition hover:text-accent"
      >
        ← Back to Blog
      </Link>
      <header className="mt-8 border-b border-border pb-8">
        <time className="text-sm text-muted" dateTime={post.date}>
          {formatDate(post.date)}
        </time>
        <h1 className="mt-3 font-display text-3xl tracking-tight text-foreground sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted">{post.excerpt}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span key={tag} className="text-xs text-accent-deep">
              #{tag}
            </span>
          ))}
        </div>
      </header>
      <div className="prose-article mt-10">
        {post.content.map((block, i) => {
          if (block.startsWith("## ")) {
            return <h2 key={i}>{block.replace(/^## /, "")}</h2>;
          }
          return <p key={i}>{block}</p>;
        })}
      </div>
      <nav className="mt-16 flex flex-col gap-4 border-t border-border pt-8 sm:flex-row sm:justify-between">
        {prev ? (
          <Link href={`/blog/${prev.slug}`} className="text-sm hover:text-accent">
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/blog/${next.slug}`}
            className="text-sm sm:text-right hover:text-accent"
          >
            {next.title} →
          </Link>
        ) : null}
      </nav>
    </article>
  );
}
