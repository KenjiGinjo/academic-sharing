import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleBreadcrumb } from "@/components/ArticleBreadcrumb";
import { ArticlePager } from "@/components/ArticlePager";
import { AuthorBadge } from "@/components/AuthorBadge";
import { ContentBody } from "@/components/ContentBody";
import { formatDate } from "@/components/BlogList";
import { getPublishedBlog, listPublishedBlogs } from "@/lib/content";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlog(slug);
  if (!post) return {};
  return { title: post.title, description: post.excerpt };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const [post, blogs] = await Promise.all([
    getPublishedBlog(slug),
    listPublishedBlogs(),
  ]);
  if (!post) notFound();

  // blogs are newest-first: index-1 = newer, index+1 = older
  const index = blogs.findIndex((item) => item.slug === slug);
  const newer = index > 0 ? blogs[index - 1] : null;
  const older = index >= 0 && index < blogs.length - 1 ? blogs[index + 1] : null;

  return (
    <>
      <div className="border-b border-border/80">
        <div className="mx-auto w-full max-w-6xl px-5 py-3 sm:px-8">
          <ArticleBreadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Blog", href: "/blog" },
              { label: post.title },
            ]}
          />
        </div>
      </div>

      <article className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-8 sm:py-14">
        <header className="border-b border-border pb-8">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <AuthorBadge author={post.author} showRole />
          </div>
          <h1 className="mt-4 font-display text-3xl tracking-tight text-foreground sm:text-4xl">
            {post.title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-muted">{post.excerpt}</p>
          {post.tags.length ? (
            <div className="mt-5 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="text-xs tracking-wide text-accent-deep">
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}
        </header>

        <div className="mt-10">
          <ContentBody content={post.content} />
        </div>

        <ArticlePager
          collectionHref="/blog"
          collectionLabel="blog posts"
          newer={
            newer
              ? {
                  href: `/blog/${newer.slug}`,
                  title: newer.title,
                  meta: formatDate(newer.date),
                }
              : null
          }
          older={
            older
              ? {
                  href: `/blog/${older.slug}`,
                  title: older.title,
                  meta: formatDate(older.date),
                }
              : null
          }
        />
      </article>
    </>
  );
}
