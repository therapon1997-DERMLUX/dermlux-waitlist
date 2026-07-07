import{r as d,j as e,v as ne,u as le,q as oe,e as ie,c as ce,o as de,a as xe,d as ge,b as J}from"./index-CAKL4iJa.js";import{L as se,C as _,E as me}from"./ExpenseModal-V5_GR0Wh.js";const Q="  https://empty-hall-968f.therapon1997.workers.dev",j=s=>"€"+(Number(s)||0).toLocaleString("el-CY",{minimumFractionDigits:2,maximumFractionDigits:2}),G=s=>{if(!s)return"—";const[o,c,p]=s.split("-"),b=["Ιαν","Φεβ","Μαρ","Απρ","Μαΐ","Ιουν","Ιουλ","Αυγ","Σεπ","Οκτ","Νοε","Δεκ"];return`${parseInt(p)} ${b[parseInt(c)-1]} ${o}`};async function pe(s){var o;if(!s||!Q)return null;try{const c=await((o=ne().currentUser)==null?void 0:o.getIdToken());if(!c)return null;const p=await fetch(`${Q}/invoices/${encodeURIComponent(s)}`,{headers:{Authorization:`Bearer ${c}`}});if(!p.ok)return null;const b=await p.blob();return new Promise(h=>{const x=new FileReader;x.onload=()=>h(x.result),x.onerror=()=>h(null),x.readAsDataURL(b)})}catch{return null}}function ue({expenses:s,dateFrom:o,dateTo:c,cats:p,loc:b,imageMap:h}){const x={total:0,vat:0,net:0},u={};for(const a of s)x.total+=Number(a.total)||0,x.vat+=Number(a.vat)||0,x.net+=Number(a.net)||0,u[a.category]=(u[a.category]||0)+(Number(a.total)||0);const m=Object.entries(u).sort((a,f)=>f[1]-a[1]),N=m.map(([a])=>({cat:a,rows:s.filter(f=>(f.category||"")===a)})),k=new Date().toLocaleDateString("el-GR",{day:"2-digit",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"}),O=[o||c?`${o||"…"} – ${c||"…"}`:"",p.length?p.join(", "):"",b||""].filter(Boolean).join(" · ")||"Όλα",w=N.map(({cat:a,rows:f})=>`
    <tr class="cat-header">
      <td colspan="6">${a}</td>
      <td class="num bold">${j(f.reduce((v,E)=>v+(Number(E.total)||0),0))}</td>
    </tr>
    ${f.map(v=>`
    <tr>
      <td>${G(v.date)}</td>
      <td>${v.vendor||"—"}</td>
      <td class="muted">${v.invoiceNumber||""}</td>
      <td class="muted">${v.notes||""}</td>
      <td class="num">${v.net!=null?j(v.net):"—"}</td>
      <td class="num amber">${v.vat!=null?j(v.vat):"—"}${v.vatRate!=null?`<span class="rate"> ${v.vatRate}%</span>`:""}</td>
      <td class="num bold">${j(v.total)}</td>
    </tr>`).join("")}
  `).join(""),T=s.filter(a=>h[a.id]).map(a=>`
    <div class="receipt-page">
      <div class="receipt-header">
        <div>
          <div class="receipt-vendor">${a.vendor||"—"}</div>
          <div class="receipt-meta">${G(a.date)}${a.invoiceNumber?" · #"+a.invoiceNumber:""}</div>
          <div class="receipt-cat">${a.category||""}</div>
        </div>
        <div class="receipt-amounts">
          <div class="receipt-total">${j(a.total)}</div>
          ${a.vat!=null?`<div class="receipt-vat">ΦΠΑ ${j(a.vat)}${a.vatRate!=null?` (${a.vatRate}%)`:""}</div>`:""}
          ${a.net!=null?`<div class="receipt-net">Καθαρό ${j(a.net)}</div>`:""}
        </div>
      </div>
      <div class="receipt-img-wrap">
        <img src="${h[a.id]}" alt="Αποδεικτικό ${a.vendor||""}" />
      </div>
    </div>
  `).join(""),$=s.filter(a=>!h[a.id]).map(a=>`<li>${G(a.date)} · <strong>${a.vendor||"—"}</strong> · ${j(a.total)}</li>`).join("");return`<!DOCTYPE html>
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
  <div class="cover-meta">Φίλτρα: ${O} &nbsp;·&nbsp; Δημιουργήθηκε: ${k}</div>
  <div class="cover-totals">
    <div class="cover-stat"><div class="val">${j(x.total)}</div><div class="lbl">Σύνολο εξόδων</div></div>
    <div class="cover-stat"><div class="val">${j(x.vat)}</div><div class="lbl">ΦΠΑ (input)</div></div>
    <div class="cover-stat"><div class="val">${j(x.net)}</div><div class="lbl">Καθαρό</div></div>
    <div class="cover-stat"><div class="val">${s.length}</div><div class="lbl">Παραστατικά</div></div>
    <div class="cover-stat"><div class="val">${Object.keys(h).length}</div><div class="lbl">Με αποδεικτικό</div></div>
  </div>
</div>

<!-- Category bars -->
<h2>Ανά Κατηγορία</h2>
<div class="cat-bars">
  ${m.map(([a,f])=>`
  <div class="cat-bar-row">
    <div class="cat-bar-label">${a}</div>
    <div class="cat-bar-track"><div class="cat-bar-fill" style="width:${Math.round(f/m[0][1]*100)}%"></div></div>
    <div class="cat-bar-val">${j(f)}</div>
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
    ${w}
  </tbody>
</table>
<div class="grand-total">
  <span>Καθαρό: ${j(x.net)}</span>
  <span>ΦΠΑ: ${j(x.vat)}</span>
  <span>Σύνολο: ${j(x.total)}</span>
</div>

${$?`
<div class="no-receipt-section">
  <h3>Χωρίς αποδεικτικό (${s.length-Object.keys(h).length})</h3>
  <ul>${$}</ul>
</div>`:""}

${T}

</body>
</html>`}function he({expenses:s}){const[o,c]=d.useState(!1),[p,b]=d.useState(""),[h,x]=d.useState(""),[u,m]=d.useState([]),[N,k]=d.useState(""),[O,w]=d.useState(!1),[T,$]=d.useState(""),a=d.useMemo(()=>s.filter(i=>!(p&&i.date<p||h&&i.date>h||u.length&&!u.includes(i.category)||N&&i.location!==N)),[s,p,h,u,N]),f=a.filter(i=>i.fileUrl).length;function v(i){m(S=>S.includes(i)?S.filter(M=>M!==i):[...S,i])}async function E(){w(!0);const i={},S=a.filter(L=>L.fileUrl);for(let L=0;L<S.length;L++){const U=S[L];$(`Φόρτωση αποδείξεων ${L+1}/${S.length}…`);const Y=await pe(U.fileUrl);Y&&(i[U.id]=Y)}$(""),w(!1);const M=ue({expenses:a,dateFrom:p,dateTo:h,cats:u,loc:N,imageMap:i}),I=window.open("","_blank");I.document.write(M),I.document.close(),setTimeout(()=>I.print(),800)}const P="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white w-full";return o?e.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4",children:e.jsxs("div",{className:"bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col",children:[e.jsxs("div",{className:"flex items-center justify-between px-6 py-4 border-b border-gray-100",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-base font-bold text-gray-800",children:"Εκτύπωση / Export PDF"}),e.jsx("p",{className:"text-xs text-gray-400 mt-0.5",children:"Report + αποδείξεις 1-1 σε πλήρη ανάλυση"})]}),e.jsx("button",{onClick:()=>c(!1),className:"text-gray-400 hover:text-gray-600 text-xl leading-none",children:"×"})]}),e.jsxs("div",{className:"flex-1 overflow-y-auto px-6 py-4 space-y-5",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2",children:"Εύρος ημερομηνιών"}),e.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[e.jsxs("div",{children:[e.jsx("label",{className:"text-xs text-gray-400 mb-1 block",children:"Από"}),e.jsx("input",{type:"date",className:P,value:p,onChange:i=>b(i.target.value)})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-xs text-gray-400 mb-1 block",children:"Έως"}),e.jsx("input",{type:"date",className:P,value:h,onChange:i=>x(i.target.value)})]})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2",children:"Τοποθεσία"}),e.jsxs("select",{className:P,value:N,onChange:i=>k(i.target.value),children:[e.jsx("option",{value:"",children:"Όλες"}),se.map(i=>e.jsx("option",{value:i,children:i},i))]})]}),e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center justify-between mb-2",children:[e.jsx("label",{className:"text-xs font-semibold text-gray-500 uppercase tracking-wide",children:"Κατηγορίες"}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx("button",{onClick:()=>m([..._]),className:"text-xs text-green-600 hover:underline",children:"Όλες"}),e.jsx("span",{className:"text-gray-300",children:"·"}),e.jsx("button",{onClick:()=>m([]),className:"text-xs text-gray-400 hover:underline",children:"Καμία"})]})]}),e.jsx("div",{className:"grid grid-cols-1 gap-1 max-h-48 overflow-y-auto border border-gray-100 rounded-lg p-2",children:_.map(i=>e.jsxs("label",{className:"flex items-center gap-2 px-1 py-0.5 rounded hover:bg-gray-50 cursor-pointer",children:[e.jsx("input",{type:"checkbox",checked:u.includes(i),onChange:()=>v(i),className:"accent-green-600 w-3.5 h-3.5"}),e.jsx("span",{className:"text-xs text-gray-700",children:i})]},i))}),e.jsx("p",{className:"text-xs text-gray-400 mt-1",children:u.length===0?"Όλες οι κατηγορίες":`${u.length} επιλεγμένες`})]})]}),e.jsxs("div",{className:"px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl",children:[e.jsxs("div",{className:"flex items-center justify-between mb-3",children:[e.jsxs("div",{className:"text-sm text-gray-600",children:[e.jsx("span",{className:"font-bold text-gray-800",children:a.length})," παραστατικά",f>0&&e.jsxs("span",{className:"text-green-600 ml-2",children:["· ",f," με αποδεικτικό"]}),a.length-f>0&&e.jsxs("span",{className:"text-gray-400 ml-2",children:["· ",a.length-f," χωρίς"]})]}),e.jsx("div",{className:"text-sm font-bold text-gray-800",children:"€"+a.reduce((S,M)=>S+(Number(M.total)||0),0).toLocaleString("el-CY",{minimumFractionDigits:2,maximumFractionDigits:2})})]}),O?e.jsxs("div",{className:"flex items-center gap-3 justify-center py-2",children:[e.jsx("div",{className:"w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"}),e.jsx("span",{className:"text-sm text-gray-600",children:T})]}):e.jsxs("div",{className:"flex gap-3",children:[e.jsx("button",{onClick:()=>c(!1),className:"flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-100 transition-colors",children:"Ακύρωση"}),e.jsx("button",{onClick:E,disabled:a.length===0,className:"flex-1 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed",children:"🖨️ Δημιουργία PDF"})]})]})]})}):e.jsxs("button",{onClick:()=>c(!0),className:"flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-gray-200 bg-white text-gray-600 hover:border-green-400 hover:text-green-700 transition-colors",children:[e.jsx("svg",{className:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"})}),"Εκτύπωση / Export"]})}const be={"Bank of Cyprus":{label:"BoC",cls:"bg-red-600 text-white",full:"Bank of Cyprus"},Eurobank:{label:"EB",cls:"bg-blue-900 text-white",full:"Eurobank Cyprus"},Revolut:{label:"R",cls:"bg-gray-900 text-white",full:"Revolut Business"}},fe=s=>{if(!s)return"—";const[o,c,p]=s.split("-"),b=["Ιαν","Φεβ","Μαρ","Απρ","Μαΐ","Ιουν","Ιουλ","Αυγ","Σεπ","Οκτ","Νοε","Δεκ"];return`${parseInt(p)} ${b[parseInt(c)-1]} ${o}`},ve=s=>"€"+(Number(s)||0).toLocaleString("el-CY",{minimumFractionDigits:2,maximumFractionDigits:2});function Z({expense:s,showUnmatched:o=!1}){const[c,p]=d.useState(!1),b=d.useRef(null);d.useEffect(()=>{if(!c)return;const m=N=>{b.current&&!b.current.contains(N.target)&&p(!1)};return document.addEventListener("mousedown",m),()=>document.removeEventListener("mousedown",m)},[c]);const h=s.paymentMethod==="Μετρητά",x=s.bankTagBank;if(h)return e.jsx("span",{className:"inline-flex items-center gap-1 shrink-0 text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded-full",title:"Πληρωμή με μετρητά (ταμείο)",children:"💶 Cash"});if(!x&&s.bankPaymentNote)return e.jsx("span",{className:"inline-flex items-center shrink-0 text-[10px] font-medium bg-gray-100 text-gray-500 border border-gray-200 px-1.5 py-0.5 rounded-full",title:s.bankPaymentNote,children:"💳 προσ. κάρτα"});if(!x)return o?e.jsx("span",{className:"inline-flex items-center shrink-0 text-[10px] font-medium bg-amber-50 text-amber-600 border border-amber-200 px-1.5 py-0.5 rounded-full",title:"Δεν βρέθηκε στη τράπεζα — πιθανόν μετρητά ή εκτός περιόδου statement",children:"πιθανόν cash;"}):null;const u=be[x]||{label:x.slice(0,3),cls:"bg-gray-600 text-white",full:x};return e.jsxs("span",{className:"relative inline-flex shrink-0",ref:b,children:[e.jsxs("button",{onClick:m=>{m.stopPropagation(),p(N=>!N)},className:`inline-flex items-center gap-1 text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-sm hover:scale-105 transition-transform ${u.cls}`,title:`Πληρώθηκε μέσω ${u.full} — κλικ για λεπτομέρειες`,children:["🏦 ",u.label]}),c&&e.jsxs("span",{className:"absolute z-30 top-6 right-0 w-72 bg-white border border-gray-200 rounded-xl shadow-xl p-3 text-left cursor-default",onClick:m=>m.stopPropagation(),children:[e.jsx("span",{className:"block text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1",children:u.full}),e.jsx("span",{className:"block text-sm font-semibold text-gray-800",children:fe(s.bankTagDate)}),e.jsx("span",{className:"block text-xs text-gray-600 mt-1 break-words",children:s.bankTagDesc}),e.jsx("span",{className:"block text-sm font-bold text-gray-900 mt-1.5",children:ve(s.bankTagAmount)}),s.bankTagRef&&e.jsxs("span",{className:"block text-[10px] text-gray-400 mt-1 font-mono",children:["ref: ",s.bankTagRef]})]})]})}const C=s=>"€"+(Number(s)||0).toLocaleString("el-CY",{minimumFractionDigits:2,maximumFractionDigits:2}),ee=s=>{if(!s)return"—";const[o,c,p]=s.split("-"),b=["Ιαν","Φεβ","Μαρ","Απρ","Μαΐ","Ιουν","Ιουλ","Αυγ","Σεπ","Οκτ","Νοε","Δεκ"];return`${parseInt(p)} ${b[parseInt(c)-1]} ${o}`},ye=["Ιαν","Φεβ","Μαρ","Απρ","Μαΐ","Ιουν","Ιουλ","Αυγ","Σεπ","Οκτ","Νοε","Δεκ"],te=String(new Date().getFullYear());new Date().getMonth()+1;const je=/να συμπληρωθεί/i,B=s=>{const o=[];return(!s.vendor||je.test(s.vendor))&&o.push("vendor"),(s.total==null||Number(s.total)===0)&&o.push("total"),s.net==null&&o.push("net"),s.vat==null&&o.push("vat"),s.category||o.push("category"),o},F=s=>{if(!s)return"—";const o=s.split("·");return(o[1]||o[0]).trim()};function ke(){var X;const{isAccountant:s}=le(),o=s,[c,p]=d.useState([]),[b,h]=d.useState(!0),[x,u]=d.useState(null),[m,N]=d.useState([te]),[k,O]=d.useState([]),[w,T]=d.useState(""),[$,a]=d.useState(""),[f,v]=d.useState(!1),[E,P]=d.useState("invoice"),[i,S]=d.useState(null),[M,I]=d.useState(null);async function L(t,n){if(!o){I(t);try{await xe(ge(J,"expenses",t),{category:n})}catch(r){console.error("recategorise failed",r)}finally{I(null)}}}d.useEffect(()=>{const t=oe(ce(J,"expenses"),ie("date","desc"));return de(t,n=>{p(n.docs.map(r=>({id:r.id,...r.data()}))),h(!1)},()=>h(!1))},[]);const U=d.useMemo(()=>{const t=new Set(c.map(n=>(n.date||"").slice(0,4)).filter(Boolean));return t.add(te),[...t].sort().reverse()},[c]),Y=(t,n,r)=>n(t.includes(r)?t.filter(l=>l!==r):[...t,r]),re=t=>{N(n=>n.includes(t)?n.filter(r=>r!==t):[...n,t]),O([])},D=d.useMemo(()=>c.filter(t=>{const n=(t.date||"").slice(0,4),r=parseInt((t.date||"").slice(5,7),10);return!(m.length&&!m.includes(n)||k.length&&!k.includes(r)||w&&t.category!==w||$&&t.location!==$||f&&B(t).length===0)}),[c,m,k,w,$,f]),K=d.useMemo(()=>c.filter(t=>{const n=(t.date||"").slice(0,4),r=parseInt((t.date||"").slice(5,7),10);return m.length&&!m.includes(n)||k.length&&!k.includes(r)||w&&t.category!==w||$&&t.location!==$?!1:B(t).length>0}).length,[c,m,k,w,$]),z=d.useMemo(()=>{const t={total:0,vat:0,net:0,count:D.length,byCat:{}};for(const n of D)t.total+=Number(n.total)||0,t.vat+=Number(n.vat)||0,t.net+=Number(n.net)||0,t.byCat[n.category]=(t.byCat[n.category]||0)+(Number(n.total)||0);return t},[D]),H=d.useMemo(()=>{const t=Object.entries(z.byCat).sort((r,l)=>l[1]-r[1]).map(([r])=>r),n={};for(const r of D){const l=r.category||"Άλλο";n[l]||(n[l]=[]),n[l].push(r)}return t.map(r=>({category:r,rows:n[r]||[],catTotal:z.byCat[r]||0}))},[D,z]),ae=((X=H[0])==null?void 0:X.catTotal)||1,q=d.useMemo(()=>{const t=r=>(r||"").toLowerCase().trim().replace(/[.,]/g,"").replace(/\b(ltd|limited|λτδ|epe|ε\.π\.ε)\b/g,"").replace(/\s+/g," ").trim(),n={};for(const r of D){const l=t(r.vendor)||"—";n[l]||(n[l]={key:l,name:r.vendor||"—",rows:[],total:0,cats:{}});const R=n[l];R.rows.push(r),R.total+=Number(r.total)||0,(r.vendor||"").length>R.name.length&&(R.name=r.vendor),r.category&&(R.cats[r.category]=(R.cats[r.category]||0)+(Number(r.total)||0))}return Object.values(n).sort((r,l)=>l.total-r.total)},[D]),W="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-700";return e.jsxs("div",{className:"max-w-6xl mx-auto px-4 py-6",children:[e.jsxs("div",{className:"flex items-center justify-between mb-5 flex-wrap gap-3",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"text-2xl font-bold text-gray-800",children:"Λογιστικά / Έξοδα"}),e.jsx("p",{className:"text-sm text-gray-500 mt-0.5",children:"Καταχώρηση & ανάλυση εξόδων"})]}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx(he,{expenses:c}),!o&&e.jsx("button",{onClick:()=>u("new"),className:"bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm",children:"+ Νέο Έξοδο"})]})]}),e.jsxs("div",{className:"mb-5 space-y-2.5",children:[e.jsxs("div",{className:"flex gap-1.5 flex-wrap items-center",children:[e.jsx("span",{className:"text-[10px] font-bold text-gray-400 uppercase tracking-wide w-12 shrink-0",children:"Έτος"}),U.map(t=>e.jsx("button",{onClick:()=>re(t),className:`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${m.includes(t)?"bg-green-600 border-green-600 text-white shadow-sm":"bg-white border-gray-200 text-gray-600 hover:border-green-400 hover:text-green-700"}`,children:t},t)),m.length>0&&e.jsx("button",{onClick:()=>N([]),className:"text-xs text-gray-400 hover:text-gray-600 underline ml-1",children:"όλα"})]}),e.jsxs("div",{className:"flex gap-1.5 flex-wrap items-center",children:[e.jsx("span",{className:"text-[10px] font-bold text-gray-400 uppercase tracking-wide w-12 shrink-0",children:"Μήνας"}),ye.map((t,n)=>e.jsx("button",{onClick:()=>Y(k,O,n+1),className:`px-2.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${k.includes(n+1)?"bg-green-600 border-green-600 text-white shadow-sm":"bg-white border-gray-200 text-gray-600 hover:border-green-400 hover:text-green-700"}`,children:t},t)),k.length>0&&e.jsx("button",{onClick:()=>O([]),className:"text-xs text-gray-400 hover:text-gray-600 underline ml-1",children:"όλοι"})]}),e.jsxs("div",{className:"flex gap-3 flex-wrap items-center",children:[e.jsxs("select",{className:W,value:w,onChange:t=>T(t.target.value),children:[e.jsx("option",{value:"",children:"Όλες οι κατηγορίες"}),_.map(t=>e.jsx("option",{value:t,children:t},t))]}),e.jsxs("select",{className:W,value:$,onChange:t=>a(t.target.value),children:[e.jsx("option",{value:"",children:"Όλες οι τοποθεσίες"}),se.map(t=>e.jsx("option",{value:t,children:t},t))]}),K>0&&e.jsxs("button",{onClick:()=>v(t=>!t),className:`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${f?"bg-red-600 border-red-600 text-white shadow-sm":"bg-white border-red-200 text-red-600 hover:border-red-400"}`,children:["⚠ ",K," χρειάζονται συμπλήρωση"]})]})]}),e.jsxs("div",{className:"grid grid-cols-2 md:grid-cols-4 gap-3 mb-6",children:[e.jsx(V,{label:"Σύνολο εξόδων",value:C(z.total),accent:"text-gray-900"}),e.jsx(V,{label:"ΦΠΑ (input)",value:C(z.vat),accent:"text-amber-600"}),e.jsx(V,{label:"Καθαρό",value:C(z.net),accent:"text-gray-700"}),e.jsx(V,{label:"Παραστατικά",value:z.count,accent:"text-green-700"})]}),H.length>0&&e.jsxs("div",{className:"bg-white border border-gray-200 rounded-xl p-4 mb-6",children:[e.jsxs("div",{className:"flex items-center justify-between mb-3",children:[e.jsx("h3",{className:"text-sm font-semibold text-gray-500 uppercase tracking-wide",children:"Ανά κατηγορία"}),w&&e.jsx("button",{onClick:()=>T(""),className:"text-xs text-green-600 hover:underline font-medium",children:"✕ καθαρισμός φίλτρου"})]}),e.jsx("div",{className:"space-y-1",children:H.map(({category:t,catTotal:n})=>{const r=w===t;return e.jsxs("button",{onClick:()=>T(r?"":t),className:`w-full flex items-center gap-3 text-sm rounded-lg px-2 py-1.5 -mx-2 transition-colors text-left ${r?"bg-green-50 ring-1 ring-green-300":"hover:bg-gray-50"}`,children:[e.jsx("span",{className:`w-52 shrink-0 truncate ${r?"text-green-800 font-semibold":"text-gray-600"}`,children:t}),e.jsx("div",{className:"flex-1 bg-gray-100 rounded-full h-4 overflow-hidden",children:e.jsx("div",{className:`h-full rounded-full ${r?"bg-gradient-to-r from-green-500 to-green-700":"bg-gradient-to-r from-green-400 to-green-600"}`,style:{width:`${n/ae*100}%`}})}),e.jsx("span",{className:`w-24 text-right font-semibold shrink-0 ${r?"text-green-800":"text-gray-700"}`,children:C(n)})]},t)})}),e.jsx("p",{className:"text-xs text-gray-400 mt-2",children:"Κάνε κλικ σε μια κατηγορία για να δεις τις αποδείξεις της παρακάτω."})]}),e.jsxs("div",{className:"flex items-center gap-2 mb-3",children:[e.jsx("span",{className:"text-xs font-bold text-gray-400 uppercase tracking-wide mr-1",children:"Προβολή"}),[["invoice","🧾 Ανά τιμολόγιο"],["merchant","🏷️ Ανά προμηθευτή"]].map(([t,n])=>e.jsx("button",{onClick:()=>P(t),className:`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${E===t?"bg-green-600 border-green-600 text-white shadow-sm":"bg-white border-gray-200 text-gray-600 hover:border-green-400 hover:text-green-700"}`,children:n},t)),E==="merchant"&&e.jsxs("span",{className:"text-sm text-gray-500 ml-1",children:[q.length," προμηθευτές"]})]}),!b&&D.length>0&&E==="merchant"&&e.jsxs("div",{className:"bg-white border border-gray-200 rounded-xl overflow-hidden",children:[q.map(t=>{var R;const n=i===t.key,r=(R=Object.entries(t.cats).sort((g,A)=>A[1]-g[1])[0])==null?void 0:R[0],l=t.rows.filter(g=>B(g).length>0).length;return e.jsxs("div",{className:"border-b border-gray-100 last:border-0",children:[e.jsxs("button",{onClick:()=>S(n?null:t.key),className:"w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-green-50 transition-colors",children:[e.jsx("span",{className:`text-gray-400 transition-transform ${n?"rotate-90":""}`,children:"▶"}),e.jsxs("span",{className:"flex-1 min-w-0",children:[e.jsx("span",{className:"text-sm font-semibold text-gray-800 truncate block",children:t.name}),e.jsxs("span",{className:"text-xs text-gray-400",children:[t.rows.length," τιμολόγια",r?` · κυρίως ${F(r)}`:""]})]}),l>0&&e.jsxs("span",{className:"text-[10px] font-bold uppercase bg-red-100 text-red-600 px-1.5 py-0.5 rounded",children:[l," needs action"]}),e.jsx("span",{className:"text-sm font-bold text-gray-900 shrink-0",children:C(t.total)})]}),n&&e.jsx("div",{className:"bg-gray-50/60 border-t border-gray-100",children:t.rows.map(g=>{const A=B(g);return e.jsxs("div",{onClick:()=>u(g),className:`flex items-center gap-3 pl-10 pr-4 py-2.5 cursor-pointer border-b border-gray-100 last:border-0 transition-colors ${A.length?"hover:bg-red-50":"hover:bg-green-50"}`,children:[e.jsx("span",{className:"text-xs text-gray-500 w-24 shrink-0",children:ee(g.date)}),e.jsxs("select",{value:g.category||"",disabled:o,onClick:y=>y.stopPropagation(),onChange:y=>{y.stopPropagation(),L(g.id,y.target.value)},className:`flex-1 min-w-0 text-xs bg-transparent border border-transparent rounded px-1 cursor-pointer hover:border-gray-300 hover:bg-white focus:bg-white focus:border-green-400 focus:outline-none ${M===g.id?"opacity-40":""} ${A.includes("category")?"text-red-600 font-semibold":"text-gray-600"}`,children:[!_.includes(g.category)&&g.category&&e.jsx("option",{value:g.category,children:F(g.category)}),_.map(y=>e.jsx("option",{value:y,children:F(y)},y))]}),e.jsx(Z,{expense:g}),g.fileUrl?e.jsx("span",{className:"text-green-500 text-xs shrink-0",title:"Έχει αποδεικτικό",children:"📎"}):e.jsx("span",{className:"w-3 shrink-0"}),e.jsx("span",{className:`text-sm font-semibold text-right w-20 shrink-0 ${A.includes("total")?"text-red-600":"text-gray-900"}`,children:C(g.total)})]},g.id)})})]},t.key)}),e.jsxs("div",{className:"flex items-center justify-between px-4 py-3 bg-green-50 border-t border-green-200",children:[e.jsxs("span",{className:"text-sm font-semibold text-green-800",children:["Σύνολο (",q.length," προμηθευτές)"]}),e.jsx("span",{className:"text-lg font-bold text-green-900",children:C(z.total)})]})]}),b?e.jsx("div",{className:"text-center py-16 text-gray-400",children:"Φόρτωση…"}):D.length===0?e.jsx("div",{className:"text-center py-16 text-gray-400",children:"Δεν υπάρχουν έξοδα για αυτά τα φίλτρα"}):E==="invoice"?e.jsxs("div",{className:"bg-white border border-gray-200 rounded-xl overflow-hidden",children:[e.jsxs("div",{className:"hidden md:grid grid-cols-[1.6rem_6rem_1fr_6rem_7rem_4.5rem_5rem_5.5rem] gap-x-3 px-4 py-2 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-400 uppercase tracking-wide",children:[e.jsx("span",{}),e.jsx("span",{children:"Ημερομηνία"}),e.jsx("span",{children:"Προμηθευτής"}),e.jsx("span",{children:"Σημειώσεις"}),e.jsx("span",{children:"Κατηγορία"}),e.jsx("span",{className:"text-right",children:"Καθαρό"}),e.jsx("span",{className:"text-right",children:"ΦΠΑ"}),e.jsx("span",{className:"text-right",children:"Σύνολο"})]}),H.map(({category:t,rows:n,catTotal:r})=>e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-100",children:[e.jsx("span",{className:"text-sm font-semibold text-gray-700",children:t}),e.jsx("span",{className:"text-sm font-bold text-gray-800",children:C(r)})]}),n.map((l,R)=>{const g=B(l),A=g.length>0;return e.jsxs("div",{onClick:()=>u(l),className:`grid grid-cols-[1.6rem_1fr] md:grid-cols-[1.6rem_6rem_1fr_6rem_7rem_4.5rem_5rem_5.5rem] gap-x-3 items-center px-4 py-3 cursor-pointer transition-colors ${R<n.length-1?"border-b border-gray-100":""} ${A?"bg-red-50/60 hover:bg-red-50 border-l-2 border-l-red-400":"hover:bg-green-50"}`,children:[e.jsx("span",{className:"text-gray-300 text-base",title:l.fileUrl?"Έχει αποδεικτικό":"Χωρίς αποδεικτικό",children:l.fileUrl?e.jsx("svg",{viewBox:"0 0 20 20",fill:"currentColor",className:"w-4 h-4 text-green-500",children:e.jsx("path",{fillRule:"evenodd",d:"M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z",clipRule:"evenodd"})}):e.jsx("svg",{viewBox:"0 0 20 20",fill:"currentColor",className:"w-4 h-4 text-gray-200",children:e.jsx("path",{fillRule:"evenodd",d:"M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z",clipRule:"evenodd"})})}),e.jsx("span",{className:"text-sm text-gray-500 whitespace-nowrap",children:ee(l.date)}),e.jsxs("span",{className:"text-sm font-medium text-gray-800 truncate flex items-center gap-1.5 min-w-0",children:[e.jsx("span",{className:`truncate ${g.includes("vendor")?"text-red-600":""}`,children:l.vendor||"— προμηθευτής"}),A&&e.jsx("span",{className:"shrink-0 text-[10px] font-bold uppercase tracking-wide bg-red-100 text-red-600 px-1.5 py-0.5 rounded",children:"needs action"}),e.jsx(Z,{expense:l})]}),e.jsx("span",{className:"hidden md:block text-xs text-gray-400 truncate",children:l.notes||l.invoiceNumber||""}),e.jsxs("select",{value:l.category||"",disabled:o,onClick:y=>y.stopPropagation(),onChange:y=>{y.stopPropagation(),L(l.id,y.target.value)},title:"Αλλαγή κατηγορίας",className:`hidden md:block text-xs truncate bg-transparent border border-transparent rounded px-1 -ml-1 cursor-pointer hover:border-gray-300 hover:bg-gray-50 focus:bg-white focus:border-green-400 focus:outline-none ${M===l.id?"opacity-40":""} ${g.includes("category")?"text-red-600 font-semibold":"text-gray-600"}`,children:[!_.includes(l.category)&&l.category&&e.jsx("option",{value:l.category,children:F(l.category)}),_.map(y=>e.jsx("option",{value:y,children:F(y)},y))]}),e.jsx("span",{className:`hidden md:block text-sm text-right ${g.includes("net")?"text-red-500 font-semibold":"text-gray-600"}`,children:l.net!=null?C(l.net):"λείπει"}),e.jsxs("span",{className:`hidden md:block text-sm text-right ${g.includes("vat")?"text-red-500 font-semibold":"text-amber-600"}`,children:[l.vat!=null?C(l.vat):"λείπει",l.vatRate!=null?e.jsxs("span",{className:"text-xs text-gray-400 ml-1",children:[l.vatRate,"%"]}):null]}),e.jsx("span",{className:`text-sm font-semibold text-right ${g.includes("total")?"text-red-600":"text-gray-900"}`,children:C(l.total)})]},l.id)}),e.jsx("div",{className:"flex justify-end px-4 py-2 bg-gray-50 border-t border-gray-100 text-sm font-bold text-gray-700",children:C(r)})]},t)),e.jsxs("div",{className:"flex items-center justify-between px-4 py-3 bg-green-50 border-t border-green-200",children:[e.jsxs("span",{className:"text-sm font-semibold text-green-800",children:["Σύνολο (",z.count," παραστατικά)"]}),e.jsx("span",{className:"text-lg font-bold text-green-900",children:C(z.total)})]})]}):null,x&&e.jsx(me,{existing:x==="new"?null:x,readOnly:o,onClose:()=>u(null)})]})}function V({label:s,value:o,accent:c}){return e.jsxs("div",{className:"bg-white border border-gray-200 rounded-xl p-4",children:[e.jsx("p",{className:"text-xs text-gray-400 uppercase tracking-wide",children:s}),e.jsx("p",{className:`text-xl font-bold mt-1 ${c}`,children:o})]})}export{ke as default,B as missingFields};
