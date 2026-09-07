/**
 * Canonicalises supplier + product names, then emits a self-contained
 * HTML price book: C:/Users/User/dermlux-price-book.html
 */
import { readFileSync, writeFileSync } from 'fs'
const raw = JSON.parse(readFileSync('C:/Users/User/consumables.json', 'utf8'))

// ---- canonical supplier names -------------------------------------------
const SUP = [
  [/IMPOPHAR/i, 'Impophar'],
  [/PROC?[IO]?OPIOU|PROCIOPIOU/i, 'Procopiou Medishop'],
  [/K\s*&?\s*N\s*MEDICAL|^K&N/i, 'K&N Medical'],
  [/ANEMOS/i, 'E.G. Anemos Hygiene'],
  [/MJ\s*MEDISCIENCE/i, 'MJ Mediscience'],
  [/HEALTHPRO|ORPHANOS/i, 'Healthpro / Orphanos'],
  [/IAS\s*BEAUTY/i, 'IAS Beauty Suppliers'],
  [/E.?\s?FILLERS/i, 'E-Fillers'],
  [/ARMAD/i, 'Armad'],
  [/KARPASIA|GJK\s*HEALTH/i, 'Karpasia Pharmacy'],
  [/PANAYI/i, 'Andreas Panayi Medical'],
  [/IDEAL\s*YOU/i, 'Ideal You'],
  [/NICOLAOU\s*PHARMACY|G\.\s*NICOLAOU/i, 'G. Nicolaou Pharmacy'],
  [/HEBE/i, 'Hebe Medicare'],
  [/ELYSIA/i, 'Elysia'],
  [/POUCAN/i, 'Poucan'],
  [/DIRECT\s*DERMA/i, 'Direct Derma Supplies'],
  [/ROYAL\s*GEMS/i, 'Royal Gems'],
  [/DERMIS/i, 'Dermis Ltd'],
]
const canonSup = v => { for (const [re, n] of SUP) if (re.test(v)) return n; return (v || '—').trim() }

// ---- canonical product key (collapses OCR noise) -------------------------
const canonProd = s => String(s).toUpperCase()
  .replace(/\b\d{3,4}\b(?=\s*$)/, '')            // trailing batch codes e.g. "0622"
  .replace(/\bLOT\s*NO?\b.*$/i, '')
  .replace(/[^A-Z0-9%.,& ]/g, ' ')
  .replace(/\s+/g, ' ').trim()
// tiny OCR fixes seen in the data
const FIX = [[/SKINKETIN/g, 'SKINRETIN'], [/PROFHILO 0\.3%/g, 'PROFHILO 3.2%'], [/PROFHILO 3,2%/g, 'PROFHILO 3.2%']]
const fixName = s => FIX.reduce((a, [re, r]) => a.replace(re, r), s)

const merged = {}
for (const p of raw) {
  const key = canonProd(fixName(p.name))
  merged[key] ??= { name: fixName(p.name), key, buys: [], qty: 0, spend: 0 }
  const m = merged[key]
  m.qty += p.qty; m.spend += p.spend
  for (const b of p.buys) m.buys.push({ ...b, v: canonSup(b.v) })
  // keep the fullest label, but never one that is just the "free goods" variant
  const bad = /ΔΩΡΕΑΝ|\bFREE\b/i
  if (bad.test(m.name) && !bad.test(p.name)) m.name = fixName(p.name)
  else if (!bad.test(fixName(p.name)) && p.name.length > m.name.length) m.name = fixName(p.name)
}

const items = []
for (const m of Object.values(merged)) {
  m.buys.sort((a, b) => (a.d || '').localeCompare(b.d || ''))
  const priced = m.buys.filter(b => b.u != null && b.u > 0)
  const free = m.buys.filter(b => b.u === 0).reduce((s, b) => s + (b.q || 0), 0)
  const first = priced[0], last = priced[priced.length - 1]
  const sups = {}
  for (const b of m.buys) sups[b.v] = (sups[b.v] || 0) + 1
  const eff = m.qty > 0 ? m.spend / m.qty : null
  const discBuy = [...m.buys].reverse().find(b => b.disc && b.disc > 0 && b.disc < 100)
  items.push({
    name: m.name,
    qty: Math.round(m.qty * 100) / 100,
    spend: Math.round(m.spend * 100) / 100,
    unit: last ? Math.round(last.u * 100) / 100 : null,
    eff: eff != null ? Math.round(eff * 100) / 100 : null,
    free: Math.round(free * 100) / 100,
    list: discBuy?.list ?? null,
    disc: discBuy?.disc ?? null,
    // a >3× swing almost always means one line recorded the WHOLE invoice as 1 unit,
    // not a real price move — surface it as a data-quality flag instead of a fake trend
    move: (first && last && first !== last && first.u > 0 && last.u / first.u < 3 && first.u / last.u < 3)
      ? (Math.abs(last.u - first.u) / first.u < 0.005 ? null : Math.round(((last.u - first.u) / first.u) * 1000) / 10)
      : null,
    odd: !!(first && last && (last.u / first.u >= 3 || first.u / last.u >= 3)),
    from: first?.d || '', to: last?.d || '',
    sups: Object.entries(sups).sort((a, b) => b[1] - a[1]).map(([v]) => v),
    orders: m.buys.length,
    h: m.buys.filter(b => b.d).map(b => [b.d.slice(2, 7), b.q, b.u == null ? null : Math.round(b.u * 100) / 100, b.v, b.disc || 0]),
  })
}
items.sort((a, b) => b.spend - a.spend)

const totSpend = items.reduce((s, p) => s + p.spend, 0)
const supTot = {}
for (const p of items) for (const b of p.h) supTot[b[3]] = (supTot[b[3]] || 0) + (b[1] * (b[2] || 0))
const topSup = Object.entries(supTot).sort((a, b) => b[1] - a[1]).slice(0, 12)
const nFree = items.filter(p => p.free > 0).length
const nUp = items.filter(p => p.move > 2).length
const nDown = items.filter(p => p.move < -2).length
const savedFree = items.filter(p => p.free > 0).reduce((s, p) => s + p.free * (p.unit || 0), 0)

const DATA = { items, topSup, meta: { totSpend, nProd: items.length, nSup: Object.keys(supTot).length, nFree, nUp, nDown, savedFree } }

const html = `<title>DermLux — Τιμοκατάλογος Αναλωσίμων</title>
<style>
:root{
  --paper:#f4f7f6; --surface:#ffffff; --sunk:#eaf0ee;
  --ink:#122019; --ink-2:#3d524b; --muted:#6d827a; --line:#d5e0db;
  --accent:#0d6e63; --accent-soft:#d8ebe7;
  --up:#a8410f; --up-bg:#fbe9df; --down:#1f6b3a; --down-bg:#ddf0e3; --free:#0d6e63;
}
@media (prefers-color-scheme:dark){:root{
  --paper:#0b120f; --surface:#131d19; --sunk:#0f1815;
  --ink:#e6efea; --ink-2:#b3c6bf; --muted:#7e938b; --line:#26352f;
  --accent:#4fbfae; --accent-soft:#123330;
  --up:#f0a377; --up-bg:#3a2318; --down:#7ddba0; --down-bg:#14301f;--free:#4fbfae;
}}
:root[data-theme=light]{
  --paper:#f4f7f6; --surface:#ffffff; --sunk:#eaf0ee; --ink:#122019; --ink-2:#3d524b;
  --muted:#6d827a; --line:#d5e0db; --accent:#0d6e63; --accent-soft:#d8ebe7;
  --up:#a8410f; --up-bg:#fbe9df; --down:#1f6b3a; --down-bg:#ddf0e3; --free:#0d6e63;
}
:root[data-theme=dark]{
  --paper:#0b120f; --surface:#131d19; --sunk:#0f1815; --ink:#e6efea; --ink-2:#b3c6bf;
  --muted:#7e938b; --line:#26352f; --accent:#4fbfae; --accent-soft:#123330;
  --up:#f0a377; --up-bg:#3a2318; --down:#7ddba0; --down-bg:#14301f; --free:#4fbfae;
}
*{box-sizing:border-box}
body{margin:0;background:var(--paper);color:var(--ink);
  font-family:ui-sans-serif,"Segoe UI",system-ui,-apple-system,sans-serif;
  font-size:15px;line-height:1.5;-webkit-font-smoothing:antialiased}
.wrap{max-width:1220px;margin:0 auto;padding:34px 20px 90px}
h1{font-size:clamp(26px,3.4vw,38px);line-height:1.08;margin:0;letter-spacing:-.022em;font-weight:800;text-wrap:balance}
.sub{color:var(--muted);margin:9px 0 0;max-width:62ch}
.eyebrow{font-size:11.5px;letter-spacing:.15em;text-transform:uppercase;color:var(--accent);font-weight:700;margin:0 0 10px}
.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(158px,1fr));gap:12px;margin:28px 0 8px}
.kpi{background:var(--surface);border:1px solid var(--line);border-radius:10px;padding:14px 16px}
.kpi .v{font-size:25px;font-weight:800;letter-spacing:-.02em;font-variant-numeric:tabular-nums}
.kpi .l{font-size:12px;color:var(--muted);margin-top:3px}
.kpi.hl{background:var(--accent-soft);border-color:transparent}
.kpi.hl .v{color:var(--accent)}
h2{font-size:15px;letter-spacing:.06em;text-transform:uppercase;color:var(--ink-2);
  margin:38px 0 12px;font-weight:700;border-bottom:1px solid var(--line);padding-bottom:8px}
.supgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:8px}
.suprow{display:flex;align-items:baseline;justify-content:space-between;gap:10px;
  background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:9px 12px;font-size:13.5px}
.suprow b{font-variant-numeric:tabular-nums;white-space:nowrap}
.bar{height:3px;background:var(--accent);border-radius:2px;margin-top:6px}
.tools{position:sticky;top:0;z-index:5;background:var(--paper);padding:12px 0;
  display:flex;gap:9px;flex-wrap:wrap;align-items:center;border-bottom:1px solid var(--line);margin-bottom:2px}
input[type=search],select{font:inherit;font-size:14px;padding:8px 11px;border:1px solid var(--line);
  border-radius:8px;background:var(--surface);color:var(--ink)}
input[type=search]{flex:1 1 240px;min-width:180px}
input:focus-visible,select:focus-visible,button:focus-visible,tr:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.tblwrap{overflow-x:auto;border:1px solid var(--line);border-radius:10px;background:var(--surface);margin-top:14px}
table{border-collapse:collapse;width:100%;min-width:830px;font-size:13.5px}
th{text-align:left;font-size:11px;letter-spacing:.07em;text-transform:uppercase;color:var(--muted);
  font-weight:700;padding:11px 12px;border-bottom:1px solid var(--line);background:var(--sunk);
  cursor:pointer;white-space:nowrap;user-select:none}
th.n,td.n{text-align:right;font-variant-numeric:tabular-nums}
td{padding:10px 12px;border-bottom:1px solid var(--line);vertical-align:top}
tbody tr:last-child td{border-bottom:0}
tbody tr.p{cursor:pointer}
tbody tr.p:hover{background:var(--sunk)}
.pname{font-weight:600;line-height:1.32}
.psup{color:var(--muted);font-size:12px;margin-top:2px}
.tag{display:inline-block;font-size:11px;font-weight:700;padding:2px 7px;border-radius:999px;white-space:nowrap}
.t-up{background:var(--up-bg);color:var(--up)} .t-down{background:var(--down-bg);color:var(--down)}
.t-free{background:var(--accent-soft);color:var(--free)}
.eff{font-weight:800}
.strike{color:var(--muted);text-decoration:line-through;font-size:12px}
.hist{background:var(--sunk)}
.hist td{padding:0 12px 12px}
.hist table{min-width:0;width:auto;font-size:12.5px}
.hist th{position:static;background:transparent;padding:7px 14px 5px 0;border-bottom:1px solid var(--line);cursor:default}
.hist td{padding:5px 14px 5px 0;border:0}
.empty{padding:34px;text-align:center;color:var(--muted)}
footer{margin-top:40px;padding-top:16px;border-top:1px solid var(--line);color:var(--muted);font-size:12.5px}
@media (max-width:640px){.wrap{padding:22px 13px 70px}}
</style>

<div class="wrap">
  <p class="eyebrow">DermLux Laser &amp; Aesthetics · Λογιστικά</p>
  <h1>Τιμοκατάλογος αναλωσίμων</h1>
  <p class="sub">Κάθε αναλώσιμο που αγοράσαμε, με την <strong>πραγματική</strong> τιμή μονάδας —
     αφού μετρηθούν οι εκπτώσεις και τα δωρεάν τεμάχια. Από <span id="span"></span>.
     Κλικ σε γραμμή για το ιστορικό αγορών.</p>

  <div class="kpis" id="kpis"></div>

  <h2>Πού πάνε τα λεφτά — προμηθευτές</h2>
  <div class="supgrid" id="sup"></div>

  <h2>Προϊόντα</h2>
  <div class="tools">
    <input type="search" id="q" placeholder="Αναζήτηση προϊόντος… (π.χ. PRX, profhilo, βελόνες)" aria-label="Αναζήτηση προϊόντος">
    <select id="fs" aria-label="Φίλτρο προμηθευτή"><option value="">Όλοι οι προμηθευτές</option></select>
    <select id="ff" aria-label="Φίλτρο">
      <option value="">Όλα τα προϊόντα</option>
      <option value="free">Μόνο με δωρεάν τεμάχια</option>
      <option value="disc">Μόνο με έκπτωση %</option>
      <option value="up">Μόνο όσα ακρίβυναν</option>
      <option value="down">Μόνο όσα φθήνυναν</option>
      <option value="odd">Μόνο ασυνεπή δεδομένα</option>
    </select>
  </div>
  <div class="tblwrap">
    <table>
      <thead><tr>
        <th data-s="name">Προϊόν</th>
        <th data-s="qty" class="n">Τεμ.</th>
        <th data-s="unit" class="n">Τιμή μον.</th>
        <th data-s="eff" class="n">Πραγματική</th>
        <th data-s="move" class="n">Μεταβολή</th>
        <th data-s="spend" class="n">Δαπάνη</th>
      </tr></thead>
      <tbody id="tb"></tbody>
    </table>
  </div>
  <p class="empty" id="none" hidden>Κανένα προϊόν δεν ταιριάζει.</p>

  <footer id="foot"></footer>
</div>

<script>
const D = ${JSON.stringify(DATA)};
const eur = n => '€' + (n==null ? '—' : n.toLocaleString('el-GR',{minimumFractionDigits:2,maximumFractionDigits:2}));
const eur0 = n => '€' + Math.round(n).toLocaleString('el-GR');

const m = D.meta;
document.getElementById('kpis').innerHTML = [
  ['hl', eur0(m.totSpend), 'συνολική δαπάνη αναλωσίμων'],
  ['', m.nProd, 'ξεχωριστά προϊόντα'],
  ['', m.nSup, 'προμηθευτές'],
  ['', eur0(m.savedFree), 'αξία δωρεάν τεμαχίων'],
  ['', m.nUp, 'προϊόντα ακρίβυναν'],
  ['', m.nDown, 'προϊόντα φθήνυναν'],
].map(([c,v,l]) => '<div class="kpi '+c+'"><div class="v">'+v+'</div><div class="l">'+l+'</div></div>').join('');

const maxSup = D.topSup[0][1];
document.getElementById('sup').innerHTML = D.topSup.map(([v,s]) =>
  '<div><div class="suprow"><span>'+v+'</span><b>'+eur0(s)+'</b></div>'+
  '<div class="bar" style="width:'+Math.max(6,(s/maxSup*100))+'%"></div></div>').join('');

const allSup = [...new Set(D.items.flatMap(p=>p.sups))].sort((a,b)=>a.localeCompare(b,'el'));
document.getElementById('fs').insertAdjacentHTML('beforeend',
  allSup.map(s=>'<option>'+s+'</option>').join(''));

const TODAY='2026-08-01';
const allD = D.items.flatMap(p=>[p.from,p.to]).filter(Boolean).sort();
const okD  = allD.filter(d=>d>='2024-01-01' && d<=TODAY);
const badD = allD.filter(d=>d<'2024-01-01' || d>TODAY);
document.getElementById('span').textContent = okD[0] + ' έως ' + okD[okD.length-1];
if(badD.length) document.getElementById('span').insertAdjacentHTML('afterend',
  ' <span class="tag t-up" title="Ημερομηνίες εκτός λογικού εύρους — λάθος ανάγνωση σε παλιά τιμολόγια">'
  + badD.length + ' ύποπτες ημερομηνίες</span>');

let sortKey='spend', sortDir=-1, open=new Set();
const q=document.getElementById('q'), fs=document.getElementById('fs'), ff=document.getElementById('ff');

function rows(){
  const t=q.value.trim().toLowerCase(), sv=fs.value, fv=ff.value;
  return D.items.filter(p=>{
    if(t && !p.name.toLowerCase().includes(t) && !p.sups.join(' ').toLowerCase().includes(t)) return false;
    if(sv && !p.sups.includes(sv)) return false;
    if(fv==='free' && !(p.free>0)) return false;
    if(fv==='disc' && !p.disc) return false;
    if(fv==='up' && !(p.move>2)) return false;
    if(fv==='down' && !(p.move<-2)) return false;
    if(fv==='odd' && !p.odd) return false;
    return true;
  }).sort((a,b)=>{
    const x=a[sortKey], y=b[sortKey];
    if(typeof x==='string') return x.localeCompare(y,'el')*sortDir*-1;
    return ((x==null?-Infinity:x)-(y==null?-Infinity:y))*sortDir;
  });
}
function render(){
  const list=rows();
  document.getElementById('none').hidden = list.length>0;
  document.getElementById('tb').innerHTML = list.map((p,i)=>{
    const id='r'+D.items.indexOf(p);
    const tags=[];
    if(p.free>0) tags.push('<span class="tag t-free">'+p.free+' δωρεάν</span>');
    if(p.disc) tags.push('<span class="tag t-free">−'+p.disc+'%</span>');
    if(p.odd) tags.push('<span class="tag t-up" title="Μια γραμμή κατέγραψε όλο το τιμολόγιο ως 1 τεμάχιο — θέλει έλεγχο">ασυνεπή δεδομένα</span>');
    const move = p.move==null ? '—'
      : '<span class="tag '+(p.move>0?'t-up':'t-down')+'">'+(p.move>0?'▲':'▼')+' '+Math.abs(p.move)+'%</span>';
    const eff = (p.eff!=null && p.unit!=null && Math.abs(p.eff-p.unit)>0.01)
      ? '<span class="eff">'+eur(p.eff)+'</span>' : '<span class="eff">'+eur(p.eff)+'</span>';
    const listp = p.list ? '<div class="strike">'+eur(p.list)+'</div>' : '';
    let out='<tr class="p" tabindex="0" data-id="'+id+'">'+
      '<td><div class="pname">'+p.name+' '+tags.join(' ')+'</div>'+
        '<div class="psup">'+p.sups.slice(0,3).join(' · ')+' · '+p.orders+' παραγγελίες</div></td>'+
      '<td class="n">'+p.qty+'</td>'+
      '<td class="n">'+eur(p.unit)+listp+'</td>'+
      '<td class="n">'+eff+'</td>'+
      '<td class="n">'+move+'</td>'+
      '<td class="n">'+eur0(p.spend)+'</td></tr>';
    if(open.has(id)){
      out+='<tr class="hist"><td colspan="6"><table><thead><tr>'+
        '<th>Ημ/νία</th><th>Τεμ.</th><th>Τιμή μον.</th><th>Έκπτ.</th><th>Προμηθευτής</th></tr></thead><tbody>'+
        p.h.map(b=>'<tr><td>'+b[0]+'</td><td class="n">'+b[1]+'</td><td class="n">'+
          (b[2]==null?'—':eur(b[2]))+'</td><td class="n">'+(b[4]?('−'+b[4]+'%'):'—')+'</td><td>'+b[3]+'</td></tr>').join('')+
        '</tbody></table></td></tr>';
    }
    return out;
  }).join('');
}
document.getElementById('tb').addEventListener('click', e=>{
  const tr=e.target.closest('tr.p'); if(!tr) return;
  const id=tr.dataset.id; open.has(id)?open.delete(id):open.add(id); render();
});
document.getElementById('tb').addEventListener('keydown', e=>{
  if(e.key!=='Enter'&&e.key!==' ') return;
  const tr=e.target.closest('tr.p'); if(!tr) return; e.preventDefault();
  const id=tr.dataset.id; open.has(id)?open.delete(id):open.add(id); render();
});
document.querySelectorAll('th[data-s]').forEach(th=>th.addEventListener('click',()=>{
  const k=th.dataset.s;
  if(sortKey===k) sortDir*=-1; else {sortKey=k; sortDir=-1;}
  render();
}));
[q,fs,ff].forEach(el=>el.addEventListener('input',render));
document.getElementById('foot').textContent =
  'Παράχθηκε από ' + D.items.reduce((s,p)=>s+p.orders,0) + ' γραμμές τιμολογίων στη βάση «expenses» της πλατφόρμας waitlist. '+
  'Η «πραγματική» τιμή = συνολική δαπάνη ÷ συνολικά τεμάχια, οπότε ενσωματώνει εκπτώσεις και δωρεάν τεμάχια. '+
  'Η «μεταβολή» συγκρίνει την πρώτη με την τελευταία τιμή που πληρώσαμε.';
render();
</script>`

writeFileSync('C:/Users/User/dermlux-price-book.html', html)
console.log(`γράφτηκε dermlux-price-book.html — ${items.length} προϊόντα, €${totSpend.toFixed(0)}, ${Object.keys(supTot).length} προμηθευτές`)
console.log(`\nTOP 12 μετά την ενοποίηση:`)
for (const p of items.slice(0, 12)) console.log(' ', ('€' + p.spend.toFixed(0)).padStart(8), ('×' + p.qty).padStart(7), p.name.slice(0, 42).padEnd(42), 'μον', p.unit, 'πραγμ', p.eff, p.move ? (p.move > 0 ? '↑' : '↓') + Math.abs(p.move) + '%' : '')
