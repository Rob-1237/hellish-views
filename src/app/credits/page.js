export const metadata = { title: "Credits & contact" };
export default function CreditsPage() {
  return (
    <div className="container">
      <div className="page-head">
        <h1>Credits &amp; contact</h1>
        <p>Images are used under Fair Use. Credits and sources are recorded per image where known.</p>
      </div>
      <div className="prose">
        <p>Sample statement of the image policy, and a contact route for illustrators and rights-holders who want a credit corrected or an image removed.</p>
        <p>Contact: <a href="mailto:sample@example.com">sample@example.com</a></p>
      </div>
      <div style={{ height: "var(--space-12)" }} />
    </div>
  );
}
