# Κ.Α. → Λογιστικά (από 16/10/2026): για κάθε πληρωμή Κ.Α. της τράπεζας ↔ βεβαίωση του portal (Desktop αρχείο)
# φτιάχνει ΕΝΑ PDF (Βεβαίωση πληρωμής + Κατάσταση αποδοχών/εισφορών) και την εγγραφή expenses `ka_<ΑΜΕ>_<YYYY-MM>` + σύνδεση κίνησης.
# Επαναλαμβανόμενο: ό,τι υπάρχει ήδη παραλείπεται· κίνηση χωρίς σύνδεση ↔ υπάρχον ka_* → link_existing.
# READ-ONLY ως προς τη βάση: γράφει μόνο <out>/upload/*.pdf + <out>/book_plan.json.
# Χρήση: node scripts/bk_snapshot.mjs --since=<~4 μήνες πριν> --dir=<snap>
#        python scripts/bk_ka_build.py --snap=<snap> --out=C:/Users/User/bookkeeping-ka
#        node scripts/bk_ka_book.mjs --plan=C:/Users/User/bookkeeping-ka/book_plan.json [--execute]
import json, os, glob, datetime, collections, calendar, fitz, sys
ARG = dict(a[2:].split('=', 1) for a in sys.argv[1:] if a.startswith('--') and '=' in a)

ROOT = r'C:\Users\User\Desktop\DermLux\03_Λογιστής\Κοινωνικές_Ασφαλίσεις'
SNAP = ARG.get('snap', r'C:\Users\User\bookkeeping-2026-10\full')
OUT = ARG.get('out', r'C:\Users\User\bookkeeping-ka')
UP = os.path.join(OUT, 'upload')
os.makedirs(UP, exist_ok=True)
DERMLUX_ACC = '357041157122'
# λογαριασμός → σε ποιας εταιρείας τα βιβλία καταχωρείται ό,τι πληρώθηκε από αυτόν (16/10/2026: «το bank account της ιατρικής ΙΕΠΕ … θα τα καταχωρείς και εκείνα σε εκείνο τον λογαριασμό»)
ACC_BOOKS = {'357041157122': 'DERMLUX', '357046275557': 'IEPE'}
OWN_ACC = {v: k for k, v in ACC_BOOKS.items()}
CO_NAME = {'DERMLUX': 'DermLux', 'IEPE': 'Ιατρικής ΙΕΠΕ', 'EUGMED': 'EUGMED'}
PAY_SRC = {'DERMLUX': 'BoC Κύριος', 'IEPE': 'BoC ΙΕΠΕ'}
CO_UP = {'DERMLUX': 'DERMLUX', 'IEPE': 'ΙΑΤΡΙΚΗΣ ΙΕΠΕ', 'EUGMED': 'EUGMED'}
CITY = {'Nicosia': 'Λευκωσία', 'Limassol': 'Λεμεσός', 'Paphos': 'Πάφος', 'Larnaca': 'Λάρνακα'}
GRM = ['Ιανουαρίου', 'Φεβρουαρίου', 'Μαρτίου', 'Απριλίου', 'Μαΐου', 'Ιουνίου', 'Ιουλίου', 'Αυγούστου',
       'Σεπτεμβρίου', 'Οκτωβρίου', 'Νοεμβρίου', 'Δεκεμβρίου']
GRN = ['Ιανουάριος', 'Φεβρουάριος', 'Μάρτιος', 'Απρίλιος', 'Μάιος', 'Ιούνιος', 'Ιούλιος', 'Αύγουστος',
       'Σεπτέμβριος', 'Οκτώβριος', 'Νοέμβριος', 'Δεκέμβριος']
PARTS = [('social_insurance', 'Κοινωνικές Ασφαλίσεις'), ('social_cohesion', 'Ταμείο Κοινωνικής Συνοχής'), ('gesy', 'ΓεΣΥ'),
         ('redundancy', 'Ταμείο Πλεονάζοντος Προσωπικού'), ('human_resources', 'Ταμείο Ανθρώπινου Δυναμικού'),
         ('annual_leave', 'Ταμείο Ετήσιων Αδειών'), ('extra_si', 'Πρόσθετα τέλη ΤΚΑ'), ('extra_cohesion', 'Πρόσθετα τέλη ΤΚΣ'),
         ('extra_gesy', 'Πρόσθετα τέλη ΓεΣΥ')]

bank = json.load(open(SNAP + r'\snap_bank.json', encoding='utf-8'))
exps = json.load(open(SNAP + r'\snap_exp.json', encoding='utf-8'))

ka = []
for d in sorted(os.listdir(ROOT)):
    for f in sorted(glob.glob(os.path.join(ROOT, d, '*_data.json'))):
        j = json.load(open(f, encoding='utf-8'))
        m = os.path.basename(f)[:7]
        ka.append({'reg': d, 'month': m, 'j': j, 'amount': round(float(j.get('paid_amount') or j['totals']['total']), 2),
                   'pay_pdf': os.path.join(ROOT, d, f'{m}_ΒΕΒΑΙΩΣΗ_ΠΛΗΡΩΜΗΣ.pdf'),
                   'st_pdf': os.path.join(ROOT, d, f'{m}_ΚΑΤΑΣΤΑΣΗ_ΑΠΟΔΟΧΩΝ_ΕΙΣΦΟΡΩΝ.pdf')})

day = lambda s: datetime.date.fromisoformat(s[:10])
tx = sorted([t for t in bank if t.get('tag') == 'Εισφορές' and t.get('debit')], key=lambda t: (t['date'], t['id']))
cand = {t['id']: [i for i, k in enumerate(ka) if abs(k['amount'] - float(t['debit'])) < 0.005
                  and -2 <= (day(t['date']) - day(k['j']['paid_at'])).days <= 8] for t in tx}
used, match = set(), {}
for t in tx:                                              # μοναδικός υποψήφιος
    c = [i for i in cand[t['id']] if i not in used]
    if len(c) == 1:
        match[t['id']] = c[0]; used.add(c[0])
groups = collections.defaultdict(list)                    # C=: k ίδιες χρεώσεις ↔ k βεβαιώσεις ίδιου ποσού
for t in tx:
    if t['id'] not in match and cand[t['id']]:
        groups[(t['date'], float(t['debit']))].append(t)
for (dt, amt), ts in groups.items():
    c = sorted({i for t in ts for i in cand[t['id']] if i not in used})
    if len(c) != len(ts):                                  # αμφίβολο (π.χ. μερικό αντίγραφο: €2,69 ΙΕΠΕ/EUGMED) → δεν δένεται
        print('⚠ αμφίβολο, παραλείπεται:', dt, amt, [(ka[i]['reg'][:14], ka[i]['month']) for i in c])
        continue
    for t, i in zip(ts, c):
        match[t['id']] = i; used.add(i)


def last_day(m):
    y, mm = int(m[:4]), int(m[5:])
    if mm == 13: return f'{y}-12-31'
    return f'{y}-{mm:02d}-{calendar.monthrange(y, mm)[1]:02d}'


def label(m):
    y, mm = m[:4], int(m[5:])
    return f'13ου μισθού {y}' if mm == 13 else f'{GRM[mm - 1]} {y}'


def pdf_for(k, fname):
    out = os.path.join(UP, fname)
    if not os.path.exists(out):
        doc = fitz.open()
        for p in (k['pay_pdf'], k['st_pdf']):
            src = fitz.open(p); doc.insert_pdf(src); src.close()
        doc.save(out, garbage=3, deflate=True); doc.close()
    return out


def build(k, t, books):
    # books = η εταιρεία στης οποίας τα βιβλία μπαίνει (ιδιοκτήτης του λογαριασμού που πλήρωσε)
    j, reg = k['j'], k['reg']
    company = reg.split('_')[0]                                # DERMLUX | IEPE | EUGMED (του μητρώου)
    city_en = reg.split('_')[1] if company == 'DERMLUX' else None
    ame_d = ''.join(ch for ch in j['ame'] if ch.isdigit())
    did = f'ka_{ame_d}_{k["month"]}'
    fname = f'KA_{ame_d}_{k["month"]}_{city_en or company}.pdf'
    pdf_for(k, fname)
    tot = j.get('totals') or {}
    items = [{'description': f'{lbl} — εισφορές {label(k["month"])}', 'quantity': 1, 'unit_price': round(tot[key], 2), 'amount': round(tot[key], 2)}
             for key, lbl in PARTS if tot.get(key)]
    s = round(sum(i['amount'] for i in items), 2)
    if abs(s - k['amount']) > 0.005:                          # π.χ. μερική/διαφορετική πληρωμή → μία γραμμή, χωρίς ανάλυση
        items = [{'description': f'Εισφορές Κοινωνικών Ασφαλίσεων {label(k["month"])}', 'quantity': 1, 'unit_price': k['amount'], 'amount': k['amount']}]
    kind = 'Βεβαίωση εντολής για πληρωμή' if j.get('pay_kind') == 'mandate' else 'Βεβαίωση πληρωμής'
    who = f'DermLux {CITY[city_en]}' if city_en else {'IEPE': 'ΘΕΡΑΠΩΝ ΚΩΝΣΤΑΝΤΙΝΟΥ Ι.Ε.Π.Ε.', 'EUGMED': 'TC & AC EUGMED UNIT SERVICES LTD'}[company]
    gross = f'{tot.get("gross_total", 0):,.0f}'.replace(',', '.')
    notes = (f'Κοινωνικές Ασφαλίσεις (Κ.Α.) — εισφορές {label(k["month"])} · {who} · ΑΜΕ {j["ame"]} · '
             f'{len(j.get("employees") or [])} εργαζόμενοι, αποδοχές €{gross}. '
             f'Πληρώθηκε {j.get("paid_at_local")} ({kind} αρ. {j.get("payment_number")}). '
             f'Το PDF περιέχει: {kind} + Κατάσταση αποδοχών και εισφορών (portal Κ.Α.). '
             f'Το ποσό περιλαμβάνει εισφορές εργοδότη ΚΑΙ εργαζομένων (παρακράτηση από μισθούς) — εκτός ΦΠΑ. '
             f'Ημερομηνία εγγραφής = τέλος του μήνα εισφορών· η πληρωμή γίνεται τον επόμενο μήνα.')
    if company != books:
        notes += f' ⚠ ΑΛΛΗΣ ΕΤΑΙΡΕΙΑΣ ({who}) — πληρώθηκε από λογαριασμό της {CO_NAME[books]} → ενδοεταιρικό, για τον λογιστή.'
    if books != 'DERMLUX':
        notes += f' 📘 ΒΙΒΛΙΑ {CO_UP[books]} (λογαριασμός ···{OWN_ACC[books][-7:]}) — όχι έξοδο της DermLux.'
    if not t:
        notes += ' ⏳ Η κίνηση στην τράπεζα δεν έχει εισαχθεί ακόμα — θα δεθεί στην επόμενη εισαγωγή.'
    card = t and 'Card' in (t.get('description') or '')
    data = {
        'vendor': 'Υπηρεσίες Κοινωνικών Ασφαλίσεων', 'vatNumber': None, 'invoiceNumber': str(j.get('payment_number') or ''),
        'date': last_day(k['month']), 'net': k['amount'], 'vat': 0, 'vatRate': 0, 'total': k['amount'], 'currency': 'EUR',
        'category': '8136 · ΑΛΛΑ ΕΞΟΔΑ ΠΡΟΣΩΠΙΚΟΥ', 'location': CITY[city_en] if city_en else 'Γενικά',
        'paymentMethod': 'Κάρτα' if card else 'Τραπεζική', 'paymentSource': PAY_SRC[books],
        'paymentDetail': 'Κάρτα BoC (portal Κ.Α.)' if card else 'Άμεση χρέωση (πάγια εντολή Κ.Α.)',
        'docType': 'payment_receipt', 'lineItems': json.dumps(items, ensure_ascii=False), 'notes': notes,
        'kaMonth': k['month'], 'kaAme': j['ame'], 'kaCompany': company, 'kaPaymentNumber': str(j.get('payment_number') or ''),
        'kaPaidAt': j.get('paid_at'),
    }
    if company != books: data['intercompany'] = company
    if books != 'DERMLUX': data['books'] = books
    if t:
        data.update({'bankTagBank': t.get('bank') or 'Bank of Cyprus', 'bankTagDate': t['date'], 'bankTagDesc': t.get('description'),
                     'bankTagAmount': float(t['debit']), 'bankTagRef': t.get('ref')})
    sd = f'Κ.Α. {reg.replace("_", " ")} · μήνας {k["month"]} · {kind} αρ. {j.get("payment_number")} ({j["paid_at"][:10]})'
    if company != books: sd += f' · ⚠ ΑΛΛΗΣ ΕΤΑΙΡΕΙΑΣ — πληρώθηκε από {CO_NAME[books]} (ενδοεταιρικό)'
    return {'id': did, 'file': os.path.join(UP, fname), 'key': f'expenses/{fname}', 'fileName': fname, 'data': data,
            'tx': t['id'] if t else None, 'txSupportingDoc': sd, 'txSupportingDocFile': k['pay_pdf'].replace('\\', '/'),
            'reg': reg, 'month': k['month'], 'amount': k['amount'], 'books': books, 'own': company == books}


plan = {'book': [], 'tx_only': [], 'link_existing': [], 'skipped': [], 'not_booked': []}
EXIST = {e['id'] for e in exps if e['id'].startswith('ka_')}
ka_id = lambda k: 'ka_' + ''.join(ch for ch in k['j']['ame'] if ch.isdigit()) + '_' + k['month']
for t in tx:
    i = match.get(t['id'])
    linked = t.get('matchedExpenseIds') or t.get('matchedExpenseId')
    if i is None:
        plan['skipped'].append({'tx': t['id'], 'date': t['date'], 'amount': t['debit'], 'why': 'χωρίς βεβαίωση στο αρχείο'}); continue
    k = ka[i]
    if linked:
        if ka_id(k) not in EXIST:
            plan['skipped'].append({'tx': t['id'], 'date': t['date'], 'amount': t['debit'], 'why': f'ήδη δεμένη σε παραστατικό ({k["reg"][:20]} {k["month"]})'})
        continue
    if ka_id(k) in EXIST:                                      # καταχωρήθηκε σε προηγούμενο τρέξιμο πριν έρθει η κίνηση → τώρα δένεται
        b = build(k, t, ACC_BOOKS.get(t.get('account'), 'DERMLUX'))
        plan['link_existing'].append({'tx': t['id'], 'expense': ka_id(k), 'date': t['date'], 'amount': float(t['debit']),
                                      'desc': t.get('description'), 'bank': t.get('bank') or 'Bank of Cyprus', 'ref': t.get('ref'),
                                      'supportingDoc': None if t.get('supportingDoc') else b['txSupportingDoc'], 'supportingDocFile': b['txSupportingDocFile'],
                                      'matchMethod': f'bk_KA · {b["data"]["kaCompany"]} {b["data"]["kaAme"]} · μήνας {k["month"]} · αρ. {b["data"]["kaPaymentNumber"]}'})
        continue
    books = ACC_BOOKS.get(t.get('account'))
    if not books:                                              # άγνωστος λογαριασμός → μόνο δικαιολογητικό στην κίνηση
        b = build(k, t, 'DERMLUX')
        if not t.get('supportingDoc'):
            plan['tx_only'].append({'tx': t['id'], 'supportingDoc': b['txSupportingDoc'], 'supportingDocFile': b['txSupportingDocFile']})
        plan['not_booked'].append({'reg': k['reg'], 'month': k['month'], 'amount': k['amount'], 'why': f'λογαριασμός {t.get("account")} χωρίς βιβλία'})
        continue
    plan['book'].append(build(k, t, books))
# βεβαιώσεις DermLux χωρίς κίνηση ακόμα (πληρώθηκαν μετά την τελευταία εισαγωγή τράπεζας) → καταχώρηση χωρίς σύνδεση,
# δένονται στο επόμενο τρέξιμο (link_existing). Παλιότερες χωρίς κίνηση = άλλος λογαριασμός/εταιρεία → μόνο αναφορά.
last_bank = {co: max((t['date'] for t in bank if t.get('account') == acc), default='0000-00-00') for co, acc in OWN_ACC.items()}
for i, k in enumerate(ka):
    if i in used or ka_id(k) in EXIST: continue
    co = k['reg'].split('_')[0]
    if co in last_bank and last_bank[co] > '0000' and k['j']['paid_at'][:10] >= str(day(last_bank[co]) - datetime.timedelta(days=3)):
        plan['book'].append(build(k, None, co))
    else:
        plan['not_booked'].append({'reg': k['reg'], 'month': k['month'], 'amount': k['amount'], 'why': 'δεν υπάρχει κίνηση στους λογαριασμούς μας (άλλος λογαριασμός/εταιρεία)'})

json.dump(plan, open(os.path.join(OUT, 'book_plan.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
B = plan['book']
print('καταχωρήσεις:', len(B), '· με σύνδεση:', sum(1 for b in B if b['tx']), '· χωρίς (αναμένεται τράπεζα):', [(b['reg'][:16], b['month']) for b in B if not b['tx']])
print('ανά βιβλία/μητρώο:', collections.Counter((b['books'], b['data']['kaCompany']) for b in B), '· σύνολο €', round(sum(b['amount'] for b in B), 2))
print('ενδοεταιρικά €', round(sum(b['amount'] for b in B if not b['own']), 2))
print('μόνο δικαιολογητικό σε κίνηση ΙΕΠΕ:', len(plan['tx_only']), '· δέσιμο υπάρχοντος:', plan['link_existing'])
print('παραλείφθηκαν:', plan['skipped'])
print('δεν καταχωρούνται:', collections.Counter(n['why'][:40] for n in plan['not_booked']))
print('PDF:', len(os.listdir(UP)), 'αρχεία ·', round(sum(os.path.getsize(os.path.join(UP, f)) for f in os.listdir(UP)) / 1e6, 1), 'MB')
