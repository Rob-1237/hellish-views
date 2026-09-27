import { decisions } from "@/data/decisions";
import Decision from "@/components/Decision";

export const metadata = { title: "Decisions for Harry" };

// Build-only page: every decision marker on the site, in one list.
export default function DecisionsPage() {
  return (
    <div className="container">
      <div className="page-head">
        <h1>Decisions for Harry</h1>
        <p>Every marker on the site, collected. Each opens the same popup it opens on its page. Orange is still your call; a grey tick is settled and the site already does it.</p>
      </div>
      <ul className="card-grid">
        {[...decisions].sort((a, b) => (a.status === "decided") - (b.status === "decided")).map((d) => (
          <li key={d.id} className="card">
            <p className="eyebrow">{d.where}</p>
            <h3>{d.title}</h3>
            <p className="muted">
              {d.status === "decided"
                ? d.decided
                : `${d.options.length} ways this can work${d.recommendation ? ", one suggested" : ""}.`}
            </p>
            <div>
              {/* <Decision id={d.id} label="Open" showDecided /> */}
            </div>
          </li>
        ))}
      </ul>
      <div style={{ height: "var(--space-12)" }} />
    </div>
  );
}
