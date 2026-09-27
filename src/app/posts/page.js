import ContentCard from "@/components/ContentCard";
import { allPosts, allSeries, seriesMembers, formatDate } from "@/lib/content";

export const metadata = { title: "Posts" };

export default function PostsPage() {
  return (
    <>
      <div className="container">
        <div className="page-head">
          <h1>Posts</h1>
          <p>Essays, announcements, and miscellaneous</p>
        </div>
        <ul className="card-grid">
          {allPosts().map((p) => (
            <ContentCard key={p.slug} href={`/posts/${p.slug}`} image={p.cover} eyebrow="Post" title={p.title} dek={p.dek} meta={[formatDate(p.publishedAt)]} />
          ))}
        </ul>
      </div>

      <section id="series" className="section section--soft" style={{ marginTop: "var(--space-10)" }}>
        <div className="container stack">
          <div>
            <h2>Series</h2>
            <p className="muted" style={{ marginTop: "var(--space-3)" }}>Multi-part runs</p>
          </div>
          <ul className="card-grid">
            {allSeries().map((s) => {
              const members = seriesMembers(s.slug);
              return (
                <ContentCard key={s.slug} href={`/series/${s.slug}`} image={members[0]?.cover} eyebrow="Series" title={s.title} dek={s.intro} meta={[`${members.length} parts`]} />
              );
            })}
          </ul>
        </div>
      </section>
    </>
  );
}
