#!/usr/bin/env python3
"""Generate the favicon: a lowercase "k" in Fraunces (the headline font) on an
ink tile. Deterministic - the outline comes from the self-hosted variable font,
instantiated at the same weight the site uses (600).

Outputs (repo root, copied by Jekyll into _site):
    favicon.svg           vector, outline baked to a path (no font needed)
    favicon-32.png        32
    apple-touch-icon.png  180
    favicon.ico           16 + 32

Usage: python3 tools/gen-favicon.py
Requires: fonttools (woff2 + instancing), brotli, pillow.
"""
from pathlib import Path

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
WOFF2 = ROOT / "assets/fonts/fraunces-normal-latin.woff2"
TMP_TTF = ROOT / ".tmp-fraunces-600.ttf"

LETTER = "K"
WEIGHT = 600                # what the site uses for headlines
OPSZ = 53                   # the homepage masthead renders at 52.7px, so the
                            # logo cut is opsz 53 - NOT the font's default 9,
                            # which is a text cut and looks like another font
BG = (42, 40, 37, 255)      # --fg ink
INK = (247, 244, 239, 255)  # --bg paper
TILE_RADIUS = 0.22          # of the tile size
LETTER_HEIGHT = 0.62        # ink height (ascender to baseline) vs tile size


def instanced_font():
    """Pin every axis so the outlines match how the site sets Fraunces.

    The shipped font has two axes (opsz, wght). Pinning only wght leaves opsz
    at its default 9, which draws a text cut - visibly not the logo.
    """
    font = TTFont(WOFF2)  # woff2 decoding needs brotli
    inst = instancer.instantiateVariableFont(font, {"wght": WEIGHT, "opsz": OPSZ}, inplace=False)
    if "fvar" in inst:
        raise SystemExit("gen-favicon: font is still variable after instancing - axes not pinned")
    inst.save(TMP_TTF)  # always rewrite: a stale instance would silently be reused
    return inst


def glyph_bounds(font, glyph_name):
    pen = BoundsPen(font.getGlyphSet())
    font.getGlyphSet()[glyph_name].draw(pen)
    return pen.bounds  # (xMin, yMin, xMax, yMax)


def write_svg(font):
    glyph_name = font.getBestCmap()[ord(LETTER)]
    x_min, y_min, x_max, y_max = glyph_bounds(font, glyph_name)
    glyph_set = font.getGlyphSet()
    pen = SVGPathPen(glyph_set)
    glyph_set[glyph_name].draw(pen)

    size = 32
    scale = (size * LETTER_HEIGHT) / (y_max - y_min)
    # centre the ink box on the tile, flipping y for SVG coordinates
    tx = size / 2 - (x_min + x_max) / 2 * scale
    ty = size / 2 + (y_min + y_max) / 2 * scale

    (ROOT / "favicon.svg").write_text(
        f"""<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}">
  <rect x="0" y="0" width="{size}" height="{size}" rx="{size * TILE_RADIUS:.2f}" fill="#2a2825"/>
  <path transform="translate({tx:.3f} {ty:.3f}) scale({scale:.5f} -{scale:.5f})" d="{pen.getCommands()}" fill="#f7f4ef"/>
</svg>
""",
        encoding="utf-8",
    )


def write_rasters():
    S = 512
    tile = Image.new("RGBA", (S, S), (0, 0, 0, 0))
    draw = ImageDraw.Draw(tile)
    draw.rounded_rectangle((0, 0, S - 1, S - 1), radius=int(S * TILE_RADIUS), fill=BG)

    # pick a pixel size whose ink height matches the SVG's proportions
    probe = ImageFont.truetype(str(TMP_TTF), 400)
    _, py_min, _, py_max = probe.getbbox(LETTER)
    size = int(400 * (S * LETTER_HEIGHT) / (py_max - py_min))
    f = ImageFont.truetype(str(TMP_TTF), size)
    left, top, right, bottom = f.getbbox(LETTER)
    draw.text(((S - (right - left)) / 2 - left, (S - (bottom - top)) / 2 - top),
              LETTER, font=f, fill=INK)

    tile.resize((32, 32), Image.LANCZOS).save(ROOT / "favicon-32.png")
    tile.resize((180, 180), Image.LANCZOS).save(ROOT / "apple-touch-icon.png")
    tile.resize((16, 16), Image.LANCZOS).save(ROOT / "favicon.ico",
                                              sizes=[(16, 16), (32, 32)])


if __name__ == "__main__":
    font = instanced_font()
    write_svg(font)
    write_rasters()
    print(f"favicon files written (Fraunces wght {WEIGHT} opsz {OPSZ}, {LETTER!r})")
