"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function SiteShell({
  children,
  isPersonSubdomain = false,
}: {
  children: React.ReactNode;
  /** Host is `{slug}.{root}` — pathname stays `/` or `/blog`, not `/people/...`. */
  isPersonSubdomain?: boolean;
}) {
  const pathname = usePathname();
  const isPersonProfile =
    isPersonSubdomain || /^\/people\/[^/]+$/.test(pathname);

  if (isPersonProfile) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <>
      <Header pathname={pathname} />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
