# Hellish Views — Sitemap Draft

2026-09-19 · @Someone
Revised 2026-09-23. Second round of answers from Harry and Rob folded in; see FLAGS_AND_DECISIONS.md.

## Scope and locked assumptions

This sitemap is built on the decisions made so far. Where changing one would change the routes, it is flagged in the final section.

- **Authoring is website-first.** Harry writes in the CMS. The score is built from dropdowns and the chart renders from that data. Publishing to Substack is a copy-paste plus a generated PNG of the chart.
- **Substack remains the primary publication.** It is where posts go out as email and where the audience already lives. The site is the structured archive.
- **Full text lives in both places.** The site carries the whole review and declares itself canonical; Substack will still self-canonicalise, so an individual review will usually surface as the Substack copy in search. The site's index, filters, scoring and series pages have no Substack equivalent and rank on their own. Decided 2026-09-23.
- **No site-exclusive content at this stage.** Everything on the site also goes to Substack. The routes below are arranged so a site-only bucket can be added later without restructuring.
- **Reviews carry a score; Harry's own writing does not.** Everything published going forward under Review gets the rubric. Fiction and poetry under `/writing` are never scored. Rubric versions can extend scoring to other types later if wanted.
- **Migrated content keeps its original condition.** Nothing from the existing archive is retro-scored. Unscored is a first-class, designed state, not a gap.
- **The rubric is CMS data, not code.** Categories, rung labels, N/A slots and max total live in a versioned rubric document that each review points at. Cultural Significance may be reworded per medium (film, TV, book) as separate rubric versions.
- **The CMS is Sanity**, one seat to start. Chosen for hosted infrastructure, visual-editing preview and a JavaScript-friendly schema. Scheduled publishing requires the Growth plan. A second editor seat can be added whenever Harry wants one.
- **The stack is Next.js on Netlify.** App Router, JavaScript. Netlify's Next runtime covers the server-rendered routes.
- **The domain is `hellish-views.netlify.app`** through development and review. No custom domain yet, and Harry is holding off on a Substack custom domain — which keeps both options open, since Substack would claim `www.` of any domain he later buys.
- **Letterboxd is deferred, not designed out.** Harry has no account yet; he raised it so the site would not preclude it. The strip, its styles and its slot on the home page are built and switched off behind a feature flag. When there is a username: verify the live feed, set `features.letterboxd`. Read-only profile RSS, filtered to diary entries, fetched and cached server-side. No API relationship, ever.
- **Images are used under Fair Use.** Credit and source are still recorded per image as good practice, but they are not a legal gate on migration.
- **Hellish Sounds is out of scope.** It stays on Substack.

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
  /posts#series             Series section (the Evil Dead miniseries, etc.)
/series/[slug]              Single series, ordered
/index                      The full contents page, generated
/reviews#scoring            Scoring guide — a modal, opened from Reviews and the footer
/#about                     About — a section on Home
/#subscribe                 Subscribe — a section on Home
(search)                    A modal from the header; no page. Off until import
/search-index.json          Static index the search modal fetches
/tags/[tag]                 Tag archive
/rss.xml                    Feed
```

A few notes on why it is shaped this way.

**Primary nav is five links and two buttons** (revised 2026-09-27): Home, Reviews, Writing, Posts, Contents, then Search and Subscribe. Series, Scoring, About and Subscribe used to be their own pages; each now lives where a reader already is, so the nav stays short. The footer still links to all of them by anchor.

**`/reviews` is one route, not three.** Films, TV and books share a rubric and a template, so they share a collection. The medium routes are filtered views of the same index rather than separate sections. That keeps one canonical URL per review and lets a review move medium without breaking a link.

**Recommendations and commentary live in `/reviews` too.** The archive contains posts about a work that are not numbered reviews. They are Review documents with a `kind` field (`review | recommendation | commentary`) and an optional review number, so they share the template and the index without joining the numbered sequence.

**`/writing` is deliberately vague.** It holds original fiction and poetry now. If a site-exclusive bucket arrives later, this is where it lands without a new top-level section.

**`/posts` holds everything that is neither a review nor original writing.** The scoring explainer, the annual "A Year of Hellish Views", essays. Working name; rename freely.

**Series are a section of `/posts`, with their own detail pages.** Harry references an Evil Dead miniseries, and his Dark Tower review is effectively part of a reading run. Series membership is a relation on the review; `/series/[slug]` is the generated view of one run. There is no `/series` index page — the list lives at `/posts#series`.

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

Essays, meta and explainer posts. Simple template: title, dek, date, body from the same block library, tags. This is where the scoring explainer's long-form prose is stored; the scoring guide pulls it in alongside the generated grid.

### Series (`/posts#series`, `/series/[slug]`)

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
3. About (`#about`)
4. Subscribe (`#subscribe`)

The scoring guide is reached from the Reviews page and the footer (a button on every page), not a Home section.

The Letterboxd "recently watched" strip sits between 2 and 3 and is built but switched off; it appears when Harry has an account. Also deferred: an "Also on Substack" strip for what deliberately stays there — polls, Hellish Sounds, announcements.

### Scoring guide (`/reviews#scoring`)

A button on the Reviews page opens it as a scrollable modal; the hash opens it directly, so Home and the footer can link to it. The rubric explained, generated from the same rubric data the charts use, so the explainer can never drift from the implementation. His existing explainer post is long-form and personal, so the guide should carry that prose alongside the generated grid rather than replacing it with a bare table. Where medium-specific rubric versions differ (Cultural Significance for TV and books), show the variants.

This is also the natural home for the reader-facing scorer: a visitor fills in the five categories, gets their own chart, and can copy it. He has said outright that he wants comment sections full of reader scores, and this serves that better than a text box does.

### About (`/#about`)

A section on Home: Harry, the publication, the voice, the sign-off. The standing image-credit statement lives on `/credits`.

### Subscribe (`/#subscribe`)

The closing section on Home, and the orange button in the header on every page. Substack embed, plus the pitch. Since Substack stays the primary publication, this needs more prominence than a footer link. Substack exposes a direct `/subscribe` endpoint on the publication; link to it rather than embedding if the embed misbehaves.

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

**Migration.** All ~250 posts come across, in two tiers: everything is imported as an archive record, and the editorial core (reviews, writing, series, substantial essays) is normalised into full structured documents. Source is the Substack publication export (Settings → Exports), not the RSS feed. Every migrated document keeps `substackUrl` and `originalPublishedAt`. Images are downloaded from Substack's CDN and re-hosted in Sanity. Hellish Sounds stays out of scope. Detail and the difficulty assessment are in FLAGS_AND_DECISIONS.md.

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

1. The Substack export. Everything in migration waits on it. He has said it is coming.
2. Cultural Significance wording for TV and books, if he wants per-medium variants. Permission granted; the words are still to write.
3. The remaining popup decisions, which he can now click through on the site: comments, card score display, home composition, reader scorer, contents density, search.

**For you:**

1. Confirm the block conversion and image re-hosting against the real export before committing to the full-archive migration. See FLAGS_AND_DECISIONS §7.
2. Sanity project setup, one seat, and the schema — once the export shape is known.
3. Netlify site creation and first deploy from `hellish-views.netlify.app`.

**Resolved:** CMS (Sanity, one seat), stack (Next.js on Netlify), domain (`hellish-views.netlify.app`, no Substack custom domain), canonical model (full text both, site self-canonical), archive size (~250 / 45), migration scope (all 250, two tiers), Letterboxd (deferred behind a flag, not designed out), Vibes rung order (unchanged, deliberate), fiction unscored, no retro-scoring, per-medium Cultural Significance permitted, image permissions (Fair Use).

**Deferred by choice:** site-exclusive content, Hellish Sounds, a second comment system, any Letterboxd API relationship, the "Also on Substack" strip.
