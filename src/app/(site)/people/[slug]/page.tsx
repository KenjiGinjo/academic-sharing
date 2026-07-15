import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PersonProfile } from "@/components/PersonProfile";
import { getPersonProfile } from "@/lib/content";
import { profilePublicUrl } from "@/lib/profile";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const profile = await getPersonProfile(slug);
  if (!profile) return {};
  return {
    title: profile.name,
    description: profile.bio,
    alternates: {
      canonical: profilePublicUrl(profile.slug),
    },
  };
}

export default async function PersonProfilePage({ params }: Props) {
  const { slug } = await params;
  const profile = await getPersonProfile(slug);
  if (!profile) notFound();
  return <PersonProfile profile={profile} />;
}
