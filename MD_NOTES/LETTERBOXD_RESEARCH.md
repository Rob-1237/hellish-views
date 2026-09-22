For this project, I would treat Letterboxd as a public, read-only source of film activity rather than as a data service. The important distinction is that Letterboxd provides RSS feeds for member activity, but you are not establishing an API integration or gaining access to the full Letterboxd database.  
Here is what matters for the early design of your client's horror film/book-review website.

## 1\. Current per-user RSS feed format

The standard public profile RSS URL is:  
https://letterboxd.com/USERNAME/rss/  
Replace USERNAME with the client's actual Letterboxd username.  
For example, if the username were horrorcritic:  
https://letterboxd.com/horrorcritic/rss/  
This is the general feed associated with a member's profile. Letterboxd's own documentation confirms that member profiles have RSS feeds containing new diary entries, reviews, and lists.  
Important: This is not necessarily a diary-only feed. The standard profile feed may include multiple types of activity.

### Official reference

You can review Letterboxd's own information here:

* [Letterboxd API and data access information](https://letterboxd.com/api-beta/?utm_source=chatgpt.com)  
* [Letterboxd Frequently Asked Questions](https://letterboxd.com/about/?utm_source=chatgpt.com)

The API documentation is useful even though you are not planning to use the API, because it distinguishes RSS-based activity feeds from access to structured film data.  
---

## 2\. What the feed is intended to contain

Letterboxd describes the profile RSS feed as providing new:

| Activity | Relevance to your design |
| :---- | :---- |
| Diary entries | Primary content for a “Recently Watched” or “Latest Films” strip |
| Film reviews | Potentially useful for showing a review excerpt |
| Lists | Probably irrelevant unless the reviewer creates horror-related lists |

A diary entry can represent a film the user has logged as watched, potentially including a rating, review, or rewatch information.  
Letterboxd added diary entries to profile RSS feeds specifically so that members could share their film-diary activity externally.

### Design implication

Your strip should be designed around a film activity item, not necessarily around a conventional blog post.  
For example:  
RECENTLY WATCHED

\[Poster\]  
THE EXORCIST  
1973

★★★★★  
A genuinely unsettling classic...

Watched September 18, 2026  
Read review →  
That is a design concept, not a guarantee that every one of those fields will be available in every RSS item.  
---

## 3\. What information should you expect to design around?

The exact XML structure should be verified against the client's actual feed before development. However, Letterboxd RSS integrations commonly work with information such as:

| Potential field | How you might use it |
| :---- | :---- |
| Film title | Main heading |
| Film URL | Link to the Letterboxd film page |
| Diary/review URL | “Read review” destination |
| Entry title | Activity heading |
| Publication date | Date displayed on the strip |
| Description/content | Review excerpt or activity text |
| Rating | Star display |
| Film year | Secondary title information |
| TMDB identifier | Potentially useful for retrieving film metadata |
| Poster image | Possible visual asset, subject to verification |

Some of these fields may be embedded in the item's title, description, links, or additional XML elements rather than being clean, dedicated fields.  
A third-party investigation of Letterboxd RSS data, for example, documents the presence of a TMDB identifier in feed items. That should be treated as something to verify against the current feed, not as a promise of a stable public interface.

### My recommendation for the Figma stage

Do not design the strip around every possible RSS field yet.  
Instead, establish a flexible component with:

1. Film poster or image area.  
2. Film title.  
3. Release year.  
4. Rating area.  
5. Watched/logged date.  
6. Optional short review excerpt.  
7. Link to the original Letterboxd entry.  
8. A fallback state when an item has no review or rating.

That will let you create a convincing design without making unsupported assumptions about the feed.  
---

## 4\. The most important limitation: RSS is not a full diary archive

Letterboxd's RSS feed is intended for recent activity, not for exporting a user's entire film history.  
Community reports indicate that feeds may be limited to approximately 50 recent entries, although this should be verified against the client's actual feed and not treated as a guaranteed current limit.  
This has several consequences:

* You cannot assume the feed contains every film the reviewer has ever logged.  
* Older entries may disappear from the feed as new activity is added.  
* The strip should be designed to show recent activity, rather than a complete film archive.  
* If the client eventually wants a searchable historical film database, RSS alone may not be sufficient.

For your current concept, this is probably perfectly acceptable.  
---

## 5\. RSS versus an API

Your proposed arrangement is essentially:  
Client's Letterboxd profile  
          │  
          ▼  
Public RSS feed  
          │  
          ▼  
Read-only display on client's website  
That is different from:  
Client's website  
          │  
          ▼  
Letterboxd API  
          │  
          ▼  
Structured film and user data  
Letterboxd currently documents a separate API, but access to that API is not necessary for simply displaying a public RSS feed. Its own information page specifically identifies RSS as a way to access new diary entries, reviews, and lists.  
For the design phase, I would avoid representing this as an official API integration.  
A label such as:  
Latest from Letterboxd  
with a link to the client's Letterboxd profile would accurately communicate the concept.  
---

## 6\. Important design and technical considerations

### A. RSS feeds can contain mixed activity

If the client writes reviews, logs films, and creates lists, the feed may contain more than diary entries.  
The eventual implementation would need to determine which items are film diary entries and which are reviews or lists.  
For the mockup, you can simply use representative diary entries.

### B. Not every film will have a review

The client may log a film without writing anything about it.  
Your component should support both:  
With review:  
A brief excerpt of the review appears here...  
Without review:  
Watched September 18, 2026  
This is particularly relevant for a reviewer who may watch substantially more films than they formally review.

### C. Do not assume posters are guaranteed

Posters would make the strip much more visually compelling, especially for a horror-focused site. However, you should verify exactly how the current feed exposes image information.  
I would not make a poster URL a hard dependency until you inspect the actual XML.

### D. RSS may need an intermediary on the eventual website

Even though the display is read-only, a browser-based website may encounter cross-origin restrictions when attempting to fetch a feed directly from Letterboxd.  
A future implementation might therefore use:  
Letterboxd RSS  
       │  
       ▼  
Small server-side feed fetcher  
       │  
       ▼  
Your website's film strip  
That is an implementation consideration, not something you need to solve in Figma.  
---

## 7\. What I would do next

Before designing the final component, I would obtain the client's actual Letterboxd username and inspect their live feed.  
The next practical step is:

1. Open https://letterboxd.com/USERNAME/rss/.  
2. Save or inspect the raw XML.  
3. Identify the actual fields present in recent diary entries.  
4. Check whether the feed includes reviews, lists, and other activity.  
5. Use those verified fields to define the strip's content hierarchy.

The actual feed is more important than generic examples, particularly if your client relies heavily on reviews, ratings, or rewatches.  
