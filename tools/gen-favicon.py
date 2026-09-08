#!/usr/bin/env python3
"""Generate the txt.krisztian.wtf favicon: a single serif "K" on ink.

Deterministic - no AI, no hand-tuning. Render at 512, downscale with
LANCZOS to each target, like the other brand-asset generators.

Outputs (repo root, copied by Jekyll into _site):
    favicon.ico           (16 + 32)
    favicon-32.png        (32)
    apple-touch-icon.png  (180)

Usage: python3 tools/gen-favicon.py
"""
import os
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
FONT = "/usr/share/fonts/liberation-serif-fonts/LiberationSerif-Bold.ttf"
BG = (42, 40, 37, 255)      # --fg ink
INK = (247, 244, 239, 255)  # --bg paper
RADIUS_RATIO = 0.22         # corner rounding of the tile
LETTER_RATIO = 0.58         # cap height relative to tile

S = 512
tile = Image.new("RGBA", (S, S), (0, 0, 0, 0))
d = ImageDraw.Draw(tile)
d.rounded_rectangle((0, 0, S - 1, S - 1), radius=int(S * RADIUS_RATIO), fill=BG)

# letter, optically centered on its ink bbox
font = ImageFont.truetype(FONT, int(S * LETTER_RATIO))
bbox = d.textbbox((0, 0), "K", font=font)
w, h = bbox[2] - bbox[0], bbox[3] - bbox[1]
x = (S - w) / 2 - bbox[0]
y = (S - h) / 2 - bbox[1]
d.text((x, y), "K", font=font, fill=INK)

def save(size, name):
    img = tile.resize((size, size), Image.LANCZOS)
    img.save(ROOT / name)

save(32, "favicon-32.png")
save(180, "apple-touch-icon.png")
tile.resize((16, 16), Image.LANCZOS).save(
    ROOT / "favicon.ico", sizes=[(16, 16), (32, 32)]
)
print("favicon files written to", ROOT)
