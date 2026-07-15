/** Path form — works locally and on the main domain. */
export function profilePath(slug: string) {
  return `/people/${slug}`;
}

/**
 * Public Website href for directory / share cards.
 * Prefers subdomain when NEXT_PUBLIC_ROOT_DOMAIN is set (production).
 */
export function profilePublicUrl(slug: string) {
  const root = process.env.NEXT_PUBLIC_ROOT_DOMAIN?.trim();
  if (root) {
    return `https://${slug}.${root}`;
  }
  return profilePath(slug);
}

export function parsePersonSubdomain(host: string, rootDomain: string) {
  const hostname = host.split(":")[0]?.toLowerCase() ?? "";
  const reserved = new Set([
    "www",
    "admin",
    "api",
    "mail",
    "ftp",
    "localhost",
  ]);

  if (hostname.endsWith(".localhost")) {
    const sub = hostname.slice(0, -".localhost".length);
    if (sub && !sub.includes(".") && !reserved.has(sub)) return sub;
    return null;
  }

  const root = rootDomain.toLowerCase();
  if (!root || hostname === root || hostname === `www.${root}`) return null;
  if (!hostname.endsWith(`.${root}`)) return null;

  const sub = hostname.slice(0, -(root.length + 1));
  if (!sub || sub.includes(".") || reserved.has(sub)) return null;
  return sub;
}
