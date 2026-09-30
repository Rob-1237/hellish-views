import { site } from "@/data/site";

export const metadata = { title: "Credits & contact" };
export default function CreditsPage() {
  return (
    <div className="container">
      <div className="page-head">
        <h1>Credits &amp; contact</h1>
        <p>Images are used under Fair Use. Credits and sources are recorded per image where known.</p>
      </div>
      <div className="prose">
        <p>Images on Hellish Views are stills, posters and artwork used for the purposes of review and commentary. Where the source is known, it is credited with the image.</p>
        <p>If you made an image used here and would like a credit added or corrected, or the image removed, please get in touch through <a href={site.substack}>Hellish Views on Substack</a>.</p>
      </div>
      <div style={{ height: "var(--space-12)" }} />
    </div>
  );
}
