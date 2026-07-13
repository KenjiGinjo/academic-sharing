import type { Metadata } from "next";
import { SectionHeading } from "@/components/BlogList";
import { PeopleGrid } from "@/components/PeopleGrid";
import { listPeople } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "People",
  description: "Fixed contributors on Academic Sharing.",
};

export default async function PeoplePage() {
  const people = await listPeople();

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
      <SectionHeading
        eyebrow="People"
        title="Writers and builders in the directory"
      />
      <p className="mb-10 max-w-2xl text-base leading-relaxed text-muted">
        A fixed set of contributors managed by admins — roles, short bios, and
        optional links.
      </p>
      <PeopleGrid items={people} />
    </div>
  );
}
