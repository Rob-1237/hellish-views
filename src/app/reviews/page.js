import { allReviews } from "@/lib/content";
import ReviewFilters from "./ReviewFilters";
import Decision from "@/components/Decision";
import ModalTrigger from "@/components/ModalTrigger";

export const metadata = { title: "Reviews" };

export default function ReviewsPage() {
  return (
    <div className="container">
      <div className="page-head">
        <div className="decision-wrap">
          <h1>Reviews</h1>
          {/* <Decision id="card-score-display" /> */}
        </div>
        <p>Films, TV, and books</p>
        <div style={{ marginTop: "var(--space-5)" }}>
          <ModalTrigger target="scoring" className="btn btn--accent">How the scores work</ModalTrigger>
        </div>
      </div>
      <ReviewFilters reviews={allReviews()} />
    </div>
  );
}
