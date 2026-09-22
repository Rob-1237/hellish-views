import { decisions } from "@/data/decisions";
import Decision from "@/components/Decision";

export const metadata = { title: "Decisions for Harry" };

// Build-only page: every decision marker on the site, in one list.
export default function DecisionsPage() {
  return (
    <div className="container">
      <div className="page-head">
        <h1>Decisions for Harry</h1>
        <p>Every orange marker on the site, collected. Each one opens the same popup it opens on its page. Blue means we've asked and are waiting.</p>
      </div>
      <ul className="card-grid">
        {decisions.map((d) => (
          <li key={d.id} className="card">
            <p className="eyebrow">{d.where}</p>
            <h3>{d.title}</h3>
            <p className="muted">{d.options.length} ways this can work{d.recommendation ? ", one suggested" : ""}.</p>
            <div><Decision id={d.id} label="Open" /></div>
          </li>
        ))}
      </ul>
      <div style={{ height: "var(--space-12)" }} />
    </div>
  );
}
