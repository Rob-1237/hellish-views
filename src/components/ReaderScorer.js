"use client";
import { useState } from "react";
import RubricChart from "@/components/RubricChart";
import { getRubric } from "@/data/rubric";

// A visitor fills in the five categories and gets their own chart.
export default function ReaderScorer({ rubricId }) {
  const rubric = getRubric(rubricId);
  const [scores, setScores] = useState(Object.fromEntries(rubric.categories.map((c) => [c.key, c.min ?? 0])));
  return (
    <div className="scorer-layout">
      <form className="scorer" onSubmit={(e) => e.preventDefault()}>
        {rubric.categories.map((c) => (
          <label key={c.key}>
            {c.label}
            <select value={String(scores[c.key])} onChange={(e) => setScores({ ...scores, [c.key]: e.target.value === "na" ? "na" : Number(e.target.value) })}>
              {c.allowNA && <option value="na">N/A</option>}
              {c.rungs.map((r, i) => (
                <option key={i} value={i + (c.min ?? 0)}>{i + (c.min ?? 0)} — {r}</option>
              ))}
            </select>
          </label>
        ))}
        <p className="muted" style={{ fontSize: "var(--text-sm)" }}>Copy-as-image lands here once the PNG export exists.</p>
      </form>
      <RubricChart rubricId={rubricId} scores={scores} showDecisions={false} />
    </div>
  );
}
