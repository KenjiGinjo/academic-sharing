import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { BenchmarkView } from "@/components/BenchmarkView";
import { listPublishedBenchmarks } from "@/lib/benchmark";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Benchmark",
  description: "Leaderboards from CG NeuroAI.",
};

export default async function BenchmarkIndexPage() {
  const items = await listPublishedBenchmarks();
  const first = items[0];
  if (first) redirect(`/benchmark/${first.slug}`);

  return <BenchmarkView items={[]} current={null} />;
}
