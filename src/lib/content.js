import { reviews, writing, posts, series } from "@/data/content";

export const MEDIA = {
  film: { label: "Films", singular: "Film" },
  tv: { label: "TV", singular: "TV" },
  book: { label: "Books", singular: "Book" },
};

const byDateDesc = (a, b) => (a.publishedAt < b.publishedAt ? 1 : -1);

export function allReviews() {
  return [...reviews].sort(byDateDesc);
}
export function getReview(slug) {
  return reviews.find((r) => r.slug === slug) || null;
}
export function reviewsByMedium(medium) {
  return allReviews().filter((r) => r.medium === medium);
}
export function allWriting() {
  return [...writing].sort(byDateDesc);
}
export function getWriting(slug) {
  return writing.find((w) => w.slug === slug) || null;
}
export function allPosts() {
  return [...posts].sort(byDateDesc);
}
export function getPost(slug) {
  return posts.find((p) => p.slug === slug) || null;
}
export function allSeries() {
  return series;
}
export function getSeries(slug) {
  return series.find((s) => s.slug === slug) || null;
}
export function seriesMembers(slug) {
  return reviews
    .filter((r) => r.series === slug)
    .sort((a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0));
}
export function seriesNeighbours(review) {
  if (!review?.series) return null;
  const members = seriesMembers(review.series);
  const i = members.findIndex((m) => m.slug === review.slug);
  return {
    series: getSeries(review.series),
    prev: members[i - 1] || null,
    next: members[i + 1] || null,
    position: i + 1,
    count: members.length,
  };
}

// Everything, typed and routed, for home/recent, index, search, tags, RSS.
export function allItems() {
  return [
    ...reviews.map((r) => ({ ...r, type: "review", href: `/reviews/${r.slug}` })),
    ...writing.map((w) => ({ ...w, type: "writing", href: `/writing/${w.slug}` })),
    ...posts.map((p) => ({ ...p, type: "post", href: `/posts/${p.slug}` })),
  ].sort(byDateDesc);
}

export function allTags() {
  const counts = new Map();
  for (const item of allItems()) for (const t of item.tags || []) counts.set(t, (counts.get(t) || 0) + 1);
  return [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([tag, count]) => ({ tag, count }));
}

export function itemsByTag(tag) {
  return allItems().filter((i) => (i.tags || []).includes(tag));
}

export function relatedReviews(review, n = 3) {
  const tags = new Set(review.tags || []);
  return allReviews()
    .filter((r) => r.slug !== review.slug)
    .map((r) => ({ r, score: (r.tags || []).filter((t) => tags.has(t)).length + (r.medium === review.medium ? 0.5 : 0) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, n)
    .map((x) => x.r);
}

const blockText = (b) => (b.type === "paragraph" || b.type === "pullQuote" ? b.text : b.items ? b.items.join(" ") : "");

export function searchItems(q) {
  const needle = q.trim().toLowerCase();
  if (!needle) return [];
  return allItems().filter((i) => {
    const hay = [
      i.title,
      i.dek,
      i.creator,
      ...(i.tags || []),
      ...(i.body || []).map(blockText),
      ...(i.stanzas || []).flat(),
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return hay.includes(needle);
  });
}

export function formatDate(iso) {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}
