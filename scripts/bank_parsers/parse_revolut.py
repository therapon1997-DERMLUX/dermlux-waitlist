"""Revolut CSV parser. Writes JSON only."""
import csv, json, os, sys
from collections import Counter
sys.stdout.reconfigure(encoding='utf-8')
SCR = os.path.dirname(os.path.abspath(__file__))
P = r'C:\Users\User\Downloads\account-statement_01-Jun-2026_01-Sep-2026.csv'

rows = list(csv.DictReader(open(P, encoding='utf-8-sig')))
print('csv rows:', len(rows))
print('types   :', dict(Counter(r['Type'] for r in rows)))
print('states  :', dict(Counter(r['State'] for r in rows)))
print('accounts:', dict(Counter(r['Account'] for r in rows)))
amts = [float(r['Amount']) for r in rows if r['Amount']]
print(f'amount range: {min(amts)} … {max(amts)}   negatives: {len([a for a in amts if a < 0])}')
print('fees non-zero:', len([r for r in rows if r['Fee'] and float(r['Fee']) != 0]))

txs = []
for r in rows:
    if r['State'] != 'COMPLETED':
        print('  SKIP non-completed:', r['Date completed (UTC)'], r['Type'], r['Amount'], r['State']); continue
    amt = float(r['Amount'])
    fee = float(r['Fee']) if r['Fee'] else 0.0
    date = (r['Date completed (UTC)'] or r['Date started (UTC)'])[:10]
    desc_core = (r['Description'] or '').strip()
    txs.append({
        'bank': 'Revolut', 'account': 'Main EUR', 'date': date,
        'type': r['Type'], 'description': f"{r['Type']} {desc_core}".strip(),
        'desc_core': desc_core,
        'debit': round(-amt, 2) if amt < 0 else (fee if (amt == 0 and fee) else None),
        'credit': round(amt, 2) if amt > 0 else None,
        'fee': fee or None,
        'balance': float(r['Balance']) if r['Balance'] else None,
        'uuid': r['ID'],
        'reference': (r['Reference'] or '').strip() or None,
        'payer': (r['Payer'] or '').strip() or None,
        'sender_name': (r['Sender name'] or '').strip() or None,
        'beneficiary': (r['Beneficiary name'] or '').strip() or None,
    })
# FEE rows in Revolut CSV come as negative Amount already; make sure nothing is left with both None
odd = [t for t in txs if t['debit'] is None and t['credit'] is None]
print('rows with neither debit nor credit:', len(odd))
for t in odd[:5]: print('   ', t['date'], t['type'], t['desc_core'][:40], 'fee=', t['fee'])

ds = sorted(t['date'] for t in txs)
print(f"\nparsed {len(txs)} completed rows  {ds[0]} → {ds[-1]}")
print(f"debits €{sum(t['debit'] or 0 for t in txs):,.2f}   credits €{sum(t['credit'] or 0 for t in txs):,.2f}")
print('by type:', dict(Counter(t['type'] for t in txs)))
json.dump(txs, open(os.path.join(SCR, 'revolut_parsed.json'), 'w', encoding='utf-8'), ensure_ascii=False)
print('saved → revolut_parsed.json')
for t in txs[:6]:
    print(f"   {t['date']}  D={str(t['debit']):>8} C={str(t['credit']):>8} bal={str(t['balance']):>9}  {t['description'][:56]}")
