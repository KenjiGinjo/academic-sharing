"use client";

import { usePathname } from "next/navigation";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPersonProfile = /^\/people\/[^/]+$/.test(pathname);

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
