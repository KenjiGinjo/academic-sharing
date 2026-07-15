import Link from "next/link";
import type { PersonView } from "@/lib/content";
import { profilePath } from "@/lib/profile";

export function PeopleGrid({ items }: { items: PersonView[] }) {
  return (
    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((person) => {
        const profileHref =
          person.profileEnabled && person.slug
            ? profilePath(person.slug)
            : null;

        return (
          <article
            key={person.id}
            className="flex h-full flex-col border-b border-border pb-10 sm:border-0 sm:pb-0"
          >
            <div
              className="mx-auto flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent-soft text-xl font-semibold text-accent-deep sm:h-32 sm:w-32 sm:text-2xl"
              aria-hidden
            >
              {person.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={person.avatarUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                person.initials
              )}
            </div>

            <div className="mt-5 flex flex-1 flex-col text-center">
              <h3 className="font-display text-xl tracking-tight text-foreground sm:text-2xl">
                {profileHref ? (
                  <Link
                    href={profileHref}
                    className="transition hover:text-accent-deep"
                  >
                    {person.name}
                  </Link>
                ) : (
                  person.name
                )}
              </h3>
              <p className="mt-1 text-sm font-medium text-accent-deep">
                {person.role}
              </p>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted line-clamp-4">
                {person.bio}
              </p>

              {person.websiteHref ? (
                <div className="mt-6 border-t border-border pt-4">
                  <a
                    href={person.websiteHref}
                    target={
                      person.websiteHref.startsWith("http") ? "_blank" : undefined
                    }
                    rel={
                      person.websiteHref.startsWith("http")
                        ? "noreferrer"
                        : undefined
                    }
                    className="text-sm font-medium text-foreground/80 underline-offset-4 hover:text-accent hover:underline"
                  >
                    Website
                  </a>
                </div>
              ) : (
                <div className="mt-6 border-t border-transparent pt-4" aria-hidden />
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
