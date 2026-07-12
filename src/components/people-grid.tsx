import type { Person } from "@/data/people";

export function PeopleGrid({ items }: { items: Person[] }) {
  return (
    <div className="grid gap-8 sm:grid-cols-2">
      {items.map((person) => (
        <article
          key={person.id}
          className="flex gap-5 border-b border-border pb-8 last:border-b-0 sm:last:border-b sm:odd:pr-4 sm:even:pl-4"
        >
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent-soft font-medium text-accent-deep"
            aria-hidden
          >
            {person.initials}
          </div>
          <div>
            <h2 className="font-display text-xl tracking-tight text-foreground">
              {person.name}
            </h2>
            <p className="mt-1 text-sm text-accent-deep">{person.role}</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {person.bio}
            </p>
            {person.links?.length ? (
              <ul className="mt-3 flex flex-wrap gap-3 text-sm">
                {person.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-foreground/80 underline-offset-4 hover:text-accent-deep hover:underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}
