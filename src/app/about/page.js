export const metadata = { title: "About" };
export default function AboutPage() {
  return (
    <div className="container">
      <div className="page-head">
        <h1>About</h1>
        <p>Harry, the publication, the voice, the sign-off. Sample copy.</p>
      </div>
      <div className="prose">
        <p>Sample paragraph standing in for Harry's introduction: who he is, why horror, how the reviews started, what a Hellish View is.</p>
        <p>Sample paragraph on the publication: a year in, 250 posts, 45 numbered reviews, the scoring system, the fiction.</p>
        <h2 style={{ fontSize: "var(--text-2xl)", marginTop: "var(--space-8)" }}>Image credits</h2>
        <p>Sample of the standing credit statement Harry currently appends to posts by hand. Lives here once, linked from every review.</p>
      </div>
      <div style={{ height: "var(--space-12)" }} />
    </div>
  );
}
