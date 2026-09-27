// Site-wide configuration and feature flags.
export const site = {
  name: "Hellish Views",
  description: "Horror films, TV and books, reviewed and scored.",
  // Dev and review domain. Swap when a custom domain is bought.
  url: process.env.SITE_URL || "https://hellish-views.netlify.app",
  substack: "https://hellishviews.substack.com",
};

export const features = {
  // Harry has no Letterboxd account yet. He raised it so the site would not
  // rule it out later. The component and styles stay; the strip stays off
  // until there is a username and a live feed to verify.
  // Turn on: set the username, flip this to true.
  letterboxd: false,
  letterboxdUsername: null,

  // On since the samples became Harry's real posts (2026-09-27). The
  // magnifying-glass button in the header opens the search modal.
  search: true,
};
