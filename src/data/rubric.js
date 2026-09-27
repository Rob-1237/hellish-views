// Rubric versions. In the real build these are Sanity documents; each review
// points at one by id. Labels are Harry's, from the key image on every scored
// review and "The Hellish Views Scoring System - An Expanded Explanation".
//
// Every category starts at 1, not 0. Max total: Fun, Scary, Vibes and Sick at
// 1–5 (20) plus Cultural Significance at 1–3 (23). Category order is his.

export const rubrics = {
  "film-v1": {
    id: "film-v1",
    title: "Hellish Views scoring, films",
    medium: "film",
    maxTotal: 23,
    categories: [
      {
        key: "fun",
        label: "Fun",
        min: 1,
        max: 5,
        rungs: ["Not fun", "A bit fun", "Pretty fun", "Fun", "Fucking fun"],
      },
      {
        key: "culture",
        label: "Cultural Significance",
        min: 1,
        max: 3,
        allowNA: true,
        // Exemplars for Essential: The Wicker Man (1973), Scream (1996).
        rungs: ["Big in Horror Circles", "Significant", "Essential"],
      },
      {
        key: "scary",
        label: "Scary",
        min: 1,
        max: 5,
        rungs: ["Not really scary", "A bit scary", "Quite scary", "Scary", "Fucking scary"],
      },
      {
        key: "vibes",
        label: "Vibes",
        min: 1,
        max: 5,
        // Rungs 1 and 2 do not climb monotonically. Confirmed deliberate
        // 2026-09-23: readers are used to this order, so it stays. The chart
        // must not reorder or "correct" it.
        rungs: ["Bit of vibes", "Not my vibes", "Vibes", "So vibes", "Bang on"],
      },
      {
        key: "sick",
        label: "Sick",
        min: 1,
        max: 5,
        // Sick is how much he loved it, not how gory it is.
        rungs: ["Pretty good", "Good", "Great", "Brilliant", "Ultimate"],
      },
    ],
  },
};

// Rungs are stored from the category's minimum, so look them up by score.
export function rungLabel(cat, v) {
  return cat.rungs[v - (cat.min ?? 0)];
}

export function getRubric(id) {
  return rubrics[id] || null;
}

// Sum the scored categories. N/A contributes nothing and is not counted
// against the max either — the review's displayed max drops accordingly.
export function scoreTotal(rubric, scores) {
  if (!rubric || !scores) return null;
  let total = 0;
  let max = 0;
  for (const cat of rubric.categories) {
    const v = scores[cat.key];
    if (v === "na" || v === null || v === undefined) continue;
    total += v;
    max += cat.max;
  }
  return { total, max };
}
