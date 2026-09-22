"use client";
import { useMemo, useState } from "react";
import ReviewCard from "@/components/ReviewCard";
import { MEDIA } from "@/lib/content";
import { getRubric } from "@/data/rubric";

// Client-side filtering over the sample set. Combinable: medium, kind,
// decade, tag, rubric category score, spoiler-free. Never sorted by score.
export default function ReviewFilters({ reviews, lockMedium = null }) {
  const [medium, setMedium] = useState(lockMedium || "");
  const [kind, setKind] = useState("");
  const [decade, setDecade] = useState("");
  const [tag, setTag] = useState("");
  const [cat, setCat] = useState("");
  const [catScore, setCatScore] = useState("");
  const [spoilerFree, setSpoilerFree] = useState(false);

  const rubric = getRubric("film-v1");
  const tags = useMemo(() => [...new Set(reviews.flatMap((r) => r.tags || []))].sort(), [reviews]);
  const decades = useMemo(() => [...new Set(reviews.map((r) => Math.floor(r.workYear / 10) * 10))].sort(), [reviews]);

  const shown = reviews.filter((r) => {
    if (medium && r.medium !== medium) return false;
    if (kind && r.kind !== kind) return false;
    if (decade && Math.floor(r.workYear / 10) * 10 !== Number(decade)) return false;
    if (tag && !(r.tags || []).includes(tag)) return false;
    if (spoilerFree && !r.spoilerFree) return false;
    if (cat && catScore !== "") {
      if (!r.scores) return false;
      if (String(r.scores[cat]) !== catScore) return false;
    }
    return true;
  });

  return (
    <div className="stack">
      <form className="filters" onSubmit={(e) => e.preventDefault()}>
        {!lockMedium && (
          <label>
            Medium
            <select value={medium} onChange={(e) => setMedium(e.target.value)}>
              <option value="">All</option>
              {Object.entries(MEDIA).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </select>
          </label>
        )}
        <label>
          Kind
          <select value={kind} onChange={(e) => setKind(e.target.value)}>
            <option value="">All</option>
            <option value="review">Numbered reviews</option>
            <option value="recommendation">Recommendations</option>
            <option value="commentary">Commentary</option>
          </select>
        </label>
        <label>
          Decade
          <select value={decade} onChange={(e) => setDecade(e.target.value)}>
            <option value="">All</option>
            {decades.map((d) => (
              <option key={d} value={d}>{d}s</option>
            ))}
          </select>
        </label>
        <label>
          Tag
          <select value={tag} onChange={(e) => setTag(e.target.value)}>
            <option value="">All</option>
            {tags.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </label>
        <label>
          Scored
          <select value={cat} onChange={(e) => { setCat(e.target.value); setCatScore(""); }}>
            <option value="">Any category</option>
            {rubric.categories.map((c) => (
              <option key={c.key} value={c.key}>{c.label}</option>
            ))}
          </select>
        </label>
        {cat && (
          <label>
            At
            <select value={catScore} onChange={(e) => setCatScore(e.target.value)}>
              <option value="">Any</option>
              {Array.from({ length: rubric.categories.find((c) => c.key === cat).max + 1 }, (_, i) => (
                <option key={i} value={String(i)}>{i}</option>
              ))}
            </select>
          </label>
        )}
        <label className="check">
          <input type="checkbox" checked={spoilerFree} onChange={(e) => setSpoilerFree(e.target.checked)} />
          Spoiler-free only
        </label>
      </form>
      <p className="muted">{shown.length} of {reviews.length}, newest first.</p>
      <ul className="card-grid">
        {shown.map((r) => (
          <ReviewCard key={r.slug} review={r} />
        ))}
      </ul>
    </div>
  );
}
