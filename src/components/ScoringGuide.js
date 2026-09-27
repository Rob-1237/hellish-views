import { getPost } from "@/lib/content";
import { rubrics } from "@/data/rubric";
import Blocks from "./Blocks";
import Decision from "./Decision";
import Modal from "./Modal";
import ReaderScorer from "./ReaderScorer";

// The scoring explainer, read on demand from the Reviews page. One column so
// the explainer and the rubric read in order instead of side by side.
// /reviews#scoring opens it directly.
export default function ScoringGuide() {
  const explainer = getPost("the-hellish-views-scoring-system");
  const rubric = rubrics["film-v1"];
  return (
    <Modal label="How the scores work" title="How the scores work" buttonClass="btn btn--accent" eyebrow="The scoring system" hash="scoring" wide>
      <>
        <div className="prose">
          <Blocks blocks={explainer.body} />
        </div>

        <section className="stack">
          <div className="decision-wrap">
            <h3 className="modal__subhead">{rubric.title}</h3>
            {/* <Decision id="culture-per-medium" /> */}
          </div>
          <ul className="rubric-grid">
            {rubric.categories.map((c) => (
              <li key={c.key} className="card">
                <h4>
                  {c.label} <span className="muted">{c.min}–{c.max}{c.allowNA ? " or N/A" : ""}</span>
                  {c.key === "vibes" && <> <Decision id="vibes-rung-order" /></>}
                </h4>
                <ol start={c.min}>
                  {c.rungs.map((r, i) => (
                    <li key={i} value={i + c.min}>{r}</li>
                  ))}
                </ol>
              </li>
            ))}
          </ul>
          <p className="muted" style={{ fontSize: "var(--text-sm)" }}>
            Total out of {rubric.maxTotal}. N/A on Cultural Significance drops the maximum to 20 rather than counting as zero.
          </p>
        </section>

        <section className="stack">
          <div className="decision-wrap">
            <h3 className="modal__subhead">Score one yourself</h3>
            {/* <Decision id="reader-scorer" /> */}
          </div>
          <ReaderScorer rubricId="film-v1" />
        </section>
      </>
    </Modal>
  );
}
