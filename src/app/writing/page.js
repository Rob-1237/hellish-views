import ContentCard from "@/components/ContentCard";
import { allWriting, formatDate } from "@/lib/content";

export const metadata = { title: "Writing" };

export default function WritingPage() {
  const items = allWriting();
  return (
    <div className="container">
      <div className="page-head">
        <h1>Writing</h1>
        <p>Original fiction and poetry</p>
      </div>
      <ul className="card-grid">
        {items.map((w) => (
          <ContentCard
            key={w.slug}
            href={`/writing/${w.slug}`}
            image={w.cover}
            eyebrow={w.form}
            title={w.title}
            dek={w.dek}
            meta={[formatDate(w.publishedAt), w.wordCount && `${w.wordCount.toLocaleString("en-GB")} words`, w.contentWarning && "Content warning"]}
          />
        ))}
      </ul>
      <div style={{ height: "var(--space-12)" }} />
    </div>
  );
}
