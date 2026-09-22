import Link from "next/link";
import ScoreGlyph from "./ScoreGlyph";
import { MEDIA, formatDate } from "@/lib/content";

export default function ReviewCard({ review, feature = false }) {
  const Heading = feature ? "h2" : "h3";
  const label = review.kind === "review" && review.reviewNumber ? `Review #${review.reviewNumber}` : review.kind;
  return (
    <li className={`card${feature ? " card--feature" : ""}`}>
      <div className="stack stack--tight">
        <p className="eyebrow">
          {label} · {MEDIA[review.medium]?.singular}
        </p>
        <Heading>
          <Link href={`/reviews/${review.slug}`}>
            {review.title} <span className="muted">({review.workYear})</span>
          </Link>
        </Heading>
        <p className="muted">{review.dek}</p>
        <p className="meta">
          <span>{formatDate(review.publishedAt)}</span>
          {review.spoilerFree && <span>Spoiler-free</span>}
        </p>
      </div>
      <div>
        <ScoreGlyph rubricId={review.rubric} scores={review.scores} />
      </div>
    </li>
  );
}
