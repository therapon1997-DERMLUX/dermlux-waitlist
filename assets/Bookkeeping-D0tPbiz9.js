import{r as c,j as e,v as ne,u as le,q as oe,e as ie,c as ce,o as de,a as xe,d as ge,b as J}from"./index-DXMEiC7R.js";import{L as se,C as I,E as pe}from"./ExpenseModal-DbOFP1B_.js";import{a as Q}from"./BankChip-CJR7J1Wo.js";const Z="  https://empty-hall-968f.therapon1997.workers.dev",y=l=>"€"+(Number(l)||0).toLocaleString("el-CY",{minimumFractionDigits:2,maximumFractionDigits:2}),G=l=>{if(!l)return"—";const[i,x,m]=l.split("-"),k=["Ιαν","Φεβ","Μαρ","Απρ","Μαΐ","Ιουν","Ιουλ","Αυγ","Σεπ","Οκτ","Νοε","Δεκ"];return`${parseInt(m)} ${k[parseInt(x)-1]} ${i}`};async function me(l){var i;if(!l||!Z)return null;try{const x=await((i=ne().currentUser)==null?void 0:i.getIdToken());if(!x)return null;const m=await fetch(`${Z}/invoices/${encodeURIComponent(l)}`,{headers:{Authorization:`Bearer ${x}`}});if(!m.ok)return null;const k=await m.blob();return new Promise(h=>{const g=new FileReader;g.onload=()=>h(g.result),g.onerror=()=>h(null),g.readAsDataURL(k)})}catch{return null}}function he({expenses:l,dateFrom:i,dateTo:x,cats:m,loc:k,imageMap:h}){const g={total:0,vat:0,net:0},f={};for(const r of l)g.total+=Number(r.total)||0,g.vat+=Number(r.vat)||0,g.net+=Number(r.net)||0,f[r.category]=(f[r.category]||0)+(Number(r.total)||0);const v=Object.entries(f).sort((r,p)=>p[1]-r[1]),z=v.map(([r])=>({cat:r,rows:l.filter(p=>(p.category||"")===r)})),N=new Date().toLocaleDateString("el-GR",{day:"2-digit",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"}),O=[i||x?`${i||"…"} – ${x||"…"}`:"",m.length?m.join(", "):"",k||""].filter(Boolean).join(" · ")||"Όλα",j=z.map(({cat:r,rows:p})=>`
    <tr class="cat-header">
      <td colspan="6">${r}</td>
      <td class="num bold">${y(p.reduce((u,E)=>u+(Number(E.total)||0),0))}</td>
    </tr>
    ${p.map(u=>`
    <tr>
      <td>${G(u.date)}</td>
      <td>${u.vendor||"—"}</td>
      <td class="muted">${u.invoiceNumber||""}</td>
      <td class="muted">${u.notes||""}</td>
      <td class="num">${u.net!=null?y(u.net):"—"}</td>
      <td class="num amber">${u.vat!=null?y(u.vat):"—"}${u.vatRate!=null?`<span class="rate"> ${u.vatRate}%</span>`:""}</td>
      <td class="num bold">${y(u.total)}</td>
    </tr>`).join("")}
  `).join(""),_=l.filter(r=>h[r.id]).map(r=>`
    <div class="receipt-page">
      <div class="receipt-header">
        <div>
          <div class="receipt-vendor">${r.vendor||"—"}</div>
          <div class="receipt-meta">${G(r.date)}${r.invoiceNumber?" · #"+r.invoiceNumber:""}</div>
          <div class="receipt-cat">${r.category||""}</div>
        </div>
        <div class="receipt-amounts">
          <div class="receipt-total">${y(r.total)}</div>
          ${r.vat!=null?`<div class="receipt-vat">ΦΠΑ ${y(r.vat)}${r.vatRate!=null?` (${r.vatRate}%)`:""}</div>`:""}
          ${r.net!=null?`<div class="receipt-net">Καθαρό ${y(r.net)}</div>`:""}
        </div>
      </div>
      <div class="receipt-img-wrap">
        <img src="${h[r.id]}" alt="Αποδεικτικό ${r.vendor||""}" />
      </div>
    </div>
  `).join(""),w=l.filter(r=>!h[r.id]).map(r=>`<li>${G(r.date)} · <strong>${r.vendor||"—"}</strong> · ${y(r.total)}</li>`).join("");return`<!DOCTYPE html>
<html lang="el">
<head>
<meta charset="utf-8">
<title>Έκθεση Εξόδων — Dermlux</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11px; color: #1a1a1a; background: #fff; }

  /* ── Cover / Header ── */
  .cover { padding: 36px 40px 28px; border-bottom: 3px solid #16a34a; margin-bottom: 28px; }
  .cover-brand { font-size: 22px; font-weight: 700; color: #16a34a; letter-spacing: .5px; }
  .cover-title  { font-size: 16px; font-weight: 600; color: #222; margin-top: 6px; }
  .cover-meta   { font-size: 10px; color: #666; margin-top: 4px; }
  .cover-totals { display: flex; gap: 32px; margin-top: 20px; }
  .cover-stat   { }
  .cover-stat .val  { font-size: 20px; font-weight: 700; color: #111; }
  .cover-stat .lbl  { font-size: 9px; text-transform: uppercase; letter-spacing: .6px; color: #888; margin-top: 1px; }

  /* ── Summary table ── */
  h2 { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .6px;
       color: #16a34a; margin: 24px 40px 10px; }
  table { width: calc(100% - 80px); margin: 0 40px; border-collapse: collapse; }
  th { font-size: 9px; text-transform: uppercase; letter-spacing: .5px; color: #888;
       border-bottom: 1px solid #ddd; padding: 5px 6px; text-align: left; }
  td { padding: 5px 6px; border-bottom: 1px solid #f0f0f0; vertical-align: top; }
  .num { text-align: right; }
  .bold { font-weight: 600; }
  .amber { color: #b45309; }
  .muted { color: #777; font-size: 10px; }
  .rate { color: #aaa; font-size: 9px; }
  tr.cat-header td { background: #f0fdf4; font-weight: 700; font-size: 10.5px;
                     color: #166534; padding: 6px 6px; border-top: 1px solid #bbf7d0;
                     border-bottom: 1px solid #bbf7d0; }
  .grand-total { width: calc(100% - 80px); margin: 10px 40px 0; display: flex;
                 justify-content: flex-end; padding: 8px 6px; border-top: 2px solid #16a34a;
                 gap: 16px; font-weight: 700; font-size: 12px; }

  /* ── Category bars ── */
  .cat-bars { margin: 16px 40px; }
  .cat-bar-row { display: flex; align-items: center; gap: 10px; margin-bottom: 5px; }
  .cat-bar-label { width: 200px; font-size: 10px; color: #444; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .cat-bar-track { flex: 1; height: 8px; background: #f0f0f0; border-radius: 4px; overflow: hidden; }
  .cat-bar-fill  { height: 100%; background: #16a34a; border-radius: 4px; }
  .cat-bar-val   { width: 80px; text-align: right; font-size: 10px; font-weight: 600; color: #333; }

  /* ── No-receipt list ── */
  .no-receipt-section { margin: 20px 40px; padding: 12px 16px; background: #fafafa;
                         border: 1px solid #e5e5e5; border-radius: 6px; }
  .no-receipt-section h3 { font-size: 10px; font-weight: 600; color: #888; text-transform: uppercase;
                           letter-spacing: .5px; margin-bottom: 8px; }
  .no-receipt-section ul { list-style: none; display: flex; flex-direction: column; gap: 3px; }
  .no-receipt-section li { font-size: 10px; color: #555; }

  /* ── Receipt pages ── */
  .receipt-page { page-break-before: always; padding: 28px 40px; }
  .receipt-header { display: flex; justify-content: space-between; align-items: flex-start;
                    padding-bottom: 14px; border-bottom: 2px solid #16a34a; margin-bottom: 18px; }
  .receipt-vendor { font-size: 16px; font-weight: 700; color: #111; }
  .receipt-meta   { font-size: 11px; color: #666; margin-top: 3px; }
  .receipt-cat    { font-size: 10px; color: #16a34a; font-weight: 600; margin-top: 3px; }
  .receipt-amounts { text-align: right; }
  .receipt-total  { font-size: 20px; font-weight: 700; color: #111; }
  .receipt-vat    { font-size: 11px; color: #b45309; margin-top: 2px; }
  .receipt-net    { font-size: 11px; color: #555; }
  .receipt-img-wrap { display: flex; justify-content: center; }
  .receipt-img-wrap img { max-width: 100%; max-height: 240mm; object-fit: contain; border: 1px solid #eee; border-radius: 4px; }

  @media print {
    @page { size: A4; margin: 0; }
    .no-print { display: none !important; }
  }
</style>
</head>
<body>

<!-- Cover -->
<div class="cover">
  <div class="cover-brand">DERMLUX LASER &amp; AESTHETICS LTD</div>
  <div class="cover-title">Έκθεση Εξόδων</div>
  <div class="cover-meta">Φίλτρα: ${O} &nbsp;·&nbsp; Δημιουργήθηκε: ${N}</div>
  <div class="cover-totals">
    <div class="cover-stat"><div class="val">${y(g.total)}</div><div class="lbl">Σύνολο εξόδων</div></div>
    <div class="cover-stat"><div class="val">${y(g.vat)}</div><div class="lbl">ΦΠΑ (input)</div></div>
    <div class="cover-stat"><div class="val">${y(g.net)}</div><div class="lbl">Καθαρό</div></div>
    <div class="cover-stat"><div class="val">${l.length}</div><div class="lbl">Παραστατικά</div></div>
    <div class="cover-stat"><div class="val">${Object.keys(h).length}</div><div class="lbl">Με αποδεικτικό</div></div>
  </div>
</div>

<!-- Category bars -->
<h2>Ανά Κατηγορία</h2>
<div class="cat-bars">
  ${v.map(([r,p])=>`
  <div class="cat-bar-row">
    <div class="cat-bar-label">${r}</div>
    <div class="cat-bar-track"><div class="cat-bar-fill" style="width:${Math.round(p/v[0][1]*100)}%"></div></div>
    <div class="cat-bar-val">${y(p)}</div>
  </div>`).join("")}
</div>

<!-- Summary table -->
<h2>Αναλυτική Κατάσταση</h2>
<table>
  <thead>
    <tr>
      <th>Ημερομηνία</th>
      <th>Προμηθευτής</th>
      <th>Αρ. Τιμολογίου</th>
      <th>Σημειώσεις</th>
      <th class="num">Καθαρό</th>
      <th class="num">ΦΠΑ</th>
      <th class="num">Σύνολο</th>
    </tr>
  </thead>
  <tbody>
    ${j}
  </tbody>
</table>
<div class="grand-total">
  <span>Καθαρό: ${y(g.net)}</span>
  <span>ΦΠΑ: ${y(g.vat)}</span>
  <span>Σύνολο: ${y(g.total)}</span>
</div>

${w?`
<div class="no-receipt-section">
  <h3>Χωρίς αποδεικτικό (${l.length-Object.keys(h).length})</h3>
  <ul>${w}</ul>
</div>`:""}

${_}

</body>
</html>`}function ue({expenses:l}){const[i,x]=c.useState(!1),[m,k]=c.useState(""),[h,g]=c.useState(""),[f,v]=c.useState([]),[z,N]=c.useState(""),[O,j]=c.useState(!1),[_,w]=c.useState(""),r=c.useMemo(()=>l.filter(o=>!(m&&o.date<m||h&&o.date>h||f.length&&!f.includes(o.category)||z&&o.location!==z)),[l,m,h,f,z]),p=r.filter(o=>o.fileUrl).length;function u(o){v(C=>C.includes(o)?C.filter(M=>M!==o):[...C,o])}async function E(){j(!0);const o={},C=r.filter(L=>L.fileUrl);for(let L=0;L<C.length;L++){const H=C[L];w(`Φόρτωση αποδείξεων ${L+1}/${C.length}…`);const B=await me(H.fileUrl);B&&(o[H.id]=B)}w(""),j(!1);const M=he({expenses:r,dateFrom:m,dateTo:h,cats:f,loc:z,imageMap:o}),P=window.open("","_blank");P.document.write(M),P.document.close(),setTimeout(()=>P.print(),800)}const F="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white w-full";return i?e.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4",children:e.jsxs("div",{className:"bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col",children:[e.jsxs("div",{className:"flex items-center justify-between px-6 py-4 border-b border-gray-100",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-base font-bold text-gray-800",children:"Εκτύπωση / Export PDF"}),e.jsx("p",{className:"text-xs text-gray-400 mt-0.5",children:"Report + αποδείξεις 1-1 σε πλήρη ανάλυση"})]}),e.jsx("button",{onClick:()=>x(!1),className:"text-gray-400 hover:text-gray-600 text-xl leading-none",children:"×"})]}),e.jsxs("div",{className:"flex-1 overflow-y-auto px-6 py-4 space-y-5",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2",children:"Εύρος ημερομηνιών"}),e.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[e.jsxs("div",{children:[e.jsx("label",{className:"text-xs text-gray-400 mb-1 block",children:"Από"}),e.jsx("input",{type:"date",className:F,value:m,onChange:o=>k(o.target.value)})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-xs text-gray-400 mb-1 block",children:"Έως"}),e.jsx("input",{type:"date",className:F,value:h,onChange:o=>g(o.target.value)})]})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2",children:"Τοποθεσία"}),e.jsxs("select",{className:F,value:z,onChange:o=>N(o.target.value),children:[e.jsx("option",{value:"",children:"Όλες"}),se.map(o=>e.jsx("option",{value:o,children:o},o))]})]}),e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center justify-between mb-2",children:[e.jsx("label",{className:"text-xs font-semibold text-gray-500 uppercase tracking-wide",children:"Κατηγορίες"}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx("button",{onClick:()=>v([...I]),className:"text-xs text-green-600 hover:underline",children:"Όλες"}),e.jsx("span",{className:"text-gray-300",children:"·"}),e.jsx("button",{onClick:()=>v([]),className:"text-xs text-gray-400 hover:underline",children:"Καμία"})]})]}),e.jsx("div",{className:"grid grid-cols-1 gap-1 max-h-48 overflow-y-auto border border-gray-100 rounded-lg p-2",children:I.map(o=>e.jsxs("label",{className:"flex items-center gap-2 px-1 py-0.5 rounded hover:bg-gray-50 cursor-pointer",children:[e.jsx("input",{type:"checkbox",checked:f.includes(o),onChange:()=>u(o),className:"accent-green-600 w-3.5 h-3.5"}),e.jsx("span",{className:"text-xs text-gray-700",children:o})]},o))}),e.jsx("p",{className:"text-xs text-gray-400 mt-1",children:f.length===0?"Όλες οι κατηγορίες":`${f.length} επιλεγμένες`})]})]}),e.jsxs("div",{className:"px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl",children:[e.jsxs("div",{className:"flex items-center justify-between mb-3",children:[e.jsxs("div",{className:"text-sm text-gray-600",children:[e.jsx("span",{className:"font-bold text-gray-800",children:r.length})," παραστατικά",p>0&&e.jsxs("span",{className:"text-green-600 ml-2",children:["· ",p," με αποδεικτικό"]}),r.length-p>0&&e.jsxs("span",{className:"text-gray-400 ml-2",children:["· ",r.length-p," χωρίς"]})]}),e.jsx("div",{className:"text-sm font-bold text-gray-800",children:"€"+r.reduce((C,M)=>C+(Number(M.total)||0),0).toLocaleString("el-CY",{minimumFractionDigits:2,maximumFractionDigits:2})})]}),O?e.jsxs("div",{className:"flex items-center gap-3 justify-center py-2",children:[e.jsx("div",{className:"w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"}),e.jsx("span",{className:"text-sm text-gray-600",children:_})]}):e.jsxs("div",{className:"flex gap-3",children:[e.jsx("button",{onClick:()=>x(!1),className:"flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-100 transition-colors",children:"Ακύρωση"}),e.jsx("button",{onClick:E,disabled:r.length===0,className:"flex-1 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed",children:"🖨️ Δημιουργία PDF"})]})]})]})}):e.jsxs("button",{onClick:()=>x(!0),className:"flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-gray-200 bg-white text-gray-600 hover:border-green-400 hover:text-green-700 transition-colors",children:[e.jsx("svg",{className:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"})}),"Εκτύπωση / Export"]})}const $=l=>"€"+(Number(l)||0).toLocaleString("el-CY",{minimumFractionDigits:2,maximumFractionDigits:2}),ee=l=>{if(!l)return"—";const[i,x,m]=l.split("-"),k=["Ιαν","Φεβ","Μαρ","Απρ","Μαΐ","Ιουν","Ιουλ","Αυγ","Σεπ","Οκτ","Νοε","Δεκ"];return`${parseInt(m)} ${k[parseInt(x)-1]} ${i}`},be=["Ιαν","Φεβ","Μαρ","Απρ","Μαΐ","Ιουν","Ιουλ","Αυγ","Σεπ","Οκτ","Νοε","Δεκ"],te=String(new Date().getFullYear());new Date().getMonth()+1;const fe=/να συμπληρωθεί/i,T=l=>{const i=[];return(!l.vendor||fe.test(l.vendor))&&i.push("vendor"),(l.total==null||Number(l.total)===0)&&i.push("total"),l.net==null&&i.push("net"),l.vat==null&&i.push("vat"),l.category||i.push("category"),i},U=l=>{if(!l)return"—";const i=l.split("·");return(i[1]||i[0]).trim()};function Ne(){var X;const{isAccountant:l}=le(),i=l,[x,m]=c.useState([]),[k,h]=c.useState(!0),[g,f]=c.useState(null),[v,z]=c.useState([te]),[N,O]=c.useState([]),[j,_]=c.useState(""),[w,r]=c.useState(""),[p,u]=c.useState(!1),[E,F]=c.useState("invoice"),[o,C]=c.useState(null),[M,P]=c.useState(null);async function L(t,a){if(!i){P(t);try{await xe(ge(J,"expenses",t),{category:a})}catch(s){console.error("recategorise failed",s)}finally{P(null)}}}c.useEffect(()=>{const t=oe(ce(J,"expenses"),ie("date","desc"));return de(t,a=>{m(a.docs.map(s=>({id:s.id,...s.data()}))),h(!1)},()=>h(!1))},[]);const H=c.useMemo(()=>{const t=new Set(x.map(a=>(a.date||"").slice(0,4)).filter(Boolean));return t.add(te),[...t].sort().reverse()},[x]),B=(t,a,s)=>a(t.includes(s)?t.filter(n=>n!==s):[...t,s]),re=t=>{z(a=>a.includes(t)?a.filter(s=>s!==t):[...a,t]),O([])},D=c.useMemo(()=>x.filter(t=>{const a=(t.date||"").slice(0,4),s=parseInt((t.date||"").slice(5,7),10);return!(v.length&&!v.includes(a)||N.length&&!N.includes(s)||j&&t.category!==j||w&&t.location!==w||p&&T(t).length===0)}),[x,v,N,j,w,p]),W=c.useMemo(()=>x.filter(t=>{const a=(t.date||"").slice(0,4),s=parseInt((t.date||"").slice(5,7),10);return v.length&&!v.includes(a)||N.length&&!N.includes(s)||j&&t.category!==j||w&&t.location!==w?!1:T(t).length>0}).length,[x,v,N,j,w]),R=c.useMemo(()=>{const t={total:0,vat:0,net:0,count:D.length,byCat:{}};for(const a of D)t.total+=Number(a.total)||0,t.vat+=Number(a.vat)||0,t.net+=Number(a.net)||0,t.byCat[a.category]=(t.byCat[a.category]||0)+(Number(a.total)||0);return t},[D]),Y=c.useMemo(()=>{const t=Object.entries(R.byCat).sort((s,n)=>n[1]-s[1]).map(([s])=>s),a={};for(const s of D){const n=s.category||"Άλλο";a[n]||(a[n]=[]),a[n].push(s)}return t.map(s=>({category:s,rows:a[s]||[],catTotal:R.byCat[s]||0}))},[D,R]),ae=((X=Y[0])==null?void 0:X.catTotal)||1,q=c.useMemo(()=>{const t=s=>(s||"").toLowerCase().trim().replace(/[.,]/g,"").replace(/\b(ltd|limited|λτδ|epe|ε\.π\.ε)\b/g,"").replace(/\s+/g," ").trim(),a={};for(const s of D){const n=t(s.vendor)||"—";a[n]||(a[n]={key:n,name:s.vendor||"—",rows:[],total:0,cats:{}});const S=a[n];S.rows.push(s),S.total+=Number(s.total)||0,(s.vendor||"").length>S.name.length&&(S.name=s.vendor),s.category&&(S.cats[s.category]=(S.cats[s.category]||0)+(Number(s.total)||0))}return Object.values(a).sort((s,n)=>n.total-s.total)},[D]),K="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-700";return e.jsxs("div",{className:"max-w-6xl mx-auto px-4 py-6",children:[e.jsxs("div",{className:"flex items-center justify-between mb-5 flex-wrap gap-3",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"text-2xl font-bold text-gray-800",children:"Λογιστικά / Έξοδα"}),e.jsx("p",{className:"text-sm text-gray-500 mt-0.5",children:"Καταχώρηση & ανάλυση εξόδων"})]}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx(ue,{expenses:x}),!i&&e.jsx("button",{onClick:()=>f("new"),className:"bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm",children:"+ Νέο Έξοδο"})]})]}),e.jsxs("div",{className:"mb-5 space-y-2.5",children:[e.jsxs("div",{className:"flex gap-1.5 flex-wrap items-center",children:[e.jsx("span",{className:"text-[10px] font-bold text-gray-400 uppercase tracking-wide w-12 shrink-0",children:"Έτος"}),H.map(t=>e.jsx("button",{onClick:()=>re(t),className:`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${v.includes(t)?"bg-green-600 border-green-600 text-white shadow-sm":"bg-white border-gray-200 text-gray-600 hover:border-green-400 hover:text-green-700"}`,children:t},t)),v.length>0&&e.jsx("button",{onClick:()=>z([]),className:"text-xs text-gray-400 hover:text-gray-600 underline ml-1",children:"όλα"})]}),e.jsxs("div",{className:"flex gap-1.5 flex-wrap items-center",children:[e.jsx("span",{className:"text-[10px] font-bold text-gray-400 uppercase tracking-wide w-12 shrink-0",children:"Μήνας"}),be.map((t,a)=>e.jsx("button",{onClick:()=>B(N,O,a+1),className:`px-2.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${N.includes(a+1)?"bg-green-600 border-green-600 text-white shadow-sm":"bg-white border-gray-200 text-gray-600 hover:border-green-400 hover:text-green-700"}`,children:t},t)),N.length>0&&e.jsx("button",{onClick:()=>O([]),className:"text-xs text-gray-400 hover:text-gray-600 underline ml-1",children:"όλοι"})]}),e.jsxs("div",{className:"flex gap-3 flex-wrap items-center",children:[e.jsxs("select",{className:K,value:j,onChange:t=>_(t.target.value),children:[e.jsx("option",{value:"",children:"Όλες οι κατηγορίες"}),I.map(t=>e.jsx("option",{value:t,children:t},t))]}),e.jsxs("select",{className:K,value:w,onChange:t=>r(t.target.value),children:[e.jsx("option",{value:"",children:"Όλες οι τοποθεσίες"}),se.map(t=>e.jsx("option",{value:t,children:t},t))]}),W>0&&e.jsxs("button",{onClick:()=>u(t=>!t),className:`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${p?"bg-red-600 border-red-600 text-white shadow-sm":"bg-white border-red-200 text-red-600 hover:border-red-400"}`,children:["⚠ ",W," χρειάζονται συμπλήρωση"]})]})]}),e.jsxs("div",{className:"grid grid-cols-2 md:grid-cols-4 gap-3 mb-6",children:[e.jsx(V,{label:"Σύνολο εξόδων",value:$(R.total),accent:"text-gray-900"}),e.jsx(V,{label:"ΦΠΑ (input)",value:$(R.vat),accent:"text-amber-600"}),e.jsx(V,{label:"Καθαρό",value:$(R.net),accent:"text-gray-700"}),e.jsx(V,{label:"Παραστατικά",value:R.count,accent:"text-green-700"})]}),Y.length>0&&e.jsxs("div",{className:"bg-white border border-gray-200 rounded-xl p-4 mb-6",children:[e.jsxs("div",{className:"flex items-center justify-between mb-3",children:[e.jsx("h3",{className:"text-sm font-semibold text-gray-500 uppercase tracking-wide",children:"Ανά κατηγορία"}),j&&e.jsx("button",{onClick:()=>_(""),className:"text-xs text-green-600 hover:underline font-medium",children:"✕ καθαρισμός φίλτρου"})]}),e.jsx("div",{className:"space-y-1",children:Y.map(({category:t,catTotal:a})=>{const s=j===t;return e.jsxs("button",{onClick:()=>_(s?"":t),className:`w-full flex items-center gap-3 text-sm rounded-lg px-2 py-1.5 -mx-2 transition-colors text-left ${s?"bg-green-50 ring-1 ring-green-300":"hover:bg-gray-50"}`,children:[e.jsx("span",{className:`w-52 shrink-0 truncate ${s?"text-green-800 font-semibold":"text-gray-600"}`,children:t}),e.jsx("div",{className:"flex-1 bg-gray-100 rounded-full h-4 overflow-hidden",children:e.jsx("div",{className:`h-full rounded-full ${s?"bg-gradient-to-r from-green-500 to-green-700":"bg-gradient-to-r from-green-400 to-green-600"}`,style:{width:`${a/ae*100}%`}})}),e.jsx("span",{className:`w-24 text-right font-semibold shrink-0 ${s?"text-green-800":"text-gray-700"}`,children:$(a)})]},t)})}),e.jsx("p",{className:"text-xs text-gray-400 mt-2",children:"Κάνε κλικ σε μια κατηγορία για να δεις τις αποδείξεις της παρακάτω."})]}),e.jsxs("div",{className:"flex items-center gap-2 mb-3",children:[e.jsx("span",{className:"text-xs font-bold text-gray-400 uppercase tracking-wide mr-1",children:"Προβολή"}),[["invoice","🧾 Ανά τιμολόγιο"],["merchant","🏷️ Ανά προμηθευτή"]].map(([t,a])=>e.jsx("button",{onClick:()=>F(t),className:`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${E===t?"bg-green-600 border-green-600 text-white shadow-sm":"bg-white border-gray-200 text-gray-600 hover:border-green-400 hover:text-green-700"}`,children:a},t)),E==="merchant"&&e.jsxs("span",{className:"text-sm text-gray-500 ml-1",children:[q.length," προμηθευτές"]})]}),!k&&D.length>0&&E==="merchant"&&e.jsxs("div",{className:"bg-white border border-gray-200 rounded-xl overflow-hidden",children:[q.map(t=>{var S;const a=o===t.key,s=(S=Object.entries(t.cats).sort((d,A)=>A[1]-d[1])[0])==null?void 0:S[0],n=t.rows.filter(d=>T(d).length>0).length;return e.jsxs("div",{className:"border-b border-gray-100 last:border-0",children:[e.jsxs("button",{onClick:()=>C(a?null:t.key),className:"w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-green-50 transition-colors",children:[e.jsx("span",{className:`text-gray-400 transition-transform ${a?"rotate-90":""}`,children:"▶"}),e.jsxs("span",{className:"flex-1 min-w-0",children:[e.jsx("span",{className:"text-sm font-semibold text-gray-800 truncate block",children:t.name}),e.jsxs("span",{className:"text-xs text-gray-400",children:[t.rows.length," τιμολόγια",s?` · κυρίως ${U(s)}`:""]})]}),n>0&&e.jsxs("span",{className:"text-[10px] font-bold uppercase bg-red-100 text-red-600 px-1.5 py-0.5 rounded",children:[n," needs action"]}),e.jsx("span",{className:"text-sm font-bold text-gray-900 shrink-0",children:$(t.total)})]}),a&&e.jsx("div",{className:"bg-gray-50/60 border-t border-gray-100",children:t.rows.map(d=>{const A=T(d);return e.jsxs("div",{onClick:()=>f(d),className:`flex items-center gap-3 pl-10 pr-4 py-2.5 cursor-pointer border-b border-gray-100 last:border-0 transition-colors ${A.length?"hover:bg-red-50":"hover:bg-green-50"}`,children:[e.jsx("span",{className:"text-xs text-gray-500 w-24 shrink-0",children:ee(d.date)}),e.jsxs("select",{value:d.category||"",disabled:i,onClick:b=>b.stopPropagation(),onChange:b=>{b.stopPropagation(),L(d.id,b.target.value)},className:`flex-1 min-w-0 text-xs bg-transparent border border-transparent rounded px-1 cursor-pointer hover:border-gray-300 hover:bg-white focus:bg-white focus:border-green-400 focus:outline-none ${M===d.id?"opacity-40":""} ${A.includes("category")?"text-red-600 font-semibold":"text-gray-600"}`,children:[!I.includes(d.category)&&d.category&&e.jsx("option",{value:d.category,children:U(d.category)}),I.map(b=>e.jsx("option",{value:b,children:U(b)},b))]}),e.jsx(Q,{expense:d}),d.fileUrl?e.jsx("span",{className:"text-green-500 text-xs shrink-0",title:"Έχει αποδεικτικό",children:"📎"}):e.jsx("span",{className:"w-3 shrink-0"}),e.jsx("span",{className:`text-sm font-semibold text-right w-20 shrink-0 ${A.includes("total")?"text-red-600":"text-gray-900"}`,children:$(d.total)})]},d.id)})})]},t.key)}),e.jsxs("div",{className:"flex items-center justify-between px-4 py-3 bg-green-50 border-t border-green-200",children:[e.jsxs("span",{className:"text-sm font-semibold text-green-800",children:["Σύνολο (",q.length," προμηθευτές)"]}),e.jsx("span",{className:"text-lg font-bold text-green-900",children:$(R.total)})]})]}),k?e.jsx("div",{className:"text-center py-16 text-gray-400",children:"Φόρτωση…"}):D.length===0?e.jsx("div",{className:"text-center py-16 text-gray-400",children:"Δεν υπάρχουν έξοδα για αυτά τα φίλτρα"}):E==="invoice"?e.jsxs("div",{className:"bg-white border border-gray-200 rounded-xl overflow-hidden",children:[e.jsxs("div",{className:"hidden md:grid grid-cols-[1.6rem_6rem_1fr_6rem_7rem_4.5rem_5rem_5.5rem] gap-x-3 px-4 py-2 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-400 uppercase tracking-wide",children:[e.jsx("span",{}),e.jsx("span",{children:"Ημερομηνία"}),e.jsx("span",{children:"Προμηθευτής"}),e.jsx("span",{children:"Σημειώσεις"}),e.jsx("span",{children:"Κατηγορία"}),e.jsx("span",{className:"text-right",children:"Καθαρό"}),e.jsx("span",{className:"text-right",children:"ΦΠΑ"}),e.jsx("span",{className:"text-right",children:"Σύνολο"})]}),Y.map(({category:t,rows:a,catTotal:s})=>e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-100",children:[e.jsx("span",{className:"text-sm font-semibold text-gray-700",children:t}),e.jsx("span",{className:"text-sm font-bold text-gray-800",children:$(s)})]}),a.map((n,S)=>{const d=T(n),A=d.length>0;return e.jsxs("div",{onClick:()=>f(n),className:`grid grid-cols-[1.6rem_1fr] md:grid-cols-[1.6rem_6rem_1fr_6rem_7rem_4.5rem_5rem_5.5rem] gap-x-3 items-center px-4 py-3 cursor-pointer transition-colors ${S<a.length-1?"border-b border-gray-100":""} ${A?"bg-red-50/60 hover:bg-red-50 border-l-2 border-l-red-400":"hover:bg-green-50"}`,children:[e.jsx("span",{className:"text-gray-300 text-base",title:n.fileUrl?"Έχει αποδεικτικό":"Χωρίς αποδεικτικό",children:n.fileUrl?e.jsx("svg",{viewBox:"0 0 20 20",fill:"currentColor",className:"w-4 h-4 text-green-500",children:e.jsx("path",{fillRule:"evenodd",d:"M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z",clipRule:"evenodd"})}):e.jsx("svg",{viewBox:"0 0 20 20",fill:"currentColor",className:"w-4 h-4 text-gray-200",children:e.jsx("path",{fillRule:"evenodd",d:"M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z",clipRule:"evenodd"})})}),e.jsx("span",{className:"text-sm text-gray-500 whitespace-nowrap",children:ee(n.date)}),e.jsxs("span",{className:"text-sm font-medium text-gray-800 truncate flex items-center gap-1.5 min-w-0",children:[e.jsx("span",{className:`truncate ${d.includes("vendor")?"text-red-600":""}`,children:n.vendor||"— προμηθευτής"}),A&&e.jsx("span",{className:"shrink-0 text-[10px] font-bold uppercase tracking-wide bg-red-100 text-red-600 px-1.5 py-0.5 rounded",children:"needs action"}),e.jsx(Q,{expense:n})]}),e.jsx("span",{className:"hidden md:block text-xs text-gray-400 truncate",children:n.notes||n.invoiceNumber||""}),e.jsxs("select",{value:n.category||"",disabled:i,onClick:b=>b.stopPropagation(),onChange:b=>{b.stopPropagation(),L(n.id,b.target.value)},title:"Αλλαγή κατηγορίας",className:`hidden md:block text-xs truncate bg-transparent border border-transparent rounded px-1 -ml-1 cursor-pointer hover:border-gray-300 hover:bg-gray-50 focus:bg-white focus:border-green-400 focus:outline-none ${M===n.id?"opacity-40":""} ${d.includes("category")?"text-red-600 font-semibold":"text-gray-600"}`,children:[!I.includes(n.category)&&n.category&&e.jsx("option",{value:n.category,children:U(n.category)}),I.map(b=>e.jsx("option",{value:b,children:U(b)},b))]}),e.jsx("span",{className:`hidden md:block text-sm text-right ${d.includes("net")?"text-red-500 font-semibold":"text-gray-600"}`,children:n.net!=null?$(n.net):"λείπει"}),e.jsxs("span",{className:`hidden md:block text-sm text-right ${d.includes("vat")?"text-red-500 font-semibold":"text-amber-600"}`,children:[n.vat!=null?$(n.vat):"λείπει",n.vatRate!=null?e.jsxs("span",{className:"text-xs text-gray-400 ml-1",children:[n.vatRate,"%"]}):null]}),e.jsx("span",{className:`text-sm font-semibold text-right ${d.includes("total")?"text-red-600":"text-gray-900"}`,children:$(n.total)})]},n.id)}),e.jsx("div",{className:"flex justify-end px-4 py-2 bg-gray-50 border-t border-gray-100 text-sm font-bold text-gray-700",children:$(s)})]},t)),e.jsxs("div",{className:"flex items-center justify-between px-4 py-3 bg-green-50 border-t border-green-200",children:[e.jsxs("span",{className:"text-sm font-semibold text-green-800",children:["Σύνολο (",R.count," παραστατικά)"]}),e.jsx("span",{className:"text-lg font-bold text-green-900",children:$(R.total)})]})]}):null,g&&e.jsx(pe,{existing:g==="new"?null:g,readOnly:i,onClose:()=>f(null)})]})}function V({label:l,value:i,accent:x}){return e.jsxs("div",{className:"bg-white border border-gray-200 rounded-xl p-4",children:[e.jsx("p",{className:"text-xs text-gray-400 uppercase tracking-wide",children:l}),e.jsx("p",{className:`text-xl font-bold mt-1 ${x}`,children:i})]})}export{Ne as default,T as missingFields};
