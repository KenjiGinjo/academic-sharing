import type { Metadata } from "next";
import { SectionHeading } from "@/components/BlogList";
import { PeopleGrid } from "@/components/PeopleGrid";
import { listPeople } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "People",
  description: "Researchers and writers in the CG NeurAI directory.",
};

export default async function PeoplePage() {
  const people = await listPeople();

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
      <SectionHeading
        eyebrow="People"
        title="Researchers and builders"
      />
      <p className="mb-12 max-w-2xl text-base leading-relaxed text-muted">
        Profiles managed in the admin console — name, role, bio, and a personal
        academic site when enabled.
      </p>
      <PeopleGrid items={people} />
    </div>
  );
}
