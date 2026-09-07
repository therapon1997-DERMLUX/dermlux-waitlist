"""Parse the BoC XLSX statements positionally (blank cells kept). Read-only, writes JSON only."""
import json, os, sys, warnings, datetime
warnings.filterwarnings('ignore')
sys.stdout.reconfigure(encoding='utf-8')
import openpyxl
SCR = os.path.dirname(os.path.abspath(__file__))

FILES = ['TransactionHistory_1788236782699.xlsx',   # 357542264638 cash
         'TransactionHistory_1788236855910.xlsx',   # 357041157122 main, last 3 months
         'TransactionHistory_1788236967149.xlsx']   # 357041157122 main, May-Jun

def d2s(v):
    if isinstance(v, (datetime.datetime, datetime.date)):
        return v.strftime('%Y-%m-%d')
    return str(v).strip() if v is not None else None

out = {}
for n in FILES:
    p = os.path.join(r'C:\Users\User\Downloads', n)
    wb = openpyxl.load_workbook(p, data_only=True)
    ws = wb.active
    rows = [[c.value for c in r] for r in ws.iter_rows()]
    meta = {}
    hdr_i = None
    for i, r in enumerate(rows):
        cells = [c for c in r if c is not None]
        if len(cells) >= 2 and isinstance(cells[0], str) and cells[0].strip().endswith(':'):
            meta[cells[0].strip().rstrip(':')] = d2s(cells[1])
        if r and any(isinstance(c, str) and c.strip() == 'Date' for c in r):
            hdr_i = i; break
    header = [str(c).strip() if c is not None else '' for c in rows[hdr_i]]
    col = {h: j for j, h in enumerate(header) if h}
    acct = meta.get('Account number')
    txs = []
    for r in rows[hdr_i + 1:]:
        if not r or r[col['Date']] is None: continue
        g = lambda name: r[col[name]] if name in col and col[name] < len(r) else None
        num = lambda v: float(v) if isinstance(v, (int, float)) else None
        debit, credit = num(g('Debit')), num(g('Credit'))
        txs.append({
            'bank': 'Bank of Cyprus',
            'account': acct,
            'date': d2s(g('Date')),
            'description': (str(g('Description')).strip() if g('Description') else ''),
            'type': (str(g('Transaction type')).strip() if g('Transaction type') else None),
            'doc_no': (str(g('Reference number')).strip() if g('Reference number') else None),
            'debit': debit if debit else None,
            'credit': credit if credit else None,
            'balance': num(g('Indicative balance')),
            'value_date': d2s(g('Value date')),
            'ref': (str(g('Bank reference number')).strip() if g('Bank reference number') else None),
            'branch': (str(g('Branch code')).strip() if g('Branch code') else None),
        })
    out[n] = {'meta': meta, 'header': header, 'txs': txs}
    ds = sorted(t['date'] for t in txs if t['date'])
    print(f'{n}\n   account {acct} ({meta.get("Account type")})  rows={len(txs)}  {ds[0]} → {ds[-1]}')
    print(f'   header: {[h for h in header if h]}')
    print(f'   sample: {json.dumps(txs[0], ensure_ascii=False)[:250]}')
    dr = sum(t["debit"] or 0 for t in txs); cr = sum(t["credit"] or 0 for t in txs)
    print(f'   debits €{dr:,.2f}  credits €{cr:,.2f}  no-ref rows: {len([t for t in txs if not t["ref"]])}')
    wb.close()

json.dump(out, open(os.path.join(SCR, 'boc_parsed.json'), 'w', encoding='utf-8'), ensure_ascii=False)
print('\nsaved → boc_parsed.json')
