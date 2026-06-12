import{u as te,r as d,j as e,a as ae,d as K,b as P,i as se,c as ee,g as G,f as re,k as ne,q as le,e as oe,o as ie}from"./index-DgeijHci.js";const M=["6201 · ΑΓΟΡΕΣ","8103 · ΕΝΟΙΚΙΑ","8105 · ΠΛΗΡΩΜΕΣ ΕΙΣ ΤΡΙΤΟΥΣ","8106 · ΤΗΛΕΦΩΝΙΚΑ","8108 · ΗΛΕΚΤΡΙΣΜΟΣ","8109 · ΝΕΡΟ","8110 · ΚΑΘΑΡΙΟΤΗΤΑ","8111 · ΓΡΑΦΙΚΗ ΥΛΗ","8112 · ΣΥΝΤΗΡΙΣΗ ΜΗΧΑΝΗΜΑΤΩΝ","8115 · ΕΛΕΓΚΤΙΚΑ","8116 · ΑΣΦΑΛΙΣΤΡΑ","8117 · ΔΙΚΗΓΟΡΙΚΑ","8119 · ΔΙΑΦΟΡΑ ΕΞΟΔΑ","8120 · ΦΟΡΟΙ & ΑΔΕΙΕΣ","8122 · ΕΙΣΦΟΡΕΣ - ΣΥΝΔΡΟΜΕΣ","8133 · ΣΥΝΤΗΡΙΣΗ ΚΤΙΡΙΩΝ","8136 · ΑΛΛΑ ΕΞΟΔΑ ΠΡΟΣΩΠΙΚΟΥ","8138 · ΕΦΟΔΙΑ & ΣΥΝΤΗΡΙΣΗ Η/Υ","8144 · ΕΚΤΕΛΩΝΙΣΤΙΚΑ","8151 · ΑΝΑΛΥΣΕΙΣ ΧΗΜΕΙΟΥ","8201 · ΠΡΟΜΗΘΕΙΑ - BONUS","8202 · ΠΕΡΙΠΟΙΗΣΗ ΠΕΛΑΤΩΝ","8203 · ΔΙΑΦΗΜΙΣΕΙΣ","8204 · ΜΕΤΑΦΟΡΙΚΑ","8205 · ΕΞΟΔΑ ΟΧΗΜΑΤΩΝ","8400 · ΤΟΚΟΙ & ΕΞΟΔΑ ΤΡΕΧΟΥΜΕΝΟΥ"],Y=["Πάφος","Λευκωσία","Λεμεσός","Λάρνακα","Γενικά"],ce=["Μετρητά","Κάρτα","Τραπεζική","Άλλο"],I="  https://empty-hall-968f.therapon1997.workers.dev",J={vendor:"",vatNumber:"",invoiceNumber:"",date:new Date().toISOString().slice(0,10),net:"",vat:"",vatRate:19,total:"",currency:"EUR",category:"8119 · ΔΙΑΦΟΡΑ ΕΞΟΔΑ",location:"Γενικά",paymentMethod:"Κάρτα",notes:""};function de(n){return new Promise((u,p)=>{const x=new FileReader;x.onload=()=>u(String(x.result).split(",")[1]),x.onerror=p,x.readAsDataURL(n)})}function xe({existing:n,onClose:u}){const{userProfile:p,currentUser:x}=te(),v=!!n,[l,m]=d.useState(n?{...J,...n}:J),[f,$]=d.useState((n==null?void 0:n.fileUrl)||""),[R,E]=d.useState((n==null?void 0:n.fileName)||""),[z,T]=d.useState(v?"form":"upload"),[k,h]=d.useState(""),[s,b]=d.useState(!1),[g,N]=d.useState(""),r=d.useRef(null);d.useEffect(()=>{if(z!=="upload")return;function t(c){var S;const j=[...((S=c.clipboardData)==null?void 0:S.items)||[]].find(U=>U.type.startsWith("image/"));j&&o(j.getAsFile())}return document.addEventListener("paste",t),()=>document.removeEventListener("paste",t)},[z]);function a(t,c){m(j=>({...j,[t]:c}))}function i(t){const c=parseFloat(t.net),j=parseFloat(t.vatRate);if(!isNaN(c)&&!isNaN(j)){const S=+(c*j/100).toFixed(2);return{...t,vat:S,total:+(c+S).toFixed(2)}}return t}async function o(t){if(t){if(t.size>12*1024*1024){N("Το αρχείο είναι πολύ μεγάλο (max 12MB).");return}N(""),T("reading"),h("Μεταφόρτωση αρχείου…");try{const c=await de(t),j=await x.getIdToken(),S=await fetch(`${I}/upload-invoice-file`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${j}`},body:JSON.stringify({base64:c,mediaType:t.type,fileName:t.name||`invoice_${Date.now()}`})});if(!S.ok)throw new Error("Upload failed");const{fileUrl:U,fileName:H}=await S.json();if($(U),E(t.name||H),I){h("Ανάγνωση τιμολογίου με AI…");try{const W=await fetch(`${I}/extract-invoice`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${j}`},body:JSON.stringify({base64:c,mediaType:t.type,fileName:t.name})}),q=await W.json();if(W.ok&&q.fields){const D=q.fields;m(A=>i({...A,vendor:D.vendor??A.vendor,vatNumber:D.vat_number??A.vatNumber,invoiceNumber:D.invoice_number??A.invoiceNumber,date:D.date||A.date,net:D.net??A.net,vat:D.vat??A.vat,vatRate:D.vat_rate??A.vatRate,total:D.total??A.total,currency:D.currency||A.currency,category:M.includes(D.category)?D.category:A.category})),h("✓ Συμπληρώθηκε αυτόματα — ελέγξτε και αποθηκεύστε.")}else h("Η αυτόματη ανάγνωση δεν ήταν διαθέσιμη — συμπληρώστε χειροκίνητα.")}catch{h("Η αυτόματη ανάγνωση απέτυχε — συμπληρώστε χειροκίνητα.")}}}catch(c){console.error(c),N("Η μεταφόρτωση απέτυχε: "+c.message)}finally{T("form")}}}async function O(t){try{const c=await x.getIdToken(),j=await fetch(t,{headers:{Authorization:`Bearer ${c}`}});if(!j.ok)throw new Error("Failed to load");const S=await j.blob(),U=URL.createObjectURL(S);window.open(U,"_blank")}catch(c){N("Αδυναμία φόρτωσης αρχείου: "+c.message)}}async function L(t){var j,S,U;if(t.preventDefault(),!l.vendor.trim()){N("Ο προμηθευτής είναι υποχρεωτικός.");return}b(!0),N("");const c={vendor:l.vendor.trim(),vatNumber:((j=l.vatNumber)==null?void 0:j.trim())||"",invoiceNumber:((S=l.invoiceNumber)==null?void 0:S.trim())||"",date:l.date,net:parseFloat(l.net)||0,vat:parseFloat(l.vat)||0,vatRate:parseFloat(l.vatRate)||0,total:parseFloat(l.total)||0,currency:l.currency||"EUR",category:l.category,location:l.location,paymentMethod:l.paymentMethod,notes:((U=l.notes)==null?void 0:U.trim())||"",fileUrl:f,fileName:R,updatedAt:G()};try{v?await ae(K(P,"expenses",n.id),c):await se(ee(P,"expenses"),{...c,status:"confirmed",source:I?"ai":"manual",createdAt:G(),createdBy:(p==null?void 0:p.displayName)||""}),u()}catch(H){N("Η αποθήκευση απέτυχε: "+H.message),b(!1)}}async function _(){if(v&&confirm("Διαγραφή αυτού του εξόδου;")){b(!0);try{await re(K(P,"expenses",n.id)),u()}catch(t){N("Η διαγραφή απέτυχε: "+t.message),b(!1)}}}const y="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500",C="block text-sm font-medium text-gray-700 mb-1";return e.jsx("div",{className:"fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto",children:e.jsxs("div",{className:"bg-white rounded-xl shadow-xl w-full max-w-lg my-8",children:[e.jsxs("div",{className:"flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white rounded-t-xl",children:[e.jsx("h2",{className:"font-bold text-gray-800 text-lg",children:v?"Επεξεργασία Εξόδου":"Νέο Έξοδο"}),e.jsx("button",{onClick:u,className:"text-gray-400 hover:text-gray-600 text-2xl leading-none",children:"×"})]}),g&&e.jsx("div",{className:"mx-6 mt-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2",children:g}),z==="upload"&&e.jsxs("div",{className:"px-6 py-6",children:[e.jsxs("div",{onClick:()=>{var t;return(t=r.current)==null?void 0:t.click()},onDragOver:t=>t.preventDefault(),onDrop:t=>{var c;t.preventDefault(),o((c=t.dataTransfer.files)==null?void 0:c[0])},className:"border-2 border-dashed border-gray-300 rounded-xl py-12 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/40 transition-colors",children:[e.jsx("div",{className:"text-4xl mb-2",children:"🧾"}),e.jsx("p",{className:"text-gray-700 font-medium",children:"Σύρετε εδώ το τιμολόγιο"}),e.jsx("p",{className:"text-sm text-gray-500 mt-1",children:"ή κάντε κλικ για επιλογή αρχείου · ή επικολλήστε (Ctrl+V) στιγμιότυπο"}),e.jsx("p",{className:"text-xs text-gray-400 mt-2",children:"Φωτογραφία ή PDF — το AI θα διαβάσει τα στοιχεία"})]}),e.jsx("input",{ref:r,type:"file",accept:"image/*,application/pdf",capture:"environment",className:"hidden",onChange:t=>{var c;return o((c=t.target.files)==null?void 0:c[0])}}),e.jsx("button",{onClick:()=>T("form"),className:"mt-4 w-full text-sm text-blue-600 hover:underline",children:"Παράλειψη — καταχώρηση χειροκίνητα"})]}),z==="reading"&&e.jsxs("div",{className:"px-6 py-16 text-center",children:[e.jsx("div",{className:"inline-block w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"}),e.jsx("p",{className:"text-gray-600 text-sm",children:k})]}),z==="form"&&e.jsxs("form",{onSubmit:L,className:"px-6 py-4 space-y-4",children:[k&&e.jsx("div",{className:"bg-blue-50 text-blue-700 text-sm rounded-lg px-3 py-2",children:k}),f&&e.jsxs("button",{type:"button",onClick:()=>O(f),className:"inline-flex items-center gap-2 text-sm text-blue-600 hover:underline",children:["📎 ",R||"Συνημμένο αρχείο"]}),e.jsxs("div",{children:[e.jsx("label",{className:C,children:"Προμηθευτής *"}),e.jsx("input",{className:y,value:l.vendor,onChange:t=>a("vendor",t.target.value),placeholder:"Επωνυμία προμηθευτή"})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[e.jsxs("div",{children:[e.jsx("label",{className:C,children:"ΑΦΜ / VAT No"}),e.jsx("input",{className:y,value:l.vatNumber,onChange:t=>a("vatNumber",t.target.value)})]}),e.jsxs("div",{children:[e.jsx("label",{className:C,children:"Αρ. Τιμολογίου"}),e.jsx("input",{className:y,value:l.invoiceNumber,onChange:t=>a("invoiceNumber",t.target.value)})]})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[e.jsxs("div",{children:[e.jsx("label",{className:C,children:"Ημερομηνία"}),e.jsx("input",{type:"date",className:y,value:l.date,onChange:t=>a("date",t.target.value)})]}),e.jsxs("div",{children:[e.jsx("label",{className:C,children:"Νόμισμα"}),e.jsx("input",{className:y,value:l.currency,onChange:t=>a("currency",t.target.value)})]})]}),e.jsxs("div",{className:"grid grid-cols-3 gap-3",children:[e.jsxs("div",{children:[e.jsx("label",{className:C,children:"Καθαρό"}),e.jsx("input",{type:"number",step:"0.01",className:y,value:l.net,onChange:t=>m(c=>i({...c,net:t.target.value}))})]}),e.jsxs("div",{children:[e.jsx("label",{className:C,children:"ΦΠΑ %"}),e.jsx("input",{type:"number",step:"1",className:y,value:l.vatRate,onChange:t=>m(c=>i({...c,vatRate:t.target.value}))})]}),e.jsxs("div",{children:[e.jsx("label",{className:C,children:"Ποσό ΦΠΑ"}),e.jsx("input",{type:"number",step:"0.01",className:y,value:l.vat,onChange:t=>a("vat",t.target.value)})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:C,children:"Σύνολο"}),e.jsx("input",{type:"number",step:"0.01",className:`${y} font-semibold`,value:l.total,onChange:t=>a("total",t.target.value)})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[e.jsxs("div",{children:[e.jsx("label",{className:C,children:"Κατηγορία"}),e.jsx("select",{className:y,value:l.category,onChange:t=>a("category",t.target.value),children:M.map(t=>e.jsx("option",{value:t,children:t},t))})]}),e.jsxs("div",{children:[e.jsx("label",{className:C,children:"Τοποθεσία"}),e.jsx("select",{className:y,value:l.location,onChange:t=>a("location",t.target.value),children:Y.map(t=>e.jsx("option",{value:t,children:t},t))})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:C,children:"Τρόπος Πληρωμής"}),e.jsx("select",{className:y,value:l.paymentMethod,onChange:t=>a("paymentMethod",t.target.value),children:ce.map(t=>e.jsx("option",{value:t,children:t},t))})]}),e.jsxs("div",{children:[e.jsx("label",{className:C,children:"Σημειώσεις"}),e.jsx("textarea",{rows:2,className:y,value:l.notes,onChange:t=>a("notes",t.target.value)})]}),e.jsxs("div",{className:"flex gap-3 pt-2",children:[v&&e.jsx("button",{type:"button",onClick:_,disabled:s,className:"px-4 border border-red-300 text-red-600 py-2 rounded-lg text-sm hover:bg-red-50 transition-colors",children:"Διαγραφή"}),e.jsx("button",{type:"button",onClick:u,className:"flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm hover:bg-gray-50 transition-colors",children:"Ακύρωση"}),e.jsx("button",{type:"submit",disabled:s,className:"flex-1 bg-blue-700 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-800 disabled:opacity-50 transition-colors",children:s?"Αποθήκευση…":"Αποθήκευση"})]})]})]})})}const X="  https://empty-hall-968f.therapon1997.workers.dev",w=n=>"€"+(Number(n)||0).toLocaleString("el-CY",{minimumFractionDigits:2,maximumFractionDigits:2}),V=n=>{if(!n)return"—";const[u,p,x]=n.split("-"),v=["Ιαν","Φεβ","Μαρ","Απρ","Μαΐ","Ιουν","Ιουλ","Αυγ","Σεπ","Οκτ","Νοε","Δεκ"];return`${parseInt(x)} ${v[parseInt(p)-1]} ${u}`};async function me(n){var u;if(!n||!X)return null;try{const p=await((u=ne().currentUser)==null?void 0:u.getIdToken());if(!p)return null;const x=await fetch(`${X}/invoices/${encodeURIComponent(n)}`,{headers:{Authorization:`Bearer ${p}`}});if(!x.ok)return null;const v=await x.blob();return new Promise(l=>{const m=new FileReader;m.onload=()=>l(m.result),m.onerror=()=>l(null),m.readAsDataURL(v)})}catch{return null}}function pe({expenses:n,dateFrom:u,dateTo:p,cats:x,loc:v,imageMap:l}){const m={total:0,vat:0,net:0},f={};for(const s of n)m.total+=Number(s.total)||0,m.vat+=Number(s.vat)||0,m.net+=Number(s.net)||0,f[s.category]=(f[s.category]||0)+(Number(s.total)||0);const $=Object.entries(f).sort((s,b)=>b[1]-s[1]),R=$.map(([s])=>({cat:s,rows:n.filter(b=>(b.category||"")===s)})),E=new Date().toLocaleDateString("el-GR",{day:"2-digit",month:"long",year:"numeric",hour:"2-digit",minute:"2-digit"}),z=[u||p?`${u||"…"} – ${p||"…"}`:"",x.length?x.join(", "):"",v||""].filter(Boolean).join(" · ")||"Όλα",T=R.map(({cat:s,rows:b})=>`
    <tr class="cat-header">
      <td colspan="6">${s}</td>
      <td class="num bold">${w(b.reduce((g,N)=>g+(Number(N.total)||0),0))}</td>
    </tr>
    ${b.map(g=>`
    <tr>
      <td>${V(g.date)}</td>
      <td>${g.vendor||"—"}</td>
      <td class="muted">${g.invoiceNumber||""}</td>
      <td class="muted">${g.notes||""}</td>
      <td class="num">${g.net!=null?w(g.net):"—"}</td>
      <td class="num amber">${g.vat!=null?w(g.vat):"—"}${g.vatRate!=null?`<span class="rate"> ${g.vatRate}%</span>`:""}</td>
      <td class="num bold">${w(g.total)}</td>
    </tr>`).join("")}
  `).join(""),k=n.filter(s=>l[s.id]).map(s=>`
    <div class="receipt-page">
      <div class="receipt-header">
        <div>
          <div class="receipt-vendor">${s.vendor||"—"}</div>
          <div class="receipt-meta">${V(s.date)}${s.invoiceNumber?" · #"+s.invoiceNumber:""}</div>
          <div class="receipt-cat">${s.category||""}</div>
        </div>
        <div class="receipt-amounts">
          <div class="receipt-total">${w(s.total)}</div>
          ${s.vat!=null?`<div class="receipt-vat">ΦΠΑ ${w(s.vat)}${s.vatRate!=null?` (${s.vatRate}%)`:""}</div>`:""}
          ${s.net!=null?`<div class="receipt-net">Καθαρό ${w(s.net)}</div>`:""}
        </div>
      </div>
      <div class="receipt-img-wrap">
        <img src="${l[s.id]}" alt="Αποδεικτικό ${s.vendor||""}" />
      </div>
    </div>
  `).join(""),h=n.filter(s=>!l[s.id]).map(s=>`<li>${V(s.date)} · <strong>${s.vendor||"—"}</strong> · ${w(s.total)}</li>`).join("");return`<!DOCTYPE html>
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
  <div class="cover-meta">Φίλτρα: ${z} &nbsp;·&nbsp; Δημιουργήθηκε: ${E}</div>
  <div class="cover-totals">
    <div class="cover-stat"><div class="val">${w(m.total)}</div><div class="lbl">Σύνολο εξόδων</div></div>
    <div class="cover-stat"><div class="val">${w(m.vat)}</div><div class="lbl">ΦΠΑ (input)</div></div>
    <div class="cover-stat"><div class="val">${w(m.net)}</div><div class="lbl">Καθαρό</div></div>
    <div class="cover-stat"><div class="val">${n.length}</div><div class="lbl">Παραστατικά</div></div>
    <div class="cover-stat"><div class="val">${Object.keys(l).length}</div><div class="lbl">Με αποδεικτικό</div></div>
  </div>
</div>

<!-- Category bars -->
<h2>Ανά Κατηγορία</h2>
<div class="cat-bars">
  ${$.map(([s,b])=>`
  <div class="cat-bar-row">
    <div class="cat-bar-label">${s}</div>
    <div class="cat-bar-track"><div class="cat-bar-fill" style="width:${Math.round(b/$[0][1]*100)}%"></div></div>
    <div class="cat-bar-val">${w(b)}</div>
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
    ${T}
  </tbody>
</table>
<div class="grand-total">
  <span>Καθαρό: ${w(m.net)}</span>
  <span>ΦΠΑ: ${w(m.vat)}</span>
  <span>Σύνολο: ${w(m.total)}</span>
</div>

${h?`
<div class="no-receipt-section">
  <h3>Χωρίς αποδεικτικό (${n.length-Object.keys(l).length})</h3>
  <ul>${h}</ul>
</div>`:""}

${k}

</body>
</html>`}function ue({expenses:n}){const[u,p]=d.useState(!1),[x,v]=d.useState(""),[l,m]=d.useState(""),[f,$]=d.useState([]),[R,E]=d.useState(""),[z,T]=d.useState(!1),[k,h]=d.useState(""),s=d.useMemo(()=>n.filter(a=>!(x&&a.date<x||l&&a.date>l||f.length&&!f.includes(a.category)||R&&a.location!==R)),[n,x,l,f,R]),b=s.filter(a=>a.fileUrl).length;function g(a){$(i=>i.includes(a)?i.filter(o=>o!==a):[...i,a])}async function N(){T(!0);const a={},i=s.filter(L=>L.fileUrl);for(let L=0;L<i.length;L++){const _=i[L];h(`Φόρτωση αποδείξεων ${L+1}/${i.length}…`);const y=await me(_.fileUrl);y&&(a[_.id]=y)}h(""),T(!1);const o=pe({expenses:s,dateFrom:x,dateTo:l,cats:f,loc:R,imageMap:a}),O=window.open("","_blank");O.document.write(o),O.document.close(),setTimeout(()=>O.print(),800)}const r="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white w-full";return u?e.jsx("div",{className:"fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4",children:e.jsxs("div",{className:"bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col",children:[e.jsxs("div",{className:"flex items-center justify-between px-6 py-4 border-b border-gray-100",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-base font-bold text-gray-800",children:"Εκτύπωση / Export PDF"}),e.jsx("p",{className:"text-xs text-gray-400 mt-0.5",children:"Report + αποδείξεις 1-1 σε πλήρη ανάλυση"})]}),e.jsx("button",{onClick:()=>p(!1),className:"text-gray-400 hover:text-gray-600 text-xl leading-none",children:"×"})]}),e.jsxs("div",{className:"flex-1 overflow-y-auto px-6 py-4 space-y-5",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2",children:"Εύρος ημερομηνιών"}),e.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[e.jsxs("div",{children:[e.jsx("label",{className:"text-xs text-gray-400 mb-1 block",children:"Από"}),e.jsx("input",{type:"date",className:r,value:x,onChange:a=>v(a.target.value)})]}),e.jsxs("div",{children:[e.jsx("label",{className:"text-xs text-gray-400 mb-1 block",children:"Έως"}),e.jsx("input",{type:"date",className:r,value:l,onChange:a=>m(a.target.value)})]})]})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2",children:"Τοποθεσία"}),e.jsxs("select",{className:r,value:R,onChange:a=>E(a.target.value),children:[e.jsx("option",{value:"",children:"Όλες"}),Y.map(a=>e.jsx("option",{value:a,children:a},a))]})]}),e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center justify-between mb-2",children:[e.jsx("label",{className:"text-xs font-semibold text-gray-500 uppercase tracking-wide",children:"Κατηγορίες"}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx("button",{onClick:()=>$([...M]),className:"text-xs text-green-600 hover:underline",children:"Όλες"}),e.jsx("span",{className:"text-gray-300",children:"·"}),e.jsx("button",{onClick:()=>$([]),className:"text-xs text-gray-400 hover:underline",children:"Καμία"})]})]}),e.jsx("div",{className:"grid grid-cols-1 gap-1 max-h-48 overflow-y-auto border border-gray-100 rounded-lg p-2",children:M.map(a=>e.jsxs("label",{className:"flex items-center gap-2 px-1 py-0.5 rounded hover:bg-gray-50 cursor-pointer",children:[e.jsx("input",{type:"checkbox",checked:f.includes(a),onChange:()=>g(a),className:"accent-green-600 w-3.5 h-3.5"}),e.jsx("span",{className:"text-xs text-gray-700",children:a})]},a))}),e.jsx("p",{className:"text-xs text-gray-400 mt-1",children:f.length===0?"Όλες οι κατηγορίες":`${f.length} επιλεγμένες`})]})]}),e.jsxs("div",{className:"px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl",children:[e.jsxs("div",{className:"flex items-center justify-between mb-3",children:[e.jsxs("div",{className:"text-sm text-gray-600",children:[e.jsx("span",{className:"font-bold text-gray-800",children:s.length})," παραστατικά",b>0&&e.jsxs("span",{className:"text-green-600 ml-2",children:["· ",b," με αποδεικτικό"]}),s.length-b>0&&e.jsxs("span",{className:"text-gray-400 ml-2",children:["· ",s.length-b," χωρίς"]})]}),e.jsx("div",{className:"text-sm font-bold text-gray-800",children:"€"+s.reduce((i,o)=>i+(Number(o.total)||0),0).toLocaleString("el-CY",{minimumFractionDigits:2,maximumFractionDigits:2})})]}),z?e.jsxs("div",{className:"flex items-center gap-3 justify-center py-2",children:[e.jsx("div",{className:"w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"}),e.jsx("span",{className:"text-sm text-gray-600",children:k})]}):e.jsxs("div",{className:"flex gap-3",children:[e.jsx("button",{onClick:()=>p(!1),className:"flex-1 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-100 transition-colors",children:"Ακύρωση"}),e.jsx("button",{onClick:N,disabled:s.length===0,className:"flex-1 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed",children:"🖨️ Δημιουργία PDF"})]})]})]})}):e.jsxs("button",{onClick:()=>p(!0),className:"flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border border-gray-200 bg-white text-gray-600 hover:border-green-400 hover:text-green-700 transition-colors",children:[e.jsx("svg",{className:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"})}),"Εκτύπωση / Export"]})}const F=n=>"€"+(Number(n)||0).toLocaleString("el-CY",{minimumFractionDigits:2,maximumFractionDigits:2}),ge=n=>{if(!n)return"—";const[u,p,x]=n.split("-"),v=["Ιαν","Φεβ","Μαρ","Απρ","Μαΐ","Ιουν","Ιουλ","Αυγ","Σεπ","Οκτ","Νοε","Δεκ"];return`${parseInt(x)} ${v[parseInt(p)-1]} ${u}`},Q=n=>(n||"").slice(0,7),Z=new Date().toISOString().slice(0,7);function be(){var N;const[n,u]=d.useState([]),[p,x]=d.useState(!0),[v,l]=d.useState(null),[m,f]=d.useState(Z),[$,R]=d.useState(""),[E,z]=d.useState("");d.useEffect(()=>{const r=le(ee(P,"expenses"),oe("date","desc"));return ie(r,a=>{u(a.docs.map(i=>({id:i.id,...i.data()}))),x(!1)},()=>x(!1))},[]);const T=d.useMemo(()=>{const r=new Set(n.map(a=>Q(a.date)).filter(Boolean));return r.add(Z),[...r].sort().reverse()},[n]),k=d.useMemo(()=>n.filter(r=>(!m||Q(r.date)===m)&&(!$||r.category===$)&&(!E||r.location===E)),[n,m,$,E]),h=d.useMemo(()=>{const r={total:0,vat:0,net:0,count:k.length,byCat:{}};for(const a of k)r.total+=Number(a.total)||0,r.vat+=Number(a.vat)||0,r.net+=Number(a.net)||0,r.byCat[a.category]=(r.byCat[a.category]||0)+(Number(a.total)||0);return r},[k]),s=d.useMemo(()=>{const r=Object.entries(h.byCat).sort((i,o)=>o[1]-i[1]).map(([i])=>i),a={};for(const i of k){const o=i.category||"Άλλο";a[o]||(a[o]=[]),a[o].push(i)}return r.map(i=>({category:i,rows:a[i]||[],catTotal:h.byCat[i]||0}))},[k,h]),b=((N=s[0])==null?void 0:N.catTotal)||1,g="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-gray-700";return e.jsxs("div",{className:"max-w-6xl mx-auto px-4 py-6",children:[e.jsxs("div",{className:"flex items-center justify-between mb-5 flex-wrap gap-3",children:[e.jsxs("div",{children:[e.jsx("h1",{className:"text-2xl font-bold text-gray-800",children:"Λογιστικά / Έξοδα"}),e.jsx("p",{className:"text-sm text-gray-500 mt-0.5",children:"Καταχώρηση & ανάλυση εξόδων"})]}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx(ue,{expenses:n}),e.jsx("button",{onClick:()=>l("new"),className:"bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-sm",children:"+ Νέο Έξοδο"})]})]}),e.jsxs("div",{className:"flex gap-3 mb-5 flex-wrap",children:[e.jsxs("select",{className:g,value:m,onChange:r=>f(r.target.value),children:[e.jsx("option",{value:"",children:"Όλοι οι μήνες"}),T.map(r=>e.jsx("option",{value:r,children:r},r))]}),e.jsxs("select",{className:g,value:$,onChange:r=>R(r.target.value),children:[e.jsx("option",{value:"",children:"Όλες οι κατηγορίες"}),M.map(r=>e.jsx("option",{value:r,children:r},r))]}),e.jsxs("select",{className:g,value:E,onChange:r=>z(r.target.value),children:[e.jsx("option",{value:"",children:"Όλες οι τοποθεσίες"}),Y.map(r=>e.jsx("option",{value:r,children:r},r))]})]}),e.jsxs("div",{className:"grid grid-cols-2 md:grid-cols-4 gap-3 mb-6",children:[e.jsx(B,{label:"Σύνολο εξόδων",value:F(h.total),accent:"text-gray-900"}),e.jsx(B,{label:"ΦΠΑ (input)",value:F(h.vat),accent:"text-amber-600"}),e.jsx(B,{label:"Καθαρό",value:F(h.net),accent:"text-gray-700"}),e.jsx(B,{label:"Παραστατικά",value:h.count,accent:"text-green-700"})]}),s.length>0&&e.jsxs("div",{className:"bg-white border border-gray-200 rounded-xl p-4 mb-6",children:[e.jsx("h3",{className:"text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3",children:"Ανά κατηγορία"}),e.jsx("div",{className:"space-y-2",children:s.map(({category:r,catTotal:a})=>e.jsxs("div",{className:"flex items-center gap-3 text-sm",children:[e.jsx("span",{className:"w-52 text-gray-600 shrink-0 truncate",children:r}),e.jsx("div",{className:"flex-1 bg-gray-100 rounded-full h-4 overflow-hidden",children:e.jsx("div",{className:"h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full",style:{width:`${a/b*100}%`}})}),e.jsx("span",{className:"w-24 text-right font-semibold text-gray-700 shrink-0",children:F(a)})]},r))})]}),p?e.jsx("div",{className:"text-center py-16 text-gray-400",children:"Φόρτωση…"}):k.length===0?e.jsx("div",{className:"text-center py-16 text-gray-400",children:"Δεν υπάρχουν έξοδα για αυτά τα φίλτρα"}):e.jsxs("div",{className:"bg-white border border-gray-200 rounded-xl overflow-hidden",children:[e.jsxs("div",{className:"hidden md:grid grid-cols-[1.6rem_7rem_1fr_9rem_5rem_5.5rem_6rem] gap-x-4 px-4 py-2 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-400 uppercase tracking-wide",children:[e.jsx("span",{}),e.jsx("span",{children:"Ημερομηνία"}),e.jsx("span",{children:"Προμηθευτής"}),e.jsx("span",{children:"Σημειώσεις"}),e.jsx("span",{className:"text-right",children:"Καθαρό"}),e.jsx("span",{className:"text-right",children:"ΦΠΑ"}),e.jsx("span",{className:"text-right",children:"Σύνολο"})]}),s.map(({category:r,rows:a,catTotal:i})=>e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-gray-100",children:[e.jsx("span",{className:"text-sm font-semibold text-gray-700",children:r}),e.jsx("span",{className:"text-sm font-bold text-gray-800",children:F(i)})]}),a.map((o,O)=>e.jsxs("div",{onClick:()=>l(o),className:`grid grid-cols-[1.6rem_1fr] md:grid-cols-[1.6rem_7rem_1fr_9rem_5rem_5.5rem_6rem] gap-x-4 items-center px-4 py-3 cursor-pointer hover:bg-green-50 transition-colors ${O<a.length-1?"border-b border-gray-100":""}`,children:[e.jsx("span",{className:"text-gray-300 text-base",title:o.fileUrl?"Έχει αποδεικτικό":"Χωρίς αποδεικτικό",children:o.fileUrl?e.jsx("svg",{viewBox:"0 0 20 20",fill:"currentColor",className:"w-4 h-4 text-green-500",children:e.jsx("path",{fillRule:"evenodd",d:"M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z",clipRule:"evenodd"})}):e.jsx("svg",{viewBox:"0 0 20 20",fill:"currentColor",className:"w-4 h-4 text-gray-200",children:e.jsx("path",{fillRule:"evenodd",d:"M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z",clipRule:"evenodd"})})}),e.jsx("span",{className:"text-sm text-gray-500 whitespace-nowrap",children:ge(o.date)}),e.jsx("span",{className:"text-sm font-medium text-gray-800 truncate",children:o.vendor||"—"}),e.jsx("span",{className:"hidden md:block text-xs text-gray-400 truncate",children:o.notes||o.invoiceNumber||""}),e.jsx("span",{className:"hidden md:block text-sm text-right text-gray-600",children:o.net!=null?F(o.net):"—"}),e.jsxs("span",{className:"hidden md:block text-sm text-right text-amber-600",children:[o.vat!=null?F(o.vat):"—",o.vatRate!=null?e.jsxs("span",{className:"text-xs text-gray-400 ml-1",children:[o.vatRate,"%"]}):null]}),e.jsx("span",{className:"text-sm font-semibold text-right text-gray-900",children:F(o.total)})]},o.id)),e.jsx("div",{className:"flex justify-end px-4 py-2 bg-gray-50 border-t border-gray-100 text-sm font-bold text-gray-700",children:F(i)})]},r)),e.jsxs("div",{className:"flex items-center justify-between px-4 py-3 bg-green-50 border-t border-green-200",children:[e.jsxs("span",{className:"text-sm font-semibold text-green-800",children:["Σύνολο (",h.count," παραστατικά)"]}),e.jsx("span",{className:"text-lg font-bold text-green-900",children:F(h.total)})]})]}),v&&e.jsx(xe,{existing:v==="new"?null:v,onClose:()=>l(null)})]})}function B({label:n,value:u,accent:p}){return e.jsxs("div",{className:"bg-white border border-gray-200 rounded-xl p-4",children:[e.jsx("p",{className:"text-xs text-gray-400 uppercase tracking-wide",children:n}),e.jsx("p",{className:`text-xl font-bold mt-1 ${p}`,children:u})]})}export{be as default};
