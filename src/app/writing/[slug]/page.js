import { notFound } from "next/navigation";
import { allWriting, getWriting } from "@/lib/content";
import Blocks from "@/components/Blocks";
import Byline from "@/components/Byline";
import ContentWarnings from "@/components/ContentWarnings";
import SubscribeBlock from "@/components/SubscribeBlock";

export function generateStaticParams() {
  return allWriting().map((w) => ({ slug: w.slug }));
}
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const w = getWriting(slug);
  return w ? { title: w.title, description: w.dek } : {};
}

// Two templates: poetry (stanzas and lines, narrow measure, no justification)
// and fiction (authored italics/bold preserved, wide measure).
export default async function WritingPiece({ params }) {
  const { slug } = await params;
  const w = getWriting(slug);
  if (!w) notFound();
  return (
    <article className="container">
      <header className="page-head stack">
        <p className="eyebrow">{w.form}</p>
        <h1>{w.title}</h1>
        <p style={{ fontSize: "var(--text-lg)" }}>{w.dek}</p>
        <Byline contributors={w.contributors} publishedAt={w.publishedAt} extra={<span>{w.wordCount.toLocaleString("en-GB")} words</span>} />
      </header>
      <div className="stack" style={{ gap: "var(--space-8)" }}>
        <ContentWarnings warnings={w.contentWarning ? [w.contentWarning] : []} />
        {w.form === "poetry" ? (
          <div className="poem">
            {w.stanzas.map((st, i) => (
              <div className="stanza" key={i}>
                {st.map((line, j) => (
                  <div className="line" key={j}>{line}</div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="fiction">
            <Blocks blocks={w.body} />
          </div>
        )}
        <p className="muted" style={{ fontSize: "var(--text-sm)" }}>
          Originally published on <a href={w.substackUrl}>Substack</a>.
        </p>
        <div style={{ maxWidth: "32rem" }}><SubscribeBlock compact /></div>
      </div>
      <div style={{ height: "var(--space-12)" }} />
    </article>
  );
}
