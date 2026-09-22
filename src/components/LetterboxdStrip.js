import { letterboxdSample } from "@/data/content";
import { formatDate } from "@/lib/content";

// Stand-in for the profile RSS strip. Real version: server-side fetch of
// letterboxd.com/USERNAME/rss/, filtered to diary entries, cached.
export default function LetterboxdStrip() {
  return (
    <ul className="strip">
      {letterboxdSample.map((f) => (
        <li key={f.title}>
          <div className="poster" aria-hidden="true" />
          <strong>
            {f.title} <span className="muted">{f.year}</span>
          </strong>
          <span className="stars" aria-label={`${f.rating} out of 5`}>
            {"★".repeat(Math.floor(f.rating))}
            {f.rating % 1 ? "½" : ""}
          </span>
          <span className="muted">Watched {formatDate(f.watchedAt)}</span>
          {f.review ? <a href={f.url}>Read review →</a> : null}
        </li>
      ))}
    </ul>
  );
}
