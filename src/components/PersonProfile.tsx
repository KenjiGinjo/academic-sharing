import Link from "next/link";
import type { ReactNode } from "react";
import { formatDate } from "@/components/BlogList";
import type { ProfileView } from "@/lib/content";

const PUB_LABELS: Record<string, string> = {
  JOURNAL: "Journal Articles",
  CONFERENCE: "Conference Papers",
  PREPRINT: "Preprints",
  OTHER: "Other",
};

const PUB_ORDER = ["JOURNAL", "CONFERENCE", "PREPRINT", "OTHER"];

export function PersonProfile({ profile }: { profile: ProfileView }) {
  const about = profile.about?.trim() || profile.bio;
  const nav = [
    { id: "about", label: "About", show: Boolean(about) },
    { id: "interests", label: "Interests", show: profile.interests.length > 0 },
    {
      id: "publications",
      label: "Publications",
      show: profile.publications.length > 0,
    },
    {
      id: "competitions",
      label: "Competitions",
      show: profile.competitions.length > 0,
    },
    {
      id: "applications",
      label: "Applications",
      show: profile.applications.length > 0,
    },
    { id: "patents", label: "Patents", show: profile.patents.length > 0 },
    { id: "blog", label: "Blog", show: profile.blogs.length > 0 },
    {
      id: "tutorials",
      label: "Tutorials",
      show: profile.tutorials.length > 0,
    },
  ].filter((item) => item.show);

  const pubsByType = PUB_ORDER.map((type) => ({
    type,
    label: PUB_LABELS[type] ?? type,
    items: profile.publications.filter((p) => p.type === type),
  })).filter((group) => group.items.length > 0);

  const socials = [
    profile.emailPublic
      ? {
          key: "email",
          label: "Email",
          href: `mailto:${profile.emailPublic}`,
          external: false,
          icon: <IconMail />,
        }
      : null,
    profile.googleScholar
      ? {
          key: "scholar",
          label: "Google Scholar",
          href: profile.googleScholar,
          external: true,
          icon: <IconScholar />,
        }
      : null,
    profile.github
      ? {
          key: "github",
          label: "GitHub",
          href: profile.github,
          external: true,
          icon: <IconGitHub />,
        }
      : null,
    profile.cvUrl
      ? {
          key: "cv",
          label: "Curriculum Vitae",
          href: profile.cvUrl,
          external: true,
          icon: <IconCv />,
        }
      : null,
    profile.x
      ? {
          key: "x",
          label: "X",
          href: profile.x,
          external: true,
          icon: <IconX />,
        }
      : null,
    profile.website
      ? {
          key: "website",
          label: "Website",
          href: profile.website,
          external: true,
          icon: <IconGlobe />,
        }
      : null,
  ].filter(Boolean) as {
    key: string;
    label: string;
    href: string;
    external: boolean;
    icon: ReactNode;
  }[];

  return (
    <div id="top" className="min-h-full bg-background">
      <header className="sticky top-0 z-10 border-b border-border/80 bg-surface/90 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-between gap-3 px-5 py-3 sm:px-8">
          <a
            href="#top"
            className="text-sm font-medium tracking-tight text-foreground transition hover:text-accent-deep"
          >
            {profile.name}
          </a>
          {nav.length > 1 ? (
            <nav
              className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted"
              aria-label="Page sections"
            >
              {nav.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="transition hover:text-accent-deep"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          ) : null}
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
        <section className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8">
          <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent-soft text-2xl font-semibold text-accent-deep ring-1 ring-border sm:h-36 sm:w-36">
            {profile.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatarUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              profile.initials
            )}
          </div>
          <div className="min-w-0">
            <h1 className="font-display text-3xl tracking-tight text-foreground sm:text-4xl">
              {profile.name}
            </h1>
            <p className="mt-2 text-base text-accent-deep">{profile.role}</p>
            {socials.length ? (
              <ul className="mt-5 flex flex-wrap items-center gap-1.5" aria-label="Links">
                {socials.map((item) => (
                  <li key={item.key}>
                    <a
                      href={item.href}
                      target={item.external ? "_blank" : undefined}
                      rel={item.external ? "noreferrer" : undefined}
                      aria-label={item.label}
                      title={item.label}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-md text-muted transition hover:bg-accent-soft hover:text-accent-deep focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40"
                    >
                      {item.icon}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </section>

        {about ? (
          <section id="about" className="mt-14 scroll-mt-24">
            <SectionTitle>Biography</SectionTitle>
            <div className="mt-5 space-y-4 text-base leading-relaxed text-muted whitespace-pre-wrap">
              {about}
            </div>
          </section>
        ) : null}

        {profile.interests.length ? (
          <section id="interests" className="mt-14 scroll-mt-24">
            <SectionTitle>Research Interests</SectionTitle>
            <ul className="mt-5 flex flex-wrap gap-2">
              {profile.interests.map((item) => (
                <li
                  key={item.label}
                  className="rounded-md bg-accent-soft px-3 py-1.5 text-sm text-accent-deep"
                >
                  {item.label}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {pubsByType.length ? (
          <section id="publications" className="mt-14 scroll-mt-24">
            <SectionTitle>Publications</SectionTitle>
            <div className="mt-8 space-y-10">
              {pubsByType.map((group) => (
                <div key={group.type}>
                  <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                    {group.label}
                  </h3>
                  <ul className="mt-4 divide-y divide-border border-y border-border">
                    {group.items.map((pub) => (
                      <li
                        key={`${pub.title}-${pub.venue}-${pub.year}`}
                        className="py-5"
                      >
                        <p className="text-base font-medium leading-snug text-foreground">
                          {pub.url ? (
                            <a
                              href={pub.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-start gap-1.5 transition hover:text-accent-deep"
                            >
                              <span>{pub.title}</span>
                              <IconExternal className="mt-1 shrink-0 opacity-50" />
                            </a>
                          ) : (
                            pub.title
                          )}
                        </p>
                        <p className="mt-1.5 text-sm text-muted">{pub.authors}</p>
                        <p className="mt-1 text-sm text-accent-deep">
                          {pub.venue}
                          {pub.year ? ` · ${pub.year}` : ""}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {profile.competitions.length ? (
          <section id="competitions" className="mt-14 scroll-mt-24">
            <SectionTitle>Competitions</SectionTitle>
            <ul className="mt-6 divide-y divide-border border-y border-border">
              {profile.competitions.map((item) => (
                <li key={`${item.name}-${item.year}`} className="py-5">
                  <p className="text-base font-medium text-foreground">
                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-start gap-1.5 hover:text-accent-deep"
                      >
                        <span>{item.name}</span>
                        <IconExternal className="mt-1 shrink-0 opacity-50" />
                      </a>
                    ) : (
                      item.name
                    )}
                  </p>
                  <p className="mt-1 text-sm text-accent-deep">
                    {[item.award, item.year].filter(Boolean).join(" · ")}
                  </p>
                  {item.description ? (
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {item.description}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {profile.applications.length ? (
          <section id="applications" className="mt-14 scroll-mt-24">
            <SectionTitle>Applications</SectionTitle>
            <ul className="mt-6 space-y-8">
              {profile.applications.map((item) => (
                <li key={item.name} className="border-b border-border pb-8 last:border-0 last:pb-0">
                  <div className="flex flex-col gap-5 sm:flex-row sm:gap-6">
                    {item.imageUrl ? (
                      <div className="aspect-[16/10] w-full shrink-0 overflow-hidden rounded-md bg-accent-soft sm:w-52">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.imageUrl}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : null}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                        <p className="text-lg font-medium text-foreground">
                          {item.url ? (
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 hover:text-accent-deep"
                            >
                              <span>{item.name}</span>
                              <IconExternal className="shrink-0 opacity-50" />
                            </a>
                          ) : (
                            item.name
                          )}
                        </p>
                        {item.kind ? (
                          <span className="text-sm text-muted">{item.kind}</span>
                        ) : null}
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-muted">
                        {item.summary}
                      </p>
                      {item.note || item.updatedAtLabel ? (
                        <p className="mt-2 text-xs text-muted">
                          {[item.updatedAtLabel, item.note]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {profile.patents.length ? (
          <section id="patents" className="mt-14 scroll-mt-24">
            <SectionTitle>Patents</SectionTitle>
            <ul className="mt-6 divide-y divide-border border-y border-border">
              {profile.patents.map((item) => (
                <li key={`${item.title}-${item.number}`} className="py-5">
                  <p className="text-base font-medium text-foreground">
                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-start gap-1.5 hover:text-accent-deep"
                      >
                        <span>{item.title}</span>
                        <IconExternal className="mt-1 shrink-0 opacity-50" />
                      </a>
                    ) : (
                      item.title
                    )}
                  </p>
                  <p className="mt-1 text-sm text-accent-deep">
                    {[item.status, item.number, item.year]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                  {item.description ? (
                    <p className="mt-2 text-sm leading-relaxed text-muted">
                      {item.description}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {profile.blogs.length ? (
          <section id="blog" className="mt-14 scroll-mt-24">
            <SectionTitle>Blog</SectionTitle>
            <ul className="mt-6 divide-y divide-border border-y border-border">
              {profile.blogs.map((post) => (
                <li key={post.slug} className="py-5">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
                    <h3 className="text-base font-medium text-foreground">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="hover:text-accent-deep"
                      >
                        {post.title}
                      </Link>
                    </h3>
                    <time
                      className="shrink-0 text-sm text-muted"
                      dateTime={post.date}
                    >
                      {formatDate(post.date)}
                    </time>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted line-clamp-2">
                    {post.excerpt}
                  </p>
                  {post.tags.length ? (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs tracking-wide text-accent-deep/80"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {profile.tutorials.length ? (
          <section id="tutorials" className="mt-14 scroll-mt-24">
            <SectionTitle>Tutorials</SectionTitle>
            <ul className="mt-6 space-y-4">
              {profile.tutorials.map((item) => (
                <li
                  key={item.slug}
                  className="border border-border bg-surface px-5 py-5"
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                    <span className="rounded-sm bg-accent-soft px-2 py-0.5 font-medium text-accent-deep">
                      {item.level}
                    </span>
                    <span>{item.chapterCount} chapters</span>
                    {item.tags.map((tag) => (
                      <span key={tag}>#{tag}</span>
                    ))}
                  </div>
                  <h3 className="mt-2 text-lg font-medium text-foreground">
                    <Link
                      href={`/tutorial/${item.slug}`}
                      className="hover:text-accent-deep"
                    >
                      {item.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted line-clamp-2">
                    {item.description}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </main>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="border-b border-border pb-3 font-display text-2xl tracking-tight text-foreground">
      {children}
    </h2>
  );
}

function iconProps(className?: string) {
  return {
    className: className ?? "h-5 w-5",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };
}

function IconMail() {
  return (
    <svg {...iconProps()}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function IconGitHub() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
    </svg>
  );
}

function IconScholar() {
  return (
    <svg {...iconProps()}>
      <path d="M4 10.5 12 5l8 5.5-8 5.5-8-5.5Z" />
      <path d="M6.5 12.5v4.2c0 .4.6 1.3 5.5 2.8 4.9-1.5 5.5-2.4 5.5-2.8v-4.2" />
      <path d="M20 10.5V16" />
    </svg>
  );
}

function IconCv() {
  return (
    <svg {...iconProps()}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
      <path d="M14 3v5h5" />
      <path d="M9 13h6M9 17h4" />
    </svg>
  );
}

function IconX() {
  return (
    <svg
      className="h-4 w-4"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.835L1.854 2.25H8.08l4.253 5.622L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

function IconGlobe() {
  return (
    <svg {...iconProps()}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18Z" />
    </svg>
  );
}

function IconExternal({ className }: { className?: string }) {
  return (
    <svg
      className={`h-3.5 w-3.5 ${className ?? ""}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}
