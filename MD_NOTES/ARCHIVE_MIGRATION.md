I’ve now looked directly at the live Hellish Views archive and the publication itself. The important finding is that the archive is very manageable to migrate—the bigger issue is not volume, but classification and normalization.

### 1\. The archive is about 250 posts, not thousands

Harry states in his September 14, 2026 “A Year of Hellish Views” post that he has reached 250 posts in the first year, explicitly including polls.  
The live archive confirms that the material is quite varied. The current entries include:

* numbered reviews  
* recommendations  
* fiction  
* TV/movie commentary  
* collaborations  
* polls  
* special/series posts  
* miscellaneous/meta posts

For example, the current archive contains Review \#45, a short story, a TV recommendation, a poll, Review \#44, Review \#43, Review \#42, and a “Hellish Sounds” post in just the visible September/August portion.  
So I would think of the migration as approximately:  
\~250 existing Substack posts → perhaps 150–200 genuinely relevant CMS documents, depending on what Harry wants represented on Hellish Views.  
I would not assume all 250 become Review documents.  
---

## 2\. This is actually a very good size for Sanity

This changes my view slightly from “we need to consider how big the archive is.”  
We don't have a scale problem.  
Sanity's free plan currently allows up to 10,000 documents, so even if we migrated all 250 posts individually, we'd be nowhere remotely close to the limit.  
And 250 documents is small enough that we can afford to do something important:  
properly structure the archive rather than blindly import it.  
That's especially valuable here because the new site isn't simply going to reproduce Substack chronologically.  
Harry's existing Contents Page already demonstrates that he wants the material organized editorially. The current Contents Page says explicitly that he has organized his posts for readers, and links to a separate Google document containing that organization.  
That is basically the problem the new CMS should solve.  
---

# 3\. I would NOT do a 250-post "bulk migration"

This is the important part.  
I would not take every Substack post, shove it into Sanity, and then try to clean everything up afterward.  
That would create a pile of 250 documents where we'd have to figure out afterward:  
Is this a review?  
 Is this a recommendation?  
 Is this part of a series?  
 What's the medium?  
 What's the work year?  
 What's the score?  
 What's the rubric version?  
 Is it fiction?  
 Is it meta?  
 Is it a collaboration?  
 Does it belong in the numbered review sequence?  
Instead, I'd treat the migration as a content conversion project.  
---

# 4\. The numbered reviews make the job much easier

There's already a very useful piece of existing structure:  
Review \#45 exists today.  
And we can see Review \#43, \#42, \#40, etc. in the live publication.  
That means the review archive has an existing editorial identity that we can preserve.  
I'd create a Sanity Review document for each actual review and give it:  
reviewNumber  
title  
slug  
medium  
workTitle  
workYear  
publishedAt  
dek  
contentWarnings  
spoilerFree  
rubric  
scores  
body  
tags  
series  
seriesOrder  
substackUrl  
imageCredits  
The important thing is that Review \#45 isn't just "post \#250."  
It's a Review entity with structured metadata.  
That's exactly what the sitemap you gave me is asking for.  
---

# 5\. The migration should probably be split into three passes

### Pass 1 — Inventory

We create a spreadsheet/CSV containing every existing post:

| Substack post | Date | Existing type | New type | Review \# | Score | Series | Migration |
| :---- | :---- | :---- | :---- | :---- | :---- | :---- | :---- |
| Review \#45 \- His House | Sep 12 | Review | Review | 45 | — | — | Yes |
| Frances \- A Short Story | Sep 10 | Fiction | Writing | — | — | — | Yes |
| Posting Regularity Poll | Sep 4 | Poll | — | — | — | — | No |
| Review \#44 \- Kill List | Sep 4 | Review | Review | 44 | — | — | Yes |

The "New type" column is where the real editorial work happens.  
We don't need to do that manually from scratch if we can extract useful metadata from the export.  
---

### Pass 2 — Automated import

Substack officially provides a publication export containing posts, including CSV and HTML, through the publication's Settings → Exports.  
That's what I'd use as the source material.  
Not scraping 250 public webpages.  
Not copying/pasting 250 articles.  
Not relying on the RSS feed.  
The RSS feed is useful for the ongoing integration, but it is not the migration source of truth.  
The export gives us the actual archive.  
---

### Pass 3 — Editorial normalization

Then we'd inspect the imported material and turn it into the Hellish Views model.  
This is where Harry's existing organization becomes extremely useful.  
For example:  
Substack  
Review \#40 \- Teenage Sex and Death at Camp Miasma (2026)  
becomes:  
type: Review  
reviewNumber: 40  
medium: Film  
workYear: 2026  
title: Teenage Sex and Death at Camp Miasma  
slug: teenage-sex-and-death-at-camp-miasma  
score: ...  
The actual article body can then be converted into the new block structure.  
And something like:  
Frances \- A Short Story  
becomes:  
type: Writing  
form: Fiction  
title: Frances  
The live archive confirms that this sort of mixed content is genuinely present; it's not hypothetical.  
---

# 6\. I would NOT migrate everything

This is another important conclusion.  
The new sitemap explicitly says the site shouldn't become a second copy of every piece of Substack activity. It distinguishes reviews, writing, series, meta/explainer material, etc., and specifically says there should not be a second comments system.  
I'd therefore divide the existing 250 roughly into:

### Definitely migrate

* Reviews  
* Recommendations that deserve permanent archival status  
* Fiction  
* Poetry  
* Substantial essays/commentary  
* Series installments  
* Important collaborations  
* Important scoring/meta pieces  
* Possibly selected "special" posts

### Probably don't migrate as content

* Polls  
* ephemeral announcements  
* purely Substack-community material  
* temporary engagement posts  
* Hellish Sounds material, since that's explicitly out of the current scope  
* posts whose primary purpose was interaction rather than lasting editorial content

They can remain on Substack.  
This is actually better for the new site.  
The new Hellish Views shouldn't feel like:  
"Here's a database dump of everything Harry has ever posted."  
It should feel like:  
"Here's the permanent, structured Hellish Views archive."  
---

# 7\. One thing I would preserve: the original Substack URL

Every migrated document should have:  
substackUrl  
and probably also:  
originalPublishedAt  
even if publishedAt is the same initially.  
For example:  
substackUrl:  
https://hellishviews.substack.com/p/review-43-creep-2014  
The live Review \#43 provides exactly this sort of stable source URL.  
That gives us a permanent connection between the new structured archive and the existing publication.  
---

# 8\. Migration is much easier if we don't try to recreate Substack itself

This is where I think the original Sanity recommendation gets stronger.  
We're not migrating Harry away from Substack.  
We're building a structured editorial site around Substack.  
The workflow becomes:  
Harry writes in Sanity  
↓  
Sanity creates the review \+ score \+ chart  
↓  
Harry copies the finished article to Substack  
↓  
Substack remains the publication/community/subscriber engine  
↓  
Hellish Views becomes the structured archive  
That matches the workflow described in your sitemap.  
The existing 250 posts are therefore essentially legacy content that we normalize once.  
---

# 9\. And 250 posts is small enough that I would actually do the normalization

If this were 2,500 or 25,000 posts, I'd be much more aggressive about automated import and accepting imperfect metadata.  
At \~250:  
I'd spend the time to get it right.  
Especially because the new site has unusual structured data:

* rubric version  
* individual category scores  
* medium  
* work year  
* review number  
* series membership/order  
* content warnings  
* spoiler status  
* tags  
* image credits  
* source attribution

That metadata is the value of the new site.  
---

## My revised migration assessment

| Question | Assessment |
| :---- | :---- |
| Number of posts | \~250 |
| Age of archive | \~1 year |
| Actual review count | 45 numbered reviews currently |
| Content diversity | High |
| Raw volume | Small/manageable |
| Storage concern | Essentially none |
| Automated import | Yes |
| Manual editorial cleanup | Definitely |
| Need to migrate every post | No |
| Need to preserve Substack URLs | Yes |
| Need to migrate comments | No |
| Need to scrape archive | No — use Substack export |
| Sanity suitability | Very good |

### Bottom line

The archive size does not give me any reason to reconsider Sanity.  
If anything, it makes Sanity an even cleaner choice. We have a relatively small archive, but a highly structured editorial model. That's exactly the situation where spending some time converting the existing content into proper structured documents pays off.  
And I would now make archive migration one of the early technical workstreams, rather than something we leave until the end.  
The next thing I'd want to establish before we design the Sanity schemas is exactly what is in those \~250 posts and how many fall into each proposed content type. We can derive a concrete migration inventory from Harry's Substack export, rather than guessing from the public archive.  
