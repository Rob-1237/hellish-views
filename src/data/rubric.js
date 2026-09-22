// Rubric versions. In the real build these are Sanity documents; each review
// points at one by id. Rung labels marked PLACEHOLDER are stand-ins until
// Harry's actual wording is copied from the scoring explainer.
//
// Max total: four categories at 0–5 (20) plus Cultural Significance at 0–3 (23).

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
        max: 5,
        rungs: ["No fun at all", "A flicker", "Some fun", "Good fun", "Great fun", "A riot"], // PLACEHOLDER
      },
      {
        key: "scary",
        label: "Scary",
        max: 5,
        rungs: ["Not scary", "Uneasy", "Tense", "Frightening", "Very scary", "Terrifying"], // PLACEHOLDER
      },
      {
        key: "vibes",
        label: "Vibes",
        max: 5,
        // Rungs 1 and 2 are Harry's actual labels and do not climb monotonically.
        // Open question to Harry (decision: vibes-rung-order). Others PLACEHOLDER.
        rungs: ["No vibes", "Bit of vibes", "Not my vibes", "Decent vibes", "Strong vibes", "Immaculate vibes"],
      },
      {
        key: "sick",
        label: "Sick",
        max: 5,
        rungs: ["Clean", "A little blood", "Nasty", "Grim", "Vile", "Unwatchable"], // PLACEHOLDER
      },
      {
        key: "culture",
        label: "Cultural Significance",
        max: 3,
        allowNA: true,
        // Rungs 1 and 2 are Harry's actual labels. Exemplars: The Wicker Man, Scream.
        rungs: ["Forgotten", "Cult Film", "Big in Horror Circles", "Household name"],
      },
    ],
  },
};

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
