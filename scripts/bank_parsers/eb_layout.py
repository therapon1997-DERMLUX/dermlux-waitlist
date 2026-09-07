"""Understand the Eurobank statement layout using word coordinates."""
import sys
sys.stdout.reconfigure(encoding='utf-8')
import fitz

P = r'C:\Users\User\Downloads\589-01-H59895-01_07_2026.pdf'
doc = fitz.open(P)
print('pages:', len(doc))

for pno in range(min(2, len(doc))):
    page = doc[pno]
    words = page.get_text('words')  # (x0,y0,x1,y1,word,block,line,word_no)
    # group words into visual rows by rounded y
    rows = {}
    for w in words:
        y = round(w[1] / 3) * 3
        rows.setdefault(y, []).append(w)
    print(f'\n===== page {pno + 1}: {len(words)} words, {len(rows)} visual rows  (page width {page.rect.width:.0f})')
    for y in sorted(rows)[:55]:
        ws = sorted(rows[y], key=lambda w: w[0])
        line = '  '.join(f'{w[4]}@{w[0]:.0f}' for w in ws)
        print(f'  y={y:>5}  {line[:190]}')
doc.close()
