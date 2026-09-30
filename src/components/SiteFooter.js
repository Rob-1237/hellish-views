import Link from "next/link";
import NavLinks from "./NavLinks";
import StackedWordmark from "./StackedWordmark";
import ScoringGuide from "./ScoringGuide";
import ModalTrigger from "./ModalTrigger";
import { features, site } from "@/data/site";

// Three columns: the stacked wordmark, the two actions, the nav links (same
// colours and hover as the header). The scoring guide modal lives here, once,
// for the whole site; the Reviews page opens it with a ModalTrigger.
export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <StackedWordmark className="site-footer__mark" />
        <div className="site-footer__actions">
          <ScoringGuide />
          <ModalTrigger target="subscribe" className="btn btn--primary">
            Subscribe on Substack
          </ModalTrigger>
        </div>
        <nav className="navlinks navlinks--column" aria-label="Footer">
          <NavLinks />
        </nav>
        {/* <ul className="navlinks navlinks--column">
          <li><Link href="/#about">About</Link></li>
          <li><Link href="/#subscribe">Subscribe</Link></li>
          <li><Link href="/reviews#scoring">How the scores work</Link></li>
          <li><a href={site.substack}>Substack</a></li>
          {features.letterboxd && features.letterboxdUsername && (
            <li><a href={`https://letterboxd.com/${features.letterboxdUsername}/`}>Letterboxd</a></li>
          )}
          <li><Link href="/rss.xml">RSS</Link></li>
          <li><Link href="/credits">Credits &amp; contact</Link></li>
        </ul> */}
      </div>
    </footer>
  );
}
