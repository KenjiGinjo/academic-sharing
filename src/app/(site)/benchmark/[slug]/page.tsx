import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BenchmarkView } from "@/components/BenchmarkView";
import { getPublishedBenchmark, listPublishedBenchmarks } from "@/lib/benchmark";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const benchmark = await getPublishedBenchmark(slug);
  if (!benchmark) return { title: "Benchmark" };
  return {
    title: benchmark.name,
    description: benchmark.description || undefined,
  };
}

export default async function BenchmarkPage({ params }: Props) {
  const { slug } = await params;
  const [benchmark, items] = await Promise.all([
    getPublishedBenchmark(slug),
    listPublishedBenchmarks(),
  ]);
  if (!benchmark) notFound();

  return (
    <BenchmarkView
      items={items}
      activeSlug={benchmark.slug}
      current={{
        name: benchmark.name,
        description: benchmark.description,
        info: benchmark.info,
        ranked: benchmark.ranked,
      }}
    />
  );
}
