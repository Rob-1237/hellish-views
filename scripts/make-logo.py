"""HELLISH VIEWS logo: HAL Gap outlines (wdth 90) plus a few hand-placed thorns
in the manner of the 'Una resistencia indetectable' poster. Writes
design/logo/full.svg and horizontal.svg; export-logo.sh turns them into PNGs.

Needs: pip install fonttools uharfbuzz

LICENCE: built from the unlicensed HAL Gap trial, so the output is a concept.
It must not go on the public site until HAL Gap is licensed for logo use.

Thorns are placed relative to a glyph's bounding box so they grow out of the
letter's edge: (line, glyph index, fx, fy, angle°, length, base width, bend).
fx/fy are 0..1 across the glyph box (fy 0 = baseline, 1 = cap/x top).
"""
import json, math, sys
from pathlib import Path
import uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.transformPen import TransformPen

ROOT = Path(__file__).resolve().parent.parent
HERE = ROOT / "design" / "logo"
FONT = ROOT / "public" / "HAL Typefaces Unlicensed Fonts" / "HAL Gap" / "HAL Gap Variable" / "TTF" / "HALGapVariableUnlicensed-Variable.ttf"
WDTH = 90

blob = hb.Blob.from_file_path(str(FONT))
face = hb.Face(blob)
hbfont = hb.Font(face)
hbfont.set_variations({"wdth": WDTH})
tt = instantiateVariableFont(TTFont(FONT), {"wdth": WDTH})
gs = tt.getGlyphSet()
order = tt.getGlyphOrder()


def shape(text):
    buf = hb.Buffer()
    buf.add_str(text)
    buf.guess_segment_properties()
    hb.shape(hbfont, buf, {"kern": True, "liga": True})
    x, out = 0, []
    for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
        name = order[info.codepoint]
        pen = SVGPathPen(gs)
        gs[name].draw(pen)
        bp = BoundsPen(gs)
        gs[name].draw(bp)
        out.append({"x": x + pos.x_offset, "name": name, "b": bp.bounds})
        x += pos.x_advance
    return out, x


def thorn(x, y, ang, L, W, bend, barb=0.0):
    """A thorn: wide base buried in the letter, concave flanks, the tip
    swept sideways by `bend`. `barb` > 0 adds a small secondary spur on the
    outside of the curve, like a rose thorn."""
    a = math.radians(ang)
    ux, uy = math.cos(a), math.sin(a)
    nx, ny = -uy, ux
    bury = L * 0.25
    bx, by = x - ux * bury, y - uy * bury
    tip = (x + ux * L + nx * bend, y + uy * L + ny * bend)
    p1 = (bx + nx * W / 2, by + ny * W / 2)
    p2 = (bx - nx * W / 2, by - ny * W / 2)
    mid = lambda t, off: (x + ux * L * t + nx * (bend * t * t + off), y + uy * L * t + ny * (bend * t * t + off))
    c1 = mid(0.55, W * 0.10)     # concave: the flanks pinch in toward the spine
    c2 = mid(0.55, -W * 0.10)
    d = f"M{p1[0]:.1f} {p1[1]:.1f} Q{c1[0]:.1f} {c1[1]:.1f} {tip[0]:.1f} {tip[1]:.1f} Q{c2[0]:.1f} {c2[1]:.1f} {p2[0]:.1f} {p2[1]:.1f}Z"
    if barb:
        s = 1 if bend >= 0 else -1
        o = mid(0.35, 0)             # rooted on the spine so it never floats
        bt = (o[0] + (ux * 0.5 - nx * s) * L * barb, o[1] + (uy * 0.5 - ny * s) * L * barb)
        w = W * 0.22
        d += f" M{o[0] - ux * w:.1f} {o[1] - uy * w:.1f} L{bt[0]:.1f} {bt[1]:.1f} L{o[0] + ux * w:.1f} {o[1] + uy * w:.1f}Z"
    return d, tip


def vine(pts, W, barbs=()):
    """A tapering bramble along a quadratic curve pts=(start, control, end),
    widest at the start. barbs: (t, side, length) small thorns off it."""
    (x0, y0), (cx, cy), (x1, y1) = pts
    def at(t):
        return ((1-t)**2*x0 + 2*(1-t)*t*cx + t*t*x1, (1-t)**2*y0 + 2*(1-t)*t*cy + t*t*y1)
    def tan(t):
        dx = 2*(1-t)*(cx-x0) + 2*t*(x1-cx); dy = 2*(1-t)*(cy-y0) + 2*t*(y1-cy)
        n = math.hypot(dx, dy); return dx/n, dy/n
    left, right = [], []
    N = 24
    for i in range(N + 1):
        t = i / N
        (px, py), (tx, ty) = at(t), tan(t)
        w = W * (1 - t) ** 0.8 / 2
        left.append((px - ty * w, py + tx * w)); right.append((px + ty * w, py - tx * w))
    d = "M" + " L".join(f"{x:.1f} {y:.1f}" for x, y in left + right[::-1]) + "Z"
    for t, side, L in barbs:
        (px, py), (tx, ty) = at(t), tan(t)
        ang = math.degrees(math.atan2(ty, tx)) + side * 55
        bd, _ = thorn(px, py, ang, L, W * 0.9 * (1 - t) + 14, side * L * 0.25)
        d += " " + bd
    return d


def build(lines, thorns, vines=(), pad=140, name="logo"):
    """lines: list of (text, x_offset, baseline, scale, fill)."""
    parts, boxes = [], []
    minx = miny = 1e9
    maxx = maxy = -1e9
    placed = []
    for text, x0, base, sc, fill in lines:
        glyphs, adv = shape(text)
        row = []
        # One path per line: separate glyph paths that touch leave hairline
        # anti-aliasing seams between them.
        pen = SVGPathPen(gs)
        for g in glyphs:
            if not g["b"]:
                row.append(None)
                continue
            gx = x0 + g["x"] * sc
            x1, y1, x2, y2 = g["b"]
            box = (gx + x1 * sc, base - y2 * sc, gx + x2 * sc, base - y1 * sc)  # svg coords
            row.append(box)
            minx, miny = min(minx, box[0]), min(miny, box[1])
            maxx, maxy = max(maxx, box[2]), max(maxy, box[3])
            gs[g["name"]].draw(TransformPen(pen, (sc, 0, 0, -sc, gx, base)))
        parts.append(f'<path fill="{fill}" d="{pen.getCommands()}"/>')
        placed.append((row, fill, sc))
    def anchor(li, gi, fx, fy):
        row, fill, sc = placed[li]
        b = [bx for bx in row if bx][gi]
        return b[0] + (b[2] - b[0]) * fx, b[3] - (b[3] - b[1]) * fy, fill, sc
    for t in thorns:
        li, gi, fx, fy, ang, L, W, bend = t[:8]
        barb = t[8] if len(t) > 8 else 0
        x, y, fill, sc = anchor(li, gi, fx, fy)
        d, (tx, ty) = thorn(x, y, -ang, L * sc, W * sc, -bend * sc, barb)   # svg y is down
        parts.append(f'<path fill="{fill}" d="{d}"/>')
        minx, miny, maxx, maxy = min(minx, tx), min(miny, ty), max(maxx, tx), max(maxy, ty)
    for (a0, ctrl, a1, W, barbs) in vines:
        x0, y0, fill, sc = anchor(*a0)
        x1, y1, _, _ = anchor(*a1)
        cx, cy = x0 + (x1 - x0) * 0.5 + ctrl[0], y0 + (y1 - y0) * 0.5 - ctrl[1]
        parts.append(f'<path fill="{fill}" d="{vine(((x0, y0), (cx, cy), (x1, y1)), W, barbs)}"/>')
    vb = (minx - pad, miny - pad, maxx - minx + 2 * pad, maxy - miny + 2 * pad)
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{vb[0]:.0f} {vb[1]:.0f} {vb[2]:.0f} {vb[3]:.0f}" width="{vb[2]:.0f}" height="{vb[3]:.0f}">\n' + "\n".join(parts) + "\n</svg>\n"
    (HERE / f"{name}.svg").write_text(svg)
    return vb


TEXT = "#f2f2f0"
ACCENT = "#d2e3fc"
SPACE = 151  # HAL Gap space advance at wdth 90, font units
LEAD = 760   # baseline to baseline: caps nearly touch, as on the poster

# ---- Full stacked logo ---------------------------------------------------
full_lines = [
    ("HELLISH", 0, 700, 1, TEXT),
    ("VIEWS", 2 * SPACE, 700 + LEAD, 1, TEXT),
    ("by Harry", 0, 700 + LEAD + 470, 0.42, ACCENT),
    ("Evans", SPACE * 0.42, 700 + LEAD + 470 + 330, 0.42, ACCENT),
]
full_thorns = [
    # line, glyph, fx, fy, angle, length, base width, bend, [barb]
    (0, 0, 0.02, 0.58, 172, 300, 120, 70, 0.28),    # H: a thorn off the left stem, curling down
    (0, 6, 0.96, 0.98, 58, 280, 100, 60),           # last H: up off the top-right corner
    (1, 0, 0.50, 0.02, -100, 270, 110, -90, 0.25),  # V: its point runs on into a claw
    (1, 4, 0.97, 0.30, -18, 300, 110, -80, 0.26),   # S of VIEWS: the lower curve thrown out and down
]
full_vines = []

# ---- Horizontal ----------------------------------------------------------
horiz_lines = [("HELLISH VIEWS", 0, 700, 1, TEXT)]
horiz_thorns = [
    (0, 0, 0.02, 0.58, 172, 280, 110, 60, 0.28),   # H
    (0, 7, 0.50, 0.02, -92, 320, 110, -70),        # V
    (0, 11, 0.9, 0.95, 55, 250, 95, 55),           # final S, up and out
]

if __name__ == "__main__":
    print("full", build(full_lines, full_thorns, full_vines, name="full"))
    print("horizontal", build(horiz_lines, horiz_thorns, name="horizontal"))
