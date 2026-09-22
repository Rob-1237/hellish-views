import Link from "next/link";
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
          <li key={i.href} className="card">
            <p className="eyebrow">{i.type}</p>
            <h3><Link href={i.href}>{i.title}</Link></h3>
            <p className="muted">{i.dek}</p>
            <p className="meta">{formatDate(i.publishedAt)}</p>
          </li>
        ))}
      </ul>
      <div style={{ height: "var(--space-12)" }} />
    </div>
  );
}
