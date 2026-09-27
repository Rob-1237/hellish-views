// Kept apart from content.js so client components can use it without
// pulling the whole content set into the browser bundle.
export function formatDate(iso) {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}
