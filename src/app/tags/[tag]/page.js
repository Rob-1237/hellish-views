import Link from "next/link";
import ContentCard from "@/components/ContentCard";
import { allTags, itemsByTag, formatDate } from "@/lib/content";

export function generateStaticParams() {
  return allTags().map(({ tag }) => ({ tag }));
}
export async function generateMetadata({ params }) {
  const { tag } = await params;
  return { title: `Tagged “${tag}”` };
}

export default async function TagPage({ params }) {
  const { tag } = await params;
  const items = itemsByTag(tag);
  return (
    <div className="container">
      <div className="page-head">
        <p className="eyebrow">Tag</p>
        <h1>{tag}</h1>
        <p>{items.length} item{items.length === 1 ? "" : "s"}. All tags: {allTags().map(({ tag: t }) => <Link key={t} href={`/tags/${t}`} style={{ marginRight: "var(--space-2)" }}>{t}</Link>)}</p>
      </div>
      <ul className="card-grid">
        {items.map((i) => (
          <ContentCard key={i.href} href={i.href} image={i.cover} eyebrow={i.type} title={i.title} dek={i.dek} meta={[formatDate(i.publishedAt)]} />
        ))}
      </ul>
      <div style={{ height: "var(--space-12)" }} />
    </div>
  );
}
