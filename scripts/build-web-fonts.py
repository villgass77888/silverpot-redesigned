"""
Builds the self-hosted Latin web fonts in src/assets/fonts/web (§3.4, §12.1).

Google's "latin" subsets ship ~230 glyphs and the full weight range of each
variable font. The site uses ~120 glyphs and a few weights, so each font is
subset to the characters the UI uses, then instanced down to the axes it needs:

  Big Shoulders          opsz pinned at 72 (Display), wght 800–900
  Big Shoulders Stencil  opsz 72, wght 900 (static)
  Bricolage Grotesque    wdth pinned at 100, wght 400–800, opsz kept (12–96)
  Gochi Hand             static
  IBM Plex Sans Arabic   400 / 500 / 700, Arabic block only (Latin falls through to Bricolage)
  Lalezar                Arabic block + ASCII (its heavy Latin suits Arabic headlines)

Sources are the OFL TTFs in github.com/google/fonts, pinned to one commit.
Requires Python 3 with fonttools and brotli:  pip install fonttools brotli
Run: pnpm fonts:build
"""

import os
import sys
import tempfile
import urllib.request

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

COMMIT = "47d54ca1ebb14fd864695f1d39dc734f39017c33"
BASE = f"https://raw.githubusercontent.com/google/fonts/{COMMIT}/ofl"
OUT = os.path.join(os.path.dirname(__file__), "..", "src", "assets", "fonts", "web")

# Printable ASCII plus the typographic characters used in the copy (§9, messages/en.json).
LATIN = "".join(chr(c) for c in range(0x20, 0x7F)) + "§©«®°·»×–—‘’“”•…→−≤≥€™"
# The Arabic block (letters, marks, Arabic-Indic digits, punctuation) plus the joiners
# and direction marks; shaping forms come along through the GSUB closure.
ARABIC = "".join(chr(c) for c in range(0x0600, 0x0700)) + "\u200c\u200d\u200e\u200f"

FONTS = [
    ("bigshoulders/BigShoulders%5Bopsz,wght%5D.ttf", "BigShoulders-Display-800-900.woff2", LATIN, {"opsz": 72, "wght": (800, 900)}),
    ("bigshouldersstencil/BigShouldersStencil%5Bopsz,wght%5D.ttf", "BigShouldersStencil-Display-900.woff2", LATIN, {"opsz": 72, "wght": 900}),
    ("bricolagegrotesque/BricolageGrotesque%5Bopsz,wdth,wght%5D.ttf", "BricolageGrotesque-400-800.woff2", LATIN, {"wdth": 100, "wght": (400, 800)}),
    ("gochihand/GochiHand-Regular.ttf", "GochiHand-400.woff2", LATIN, None),
    ("ibmplexsansarabic/IBMPlexSansArabic-Regular.ttf", "IBMPlexSansArabic-400.woff2", ARABIC, None),
    ("ibmplexsansarabic/IBMPlexSansArabic-Medium.ttf", "IBMPlexSansArabic-500.woff2", ARABIC, None),
    ("ibmplexsansarabic/IBMPlexSansArabic-Bold.ttf", "IBMPlexSansArabic-700.woff2", ARABIC, None),
    ("lalezar/Lalezar-Regular.ttf", "Lalezar-400.woff2", ARABIC + LATIN, None),
]


def build(src_path, out_path, text, axes):
    font = TTFont(src_path, lazy=False)
    opts = subset.Options()
    opts.layout_features = ["kern", "liga", "calt", "tnum", "lnum", "case", "ccmp", "locl", "mark", "mkmk",
                            "init", "medi", "fina", "isol", "rlig", "curs"]
    opts.hinting = False
    opts.desubroutinize = True
    opts.name_IDs = [0, 1, 2, 3, 4, 5, 6]
    opts.notdef_outline = True
    subsetter = subset.Subsetter(opts)
    subsetter.populate(text=text)
    # Subset before instancing: instancing first trips over glyphs missing from gvar.
    subsetter.subset(font)
    if axes:
        font = instancer.instantiateVariableFont(font, axes)
    font.flavor = "woff2"
    font.save(out_path)


def main():
    os.makedirs(OUT, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        for src, name, text, axes in FONTS:
            local = os.path.join(tmp, name + ".ttf")
            urllib.request.urlretrieve(f"{BASE}/{src}", local)
            out = os.path.join(OUT, name)
            build(local, out, text, axes)
            print(f"✓ {name} ({os.path.getsize(out) / 1024:.1f} KB)")


if __name__ == "__main__":
    sys.exit(main())
