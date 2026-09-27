# Hellish Views — Remaining Flags and Decisions

2026-09-19 · Evaluation of SITEMAP_DRAFT against CMS_RESEARCH, SUBSTACK_RESEARCH, LETTERBOXD_RESEARCH and ARCHIVE_MIGRATION
Updated 2026-09-20 with Harry's first answers. SITEMAP_DRAFT has been revised per section 6.

## Update 2026-09-27 — real posts in the preview, and what they showed

The samples are now 29 of Harry's free posts, pulled from the public Substack API by `scripts/pull-substack-samples.py`. Findings that matter for the export and the schema:

- **The rubric starts at 1, not 0.** Fun, Scary, Vibes and Sick run 1–5; Cultural Significance runs 1–3 or N/A (Big in Horror Circles, Significant, Essential). Max 23 holds. `rubric.js` now carries his real labels and order: Fun, Cultural Significance, Scary, Vibes, Sick. **Sick is how much he loved it** ("Pretty good" to "Ultimate"), not gore — the old placeholder had it backwards.
- **Scores live in an image.** Every scored review opens with the key table as a PNG, cells highlighted, then "Total Score: N/23." as text. The converter drops both and draws the chart from data; the per-category scores had to be read by eye. For the full archive that is ~45 images to transcribe — a job for the review screen during migration, not a script.
- **Older posts write the total differently or not at all.** *Evil Dead II* has "18/23" alone; *Jennifer's Body* and *Army of Darkness* have the table and no total. *Kill List* says "13/24" — the table adds to 13/23, so it's a typo.
- **Numbering has gaps and mismatches.** Slugs and titles disagree in places (`review-34-the-long-walk-2025` is titled #35; `review-23-the-slumber-party-massacre` is #24). The gap check on `/index` will earn its keep.
- **Public archive lists 228 posts**, short of the ~250 estimate; paid-only posts return truncated bodies (*Frances* is one). The export will carry both.
- **Formatting converted cleanly:** paragraphs, nested italic/bold (Darkling), links, captions, lists, section breaks, @-mentions. The poems use one paragraph per line and `***` between stanzas, which maps straight onto the poetry template. This is good news for the §7 fidelity question.
- **Search is on** now that there's real text to search.

## Update 2026-09-23 — second round, and the migration call

Harry:

- **Vibes rung order stays as it is.** He knows it reads oddly; readers are used to it and the churn isn't worth it. Decision 13 closed. The chart renders the rungs as authored and must not reorder them — noted in `src/data/rubric.js` so nobody "fixes" it later.
- **No Letterboxd account yet.** He raised it so the build wouldn't preclude it. Decision 16 is therefore not a blocker and not a design question: the strip, its styles and its home-page slot are built and switched off behind `features.letterboxd` in `src/data/site.js`. Nothing about the current design impedes it. When there's a username, verify the live feed and flip the flag.
- **Migrate all 250 if it isn't hard; otherwise the last 90 days.** Assessed in section 7 below. Short answer: migrate all 250, and the 90-day fallback should be avoided even if the work turns out to be awkward.

Rob:

- **Full text on both.** Decision 1 closed, option A. The site declares itself canonical for its own copy and links out with "Originally published on Substack"; Substack self-canonicalises regardless. Implemented.
- **Next.js, hosted on Netlify.** Decision 2 closed. `netlify.toml` committed; Netlify's Next runtime covers the two server-rendered routes (`/search`, `/rss.xml`).
- **Sanity, one seat.** Decision 3 closed. A second editor seat is a later, trivial addition.
- **`hellish-views.netlify.app`** through development and decision-making; no Substack custom domain for now. Decision 4 closed. Holding off is the right call — it keeps both options open, since Substack claims `www.` of whatever domain it is pointed at.
- **Export coming from Harry.**

Remaining open: the six popup decisions Harry can now click through on the site (comments, card score display, home composition, reader scorer, contents density, search), and the TV/book wording for Cultural Significance.

---

## 7. Migrating the full archive — difficulty

**Recommendation: migrate all 250. Do not fall back to 90 days.**

### Why 90 days is the wrong fallback

It isn't a smaller version of the same thing; it's a different and much weaker site. Roughly 60 posts fall in a 90-day window, containing perhaps eight of the 45 numbered reviews.

- `/index` is the clearest single win in the whole project — it replaces a Contents Page Harry maintains by hand and refers readers to constantly. A contents page covering the last three months is **worse than what he has today**.
- The numbered-review gap check needs #1 to #45 to mean anything.
- `/series` breaks: the Evil Dead run and the Dark Tower read both start well outside 90 days.
- Search over 60 posts is pointless; over 250 it's the reason someone visits.
- The site would be an archive missing four-fifths of the archive, which undercuts the premise that it is the structured home.

If the work turns out to be harder than expected, the right thing to cut is *depth* (how much metadata each old post carries), not *breadth* (how many posts exist).

### Why the full archive is not the expensive part

The automated work costs almost the same for 60 posts as for 250: one converter, run over a bigger input. Marginal cost per post is close to zero for parsing the export, mapping fields, generating slugs and writing documents. The numbered reviews are the easy majority — titles follow `Review #N - Title (Year)`, so number, title and work year parse mechanically, and the medium is inferable from there.

What actually costs time is human judgement on the non-review posts — recommendations, collaborations, specials, commentary — and that is a set of maybe 80 to 120 items, not 250. At a few seconds each with a decent review screen, that is an afternoon, and it is Harry's afternoon rather than a development cost.

### The two-tier model that makes it proportionate

Every post comes across. Not every post earns the same treatment.

- **Archived** — imported with title, date, body, `substackUrl`, `originalPublishedAt` and images. Reachable, searchable, listed in the contents page. No medium, no work year, no score, no series. This is the default and it is nearly free.
- **Curated** — promoted to a full Review, Writing, Post or Series member with the complete metadata. All 45 numbered reviews, the fiction and poetry, the series, the substantial essays.

The earlier recommendation to leave polls and ephemera behind still holds in spirit, but a `status: archived` record costs so little that keeping them is cheaper than deciding one by one whether to. They simply don't get promoted, and they don't appear in the curated views. Hellish Sounds stays out of scope entirely, as agreed.

### The two unknowns, and the check to run first

I can't size this precisely until the export lands. Two things decide whether "not difficult" holds:

1. **HTML fidelity.** How cleanly Substack's exported markup converts into the block library — pull quotes, captioned images, numbered notes, ranked lists. If it is clean, conversion is one script. If Harry's formatting varies a lot across a year, the converter needs more special cases.
2. **Images.** Volume is probably 500–1500 files across the archive, and the earlier research flagged that Substack's CDN may be hotlink-protected. That is bandwidth and scripting, not human effort, but it is the part most likely to be fiddly.

**First thing to do when the export arrives:** convert twenty posts spanning the full year — a few numbered reviews, a story, a poem, a collaboration, a poll, something from the earliest weeks — and inspect the output. That sample answers both questions in an hour and converts this estimate into a real one. If it comes out badly, the fallback is *archived-tier for the older material*, not a 90-day cutoff.

---

## Update 2026-09-20 — answers received

- **Scoring going forward:** every Review gets the rubric. Harry's own writing (`/writing`) is never scored. Closes decisions 10 and 11.
- **No retro-scoring.** Migrated content keeps its original condition; nothing from the archive needs a score. Closes decision 14, and means unscored cards are the majority at launch — design that state first, not last.
- **Cultural Significance** may be reworded per medium. Closes decision 12 as a permission; the actual TV and book wording is still to write, as rubric versions.
- **Images are Fair Use.** Closes decision 17 as a gate. Credit and source fields stay as good practice; the takedown contact stays because it costs nothing.
- **Vibes rung order:** asked, awaiting Harry. Decision 13 stays open. **Follow up.** If he has not answered by the first structural pass, it becomes a decision popup on the chart.
- **Build direction:** proceed with the structure. Anything that is Harry's final call gets a clickable marker on the page with a plain-language popup listing the ways it can work. Spec and candidate list are in SITEMAP_DRAFT under "Decision popups for Harry".

## Summary

The four research notes close three of the sitemap's "for you" flags (archive size, CMS choice, Letterboxd format) and one "for Harry" flag (archive size). They also reopen the biggest one: the Substack research finds that full text on both the site and Substack cannot be canonicalised the way the sitemap assumes, and its recommendation — teaser pages that link out — is incompatible with website-first authoring and with the site being the archive. That conflict is the one decision that gates the Sanity schema.

Beyond that, the research surfaces five things the sitemap does not model (recommendations and meta posts, collaborations, the Substack strip, Sanity's paid scheduling tier, the unstated frontend framework) and one internal inconsistency (slug pattern).

Status of the sitemap's open flags:

| Flag | Status |
| :---- | :---- |
| Archive size | Closed — ~250 posts, 45 numbered reviews, ~1 year |
| CMS choice | Closed — Sanity, one seat |
| Letterboxd feed format | Deferred — no account yet; built behind a flag, nothing impedes it |
| Substack canonical handling | Closed 2026-09-23 — full text both, site self-canonical |
| Migration approach | Closed in shape (export → inventory → normalise); open in detail |
| Fiction scored? | Closed 2026-09-20 — never scored |
| Cultural Significance wording across media | Closed 2026-09-20 — per-medium rubric versions permitted; wording still to write |
| Vibes rungs non-monotonic | Closed 2026-09-23 — order stays as authored |
| Retro-score older reviews? | Closed 2026-09-20 — no; migrated content stays as-is |

---

## 1. Closed by the research

### Archive size → ~250 posts, 45 numbered reviews

Migration is a content-conversion project, not a volume problem. Source of truth is the Substack publication export (Settings → Exports), not the RSS feed and not scraping — which retires the sitemap's note about the feed only exposing ~20 posts. Expected outcome is 150–200 CMS documents, not 250: polls, announcements, Hellish Sounds and engagement posts stay on Substack.

Knock-on effects for the sitemap:

- **Pagination and `/index` density** are non-issues at this size. Design the index for a few hundred rows, not thousands.
- **Search** needs no dedicated search layer. A GROQ query or a client-side index over ~200 documents is enough. The CMS research's "decide search architecture after we know the size" is now answered: keep it simple.
- **Numbered review sequence** is real and current (#45 as of 12 Sep 2026). The inventory pass will reveal any gaps, which is the gap-check the sitemap wanted.

### CMS → Sanity

Chosen on hosting, editor quality, visual-editing preview, and JavaScript-friendliness, which is the basis the sitemap asked for. Both would model the rubric fine. Two things carried forward from that note:

- **Score becomes a capability of Review, not a field on everything.** This is the research's proposed change to the sitemap's "everything gets scored" assumption. Writing carries no score by default; a Fiction rubric version can be added later if Harry wants one. Adopt this in the schema regardless of Harry's answer — it supports either outcome.
- **The chart PNG as a Studio document action** is confirmed feasible. Data → renderer → {site SVG, text equivalent, PNG}. The PNG is never the stored score.

### Letterboxd → profile RSS, read-only

`letterboxd.com/USERNAME/rss/`. The feed is mixed (diary entries, reviews, lists), holds roughly the last 50 items, and no field beyond title/link/date should be treated as guaranteed until the live feed is inspected. Posters and TMDB IDs are "verify, don't assume". Fetch must be server-side or via a cached function because of CORS.

One correction to the sitemap: it says "diary RSS". It is the profile feed; the implementation filters for diary entries.

---

## 2. Reopened: the canonical conflict

The sitemap locks three assumptions that only work together if canonical URLs can be pointed at the site:

1. Website-first authoring — Harry writes in the CMS, pastes to Substack.
2. Substack remains the primary publication (email, audience, comments).
3. The site is the canonical archive; no site-exclusive content; full text lives in both places.

The Substack research finds there is **no per-post canonical URL field**. Substack always self-canonicalises. The site can declare itself canonical, Substack will do the same, and search engines will pick — most likely Substack, on domain authority.

The research's recommendation is to avoid duplication entirely: the site holds landing pages (title, year, chart, warnings, an intro) and links to Substack for the body. That removes the duplicate-content problem, but it also removes the reason for website-first authoring, the block library, body-text search, the full-text site RSS feed, most of the migration, and the claim that the site is the archive. It is a different project from the one the sitemap describes.

Caveat on the research itself: it was written as if the client had not yet set up a Substack ("once the client establishes the publication", "you don't need the username to finish the design"). Harry has 250 posts on `hellishviews.substack.com`. Its findings on canonical fields, custom domains, the `/feed` endpoint and the `/subscribe` endpoint stand; its framing that the site should be a portfolio in front of Substack should be read as one option, not a conclusion about this project.

### The options

**A. Keep the sitemap, accept that Substack wins per-post search.** Full text on both. Site pages carry `rel=canonical` to themselves and an "originally published on Substack" link. Individual review pages may be treated as duplicates by Google; the structured pages (index, filters by rubric category, scoring, tags, series) have no Substack equivalent and rank on their own merit. Nothing in the build changes.

**B. Follow the research: landing pages that link out.** No duplication, clean SEO. Unwinds website-first authoring and most of the sitemap. Harry could keep writing in Substack; the CMS holds metadata and scores only.

**C. Flip it: site holds the full text, Substack email carries an excerpt, the chart PNG and a link.** Cleanest SEO for the site, but it degrades the thing that already works — the email — and works against Substack's own reach features (app, Notes, recommendations) which favour full posts.

**Recommendation: A.** Harry's audience is email-first; search ranking on individual reviews is a hedge, not the point. The site's value is structure, and structure is what Substack cannot offer. A also preserves optionality: if Harry later wants the site to be the search home, C is available with zero re-architecture because the full text is already there. B closes that door.

Whichever way this goes, it needs to be decided before the schema, because it determines whether `body` is a first-class field or an afterthought.

### Dependent decision: the Substack strip

The Substack research proposes a "Latest from Substack" strip (title, date, description, link) as a sibling of the Letterboxd strip. Under option A it is redundant for everything the site already holds. It has one legitimate use: surfacing what deliberately stays on Substack — polls, Hellish Sounds, announcements — as an "Also on Substack" block on the home page. Small, optional, and not in the sitemap. Decide whether to add it; recommend not until the core design is settled.

---

## 3. New flags surfaced by the research

### 3.1 Content types the sitemap does not model

The live archive contains recommendations, TV/film commentary, collaborations, specials and meta posts (the scoring explainer, "A Year of Hellish Views"). The sitemap has Review, Writing and Series; `/index` lists "Meta and explainer posts" without a route to hold them.

Proposal:

- **Recommendations and commentary** are about a work, so they live in Review with `reviewNumber` optional and a `kind` field (`review | recommendation | commentary`). Unscored stays valid. This keeps one canonical URL per work and keeps them out of the numbered sequence without a second collection.
- **Meta, essays and annual posts** need a general document type and a route. `/writing` is taken by fiction. Working name `/posts/[slug]`; the name is a design call.
- **Collaborations** need a `contributors[]` field on any content type, not a type of their own. The sitemap's "byline" currently assumes a single author.

### 3.2 Slug pattern is inconsistent between notes

Sitemap: `title-year` (`his-house-2020`). Migration note: `teenage-sex-and-death-at-camp-miasma`, no year. **Keep the sitemap pattern.** Harry has an Evil Dead miniseries, and Evil Dead exists as 1981 and 2013; remakes and same-title books are exactly what the year disambiguates. The site slug does not need to match the Substack slug — `substackUrl` holds the link.

### 3.3 Scheduled publishing is a paid Sanity feature

The sitemap lists scheduled publishing as a real recurring need for embargoed releases. On Sanity that is Scheduled Drafts, a Growth-plan feature (~$15/seat/month). The workarounds are worse: a published document with a future `publishedAt` is publicly queryable on a Free-plan dataset (embargo leak), and a cron that calls the publish API is the infrastructure Payload was rejected for. **Recommend budgeting Growth for one or two seats.** Verify current pricing at build; the research's figures are as of September 2026.

### 3.4 The frontend framework is unstated, and it matters

The sitemap names Framer Motion (so React) and the Substack research mentions "React/Vite/etc.", but nothing decides it. Several cross-cutting requirements need a server or a build step, not a browser-only SPA:

- OG image generation per review
- The site's own RSS feed
- Server-side fetch and cache of the Letterboxd (and any Substack) feed, because of CORS
- Draft preview / Sanity Visual Editing, which needs a draft-mode-aware frontend
- Server-rendered full-text pages if the site is to be indexed at all (option A)
- A rebuild or revalidation hook when a scheduled draft publishes

A Vite SPA gets each of these by bolting on a serverless function. Astro (JS-friendly, static-first, official Sanity integration with Visual Editing, React islands for the animated chart, built-in RSS, endpoints for OG images and feed proxies) or Next.js (Sanity's best-supported path, TypeScript-leaning) get them natively. **Recommend deciding this alongside the canonical decision**, since option A pushes towards a server-capable framework and option B barely needs one.

### 3.5 Domain plan is unstated

Nothing says where the site will live. Relevant because Substack's custom-domain feature takes `www.` and redirects the apex to it — so if Harry ever puts a custom domain on Substack, the site cannot have `www.` of the same domain. Recommend: the site owns the apex and `www`, Substack stays on `hellishviews.substack.com`, and Substack custom domain is ruled out rather than left ambiguous.

### 3.6 Migration: what the archive note leaves open

The shape is set (export → inventory CSV → automated import → editorial normalisation). Still open:

- **Getting the export.** Harry has to run Settings → Exports or grant access. Nothing starts without it.
- **Who classifies.** The "New type" column is the editorial work. It needs Harry, with Rob; ~250 rows is an afternoon if done together, a project if done by correspondence.
- **Images.** The migration note does not cover them. Export HTML points at Substack's CDN; every image needs downloading, re-hosting in Sanity, and a credit and source field backfilled per the sitemap's legal section. For 150–200 posts this is the largest single chunk of manual work and it belongs to Harry.
- **`originalPublishedAt` and `substackUrl`** on every migrated document — agreed, adopt.
- **Retro-scoring** (sitemap Harry flag 4) — still Harry's call. Schema does not block on it.

---

## 4. Open and unchanged from the sitemap

These had no new information in the research. Still to close before build, none blocking design:

- Cultural Significance is worded in film terms; per-medium rubric versions are the mechanism if Harry wants rewording.
- Vibes rungs do not climb monotonically; needs Harry's intent before the chart renders them as a scale.
- Fiction scored or not; schema now defaults to unscored, so this is a rubric-version question, not a structural one.
- Reader-facing scorer on `/scoring`; unchanged.
- Comments stay on Substack; unchanged and consistent with every note.
- `prefers-reduced-motion`, chart text equivalent; unchanged.

---

## 5. Decision register

| # | Decision | Owner | Recommendation | Blocks |
| :---- | :---- | :---- | :---- | :---- |
| 1 | Full text on site + Substack (A), landing pages (B), or site-first (C) | Rob, with Harry | Closed — A, implemented | — |
| 2 | Frontend framework | Rob | Closed — Next.js on Netlify | — |
| 3 | Sanity Growth for scheduled drafts | Rob / Harry (cost) | Closed — one seat to start | — |
| 4 | Domain and Substack custom-domain stance | Rob / Harry | Closed — `hellish-views.netlify.app`; Substack custom domain on hold | — |
| 5 | Add `Post` type and route for meta/essays | Rob | Yes, `/posts/[slug]` working name | `/index` meta section |
| 6 | Review `kind` field for recommendations/commentary | Rob | Yes | Migration classification |
| 7 | `contributors[]` for collaborations | Rob | Yes | Migration classification |
| 8 | Slug pattern | Rob | `title-year` | Migration |
| 9 | Substack "Also on Substack" strip | Rob | Defer | Nothing |
| 10 | Score as capability of Review, not universal | Rob | Closed — adopted | Schema |
| 11 | Fiction rubric version | Harry | Closed — writing is never scored | Nothing |
| 12 | Cultural Significance per-medium wording | Harry | Closed — permitted; write TV and book variants as rubric versions | Rubric content |
| 13 | Vibes rung order | Harry | Closed — stays as authored; chart must not reorder | — |
| 14 | Retro-score old reviews | Harry | Closed — no | Migration effort (reduced) |
| 15 | Which of ~250 posts migrate | Harry, with Rob | Closed — all 250, two tiers (see §7) | Export |
| 16 | Letterboxd username; inspect live feed | Harry → Rob | Deferred — no account yet; flag is built and off | — |
| 17 | Image rights and credits for existing posts | Harry | Closed — Fair Use; keep credit/source fields and takedown contact as practice | Nothing |

Order of operations as of 2026-09-23: decisions 1–4, 10–14 and 17 are closed and the structural pass is built. Next is the export — convert a twenty-post sample (§7), then the Sanity schema carrying 5–8, then the real content. Decision 9 and Harry's six popup decisions can be settled any time; none block the schema.

---

## 6. Suggested edits to SITEMAP_DRAFT

Applied 2026-09-20. Kept for the record.

- "Everything gets scored" → "Reviews carry a score; Writing does not by default. Rubric versions can extend scoring to other types."
- "Letterboxd is a read-only RSS strip" → "…from the profile feed, filtered to diary entries, fetched server-side."
- Remove "Substack's feed exposes roughly the 20 most recent posts" from migration; source is the export.
- Add `/posts/[slug]` (or chosen name) for meta and essays; add `kind` to Review; add `contributors[]`.
- Add a "Frontend" line to the locked assumptions once decided.
- Add scheduled publishing's plan dependency to the Sanity note.
- Replace "Still outstanding: the size of the existing archive" with the ~250 / 45 figures.
