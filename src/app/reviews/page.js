import { allReviews } from "@/lib/content";
import ReviewFilters from "./ReviewFilters";
import Decision from "@/components/Decision";

export const metadata = { title: "Reviews" };

export default function ReviewsPage() {
  return (
    <div className="container">
      <div className="page-head">
        <div className="decision-wrap">
          <h1>Reviews</h1>
          <Decision id="card-score-display" />
        </div>
        <p>Films, TV and books, newest first. Never sorted by score: a low score is not a bad film.</p>
      </div>
      <ReviewFilters reviews={allReviews()} />
    </div>
  );
}
