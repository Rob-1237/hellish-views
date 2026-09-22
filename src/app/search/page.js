import Link from "next/link";
import { searchItems, formatDate } from "@/lib/content";
import Decision from "@/components/Decision";

export const metadata = { title: "Search" };

export default async function SearchPage({ searchParams }) {
  const { q = "" } = await searchParams;
  const results = searchItems(q);
  return (
    <div className="container">
      <div className="page-head">
        <div className="decision-wrap">
          <h1>Search</h1>
          <Decision id="search" />
        </div>
        <p>Title, director or author, tags and body text.</p>
      </div>
      <form className="search-box" action="/search" role="search">
        <input type="search" name="q" defaultValue={q} placeholder="Search the archive" aria-label="Search" />
        <button className="btn btn--primary" type="submit">Search</button>
      </form>
      <div style={{ marginTop: "var(--space-8)" }}>
        {q && <p className="muted">{results.length} result{results.length === 1 ? "" : "s"} for “{q}”</p>}
        <ul className="card-grid" style={{ marginTop: "var(--space-4)" }}>
          {results.map((i) => (
            <li key={i.href} className="card">
              <p className="eyebrow">{i.type}</p>
              <h3><Link href={i.href}>{i.title}</Link></h3>
              <p className="muted">{i.dek}</p>
              <p className="meta">{formatDate(i.publishedAt)}</p>
            </li>
          ))}
        </ul>
      </div>
      <div style={{ height: "var(--space-12)" }} />
    </div>
  );
}
