import { headers } from "next/headers";
import { SiteShell } from "@/components/SiteShell";
import { parsePersonSubdomain } from "@/lib/profile";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const host = (await headers()).get("host") ?? "";
  const rootDomain =
    process.env.NEXT_PUBLIC_ROOT_DOMAIN?.trim() || "cgneurai.com";
  const isPersonSubdomain = Boolean(
    parsePersonSubdomain(host, rootDomain),
  );

  return (
    <SiteShell isPersonSubdomain={isPersonSubdomain}>{children}</SiteShell>
  );
}
