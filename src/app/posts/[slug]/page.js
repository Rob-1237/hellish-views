import Link from "next/link";
import { notFound } from "next/navigation";
import { allPosts, getPost } from "@/lib/content";
import Blocks from "@/components/Blocks";
import Byline from "@/components/Byline";

export function generateStaticParams() {
  return allPosts().map((p) => ({ slug: p.slug }));
}
export async function generateMetadata({ params }) {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.dek,
    alternates: { canonical: `/posts/${p.slug}` },
    openGraph: { title: p.title, description: p.dek, type: "article", url: `/posts/${p.slug}`, publishedTime: p.publishedAt },
  };
}

export default async function PostPage({ params }) {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) notFound();
  return (
    <article className="container">
      <header className="page-head stack">
        <p className="eyebrow">Post</p>
        <h1>{p.title}</h1>
        <p style={{ fontSize: "var(--text-lg)" }}>{p.dek}</p>
        <Byline contributors={p.contributors} publishedAt={p.publishedAt} />
      </header>
      <div className="prose">
        <Blocks blocks={p.body} />
      </div>
      {p.tags?.length > 0 && (
        <ul className="tag-list" style={{ marginTop: "var(--space-8)" }}>
          {p.tags.map((t) => (
            <li key={t}><Link className="tag" href={`/tags/${t}`}>{t}</Link></li>
          ))}
        </ul>
      )}
      <div style={{ height: "var(--space-12)" }} />
    </article>
  );
}
