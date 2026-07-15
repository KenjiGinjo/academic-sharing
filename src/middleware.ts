import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { parsePersonSubdomain } from "@/lib/profile";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN?.trim() || "cgneurai.com";
  const slug = parsePersonSubdomain(host, rootDomain);
  if (!slug) return NextResponse.next();

  const { pathname } = request.nextUrl;
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/upload") ||
    pathname.startsWith("/_next")
  ) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/people/${slug}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
