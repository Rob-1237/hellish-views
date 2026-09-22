import Link from "next/link";
import { allPosts, formatDate } from "@/lib/content";

export const metadata = { title: "Posts" };

export default function PostsPage() {
  return (
    <div className="container">
      <div className="page-head">
        <h1>Posts</h1>
        <p>Essays, meta and explainers. Everything that is neither a review nor original writing. Working name for the section.</p>
      </div>
      <ul className="card-grid">
        {allPosts().map((p) => (
          <li key={p.slug} className="card">
            <p className="eyebrow">Post</p>
            <h3><Link href={`/posts/${p.slug}`}>{p.title}</Link></h3>
            <p className="muted">{p.dek}</p>
            <p className="meta">{formatDate(p.publishedAt)}</p>
          </li>
        ))}
      </ul>
      <div style={{ height: "var(--space-12)" }} />
    </div>
  );
}
