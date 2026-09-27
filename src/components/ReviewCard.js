import ContentCard from "./ContentCard";
import ScoreGlyph from "./ScoreGlyph";
import { MEDIA, formatDate } from "@/lib/content";

export default function ReviewCard({ review, feature = false }) {
  const label = review.kind === "review" && review.reviewNumber ? `Review #${review.reviewNumber}` : review.kind;
  return (
    <ContentCard
      href={`/reviews/${review.slug}`}
      image={review.cover}
      eyebrow={`${label} · ${MEDIA[review.medium]?.singular}`}
      title={review.title}
      year={review.workYear}
      dek={review.dek}
      meta={[formatDate(review.publishedAt), review.spoilerFree && "Spoiler-free"]}
      extra={<ScoreGlyph rubricId={review.rubric} scores={review.scores} />}
      feature={feature}
    />
  );
}
