import Link from "next/link";
import Image from "next/image";
import { allReviews, allItems, MEDIA, formatDate } from "@/lib/content";
import ReviewCard from "@/components/ReviewCard";
import ContentCard from "@/components/ContentCard";
import LetterboxdStrip from "@/components/LetterboxdStrip";
import { features } from "@/data/site";
import SubscribeBlock from "@/components/SubscribeBlock";
import StackedWordmark from "@/components/StackedWordmark";
import Decision from "@/components/Decision";

export default function Home() {
  const [latest, ...rest] = allReviews();
  const recent = allItems().filter((i) => i.slug !== latest.slug).slice(0, 6);
  return (
    <>
      <section className="hero">
        <div className="container hero__grid">
          <StackedWordmark as="h1" className="hero__mark" />
          <div className="stack">
            <div className="decision-wrap">
              <p className="eyebrow">Latest review</p>
              {/* <Decision id="home-composition" /> */}
            </div>
            <ul className="card-grid" style={{ gridTemplateColumns: "1fr" }}>
              <ReviewCard review={latest} feature />
            </ul>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container stack">
          <h2>Recent</h2>
          <ul className="card-grid">
            {recent.map((i) => (
              <ContentCard
                key={i.href}
                href={i.href}
                image={i.cover}
                eyebrow={i.type === "review" ? MEDIA[i.medium]?.singular : i.type === "writing" ? i.form : "Post"}
                title={i.title}
                dek={i.dek}
                meta={[formatDate(i.publishedAt)]}
              />
            ))}
          </ul>
        </div>
      </section>

      {features.letterboxd && (
        <section className="section">
          <div className="container stack">
            <div className="decision-wrap">
              <h2>Recently watched</h2>
              <span className="muted">Latest from Letterboxd</span>
            </div>
            <LetterboxdStrip />
          </div>
        </section>
      )}

      <section id="about" className="section section--dark">
        <div className="container about">
          <div className="stack">
            <p className="eyebrow">About</p>
            <h2>Harry, and a year of <span className="wordmark">Hellish Views</span></h2>
            <div className="prose">
              <p> Harry Evans is the writer behind <em>Hellish Views</em>, descending into the darkest corners of horror across film, television, video games, music, novels, short stories, and beyond. From body horror and hauntings to occult nightmares, aliens, and things that were never meant to crawl out of the dark, Harry writes with equal parts obsession, irreverence, and genuine love for the genre.</p>
            </div>
          </div>
          <figure className="about__figure">
            <Image
              src="/hellish-views-signature-image.jpg"
              alt="Goya's Saturn Devouring His Son: a wild-eyed, grey-haired giant biting into the bloodied body he grips in both hands, against black."
              width={486}
              height={705}
              sizes="(min-width: 64rem) 24rem, 100vw"
            />
            {/* <figcaption>Francisco Goya, <em>Saturn Devouring His Son</em>, 1819–1823.</figcaption> */}
          </figure>
        </div>
      </section>

      {/* <SubscribeBlock id="subscribe" /> */}
    </>
  );
}
