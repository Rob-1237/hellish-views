# Hellish Views

Structural pass of the site. Next.js (JavaScript, App Router), no CMS yet — sample content lives in `src/data/`.

```
npm install
npm run dev      # http://localhost:3000
npm run build
```

## What's here

- Every route from `MD_NOTES/SITEMAP_DRAFT.md`, with representative sample data.
- `src/data/rubric.js` — the versioned rubric. Rung labels marked PLACEHOLDER await Harry's wording.
- `src/data/decisions.js` — every decision that is Harry's call, in plain language. Rendered as orange markers (`<Decision id="…" />`) on the page where the decision lands; blue means asked and awaiting. `/decisions` lists them all.
- `src/data/content.js` — sample reviews, writing, posts, series. Titles match the real archive; scores, deks and body text are stand-ins.
- `src/components/RubricChart.js` — the chart: lit rungs, N/A treatment, designed unscored state, screen-reader text. CSS-only animation, honours `prefers-reduced-motion`.
- `src/app/tokens.css` — design tokens (brand-kit defaults; brand pass not yet done). `src/app/site.css` — component styles, tokens only.

## Not yet

Sanity, real content, OG images, Letterboxd fetch (strip is static sample), chart PNG export, brand/typography pass. See `MD_NOTES/FLAGS_AND_DECISIONS.md`.
