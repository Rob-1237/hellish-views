import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div>
          <p>
            <strong>Hellish Views</strong>
          </p>
          <p>Horror reviewed, scored, and occasionally written. Sample footer copy.</p>
        </div>
        <ul>
          <li><Link href="/reviews">Reviews</Link></li>
          <li><Link href="/writing">Writing</Link></li>
          <li><Link href="/series">Series</Link></li>
          <li><Link href="/index">Contents</Link></li>
          <li><Link href="/scoring">Scoring</Link></li>
        </ul>
        <ul>
          <li><Link href="/about">About</Link></li>
          <li><Link href="/subscribe">Subscribe</Link></li>
          <li><a href="https://hellishviews.substack.com">Substack</a></li>
          <li><a href="https://letterboxd.com">Letterboxd</a></li>
          <li><Link href="/rss.xml">RSS</Link></li>
          <li><Link href="/credits">Credits &amp; contact</Link></li>
        </ul>
      </div>
    </footer>
  );
}
