import { getRubric, scoreTotal } from "@/data/rubric";

// The five-segment glyph for cards: shape first, total second.
export default function ScoreGlyph({ rubricId, scores }) {
  const rubric = getRubric(rubricId);
  if (!rubric || !scores) return <span className="unscored">Unscored</span>;
  const { total, max } = scoreTotal(rubric, scores);
  return (
    <span className="score-line">
      <span className="score-glyph" aria-hidden="true">
        {rubric.categories.map((c) => {
          const v = scores[c.key];
          const na = v === "na";
          const h = na ? 2 : Math.max(2, Math.round((v / c.max) * 20));
          return <span key={c.key} className={na ? "na" : ""} style={{ height: `${h}px` }} />;
        })}
      </span>
      <strong>
        {total}/{max}
      </strong>
      <span className="chart__text">
        {rubric.categories.map((c) => `${c.label} ${scores[c.key] === "na" ? "N/A" : scores[c.key]}`).join(", ")}
      </span>
    </span>
  );
}
