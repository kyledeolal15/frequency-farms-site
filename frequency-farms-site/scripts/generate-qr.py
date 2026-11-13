#!/usr/bin/env python3
"""Generate print-ready QR codes (vector SVG + PNG) for every strain.

Reads slugs from lib/strains.js, so the QR list can never drift from the
site. Each code is verified by decoding the rendered image back; the
script fails loudly if any code does not decode to exactly the right URL.

Usage (from the project root):  python3 scripts/generate-qr.py
Needs:  pip install opencv-python numpy pillow
Output: qr/<slug>.svg  qr/<slug>.png  qr/_contact-sheet.png  qr/urls.csv
"""
import csv, os, re, sys
import cv2, numpy as np
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "qr")
os.makedirs(OUT, exist_ok=True)

src = open(os.path.join(ROOT, "lib", "strains.js"), encoding="utf-8").read()
SITE = re.search(r'SITE_URL\s*=\s*"([^"]+)"', src).group(1)
PREFIX = re.search(r'QR_PATH_PREFIX\s*=\s*"([^"]+)"', src).group(1)
strains = re.findall(r'slug:\s*"([^"]+)"\s*,\s*name:\s*"([^"]+)"', src)
if not strains:
    sys.exit("no strains found in lib/strains.js")

QUIET = 4          # quiet-zone modules (QR spec minimum)
ECC = cv2.QRCodeEncoder_CORRECT_LEVEL_H  # ~30% damage tolerance, for scuffed bags

def modules_for(url):
    p = cv2.QRCodeEncoder_Params()
    p.correction_level = ECC
    p.mode = cv2.QRCodeEncoder_MODE_BYTE
    enc = cv2.QRCodeEncoder.create(p)
    img = enc.encode(url)
    if img is None or img.size == 0:
        raise RuntimeError(f"encode failed: {url}")
    g = img if img.ndim == 2 else cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    dark = g < 128
    ys, xs = np.where(dark)
    dark = dark[ys.min():ys.max()+1, xs.min():xs.max()+1]   # crop to the symbol
    n = dark.shape[0]
    # OpenCV renders each module as k px; recover the module grid.
    for k in range(1, 40):
        if n % k == 0 and dark[::k, ::k].shape[0] == n // k:
            grid = dark[::k, ::k]
            # sanity: finder pattern top-left should be 7 dark modules wide
            if grid[0, :7].all() and grid[:7, 0].all():
                return grid
    raise RuntimeError("could not recover module grid")

def svg(grid):
    n = grid.shape[0]; size = n + 2 * QUIET
    rects = []
    for y in range(n):                      # merge horizontal runs
        x = 0
        while x < n:
            if grid[y, x]:
                x0 = x
                while x < n and grid[y, x]: x += 1
                rects.append(f"M{x0+QUIET} {y+QUIET}h{x-x0}v1h-{x-x0}z")
            else: x += 1
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size} {size}" '
            f'shape-rendering="crispEdges"><rect width="{size}" height="{size}" fill="#fff"/>'
            f'<path fill="#000" d="{"".join(rects)}"/></svg>\n')

def png(grid, px=24):
    n = grid.shape[0]; size = n + 2 * QUIET
    a = np.full((size, size), 255, np.uint8)
    a[QUIET:QUIET+n, QUIET:QUIET+n] = np.where(grid, 0, 255)
    return Image.fromarray(a).resize((size*px, size*px), Image.NEAREST)

det = cv2.QRCodeDetector()
rows, tiles, bad = [], [], []
for slug, name in strains:
    url = f"{SITE}{PREFIX}{slug}"
    g = modules_for(url)
    open(os.path.join(OUT, f"{slug}.svg"), "w").write(svg(g))
    im = png(g); im.save(os.path.join(OUT, f"{slug}.png"))
    # verify: decode a downscaled copy (closer to a real phone camera than the pristine image)
    small = np.array(im.resize((300, 300), Image.LANCZOS).convert("RGB"))
    small = cv2.copyMakeBorder(small, 40, 40, 40, 40, cv2.BORDER_CONSTANT, value=(255,255,255))
    got, _, _ = det.detectAndDecode(small)
    ok = got == url
    if not ok: bad.append((slug, got))
    rows.append((slug, name, url, g.shape[0], "yes" if ok else "NO"))
    tiles.append((name, slug, im.resize((260, 260), Image.NEAREST)))

with open(os.path.join(OUT, "urls.csv"), "w", newline="") as f:
    w = csv.writer(f); w.writerow(["slug", "name", "url", "modules", "decodes_ok"]); w.writerows(rows)

# contact sheet for quick visual review / sending to the printer
cols = 4; cw, ch = 300, 340
sheet = Image.new("RGB", (cols*cw, ((len(tiles)+cols-1)//cols)*ch), "white")
d = ImageDraw.Draw(sheet)
try: font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 15)
except Exception: font = ImageFont.load_default()
for i, (name, slug, t) in enumerate(tiles):
    x, y = (i % cols)*cw + 20, (i // cols)*ch + 10
    sheet.paste(t, (x, y)); d.text((x, y+268), name, fill="black", font=font)
    d.text((x, y+290), f"/s/{slug}", fill="#555", font=font)
sheet.save(os.path.join(OUT, "_contact-sheet.png"))

print(f"{len(rows)} codes written to {OUT}")
if bad:
    print("FAILED TO DECODE:", bad); sys.exit(1)
print("all codes decode back to the exact URL")
