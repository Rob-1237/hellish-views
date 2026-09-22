For this particular project, I would choose Sanity over Payload.  
Not because Sanity is universally better—it isn't—but because the requirements you've written down point toward a hosted, highly structured editorial CMS with a sophisticated custom editor experience, while Payload's biggest advantages are things this project doesn't particularly need.  
Your sitemap describes a publication where:

* Harry is the primary/only editor.  
* The CMS is the actual authoring environment.  
* The content model is unusually structured.  
* Reviews have a sophisticated scoring system.  
* Rubrics are versioned content.  
* Reviews relate to series.  
* Multiple content types share relationships and filters.  
* The frontend is custom.  
* Preview is non-negotiable.  
* Scheduled publishing matters.  
* You want custom editorial tooling, including generating a PNG of the score chart.  
* The site itself is the structured archive.  
* You don't want to build unnecessary infrastructure.

Those requirements line up extremely well with Sanity's strengths.  
---

# First: the most important architectural observation

Your sitemap is not really describing a traditional blog CMS.  
It's describing something closer to:  
                   HELLISH VIEWS  
                         │  
          ┌──────────────┼──────────────┐  
          │              │              │  
       Reviews         Writing        Series  
          │              │              │  
          └──────────────┼──────────────┘  
                         │  
                   Structured data  
                         │  
              ┌──────────┴──────────┐  
              │                     │  
          Rubric versions       Relationships  
              │                     │  
              └──────────┬──────────┘  
                         │  
                    Frontend  
The CMS isn't just storing articles.  
It needs to understand what a review is.  
That's where I think Sanity has the edge.  
---

# 1\. The rubric is the deciding factor

This is the part of your sitemap that would make me stop and think before choosing a CMS.  
You explicitly have:  
"The rubric is CMS data, not code."  
And:  
"Categories, rung labels, N/A slots and max total live in a versioned rubric document that each review points at."  
That's an excellent content-modeling decision.  
I would model this approximately as:  
Rubric  
├── version  
├── name  
├── categories\[\]  
│   ├── name  
│   ├── max  
│   ├── rungs\[\]  
│   └── allowNA  
└── active  
Then:  
Review  
├── title  
├── slug  
├── medium  
├── rubric → Rubric  
├── scores\[\]  
├── total  
├── content  
└── ...  
Sanity is fundamentally document/relationship-oriented. Its Content Lake stores structured JSON documents, and references between documents are a core part of the model.  
Payload can absolutely model this too. Its relationship fields and schema system are fully capable of it.  
So this is not a capability gap.  
The difference is the editorial experience and the amount of infrastructure surrounding it.  
---

# 2\. Sanity's editorial model is a particularly good fit

Sanity schemas define the content model, and the Studio automatically generates the editing interface from those schemas. The Studio itself is React-based and extensively customizable.  
That gives us an interesting possibility for Harry.  
Instead of giving him a generic CMS form like:  
Title: \_\_\_\_\_\_\_\_\_\_\_\_

Medium: \[dropdown\]

Score:  
  Fun: \[dropdown\]  
  Scary: \[dropdown\]  
  Vibes: \[dropdown\]  
  Sick: \[dropdown\]  
we could eventually build a deliberately designed review editor:  
┌──────────────────────────────────────┐  
│ NEW REVIEW                           │  
│                                      │  
│ Title                                │  
│ ──────────────────────────────────── │  
│                                      │  
│ Medium       Film ▼                  │  
│ Rubric       Hellish v2 ▼            │  
│                                      │  
│ SCORE                                  │  
│                                      │  
│ Fun       \[ 4 ▼ \]                    │  
│ Scary     \[ 5 ▼ \]                    │  
│ Vibes     \[ 3 ▼ \]                    │  
│ Sick      \[ 5 ▼ \]                    │  
│ Culture   \[ N/A ▼ \]                  │  
│                                      │  
│ TOTAL: 17 / 23                       │  
│                                      │  
│ \[Generate chart PNG\]                 │  
└──────────────────────────────────────┘  
That's exactly the kind of specialized editorial interface Sanity is designed to accommodate. Its Studio supports custom inputs, custom document views, custom structure, theming and React components.  
---

# 3\. Your "website-first" authoring requirement strongly favors Sanity

This is probably the second-biggest factor.  
Your sitemap says:  
"Publishing to Substack is a copy-paste plus a generated PNG of the chart."  
And later:  
"Draft previews. Website-first authoring only works if he can see a post rendered before publishing. Non-negotiable..."  
Sanity's current Visual Editing system is extremely strong here.  
The editor can see the actual frontend representation of draft content, with changes reflected in real time. It supports click-to-edit and even drag-and-drop editing in the preview environment.  
So we can build:  
┌─────────────────────┬────────────────────────┐  
│                     │                        │  
│ SANITY STUDIO       │  LIVE WEBSITE PREVIEW  │  
│                     │                        │  
│ Title               │  THE EXORCIST          │  
│ Medium: Film        │                        │  
│ Scores...           │  \[chart\]               │  
│                     │                        │  
│ Body...             │  Review text...        │  
│                     │                        │  
└─────────────────────┴────────────────────────┘  
And Harry can see the real Hellish Views design while editing.  
That is much more valuable here than a generic "preview" button.  
---

# 4\. Payload can do this too—but there's an important distinction

Payload currently has excellent Live Preview.  
Its Admin Panel can render the frontend application inside an iframe, with changes communicated through postMessage.  
So:  
Sanity: yes.  
Payload: yes.  
This is essentially a tie.  
But Payload's philosophy is more:  
The CMS is part of your application.  
Sanity's philosophy is more:  
The CMS is a content system that your application consumes.  
For this project, I prefer the latter.  
---

# 5\. Payload's biggest advantage is also why I wouldn't choose it here

Payload is now very deeply integrated with Next.js. Its own documentation describes it as a full-stack TypeScript framework and specifically calls Next.js integration a major use case.  
That's fantastic if you're building:  
Next.js  
\+  
Payload  
\+  
Postgres  
\+  
custom backend logic  
as one application.  
But you're not trying to build a backend application.  
You're building:  
custom frontend  
\+  
editorial CMS  
with a fairly sophisticated content model.  
Sanity gives you a cleaner separation.  
And that matters for you specifically, because you've consistently wanted to avoid unnecessary infrastructure and configuration.  
Payload's current self-hosted stack can involve:  
Next.js  
Payload  
Postgres  
storage  
deployment  
jobs  
cron  
Payload itself supports Postgres and other databases, and its architecture is deliberately application-oriented.  
That's powerful.  
It's also more machinery than this project needs.  
---

# 6\. And your dislike of TypeScript matters here

Payload is written around TypeScript and its current documentation strongly emphasizes its TypeScript/code-first architecture.  
Sanity schemas can be written in JavaScript or TypeScript.  
That doesn't mean Sanity is "non-technical." It isn't.  
But if we're trying to keep your implementation aligned with your preference for a straightforward JavaScript-oriented stack, Sanity gives us less friction.  
I would not choose Payload for you and then tell you:  
"Don't worry, we'll just use TypeScript for this one."  
That would be working against your stated development preferences rather than with them.  
---

# 7\. The block library is a wash

Your sitemap specifies:  
"Body, built from the block library: pull quotes, captioned images, numbered notes, ranked lists."  
Both can do this very well.

### Sanity

Portable Text \+ custom blocks.  
Conceptually:  
Review body  
├── paragraph  
├── image  
├── pullQuote  
├── numberedNotes  
├── rankedList  
├── paragraph  
└── ...

### Payload

Lexical \+ Blocks.  
Payload's Blocks Field allows different structured blocks to be mixed in any order, and its Lexical integration can embed those blocks directly into rich text.  
Again:  
Tie.  
---

# 8\. Poetry is another point in Sanity's favor—but only slightly

Your sitemap correctly identifies that poetry needs different editorial behavior:  
"preserved line breaks, stanza spacing, no justified text..."  
Both systems can preserve structured rich text.  
But I would actually not solve this through the generic rich-text editor alone.  
I'd probably create a distinct content structure for poetry.  
For example:  
Writing  
├── type: Poetry  
├── title  
├── dek  
├── warning  
├── poem  
│   ├── stanza  
│   │   ├── line  
│   │   ├── line  
│   │   └── line  
│   └── stanza  
└── ...  
That gives the frontend complete typographic control.  
Again, both CMSs can support it.  
---

# 9\. Series are trivial in either

Your series requirement is:  
"Membership is a relation on the review or piece, with an explicit order field rather than relying on date."  
That's exactly the kind of structured relationship a headless CMS handles well.  
Sanity:  
Series  
  └── reviews\[\] → Review  
or:  
Review  
  └── series → Series  
  └── seriesOrder  
Payload:  
Review  
  └── relationship → Series  
  └── seriesOrder  
No meaningful difference.  
---

# 10\. Search is another tie at the CMS level

Your requirement is:  
"title, director or author, body text, tags."  
Sanity's Content Lake is designed to query structured content with GROQ.  
Payload gives you REST/GraphQL/Local API querying and database-backed filtering.  
For this project, though, I wouldn't make the CMS responsible for the entire public search experience.  
If the archive gets large, I'd consider a dedicated search layer later.  
And your own note about archive size is important:  
"the size of the existing archive" remains outstanding.  
We should determine that before choosing a search architecture.  
---

# 11\. Scheduled publishing is where the decision gets interesting

You specifically called this out:  
"For embargoed releases..."  
Both platforms support it.

### Sanity

Sanity currently has Scheduled Drafts, which allow an editor to schedule a single document for future publication. However, this is a Growth-plan feature.  
Sanity also has Content Releases for coordinating multiple documents.

### Payload

Payload has scheduled publishing/unpublishing built into its drafts/version system.  
But its scheduling infrastructure uses its Jobs Queue. The jobs must actually be executed by a runner; on serverless deployments this generally means an external cron mechanism such as Vercel Cron invoking Payload's job endpoint.  
This is a very important distinction for you.  
Payload can do it.  
But:  
Payload scheduled publishing  
       ↓  
Jobs  
       ↓  
runner  
       ↓  
cron / serverless infrastructure  
is precisely the kind of infrastructure I know you tend to dislike.  
Sanity's hosted platform handles that side of the equation.  
---

# 12\. Cost is actually not a major concern at this scale

Sanity currently has a Free plan that includes:

* up to 20 seats  
* unlimited content types  
* hosted real-time database  
* live previews  
* visual editing

The current Growth plan is $15/seat/month and adds things including private datasets and scheduled drafts.  
So for this project, you're probably looking at:  
Sanity Free initially  
or:  
Sanity Growth when scheduled publishing/private datasets become necessary.  
That's quite reasonable.  
Payload's core is MIT-licensed and free to self-host.  
So Payload wins the theoretical cost argument.  
But if we include:  
database  
hosting  
storage  
deployment  
maintenance  
cron  
backups  
the equation becomes less straightforward.  
For a one-client editorial website, I would value removing infrastructure responsibilities more highly than saving a CMS license fee.  
---

# 13\. Here's how I would score the fit, without turning it into a generic ranking

Rather than giving you a "Sanity 9 / Payload 8" score—which wouldn't really be useful—I would characterize the fit this way:

| Requirement | Sanity | Payload |
| :---- | :---- | :---- |
| Structured review model | Excellent | Excellent |
| Versioned rubric | Excellent | Excellent |
| Review → series relationships | Excellent | Excellent |
| Custom editor UI | Excellent | Excellent |
| Block-based writing | Excellent | Excellent |
| Poetry / specialized content | Excellent | Excellent |
| Live website preview | Excellent | Excellent |
| Visual editing | Excellent | Good / excellent depending on setup |
| Scheduled publishing | Excellent, hosted | Excellent, but more infrastructure |
| Custom chart tooling | Excellent | Excellent |
| Hosted CMS | Native strength | Available through Payload Cloud |
| Self-hosting | Possible | Core strength |
| Data ownership | Good | Excellent |
| Minimal infrastructure | Excellent | More involved |
| JavaScript-friendly | Yes | TypeScript-centric |
| Next.js integration | Excellent | Exceptional |
| Fits this particular project | Very well | Very well, but more engineering than needed |

The important thing is that Payload doesn't lose because it lacks capabilities.  
It loses for this project because several of its strengths aren't especially valuable here.  
---

# 14\. There's one more thing I really like about Sanity for this project

The sitemap says:  
"The site is the canonical archive and the structured home."  
That means your CMS is going to become the source of truth for the publication's structured content.  
Sanity's Content Lake is explicitly designed around structured, referenceable content that can be delivered to multiple channels.  
That fits your eventual architecture beautifully:  
                   SANITY  
                      │  
              structured content  
                      │  
       ┌──────────────┼──────────────┐  
       │              │              │  
       ▼              ▼              ▼  
    Website       Chart PNG       Future  
       │                            channels  
       │  
       ├── RSS  
       ├── OG images  
       └── search  
         
                     \+  
                       
                  Substack  
                     ▲  
                     │  
                copy/paste  
The CMS doesn't need to be the website.  
It becomes the structured publication database.  
That's exactly what I think you want.  
---

# 15\. The chart PNG requirement is actually very achievable

This deserves special attention.  
You have:  
"Export a PNG for pasting into Substack."  
I would not store the PNG as the authoritative score.  
Instead:  
Rubric  
    ↓  
Review scores  
    ↓  
Chart renderer  
    ├── Website SVG/HTML  
    ├── accessible text representation  
    └── PNG export  
That means the same data produces:  
Website:  
interactive / animated chart  
Substack:  
static PNG  
That's a very strong architecture.  
And Sanity's customizable Studio means we could eventually put a Generate PNG action right next to the review editor rather than making Harry manually construct the chart. Sanity supports custom document views and custom Studio components.  
---

# 16\. I would make one change to your sitemap before we build the CMS

There's a small conceptual conflict here:  
"Everything gets scored. Movies, TV, books and fiction all carry a rubric score."  
Then later:  
"Scoring his own short story ... is odd..."  
I agree with the concern in the sitemap.  
I would not make score a universal field on every piece of content.  
Instead, make scoring a capability of a content item.  
Something like:  
Content  
│  
├── Review  
│    └── rubricScore  
│  
└── Writing  
     ├── Poetry  
     └── Fiction  
Then the rubric can still support multiple content types:  
Rubric  
├── Film Review v2  
├── Book Review v1  
└── Fiction v1  
if you eventually decide fiction should have a different scoring system.  
That is cleaner than:  
EVERYTHING  
└── score  
and it makes your existing "versioned rubric" concept even more useful.  
---

# My proposed Sanity content model

I would probably start with approximately:  
DOCUMENTS

Review  
├── title  
├── slug  
├── medium  
├── workYear  
├── dek  
├── author/director  
├── reviewNumber  
├── publishedAt  
├── contentWarnings  
├── spoilerFree  
├── rubric → Rubric  
├── scores\[\]  
├── body  
├── series → Series  
├── seriesOrder  
├── tags\[\]  
├── images\[\]  
├── imageCredits\[\]  
└── substackURL

Writing  
├── title  
├── slug  
├── form  
├── dek  
├── publishedAt  
├── contentWarning  
├── wordCount  
├── body  
└── tags\[\]

Series  
├── title  
├── slug  
├── intro  
└── members / ordering

Rubric  
├── version  
├── title  
├── categories\[\]  
├── rungs\[\]  
└── maxTotal

Tag  
├── title  
└── slug

Site Settings  
├── title  
├── description  
├── social links  
├── Letterboxd feed URL  
└── Substack feed URL  
And then not create separate collections for:  
Films  
TV  
Books  
because your sitemap is absolutely right that those are views of Review, not fundamentally different content types.  
That's an important architectural decision I'd keep.  
---

# Bottom line

For Hellish Views, I'd choose:

## Sanity \+ your custom frontend

with:  
Sanity  
   │  
   ├── Reviews  
   ├── Writing  
   ├── Series  
   ├── Rubrics  
   ├── Tags  
   ├── Credits  
   └── Site settings  
          │  
          ▼  
      Custom site  
          │  
     ┌────┴────┐  
     ▼         ▼  
Letterboxd  Substack  
 RSS         RSS/link  
And I would not choose Payload unless one of these becomes an explicit requirement:

* You want the CMS/database to live inside the same Next.js application.  
* You strongly value self-hosting/data ownership over managed infrastructure.  
* The project grows into a much more application-like backend.  
* You need substantial custom server-side business logic beyond editorial content.  
* You're comfortable accepting the TypeScript/Next.js-centered architecture and additional deployment considerations.

None of those appear in the sitemap right now.  
Sanity gives this project the structured content model, sophisticated preview/editor experience, custom Studio capability, hosted infrastructure, and relatively low operational burden that I think fits both the project and the way you prefer to build.  
One caveat: I would not start implementing the Sanity schema yet. There are two things in this sitemap I'd want to resolve first—the actual archive size/migration strategy and the Substack canonical architecture. The latter is particularly important because your sitemap currently says both "Substack remains the primary publication" and "the site is the canonical archive," while the cross-cutting section says full text sits on both.  
