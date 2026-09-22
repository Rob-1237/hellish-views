import Link from "next/link";
import { notFound } from "next/navigation";
import { allReviews, getReview, seriesNeighbours, relatedReviews, MEDIA } from "@/lib/content";
import RubricChart from "@/components/RubricChart";
import Blocks from "@/components/Blocks";
import ContentWarnings from "@/components/ContentWarnings";
import Byline from "@/components/Byline";
import SeriesNav from "@/components/SeriesNav";
import ReviewCard from "@/components/ReviewCard";
import SubscribeBlock from "@/components/SubscribeBlock";
import Decision from "@/components/Decision";

export function generateStaticParams() {
  return allReviews().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const r = getReview(slug);
  return r ? { title: `${r.title} (${r.workYear})`, description: r.dek } : {};
}

export default async function ReviewPage({ params }) {
  const { slug } = await params;
  const review = getReview(slug);
  if (!review) notFound();
  const nav = seriesNeighbours(review);
  const related = relatedReviews(review);
  const numberLabel = review.reviewNumber ? `Review #${review.reviewNumber}` : review.kind;

  return (
    <article>
      <div className="container">
        <header className="page-head stack">
          <div className="decision-wrap">
            <p className="eyebrow">
              {numberLabel} · {MEDIA[review.medium]?.singular} · {review.workYear}
            </p>
            <Decision id="review-full-text" />
          </div>
          <h1>{review.title}</h1>
          <p style={{ fontSize: "var(--text-lg)" }}>{review.dek}</p>
          <Byline contributors={review.contributors} publishedAt={review.publishedAt} extra={review.creator && <span>{review.creator}</span>} />
        </header>

        <div className="two-col">
          <div className="stack" style={{ gap: "var(--space-8)" }}>
            <ContentWarnings warnings={review.contentWarnings} spoilerScope={review.spoilerScope} />
            <RubricChart rubricId={review.rubric} scores={review.scores} title={review.title} />
            <div className="prose">
              <Blocks blocks={review.body} />
              {review.signOff && <p><em>{review.signOff}</em></p>}
              {review.postscript && <p className="muted">{review.postscript}</p>}
            </div>
            {review.tags?.length > 0 && (
              <ul className="tag-list">
                {review.tags.map((t) => (
                  <li key={t}>
                    <Link className="tag" href={`/tags/${t}`}>{t}</Link>
                  </li>
                ))}
              </ul>
            )}
            <SeriesNav nav={nav} />
            <div className="decision-wrap">
              <a className="btn btn--secondary" href={review.substackUrl}>Discuss on Substack</a>
              <Decision id="comments" />
            </div>
            <p className="muted" style={{ fontSize: "var(--text-sm)" }}>
              Originally published on <a href={review.substackUrl}>Substack</a>.
            </p>
          </div>
          <aside className="stack sticky">
            <SubscribeBlock compact />
            {related.length > 0 && (
              <div className="stack stack--tight">
                <h2 style={{ fontSize: "var(--text-lg)" }}>Related</h2>
                <ul className="card-grid" style={{ gridTemplateColumns: "1fr" }}>
                  {related.map((r) => (
                    <ReviewCard key={r.slug} review={r} />
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </div>
      <div style={{ height: "var(--space-12)" }} />
    </article>
  );
}
