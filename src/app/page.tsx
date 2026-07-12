import Link from "next/link";
import { BlogList, SectionHeading } from "@/components/BlogList";
import { Hero } from "@/components/Hero";
import { PeopleGrid } from "@/components/PeopleGrid";
import { Pillars } from "@/components/Pillars";
import { TutorialList } from "@/components/TutorialList";
import { blogs } from "@/data/blogs";
import { people } from "@/data/people";
import { tutorials } from "@/data/tutorials";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Pillars />

      <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8">
        <SectionHeading
          eyebrow="Latest Blog"
          title="Recent notes from the archive"
          href="/blog"
          linkLabel="All posts"
        />
        <BlogList posts={blogs.slice(0, 3)} compact />
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8">
          <SectionHeading
            eyebrow="Featured Tutorials"
            title="Structured series worth starting"
            href="/tutorial"
            linkLabel="All tutorials"
          />
          <TutorialList items={tutorials.slice(0, 3)} />
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-8">
        <SectionHeading
          eyebrow="People"
          title="Contributors behind the work"
          href="/people"
          linkLabel="Meet everyone"
        />
        <PeopleGrid items={people.slice(0, 4)} />
        <div className="mt-10">
          <Link
            href="/people"
            className="text-sm font-medium text-accent-deep hover:text-accent"
          >
            View the full directory →
          </Link>
        </div>
      </section>
    </>
  );
}
