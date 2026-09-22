import Link from "next/link";
import { allWriting, formatDate } from "@/lib/content";

export const metadata = { title: "Writing" };

export default function WritingPage() {
  const items = allWriting();
  return (
    <div className="container">
      <div className="page-head">
        <h1>Writing</h1>
        <p>Original fiction and poetry. Never scored.</p>
      </div>
      <ul className="card-grid">
        {items.map((w) => (
          <li key={w.slug} className="card">
            <p className="eyebrow">{w.form}</p>
            <h3><Link href={`/writing/${w.slug}`}>{w.title}</Link></h3>
            <p className="muted">{w.dek}</p>
            <p className="meta">
              <span>{formatDate(w.publishedAt)}</span>
              <span>{w.wordCount.toLocaleString("en-GB")} words</span>
              {w.contentWarning && <span>Content warning</span>}
            </p>
          </li>
        ))}
      </ul>
      <div style={{ height: "var(--space-12)" }} />
    </div>
  );
}
