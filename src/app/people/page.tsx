import type { Metadata } from "next";
import { SectionHeading } from "@/components/BlogList";
import { PeopleGrid } from "@/components/PeopleGrid";
import { people } from "@/data/people";

export const metadata: Metadata = {
  title: "People",
  description: "Contributors and creators on Academic Sharing.",
};

export default function PeoplePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
      <SectionHeading
        eyebrow="People"
        title="Writers and builders in the directory"
      />
      <p className="mb-10 max-w-2xl text-base leading-relaxed text-muted">
        A calm academic directory — roles, short bios, and optional links. No
        feeds, no engagement metrics.
      </p>
      <PeopleGrid items={people} />
    </div>
  );
}
