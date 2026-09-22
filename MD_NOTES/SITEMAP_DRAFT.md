# Hellish Views — Sitemap Draft

2026-09-19 · @Someone
Revised 2026-09-20 against FLAGS_AND_DECISIONS.md and Harry's first round of answers.

## Scope and locked assumptions

This sitemap is built on the decisions made so far. Where changing one would change the routes, it is flagged in the final section.

- **Authoring is website-first.** Harry writes in the CMS. The score is built from dropdowns and the chart renders from that data. Publishing to Substack is a copy-paste plus a generated PNG of the chart.
- **Substack remains the primary publication.** It is where posts go out as email and where the audience already lives. The site is the structured archive. Whether the site or Substack is the canonical copy of the full text is an open decision — see the final section.
- **No site-exclusive content at this stage.** Everything on the site also goes to Substack. The routes below are arranged so a site-only bucket can be added later without restructuring.
- **Reviews carry a score; Harry's own writing does not.** Everything published going forward under Review gets the rubric. Fiction and poetry under `/writing` are never scored. Rubric versions can extend scoring to other types later if wanted.
- **Migrated content keeps its original condition.** Nothing from the existing archive is retro-scored. Unscored is a first-class, designed state, not a gap.
- **The rubric is CMS data, not code.** Categories, rung labels, N/A slots and max total live in a versioned rubric document that each review points at. Cultural Significance may be reworded per medium (film, TV, book) as separate rubric versions.
- **The CMS is Sanity.** Chosen for hosted infrastructure, visual-editing preview and a JavaScript-friendly schema. Scheduled publishing requires the Growth plan.
- **Letterboxd is a read-only RSS strip** from the profile feed, filtered to diary entries, fetched and cached server-side. No API relationship.
- **Images are used under Fair Use.** Credit and source are still recorded per image as good practice, but they are not a legal gate on migration.
- **Hellish Sounds is out of scope.** It stays on Substack.
- **Frontend framework: open.** See the final section.

Archive size is now known: roughly 250 Substack posts over one year, of which 45 are numbered reviews. Expect 150–200 CMS documents after migration. Pagination and index density are non-issues at this scale.

## Top-level route map

```
/                           Home
/reviews                    All reviews (filterable)
  /reviews/[slug]           Single review
  /reviews/films            Medium view
  /reviews/tv               Medium view
  /reviews/books            Medium view
/writing                    Original fiction and poetry
  /writing/[slug]           Single piece
/posts                      Essays, meta and explainer posts
  /posts/[slug]             Single post
/series                     Multi-part runs (the Evil Dead miniseries, etc.)
  /series/[slug]            Single series, ordered
/index                      The full contents page, generated
/scoring                    The rubric explained
/about                      Harry, the project, the voice
/subscribe                  Substack embed and pitch
/search                     Search results
/tags/[tag]                 Tag archive
/rss.xml                    Feed
```

A few notes on why it is shaped this way.

**`/reviews` is one route, not three.** Films, TV and books share a rubric and a template, so they share a collection. The medium routes are filtered views of the same index rather than separate sections. That keeps one canonical URL per review and lets a review move medium without breaking a link.

**Recommendations and commentary live in `/reviews` too.** The archive contains posts about a work that are not numbered reviews. They are Review documents with a `kind` field (`review | recommendation | commentary`) and an optional review number, so they share the template and the index without joining the numbered sequence.

**`/writing` is deliberately vague.** It holds original fiction and poetry now. If a site-exclusive bucket arrives later, this is where it lands without a new top-level section.

**`/posts` holds everything that is neither a review nor original writing.** The scoring explainer, the annual "A Year of Hellish Views", essays. Working name; rename freely.

**`/series` is its own route.** Harry references an Evil Dead miniseries, and his Dark Tower review is effectively part of a reading run. Series membership is a relation on the review, and this route is the generated view of it.

**`/index` is the generated replacement** for the hand-maintained Contents Page he currently pins on Substack. Detail in its own section below.

**Collaborations are a field, not a type.** Any document carries `contributors[]`; the byline renders one or many.

## Reviews

### `/reviews` — the index

The default sort is reverse chronological. **Not by score** — the scoring system explicitly holds that a low score does not mean a bad film, and a "highest rated" sort would misrepresent it.

Filters, all combinable:

- Medium (film / TV / book)
- Kind (numbered review / recommendation / commentary)
- Year of the work, and decade for broad browsing
- Tag or subgenre
- Individual rubric category — "show me everything that scored 5 on Scary" is the filter people actually want
- Spoiler-free only, if that flag is set per review

Card design should show the score as **shape rather than total** — a small five-segment glyph reading the profile at a glance, with the total available but not dominant. Two films at 16/23 can be completely different films, and the card is the place to make that legible. Unscored cards (all migrated content) need their own designed state, since they will be the majority at launch.

### `/reviews/[slug]` — single review

Slug pattern: `title-year`, e.g. `his-house-2020`. Stable, readable, survives a retitle of the post, and disambiguates remakes — Evil Dead is 1981 and 2013, and he has a miniseries on it. The site slug does not need to match the Substack slug; `substackUrl` holds the original link.

Page structure, following his existing posts closely:

1. Title, dek, byline (one or more contributors), date, review number where one exists
2. Content warnings and spoiler scope, above the fold and unmissable — he does this consistently and it matters
3. The rubric chart, rendered from data, with a text equivalent for screen readers; or the designed unscored state
4. Body, built from the block library: pull quotes, captioned images, numbered notes, ranked lists
5. Sign-off, dedication, P.S.
6. Related reviews, series navigation if part of one
7. "Originally published on Substack" link, and comments link-through
8. Substack subscribe embed

### The chart component

The piece of the build most worth getting right. It reads the versioned rubric the review points at, renders the grid with the scored rung highlighted, and animates on entry. Three things it must do beyond looking good:

- Handle the N/A rung on Cultural Significance without breaking the total
- Render an unscored review gracefully, as a designed absence rather than a gap
- Export a PNG for pasting into Substack — this is what makes website-first authoring viable rather than a chore. Planned as a Studio document action so the PNG is generated next to the editor.

The PNG is never the stored score. Data → renderer → site SVG, text equivalent, PNG.

## Writing, posts and series

### `/writing`

Holds original work: short fiction and poetry. Filter by form, sort reverse chronological. Never scored.

The two forms need genuinely different single-page templates, which is the main reason this is its own section rather than a tag on reviews.

**Poetry** needs typographic control that reviews do not — preserved line breaks, stanza spacing, no justified text, a measure narrow enough to hold the line. *Struck* is five lines. A template built for a 3,000-word review will handle it badly. Model it as stanzas and lines, not rich text.

**Fiction** needs its own thing too. *Darkling* uses italics throughout as a voice choice, with bolded intrusions breaking into the narration. That is authored formatting carrying meaning, not decoration, so the editor has to preserve it and the template must not override it.

Both carry a word count and a content warning field. He labelled *Darkling* by length in the dek himself, so it is clearly something he thinks readers want up front.

### `/posts`

Essays, meta and explainer posts. Simple template: title, dek, date, body from the same block library, tags. This is where the scoring explainer's long-form prose is stored; `/scoring` pulls it in alongside the generated grid.

### `/series`

A series is a named, ordered run of posts. Membership is a relation on the review or piece, with an explicit order field rather than relying on date, since he may write them out of sequence.

Each series page gets a title, an intro, and the ordered list. On any member page, previous/next navigation within the series plus a link back to the run.

This handles the Evil Dead miniseries, a book series read in order, and any future multi-part project without new routes.

## `/index` — the contents page

Harry maintains a Contents Page by hand and pins it, with a dedicated fiction section. He refers readers to it repeatedly across posts. Generating it is the clearest single win available here: it stops being a chore, and it stops being out of date.

Structure: everything he has published, grouped and jump-linked.

- Films A–Z, with year and score where one exists
- TV A–Z
- Books A–Z
- Fiction and poetry
- Series
- Posts (meta and explainers)
- Numbered reviews in sequence, which doubles as a gap-check for him

A compact view is better than cards here. This page is for someone who wants to know whether he has covered a specific film, so density and a jump-to-letter rail beat visual richness. At ~200 documents it fits on one page.

The numbered-review sequence is worth calling out separately. His reviews carry numbers (#40, #45) and numbering that comes from a CMS field rather than his memory removes a class of error he is currently carrying himself.

## Standing pages

### `/` — Home

Not a blog roll. Suggested stack:

1. Latest review, given full width
2. Recent posts across all types
3. Letterboxd "recently watched" strip, pulled from his profile RSS
4. A pointer to the scoring system, which he currently pins on Substack for exactly this reason
5. Subscribe block

Optional and deferred: an "Also on Substack" strip for what deliberately stays there — polls, Hellish Sounds, announcements.

### `/scoring`

The rubric explained, generated from the same rubric data the charts use, so the explainer can never drift from the implementation. His existing explainer post is long-form and personal, so this page should carry that prose alongside the generated grid rather than replacing it with a bare table. Where medium-specific rubric versions differ (Cultural Significance for TV and books), show the variants.

This is also the natural home for the reader-facing scorer: a visitor fills in the five categories, gets their own chart, and can copy it. He has said outright that he wants comment sections full of reader scores, and this serves that better than a text box does.

### `/about`

Harry, the publication, the voice, the sign-off. Also the right place for the standing image-credit statement he currently appends to posts by hand.

### `/subscribe`

Substack embed, plus the pitch. Since Substack stays the primary publication, this needs more prominence than a footer link. Substack exposes a direct `/subscribe` endpoint on the publication; link to it rather than embedding if the embed misbehaves.

### Legal and credits

Harry works under Fair Use for images, so this is not a gate. It is still worth a quiet page: per-image credit and source fields, the standing credit statement, and a contact for takedown requests. Hosting on his own domain is a different posture from embedding on Substack, and a contact route costs nothing.

## Cross-cutting

Things that appear across routes and are easy to forget at sitemap stage.

**Social cards.** Every review needs a generated OG image with the title, year and score chart. A reviewer lives on shared links, and this is high-value for very little work once the score is structured data. Needs a server or build step — see frontend framework.

**Canonical URLs.** Substack has no per-post canonical field and always canonicalises to itself. The site can declare itself canonical, but Substack will not defer. Decision in the final section.

**Motion and accessibility.** The Framer Motion entrances need a `prefers-reduced-motion` path, and the chart needs a text equivalent. Page transitions must not delay content for someone who just wants to read.

**Comments.** Substack already has them, and his audience is there. Recommend not building a second comment system on the site — link through instead. Revisit only if the reader-scorer proves popular.

**Search.** People arrive looking for one specific film. Scope: title, director or author, body text, tags. At ~200 documents this needs no dedicated search service.

**RSS.** The site needs its own feed independent of Substack's.

**Draft previews.** Website-first authoring only works if he can see a post rendered before publishing. Non-negotiable for a WYSIWYG-only writer. Sanity Visual Editing covers this, provided the frontend supports draft mode.

**Scheduled publishing.** For embargoed releases, which for a horror reviewer covering new films is a real recurring need. On Sanity this is Scheduled Drafts, a Growth-plan feature; budget for it rather than working around it.

**Feed fetching.** Letterboxd (and any Substack strip) must be fetched server-side or through a cached function. Browsers cannot fetch these feeds directly.

**Migration.** Source is the Substack publication export (Settings → Exports), not the RSS feed. Three passes: inventory spreadsheet, automated import, editorial normalisation. Every migrated document keeps `substackUrl` and `originalPublishedAt`. Images are downloaded from Substack's CDN and re-hosted in Sanity. Polls, announcements and Hellish Sounds stay on Substack.

## Decision popups for Harry

For the first structural pass, any point where functionality could go more than one way and the call is Harry's gets a visible marker on the page. Clicking it opens a short popup: a one-line framing ("This can be set up to work any of the following ways"), then two to four bullet options in plain language, and where useful a note on what each costs him in effort. He sees the page, sees the choice in context, and decides from something concrete rather than from a questionnaire.

Candidates, by page:

- **Review page — full text or teaser.** Full review readable here, or intro plus chart with "read on Substack". This is the canonical decision, shown where it lands.
- **Review page — comments.** Link through to Substack, or a comment box here.
- **Chart — Vibes rung order.** Show the rungs as they render; ask whether the current order is deliberate. (Awaiting his answer already; the popup replaces the follow-up if he has not replied by then.)
- **Chart / scoring page — Cultural Significance per medium.** Show the film wording against a TV or book review; ask whether it should read differently.
- **Review card — score as glyph, total, or both.**
- **Home — composition.** Latest review full-width vs grid; Letterboxd strip on or off; "Also on Substack" strip on or off.
- **Scoring page — reader scorer.** Include, or leave to Substack comments.
- **Index — compact list vs cards.**
- **Search — on or off** at this archive size.

Not popups: which posts migrate (spreadsheet), the CMS plan tier (cost conversation), the frontend framework (Rob's call).

## Open flags

None of these block the sitemap. All of them should be closed before the schema.

**For Harry:**

1. Vibes rungs do not climb monotonically — "Bit of vibes" at 1 reads as more positive than "Not my vibes" at 2. Deliberate, or fix before the chart renders them as a rising scale? **Asked; awaiting answer. Follow up.**
2. Letterboxd username, so the live feed can be inspected.
3. Which of the ~250 posts migrate. Needs the Substack export and an afternoon with the inventory sheet.

**For you:**

1. Canonical model: full text on both (recommended), landing pages that link out, or site-first with Substack as excerpt. Determines whether `body` is a first-class field. May be shown to Harry as a popup, but the architecture call is yours.
2. Frontend framework. Astro or Next both give Sanity visual editing, OG images, RSS and feed proxies natively; a Vite SPA bolts each one on.
3. Sanity Growth plan for scheduled drafts, and how many seats.
4. Domain, and whether a Substack custom domain is ruled out. Substack claims `www.` if it is ever used.
5. Obtain the Substack export from Harry.

**Resolved:** CMS (Sanity), archive size (~250 / 45), Letterboxd feed format (verify live at build), fiction unscored, no retro-scoring, per-medium Cultural Significance permitted, image permissions (Fair Use).

**Deferred by choice:** site-exclusive content, Hellish Sounds, a second comment system, any Letterboxd API relationship, the "Also on Substack" strip.
