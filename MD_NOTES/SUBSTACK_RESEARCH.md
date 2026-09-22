I researched this specifically from the perspective of you building a separate client website while the client's existing Substack remains the publishing system. There is an important distinction between Substack's canonical URL and the URL you choose to link to from the new site.

## The short version

If the client currently publishes at:  
https://clientname.substack.com  
then, by default, Substack is the canonical home of those posts.  
If the client instead configures a custom domain on Substack, such as:  
https://www.clientname.com  
then Substack can serve the publication on that domain, and the publication's URLs become the custom-domain URLs rather than the substack.com URLs. Substack currently charges a one-time $50 fee for custom domains.  
What Substack does not appear to provide is a per-post field where you can say:  
"This post lives on Substack, but the canonical URL should be https://clientwebsite.com/articles/my-review."  
That distinction is potentially very important for the site you're designing.  
---

# 1\. There are really three different URLs to think about

Suppose the client's publication is currently:  
https://horrorcritic.substack.com  
and you are building:  
https://horrorcritic.com  
There are potentially three URL concepts:

### A. The Substack publication URL

https://horrorcritic.substack.com  
This is Substack's native publication address.

### B. A custom Substack domain

The client could configure:  
https://www.horrorcritic.com  
to be hosted by Substack.  
In that arrangement, Substack is still running the publication, but the public-facing URL is the client's domain.

### C. Your independently built website

You might instead build:  
https://horrorcritic.com  
with React/Vite/etc., while leaving Substack at:  
https://horrorcritic.substack.com  
Those are fundamentally different arrangements.  
And this is the decision I would make before you get too far into the architecture.  
---

# 2\. Substack currently does NOT give you a generic "canonical URL" field

This is probably the most important thing you were asking about.  
Substack's current post editor gives the author control over the post URL/slug under SEO Options. The slug can be customized, with lowercase letters, numbers and dashes, between 2 and 48 characters.  
For example:  
https://horrorcritic.substack.com/p/the-exorcist-1973  
But that is not the same thing as choosing an arbitrary canonical URL.  
I found no current Substack documentation indicating that the author can enter something like:  
Canonical URL:  
https://horrorcritic.com/reviews/the-exorcist  
for an individual post.  
A current third-party technical analysis reaches the same conclusion: Substack does not expose a per-post canonical URL field; the publication's own URL is treated as canonical.  
So if the client publishes an article directly on ordinary Substack, you should assume:  
Substack URL  
      ↓  
canonical source  
rather than:  
Substack URL  
      ↓  
"actually canonical elsewhere"  
---

# 3\. Custom domains change this considerably

This is where things get interesting for your project.  
Substack officially supports custom domains.  
For example:  
www.horrorcritic.com  
could actually be a Substack publication.  
Substack requires the publication to use a subdomain such as www or newsletter; the root domain itself isn't the normal CNAME target. Substack provides a root-domain redirect mechanism if you want:  
horrorcritic.com  
       ↓  
www.horrorcritic.com  
Substack's current documentation explicitly describes this setup.  
So the architecture could be:  
horrorcritic.com  
        │  
        │ 301  
        ▼  
www.horrorcritic.com  
        │  
        ▼  
     Substack  
In that scenario, the article could be:  
https://www.horrorcritic.com/p/the-exorcist-1973  
rather than:  
https://horrorcritic.substack.com/p/the-exorcist-1973  
That is a much cleaner SEO/branding arrangement if Substack is going to remain the client's primary publishing platform.  
---

# 4\. But that's different from the website you're designing

This is where I think your client project needs a deliberate decision.

### Architecture A — Your site is the primary website

                ┌── Your custom website  
                 │   horrorcritic.com  
                 │  
                 │  
Reader ──────────┤  
                 │  
                 └── Substack  
                     horrorcritic.substack.com  
The website owns:  
horrorcritic.com  
and Substack owns:  
horrorcritic.substack.com  
Your site's "Latest Reviews" section could link to Substack articles.  
In this arrangement, Substack remains the canonical source of those articles.  
---

### Architecture B — Substack is the website

Reader  
  │  
  ▼  
www.horrorcritic.com  
  │  
  ▼  
Substack infrastructure  
Your client gets the custom domain through Substack.  
Their articles are actually published at:  
www.horrorcritic.com/p/...  
This is considerably simpler from a canonical-URL standpoint.  
---

### Architecture C — Your website owns the articles

This is the more complicated scenario:  
horrorcritic.com/reviews/the-exorcist  
                    │  
                    ▼  
              Your website

horrorcritic.substack.com/p/the-exorcist  
                    │  
                    ▼  
                Substack  
If the same full article exists at both locations, you have created a duplicate-content/canonicalization problem.  
And this is the scenario I would avoid unless there is a very specific reason to do it.  
---

# 5\. You can absolutely have the new website and Substack coexist

This is actually the architecture I'd investigate for your client.  
Imagine the new website has:  
horrorcritic.com

Home  
Reviews  
Books  
Films  
About  
Subscribe  
The client continues writing on Substack.  
Your website could have:

### Latest from Substack

THE EXORCIST — 1973  
A film that still understands...

Read the full review →  
Clicking that goes to:  
https://horrorcritic.substack.com/p/the-exorcist  
The new site doesn't duplicate the article.  
It simply presents a curated/latest-content interface and sends the reader to the authoritative article.  
That is a very clean relationship.  
---

# 6\. And Substack explicitly encourages linking from personal websites

This isn't some workaround.  
Substack's current SEO documentation specifically recommends that publishers link their Substack publication from their personal website and social profiles.  
They also specifically recommend inbound links to the Substack publication as part of improving its search presence.  
So a site architecture like:  
                CLIENT WEBSITE  
                       │  
           ┌───────────┴───────────┐  
           │                       │  
        Films                    Books  
           │  
           ▼  
      Latest reviews  
           │  
           ▼  
       SUBSTACK  
           │  
           ▼  
      Full article  
is entirely reasonable.  
---

# 7\. There's another important thing: Substack has changed its URL/profile model

This is worth knowing before you lock anything down.  
Current Substack documentation distinguishes between a profile and a publication website.  
A user's Substack profile can be:  
substack.com/@handle  
while their publication can have its own:  
publication.substack.com  
Substack's current publishing documentation says the handle determines the profile URL, while the publication has its own website/publication URL.  
So when your client eventually creates their Substack identity, I would not design around an assumed URL structure until they've actually established the publication.  
---

# 8\. One thing I'd have the client decide early

Since you're designing the site and the Substack simultaneously, I'd ask the client this:  
"Do you want Substack to be where your articles permanently live, or do you eventually want your own website to become the permanent home of your articles?"  
Those are two very different strategies.

### If the answer is:

"Substack is where I write. My website is my home/portfolio."  
Then:  
Website  
   ↓  
content previews / feeds  
   ↓  
Substack  
   ↓  
full article  
is excellent.

### If the answer is:

"My website should ultimately own my articles."  
Then I would design the content architecture differently from the beginning.  
You might eventually have:  
Website  
   ↓  
canonical article  
   ↓  
Substack \= newsletter/distribution  
But Substack's inability to simply designate an arbitrary external canonical URL makes publishing the identical full article in both places something to approach carefully.  
---

# 9\. There's also a very useful middle ground

For your particular client, I think this could be especially interesting.  
The new site could have original review landing pages without reproducing the entire Substack article.  
For example:  
THE EXORCIST  
1973 · William Friedkin

★★★★½

A short original introduction to the review...

\[Read the full review on Substack →\]  
The website's page is its own piece of content.  
Then:  
Read the full review →  
goes to the Substack article.  
You aren't trying to make the website and Substack compete over the exact same document.  
That could make the website feel like a real publication/archive, while Substack remains the client's writing and subscriber engine.  
---

# 10\. One more thing that's relevant to your design

Substack now supports a direct:  
/subscribe  
endpoint on both normal Substack publications and custom-domain publications.  
So your eventual site could have a very obvious:  
SUBSCRIBE  
CTA that points directly to:  
https://horrorcritic.substack.com/subscribe  
or, if they eventually use a custom domain:  
https://www.horrorcritic.com/subscribe  
That gives you a clean separation:  
Your website  
Discover the critic, their work, films, books, horror interests, etc.  
Substack  
Read their writing and subscribe.  
---

## My recommendation for your design stage

I wouldn't make any architectural commitment to canonical URLs yet.  
Instead, I would design the site assuming this relationship:  
┌─────────────────────────────────────┐  
│          CLIENT WEBSITE             │  
│                                     │  
│  Brand / About / Film / Books       │  
│  Portfolio / Selected Reviews       │  
│  Letterboxd activity                │  
│  Substack activity                  │  
│                                     │  
└───────────────┬─────────────────────┘  
                │  
       links outward only  
                │  
        ┌───────┴────────┐  
        ▼                ▼  
   Letterboxd         Substack  
   film activity      full articles  
Don't duplicate the Substack articles on the new site unless the content strategy specifically calls for it.  
And I would keep the Substack strip you were discussing earlier conceptually separate from the Letterboxd strip:  
LATEST REVIEWS  
────────────────────────  
Substack article cards

RECENTLY WATCHED  
────────────────────────  
Letterboxd diary cards  
That gives the designer a very clean distinction between the client's authored criticism and their film-watching activity.  
One final current detail worth putting on your project notes: if the client eventually changes their Substack publication subdomain, Substack now offers a one-time "change subdomain without breaking links" option; an ordinary subdomain change can otherwise break existing links. That is another reason to settle on the publication name/handle fairly early.

I researched the current Substack publication RSS behavior, including Substack's own documentation plus actual 2026 Substack feeds, because for your design work the exact feed behavior matters more than generic RSS documentation.  
The good news: Substack is particularly well suited to the kind of read-only strip you're considering. In fact, the Substack strip can be considerably richer than the Letterboxd strip.

## 1\. The current publication feed URL

Substack's official documentation says the publication RSS feed is:  
https://YOURPUBLICATION.substack.com/feed  
For example:  
https://horrorcritic.substack.com/feed  
This is an official Substack feature, not an undocumented endpoint.  
And importantly, the same /feed pattern works when the publication uses a custom domain:  
https://www.horrorcritic.com/feed  
Current 2026 testing of live Substack publications confirms that behavior.  
So your eventual site doesn't need to know whether the client uses:  
horrorcritic.substack.com  
or:  
www.horrorcritic.com  
The conceptual rule is simply:  
PUBLICATION\_URL \+ /feed  
---

# 2\. This is a real RSS 2.0 feed

Substack's publication feed is not some proprietary JSON endpoint.  
A current live Substack feed identifies itself as being generated by Substack and contains standard RSS elements such as:  
\<rss\>  
  \<channel\>  
    ...  
    \<item\>  
      \<title\>...\</title\>  
      \<link\>...\</link\>  
      \<guid\>...\</guid\>  
      \<dc:creator\>...\</dc:creator\>  
      \<pubDate\>...\</pubDate\>  
      \<description\>...\</description\>  
      \<content:encoded\>...\</content:encoded\>  
    \</item\>  
  \</channel\>  
\</rss\>  
A live Substack publication feed from July 2026 demonstrates exactly this structure, including \<title\>, \<link\>, \<guid\>, \<dc:creator\>, \<pubDate\>, \<description\>, and \<content:encoded\>.  
That is excellent news for your project because you can design against normal RSS concepts, rather than having to invent a Substack-specific data model.  
---

# 3\. The fields that matter for your website

For your design, I'd think about the feed in this hierarchy:

| Feed field | Design use | Importance |
| :---- | :---- | :---- |
| title | Article title | Essential |
| link | Link to original Substack article | Essential |
| guid | Stable item identifier | Technical |
| dc:creator | Author/byline | Useful |
| pubDate | Publication date | Essential |
| description | Short article summary | Very useful |
| content:encoded | Full HTML article | Potentially useful |
| category | Publication/category/tag | Useful if present |
| enclosure | Audio/media | Optional |
| Feed \<image\> | Publication artwork | Useful for branding |

This isn't merely theoretical. Current Substack feeds expose these fields in practice.  
---

# 4\. The really important one: description

This is probably the field I would design around for your strip.  
A Substack post can provide a description/summary such as:  
\<description\>  
\<\!\[CDATA\[  
A meditation on why The Exorcist remains terrifying...  
\]\]\>  
\</description\>  
That means your website can create something like:  
LATEST FROM THE SUBSTACK

THE EXORCIST STILL SCARES ME  
September 18, 2026

A meditation on why The Exorcist remains  
terrifying more than fifty years later...

READ THE FULL REVIEW →  
without having to copy the entire article into your site.  
That's exactly the kind of editorial teaser → original article relationship I think makes sense for this project.  
---

# 5\. But Substack also exposes the full article HTML

This is the big difference from what you may initially expect.  
Current Substack feeds can contain:  
\<content:encoded\>  
    ...full HTML article...  
\</content:encoded\>  
Actual current Substack feeds show this containing paragraphs, headings, images, links, buttons, embeds, etc.  
So technically your website could retrieve:  
title  
date  
description  
full article  
images  
links  
etc.  
from the RSS feed.

### But I would NOT design your site around importing the full article.

For your client's site, I'd treat:  
description  
as the website teaser  
and:  
link  
as the canonical destination.  
Then the full:  
content:encoded  
is something the eventual developer can ignore unless the client later decides they want some sort of local archive.  
---

# 6\. This makes your Substack strip very straightforward

I would design the component around something like this:  
┌────────────────────────────────────────────┐  
│                                            │  
│  LATEST FROM SUBSTACK                      │  
│                                            │  
│  THE EXORCIST STILL SCARES ME              │  
│  September 18, 2026                        │  
│                                            │  
│  A meditation on why The Exorcist          │  
│  remains terrifying more than fifty        │  
│  years later...                            │  
│                                            │  
│  READ THE FULL REVIEW  →                   │  
│                                            │  
└────────────────────────────────────────────┘  
The data model behind it is essentially:  
title  
date  
description  
link  
That's it.  
Everything else is optional enhancement.  
---

# 7\. The feed contains actual article URLs

This is especially important considering our previous canonical-URL discussion.  
Current feeds contain:  
\<link\>  
https://publication.substack.com/p/article-slug  
\</link\>  
and a corresponding guid.  
The guid is not necessarily something you should display. Think of it as the feed's stable identifier for the item.  
For your website:  
Use link as the click destination.  
Don't construct article URLs yourself.  
In other words, don't do:  
/p/{slug}  
based on assumptions.  
Instead:  
RSS item  
   │  
   └── link  
         ↓  
   actual Substack article  
That makes your integration much more resilient.  
---

# 8\. Paid posts require special consideration

This is one of the most important things to account for before designing the component.  
Substack can have:

* free posts  
* paid posts  
* posts with free previews  
* subscriber-only content

Current Substack documentation says that RSS feeds and search-engine crawlers see the "Not subscribed" version of audience-specific content.  
In practical terms, you should assume:  
FREE POST  
    ↓  
RSS  
    ↓  
public content/summary  
while:  
PAID / RESTRICTED POST  
    ↓  
RSS  
    ↓  
publicly available portion/preview  
rather than assuming your website can retrieve the subscriber-only article.  
A current 2026 implementation analysis likewise reports that public RSS provides public posts and public previews of paid posts, rather than bypassing the paywall.

### Design implication

Your component should work whether the post has:  
A. A substantial description  
or:  
B. A short teaser  
You shouldn't design a card that assumes it will always receive a beautiful three-paragraph excerpt.  
---

# 9\. Images are interesting

Current Substack RSS feeds can contain images inside content:encoded, and current live feeds demonstrate Substack CDN image URLs there.  
There are also implementations that extract a post's cover image from the RSS enclosure.  
However, I would not make your Figma design dependent on a guaranteed "cover image field."  
Instead, I'd design:  
OPTIONAL IMAGE  
and make sure the component still looks excellent without it.  
That's particularly useful for your client's horror aesthetic because you could ultimately have:  
\[large atmospheric image\]  
        \+  
article title  
        \+  
excerpt  
but the design shouldn't collapse if a particular Substack post doesn't provide an appropriate image.  
---

# 10\. There appears to be a publication-level feed, not just individual post feeds

The main feed is:  
/publication/feed  
and current implementations also encounter feeds with query parameters such as:  
/feed?sectionId=...  
Live Substack feeds confirm that the underlying feed can expose section-specific feeds.  
For your project, I would ignore sections initially.  
Start with:  
https://publication/feed  
and only introduce sections if the client's actual Substack organization makes them useful.  
---

# 11\. This is an excellent match with the Letterboxd concept

We're now getting a nice architecture for the website.

### Substack

Authorial content  
SUBSTACK  
    │  
    ├── title  
    ├── date  
    ├── description  
    └── link  
            ↓  
       Full article

### Letterboxd

Film activity  
LETTERBOXD  
    │  
    ├── film  
    ├── date watched  
    ├── rating  
    ├── review  
    └── link  
            ↓  
       Letterboxd entry  
Then your client's site becomes the editorial front door:  
                 CLIENT WEBSITE  
                         │  
          ┌──────────────┴──────────────┐  
          │                             │  
     LATEST WRITING              RECENTLY WATCHED  
          │                             │  
       Substack                     Letterboxd  
          │                             │  
     Full reviews                 Film activity  
That's a very coherent design system.  
---

# 12\. And the canonical relationship is now clearer

This also reinforces what we discussed in the previous answer.  
If you use the RSS feed simply to display:  
"Here's what I've recently published"  
then the Substack article remains the actual article.  
Your site is not competing with it.  
For example:  
CLIENT WEBSITE

THE EXORCIST STILL SCARES ME  
September 18

A meditation on why The Exorcist remains  
terrifying more than fifty years later...

\[READ THE FULL REVIEW →\]  
↓  
https://client.substack.com/p/the-exorcist-still-scares-me  
That is a very clean arrangement.  
You aren't copying the article.  
You aren't creating a second canonical version.  
You're effectively building an editorial index/card interface around the client's existing publishing platform.  
---

# 13\. One technical issue we should keep on the radar

There is one thing I would not decide during Figma.  
A browser application shouldn't necessarily be expected to do:  
fetch("https://client.substack.com/feed")  
directly from the visitor's browser.  
The eventual implementation needs to consider CORS and feed-fetching architecture.  
A simple production architecture would likely be:  
                 Substack  
                     │  
                     │ RSS  
                     ▼  
             small server-side  
                feed fetch  
                     │  
                     ▼  
                your site  
                     │  
                     ▼  
                  browser  
Or, depending on the hosting platform, a serverless function/edge function could retrieve and cache the feed.  
You don't need to solve that now. But I'd make a note in the project specification:  
Substack content is consumed through the publication's public RSS feed; implementation should retrieve/cache the feed server-side rather than assuming direct browser-side RSS access.  
---

# What I would put into your design specification now

I'd actually write these requirements down:

### Substack integration

Source  
\[PUBLICATION\_URL\]/feed  
Primary fields  
title  
description  
pubDate  
link  
Optional fields  
author  
image  
category  
full HTML content  
Website behavior

* Display recent Substack posts.  
* Do not duplicate full articles.  
* Link each item to the link supplied by the RSS feed.  
* Treat description as an optional excerpt.  
* Support posts with no image.  
* Support short/limited descriptions for restricted posts.  
* Do not assume every post has identical metadata.  
* Do not construct Substack article URLs manually.  
* Keep the Substack article as the destination/source of the full writing.

And there's one particularly useful conclusion from the research:  
You don't need the client's Substack username or publication name to finish the visual design. You can design the entire component now using representative data. Once the client establishes the publication, the eventual developer simply plugs the publication's /feed URL into the integration.