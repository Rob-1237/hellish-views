import { notFound } from "next/navigation";
import { allSeries, getSeries, seriesMembers } from "@/lib/content";
import ReviewCard from "@/components/ReviewCard";

export function generateStaticParams() {
  return allSeries().map((s) => ({ slug: s.slug }));
}
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const s = getSeries(slug);
  return s ? { title: s.title } : {};
}

export default async function SeriesDetail({ params }) {
  const { slug } = await params;
  const s = getSeries(slug);
  if (!s) notFound();
  const members = seriesMembers(slug);
  return (
    <div className="container">
      <div className="page-head">
        <p className="eyebrow">Series</p>
        <h1>{s.title}</h1>
        <p>{s.intro}</p>
      </div>
      <ol className="card-grid" style={{ listStyle: "none" }}>
        {members.map((m, i) => (
          <ReviewCard key={m.slug} review={{ ...m, dek: `Part ${i + 1}. ${m.dek}` }} />
        ))}
      </ol>
      <div style={{ height: "var(--space-12)" }} />
    </div>
  );
}
