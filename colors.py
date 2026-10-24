"""Report dominant colors of school photos (quantized) to pick the site palette."""
import sys
from collections import Counter
from PIL import Image

def dominant(path, n=6):
    img = Image.open(path).convert("RGB")
    img.thumbnail((200, 200))
    # quantize to reduce noise
    small = img.quantize(colors=16, method=Image.Quantize.FASTOCTREE).convert("RGB")
    counts = Counter(small.getdata())
    total = sum(counts.values())
    out = []
    for color, cnt in counts.most_common(n):
        pct = 100 * cnt / total
        out.append((color, pct))
    return out


for path in sys.argv[1:]:
    try:
        print(f"\n== {path.split('/')[-1].split(chr(92))[-1]} ==")
        for (r, g, b), pct in dominant(path):
            print(f"  #{r:02x}{g:02x}{b:02x}  rgb({r},{g},{b})  {pct:5.1f}%")
    except Exception as e:
        print(f"  ERROR: {e}")