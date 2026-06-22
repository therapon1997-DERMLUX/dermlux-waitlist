"""
Bake the laser-40 hero (photo + text overlay) into ONE image so it renders
everywhere, incl. Gmail mobile (which ignores CSS background images).
Run: python make-hero-baked.py
Output: public/email-images/hero-laser-40.jpg  (1200x920, displayed at 600)
"""
from PIL import Image, ImageDraw, ImageFont
import os

BASE = r'C:\Users\User\dermlux-waitlist\public\email-images'
S = 2                      # 2x for retina
W, H = 600 * S, 460 * S
CREAM = (245, 240, 232)
INK   = (22, 22, 22)

FB = r'C:\Windows\Fonts\cambriab.ttf'   # serif bold  → "40%"
FI = r'C:\Windows\Fonts\cambriai.ttf'   # serif italic → tagline
FA = r'C:\Windows\Fonts\arialbd.ttf'    # sans bold   → labels / button
def F(p, s): return ImageFont.truetype(p, s)

# ── 1. photo, cover-cropped to canvas ────────────────────────────────────────
photo = Image.open(os.path.join(BASE, 'header-image-background.png')).convert('RGB')
pw, ph = photo.size
sc = max(W / pw, H / ph)
photo = photo.resize((round(pw * sc), round(ph * sc)), Image.LANCZOS)
left = (photo.width - W) // 2
top  = (photo.height - H) // 2
photo = photo.crop((left, top, left + W, top + H)).convert('RGBA')

# ── 2. dark gradient overlay (matches template: .55 → .35 @45% → .70) ─────────
ov = Image.new('RGBA', (W, H), (0, 0, 0, 0))
od = ImageDraw.Draw(ov)
def lerp(a, b, t): return a + (b - a) * t
for y in range(H):
    p = y / H
    a = lerp(0.55, 0.35, p / 0.45) if p < 0.45 else lerp(0.35, 0.70, (p - 0.45) / 0.55)
    od.line([(0, y), (W, y)], fill=(10, 10, 10, int(a * 255)))
img = Image.alpha_composite(photo, ov)
d = ImageDraw.Draw(img)

# ── 3. letter-spaced centered text helpers ───────────────────────────────────
def tracked_w(text, font, tr):
    if not text: return 0
    return sum(d.textlength(c, font=font) + tr for c in text) - tr
def draw_tracked(cx, y, text, font, fill, tr):
    x = cx - tracked_w(text, font, tr) / 2
    for c in text:
        d.text((x, y), c, font=font, fill=fill)
        x += d.textlength(c, font=font) + tr
def line_h(text, font):
    bb = d.textbbox((0, 0), text, font=font); return bb[3] - bb[1], bb[1]

cx = W // 2
# items: (text, font, size, fill, tracking, gap_after)
items = [
    ('LASER HAIR REMOVAL', FA, 26 * 1, CREAM, 8, 6),
    ('40%',                FB, 250,    CREAM, 2, 0),
    ('OFF LIFETIME',       FA, 26,     CREAM, 8, 34),
    ('8 Sessions Bundles — Any Areas', FI, 56, CREAM, 0, 40),
]
fonts = [F(p, s) for (_, p, s, *_ ) in items]
heights = [line_h(t, f)[0] for (t, *_), f in zip(items, fonts)]
btn_font = F(FA, 24); btn_text = 'ENDS 15 JULY 2026'; btn_tr = 4
btn_h = line_h(btn_text, btn_font)[0] + 28 * S
total = sum(heights) + sum(it[5] for it in items) + btn_h
y = (H - total) // 2

for (t, _p, _s, fill, tr, gap), f, h in zip(items, fonts, heights):
    off = line_h(t, f)[1]
    draw_tracked(cx, y - off, t, f, fill, tr)
    y += h + gap

# ── 4. black "ENDS 15 JULY 2026" button ──────────────────────────────────────
bw = tracked_w(btn_text, btn_font, btn_tr) + 56 * S
bh = btn_h
bx0, by0 = cx - bw / 2, y
d.rounded_rectangle([bx0, by0, bx0 + bw, by0 + bh], radius=6 * S, fill=INK)
tb = d.textbbox((0, 0), btn_text, font=btn_font)
draw_tracked(cx, by0 + (bh - (tb[3] - tb[1])) / 2 - tb[1], btn_text, btn_font, CREAM, btn_tr)

out = os.path.join(BASE, 'hero-laser-40.jpg')
img.convert('RGB').save(out, 'JPEG', quality=90)
print('saved', out, img.size)
