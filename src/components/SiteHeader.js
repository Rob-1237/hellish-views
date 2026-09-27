import Link from "next/link";
import HeaderShell from "./HeaderShell";
import NavLinks from "./NavLinks";
import Modal from "./Modal";
import SearchPanel from "./SearchPanel";
import Decision from "./Decision";
import { features } from "@/data/site";

const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <circle cx="10.5" cy="10.5" r="6.5" />
    <path d="m15.5 15.5 5 5" />
  </svg>
);

export default function SiteHeader() {
  return (
    <>
      {/* <div className="sample-banner">
        Preview with Harry's real posts, pulled from Substack. Orange markers are decisions for Harry — <Link href="/decisions">see them all</Link>.
      </div> */}
      <HeaderShell>
        <div className="container">
          <Link href="/" className="site-logo wordmark" aria-label="Hellish Views, home">
            Hellish Views
          </Link>
          <nav className="site-nav" aria-label="Primary">
            <div className="navlinks">
              <NavLinks />
            </div>
            <div className="site-nav__actions">
              <Link href="/#subscribe" className="btn btn--primary">
                Subscribe
              </Link>
              {features.search && (
                <Modal label={<SearchIcon />} buttonLabel="Search" title="Search the archive" buttonClass="btn btn--brand btn--icon">
                  <div className="decision-wrap">
                    <span className="muted">Titles, directors and authors, tags and the text itself.</span>
                    {/* <Decision id="search" /> */}
                  </div>
                  <SearchPanel />
                </Modal>
              )}
            </div>
          </nav>
        </div>
      </HeaderShell>
    </>
  );
}
