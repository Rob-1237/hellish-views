import { allItems } from "@/lib/content";

const esc = (s) => String(s).replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c]));

export function GET() {
  const site = process.env.SITE_URL || "http://localhost:3000";
  const items = allItems()
    .map(
      (i) => `<item>
  <title>${esc(i.title)}</title>
  <link>${site}${i.href}</link>
  <guid>${site}${i.href}</guid>
  <pubDate>${new Date(i.publishedAt).toUTCString()}</pubDate>
  <description>${esc(i.dek || "")}</description>
</item>`
    )
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>Hellish Views</title>
<link>${site}</link>
<description>Horror films, TV and books, reviewed and scored.</description>
${items}
</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
