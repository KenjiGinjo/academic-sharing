import Link from "next/link";
import { auth } from "@/lib/auth";
import { logoutAction } from "@/app/admin/actions";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const isAdminUser = session?.user?.role === "ADMIN";

  const nav = [
    { href: "/admin", label: "Dashboard" },
    ...(isAdminUser ? [{ href: "/admin/people", label: "Authors" }] : []),
    { href: "/admin/blogs", label: "Blogs" },
    { href: "/admin/tutorials", label: "Tutorials" },
  ];

  return (
    <div className="min-h-full bg-[#f4f5f3] text-foreground">
      {session?.user ? (
        <header className="border-b border-border bg-surface">
          <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-5 py-4">
            <div className="flex flex-wrap items-center gap-4">
              <Link href="/admin" className="font-medium">
                Academic Sharing Admin
              </Link>
              <nav className="flex flex-wrap gap-1 text-sm">
                {nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="rounded px-2.5 py-1.5 text-muted hover:bg-accent-soft hover:text-accent-deep"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <span className="rounded bg-accent-soft px-2 py-0.5 text-xs text-accent-deep">
                {session.user.role}
              </span>
              <Link href="/" className="text-muted hover:text-foreground">
                View site
              </Link>
              <span className="text-muted">{session.user.email}</span>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="rounded border border-border px-2.5 py-1 hover:bg-background"
                >
                  Log out
                </button>
              </form>
            </div>
          </div>
        </header>
      ) : null}
      <div className="mx-auto max-w-5xl px-5 py-8">{children}</div>
    </div>
  );
}
