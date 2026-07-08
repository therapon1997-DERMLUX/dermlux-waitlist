import{r as d,j as e,_ as ne,v as oe,u as le,q as ie,f as ce,c as de,o as xe,b as ge,d as pe,e as Z}from"./index-B2XG0gky.js";import{L as re,C as U,E as me}from"./ExpenseModal-Dy_AsV3X.js";import{a as ee}from"./BankChip-DeHvUH3q.js";const te="  https://empty-hall-968f.therapon1997.workers.dev",C=i=>"€"+(Number(i)||0).toLocaleString("el-CY",{minimumFractionDigits:2,maximumFractionDigits:2}),K=i=>{if(!i)return"—";const[c,g,h]=i.split("-"),z=["Ιαν","Φεβ","Μαρ","Απρ","Μαΐ","Ιουν","Ιουλ","Αυγ","Σεπ","Οκτ","Νοε","Δεκ"];return`${parseInt(h)} ${z[parseInt(g)-1]} ${c}`};async function he(i){var c;if(!i||!te)return null;try{const g=await((c=oe().currentUser)==null?void 0:c.getIdToken());if(!g)return null;const h=await fetch(`${te}/invoices/${encodeURIComponent(i)}`,{headers:{Authorization:`Bearer ${g}`}});if(!h.ok)return null;const z=await h.blob();return new Promise(u=>{const m=new FileReader;m.onload=()=>u(m.result),m.onerror=()=>u(null),m.readAsDataURL(z)})}catch{return null}}function ue({expenses:i,dateFrom:c,dateTo:g,cats:h,loc:z,imageMap:u}){const m={total:0,vat:0,net:0},y={};for(const a of i)m.total+=Number(a.total)||0,m.vat+=Number(a.vat)||0,m.net+=Number(a.net)||0,y[a.category]=(y[a.category]||0)+(Number(a.total)||0);const j=Object.entries(y).sort((a,b)=>b[1]-a[1]),E=j.map(([a])=>({cat:a,rows:i.filter(b=>(b.category||"")===a)})),S=new Date().toLocaleDateString("el-GR",{day:"2-digit",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"}),I=[c||g?`${c||"…"} – ${g||"…"}`:"",h.length?h.join(", "):"",z||""].filter(Boolean).join(" · ")||"Όλα",w=E.map(({cat:a,rows:b})=>`
    <tr class="cat-header">
      <td colspan="6">${a}</td>
      <td class="num bold">${C(b.reduce((f,A)=>f+(Number(A.total)||0),0))}</td>
    </tr>
    ${b.map(f=>`
    <tr>
      <td>${K(f.date)}</td>
      <td>${f.vendor||"—"}</td>
      <td class="muted">${f.invoiceNumber||""}</td>
      <td class="muted">${f.notes||""}</td>
      <td class="num">${f.net!=null?C(f.net):"—"}</td>
      <td class="num amber">${f.vat!=null?C(f.vat):"—"}${f.vatRate!=null?`<span class="rate"> ${f.vatRate}%</span>`:""}</td>
      <td class="num bold">${C(f.total)}</td>
    </tr>`).join("")}
  `).join(""),P=i.filter(a=>u[a.id]).map(a=>`
    <div class="receipt-page">
      <div class="receipt-header">
        <div>
          <div class="receipt-vendor">${a.vendor||"—"}</div>
          <div class="receipt-meta">${K(a.date)}${a.invoiceNumber?" · #"+a.invoiceNumber:""}</div>
          <div class="receipt-cat">${a.category||""}</div>
        </div>
        <div class="receipt-amounts">
          <div class="receipt-total">${C(a.total)}</div>
          ${a.vat!=null?`<div class="receipt-vat">ΦΠΑ ${C(a.vat)}${a.vatRate!=null?` (${a.vatRate}%)`:""}</div>`:""}
          ${a.net!=null?`<div class="receipt-net">Καθαρό ${C(a.net)}</div>`:""}
        </div>
      </div>
      <div class="receipt-img-wrap">
        <img src="${u[a.id]}" alt="Αποδεικτικό ${a.vendor||""}" />
      </div>
    </div>
  `).join(""),$=i.filter(a=>!u[a.id]).map(a=>`<li>${K(a.date)} · <strong>${a.vendor||"—"}</strong> · ${C(a.total)}</li>`).join("");return`<!DOCTYPE html>
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
  <div class="cover-meta">Φίλτρα: ${I} &nbsp;·&nbsp; Δημιουργήθηκε: ${S}</div>
  <div class="cover-totals">
    <div class="cover-stat"><div class="val">${C(m.total)}</div><div class="lbl">Σύνολο εξόδων</div></div>
    <div class="cover-stat"><div class="val">${C(m.vat)}</div><div class="lbl">ΦΠΑ (input)</div></div>
    <div class="cover-stat"><div class="val">${C(m.net)}</div><div class="lbl">Καθαρό</div></div>
    <div class="cover-stat"><div class="val">${i.length}</div><div class="lbl">Παραστατικά</div></div>
    <div class="cover-stat"><div class="val">${Object.keys(u).length}</div><div class="lbl">Με αποδεικτικό</div></div>
  </div>
</div>

<!-- Category bars -->
<h2>Ανά Κατηγορία</h2>
<div class="cat-bars">
  ${j.map(([a,b])=>`
  <div class="cat-bar-row">
    <div class="cat-bar-label">${a}</div>
    <div class="cat-bar-track"><div class="cat-bar-fill" style="width:${Math.round(b/j[0][1]*100)}%"></div></div>
    <div class="cat-bar-val">${C(b)}</div>
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
  <span>Καθαρό: ${C(m.net)}</span>
  <span>ΦΠΑ: ${C(m.vat)}</span>
  <span>Σύνολο: ${C(m.total)}</span>
</div>

${$?`
<div class="no-receipt-section">
  <h3>Χωρίς αποδεικτικό (${i.length-Object.keys(u).length})</h3>
  <ul>${$}</ul>
</div>`:""}

${P}

</body>
</html>`}function be({expenses:i}){const[c,g]=d.useState(!1),[h,z]=d.useState(""),[u,m]=d.useState(""),[y,j]=d.useState([]),[E,S]=d.useState(""),[I,w]=d.useState(!1),[P,$]=d.useState(""),a=d.useMemo(()=>i.filter(l=>!(h&&l.date<h||u&&l.date>u||y.length&&!y.includes(l.category)||E&&l.location!==E)),[i,h,u,y,E]),b=a.filter(l=>l.fileUrl).length;function f(l){j(_=>_.includes(l)?_.filter(N=>N!==l):[..._,l])}async function A(){w(!0),$("Δημιουργία Excel…");try{const l=await ne(()=>import("./xlsx-D_0l8YDs.js"),[]),_=a.map(r=>({Ημερομηνία:r.date||"",Προμηθευτής:r.vendor||"","ΑΦΜ Προμηθευτή":r.vatNumber||"","Αρ. Τιμολογίου":r.invoiceNumber||"",Κατηγορία:r.category||"",Τοποθεσία:r.location||"",Πληρωμή:r.paymentMethod||"",Καθαρό:r.net??"",ΦΠΑ:r.vat??"","ΦΠΑ %":r.vatRate??"",Σύνολο:r.total??"",Τράπεζα:r.bankTagBank||(r.paymentMethod==="Μετρητά"?"Ταμείο (μετρητά)":""),"Ημ/νία πληρωμής":r.bankTagDate||"","Ref τράπεζας":r.bankTagRef||"",Σημειώσεις:r.notes||"",Αποδεικτικό:r.fileUrl?"ΝΑΙ":"ΟΧΙ"})),N={};for(const r of a){const p=r.vatRate??"—",W=(r.category||"").startsWith("8202")?"ΜΗ εκπιπτόμενο (εστίαση/φιλοξενία)":"Εκπιπτόμενο",M=`${p}|${W}`;N[M]||(N[M]={rate:p,claim:W,net:0,vat:0,total:0,n:0}),N[M].net+=Number(r.net)||0,N[M].vat+=Number(r.vat)||0,N[M].total+=Number(r.total)||0,N[M].n++}const F=Object.values(N).sort((r,p)=>(p.rate||0)-(r.rate||0)).map(r=>({"ΦΠΑ %":r.rate,Χαρακτηρισμός:r.claim,Παραστατικά:r.n,Καθαρό:+r.net.toFixed(2),ΦΠΑ:+r.vat.toFixed(2),Σύνολο:+r.total.toFixed(2)})),k={};for(const r of a){const p=r.category||"—";k[p]||(k[p]={net:0,vat:0,total:0,n:0}),k[p].net+=Number(r.net)||0,k[p].vat+=Number(r.vat)||0,k[p].total+=Number(r.total)||0,k[p].n++}const B=Object.entries(k).sort((r,p)=>p[1].total-r[1].total).map(([r,p])=>({Κατηγορία:r,Παραστατικά:p.n,Καθαρό:+p.net.toFixed(2),ΦΠΑ:+p.vat.toFixed(2),Σύνολο:+p.total.toFixed(2)})),O=l.utils.book_new(),L=l.utils.json_to_sheet(_);L["!cols"]=[{wch:11},{wch:32},{wch:12},{wch:18},{wch:26},{wch:10},{wch:10},{wch:10},{wch:9},{wch:6},{wch:10},{wch:16},{wch:12},{wch:22},{wch:28},{wch:10}],l.utils.book_append_sheet(O,L,"Αναλυτικά"),l.utils.book_append_sheet(O,l.utils.json_to_sheet(F),"ΦΠΑ ανά συντελεστή"),l.utils.book_append_sheet(O,l.utils.json_to_sheet(B),"Ανά κατηγορία");const q=[h,u].filter(Boolean).join("_εως_")||"ολα";l.writeFile(O,`Dermlux_Εξοδα_${q}.xlsx`)}finally{w(!1),$("")}}async function G(){w(!0);const l={},_=a.filter(k=>k.fileUrl);for(let k=0;k<_.length;k++){const B=_[k];$(`Φόρτωση αποδείξεων ${k+1}/${_.length}…`);const O=await he(B.fileUrl);O&&(l[B.id]=O)}$(""),w(!1);const N=ue({expenses:a,dateFrom:h,dateTo:u,cats:y,loc:E,imageMap:l}),F=window.open("","_blank");F.document.write(N),F.document.close(),setTimeout(()=>F.print(),800)}const H="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white w-full";return c?e.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4",children:e.jsxs("div",{className:"bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col",children:[e.jsxs("div",{className:"flex items-center justify-between px-6 py-4 border-b border-gray-100",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-base font-bold text-gray-800",children:"Εκτύπωση / Export PDF"}),e.jsx("p",{className:"text-xs text-gray-400 mt-0.5",children:"Report + αποδείξεις 1-1 σε πλήρη ανάλυση"})]}),e.jsx("button",{onClick:()=>g(!1),className:"text-gray-400 hover:text-gray-600 text-xl leading-none",children:"×"})]}),e.jsxs("div",{className:"flex-1 overflow-y-auto px-6 py-4 space-y-5",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2",children:"Εύρος ημερομηνιών"}),e.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[e.jsxs("div",{children:[e.jsx("label",{className:"text-xs text-gray-400 mb-1 block",children:"Από"}),e.jsx("input",{type:"date",className:H,value:h,onChange:l=>z(l.target.value)})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-xs text-gray-400 mb-1 block",children:"Έως"}),e.jsx("input",{type:"date",className:H,value:u,onChange:l=>m(l.target.value)})]})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2",children:"Τοποθεσία"}),e.jsxs("select",{className:H,value:E,onChange:l=>S(l.target.value),children:[e.jsx("option",{value:"",children:"Όλες"}),re.map(l=>e.jsx("option",{value:l,children:l},l))]})]}),e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center justify-between mb-2",children:[e.jsx("label",{className:"text-xs font-semibold text-gray-500 uppercase tracking-wide",children:"Κατηγορίες"}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx("button",{onClick:()=>j([...U]),className:"text-xs text-green-600 hover:underline",children:"Όλες"}),e.jsx("span",{className:"text-gray-300",children:"·"}),e.jsx("button",{onClick:()=>j([]),className:"text-xs text-gray-400 hover:underline",children:"Καμία"})]})]}),e.jsx("div",{className:"grid grid-cols-1 gap-1 max-h-48 overflow-y-auto border border-gray-100 rounded-lg p-2",children:U.map(l=>e.jsxs("label",{className:"flex items-center gap-2 px-1 py-0.5 rounded hover:bg-gray-50 cursor-pointer",children:[e.jsx("input",{type:"checkbox",checked:y.includes(l),onChange:()=>f(l),className:"accent-green-600 w-3.5 h-3.5"}),e.jsx("span",{className:"text-xs text-gray-700",children:l})]},l))}),e.jsx("p",{className:"text-xs text-gray-400 mt-1",children:y.length===0?"Όλες οι κατηγορίες":`${y.length} επιλεγμένες`})]})]}),e.jsxs("div",{className:"px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl",children:[e.jsxs("div",{className:"flex items-center justify-between mb-3",children:[e.jsxs("div",{className:"text-sm text-gray-600",children:[e.jsx("span",{className:"font-bold text-gray-800",children:a.length})," παραστατικά",b>0&&e.jsxs("span",{className:"text-green-600 ml-2",children:["· ",b," με αποδεικτικό"]}),a.length-b>0&&e.jsxs("span",{className:"text-gray-400 ml-2",children:["· ",a.length-b," χωρίς"]})]}),e.jsx("div",{className:"text-sm font-bold text-gray-800",children:"€"+a.reduce((_,N)=>_+(Number(N.total)||0),0).toLocaleString("el-CY",{minimumFractionDigits:2,maximumFractionDigits:2})})]}),I?e.jsxs("div",{className:"flex items-center gap-3 justify-center py-2",children:[e.jsx("div",{className:"w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"}),e.jsx("span",{className:"text-sm text-gray-600",children:P})]}):e.jsxs("div",{className:"flex gap-3",children:[e.jsx("button",{onClick:()=>g(!1),className:"py-2 px-4 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-100 transition-colors",children:"Ακύρωση"}),e.jsx("button",{onClick:A,disabled:a.length===0,className:"flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed",children:"📊 Excel"}),e.jsx("button",{onClick:G,disabled:a.length===0,className:"flex-1 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed",children:"🖨️ PDF"})]})]})]})}):e.jsxs("button",{onClick:()=>g(!0),className:"flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-gray-200 bg-white text-gray-600 hover:border-green-400 hover:text-green-700 transition-colors",children:[e.jsx("svg",{className:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"})}),"Εκτύπωση / Export"]})}const R=i=>"€"+(Number(i)||0).toLocaleString("el-CY",{minimumFractionDigits:2,maximumFractionDigits:2}),se=i=>{if(!i)return"—";const[c,g,h]=i.split("-"),z=["Ιαν","Φεβ","Μαρ","Απρ","Μαΐ","Ιουν","Ιουλ","Αυγ","Σεπ","Οκτ","Νοε","Δεκ"];return`${parseInt(h)} ${z[parseInt(g)-1]} ${c}`},fe=["Ιαν","Φεβ","Μαρ","Απρ","Μαΐ","Ιουν","Ιουλ","Αυγ","Σεπ","Οκτ","Νοε","Δεκ"],ae=String(new Date().getFullYear());new Date().getMonth()+1;const ve=/να συμπληρωθεί/i,Y=i=>{const c=[];return(!i.vendor||ve.test(i.vendor))&&c.push("vendor"),(i.total==null||Number(i.total)===0)&&c.push("total"),i.net==null&&c.push("net"),i.vat==null&&c.push("vat"),i.category||c.push("category"),c},V=i=>{if(!i)return"—";const c=i.split("·");return(c[1]||c[0]).trim()};function Ne(){var Q;const{isAccountant:i}=le(),c=i,[g,h]=d.useState([]),[z,u]=d.useState(!0),[m,y]=d.useState(null),[j,E]=d.useState([ae]),[S,I]=d.useState([]),[w,P]=d.useState(""),[$,a]=d.useState(""),[b,f]=d.useState(!1),[A,G]=d.useState("invoice"),[H,l]=d.useState(null),[_,N]=d.useState(null);async function F(t,n){if(!c){N(t);try{await ge(pe(Z,"expenses",t),{category:n})}catch(s){console.error("recategorise failed",s)}finally{N(null)}}}d.useEffect(()=>{const t=ie(de(Z,"expenses"),ce("date","desc"));return xe(t,n=>{h(n.docs.map(s=>({id:s.id,...s.data()})).filter(s=>s.docType!=="deposit_slip")),u(!1)},()=>u(!1))},[]);const k=d.useMemo(()=>{const t=new Set(g.map(n=>(n.date||"").slice(0,4)).filter(Boolean));return t.add(ae),[...t].sort().reverse()},[g]),B=(t,n,s)=>n(t.includes(s)?t.filter(o=>o!==s):[...t,s]),O=t=>{E(n=>n.includes(t)?n.filter(s=>s!==t):[...n,t]),I([])},L=d.useMemo(()=>g.filter(t=>{const n=(t.date||"").slice(0,4),s=parseInt((t.date||"").slice(5,7),10);return!(j.length&&!j.includes(n)||S.length&&!S.includes(s)||w&&t.category!==w||$&&t.location!==$||b&&Y(t).length===0)}),[g,j,S,w,$,b]),q=d.useMemo(()=>g.filter(t=>{const n=(t.date||"").slice(0,4),s=parseInt((t.date||"").slice(5,7),10);return j.length&&!j.includes(n)||S.length&&!S.includes(s)||w&&t.category!==w||$&&t.location!==$?!1:Y(t).length>0}).length,[g,j,S,w,$]),r=d.useMemo(()=>{const t={total:0,vat:0,net:0,count:L.length,byCat:{}};for(const n of L)t.total+=Number(n.total)||0,t.vat+=Number(n.vat)||0,t.net+=Number(n.net)||0,t.byCat[n.category]=(t.byCat[n.category]||0)+(Number(n.total)||0);return t},[L]),p=d.useMemo(()=>{const t=Object.entries(r.byCat).sort((s,o)=>o[1]-s[1]).map(([s])=>s),n={};for(const s of L){const o=s.category||"Άλλο";n[o]||(n[o]=[]),n[o].push(s)}return t.map(s=>({category:s,rows:n[s]||[],catTotal:r.byCat[s]||0}))},[L,r]),W=((Q=p[0])==null?void 0:Q.catTotal)||1,M=d.useMemo(()=>{const t=s=>(s||"").toLowerCase().trim().replace(/[.,]/g,"").replace(/\b(ltd|limited|λτδ|epe|ε\.π\.ε)\b/g,"").replace(/\s+/g," ").trim(),n={};for(const s of L){const o=t(s.vendor)||"—";n[o]||(n[o]={key:o,name:s.vendor||"—",rows:[],total:0,cats:{}});const D=n[o];D.rows.push(s),D.total+=Number(s.total)||0,(s.vendor||"").length>D.name.length&&(D.name=s.vendor),s.category&&(D.cats[s.category]=(D.cats[s.category]||0)+(Number(s.total)||0))}return Object.values(n).sort((s,o)=>o.total-s.total)},[L]),J="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-700";return e.jsxs("div",{className:"max-w-6xl mx-auto px-4 py-6",children:[e.jsxs("div",{className:"flex items-center justify-between mb-5 flex-wrap gap-3",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"text-2xl font-bold text-gray-800",children:"Λογιστικά / Έξοδα"}),e.jsx("p",{className:"text-sm text-gray-500 mt-0.5",children:"Καταχώρηση & ανάλυση εξόδων"})]}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx(be,{expenses:g}),!c&&e.jsx("button",{onClick:()=>y("new"),className:"bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm",children:"+ Νέο Έξοδο"})]})]}),e.jsxs("div",{className:"mb-5 space-y-2.5",children:[e.jsxs("div",{className:"flex gap-1.5 flex-wrap items-center",children:[e.jsx("span",{className:"text-[10px] font-bold text-gray-400 uppercase tracking-wide w-12 shrink-0",children:"Έτος"}),k.map(t=>e.jsx("button",{onClick:()=>O(t),className:`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${j.includes(t)?"bg-green-600 border-green-600 text-white shadow-sm":"bg-white border-gray-200 text-gray-600 hover:border-green-400 hover:text-green-700"}`,children:t},t)),j.length>0&&e.jsx("button",{onClick:()=>E([]),className:"text-xs text-gray-400 hover:text-gray-600 underline ml-1",children:"όλα"})]}),e.jsxs("div",{className:"flex gap-1.5 flex-wrap items-center",children:[e.jsx("span",{className:"text-[10px] font-bold text-gray-400 uppercase tracking-wide w-12 shrink-0",children:"Μήνας"}),fe.map((t,n)=>e.jsx("button",{onClick:()=>B(S,I,n+1),className:`px-2.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${S.includes(n+1)?"bg-green-600 border-green-600 text-white shadow-sm":"bg-white border-gray-200 text-gray-600 hover:border-green-400 hover:text-green-700"}`,children:t},t)),S.length>0&&e.jsx("button",{onClick:()=>I([]),className:"text-xs text-gray-400 hover:text-gray-600 underline ml-1",children:"όλοι"})]}),e.jsxs("div",{className:"flex gap-3 flex-wrap items-center",children:[e.jsxs("select",{className:J,value:w,onChange:t=>P(t.target.value),children:[e.jsx("option",{value:"",children:"Όλες οι κατηγορίες"}),U.map(t=>e.jsx("option",{value:t,children:t},t))]}),e.jsxs("select",{className:J,value:$,onChange:t=>a(t.target.value),children:[e.jsx("option",{value:"",children:"Όλες οι τοποθεσίες"}),re.map(t=>e.jsx("option",{value:t,children:t},t))]}),q>0&&e.jsxs("button",{onClick:()=>f(t=>!t),className:`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${b?"bg-red-600 border-red-600 text-white shadow-sm":"bg-white border-red-200 text-red-600 hover:border-red-400"}`,children:["⚠ ",q," χρειάζονται συμπλήρωση"]})]})]}),e.jsxs("div",{className:"grid grid-cols-2 md:grid-cols-4 gap-3 mb-6",children:[e.jsx(X,{label:"Σύνολο εξόδων",value:R(r.total),accent:"text-gray-900"}),e.jsx(X,{label:"ΦΠΑ (input)",value:R(r.vat),accent:"text-amber-600"}),e.jsx(X,{label:"Καθαρό",value:R(r.net),accent:"text-gray-700"}),e.jsx(X,{label:"Παραστατικά",value:r.count,accent:"text-green-700"})]}),p.length>0&&e.jsxs("div",{className:"bg-white border border-gray-200 rounded-xl p-4 mb-6",children:[e.jsxs("div",{className:"flex items-center justify-between mb-3",children:[e.jsx("h3",{className:"text-sm font-semibold text-gray-500 uppercase tracking-wide",children:"Ανά κατηγορία"}),w&&e.jsx("button",{onClick:()=>P(""),className:"text-xs text-green-600 hover:underline font-medium",children:"✕ καθαρισμός φίλτρου"})]}),e.jsx("div",{className:"space-y-1",children:p.map(({category:t,catTotal:n})=>{const s=w===t;return e.jsxs("button",{onClick:()=>P(s?"":t),className:`w-full flex items-center gap-3 text-sm rounded-lg px-2 py-1.5 -mx-2 transition-colors text-left ${s?"bg-green-50 ring-1 ring-green-300":"hover:bg-gray-50"}`,children:[e.jsx("span",{className:`w-52 shrink-0 truncate ${s?"text-green-800 font-semibold":"text-gray-600"}`,children:t}),e.jsx("div",{className:"flex-1 bg-gray-100 rounded-full h-4 overflow-hidden",children:e.jsx("div",{className:`h-full rounded-full ${s?"bg-gradient-to-r from-green-500 to-green-700":"bg-gradient-to-r from-green-400 to-green-600"}`,style:{width:`${n/W*100}%`}})}),e.jsx("span",{className:`w-24 text-right font-semibold shrink-0 ${s?"text-green-800":"text-gray-700"}`,children:R(n)})]},t)})}),e.jsx("p",{className:"text-xs text-gray-400 mt-2",children:"Κάνε κλικ σε μια κατηγορία για να δεις τις αποδείξεις της παρακάτω."})]}),e.jsxs("div",{className:"flex items-center gap-2 mb-3",children:[e.jsx("span",{className:"text-xs font-bold text-gray-400 uppercase tracking-wide mr-1",children:"Προβολή"}),[["invoice","🧾 Ανά τιμολόγιο"],["merchant","🏷️ Ανά προμηθευτή"]].map(([t,n])=>e.jsx("button",{onClick:()=>G(t),className:`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${A===t?"bg-green-600 border-green-600 text-white shadow-sm":"bg-white border-gray-200 text-gray-600 hover:border-green-400 hover:text-green-700"}`,children:n},t)),A==="merchant"&&e.jsxs("span",{className:"text-sm text-gray-500 ml-1",children:[M.length," προμηθευτές"]})]}),!z&&L.length>0&&A==="merchant"&&e.jsxs("div",{className:"bg-white border border-gray-200 rounded-xl overflow-hidden",children:[M.map(t=>{var D;const n=H===t.key,s=(D=Object.entries(t.cats).sort((x,T)=>T[1]-x[1])[0])==null?void 0:D[0],o=t.rows.filter(x=>Y(x).length>0).length;return e.jsxs("div",{className:"border-b border-gray-100 last:border-0",children:[e.jsxs("button",{onClick:()=>l(n?null:t.key),className:"w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-green-50 transition-colors",children:[e.jsx("span",{className:`text-gray-400 transition-transform ${n?"rotate-90":""}`,children:"▶"}),e.jsxs("span",{className:"flex-1 min-w-0",children:[e.jsx("span",{className:"text-sm font-semibold text-gray-800 truncate block",children:t.name}),e.jsxs("span",{className:"text-xs text-gray-400",children:[t.rows.length," τιμολόγια",s?` · κυρίως ${V(s)}`:""]})]}),o>0&&e.jsxs("span",{className:"text-[10px] font-bold uppercase bg-red-100 text-red-600 px-1.5 py-0.5 rounded",children:[o," needs action"]}),e.jsx("span",{className:"text-sm font-bold text-gray-900 shrink-0",children:R(t.total)})]}),n&&e.jsx("div",{className:"bg-gray-50/60 border-t border-gray-100",children:t.rows.map(x=>{const T=Y(x);return e.jsxs("div",{onClick:()=>y(x),className:`flex items-center gap-3 pl-10 pr-4 py-2.5 cursor-pointer border-b border-gray-100 last:border-0 transition-colors ${T.length?"hover:bg-red-50":"hover:bg-green-50"}`,children:[e.jsx("span",{className:"text-xs text-gray-500 w-24 shrink-0",children:se(x.date)}),e.jsxs("select",{value:x.category||"",disabled:c,onClick:v=>v.stopPropagation(),onChange:v=>{v.stopPropagation(),F(x.id,v.target.value)},className:`flex-1 min-w-0 text-xs bg-transparent border border-transparent rounded px-1 cursor-pointer hover:border-gray-300 hover:bg-white focus:bg-white focus:border-green-400 focus:outline-none ${_===x.id?"opacity-40":""} ${T.includes("category")?"text-red-600 font-semibold":"text-gray-600"}`,children:[!U.includes(x.category)&&x.category&&e.jsx("option",{value:x.category,children:V(x.category)}),U.map(v=>e.jsx("option",{value:v,children:V(v)},v))]}),e.jsx(ee,{expense:x}),x.fileUrl?e.jsx("span",{className:"text-green-500 text-xs shrink-0",title:"Έχει αποδεικτικό",children:"📎"}):e.jsx("span",{className:"w-3 shrink-0"}),e.jsx("span",{className:`text-sm font-semibold text-right w-20 shrink-0 ${T.includes("total")?"text-red-600":"text-gray-900"}`,children:R(x.total)})]},x.id)})})]},t.key)}),e.jsxs("div",{className:"flex items-center justify-between px-4 py-3 bg-green-50 border-t border-green-200",children:[e.jsxs("span",{className:"text-sm font-semibold text-green-800",children:["Σύνολο (",M.length," προμηθευτές)"]}),e.jsx("span",{className:"text-lg font-bold text-green-900",children:R(r.total)})]})]}),z?e.jsx("div",{className:"text-center py-16 text-gray-400",children:"Φόρτωση…"}):L.length===0?e.jsx("div",{className:"text-center py-16 text-gray-400",children:"Δεν υπάρχουν έξοδα για αυτά τα φίλτρα"}):A==="invoice"?e.jsxs("div",{className:"bg-white border border-gray-200 rounded-xl overflow-hidden",children:[e.jsxs("div",{className:"hidden md:grid grid-cols-[1.6rem_6rem_1fr_6rem_7rem_4.5rem_5rem_5.5rem] gap-x-3 px-4 py-2 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-400 uppercase tracking-wide",children:[e.jsx("span",{}),e.jsx("span",{children:"Ημερομηνία"}),e.jsx("span",{children:"Προμηθευτής"}),e.jsx("span",{children:"Σημειώσεις"}),e.jsx("span",{children:"Κατηγορία"}),e.jsx("span",{className:"text-right",children:"Καθαρό"}),e.jsx("span",{className:"text-right",children:"ΦΠΑ"}),e.jsx("span",{className:"text-right",children:"Σύνολο"})]}),p.map(({category:t,rows:n,catTotal:s})=>e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-100",children:[e.jsx("span",{className:"text-sm font-semibold text-gray-700",children:t}),e.jsx("span",{className:"text-sm font-bold text-gray-800",children:R(s)})]}),n.map((o,D)=>{const x=Y(o),T=x.length>0;return e.jsxs("div",{onClick:()=>y(o),className:`grid grid-cols-[1.6rem_1fr] md:grid-cols-[1.6rem_6rem_1fr_6rem_7rem_4.5rem_5rem_5.5rem] gap-x-3 items-center px-4 py-3 cursor-pointer transition-colors ${D<n.length-1?"border-b border-gray-100":""} ${T?"bg-red-50/60 hover:bg-red-50 border-l-2 border-l-red-400":"hover:bg-green-50"}`,children:[e.jsx("span",{className:"text-gray-300 text-base",title:o.fileUrl?"Έχει αποδεικτικό":"Χωρίς αποδεικτικό",children:o.fileUrl?e.jsx("svg",{viewBox:"0 0 20 20",fill:"currentColor",className:"w-4 h-4 text-green-500",children:e.jsx("path",{fillRule:"evenodd",d:"M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z",clipRule:"evenodd"})}):e.jsx("svg",{viewBox:"0 0 20 20",fill:"currentColor",className:"w-4 h-4 text-gray-200",children:e.jsx("path",{fillRule:"evenodd",d:"M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z",clipRule:"evenodd"})})}),e.jsx("span",{className:"text-sm text-gray-500 whitespace-nowrap",children:se(o.date)}),e.jsxs("span",{className:"text-sm font-medium text-gray-800 truncate flex items-center gap-1.5 min-w-0",children:[e.jsx("span",{className:`truncate ${x.includes("vendor")?"text-red-600":""}`,children:o.vendor||"— προμηθευτής"}),T&&e.jsx("span",{className:"shrink-0 text-[10px] font-bold uppercase tracking-wide bg-red-100 text-red-600 px-1.5 py-0.5 rounded",children:"needs action"}),e.jsx(ee,{expense:o})]}),e.jsx("span",{className:"hidden md:block text-xs text-gray-400 truncate",children:o.notes||o.invoiceNumber||""}),e.jsxs("select",{value:o.category||"",disabled:c,onClick:v=>v.stopPropagation(),onChange:v=>{v.stopPropagation(),F(o.id,v.target.value)},title:"Αλλαγή κατηγορίας",className:`hidden md:block text-xs truncate bg-transparent border border-transparent rounded px-1 -ml-1 cursor-pointer hover:border-gray-300 hover:bg-gray-50 focus:bg-white focus:border-green-400 focus:outline-none ${_===o.id?"opacity-40":""} ${x.includes("category")?"text-red-600 font-semibold":"text-gray-600"}`,children:[!U.includes(o.category)&&o.category&&e.jsx("option",{value:o.category,children:V(o.category)}),U.map(v=>e.jsx("option",{value:v,children:V(v)},v))]}),e.jsx("span",{className:`hidden md:block text-sm text-right ${x.includes("net")?"text-red-500 font-semibold":"text-gray-600"}`,children:o.net!=null?R(o.net):"λείπει"}),e.jsxs("span",{className:`hidden md:block text-sm text-right ${x.includes("vat")?"text-red-500 font-semibold":"text-amber-600"}`,children:[o.vat!=null?R(o.vat):"λείπει",o.vatRate!=null?e.jsxs("span",{className:"text-xs text-gray-400 ml-1",children:[o.vatRate,"%"]}):null]}),e.jsx("span",{className:`text-sm font-semibold text-right ${x.includes("total")?"text-red-600":"text-gray-900"}`,children:R(o.total)})]},o.id)}),e.jsx("div",{className:"flex justify-end px-4 py-2 bg-gray-50 border-t border-gray-100 text-sm font-bold text-gray-700",children:R(s)})]},t)),e.jsxs("div",{className:"flex items-center justify-between px-4 py-3 bg-green-50 border-t border-green-200",children:[e.jsxs("span",{className:"text-sm font-semibold text-green-800",children:["Σύνολο (",r.count," παραστατικά)"]}),e.jsx("span",{className:"text-lg font-bold text-green-900",children:R(r.total)})]})]}):null,m&&e.jsx(me,{existing:m==="new"?null:m,readOnly:c,onClose:()=>y(null)})]})}function X({label:i,value:c,accent:g}){return e.jsxs("div",{className:"bg-white border border-gray-200 rounded-xl p-4",children:[e.jsx("p",{className:"text-xs text-gray-400 uppercase tracking-wide",children:i}),e.jsx("p",{className:`text-xl font-bold mt-1 ${g}`,children:c})]})}export{Ne as default,Y as missingFields};
