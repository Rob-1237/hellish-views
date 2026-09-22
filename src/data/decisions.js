// Decisions that are Harry's final call, shown on the page where they land.
// Each renders as a <Decision id="..."> marker. Keep the language plain:
// this is what Harry reads, not a spec.
//
// status: "open" (not yet asked) | "awaiting" (asked, no answer) | "decided"

export const decisions = [
  {
    id: "review-full-text",
    title: "Full review here, or a teaser that sends readers to Substack?",
    where: "Review page",
    status: "open",
    context:
      "Substack always treats its own copy of a post as the original for search engines. If the full review also lives here, Google will usually show the Substack one. That only affects search results, not readers who come here directly.",
    options: [
      "Full review readable on the site. Same words as the Substack email. Search engines will mostly send people to Substack; the site's index, filters and scoring pages still rank on their own. Nothing changes about how you write.",
      "Intro, chart and content warnings here, with a 'read the full review on Substack' button. No duplicate. The site becomes a catalogue of your reviews rather than a place to read them.",
      "Full review here, and the Substack email becomes an excerpt plus the chart with a link to the site. Best for the site in search, but your email readers get a shorter post.",
    ],
    recommendation: "Option 1. Your readers are on email; the site's job is structure.",
  },
  {
    id: "comments",
    title: "Where do comments live?",
    where: "Review page",
    status: "open",
    context: "Substack already has comments and that is where your readers are.",
    options: [
      "A 'Discuss on Substack' link at the end of every review. One conversation, in the place people already use.",
      "A comment box on the site as well. Two conversations to keep an eye on, and a moderation job that doesn't exist today.",
    ],
    recommendation: "Option 1, and revisit only if the reader scorer takes off.",
  },
  {
    id: "vibes-rung-order",
    title: "Do the Vibes rungs climb the way you meant?",
    where: "Score chart",
    status: "awaiting",
    context:
      "The chart draws each category as a rising scale, left to right. On Vibes, rung 1 is 'Bit of vibes' and rung 2 is 'Not my vibes', so rung 2 reads as lower than rung 1.",
    options: [
      "It's deliberate. The chart will show them in this order and readers will follow your explainer.",
      "Swap or reword them so each rung is clearly higher than the one before it.",
    ],
    recommendation: null,
  },
  {
    id: "culture-per-medium",
    title: "Should Cultural Significance read differently for TV and books?",
    where: "Score chart, Scoring page",
    status: "open",
    context:
      "The rungs are written for film: 'Cult Film', 'Big in Horror Circles', with The Wicker Man and Scream as the examples.",
    options: [
      "One wording for everything. A novel can be a 'Cult Film' and readers understand the spirit.",
      "A TV version and a book version with their own rung names and examples. The chart picks the right one automatically from the review's medium.",
    ],
    recommendation: "Option 2. It's set up to allow this already; you'd just need to write the words.",
  },
  {
    id: "card-score-display",
    title: "How should the score appear on a review card?",
    where: "Review cards",
    status: "open",
    context:
      "Two films can both score 16 out of 23 and be nothing alike. The card is where that difference can be seen at a glance.",
    options: [
      "A small five-bar shape showing the profile, with the number underneath.",
      "Just the number, big. Simplest to read, but hides the shape.",
      "Both, with the shape leading and the number small.",
    ],
    recommendation: "Option 3.",
  },
  {
    id: "home-composition",
    title: "What goes on the home page, and in what order?",
    where: "Home",
    status: "open",
    context: "This page is what a first-time visitor sees. Everything below the latest review is optional.",
    options: [
      "Latest review at full width, then recent posts of every kind, then your Letterboxd 'recently watched', then a pointer to the scoring system, then subscribe.",
      "Same, without the Letterboxd strip.",
      "Same, plus a small 'Also on Substack' block for the things that stay there: polls, Hellish Sounds, announcements.",
    ],
    recommendation: "Option 1 to start.",
  },
  {
    id: "reader-scorer",
    title: "Let readers score a film themselves?",
    where: "Scoring page",
    status: "open",
    context:
      "You've said you want comment sections full of reader scores. A small tool on the scoring page could let a reader fill in the five categories, get their own chart and copy it.",
    options: [
      "Yes. Readers build their own chart here and paste it into Substack comments.",
      "No. Keep the scoring page as the explainer only.",
    ],
    recommendation: "Yes, it's cheap once the chart exists.",
  },
  {
    id: "index-density",
    title: "Contents page: compact list or cards?",
    where: "Contents page",
    status: "open",
    context: "This replaces the Contents Page you maintain by hand. It's for someone checking whether you've covered a specific film.",
    options: [
      "Compact A–Z list with year and score, jump-to-letter rail. Everything on one screen.",
      "Cards with artwork, like the reviews page. Nicer to browse, much longer to scan.",
    ],
    recommendation: "Option 1.",
  },
  {
    id: "search",
    title: "Does the site need search?",
    where: "Search",
    status: "open",
    context: "At about 200 pieces, the contents page and filters may already do the job.",
    options: [
      "Yes: a search box that finds by title, director or author, tags and the text of the review.",
      "No: rely on the contents page and the review filters.",
    ],
    recommendation: "Yes, it's small at this size.",
  },
];

export function getDecision(id) {
  return decisions.find((d) => d.id === id) || null;
}
