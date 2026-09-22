export default function SubscribeBlock({ compact = false }) {
  return (
    <section className={compact ? "notice" : "section section--dark"}>
      <div className={compact ? "" : "container stack"}>
        {compact ? <h2>Get the next review by email</h2> : <h2>Hellish Views goes out by email</h2>}
        <p className={compact ? "" : "muted"} style={compact ? {} : { color: "var(--color-on-dark)", opacity: 0.85 }}>
          Every review, story and poem lands on Substack first. This is the placeholder for the Substack embed.
        </p>
        <p>
          <a className="btn btn--primary" href="https://hellishviews.substack.com/subscribe">
            Subscribe on Substack
          </a>
        </p>
      </div>
    </section>
  );
}
