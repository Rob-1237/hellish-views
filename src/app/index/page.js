import Link from "next/link";
import { allReviews, allWriting, allPosts, allSeries, seriesMembers, MEDIA } from "@/lib/content";
import { getRubric, scoreTotal } from "@/data/rubric";
import Decision from "@/components/Decision";

export const metadata = { title: "Contents" };

const sortTitle = (a, b) => a.title.localeCompare(b.title, "en", { sensitivity: "base" });
const initial = (t) => t.replace(/^(the|a|an)\s+/i, "")[0].toUpperCase();

function scoreText(r) {
  const s = scoreTotal(getRubric(r.rubric), r.scores);
  return s ? `${s.total}/${s.max}` : "—";
}

function AZ({ items, id, heading }) {
  const sorted = [...items].sort(sortTitle);
  return (
    <section className="index-section" id={id}>
      <h2 style={{ fontSize: "var(--text-2xl)", marginBottom: "var(--space-4)" }}>{heading}</h2>
      <ul className="index-list">
        {sorted.map((r) => (
          <li key={r.slug} id={`${id}-${initial(r.title)}`}>
            <Link href={`/reviews/${r.slug}`}>
              {r.title} <span className="muted">({r.workYear})</span>
            </Link>
            <span className="muted">{scoreText(r)}</span>
          </li>
        ))}
        {sorted.length === 0 && <li className="muted">Nothing yet.</li>}
      </ul>
    </section>
  );
}

export default function ContentsPage() {
  const reviews = allReviews();
  const numbered = reviews.filter((r) => r.reviewNumber).sort((a, b) => a.reviewNumber - b.reviewNumber);
  const letters = [...new Set(reviews.map((r) => initial(r.title)))].sort();
  const sections = [
    ["films", "Films"],
    ["tv", "TV"],
    ["books", "Books"],
    ["writing", "Fiction & poetry"],
    ["series", "Series"],
    ["posts", "Posts"],
    ["numbered", "Numbered reviews"],
  ];

  // Gap-check on the numbered sequence: the site does this so Harry doesn't.
  const gaps = [];
  if (numbered.length) {
    const have = new Set(numbered.map((r) => r.reviewNumber));
    for (let n = 1; n <= numbered.at(-1).reviewNumber; n++) if (!have.has(n)) gaps.push(n);
  }

  return (
    <div className="container">
      <div className="page-head">
        <div className="decision-wrap">
          <h1>Contents</h1>
          <Decision id="index-density" />
        </div>
        <p>Everything published, generated from the archive. Replaces the hand-maintained Contents Page.</p>
      </div>
      <nav className="letter-rail" aria-label="Sections">
        {sections.map(([id, label]) => (
          <a key={id} href={`#${id}`}>{label}</a>
        ))}
        <span aria-hidden="true">·</span>
        {letters.map((l) => (
          <a key={l} href={`#films-${l}`}>{l}</a>
        ))}
      </nav>

      <AZ id="films" heading="Films A–Z" items={reviews.filter((r) => r.medium === "film")} />
      <AZ id="tv" heading="TV A–Z" items={reviews.filter((r) => r.medium === "tv")} />
      <AZ id="books" heading="Books A–Z" items={reviews.filter((r) => r.medium === "book")} />

      <section className="index-section" id="writing">
        <h2 style={{ fontSize: "var(--text-2xl)", marginBottom: "var(--space-4)" }}>Fiction &amp; poetry</h2>
        <ul className="index-list">
          {allWriting().sort(sortTitle).map((w) => (
            <li key={w.slug}>
              <Link href={`/writing/${w.slug}`}>{w.title}</Link>
              <span className="muted">{w.form}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="index-section" id="series">
        <h2 style={{ fontSize: "var(--text-2xl)", marginBottom: "var(--space-4)" }}>Series</h2>
        <ul className="index-list">
          {allSeries().map((s) => (
            <li key={s.slug}>
              <Link href={`/series/${s.slug}`}>{s.title}</Link>
              <span className="muted">{seriesMembers(s.slug).length} parts</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="index-section" id="posts">
        <h2 style={{ fontSize: "var(--text-2xl)", marginBottom: "var(--space-4)" }}>Posts</h2>
        <ul className="index-list">
          {allPosts().sort(sortTitle).map((p) => (
            <li key={p.slug}>
              <Link href={`/posts/${p.slug}`}>{p.title}</Link>
              <span className="muted">{p.publishedAt.slice(0, 4)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="index-section" id="numbered">
        <h2 style={{ fontSize: "var(--text-2xl)", marginBottom: "var(--space-4)" }}>Numbered reviews</h2>
        {gaps.length > 0 && (
          <p className="muted" style={{ marginBottom: "var(--space-4)" }}>
            Sequence has gaps at: {gaps.join(", ")} (expected with sample data).
          </p>
        )}
        <ul className="index-list">
          {numbered.map((r) => (
            <li key={r.slug}>
              <Link href={`/reviews/${r.slug}`}>
                <span className="muted">#{r.reviewNumber}</span> {r.title} <span className="muted">({MEDIA[r.medium]?.singular})</span>
              </Link>
              <span className="muted">{scoreText(r)}</span>
            </li>
          ))}
        </ul>
      </section>
      <div style={{ height: "var(--space-12)" }} />
    </div>
  );
}
