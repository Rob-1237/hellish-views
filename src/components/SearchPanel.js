"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/format";

// Lives inside the search modal. Fetches the static index on first focus,
// then filters in the browser: at a few hundred pieces that is instant.
// The header persists across client navigation, so a result closes the dialog.
export default function SearchPanel() {
  const [q, setQ] = useState("");
  const [items, setItems] = useState(null);
  const loading = useRef(false);

  const load = () => {
    if (items || loading.current) return;
    loading.current = true;
    fetch("/search-index.json")
      .then((r) => r.json())
      .then(setItems)
      .catch(() => setItems([]));
  };

  const needle = q.trim().toLowerCase();
  const results = needle && items ? items.filter((i) => i.text.includes(needle)) : [];

  return (
    <div className="stack">
      <form className="search-box" role="search" onSubmit={(e) => e.preventDefault()}>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={load}
          placeholder="A title, a director, an author, a tag"
          aria-label="Search the archive"
          autoFocus
        />
      </form>
      {needle && (
        <p className="muted" aria-live="polite">
          {items ? `${results.length} result${results.length === 1 ? "" : "s"} for “${q.trim()}”` : "Loading…"}
        </p>
      )}
      {results.length > 0 && (
        <ul className="search-results">
          {results.map((i) => (
            <li key={i.href}>
              <Link href={i.href} onClick={(e) => e.currentTarget.closest("dialog")?.close()}>
                <span className="eyebrow">{i.label}</span>
                <strong>
                  {i.title}
                  {i.year && <span className="muted"> ({i.year})</span>}
                </strong>
                <span className="muted">{i.dek}</span>
                <span className="meta">{formatDate(i.publishedAt)}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
