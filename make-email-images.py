"""
Generate email images matching Figma design exactly.
Run: python make-email-images.py
"""
from PIL import Image, ImageDraw
import os

BASE = r'C:\Users\User\dermlux-waitlist\public\email-images'

# ── 1. HERO: 600×476 with warm brown gradient overlay ─────────────────────────
# Gradient from Figma: rgba(157,132,95,0.40) at 15% → #372E21 at 100%
# #372E21 = RGB(55, 46, 33)
hero = Image.open(os.path.join(BASE, 'hero.jpeg')).convert('RGBA')
hero = hero.resize((600, 476), Image.LANCZOS)

overlay = Image.new('RGBA', (600, 476), (0, 0, 0, 0))
draw = ImageDraw.Draw(overlay)

for y in range(476):
    pct = y / 476
    if pct < 0.15:
        # Nearly transparent warm tint
        t = pct / 0.15
        a = int(t * 102 * 0.40)
        draw.line([(0, y), (600, y)], fill=(157, 132, 95, a))
    else:
        # Linear from rgba(157,132,95,0.40) → rgb(55,46,33) opaque
        t = (pct - 0.15) / 0.85
        r = int(157 + (55  - 157) * t)
        g = int(132 + (46  - 132) * t)
        b = int(95  + (33  - 95)  * t)
        a = int(102 + (255 - 102) * t)   # 0.40 → 1.0
        draw.line([(0, y), (600, y)], fill=(r, g, b, a))

hero_out = Image.alpha_composite(hero, overlay).convert('RGB')
hero_out.save(os.path.join(BASE, 'hero-gradient.jpeg'), 'JPEG', quality=92)
print('✓ hero-gradient.jpeg (600×476)')

# ── 2. TREATMENT IMAGES: 200×300 with pink mauve gradient overlay ──────────────
# Gradient from Figma:
#   0%  → rgba(179,146,164, 0.20)
#  20%  → rgba(179,146,164, 0.20)
#  40%  → rgba(179,146,164, 0.40)
#  60%  → rgba(179,146,164, 0.60)
#  70%  → rgba(179,146,164, 0.69)
#  80%  → rgba(179,146,164, 0.80)
# 100%  → #B392A4 = rgba(179,146,164, 1.00)

def pink_alpha(pct):
    stops = [(0, .20), (.20, .20), (.40, .40), (.60, .60), (.70, .69), (.80, .80), (1.0, 1.0)]
    for i in range(len(stops) - 1):
        p0, a0 = stops[i]
        p1, a1 = stops[i + 1]
        if p0 <= pct <= p1:
            t = (pct - p0) / (p1 - p0) if p1 > p0 else 0
            return a0 + (a1 - a0) * t
    return 1.0

treatments = [
    ('facial.jpeg',    'facial-overlay.jpeg'),
    ('laser.jpeg',     'laser-overlay.jpeg'),
    ('injectable.jpeg','injectable-overlay.jpeg'),
]

for src, dst in treatments:
    img = Image.open(os.path.join(BASE, src)).convert('RGBA')
    # Centre-crop to 200×300
    w, h = img.size
    ratio = max(200 / w, 300 / h)
    new_w, new_h = int(w * ratio), int(h * ratio)
    img = img.resize((new_w, new_h), Image.LANCZOS)
    left = (new_w - 200) // 2
    top  = (new_h - 300) // 2
    img  = img.crop((left, top, left + 200, top + 300))

    ov = Image.new('RGBA', (200, 300), (0, 0, 0, 0))
    drw = ImageDraw.Draw(ov)
    for y in range(300):
        a = int(pink_alpha(y / 300) * 255)
        drw.line([(0, y), (200, y)], fill=(179, 146, 164, a))

    out = Image.alpha_composite(img, ov).convert('RGB')
    out.save(os.path.join(BASE, dst), 'JPEG', quality=92)
    print(f'✓ {dst} (200×300)')

print('\nAll images ready.')
