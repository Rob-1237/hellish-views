import { allItems, searchText, MEDIA } from "@/lib/content";

// Static JSON the search modal fetches on first use, so page payloads don't
// carry the archive. Built once at deploy.
export const dynamic = "force-static";

export function GET() {
  const items = allItems().map((i) => ({
    href: i.href,
    title: i.title,
    year: i.workYear || null,
    label: i.type === "review" ? MEDIA[i.medium]?.singular : i.type === "writing" ? i.form : "Post",
    dek: i.dek || "",
    publishedAt: i.publishedAt,
    text: searchText(i),
  }));
  return Response.json(items);
}
