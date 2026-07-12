import Link from "next/link";
import type { BlogPost } from "@/data/blogs";

export function PostList({ posts }: { posts: BlogPost[] }) {
  return (
    <ul className="divide-y divide-border">
      {posts.map((post) => (
        <li key={post.slug} className="group py-7 first:pt-0 last:pb-0">
          <Link href={`/blog/${post.slug}`} className="block">
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span aria-hidden>•</span>
              <span>{post.tags.join(" · ")}</span>
            </div>
            <h2 className="mt-2 font-display text-2xl tracking-tight text-foreground transition-colors group-hover:text-accent-deep">
              {post.title}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
              {post.excerpt}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}
