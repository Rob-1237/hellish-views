import { getRubric, scoreTotal, rungLabel } from "@/data/rubric";
import Decision from "./Decision";

// Renders the versioned rubric with the scored rung lit, an N/A treatment,
// a designed unscored state, and a screen-reader text equivalent.
// Animation is CSS only and respects prefers-reduced-motion via tokens.css.
export default function RubricChart({ rubricId, scores, title, showDecisions = true, compactLabels = false }) {
  const rubric = getRubric(rubricId);

  if (!rubric || !scores) {
    return (
      <div className="chart chart--unscored">
        <p className="chart__title">Unscored</p>
        <p>
          {title ? `${title} was published before scoring, or is not the kind of post that gets one.` : "No score for this post."}
        </p>
      </div>
    );
  }

  const { total, max } = scoreTotal(rubric, scores);
  const text = rubric.categories
    .map((c) => {
      const v = scores[c.key];
      return v === "na" ? `${c.label}: not applicable` : `${c.label}: ${v} of ${c.max}, ${rungLabel(c, v)}`;
    })
    .join(". ");

  return (
    <figure className="chart chart--enter" aria-describedby="chart-text">
      <div className="chart__head">
        <div>
          <p className="eyebrow">{rubric.title}</p>
          {showDecisions && (
            <div className="decision-wrap" style={{ marginTop: "var(--space-2)" }}>
              {/* <Decision id="vibes-rung-order" /> */}
              {/* <Decision id="culture-per-medium" /> */}
            </div>
          )}
        </div>
        <p className="chart__total">
          {total} <small>/ {max}</small>
        </p>
      </div>
      {rubric.categories.map((c) => {
        const v = scores[c.key];
        const na = v === "na";
        return (
          <div key={c.key}>
            <div className="chart__row">
              <div className="chart__label">
                {c.label}
                {!compactLabels && <small>{na ? "N/A" : rungLabel(c, v)}</small>}
              </div>
              <div className="chart__rungs" aria-hidden="true">
                {na ? (
                  <div className="chart__rung is-na" />
                ) : (
                  Array.from({ length: c.max }, (_, i) => {
                    const step = i + 1;
                    const cls = step < v ? "is-lit" : step === v ? "is-top" : "";
                    return <div key={i} className={`chart__rung ${cls}`} style={{ "--i": i }} title={rungLabel(c, step)} />;
                  })
                )}
              </div>
            </div>
          </div>
        );
      })}
      <figcaption id="chart-text" className="chart__text">
        Score {total} of {max}. {text}.
      </figcaption>
    </figure>
  );
}
