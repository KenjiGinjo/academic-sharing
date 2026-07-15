import { BlogList, SectionHeading } from "@/components/BlogList";
import { FeaturedCarousel } from "@/components/FeaturedCarousel";
import { Hero } from "@/components/Hero";
import { PeopleGrid } from "@/components/PeopleGrid";
import { TutorialList } from "@/components/TutorialList";
import {
  listCarouselItems,
  listPeople,
  listPublishedBlogs,
  listPublishedTutorials,
} from "@/lib/content";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [blogs, tutorials, people, carousel] = await Promise.all([
    listPublishedBlogs(),
    listPublishedTutorials(),
    listPeople(),
    listCarouselItems(6),
  ]);

  return (
    <>
      <Hero />
      <FeaturedCarousel items={carousel} />

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
        <PeopleGrid items={people.slice(0, 3)} />
      </section>
    </>
  );
}
