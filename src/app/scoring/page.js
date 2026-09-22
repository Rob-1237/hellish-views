import { getPost } from "@/lib/content";
import { rubrics } from "@/data/rubric";
import Blocks from "@/components/Blocks";
import Decision from "@/components/Decision";
import ReaderScorer from "./ReaderScorer";

export const metadata = { title: "Scoring" };

export default function ScoringPage() {
  const explainer = getPost("how-i-score-things");
  const rubric = rubrics["film-v1"];
  return (
    <div className="container">
      <div className="page-head">
        <h1>How the scores work</h1>
        <p>The explainer, in Harry's words, next to the rubric the charts are built from. They can't drift apart because they're the same data.</p>
      </div>

      <div className="two-col">
        <div className="prose">
          <Blocks blocks={explainer.body} />
        </div>
        <div className="stack">
          <div className="decision-wrap">
            <p className="eyebrow">{rubric.title}</p>
            <Decision id="culture-per-medium" />
          </div>
          {rubric.categories.map((c) => (
            <div key={c.key} className="card" style={{ gap: "var(--space-2)" }}>
              <h3>
                {c.label} <span className="muted">0–{c.max}{c.allowNA ? " or N/A" : ""}</span>
                {c.key === "vibes" && <> <Decision id="vibes-rung-order" /></>}
              </h3>
              <ol start={0} style={{ paddingLeft: "var(--space-5)", fontSize: "var(--text-sm)" }}>
                {c.rungs.map((r, i) => (
                  <li key={i} value={i}>{r}</li>
                ))}
              </ol>
            </div>
          ))}
          <p className="muted" style={{ fontSize: "var(--text-sm)" }}>Total out of {rubric.maxTotal}. N/A on Cultural Significance drops the maximum to 20 rather than counting as zero.</p>
        </div>
      </div>

      <section className="section">
        <div className="decision-wrap" style={{ marginBottom: "var(--space-5)" }}>
          <h2>Score one yourself</h2>
          <Decision id="reader-scorer" />
        </div>
        <ReaderScorer rubricId="film-v1" />
      </section>
    </div>
  );
}
