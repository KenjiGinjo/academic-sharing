import type { PersonView } from "@/lib/content";

export function PeopleGrid({ items }: { items: PersonView[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {items.map((person) => (
        <article
          key={person.id}
          className="flex gap-5 border-b border-border pb-6 sm:border-0 sm:pb-0"
        >
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-accent-soft text-sm font-semibold text-accent-deep"
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
          <div>
            <h3 className="text-lg font-medium tracking-tight text-foreground">
              {person.name}
            </h3>
            <p className="mt-0.5 text-sm text-accent-deep">{person.role}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">{person.bio}</p>
            {person.links?.length ? (
              <div className="mt-3 flex gap-3">
                {person.links.map((link) => (
                  <a
                    key={link.href + link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-foreground/80 underline-offset-4 hover:text-accent hover:underline"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}
