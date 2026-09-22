import { reviewsByMedium, MEDIA } from "@/lib/content";
import ReviewFilters from "./ReviewFilters";

export default function MediumIndex({ medium }) {
  return (
    <div className="container">
      <div className="page-head">
        <h1>{MEDIA[medium].label}</h1>
        <p>A filtered view of the same reviews collection.</p>
      </div>
      <ReviewFilters reviews={reviewsByMedium(medium)} lockMedium={medium} />
    </div>
  );
}
