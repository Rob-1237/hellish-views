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
  if (!w) return {};
  return {
    title: w.title,
    description: w.dek,
    alternates: { canonical: `/writing/${w.slug}` },
    openGraph: { title: w.title, description: w.dek, type: "article", url: `/writing/${w.slug}`, publishedTime: w.publishedAt },
  };
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
        <Byline contributors={w.contributors} publishedAt={w.publishedAt} extra={w.wordCount ? <span>{w.wordCount.toLocaleString("en-GB")} words</span> : null} />
      </header>
      <div className="stack" style={{ gap: "var(--space-8)" }}>
        <ContentWarnings warnings={w.contentWarning ? [w.contentWarning] : []} />
        {w.preface?.length > 0 && (
          <div className="author-note">
            <Blocks blocks={w.preface} />
          </div>
        )}
        {w.image && (
          <figure className="writing-image">
            <img src={w.image.src} alt={w.image.alt || ""} />
            {w.image.caption && <figcaption dangerouslySetInnerHTML={{ __html: w.image.caption }} />}
          </figure>
        )}
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
        {w.signOff?.length > 0 && (
          <div className="sign-off">
            <Blocks blocks={w.signOff} />
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
