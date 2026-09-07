"""Eurobank parser v2 — groups words into transaction BLOCKS (a block is one transaction,
spanning ~10px; blocks are ~24px apart). Validated against the running-balance chain."""
import glob, json, os, re, sys
sys.stdout.reconfigure(encoding='utf-8')
import fitz
SCR = os.path.dirname(os.path.abspath(__file__))

X_DATE = (0, 60); X_DESC = (80, 265); X_DEBIT = (265, 320)
X_CREDIT = (325, 378); X_VALUE = (385, 445); X_BAL = (470, 560)
AMT = re.compile(r'^-?\d{1,3}(?:\.\d{3})*,\d{2}$')
DDMM = re.compile(r'^(\d{2})/(\d{2})$')
num = lambda s: float(s.replace('.', '').replace(',', '.'))

def parse(path):
    doc = fitz.open(path)
    stmt = None
    words = []
    for pno in range(len(doc)):
        page = doc[pno]
        ws = page.get_text('words')
        if stmt is None:
            for w in ws:
                m = re.match(r'^(\d{2})/(\d{2})/(\d{4})$', w[4])
                if m and w[0] > 400: stmt = (int(m.group(3)), int(m.group(2))); break
        # keep only words BELOW the column header of this page, and above the footer
        hdr_y = None
        for w in ws:
            if w[4] == 'DESCRIPTION': hdr_y = w[1]
        for w in ws:
            if hdr_y is not None and w[1] > hdr_y + 4:
                words.append((pno, w[1], w[0], w[4]))
    doc.close()
    year, month = stmt
    words.sort(key=lambda t: (t[0], t[1], t[2]))

    blocks, cur, last = [], [], None
    for w in words:
        if last is not None and (w[0] != last[0] or w[1] - last[1] > 8):
            if cur: blocks.append(cur)
            cur = []
        cur.append(w); last = w
    if cur: blocks.append(cur)

    txs, opening = [], None
    for b in blocks:
        date_w = [w for w in b if w[2] < X_DATE[1] and DDMM.match(w[3])]
        bal_w = [w for w in b if X_BAL[0] <= w[2] < X_BAL[1] and AMT.match(w[3])]
        if not date_w and not bal_w: continue
        desc = ' '.join(w[3] for w in sorted(b, key=lambda t: (t[1], t[2]))
                        if X_DESC[0] <= w[2] < X_DESC[1] and not AMT.match(w[3]))
        bal = num(bal_w[0][3]) if bal_w else None
        if re.search(r'ΑΠΟ ΜΕΤΑΦΟΡΑ|BALANCE B/F', desc):
            opening = bal; continue
        if not date_w: continue
        d = DDMM.match(date_w[0][3]); dd, mm = int(d.group(1)), int(d.group(2))
        yr = year if mm <= month else year - 1
        debit = next((num(w[3]) for w in b if X_DEBIT[0] <= w[2] < X_DEBIT[1] and AMT.match(w[3])), None)
        credit = next((num(w[3]) for w in b if X_CREDIT[0] <= w[2] < X_CREDIT[1] and AMT.match(w[3])), None)
        vd = next((w[3] for w in b if X_VALUE[0] <= w[2] < X_VALUE[1] and re.match(r'^\d{6}$', w[3])), None)
        txs.append({'bank': 'Eurobank', 'account': '589-01-H59895-01',
                    'date': f'{yr}-{mm:02d}-{dd:02d}', 'description': desc.strip(),
                    'debit': debit, 'credit': credit, 'balance': bal,
                    'value_date': (f'20{vd[4:6]}-{vd[2:4]}-{vd[0:2]}' if vd else None)})
    return opening, txs

TARGET = sys.argv[1] if len(sys.argv) > 1 else '*'
allok = True
for path in sorted(glob.glob(rf'C:\Users\User\Downloads\589-01-H59895-01_{TARGET}.pdf')):
    opening, txs = parse(path)
    bad, prev = [], opening
    for t in txs:
        exp = round((prev or 0) - (t['debit'] or 0) + (t['credit'] or 0), 2)
        if t['balance'] is None or abs(exp - t['balance']) > 0.005: bad.append((t, exp))
        prev = t['balance'] if t['balance'] is not None else exp
    status = 'OK ' if not bad else 'FAIL'
    if bad: allok = False
    print(f"[{status}] {os.path.basename(path):32} open €{opening:>9}  rows={len(txs):>3}  chain {len(txs)-len(bad)}/{len(txs)}  "
          f"D €{sum(t['debit'] or 0 for t in txs):>10,.2f}  C €{sum(t['credit'] or 0 for t in txs):>10,.2f}  close €{txs[-1]['balance'] if txs else None}")
    for t, exp in bad[:4]:
        print(f"      ! {t['date']} {t['description'][:48]:48} D={t['debit']} C={t['credit']} bal={t['balance']} exp={exp}")
    out = os.path.join(SCR, 'eb_' + os.path.basename(path).replace('.pdf', '.json'))
    json.dump({'opening': opening, 'txs': txs}, open(out, 'w', encoding='utf-8'), ensure_ascii=False)
print('\nALL CHAINS VALID' if allok else '\nSOME CHAINS FAILED')
