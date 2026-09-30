#!/usr/bin/env python3
"""Pull a hand-picked set of Harry's free posts from Substack's public API and
write src/data/content.js.

A stand-in until the publication export arrives: it lets Harry see his own
writing in the new site. The HTML conversion here is the first draft of the
real migration converter.

What a human decided (the MANIFEST below): which posts, their type, medium,
work year, creator, tags, series, and the scores, read by eye from the key
table image at the top of each review. Everything else (title, subtitle, date,
body, images, captions) comes from Substack.

Usage: python3 scripts/pull-substack-samples.py [--cache DIR]
"""
import html
import json
import re
import sys
import time
import urllib.request
from html.parser import HTMLParser
from pathlib import Path

API = "https://hellishviews.substack.com/api/v1/posts/"
ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "src" / "data" / "content.js"

# fun, culture, scary, vibes, sick — Harry's table order. culture "na" allowed.
def S(fun, culture, scary, vibes, sick):
    return {"fun": fun, "culture": culture, "scary": scary, "vibes": vibes, "sick": sick}

MANIFEST = [
    # ---- Numbered film reviews -------------------------------------------
    dict(src="review-46-resident-evil-2026", type="review", slug="resident-evil-2026", kind="review", reviewNumber=46, title="Resident Evil", workYear=2026, medium="film", creator="Zach Cregger", scores=S(4, 2, 2, 5, 2), tags=["video-game-adaptation", "horror-comedy"]),
    dict(src="review-45-his-house-2020", type="review", slug="his-house-2020", kind="review", reviewNumber=45, title="His House", workYear=2020, medium="film", creator="Remi Weekes", scores=S(2, 2, 3, 4, 5), tags=["british", "haunted-house", "rewatch"]),
    dict(src="review-44-kill-list", type="review", slug="kill-list-2011", kind="review", reviewNumber=44, title="Kill List", workYear=2011, medium="film", creator="Ben Wheatley", scores=S(2, 2, 2, 4, 3), tags=["british", "folk-horror"]),
    dict(src="review-43-creep-2014", type="review", slug="creep-2014", kind="review", reviewNumber=43, title="Creep", workYear=2014, medium="film", creator="Patrick Brice", scores=S(3, 2, 5, 4, 5), tags=["found-footage"]),
    dict(src="review-41-the-shining-1980", type="review", slug="the-shining-1980", kind="review", reviewNumber=41, title="The Shining", workYear=1980, medium="film", creator="Stanley Kubrick", scores=S(2, 3, 2, 4, 2), tags=["stephen-king", "haunted-house"]),
    dict(src="review-40-teenage-sex-and-death-at", type="review", slug="teenage-sex-and-death-at-camp-miasma-2026", kind="review", reviewNumber=40, title="Teenage Sex and Death at Camp Miasma", workYear=2026, medium="film", creator="Jane Schoenbrun", scores=S(4, 1, 1, 5, 2), tags=["slasher"]),
    dict(src="review-39-jennifers-body-2009", type="review", slug="jennifers-body-2009", kind="review", reviewNumber=39, title="Jennifer's Body", workYear=2009, medium="film", creator="Karyn Kusama", scores=S(5, 2, 1, 4, 4), tags=["horror-comedy", "possession"]),
    dict(src="scarestacks-spring-of-king-carrie", type="review", slug="carrie-1976", kind="review", reviewNumber=None, title="Carrie", workYear=1976, medium="film", creator="Brian De Palma", scores=S(4, 3, 2, 4, 4), tags=["stephen-king", "collaboration"]),

    # ---- The Evil Dead series --------------------------------------------
    dict(src="the-evil-dead-1981", type="review", slug="the-evil-dead-1981", kind="review", title="The Evil Dead", workYear=1981, medium="film", creator="Sam Raimi", scores=S(5, 3, 3, 5, 4), tags=["evil-dead", "possession"], series="evil-dead", seriesOrder=1),
    dict(src="evil-dead-ii-1987", type="review", slug="evil-dead-ii-1987", kind="review", title="Evil Dead II", workYear=1987, medium="film", creator="Sam Raimi", scores=S(5, 2, 2, 5, 4), tags=["evil-dead", "horror-comedy"], series="evil-dead", seriesOrder=2),
    dict(src="army-of-darkness-1992", type="review", slug="army-of-darkness-1992", kind="review", title="Army of Darkness", workYear=1992, medium="film", creator="Sam Raimi", scores=S(4, 1, 1, 4, 3), tags=["evil-dead", "horror-comedy"], series="evil-dead", seriesOrder=3),
    dict(src="evil-dead-2013", type="review", slug="evil-dead-2013", kind="review", title="Evil Dead", workYear=2013, medium="film", creator="Fede Álvarez", scores=S(3, 2, 3, 5, 3), tags=["evil-dead", "possession"], series="evil-dead", seriesOrder=4),
    dict(src="ash-vs-evil-dead-2015-2018", type="review", slug="ash-vs-evil-dead-2015", kind="review", title="Ash vs Evil Dead", workYear=2015, medium="tv", creator="Sam Raimi, Ivan Raimi and Tom Spezialy", scores=None, tags=["evil-dead", "horror-comedy"]),  # not in his Evil Dead run (Contents Page)
    dict(src="evil-dead-rise-2023", type="review", slug="evil-dead-rise-2023", kind="review", title="Evil Dead Rise", workYear=2023, medium="film", creator="Lee Cronin", scores=S(2, 1, 2, 3, 2), tags=["evil-dead", "possession"], series="evil-dead", seriesOrder=5),
    dict(src="evil-dead-burn-2026", type="review", slug="evil-dead-burn-2026", kind="review", title="Evil Dead Burn", workYear=2026, medium="film", creator="Sébastien Vaniček", scores=S(4, 1, 2, 4, 3), tags=["evil-dead"], series="evil-dead", seriesOrder=6),

    # ---- Books and TV ----------------------------------------------------
    dict(src="wolves-of-the-calla-a-book-review", type="review", slug="wolves-of-the-calla-2003", kind="review", title="Wolves of the Calla", workYear=2003, medium="book", creator="Stephen King", scores=None, tags=["stephen-king"], series="dark-tower", seriesOrder=1),
    dict(src="the-dark-tower-2004-a-book-review", type="review", slug="the-dark-tower-2004", kind="review", title="The Dark Tower", workYear=2004, medium="book", creator="Stephen King", scores=None, tags=["stephen-king"], series="dark-tower", seriesOrder=2),
    dict(src="dark-matter-2010-a-book-review", type="review", slug="dark-matter-2010", kind="review", title="Dark Matter", workYear=2010, medium="book", creator="Michelle Paver", scores=None, tags=["ghost-story"]),
    dict(src="why-i-absolutely-love-randall-and", type="review", slug="randall-and-hopkirk-deceased-1969", kind="commentary", title="Randall and Hopkirk (Deceased)", workYear=1969, medium="tv", creator="Dennis Spooner", scores=None, tags=["british", "ghost-story"]),
    dict(src="a-brief-look-at-the-invaders-1967", type="review", slug="the-invaders-1967", kind="recommendation", title="The Invaders", workYear=1967, medium="tv", creator="Larry Cohen", scores=None, tags=["sci-fi"]),

    # ---- Writing ---------------------------------------------------------
    dict(src="darkling-a-short-story", type="writing", slug="darkling", form="fiction", title="Darkling", coverScale=1.04),
    dict(src="the-cough-a-short-story", type="writing", slug="the-cough", form="fiction", title="The Cough"),
    dict(src="devoid-a-poem", type="writing", slug="devoid", form="poetry", title="Devoid"),
    dict(src="struck-a-poem", type="writing", slug="struck", form="poetry", title="Struck"),

    # ---- Posts -----------------------------------------------------------
    # The Long Walk example in the explainer is shown as a live chart.
    dict(src="the-hellish-views-scoring-system", type="post", slug="the-hellish-views-scoring-system", title="The Hellish Views Scoring System", tags=["meta"], keyScores=[None, S(3, 1, 2, 3, 2)]),
    dict(src="a-year-of-hellish-views", type="post", slug="a-year-of-hellish-views", title="A Year of Hellish Views", tags=["meta", "annual"]),
    dict(src="introduction-evil-dead", type="post", slug="introduction-evil-dead", title="Introduction: Evil Dead", tags=["evil-dead"]),
    dict(src="evil-dead-wrap-up", type="post", slug="evil-dead-wrap-up", title="Evil Dead: Wrap-Up", tags=["evil-dead"], coverScale=1.08),
    dict(src="is-the-long-dark-2017-a-horror-game", type="post", slug="is-the-long-dark-a-horror-game", title="Is The Long Dark a Horror Game in Disguise?", tags=["games"]),
]

SERIES = [
    dict(slug="evil-dead", title="Evil Dead", intro="Every Evil Dead film, in order: Raimi's three, the remake, and the new films."),
    dict(slug="dark-tower", title="The Dark Tower", intro="Harry's reviews of Stephen King's Dark Tower books."),
]

# ---------------------------------------------------------------------------
# HTML → a tiny DOM → blocks

VOID = {"img", "br", "hr", "source", "input", "meta", "link"}


class Node:
    def __init__(self, tag, attrs, parent=None):
        self.tag, self.attrs, self.parent, self.children = tag, dict(attrs), parent, []

    def cls(self):
        return self.attrs.get("class") or ""


class Tree(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = self.cur = Node("root", [])

    def handle_starttag(self, tag, attrs):
        n = Node(tag, attrs, self.cur)
        self.cur.children.append(n)
        if tag not in VOID:
            self.cur = n

    def handle_endtag(self, tag):
        n = self.cur
        while n is not self.root and n.tag != tag:
            n = n.parent
        if n is not self.root:
            self.cur = n.parent

    def handle_data(self, data):
        self.cur.children.append(data)


def parse(markup):
    t = Tree()
    t.feed(markup)
    return t.root


SKIP_CLASSES = ("subscription-widget", "button-wrapper", "captioned-button", "image-link-expand", "footnote-anchor", "poll-embed", "embedded-post")


def skipped(n):
    return isinstance(n, Node) and (n.tag in ("svg", "button", "form", "script", "style") or any(c in n.cls() for c in SKIP_CLASSES))


def inline(n):
    """Children → sanitised inline HTML: em, strong, a, br only."""
    out = []
    for c in n.children:
        if isinstance(c, str):
            out.append(html.escape(c, quote=False))
        elif skipped(c):
            continue
        elif "mention-wrap" in c.cls():
            try:
                out.append(html.escape(json.loads(c.attrs.get("data-attrs", "{}")).get("name", "")))
            except ValueError:
                pass
        elif c.tag in ("em", "i"):
            out.append(f"<em>{inline(c)}</em>")
        elif c.tag in ("strong", "b"):
            out.append(f"<strong>{inline(c)}</strong>")
        elif c.tag == "a" and c.attrs.get("href", "").startswith("http"):
            out.append(f'<a href="{html.escape(c.attrs["href"])}">{inline(c)}</a>')
        elif c.tag == "br":
            out.append("<br>")
        else:
            out.append(inline(c))
    s = "".join(out)
    s = re.sub(r"<(em|strong)>(\s*)</\1>", r"\2", s)          # empty marks
    s = re.sub(r"</(em|strong)><\1>", "", s)                    # split marks
    return s.replace("\xa0", " ")


def text_of(fragment):
    return html.unescape(re.sub(r"<[^>]+>", "", fragment)).strip()


def find(n, tag):
    if isinstance(n, Node):
        if n.tag == tag:
            return n
        for c in n.children:
            r = find(c, tag)
            if r:
                return r
    return None


def img_src(img):
    return img.attrs.get("src", "")


def is_key_table(src):
    """The scoring key is a wide PNG/JPEG table, ~3.5:1."""
    m = re.search(r"_(\d+)x(\d+)\.\w+$", src)
    return bool(m) and int(m.group(1)) / int(m.group(2)) > 2.6


# Substack furniture, and the written total under the key table (the chart
# shows it). "16/23." on its own is the older form of the total.
BOILERPLATE = re.compile(r"(?i)^(thanks for reading hellish views|if you liked the review, check out my backlog|subscribe)|^total score|^\d+\s*/\s*\d+\.?$")


def blocks_from(node, out):
    for c in node.children:
        if isinstance(c, str):
            if c.strip():
                out.append({"type": "paragraph", "html": html.escape(c.strip(), quote=False)})
            continue
        if skipped(c):
            continue
        t = c.tag
        if t == "p":
            h = inline(c).strip()
            if h and not BOILERPLATE.search(text_of(h)):
                out.append({"type": "paragraph", "html": h})
        elif t in ("h1", "h2", "h3", "h4", "h5", "h6"):
            h = inline(c).strip()
            if h:
                out.append({"type": "heading", "level": 2 if t in ("h1", "h2") else 3, "html": h})
        elif t == "hr":
            out.append({"type": "divider"})
        elif t == "blockquote":
            inner = []
            blocks_from(c, inner)
            h = "<br><br>".join(b["html"] for b in inner if b.get("html"))
            if h:
                out.append({"type": "pullQuote", "html": h})
        elif t in ("ul", "ol"):
            items = [inline(li).strip() for li in c.children if isinstance(li, Node) and li.tag == "li"]
            items = [i for i in items if i]
            if items:
                out.append({"type": "list", "ordered": t == "ol", "items": items})
        elif t == "figure" or "captioned-image-container" in c.cls():
            img = find(c, "img")
            if img:
                cap = find(c, "figcaption")
                out.append({
                    "type": "image",
                    "src": img_src(img),
                    "alt": (img.attrs.get("alt") or "").strip(),
                    "caption": inline(cap).strip() if cap else "",
                })
            else:
                blocks_from(c, out)
        else:
            blocks_from(c, out)


def tidy(blocks):
    # Collapse runs of dividers and strip them from the ends.
    out = []
    for b in blocks:
        if b["type"] == "divider" and (not out or out[-1]["type"] == "divider"):
            continue
        out.append(b)
    while out and out[-1]["type"] == "divider":
        out.pop()
    while out and out[0]["type"] == "divider":
        out.pop(0)
    return out


def split_warnings(blocks):
    """Paragraphs that open with 'T.W' become content warnings."""
    warnings, rest = [], []
    for b in blocks:
        t = text_of(b.get("html", "")) if b["type"] == "paragraph" else ""
        m = re.match(r"(?i)^t\.?w\.?\s*(for|:)?\s*(.+?)\.?$", t)
        if m and len(t) < 160:
            warnings.append(m.group(2)[0].upper() + m.group(2)[1:])
        else:
            rest.append(b)
    return warnings, rest


def key_scores_to_charts(blocks, key_scores):
    """Key-table images: dropped on reviews (the chart is drawn from data),
    turned into live charts where a post uses them as examples."""
    out, i = [], 0
    for b in blocks:
        if b["type"] == "image" and is_key_table(b["src"]):
            s = key_scores[i] if key_scores and i < len(key_scores) else None
            i += 1
            if s:
                out.append({"type": "score", "rubric": "film-v1", "scores": s})
            continue
        out.append(b)
    return out


def sections(blocks):
    """Split on dividers: [preface…] --- [body…] --- [sign-off…]."""
    parts, cur = [], []
    for b in blocks:
        if b["type"] == "divider":
            parts.append(cur)
            cur = []
        else:
            cur.append(b)
    parts.append(cur)
    return [p for p in parts if p]


def poem(blocks):
    """Poem lines are one <p> each; '***' marks a stanza break."""
    stanzas, cur = [], []
    for b in blocks:
        if b["type"] != "paragraph":
            continue
        line = text_of(b["html"])
        if re.fullmatch(r"\*{3}", line):
            if cur:
                stanzas.append(cur)
            cur = []
        else:
            cur.append(line)
    if cur:
        stanzas.append(cur)
    return stanzas


def fetch(src, cache):
    f = cache / f"{src}.json" if cache else None
    if f and f.exists():
        return json.loads(f.read_text())
    with urllib.request.urlopen(API + src) as r:
        data = json.loads(r.read())
    if f:
        f.write_text(json.dumps(data))
    time.sleep(0.4)
    return data


def build(cache):
    reviews, writing, posts, raw = [], [], [], {}
    for m in MANIFEST:
        p = fetch(m["src"], cache)
        raw[m["src"]] = p
        body = []
        blocks_from(parse(p["body_html"] or ""), body)
        body = tidy(key_scores_to_charts(body, m.get("keyScores")))
        warnings, body = split_warnings(body)
        body = tidy(body)
        base = {
            "slug": m["slug"],
            "title": m["title"],
            "dek": (p.get("subtitle") or "").strip(),
            "publishedAt": p["post_date"][:10],
            "contributors": ["Harry"],
            "substackUrl": p.get("canonical_url"),
            "cover": p.get("cover_image"),
            # Some Substack covers have white bars baked into their edges;
            # a small zoom on the card crops them out.
            "coverScale": m.get("coverScale"),
        }
        if m["type"] == "review":
            reviews.append({
                **base,
                "kind": m["kind"],
                "reviewNumber": m.get("reviewNumber"),
                "workYear": m["workYear"],
                "medium": m["medium"],
                "creator": m.get("creator"),
                "contentWarnings": warnings,
                "rubric": "film-v1" if m.get("scores") else None,
                "scores": m.get("scores"),
                "tags": m.get("tags", []),
                "series": m.get("series"),
                "seriesOrder": m.get("seriesOrder"),
                "body": body,
            })
        elif m["type"] == "writing":
            parts = sections(body)
            # [author's note] --- [photo] --- [piece] --- [sign-off]. The note
            # and sign-off frame the piece; the template sets them apart.
            preface = parts.pop(0) if len(parts) > 1 else []
            sign_off = parts.pop() if len(parts) > 1 and re.search(r"(?i)until next time|thanks for reading", " ".join(text_of(b.get("html", "")) for b in parts[-1])) else []
            rest = []
            for i, part in enumerate(parts):
                if i:
                    rest.append({"type": "divider"})
                rest += part
            image = next((b for b in preface + rest if b["type"] == "image"), None)
            preface = [b for b in preface if b is not image]
            rest = tidy([b for b in rest if b is not image])
            piece = {
                **base,
                "form": m["form"],
                "wordCount": p.get("wordcount"),
                "contentWarning": warnings[0] if warnings else None,
                "preface": preface,
                "image": image,
                "signOff": sign_off,
            }
            if m["form"] == "poetry":
                piece["stanzas"] = poem(rest)
            else:
                piece["body"] = rest
            writing.append(piece)
        else:
            posts.append({**base, "tags": m.get("tags", []), "body": body})

    series = []
    for s in SERIES:
        series.append({"slug": s["slug"], "title": s["title"], "intro": s["intro"]})
    return reviews, writing, posts, series


HEADER = """// GENERATED by scripts/pull-substack-samples.py — do not edit by hand.
//
// Harry's real posts, pulled from the public Substack for the preview. Text,
// images and dates are his; type, medium, creator, tags and series were set
// by hand, and the scores were read from the key table on each review.
// Replaced by the publication export, then Sanity.

"""


def main():
    cache = None
    if "--cache" in sys.argv:
        cache = Path(sys.argv[sys.argv.index("--cache") + 1])
        cache.mkdir(parents=True, exist_ok=True)
    reviews, writing, posts, series = build(cache)
    js = HEADER
    for name, data in (("reviews", reviews), ("writing", writing), ("posts", posts), ("series", series)):
        js += f"export const {name} = {json.dumps(data, ensure_ascii=False, indent=2)};\n\n"
    js += """// Stand-in for the Letterboxd profile feed, filtered to diary entries.
// Harry has no account yet; the strip is switched off (features.letterboxd).
export const letterboxdSample = [];
"""
    OUT.write_text(js)
    print(f"wrote {OUT.relative_to(ROOT)}: {len(reviews)} reviews, {len(writing)} writing, {len(posts)} posts, {len(series)} series")


if __name__ == "__main__":
    main()
