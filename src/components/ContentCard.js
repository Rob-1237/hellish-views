import Link from "next/link";

// Every content card on the site. The whole card is the link. The image sits
// full-bleed across the top; anything without one gets the branded fallback.
// On hover the image lifts out of its shade, and the title and date lines
// slide left into line with the description.
export default function ContentCard({ href, image, imageScale, eyebrow, title, year, dek, meta = [], extra, feature = false }) {
  const Heading = feature ? "h2" : "h3";
  return (
    <li className={`card-item${feature ? " card-item--feature" : ""}`}>
      <Link href={href} className="card card--link">
        <div className="card__media">
          {image ? (
            <img src={image} alt="" loading={feature ? "eager" : "lazy"} style={imageScale ? { "--img-scale": imageScale } : undefined} />
          ) : (
            <div className="card__fallback" aria-hidden="true">
              <span className="wordmark">Hellish Views</span>
            </div>
          )}
        </div>
        <div className="card__body">
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <Heading className="card__title card__slide">
            {title}
            {year && <span className="muted"> ({year})</span>}
          </Heading>
          {dek && <p className="card__dek">{dek}</p>}
          <div className="card__foot card__slide">
            {meta.length > 0 && (
              <p className="meta">
                {meta.filter(Boolean).map((m, i) => (
                  <span key={i}>{m}</span>
                ))}
              </p>
            )}
            {extra}
          </div>
        </div>
      </Link>
    </li>
  );
}
