"""Eurobank statement parser. Columns are at fixed x positions; every row is validated
against the running balance chain (balance_new = balance_prev - debit + credit).
Read-only: writes JSON only."""
import glob, json, os, re, sys
sys.stdout.reconfigure(encoding='utf-8')
import fitz
SCR = os.path.dirname(os.path.abspath(__file__))

# x bands measured from the actual document
X_DATE_MAX = 60
X_DESC = (80, 265)
X_DEBIT = (265, 315)
X_CREDIT = (330, 375)
X_VALUE = (385, 440)
X_BAL = (480, 545)

AMT = re.compile(r'^-?[\d.]{1,3}(?:\.\d{3})*,\d{2}$')
DDMM = re.compile(r'^(\d{2})/(\d{2})$')
num = lambda s: float(s.replace('.', '').replace(',', '.'))

def parse(path):
    doc = fitz.open(path)
    stmt_date = None
    rows = []          # (page, y, words)
    for pno in range(len(doc)):
        page = doc[pno]
        words = page.get_text('words')
        if stmt_date is None:
            for w in words:
                m = re.match(r'^(\d{2})/(\d{2})/(\d{4})$', w[4])
                if m and w[0] > 400:
                    stmt_date = (int(m.group(3)), int(m.group(2))); break
        grouped = {}
        for w in words:
            grouped.setdefault(round(w[1] / 3) * 3, []).append(w)
        for y in sorted(grouped):
            rows.append((pno, y, sorted(grouped[y], key=lambda w: w[0])))
    doc.close()
    year, month = stmt_date
    # header rows repeat on each page — drop anything above the DATE/DESCRIPTION header line
    body = []
    seen_header = False
    for pno, y, ws in rows:
        txt = ' '.join(w[4] for w in ws)
        if 'DESCRIPTION' in txt and 'DEBIT' in txt:
            seen_header = True; continue
        if not seen_header: continue
        if re.search(r'ΚΑΤΑΣΤΑΣΗ|STATEMENT OF ACCOUNT|ΑΡ\. ΛΟΓΑΡΙΑΣΜΟΥ', txt):
            seen_header = False; continue
        body.append((pno, y, ws))

    txs, opening = [], None
    for idx, (pno, y, ws) in enumerate(body):
        dates = [w for w in ws if w[0] < X_DATE_MAX and DDMM.match(w[4])]
        if not dates: continue
        d = DDMM.match(dates[0][4])
        dd, mm = int(d.group(1)), int(d.group(2))
        yr = year if mm <= month else year - 1     # a December row on a January statement
        amounts = [w for w in ws if AMT.match(w[4])]
        debit = next((num(w[4]) for w in amounts if X_DEBIT[0] <= w[0] < X_DEBIT[1]), None)
        credit = next((num(w[4]) for w in amounts if X_CREDIT[0] <= w[0] < X_CREDIT[1]), None)
        bal = next((num(w[4]) for w in amounts if X_BAL[0] <= w[0] < X_BAL[1]), None)
        # description: this row plus the neighbouring rows that only carry description text
        desc_parts = []
        for j in range(max(0, idx - 2), min(len(body), idx + 3)):
            pj, yj, wj = body[j]
            if pj != pno or abs(yj - y) > 12: continue
            for w in wj:
                if X_DESC[0] <= w[0] < X_DESC[1] and not AMT.match(w[4]):
                    desc_parts.append((yj, w[0], w[4]))
        desc = ' '.join(t for _, _, t in sorted(desc_parts))
        vdate = next((w[4] for w in ws if X_VALUE[0] <= w[0] < X_VALUE[1] and re.match(r'^\d{6}$', w[4])), None)
        if not vdate:
            for j in (idx - 1, idx + 1):
                if 0 <= j < len(body):
                    vdate = next((w[4] for w in body[j][2] if X_VALUE[0] <= w[0] < X_VALUE[1] and re.match(r'^\d{6}$', w[4])), None)
                    if vdate: break
        if re.search(r'ΑΠΟ ΜΕΤΑΦΟΡΑ|BALANCE B/F', desc):
            opening = bal
            continue
        txs.append({'bank': 'Eurobank', 'account': '589-01-H59895-01',
                    'date': f'{yr}-{mm:02d}-{dd:02d}', 'description': desc.strip(),
                    'debit': debit, 'credit': credit, 'balance': bal,
                    'value_date': (f'20{vdate[4:6]}-{vdate[2:4]}-{vdate[0:2]}' if vdate else None)})
    return opening, txs

for path in sorted(glob.glob(r'C:\Users\User\Downloads\589-01-H59895-01_*.pdf')):
    opening, txs = parse(path)
    print(f'\n=== {os.path.basename(path)}   opening balance €{opening}   rows={len(txs)}')
    # VALIDATE the running-balance chain to the cent
    bad, prev = [], opening
    for t in txs:
        expect = round((prev or 0) - (t['debit'] or 0) + (t['credit'] or 0), 2)
        if t['balance'] is None or abs(expect - t['balance']) > 0.005:
            bad.append((t, expect))
        prev = t['balance'] if t['balance'] is not None else expect
    print(f'   chain OK: {len(txs) - len(bad)}/{len(txs)}   MISMATCHES: {len(bad)}')
    for t, exp in bad[:6]:
        print(f"      ! {t['date']} {t['description'][:52]:52} D={t['debit']} C={t['credit']} bal={t['balance']} expected={exp}")
    print(f"   debits €{sum(t['debit'] or 0 for t in txs):,.2f}   credits €{sum(t['credit'] or 0 for t in txs):,.2f}   closing €{txs[-1]['balance'] if txs else None}")
    for t in txs[:5]:
        print(f"      {t['date']}  D={str(t['debit']):>9} C={str(t['credit']):>9} bal={str(t['balance']):>9}  {t['description'][:60]}")
    out = os.path.join(SCR, 'eb_' + os.path.basename(path).replace('.pdf', '.json'))
    json.dump({'opening': opening, 'txs': txs}, open(out, 'w', encoding='utf-8'), ensure_ascii=False)
    print('   saved →', os.path.basename(out))
