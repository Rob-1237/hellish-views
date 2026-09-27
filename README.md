# Hellish Views

Structural pass of the site. Next.js (JavaScript, App Router) on Netlify, no CMS yet — sample content lives in `src/data/`.

Dev and review domain: `hellish-views.netlify.app`. CMS will be Sanity, one seat.

```
npm install
npm run dev      # http://localhost:3000
npm run build
```

## What's here

- Every route from `MD_NOTES/SITEMAP_DRAFT.md`, with representative sample data.
- `src/data/rubric.js` — the versioned rubric, in Harry's words and order. Every category starts at 1; Cultural Significance runs 1–3 or N/A.
- `src/data/decisions.js` — every decision that is Harry's call, in plain language. Rendered as orange markers (`<Decision id="…" />`) on the page where the decision lands; blue means asked and awaiting. `/decisions` lists them all.
- `src/data/content.js` — **generated** by `scripts/pull-substack-samples.py`: 29 of Harry's real free posts from the public Substack (text, images, dates, subtitles). Type, medium, creator, tags and series are set by hand in the script's manifest; scores were read from each review's key table. Re-run the script rather than editing the file. The export replaces it.
- `src/data/site.js` — domain, and feature flags. `features.letterboxd` is **off**: Harry has no account yet, so the strip is built but hidden. Set the username and flip the flag when there is a live feed to verify. `features.search` is **on**: the magnifying glass in the header opens the search modal, which fetches `/search-index.json` on first use.
- `src/components/RubricChart.js` — the chart: lit rungs, N/A treatment, designed unscored state, screen-reader text. CSS-only animation, honours `prefers-reduced-motion`.
- **Wordmark font: HAL Gap** (HAL Typefaces), used only for HELLISH VIEWS. Not licensed yet. For local work, the trial download sits unrenamed at `public/HAL Typefaces Unlicensed Fonts/` (HAL's terms forbid renaming or public hosting), gitignored so it never deploys. The width is set by `--wordmark-width` (HAL Gap's `wdth` axis, 20–200; we use 90). Everywhere else, including the Netlify preview, the stand-in is Big Shoulders via `next/font`. Buy the web license before launch and swap the `@font-face` in `tokens.css`.
- **Logo artwork:** `scripts/make-logo.py` builds the stacked and horizontal logos from HAL Gap's outlines plus four hand-placed thorns (edit the `full_thorns` / `horiz_thorns` tables); `scripts/export-logo.sh` renders 2400px transparent PNGs to `design/logo/`. Needs `pip install fonttools uharfbuzz`. The output is built from the trial font, so it is gitignored and stays off the public site until HAL Gap is licensed for logo use.
- **Motion:** the `motion` package drives dialog entrances (`src/lib/motion.js`); everything else is CSS transitions on the tokens' durations and ease.
- `src/app/tokens.css` — design tokens. Dark only. `--color-brand` is the navy fill; `--color-accent*` is the pale clinical-blue family (links, nav, data marks, the scoring button); `--color-cta*` is the orange, reserved for Subscribe. Contrast ratios sit beside each. `src/app/site.css` — component styles, tokens only.

## Decided, so don't "fix" it

- **The Vibes rungs don't climb monotonically** ("Bit of vibes" at 1, "Not my vibes" at 2). Confirmed deliberate — readers are used to it. Render as authored.
- **Full text lives on both the site and Substack.** Pages declare themselves canonical and link out; Substack self-canonicalises regardless. That's accepted, not an oversight.

## Not yet

Sanity, real content, OG image generation, Letterboxd fetch (strip is a static sample behind a flag), chart PNG export, brand/typography pass. Migration plan and difficulty assessment: `MD_NOTES/FLAGS_AND_DECISIONS.md` §7.
