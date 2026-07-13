import Link from "next/link";
import { authorScope, isAdmin, requireUser } from "@/lib/permissions";
import { prisma } from "@/lib/prisma";

export default async function AdminDashboardPage() {
  const session = await requireUser();
  const scope = authorScope(session);

  const [authors, blogs, tutorials] = await Promise.all([
    isAdmin(session) ? prisma.person.count() : Promise.resolve(0),
    prisma.post.count({ where: { type: "BLOG", ...scope } }),
    prisma.post.count({ where: { type: "TUTORIAL", ...scope } }),
  ]);

  const cards = [
    ...(isAdmin(session)
      ? [
          {
            label: "Authors",
            count: authors,
            href: "/admin/people",
            hint: "Fixed writers + logins",
          },
        ]
      : []),
    {
      label: "Blogs",
      count: blogs,
      href: "/admin/blogs",
      hint: isAdmin(session) ? "All posts" : "Your posts",
    },
    {
      label: "Tutorials",
      count: tutorials,
      href: "/admin/tutorials",
      hint: isAdmin(session) ? "All series" : "Your series",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-medium tracking-tight">Dashboard</h1>
      <p className="mt-2 text-sm text-muted">
        Signed in as {session.user.email} ({session.user.role}).
        {session.user.role === "AUTHOR"
          ? " You can publish Blog and Tutorial under your author profile."
          : " You can manage authors and all content."}
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-lg border border-border bg-surface p-5 hover:border-accent/40"
          >
            <p className="text-sm text-muted">{card.label}</p>
            <p className="mt-2 text-3xl font-medium">{card.count}</p>
            <p className="mt-2 text-xs text-muted">{card.hint}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
