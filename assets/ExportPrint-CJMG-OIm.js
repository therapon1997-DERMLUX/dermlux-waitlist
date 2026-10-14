const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/pdf-DZ_w75Nj.js","assets/index-DQ4Iedo3.js","assets/index-BwHbx1fS.css"])))=>i.map(i=>d[i]);
import{r as _,j as t,_ as A,v as B}from"./index-DQ4Iedo3.js";import{L as H,C as U}from"./ExpenseModal-B7dcp53Q.js";const h=o=>"€"+(Number(o)||0).toLocaleString("el-CY",{minimumFractionDigits:2,maximumFractionDigits:2}),M=o=>{if(!o)return"—";const[x,l,i]=o.split("-"),y=["Ιαν","Φεβ","Μαρ","Απρ","Μαΐ","Ιουν","Ιουλ","Αυγ","Σεπ","Οκτ","Νοε","Δεκ"];return`${parseInt(i)} ${y[parseInt(l)-1]} ${x}`},w=o=>String(o??"").replace(/[&<>"']/g,x=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[x]);let T=null;async function V(){if(T)return T;const o=await A(()=>import("./pdf-DZ_w75Nj.js"),__vite__mapDeps([0,1,2])),x=(await A(async()=>{const{default:l}=await import("./pdf.worker.min-DAeWuO54.js");return{default:l}},[])).default;return o.GlobalWorkerOptions.workerSrc=x,T=o,o}async function W(o){const l=await(await V()).getDocument({data:o}).promise,i=[];for(let y=1;y<=l.numPages;y++){const u=await l.getPage(y),d=u.getViewport({scale:2}),n=document.createElement("canvas");n.width=d.width,n.height=d.height,await u.render({canvasContext:n.getContext("2d"),viewport:d}).promise,i.push(n.toDataURL("image/jpeg",.85))}return i}async function G(o){var x;if(!o)return[];try{const l=await((x=B().currentUser)==null?void 0:x.getIdToken());if(!l)return[];const i=await fetch(o,{headers:{Authorization:`Bearer ${l}`}});if(!i.ok)return[];if((i.headers.get("content-type")||"").toLowerCase().includes("pdf")||/\.pdf(\?|$)/i.test(o))try{return await W(await i.arrayBuffer())}catch{return[]}const d=await i.blob(),n=await new Promise(v=>{const f=new FileReader;f.onload=()=>v(f.result),f.onerror=()=>v(null),f.readAsDataURL(d)});return n?[n]:[]}catch{return[]}}function X({expenses:o,dateFrom:x,dateTo:l,cats:i,loc:y,receiptMap:u}){const d={total:0,vat:0,net:0},n={};for(const s of o)d.total+=Number(s.total)||0,d.vat+=Number(s.vat)||0,d.net+=Number(s.net)||0,n[s.category]=(n[s.category]||0)+(Number(s.total)||0);const v=Object.entries(n).sort((s,g)=>g[1]-s[1]),f=o.filter(s=>(u[s.id]||[]).length>0).length,P=v.map(([s])=>({cat:s,rows:o.filter(g=>(g.category||"")===s)})),F=new Date().toLocaleDateString("el-GR",{day:"2-digit",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"}),C=[x||l?`${x||"…"} – ${l||"…"}`:"",i.length?i.join(", "):"",y||""].filter(Boolean).join(" · ")||"Όλα",I=P.map(({cat:s,rows:g})=>`
    <tr class="cat-header">
      <td colspan="6">${w(s)}</td>
      <td class="num bold">${h(g.reduce((r,R)=>r+(Number(R.total)||0),0))}</td>
    </tr>
    ${g.map(r=>`
    <tr>
      <td>${M(r.date)}</td>
      <td>${w(r.vendor)||"—"}</td>
      <td class="muted">${w(r.invoiceNumber)}</td>
      <td class="muted">${w(r.notes)}</td>
      <td class="num">${r.net!=null?h(r.net):"—"}</td>
      <td class="num amber">${r.vat!=null?h(r.vat):"—"}${r.vatRate!=null?`<span class="rate"> ${r.vatRate}%</span>`:""}</td>
      <td class="num bold">${h(r.total)}</td>
    </tr>`).join("")}
  `).join(""),j=[...o].sort((s,g)=>(s.date||"").localeCompare(g.date||"")),m=j.map((s,g)=>{const r=u[s.id]||[],R=k=>`
      <div class="receipt-header">
        <div>
          <div class="receipt-vendor">${w(s.vendor)||"—"}</div>
          <div class="receipt-meta">${M(s.date)}${s.invoiceNumber?" · #"+w(s.invoiceNumber):""}${k||""}</div>
          <div class="receipt-cat">${w(s.category)}</div>
        </div>
        <div class="receipt-amounts">
          <div class="receipt-idx">${g+1}/${j.length}</div>
          <div class="receipt-total">${h(s.total)}</div>
          ${s.vat!=null?`<div class="receipt-vat">ΦΠΑ ${h(s.vat)}${s.vatRate!=null?` (${s.vatRate}%)`:""}</div>`:""}
          ${s.net!=null?`<div class="receipt-net">Καθαρό ${h(s.net)}</div>`:""}
        </div>
      </div>`;return r.length===0?`<div class="receipt-page">${R("")}
        <div class="no-img">${s.fileUrl?"Το αρχείο του αποδεικτικού δεν φορτώθηκε.":"Χωρίς αποδεικτικό αρχείο."}</div>
      </div>`:r.map((k,e)=>`
      <div class="receipt-page">${R(r.length>1?` · σελ. ${e+1}/${r.length}`:"")}
        <div class="receipt-img-wrap"><img src="${k}" alt="Αποδεικτικό ${w(s.vendor)}" /></div>
      </div>`).join("")}).join("");return`<!DOCTYPE html>
<html lang="el">
<head>
<meta charset="utf-8">
<title>Dermlux_Εξοδα_${(x||"")+(l?"_εως_"+l:"")}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11px; color: #1a1a1a; background: #fff; }
  .cover { padding: 36px 40px 28px; border-bottom: 3px solid #16a34a; margin-bottom: 28px; }
  .cover-brand { font-size: 22px; font-weight: 700; color: #16a34a; letter-spacing: .5px; }
  .cover-title  { font-size: 16px; font-weight: 600; color: #222; margin-top: 6px; }
  .cover-meta   { font-size: 10px; color: #666; margin-top: 4px; }
  .cover-totals { display: flex; gap: 32px; margin-top: 20px; flex-wrap: wrap; }
  .cover-stat .val  { font-size: 20px; font-weight: 700; color: #111; }
  .cover-stat .lbl  { font-size: 9px; text-transform: uppercase; letter-spacing: .6px; color: #888; margin-top: 1px; }
  h2 { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: .6px; color: #16a34a; margin: 24px 40px 10px; }
  table { width: calc(100% - 80px); margin: 0 40px; border-collapse: collapse; }
  th { font-size: 9px; text-transform: uppercase; letter-spacing: .5px; color: #888; border-bottom: 1px solid #ddd; padding: 5px 6px; text-align: left; }
  td { padding: 5px 6px; border-bottom: 1px solid #f0f0f0; vertical-align: top; }
  .num { text-align: right; } .bold { font-weight: 600; } .amber { color: #b45309; }
  .muted { color: #777; font-size: 10px; } .rate { color: #aaa; font-size: 9px; }
  tr.cat-header td { background: #f0fdf4; font-weight: 700; font-size: 10.5px; color: #166534; padding: 6px 6px; border-top: 1px solid #bbf7d0; border-bottom: 1px solid #bbf7d0; }
  .grand-total { width: calc(100% - 80px); margin: 10px 40px 0; display: flex; justify-content: flex-end; padding: 8px 6px; border-top: 2px solid #16a34a; gap: 16px; font-weight: 700; font-size: 12px; }
  .cat-bars { margin: 16px 40px; }
  .cat-bar-row { display: flex; align-items: center; gap: 10px; margin-bottom: 5px; }
  .cat-bar-label { width: 200px; font-size: 10px; color: #444; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .cat-bar-track { flex: 1; height: 8px; background: #f0f0f0; border-radius: 4px; overflow: hidden; }
  .cat-bar-fill  { height: 100%; background: #16a34a; border-radius: 4px; }
  .cat-bar-val   { width: 80px; text-align: right; font-size: 10px; font-weight: 600; color: #333; }
  .appendix-note { margin: 22px 40px 0; font-size: 10px; color: #888; }
  .receipt-page { page-break-before: always; padding: 22px 32px; }
  .receipt-header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 12px; border-bottom: 2px solid #16a34a; margin-bottom: 16px; }
  .receipt-vendor { font-size: 16px; font-weight: 700; color: #111; }
  .receipt-meta   { font-size: 11px; color: #666; margin-top: 3px; }
  .receipt-cat    { font-size: 10px; color: #16a34a; font-weight: 600; margin-top: 3px; }
  .receipt-amounts { text-align: right; }
  .receipt-idx    { font-size: 9px; color: #aaa; letter-spacing: .5px; }
  .receipt-total  { font-size: 20px; font-weight: 700; color: #111; }
  .receipt-vat    { font-size: 11px; color: #b45309; margin-top: 2px; }
  .receipt-net    { font-size: 11px; color: #555; }
  .receipt-img-wrap { display: flex; justify-content: center; }
  .receipt-img-wrap img { max-width: 100%; max-height: 245mm; object-fit: contain; border: 1px solid #eee; border-radius: 4px; }
  .no-img { padding: 40px; text-align: center; color: #999; font-size: 12px; border: 1px dashed #ddd; border-radius: 8px; }
  @media print { @page { size: A4; margin: 0; } .no-print { display: none !important; } }
</style>
</head>
<body>
<div class="cover">
  <div class="cover-brand">DERMLUX LASER &amp; AESTHETICS LTD</div>
  <div class="cover-title">Έκθεση Εξόδων &amp; Αποδείξεων</div>
  <div class="cover-meta">Φίλτρα: ${w(C)} &nbsp;·&nbsp; Δημιουργήθηκε: ${F}</div>
  <div class="cover-totals">
    <div class="cover-stat"><div class="val">${h(d.total)}</div><div class="lbl">Σύνολο εξόδων</div></div>
    <div class="cover-stat"><div class="val">${h(d.vat)}</div><div class="lbl">ΦΠΑ (input)</div></div>
    <div class="cover-stat"><div class="val">${h(d.net)}</div><div class="lbl">Καθαρό</div></div>
    <div class="cover-stat"><div class="val">${o.length}</div><div class="lbl">Παραστατικά</div></div>
    <div class="cover-stat"><div class="val">${f}/${o.length}</div><div class="lbl">Με αποδεικτικό</div></div>
  </div>
</div>

<h2>Ανά Κατηγορία</h2>
<div class="cat-bars">
  ${v.map(([s,g])=>`
  <div class="cat-bar-row">
    <div class="cat-bar-label">${w(s)}</div>
    <div class="cat-bar-track"><div class="cat-bar-fill" style="width:${v[0][1]?Math.round(g/v[0][1]*100):0}%"></div></div>
    <div class="cat-bar-val">${h(g)}</div>
  </div>`).join("")}
</div>

<h2>Αναλυτική Κατάσταση</h2>
<table>
  <thead>
    <tr>
      <th>Ημερομηνία</th><th>Προμηθευτής</th><th>Αρ. Τιμολογίου</th><th>Σημειώσεις</th>
      <th class="num">Καθαρό</th><th class="num">ΦΠΑ</th><th class="num">Σύνολο</th>
    </tr>
  </thead>
  <tbody>${I}</tbody>
</table>
<div class="grand-total">
  <span>Καθαρό: ${h(d.net)}</span>
  <span>ΦΠΑ: ${h(d.vat)}</span>
  <span>Σύνολο: ${h(d.total)}</span>
</div>

<p class="appendix-note">Ακολουθούν όλα τα παραστατικά 1-1 (${j.length}), σε χρονολογική σειρά — ένα ανά σελίδα, έτοιμα για εκτύπωση.</p>

${m}

</body>
</html>`}function J({expenses:o}){const[x,l]=_.useState(!1),[i,y]=_.useState(""),[u,d]=_.useState(""),[n,v]=_.useState([]),[f,P]=_.useState(""),[F,C]=_.useState(!1),[I,j]=_.useState(""),m=_.useMemo(()=>o.filter(e=>!(i&&e.date<i||u&&e.date>u||n.length&&!n.includes(e.category)||f&&e.location!==f)),[o,i,u,n,f]),s=m.filter(e=>e.fileUrl).length;function g(e){v(b=>b.includes(e)?b.filter(p=>p!==e):[...b,e])}async function r(){C(!0),j("Δημιουργία Excel…");try{const e=await A(()=>import("./xlsx-D_0l8YDs.js"),[]),b=m.map(a=>({Ημερομηνία:a.date||"",Προμηθευτής:a.vendor||"","ΑΦΜ Προμηθευτή":a.vatNumber||"","Αρ. Τιμολογίου":a.invoiceNumber||"",Κατηγορία:a.category||"",Τοποθεσία:a.location||"",Πληρωμή:a.paymentMethod||"",Καθαρό:a.net??"",ΦΠΑ:a.vat??"","ΦΠΑ %":a.vatRate??"",Σύνολο:a.total??"",Τράπεζα:a.bankTagBank||(a.paymentMethod==="Μετρητά"?"Ταμείο (μετρητά)":""),"Ημ/νία πληρωμής":a.bankTagDate||"","Ref τράπεζας":a.bankTagRef||"",Σημειώσεις:a.notes||"",Αποδεικτικό:a.fileUrl?"ΝΑΙ":"ΟΧΙ"})),p={};for(const a of m){const c=a.vatRate??"—",O=(a.category||"").startsWith("8202")?"ΜΗ εκπιπτόμενο (εστίαση/φιλοξενία)":"Εκπιπτόμενο",D=`${c}|${O}`;p[D]||(p[D]={rate:c,claim:O,net:0,vat:0,total:0,n:0}),p[D].net+=Number(a.net)||0,p[D].vat+=Number(a.vat)||0,p[D].total+=Number(a.total)||0,p[D].n++}const E=Object.values(p).sort((a,c)=>(c.rate||0)-(a.rate||0)).map(a=>({"ΦΠΑ %":a.rate,Χαρακτηρισμός:a.claim,Παραστατικά:a.n,Καθαρό:+a.net.toFixed(2),ΦΠΑ:+a.vat.toFixed(2),Σύνολο:+a.total.toFixed(2)})),$={};for(const a of m){const c=a.category||"—";$[c]||($[c]={net:0,vat:0,total:0,n:0}),$[c].net+=Number(a.net)||0,$[c].vat+=Number(a.vat)||0,$[c].total+=Number(a.total)||0,$[c].n++}const N=Object.entries($).sort((a,c)=>c[1].total-a[1].total).map(([a,c])=>({Κατηγορία:a,Παραστατικά:c.n,Καθαρό:+c.net.toFixed(2),ΦΠΑ:+c.vat.toFixed(2),Σύνολο:+c.total.toFixed(2)})),z=e.utils.book_new(),S=e.utils.json_to_sheet(b);S["!cols"]=[{wch:11},{wch:32},{wch:12},{wch:18},{wch:26},{wch:10},{wch:10},{wch:10},{wch:9},{wch:6},{wch:10},{wch:16},{wch:12},{wch:22},{wch:28},{wch:10}],e.utils.book_append_sheet(z,S,"Αναλυτικά"),e.utils.book_append_sheet(z,e.utils.json_to_sheet(E),"ΦΠΑ ανά συντελεστή"),e.utils.book_append_sheet(z,e.utils.json_to_sheet(N),"Ανά κατηγορία");const L=[i,u].filter(Boolean).join("_εως_")||"ολα";e.writeFile(z,`Dermlux_Εξοδα_${L}.xlsx`)}finally{C(!1),j("")}}async function R(){if(!m.length)return;const e=window.open("","_blank");if(!e){alert("Ο browser μπλόκαρε το νέο παράθυρο. Επίτρεψε τα pop-ups για αυτή τη σελίδα και ξαναπάτησε «PDF».");return}const b=p=>{try{e.document.open(),e.document.write(`<!doctype html><html lang="el"><head><meta charset="utf-8"><title>Δημιουργία…</title></head><body style="font-family:Segoe UI,Arial,sans-serif;padding:48px;color:#333"><h2 style="color:#16a34a;margin-bottom:8px">Δημιουργία εκτύπωσης…</h2><p>${w(p)}</p><p style="color:#999;margin-top:12px">Μην κλείσεις αυτό το παράθυρο.</p></body></html>`),e.document.close()}catch{}};b("Προετοιμασία…"),C(!0);try{const p={},E=m.filter(N=>N.fileUrl);for(let N=0;N<E.length;N++){const z=E[N],S=`Φόρτωση αποδείξεων ${N+1}/${E.length}…`;j(S),b(S);const L=await G(z.fileUrl);L.length&&(p[z.id]=L)}j("Δημιουργία σελίδας…"),b("Δημιουργία σελίδας…");const $=X({expenses:m,dateFrom:i,dateTo:u,cats:n,loc:f,receiptMap:p});e.document.open(),e.document.write($),e.document.close(),e.focus(),setTimeout(()=>{try{e.print()}catch{}},900)}finally{C(!1),j("")}}const k="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white w-full";return x?t.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4",children:t.jsxs("div",{className:"bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col",children:[t.jsxs("div",{className:"flex items-center justify-between px-6 py-4 border-b border-gray-100",children:[t.jsxs("div",{children:[t.jsx("h2",{className:"text-base font-bold text-gray-800",children:"Εκτύπωση / Export PDF"}),t.jsx("p",{className:"text-xs text-gray-400 mt-0.5",children:"Report + όλες οι αποδείξεις 1-1 (και PDF), έτοιμες για print"})]}),t.jsx("button",{onClick:()=>l(!1),className:"text-gray-400 hover:text-gray-600 text-xl leading-none",children:"×"})]}),t.jsxs("div",{className:"flex-1 overflow-y-auto px-6 py-4 space-y-5",children:[t.jsxs("div",{children:[t.jsx("label",{className:"block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2",children:"Εύρος ημερομηνιών"}),t.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[t.jsxs("div",{children:[t.jsx("label",{className:"text-xs text-gray-400 mb-1 block",children:"Από"}),t.jsx("input",{type:"date",className:k,value:i,onChange:e=>y(e.target.value)})]}),t.jsxs("div",{children:[t.jsx("label",{className:"text-xs text-gray-400 mb-1 block",children:"Έως"}),t.jsx("input",{type:"date",className:k,value:u,onChange:e=>d(e.target.value)})]})]})]}),t.jsxs("div",{children:[t.jsx("label",{className:"block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2",children:"Τοποθεσία"}),t.jsxs("select",{className:k,value:f,onChange:e=>P(e.target.value),children:[t.jsx("option",{value:"",children:"Όλες"}),H.map(e=>t.jsx("option",{value:e,children:e},e))]})]}),t.jsxs("div",{children:[t.jsxs("div",{className:"flex items-center justify-between mb-2",children:[t.jsx("label",{className:"text-xs font-semibold text-gray-500 uppercase tracking-wide",children:"Κατηγορίες"}),t.jsxs("div",{className:"flex gap-2",children:[t.jsx("button",{onClick:()=>v([...U]),className:"text-xs text-green-600 hover:underline",children:"Όλες"}),t.jsx("span",{className:"text-gray-300",children:"·"}),t.jsx("button",{onClick:()=>v([]),className:"text-xs text-gray-400 hover:underline",children:"Καμία"})]})]}),t.jsx("div",{className:"grid grid-cols-1 gap-1 max-h-48 overflow-y-auto border border-gray-100 rounded-lg p-2",children:U.map(e=>t.jsxs("label",{className:"flex items-center gap-2 px-1 py-0.5 rounded hover:bg-gray-50 cursor-pointer",children:[t.jsx("input",{type:"checkbox",checked:n.includes(e),onChange:()=>g(e),className:"accent-green-600 w-3.5 h-3.5"}),t.jsx("span",{className:"text-xs text-gray-700",children:e})]},e))}),t.jsx("p",{className:"text-xs text-gray-400 mt-1",children:n.length===0?"Όλες οι κατηγορίες":`${n.length} επιλεγμένες`})]})]}),t.jsxs("div",{className:"px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl",children:[t.jsxs("div",{className:"flex items-center justify-between mb-3",children:[t.jsxs("div",{className:"text-sm text-gray-600",children:[t.jsx("span",{className:"font-bold text-gray-800",children:m.length})," παραστατικά",s>0&&t.jsxs("span",{className:"text-green-600 ml-2",children:["· ",s," με αποδεικτικό"]}),m.length-s>0&&t.jsxs("span",{className:"text-gray-400 ml-2",children:["· ",m.length-s," χωρίς"]})]}),t.jsx("div",{className:"text-sm font-bold text-gray-800",children:"€"+m.reduce((b,p)=>b+(Number(p.total)||0),0).toLocaleString("el-CY",{minimumFractionDigits:2,maximumFractionDigits:2})})]}),F?t.jsxs("div",{className:"flex items-center gap-3 justify-center py-2",children:[t.jsx("div",{className:"w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"}),t.jsx("span",{className:"text-sm text-gray-600",children:I})]}):t.jsxs("div",{className:"flex gap-3",children:[t.jsx("button",{onClick:()=>l(!1),className:"py-2 px-4 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-100 transition-colors",children:"Ακύρωση"}),t.jsx("button",{onClick:r,disabled:m.length===0,className:"flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed",children:"📊 Excel"}),t.jsx("button",{onClick:R,disabled:m.length===0,className:"flex-1 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed",children:"🖨️ PDF"})]}),t.jsx("p",{className:"text-[11px] text-gray-400 mt-2 text-center",children:"Στο παράθυρο εκτύπωσης επίλεξε «Αποθήκευση ως PDF» για download."})]})]})}):t.jsxs("button",{onClick:()=>l(!0),className:"flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-gray-200 bg-white text-gray-600 hover:border-green-400 hover:text-green-700 transition-colors",children:[t.jsx("svg",{className:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:t.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"})}),"Εκτύπωση / Export"]})}export{J as E,G as a,X as b,w as c,h as e,M as f};
