import { allItems } from "@/lib/content";
import { site } from "@/data/site";

const esc = (s) => String(s).replace(/[<>&'"]/g, (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c]));

export function GET() {
  const base = site.url;
  const items = allItems()
    .map(
      (i) => `<item>
  <title>${esc(i.title)}</title>
  <link>${base}${i.href}</link>
  <guid>${base}${i.href}</guid>
  <pubDate>${new Date(i.publishedAt).toUTCString()}</pubDate>
  <description>${esc(i.dek || "")}</description>
</item>`
    )
    .join("\n");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
<title>${site.name}</title>
<link>${base}</link>
<description>${site.description}</description>
${items}
</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
