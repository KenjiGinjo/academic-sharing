import { headers } from "next/headers";
import { SiteShell } from "@/components/SiteShell";
import { parsePersonSubdomain } from "@/lib/profile";
import { prisma } from "@/lib/prisma";

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
  const benchmarkCount = await prisma.benchmark.count({
    where: { published: true },
  });

  return (
    <SiteShell
      isPersonSubdomain={isPersonSubdomain}
      showBenchmark={benchmarkCount > 0}
    >
      {children}
    </SiteShell>
  );
}
