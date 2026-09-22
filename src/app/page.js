import Link from "next/link";
import { allReviews, allItems, MEDIA, formatDate } from "@/lib/content";
import ReviewCard from "@/components/ReviewCard";
import LetterboxdStrip from "@/components/LetterboxdStrip";
import SubscribeBlock from "@/components/SubscribeBlock";
import Decision from "@/components/Decision";

export default function Home() {
  const [latest, ...rest] = allReviews();
  const recent = allItems().filter((i) => i.slug !== latest.slug).slice(0, 6);
  return (
    <>
      <section className="section">
        <div className="container stack">
          <div className="decision-wrap">
            <p className="eyebrow">Latest review</p>
            <Decision id="home-composition" />
          </div>
          <ul className="card-grid" style={{ gridTemplateColumns: "1fr" }}>
            <ReviewCard review={latest} feature />
          </ul>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container stack">
          <h2>Recent</h2>
          <ul className="card-grid">
            {recent.map((i) => (
              <li key={i.href} className="card">
                <p className="eyebrow">
                  {i.type === "review" ? MEDIA[i.medium]?.singular : i.type === "writing" ? i.form : "Post"}
                </p>
                <h3>
                  <Link href={i.href}>{i.title}</Link>
                </h3>
                <p className="muted">{i.dek}</p>
                <p className="meta">{formatDate(i.publishedAt)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="container stack">
          <div className="decision-wrap">
            <h2>Recently watched</h2>
            <span className="muted">Latest from Letterboxd</span>
          </div>
          <LetterboxdStrip />
        </div>
      </section>

      <section className="section section--soft">
        <div className="container stack">
          <h2>How the scores work</h2>
          <p>
            Five categories, a rung for each, and a total out of 23 that deliberately doesn't sort the reviews. <Link href="/scoring">Read the scoring system →</Link>
          </p>
        </div>
      </section>

      <SubscribeBlock />
    </>
  );
}
