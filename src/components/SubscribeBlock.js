import { site } from "@/data/site";

export default function SubscribeBlock({ compact = false, id }) {
  return (
    <section id={id} className={compact ? "notice" : "section section--dark"}>
      <div className={compact ? "" : "container stack"}>
        {compact ? <h2>Get the next review by email</h2> : <h2><span className="wordmark">Hellish Views</span> goes out by email</h2>}
        <p className={compact ? "" : "muted"} style={compact ? {} : { color: "var(--color-on-dark)", opacity: 0.85 }}>
          Every review, story and poem lands on Substack first. This is the placeholder for the Substack embed.
        </p>
        <p>
          <a className="btn btn--primary" href={`${site.substack}/subscribe`}>
            Subscribe on Substack
          </a>
        </p>
      </div>
    </section>
  );
}
