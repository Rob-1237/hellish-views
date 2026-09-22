import Link from "next/link";

const nav = [
  ["/reviews", "Reviews"],
  ["/writing", "Writing"],
  ["/posts", "Posts"],
  ["/series", "Series"],
  ["/index", "Contents"],
  ["/scoring", "Scoring"],
  ["/about", "About"],
  ["/search", "Search"],
];

export default function SiteHeader() {
  return (
    <>
      <div className="sample-banner">
        Structural pass with sample content. Orange markers are decisions for Harry — <Link href="/decisions">see them all</Link>.
      </div>
      <header className="site-header">
        <div className="container">
          <Link href="/" className="site-logo">
            Hellish Views
          </Link>
          <nav className="site-nav" aria-label="Primary">
            {nav.map(([href, label]) => (
              <Link key={href} href={href}>
                {label}
              </Link>
            ))}
            <Link href="/subscribe" className="btn btn--primary" style={{ minHeight: "2.5rem", padding: "var(--space-2) var(--space-4)" }}>
              Subscribe
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
