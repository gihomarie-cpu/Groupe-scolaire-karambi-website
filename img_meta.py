"""Print dimensions, orientation, brightness and dominant colors for every photo."""
import os
import sys
from PIL import Image

D = sys.argv[1] if len(sys.argv) > 1 else "images"
rows = []
for f in sorted(os.listdir(D)):
    p = os.path.join(D, f)
    try:
        img = Image.open(p).convert("RGB")
    except Exception as e:
        print(f"{f}: ERROR {e}")
        continue
    w, h = img.size
    orient = "landscape" if w > h else ("portrait" if h > w else "square")
    g = img.convert("L")
    bright = sum(g.getdata()) / (g.size[0] * g.size[1])
    small = img.resize((64, 64)).quantize(colors=5, method=Image.Quantize.FASTOCTREE).convert("RGB")
    cols = sorted(small.getcolors(), reverse=True)[:3]
    cs = "  ".join(f"#{r:02x}{g_:02x}{b:02x}" for _, (r, g_, b) in cols)
    rows.append((f, w, h, orient, int(bright), cs))

for f, w, h, orient, bright, cs in rows:
    print(f"{f:45s} {w:4d}x{h:4d} {orient:9s} bright={bright:3d}  {cs}")