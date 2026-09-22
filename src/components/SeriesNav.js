import Link from "next/link";

export default function SeriesNav({ nav }) {
  if (!nav?.series) return null;
  return (
    <nav className="series-nav" aria-label="Series navigation">
      <span>{nav.prev ? <Link href={`/reviews/${nav.prev.slug}`}>← {nav.prev.title}</Link> : <span className="muted">Start of run</span>}</span>
      <span>
        <Link href={`/series/${nav.series.slug}`}>{nav.series.title}</Link> · {nav.position} of {nav.count}
      </span>
      <span>{nav.next ? <Link href={`/reviews/${nav.next.slug}`}>{nav.next.title} →</Link> : <span className="muted">End of run</span>}</span>
    </nav>
  );
}
