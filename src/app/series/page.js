import Link from "next/link";
import { allSeries, seriesMembers } from "@/lib/content";

export const metadata = { title: "Series" };

export default function SeriesPage() {
  return (
    <div className="container">
      <div className="page-head">
        <h1>Series</h1>
        <p>Multi-part runs, in the order he meant them, not the order he posted them.</p>
      </div>
      <ul className="card-grid">
        {allSeries().map((s) => {
          const members = seriesMembers(s.slug);
          return (
            <li key={s.slug} className="card">
              <p className="eyebrow">{members.length} parts</p>
              <h3><Link href={`/series/${s.slug}`}>{s.title}</Link></h3>
              <p className="muted">{s.intro}</p>
            </li>
          );
        })}
      </ul>
      <div style={{ height: "var(--space-12)" }} />
    </div>
  );
}
