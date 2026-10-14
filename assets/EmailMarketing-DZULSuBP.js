import{r as c,j as e,_ as Ot,n as pt,e as _,d as J,h as X,k as ye,q as de,c as ae,w as we,l as Lt,b as le,u as Dt,i as xt,T as mt,G as We,o as gt,f as Be,s as Ft,g as ht,B as Rt,C as Pt,D as It,E as Bt}from"./index-DKHvLF4c.js";import{a0 as Ht,a1 as _t,a2 as $t,i as fe,t as Mt,v as Gt,u as Ve,a3 as Ye,a4 as Ke,Z as Ut,D as Wt,a5 as ut,a6 as ft,a7 as bt,a8 as yt,a9 as Je,s as Vt,U as Yt,W as Kt,X as Jt,Y as Xt,V as qt,_ as Xe}from"./BarChart-FSJ5sQl4.js";import{J as Zt}from"./jszip.min-s7rCB_PQ.js";const Qt="dermlux-cache",Ne="kv",vt="email_contacts",en=24*60*60*1e3;function jt(){return new Promise((t,n)=>{const s=indexedDB.open(Qt,1);s.onupgradeneeded=()=>s.result.createObjectStore(Ne),s.onsuccess=()=>t(s.result),s.onerror=()=>n(s.error)})}function tn(t){return t&&typeof t.toDate=="function"?t.toDate().getTime():t}function nn(t){const n={};for(const s of Object.keys(t))n[s]=tn(t[s]);return n}async function qe(t){try{const n=await jt();await new Promise((s,i)=>{const a=n.transaction(Ne,"readwrite");a.objectStore(Ne).put({savedAt:Date.now(),contacts:t.map(nn)},vt),a.oncomplete=s,a.onerror=()=>i(a.error)}),n.close()}catch(n){console.warn("contactsCache save failed (non-fatal):",n)}}async function sn(){try{const t=await jt(),n=await new Promise((s,i)=>{const r=t.transaction(Ne,"readonly").objectStore(Ne).get(vt);r.onsuccess=()=>s(r.result),r.onerror=()=>i(r.error)});return t.close(),n||null}catch(t){return console.warn("contactsCache load failed (non-fatal):",t),null}}const an=new Set(["mailinator.com","guerrillamail.com","tempmail.com","throwam.com","yopmail.com","sharklasers.com","guerrillamailblock.com","grr.la","guerrillamail.info","trashmail.com","dispostable.com","spamgourmet.com","trashmail.at","trashmail.io","spamfree24.org","getairmail.com","fakeinbox.com","mailnull.com","spamex.com","spamhole.com","spam4.me","tempr.email","tmails.net","discard.email","getnada.com","spamgourmet.net","maildrop.cc","eyepaste.com"]),ln=/^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;function He(t){if(!t||typeof t!="string")return!1;const n=t.trim();return n.toLowerCase().endsWith(".local")?!1:ln.test(n)}function rn(t){if(!t)return!1;const n=t.toLowerCase().split("@")[1]||"";return!!(an.has(n)||/^(test|noreply|no-reply|donotreply|admin|info)@/i.test(t))}function wt(t){return(t||"").toLowerCase().trim()}function _e(t){const n=wt(t);return btoa(n).replace(/\+/g,"-").replace(/\//g,"_").replace(/=/g,"")}const Te=new Set(["unsubscribed","bounced","complained","failed","invalid"]);function on(t){return!Te.has(t)}function Nt(t){switch(t){case"active":return"Ενεργός";case"unsubscribed":return"Opt-out";case"bounced":return"Bounce";case"complained":return"Spam";case"failed":return"Αποτυχία";case"invalid":return"Άκυρο";default:return t||"—"}}function kt(t){switch(t){case"active":return"bg-green-100 text-green-700";case"unsubscribed":return"bg-gray-100 text-gray-500";case"bounced":return"bg-red-100 text-red-600";case"complained":return"bg-purple-100 text-purple-700";case"failed":return"bg-orange-100 text-orange-600";case"invalid":return"bg-orange-100 text-orange-600";default:return"bg-gray-100 text-gray-500"}}const dn={Nicosia:"Λευκωσία",nicosia:"Λευκωσία",NICOSIA:"Λευκωσία","nicosia cyprus":"Λευκωσία","center nicosia":"Λευκωσία","DermLux Nicosia":"Λευκωσία",Λευκωσία:"Λευκωσία",λευκωσια:"Λευκωσία",Strovolos:"Λευκωσία","Agios Dometios":"Λευκωσία",Dali:"Λευκωσία",Lythrodontas:"Λευκωσία",pendacomo:"Λευκωσία",Limassol:"Λεμεσός",limassol:"Λεμεσός",Gold:"Λεμεσός","DermLux Limassol Gold":"Λεμεσός","DermLux Limassol Laser":"Λεμεσός","Limassol Gold":"Λεμεσός","Limassol Laser":"Λεμεσός",Lemselo:"Λεμεσός",Λεμεσός:"Λεμεσός",Λεμεσος:"Λεμεσός","Kato Polemidhia":"Λεμεσός","Kato Polemidya":"Λεμεσός",Polemidia:"Λεμεσός","pyrgos limassol":"Λεμεσός",Paramytha:"Λεμεσός",Pissouri:"Λεμεσός",Ipsonas:"Λεμεσός",Akrotiri:"Λεμεσός","Ayus Tychones":"Λεμεσός","Μέσα Γειτονιά":"Λεμεσός",Larnaca:"Λάρνακα",larnaca:"Λάρνακα",Larnaka:"Λάρνακα",Λαρνακα:"Λάρνακα",Λάρνακα:"Λάρνακα","DermLux Larnaca":"Λάρνακα",Aradippou:"Λάρνακα",Xylophaghou:"Λάρνακα",Μενεου:"Λάρνακα",Πυλα:"Λάρνακα",Pyla:"Λάρνακα",Κορνος:"Λάρνακα",Paphos:"Πάφος",Páfos:"Πάφος",Pafos:"Πάφος","Paphos, Cyprus":"Πάφος",Πάφος:"Πάφος",Παφος:"Πάφος","DermLux Paphos":"Πάφος",Kissonerga:"Πάφος",Kouklia:"Πάφος",Polis:"Πάφος",Pegeia:"Πάφος",Peyia:"Πάφος","Mesa Chorio":"Πάφος",Tala:"Πάφος",Empa:"Πάφος",Χλωρακας:"Πάφος",Lyso:"Πάφος",Paralimni:"Αμμόχωστος",Αμμωχοστος:"Αμμόχωστος",Lefkosa:"Κατεχόμενα",Lefkoşa:"Κατεχόμενα",Gönyeli:"Κατεχόμενα",Hamitköy:"Κατεχόμενα",Kyrenia:"Κατεχόμενα",Lapithos:"Κατεχόμενα",Akanthou:"Κατεχόμενα",Omorfo:"Κατεχόμενα",Lefke:"Κατεχόμενα",Famagusta:"Κατεχόμενα","Famagusta Walled City":"Κατεχόμενα",Gazimagusa:"Κατεχόμενα",Kibris:"Κατεχόμενα"};function ve(t){return!t||!t.trim()?"Άλλο":dn[t.trim()]||"Άλλο"}const re=[{id:"spend_lt500",label:"< €500",cls:"bg-gray-50 text-gray-600 border-gray-300",match:t=>{const n=parseFloat(t.totalSpend)||0;return n>0&&n<500}},{id:"spend_500_1000",label:"€500 – €1.000",cls:"bg-amber-50 text-amber-800 border-amber-300",match:t=>{const n=parseFloat(t.totalSpend)||0;return n>=500&&n<=1e3}},{id:"spend_gt1000",label:"> €1.000",cls:"bg-yellow-50 text-yellow-800 border-yellow-300",match:t=>(parseFloat(t.totalSpend)||0)>1e3}],oe=[{id:"appt_1",label:"1 ραντεβού",cls:"bg-sky-50 text-sky-700 border-sky-300",match:t=>(parseInt(t.appointmentCount)||0)===1},{id:"appt_2_6",label:"2 – 6",cls:"bg-blue-50 text-blue-700 border-blue-300",match:t=>{const n=parseInt(t.appointmentCount)||0;return n>=2&&n<=6}},{id:"appt_gt6",label:"> 6",cls:"bg-indigo-50 text-indigo-700 border-indigo-300",match:t=>{const n=parseInt(t.appointmentCount)||0;return n>=7&&n<=10}},{id:"appt_gt10",label:"> 10",cls:"bg-purple-50 text-purple-700 border-purple-300",match:t=>{const n=parseInt(t.appointmentCount)||0;return n>=11&&n<=20}},{id:"appt_gt20",label:"> 20",cls:"bg-pink-50 text-pink-700 border-pink-300",match:t=>(parseInt(t.appointmentCount)||0)>20}];function Pe(t){const n=parseFloat(t);return!n||isNaN(n)?null:"€"+n.toLocaleString("el-GR",{minimumFractionDigits:0,maximumFractionDigits:0})}function At(t){const n=[],s=parseFloat(t.totalSpend)||0;s>=2e3?n.push({key:"vip",label:"💎 VIP",cls:"bg-yellow-50 text-yellow-800 border-yellow-300"}):s>=500?n.push({key:"highval",label:"⭐ High Value",cls:"bg-amber-50 text-amber-800 border-amber-300"}):s>=100?n.push({key:"medval",label:"💶 Αγοράζει",cls:"bg-green-50 text-green-700 border-green-300"}):s>0&&n.push({key:"lowval",label:"💵 Μικρό ποσό",cls:"bg-gray-50 text-gray-600 border-gray-300"});const i=parseInt(t.appointmentCount)||0;i>=10?n.push({key:"loyal",label:"🏆 Loyal",cls:"bg-purple-50 text-purple-700 border-purple-300"}):i>=4?n.push({key:"regular",label:"✅ Regular",cls:"bg-blue-50 text-blue-700 border-blue-300"}):i===1&&n.push({key:"new",label:"🆕 Νέος/α",cls:"bg-sky-50 text-sky-700 border-sky-300"});const a=Array.isArray(t.treatmentCategories)?t.treatmentCategories:[];a.includes("injectables")&&n.push({key:"inj",label:"💉 Injectables",cls:"bg-pink-50 text-pink-700 border-pink-300"}),a.includes("laser")&&n.push({key:"las",label:"⚡ Laser",cls:"bg-orange-50 text-orange-700 border-orange-300"}),a.includes("facial")&&n.push({key:"fac",label:"✨ Facial",cls:"bg-teal-50 text-teal-700 border-teal-300"}),a.includes("body")&&n.push({key:"body",label:"🏃 Body",cls:"bg-lime-50 text-lime-700 border-lime-300"}),t.language==="English"&&n.push({key:"en",label:"🇬🇧 English",cls:"bg-blue-50 text-blue-600 border-blue-200"}),t.language==="Russian"&&n.push({key:"ru",label:"🇷🇺 Russian",cls:"bg-red-50 text-red-600 border-red-200"});const r=ve(t.city);return r&&r!=="Άλλο"?n.push({key:"district",label:"📍 "+r,cls:"bg-gray-50 text-gray-600 border-gray-200"}):r==="Άλλο"&&n.push({key:"district",label:"🌍 Εξωτερικό",cls:"bg-gray-50 text-gray-500 border-gray-200"}),n}const Ie=[{id:"Λευκωσία",color:"blue"},{id:"Λεμεσός",color:"blue"},{id:"Λάρνακα",color:"blue"},{id:"Πάφος",color:"blue"},{id:"Αμμόχωστος",color:"blue"},{id:"Κατεχόμενα",color:"orange"},{id:"Άλλο",color:"purple"}];function cn(t){const n=s=>t.findIndex(i=>s.some(a=>i.toLowerCase().includes(a)));return{email:n(["email","e-mail","mail"]),name:n(["name","όνομα","ονοματ","full"]),phone:n(["phone","τηλ","mobile","κινητ","tel"])}}function pn(t,n,s){const i=wt(t[n.email]||""),a=(t[n.name]||"").toString().trim(),r=n.phone>=0?(t[n.phone]||"").toString().trim():"";if(!i)return null;if(!He(i))return{email:i,name:a,phone:r,flag:"invalid",reason:"Άκυρη μορφή email"};if(rn(i))return{email:i,name:a,phone:r,flag:"fake",reason:"Πιθανώς fake / disposable"};const y=_e(i);return s.has(y)?{email:i,name:a,phone:r,flag:"duplicate",reason:"Υπάρχει ήδη"}:{email:i,name:a,phone:r,flag:"new",reason:""}}const xn={new:"bg-green-50 border-green-200",duplicate:"bg-yellow-50 border-yellow-200",fake:"bg-orange-50 border-orange-200",invalid:"bg-red-50 border-red-200"},mn={new:"bg-green-100 text-green-700",duplicate:"bg-yellow-100 text-yellow-700",fake:"bg-orange-100 text-orange-700",invalid:"bg-red-100 text-red-600"},gn={new:"Νέος",duplicate:"Duplicate",fake:"Fake",invalid:"Άκυρο"};function hn({onClose:t,existingContacts:n}){const[s,i]=c.useState(null),[a,r]=c.useState(new Set),[y,x]=c.useState(!1),[w,g]=c.useState(0),[k,C]=c.useState(!1),[p,v]=c.useState(""),j=c.useRef(),N=new Set(n.map(d=>d.id));async function A(d){v("");try{const{read:S,utils:T}=await Ot(async()=>{const{read:P,utils:W}=await import("./xlsx-D_0l8YDs.js");return{read:P,utils:W}},[]),H=await d.arrayBuffer(),$=S(H,{type:"array"}),l=$.Sheets[$.SheetNames[0]],m=T.sheet_to_json(l,{header:1,defval:""});if(m.length<2){v("Το αρχείο φαίνεται άδειο.");return}const u=m[0].map(P=>P.toString()),D=cn(u);if(D.email<0){v('Δεν βρέθηκε στήλη email. Βεβαιωθείτε ότι υπάρχει επικεφαλίδα "Email".');return}const R=m.slice(1).map(P=>pn(P,D,N)).filter(Boolean);i(R),r(new Set(R.reduce((P,W,ee)=>(W.flag==="new"&&P.push(ee),P),[])))}catch(S){v("Σφάλμα ανάγνωσης αρχείου: "+S.message)}}function b(){const d=(s||[]).filter(S=>S.flag==="new");a.size===d.length?r(new Set):r(new Set(s.reduce((S,T,H)=>(T.flag==="new"&&S.push(H),S),[])))}function z(d){const S=new Set(a);S.has(d)?S.delete(d):S.add(d),r(S)}async function E(){if(!s||a.size===0)return;x(!0),v("");const d=[...a].map(T=>s[T]),S=500;try{for(let T=0;T<d.length;T+=S){const H=d.slice(T,T+S),$=pt(_);H.forEach(l=>{const m=_e(l.email);$.set(J(_,"email_contacts",m),{email:l.email,name:l.name,phone:l.phone,tags:[],source:"csv_import",status:"active",sendCount:0,lastSentAt:null,unsubscribedAt:null,bouncedAt:null,importedAt:X(),updatedAt:X()})}),await $.commit(),g(Math.round((T+H.length)/d.length*100))}C(!0)}catch(T){v("Σφάλμα αποθήκευσης: "+T.message)}finally{x(!1)}}const O=(s==null?void 0:s.filter(d=>d.flag==="new").length)??0,f=(s==null?void 0:s.filter(d=>d.flag==="duplicate").length)??0,h=(s==null?void 0:s.filter(d=>d.flag==="invalid"||d.flag==="fake").length)??0;return e.jsx("div",{className:"fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto",children:e.jsxs("div",{className:"card w-full max-w-3xl p-6 mt-4 mb-4 space-y-5",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("h2",{className:"text-lg font-semibold",children:"Εισαγωγή Επαφών"}),e.jsx("button",{onClick:t,className:"text-gray-400 hover:text-gray-600 text-xl",children:"✕"})]}),k?e.jsxs("div",{className:"text-center py-10 space-y-3",children:[e.jsx("div",{className:"text-5xl",children:"✅"}),e.jsxs("div",{className:"text-lg font-semibold text-green-700",children:[a.size," επαφές εισήχθησαν επιτυχώς!"]}),e.jsx("button",{className:"btn-primary",onClick:t,children:"Κλείσιμο"})]}):s?e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"flex gap-3 flex-wrap",children:[e.jsx(Oe,{label:"Νέοι",count:O,color:"green"}),e.jsx(Oe,{label:"Duplicates",count:f,color:"yellow"}),e.jsx(Oe,{label:"Άκυρα/Fake",count:h,color:"red"})]}),e.jsx("div",{className:"border rounded-xl overflow-hidden max-h-96 overflow-y-auto",children:e.jsxs("table",{className:"w-full text-xs",children:[e.jsx("thead",{className:"bg-gray-50 border-b sticky top-0",children:e.jsxs("tr",{children:[e.jsx("th",{className:"px-3 py-2 text-left w-8",children:e.jsx("input",{type:"checkbox",checked:a.size===O&&O>0,onChange:b,className:"accent-blue-600"})}),e.jsx("th",{className:"px-3 py-2 text-left text-gray-500 font-medium",children:"Email"}),e.jsx("th",{className:"px-3 py-2 text-left text-gray-500 font-medium",children:"Όνομα"}),e.jsx("th",{className:"px-3 py-2 text-left text-gray-500 font-medium",children:"Status"})]})}),e.jsx("tbody",{className:"divide-y",children:s.map((d,S)=>e.jsxs("tr",{className:`${xn[d.flag]} border-l-2`,children:[e.jsx("td",{className:"px-3 py-2",children:d.flag==="new"&&e.jsx("input",{type:"checkbox",checked:a.has(S),onChange:()=>z(S),className:"accent-blue-600"})}),e.jsx("td",{className:"px-3 py-2 text-gray-700",children:d.email}),e.jsx("td",{className:"px-3 py-2 text-gray-600",children:d.name||"—"}),e.jsx("td",{className:"px-3 py-2",children:e.jsxs("span",{className:`badge text-xs ${mn[d.flag]}`,children:[gn[d.flag],d.reason&&e.jsxs("span",{className:"ml-1 opacity-70",children:["— ",d.reason]})]})})]},S))})]})}),p&&e.jsxs("div",{className:"text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2",children:["⚠️ ",p]}),y&&e.jsxs("div",{className:"space-y-1",children:[e.jsxs("div",{className:"flex justify-between text-xs text-gray-500",children:[e.jsx("span",{children:"Αποθήκευση…"}),e.jsxs("span",{children:[w,"%"]})]}),e.jsx("div",{className:"h-2 bg-gray-200 rounded-full overflow-hidden",children:e.jsx("div",{className:"h-full bg-blue-500 rounded-full transition-all",style:{width:`${w}%`}})})]}),e.jsxs("div",{className:"flex gap-3 pt-1",children:[e.jsx("button",{className:"btn-secondary flex-1",onClick:t,disabled:y,children:"Ακύρωση"}),e.jsx("button",{className:"btn-primary flex-1",onClick:E,disabled:a.size===0||y,children:y?"Αποθήκευση…":`Εισαγωγή ${a.size} επαφών`})]})]}):e.jsxs("div",{className:"border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors",onClick:()=>j.current.click(),onDragOver:d=>d.preventDefault(),onDrop:d=>{d.preventDefault(),A(d.dataTransfer.files[0])},children:[e.jsx("div",{className:"text-4xl mb-3",children:"📂"}),e.jsx("div",{className:"font-medium text-gray-700",children:"Σύρετε αρχείο εδώ ή κάντε κλικ για επιλογή"}),e.jsx("div",{className:"text-sm text-gray-400 mt-1",children:"Αποδεκτά: CSV, XLS, XLSX"}),e.jsx("input",{ref:j,type:"file",accept:".csv,.xls,.xlsx",className:"hidden",onChange:d=>d.target.files[0]&&A(d.target.files[0])})]}),p&&!s&&e.jsxs("div",{className:"text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2",children:["⚠️ ",p]})]})})}function Oe({label:t,count:n,color:s}){const i={green:"bg-green-100 text-green-700",yellow:"bg-yellow-100 text-yellow-700",red:"bg-red-100 text-red-600"};return e.jsxs("div",{className:`px-3 py-1.5 rounded-full text-sm font-medium ${i[s]}`,children:[t,": ",e.jsx("span",{className:"font-bold",children:n})]})}const un={csv_import:{label:"CSV / Excel",cls:"bg-blue-100 text-blue-700"},"resend-webhook":{label:"Resend (auto)",cls:"bg-purple-100 text-purple-700"},manual:{label:"Χειροκίνητα",cls:"bg-gray-100 text-gray-600"}};function fn({source:t}){const n=un[t]||{label:t||"—",cls:"bg-gray-100 text-gray-500"};return e.jsx("span",{className:`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${n.cls}`,children:n.label})}function Z(t){if(!t)return null;const n=t!=null&&t.toDate?t.toDate():new Date(t);return isNaN(n)?null:n.toLocaleDateString("el-GR",{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}function bn({send:t,campaignName:n}){const s=[];t.sentAt&&s.push({icon:"📤",label:"Εστάλη",time:Z(t.sentAt),cls:"text-gray-500"}),t.openedAt&&s.push({icon:"👁️",label:"Ανοίχθηκε",time:Z(t.openedAt),cls:"text-blue-600"}),t.clickedAt&&s.push({icon:"🖱️",label:"Κλικ",time:Z(t.clickedAt),cls:"text-green-600"}),t.bouncedAt&&s.push({icon:"⚠️",label:"Bounce",time:Z(t.bouncedAt),cls:"text-red-500"});const i={sent:"bg-gray-100 text-gray-600",opened:"bg-blue-100 text-blue-700",bounced:"bg-red-100 text-red-600",failed:"bg-orange-100 text-orange-600"}[t.status]||"bg-gray-100 text-gray-500";return e.jsxs("div",{className:"border border-gray-100 rounded-xl p-4 space-y-3",children:[e.jsxs("div",{className:"flex items-start justify-between gap-2 flex-wrap",children:[e.jsx("div",{className:"font-medium text-gray-800 text-sm",children:n||t.campaignId}),e.jsx("span",{className:`badge text-xs ${i}`,children:t.status})]}),e.jsx("div",{className:"flex flex-wrap gap-x-5 gap-y-1",children:s.map((a,r)=>e.jsxs("div",{className:`flex items-center gap-1 text-xs ${a.cls}`,children:[e.jsx("span",{children:a.icon}),e.jsx("span",{className:"font-medium",children:a.label}),a.time&&e.jsxs("span",{className:"text-gray-400",children:["· ",a.time]})]},r))}),t.failedReason&&e.jsxs("div",{className:"text-xs text-red-500 bg-red-50 rounded px-2 py-1",children:["Αιτία αποτυχίας: ",t.failedReason]})]})}function yn({contact:t,onClose:n,onStatusChange:s}){const[i,a]=c.useState([]),[r,y]=c.useState({}),[x,w]=c.useState(!0),[g,k]=c.useState(!1);c.useEffect(()=>{async function p(){try{const j=(await ye(de(ae(_,"email_sends"),we("email","==",t.email)))).docs.map(b=>({id:b.id,...b.data()}));j.sort((b,z)=>{var f,h,d,S;const E=((h=(f=b.sentAt)==null?void 0:f.toDate)==null?void 0:h.call(f))||new Date(b.sentAt||0);return(((S=(d=z.sentAt)==null?void 0:d.toDate)==null?void 0:S.call(d))||new Date(z.sentAt||0))-E}),a(j);const N=[...new Set(j.map(b=>b.campaignId).filter(Boolean))],A={};await Promise.all(N.map(async b=>{try{const z=await Lt(J(_,"email_campaigns",b));z.exists()&&(A[b]=z.data().name||b)}catch{A[b]=b}})),y(A)}catch(v){console.error("ContactDetailModal load error:",v)}finally{w(!1)}}p()},[t.email]);async function C(p){k(!0);try{const v={status:p,updatedAt:X()};p==="unsubscribed"&&(v.unsubscribedAt=X()),p==="active"&&(v.unsubscribedAt=null,v.bouncedAt=null,v.complainedAt=null,v.failedAt=null,v.lastEvent=null),await le(J(_,"email_contacts",t.id),v),s==null||s({...t,status:p})}finally{k(!1)}}return Te.has(t.status),e.jsx("div",{className:"fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4",onClick:n,children:e.jsxs("div",{className:"card w-full max-w-lg max-h-[90vh] flex flex-col",onClick:p=>p.stopPropagation(),children:[e.jsxs("div",{className:"flex items-center justify-between p-6 border-b",children:[e.jsx("h2",{className:"text-lg font-semibold text-gray-900",children:"Στοιχεία Επαφής"}),e.jsx("button",{onClick:n,className:"text-gray-400 hover:text-gray-600 text-xl leading-none",children:"✕"})]}),e.jsxs("div",{className:"overflow-y-auto flex-1 p-6 space-y-5",children:[e.jsxs("div",{className:"bg-gray-50 rounded-xl p-4 space-y-3",children:[e.jsxs("div",{className:"flex items-start justify-between gap-3 flex-wrap",children:[e.jsxs("div",{children:[e.jsxs("div",{className:"font-semibold text-gray-900 text-base flex items-center gap-1.5",children:[t.name||e.jsx("span",{className:"text-gray-400 italic",children:"Χωρίς όνομα"}),t.lastEngagedAt&&t.status==="active"&&e.jsx("span",{title:"Engaged — έχει ανοίξει/κάνει κλικ",children:"🔥"})]}),e.jsx("div",{className:"text-sm text-gray-500 mt-0.5",children:t.email}),t.phone&&e.jsx("div",{className:"text-sm text-gray-500",children:t.phone})]}),e.jsxs("div",{className:"flex flex-col items-end gap-1.5",children:[e.jsx("span",{className:`badge text-xs ${kt(t.status)}`,children:Nt(t.status)}),e.jsx(fn,{source:t.source})]})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-500 pt-1 border-t border-gray-200",children:[t.addedAt&&e.jsxs("div",{children:[e.jsx("span",{className:"font-medium text-gray-600",children:"Προστέθηκε:"})," ",Z(t.addedAt)]}),t.importedAt&&e.jsxs("div",{children:[e.jsx("span",{className:"font-medium text-gray-600",children:"Εισήχθη:"})," ",Z(t.importedAt)]}),t.lastEngagedAt&&e.jsxs("div",{children:[e.jsx("span",{className:"font-medium text-gray-600",children:"Τελ. ενέργεια:"})," ",Z(t.lastEngagedAt)]}),t.lastSentAt&&e.jsxs("div",{children:[e.jsx("span",{className:"font-medium text-gray-600",children:"Τελ. αποστολή:"})," ",Z(t.lastSentAt)]}),t.unsubscribedAt&&e.jsxs("div",{className:"text-red-500",children:[e.jsx("span",{className:"font-medium",children:"Opt-out:"})," ",Z(t.unsubscribedAt)]}),t.bouncedAt&&e.jsxs("div",{className:"text-red-500",children:[e.jsx("span",{className:"font-medium",children:"Bounce:"})," ",Z(t.bouncedAt)]}),t.complainedAt&&e.jsxs("div",{className:"text-purple-600",children:[e.jsx("span",{className:"font-medium",children:"Spam:"})," ",Z(t.complainedAt)]})]})]}),(()=>{const p=At(t),v=Pe(t.totalSpend),j=parseInt(t.appointmentCount)||0,N=ve(t.city),A=Array.isArray(t.tags)?t.tags:[];return e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[e.jsxs("div",{className:"bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-center",children:[e.jsx("div",{className:"text-xs text-emerald-600 font-medium mb-0.5",children:"Σύνολο Δαπανών"}),e.jsx("div",{className:"text-xl font-bold text-emerald-700",children:v||"€0"})]}),e.jsxs("div",{className:"bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-center",children:[e.jsx("div",{className:"text-xs text-blue-600 font-medium mb-0.5",children:"Ραντεβού"}),e.jsx("div",{className:"text-xl font-bold text-blue-700",children:j})]})]}),p.length>0&&e.jsxs("div",{children:[e.jsx("div",{className:"text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2",children:"Tags"}),e.jsx("div",{className:"flex flex-wrap gap-1.5",children:p.map(b=>e.jsx("span",{className:`inline-block px-2.5 py-1 rounded-full text-xs font-medium border ${b.cls}`,children:b.label},b.key))})]}),A.length>0&&e.jsxs("div",{children:[e.jsx("div",{className:"text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2",children:"CRM Categories"}),e.jsx("div",{className:"flex flex-wrap gap-1.5",children:A.map(b=>e.jsx("span",{className:"inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200",children:b},b))})]}),(t.omniluxStatus||t.omniluxSource||N||t.language)&&e.jsxs("div",{className:"grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs bg-gray-50 rounded-xl p-3",children:[t.omniluxStatus&&e.jsxs("div",{children:[e.jsx("span",{className:"font-medium text-gray-500",children:"CRM Status: "}),e.jsx("span",{className:"text-gray-700",children:t.omniluxStatus})]}),t.omniluxSource&&e.jsxs("div",{children:[e.jsx("span",{className:"font-medium text-gray-500",children:"Πηγή: "}),e.jsx("span",{className:"text-gray-700",children:t.omniluxSource})]}),N&&e.jsxs("div",{children:[e.jsx("span",{className:"font-medium text-gray-500",children:"Περιοχή: "}),e.jsx("span",{className:"text-gray-700",children:N})]}),t.language&&e.jsxs("div",{children:[e.jsx("span",{className:"font-medium text-gray-500",children:"Γλώσσα: "}),e.jsx("span",{className:"text-gray-700",children:t.language})]}),t.lastAppointmentAt&&e.jsxs("div",{className:"col-span-2",children:[e.jsx("span",{className:"font-medium text-gray-500",children:"Τελ. ραντεβού: "}),e.jsx("span",{className:"text-gray-700",children:Z(t.lastAppointmentAt)})]})]})]})})(),e.jsx("div",{className:"flex gap-2",children:t.status==="active"?e.jsx("button",{disabled:g,onClick:()=>C("unsubscribed"),className:"flex-1 text-sm py-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50",children:"Opt-out επαφής"}):e.jsx("button",{disabled:g,onClick:()=>C("active"),className:"flex-1 text-sm py-2 rounded-lg border border-green-300 text-green-700 hover:bg-green-50 transition-colors disabled:opacity-50",children:"Επαναφορά σε ενεργό"})}),e.jsxs("div",{children:[e.jsxs("div",{className:"font-semibold text-gray-700 text-sm mb-3 flex items-center gap-2",children:["Ιστορικό Emails",!x&&e.jsxs("span",{className:"text-xs font-normal text-gray-400",children:["(",i.length," αποστολές)"]})]}),x?e.jsx("div",{className:"text-center py-8 text-gray-400 text-sm",children:"Φόρτωση…"}):i.length===0?e.jsx("div",{className:"text-center py-8 text-gray-400 text-sm bg-gray-50 rounded-xl",children:"Δεν έχει λάβει κανένα email ακόμα."}):e.jsx("div",{className:"space-y-2",children:i.map(p=>e.jsx(bn,{send:p,campaignName:r[p.campaignId]},p.id))})]})]})]})})}const je=100,vn={csv_import:{label:"CSV",cls:"bg-blue-100 text-blue-700"},"resend-webhook":{label:"Resend",cls:"bg-purple-100 text-purple-700"},manual:{label:"Χειροκίνητα",cls:"bg-gray-100 text-gray-600"}};function jn({source:t}){const n=vn[t]||{label:t||"—",cls:"bg-gray-100 text-gray-400"};return e.jsx("span",{className:`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${n.cls}`,children:n.label})}function wn(t){if(!t)return null;const n=t!=null&&t.toDate?t.toDate():new Date(t);return isNaN(n)?null:n.toLocaleDateString("el-GR",{day:"2-digit",month:"short",year:"numeric"})}const Ze=["all","active","unsubscribed","bounced","complained","failed","invalid"],Nn={all:"Όλοι",active:"Ενεργοί",unsubscribed:"Opt-out",bounced:"Bounce",complained:"Spam",failed:"Αποτυχία",invalid:"Άκυρα"},Le={injectables:{label:"Injectables",icon:"💉"},laser:{label:"Laser",icon:"⚡"},facial:{label:"Facial",icon:"✨"},consultation:{label:"Consultation",icon:"📋"},other:{label:"Other",icon:"🔖"}},Qe={districts:[],spendTiers:[],apptTiers:[],treatmentCategories:[],omniluxStatuses:[],languages:[],sources:[]};function kn(t){return t==="active"?{label:"Opt-out",cls:"border-red-200 text-red-500 hover:bg-red-50",next:"unsubscribed"}:{label:"Επαναφορά",cls:"border-green-300 text-green-700 hover:bg-green-50",next:"active"}}function pe(t,n){return t.includes(n)?t.filter(s=>s!==n):[...t,n]}function xe({label:t,count:n,active:s,onClick:i,color:a="blue"}){const r={blue:s?"bg-blue-600 text-white border-blue-600":"bg-white text-gray-600 border-gray-200 hover:border-blue-400",green:s?"bg-emerald-600 text-white border-emerald-600":"bg-white text-gray-600 border-gray-200 hover:border-emerald-400",purple:s?"bg-purple-600 text-white border-purple-600":"bg-white text-gray-600 border-gray-200 hover:border-purple-400",orange:s?"bg-orange-500 text-white border-orange-500":"bg-white text-gray-600 border-gray-200 hover:border-orange-400"};return e.jsxs("button",{onClick:i,className:`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${r[a]}`,children:[t,n!=null&&e.jsx("span",{className:`text-xs font-semibold ${s?"opacity-75":"text-gray-400"}`,children:n})]})}function me({title:t,children:n}){return e.jsxs("div",{className:"space-y-1.5",children:[e.jsx("div",{className:"text-xs font-semibold text-gray-400 uppercase tracking-wider",children:t}),e.jsx("div",{className:"flex flex-wrap gap-1.5",children:n})]})}function An({contacts:t,loading:n,onContactsChange:s}){const[i,a]=c.useState(""),[r,y]=c.useState("all"),[x,w]=c.useState(Qe),[g,k]=c.useState(!1),[C,p]=c.useState(!1),[v,j]=c.useState(null),[N,A]=c.useState(0);function b(l){y(l),A(0)}function z(l){a(l),A(0)}function E(l){w(l),A(0)}const O=c.useMemo(()=>{const l=P=>{const W={};for(const ee of t){const ce=(ee[P]||"").trim();ce&&(W[ce]=(W[ce]||0)+1)}return Object.entries(W).sort((ee,ce)=>ce[1]-ee[1])},m={};for(const P of t){const W=ve(P.city);W&&(m[W]=(m[W]||0)+1)}const u={};for(const P of re)u[P.id]=t.filter(P.match).length;const D={};for(const P of oe)D[P.id]=t.filter(P.match).length;const R={};for(const P of t){const W=Array.isArray(P.treatmentCategories)?P.treatmentCategories:[];for(const ee of W)R[ee]=(R[ee]||0)+1}return{districtCounts:m,spendCounts:u,apptCounts:D,omniluxStatuses:l("omniluxStatus"),languages:l("language"),sources:l("omniluxSource"),treatCats:R}},[t]),f=c.useMemo(()=>{let l=t;if(r!=="all"&&(l=l.filter(m=>m.status===r)),x.districts.length&&(l=l.filter(m=>x.districts.includes(ve(m.city)))),x.spendTiers.length&&(l=l.filter(m=>re.filter(u=>x.spendTiers.includes(u.id)).some(u=>u.match(m)))),x.apptTiers.length&&(l=l.filter(m=>oe.filter(u=>x.apptTiers.includes(u.id)).some(u=>u.match(m)))),x.treatmentCategories.length&&(l=l.filter(m=>{const u=Array.isArray(m.treatmentCategories)?m.treatmentCategories:[];return x.treatmentCategories.some(D=>u.includes(D))})),x.omniluxStatuses.length&&(l=l.filter(m=>x.omniluxStatuses.includes((m.omniluxStatus||"").trim()))),x.languages.length&&(l=l.filter(m=>x.languages.includes((m.language||"").trim()))),x.sources.length&&(l=l.filter(m=>x.sources.includes((m.omniluxSource||"").trim()))),i.trim()){const m=i.toLowerCase();l=l.filter(u=>{var D,R,P;return((D=u.email)==null?void 0:D.toLowerCase().includes(m))||((R=u.name)==null?void 0:R.toLowerCase().includes(m))||((P=u.phone)==null?void 0:P.includes(m))})}return l},[t,r,x,i]),h=c.useMemo(()=>{const l={all:t.length};return Ze.forEach(m=>{m!=="all"&&(l[m]=t.filter(u=>u.status===m).length)}),l},[t]),d=x.districts.length+x.spendTiers.length+x.apptTiers.length+x.treatmentCategories.length+x.omniluxStatuses.length+x.languages.length+x.sources.length,S=Math.ceil(f.length/je),T=f.slice(N*je,(N+1)*je);async function H(l,m){const u={status:m,updatedAt:X()};m==="unsubscribed"&&(u.unsubscribedAt=X(),u.optOutCampaignId=null,u.optOutCampaignName=null,u.optOutSource="manual"),m==="active"&&(u.unsubscribedAt=null,u.bouncedAt=null,u.complainedAt=null,u.failedAt=null,u.lastEvent=null,u.optOutCampaignId=null,u.optOutCampaignName=null,u.optOutSource=null),await le(J(_,"email_contacts",l.id),u),s(D=>D.map(R=>R.id===l.id?{...R,...u}:R))}const $=(h.bounced||0)+(h.complained||0)+(h.failed||0)+(h.unsubscribed||0);return e.jsxs("div",{className:"space-y-4",children:[$>0&&r==="all"&&d===0&&e.jsxs("div",{className:"bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800 flex items-center gap-2",children:[e.jsx("span",{className:"text-lg",children:"⚠️"}),e.jsxs("span",{children:[e.jsx("strong",{children:$})," επαφές είναι ανενεργές (bounce / spam / αποτυχία / opt-out) και εξαιρούνται αυτόματα από κάθε αποστολή."]})]}),(()=>{const l=t.filter(m=>m.status==="active"&&!He(m.email)).length;return!l||r!=="all"||d!==0?null:e.jsxs("div",{className:"bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-600 flex items-center gap-2",children:[e.jsx("span",{className:"text-lg",children:"📭"}),e.jsxs("span",{children:[e.jsx("strong",{children:l})," ενεργές επαφές δεν έχουν έγκυρο email και δεν θα συμπεριληφθούν σε καμπάνιες."," ","Αυτός είναι ο λόγος που ο αριθμός στην αποστολή είναι ",e.jsx("strong",{children:h.active-l})," αντί για ",e.jsx("strong",{children:h.active}),"."]})]})})(),e.jsxs("div",{className:"flex flex-wrap items-center justify-between gap-3",children:[e.jsx("div",{className:"flex items-center gap-2 flex-wrap",children:Ze.map(l=>{const m=h[l]||0;return l!=="all"&&l!=="active"&&m===0?null:e.jsxs("button",{onClick:()=>b(l),className:`px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${r===l?"bg-blue-600 text-white border-blue-600":"bg-white text-gray-600 border-gray-300 hover:border-blue-400"}`,children:[Nn[l],e.jsx("span",{className:`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${r===l?"bg-white/20":Te.has(l)&&m>0?"bg-red-100 text-red-600":"opacity-60"}`,children:m})]},l)})}),e.jsx("button",{className:"btn-primary text-sm",onClick:()=>p(!0),children:"+ Εισαγωγή CSV / Excel"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("input",{className:"input flex-1 max-w-sm",placeholder:"Αναζήτηση ονόματος, email, τηλεφώνου…",value:i,onChange:l=>z(l.target.value)}),e.jsxs("button",{onClick:()=>k(l=>!l),className:`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${g||d>0?"bg-blue-600 text-white border-blue-600":"bg-white text-gray-600 border-gray-300 hover:border-blue-400"}`,children:[e.jsx("span",{children:"🔽 Φίλτρα"}),d>0&&e.jsx("span",{className:"bg-white/20 text-white text-xs font-bold px-1.5 py-0.5 rounded-full",children:d})]}),d>0&&e.jsx("button",{onClick:()=>{w(Qe),A(0)},className:"text-xs text-gray-400 hover:text-red-500 font-medium transition-colors",children:"✕ Καθαρισμός"})]}),g&&e.jsxs("div",{className:"border border-gray-200 rounded-xl bg-gray-50 p-4 space-y-4",children:[Object.keys(O.districtCounts).length>0&&e.jsx(me,{title:"📍 Περιοχή",children:Ie.map(({id:l,color:m})=>{const u=O.districtCounts[l];return u?e.jsx(xe,{label:l,count:u,active:x.districts.includes(l),color:m,onClick:()=>E(D=>({...D,districts:pe(D.districts,l)}))},l):null})}),e.jsx(me,{title:"💶 Δαπάνη",children:re.map(l=>{const m=O.spendCounts[l.id]||0;return m?e.jsx(xe,{label:l.label,count:m,active:x.spendTiers.includes(l.id),color:"green",onClick:()=>E(u=>({...u,spendTiers:pe(u.spendTiers,l.id)}))},l.id):null})}),e.jsx(me,{title:"📅 Ραντεβού",children:oe.map(l=>{const m=O.apptCounts[l.id]||0;return m?e.jsx(xe,{label:l.label,count:m,active:x.apptTiers.includes(l.id),color:"purple",onClick:()=>E(u=>({...u,apptTiers:pe(u.apptTiers,l.id)}))},l.id):null})}),Object.keys(O.treatCats).length>0&&e.jsx(me,{title:"💆 Κατηγορία Θεραπείας",children:Object.entries(Le).map(([l,{label:m,icon:u}])=>{const D=O.treatCats[l];return D?e.jsx(xe,{label:`${u} ${m}`,count:D,active:x.treatmentCategories.includes(l),color:"green",onClick:()=>E(R=>({...R,treatmentCategories:pe(R.treatmentCategories,l)}))},l):null})}),O.omniluxStatuses.length>0&&e.jsx(me,{title:"👤 Status CRM",children:O.omniluxStatuses.map(([l,m])=>e.jsx(xe,{label:l,count:m,active:x.omniluxStatuses.includes(l),color:"orange",onClick:()=>E(u=>({...u,omniluxStatuses:pe(u.omniluxStatuses,l)}))},l))}),O.sources.length>0&&e.jsx(me,{title:"📋 Πηγή",children:O.sources.map(([l,m])=>e.jsx(xe,{label:l,count:m,active:x.sources.includes(l),color:"purple",onClick:()=>E(u=>({...u,sources:pe(u.sources,l)}))},l))}),O.languages.length>0&&e.jsx(me,{title:"🌐 Γλώσσα",children:O.languages.map(([l,m])=>e.jsx(xe,{label:l,count:m,active:x.languages.includes(l),onClick:()=>E(u=>({...u,languages:pe(u.languages,l)}))},l))})]}),d>0&&e.jsxs("div",{className:"flex flex-wrap gap-1.5 text-xs",children:[x.districts.map(l=>e.jsxs("span",{className:"inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium",children:["📍 ",l,e.jsx("button",{onClick:()=>E(m=>({...m,districts:m.districts.filter(u=>u!==l)})),className:"hover:text-blue-900",children:"✕"})]},l)),x.spendTiers.map(l=>{const m=re.find(u=>u.id===l);return m?e.jsxs("span",{className:"inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium",children:["💶 ",m.label,e.jsx("button",{onClick:()=>E(u=>({...u,spendTiers:u.spendTiers.filter(D=>D!==l)})),className:"hover:text-emerald-900",children:"✕"})]},l):null}),x.apptTiers.map(l=>{const m=oe.find(u=>u.id===l);return m?e.jsxs("span",{className:"inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium",children:["📅 ",m.label,e.jsx("button",{onClick:()=>E(u=>({...u,apptTiers:u.apptTiers.filter(D=>D!==l)})),className:"hover:text-purple-900",children:"✕"})]},l):null}),x.treatmentCategories.map(l=>{var m,u;return e.jsxs("span",{className:"inline-flex items-center gap-1 bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium",children:[(m=Le[l])==null?void 0:m.icon," ",((u=Le[l])==null?void 0:u.label)||l,e.jsx("button",{onClick:()=>E(D=>({...D,treatmentCategories:D.treatmentCategories.filter(R=>R!==l)})),className:"hover:text-emerald-900",children:"✕"})]},l)}),x.omniluxStatuses.map(l=>e.jsxs("span",{className:"inline-flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium",children:["👤 ",l,e.jsx("button",{onClick:()=>E(m=>({...m,omniluxStatuses:m.omniluxStatuses.filter(u=>u!==l)})),className:"hover:text-orange-900",children:"✕"})]},l)),x.sources.map(l=>e.jsxs("span",{className:"inline-flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium",children:["📋 ",l,e.jsx("button",{onClick:()=>E(m=>({...m,sources:m.sources.filter(u=>u!==l)})),className:"hover:text-purple-900",children:"✕"})]},l)),x.languages.map(l=>e.jsxs("span",{className:"inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium",children:["🌐 ",l,e.jsx("button",{onClick:()=>E(m=>({...m,languages:m.languages.filter(u=>u!==l)})),className:"hover:text-blue-900",children:"✕"})]},l))]}),n?e.jsxs("div",{className:"card p-8 text-center space-y-3",children:[e.jsx("div",{className:"inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"}),e.jsx("div",{className:"text-gray-400 text-sm",children:"Φόρτωση επαφών…"})]}):f.length===0?e.jsxs("div",{className:"text-center py-20 text-gray-400",children:[e.jsx("div",{className:"text-4xl mb-3",children:"📭"}),e.jsx("div",{children:"Δεν βρέθηκαν επαφές"}),t.length===0&&e.jsx("button",{className:"mt-4 btn-primary text-sm",onClick:()=>p(!0),children:"+ Εισαγωγή CSV / Excel"})]}):e.jsxs("div",{className:"card overflow-hidden",children:[e.jsx("div",{className:"overflow-x-auto",children:e.jsxs("table",{className:"w-full text-sm",children:[e.jsx("thead",{className:"bg-gray-50 border-b border-gray-200",children:e.jsxs("tr",{children:[e.jsx("th",{className:"text-left px-4 py-3 font-medium text-gray-500",children:"Όνομα"}),e.jsx("th",{className:"text-left px-4 py-3 font-medium text-gray-500",children:"Email"}),e.jsx("th",{className:"text-left px-4 py-3 font-medium text-gray-500 hidden sm:table-cell",children:"Τηλέφωνο"}),e.jsx("th",{className:"text-left px-4 py-3 font-medium text-gray-500 hidden md:table-cell",children:"Πηγή"}),e.jsx("th",{className:"text-left px-4 py-3 font-medium text-gray-500",children:"Status"}),r==="unsubscribed"&&e.jsx("th",{className:"text-left px-4 py-3 font-medium text-gray-500 hidden lg:table-cell",children:"Καμπάνια opt-out"}),e.jsx("th",{className:"text-left px-4 py-3 font-medium text-gray-500 hidden lg:table-cell",children:"Αποστολές"}),e.jsx("th",{className:"px-4 py-3"})]})}),e.jsx("tbody",{className:"divide-y divide-gray-100",children:T.map(l=>{const{label:m,cls:u,next:D}=kn(l.status);return e.jsxs("tr",{onClick:()=>j(l),className:`hover:bg-blue-50 cursor-pointer transition-colors ${Te.has(l.status)?"opacity-70":""}`,children:[e.jsxs("td",{className:"px-4 py-3 font-medium text-gray-900",children:[e.jsxs("div",{className:"flex items-center gap-1.5 flex-wrap",children:[l.name||e.jsx("span",{className:"text-gray-400 italic text-xs",children:"Χωρίς όνομα"}),l.lastEngagedAt&&l.status==="active"&&e.jsx("span",{title:"Engaged",children:"🔥"})]}),e.jsxs("div",{className:"flex flex-wrap gap-1 mt-1",children:[At(l).slice(0,4).map(R=>e.jsx("span",{className:`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium border ${R.cls}`,children:R.label},R.key)),Pe(l.totalSpend)&&e.jsx("span",{className:"inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200",children:Pe(l.totalSpend)})]})]}),e.jsx("td",{className:"px-4 py-3 text-gray-600 text-xs",children:l.email}),e.jsx("td",{className:"px-4 py-3 text-gray-500 text-sm hidden sm:table-cell",children:l.phone||"—"}),e.jsx("td",{className:"px-4 py-3 hidden md:table-cell",children:e.jsxs("div",{className:"flex flex-col gap-0.5",children:[e.jsx(jn,{source:l.source}),(l.addedAt||l.importedAt)&&e.jsx("span",{className:"text-xs text-gray-400",children:wn(l.addedAt||l.importedAt)})]})}),e.jsx("td",{className:"px-4 py-3",children:e.jsx("span",{className:`badge text-xs ${kt(l.status)}`,children:Nt(l.status)})}),r==="unsubscribed"&&e.jsx("td",{className:"px-4 py-3 hidden lg:table-cell",children:l.optOutCampaignName?e.jsx("span",{className:"text-xs text-gray-700 font-medium",children:l.optOutCampaignName}):l.optOutSource==="manual"?e.jsx("span",{className:"text-xs text-gray-400 italic",children:"Χειροκίνητα"}):e.jsx("span",{className:"text-xs text-gray-300",children:"—"})}),e.jsx("td",{className:"px-4 py-3 text-gray-500 hidden lg:table-cell",children:l.sendCount||0}),e.jsx("td",{className:"px-4 py-3",onClick:R=>R.stopPropagation(),children:e.jsx("button",{onClick:()=>H(l,D),className:`text-xs px-2 py-1 rounded-md border transition-colors ${u}`,children:m})})]},l.id)})})]})}),e.jsxs("div",{className:"px-4 py-2 border-t bg-gray-50 flex items-center justify-between gap-4 flex-wrap text-xs text-gray-400",children:[e.jsxs("span",{children:["Εμφανίζονται ",N*je+1,"–",Math.min((N+1)*je,f.length)," από ",f.length," επαφές",r==="active"&&d===0&&e.jsxs("span",{className:"ml-2 text-green-600 font-medium",children:["· ",h.active," θα λάβουν την επόμενη καμπάνια"]})]}),S>1&&e.jsxs("div",{className:"flex items-center gap-1",children:[e.jsx("button",{onClick:()=>A(0),disabled:N===0,className:"px-2 py-1 rounded border border-gray-200 hover:border-blue-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors",children:"«"}),e.jsx("button",{onClick:()=>A(l=>l-1),disabled:N===0,className:"px-2 py-1 rounded border border-gray-200 hover:border-blue-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors",children:"‹"}),e.jsxs("span",{className:"px-2 text-gray-500 font-medium",children:[N+1," / ",S]}),e.jsx("button",{onClick:()=>A(l=>l+1),disabled:N>=S-1,className:"px-2 py-1 rounded border border-gray-200 hover:border-blue-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors",children:"›"}),e.jsx("button",{onClick:()=>A(S-1),disabled:N>=S-1,className:"px-2 py-1 rounded border border-gray-200 hover:border-blue-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors",children:"»"})]})]})]}),C&&e.jsx(hn,{onClose:()=>p(!1),existingContacts:t}),v&&e.jsx(yn,{contact:v,onClose:()=>j(null),onStatusChange:l=>j(l)})]})}const Cn="Dermlux",Sn="noreply@dermluxclinics.com";function Ct({campaign:t,onClose:n}){const{currentUser:s}=Dt(),i=!!(t!=null&&t.id),[a,r]=c.useState((t==null?void 0:t.name)||""),[y,x]=c.useState((t==null?void 0:t.subject)||""),[w,g]=c.useState((t==null?void 0:t.fromName)||Cn),[k,C]=c.useState((t==null?void 0:t.fromEmail)||Sn),[p,v]=c.useState((t==null?void 0:t.htmlBody)||""),[j,N]=c.useState(!1),[A,b]=c.useState(!1),[z,E]=c.useState("");async function O(){if(!a.trim()||!y.trim()||!p.trim()){E("Συμπλήρωσε: Όνομα, Θέμα, και HTML template.");return}b(!0),E("");try{const f={name:a.trim(),subject:y.trim(),fromName:w.trim(),fromEmail:k.trim(),htmlBody:p,updatedAt:X()};i?await le(J(_,"email_campaigns",t.id),f):await xt(ae(_,"email_campaigns"),{...f,status:"draft",stats:{total:0,sent:0,failed:0,opened:0,clicked:0,bounced:0,unsubscribed:0},createdAt:X(),createdBy:s.uid,sentAt:null}),n()}catch(f){E(f.message)}finally{b(!1)}}return e.jsx("div",{className:"fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto",children:e.jsxs("div",{className:"card w-full max-w-4xl p-6 mt-4 mb-4 space-y-5",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("h2",{className:"text-lg font-semibold",children:i?"Επεξεργασία Καμπάνιας":"Νέα Καμπάνια"}),e.jsx("button",{onClick:n,className:"text-gray-400 hover:text-gray-600 text-xl",children:"✕"})]}),e.jsxs("div",{className:"grid grid-cols-1 sm:grid-cols-2 gap-4",children:[e.jsxs("div",{className:"sm:col-span-2",children:[e.jsx("label",{className:"label",children:"Όνομα Καμπάνιας *"}),e.jsx("input",{className:"input",placeholder:"π.χ. Προσφορά Ιουνίου 2026",value:a,onChange:f=>r(f.target.value)})]}),e.jsxs("div",{className:"sm:col-span-2",children:[e.jsx("label",{className:"label",children:"Θέμα Email (Subject) *"}),e.jsx("input",{className:"input",placeholder:"π.χ. Αποκλειστική προσφορά για εσάς 🎁",value:y,onChange:f=>x(f.target.value)})]}),e.jsxs("div",{children:[e.jsx("label",{className:"label",children:"Από (Όνομα)"}),e.jsx("input",{className:"input",value:w,onChange:f=>g(f.target.value)})]}),e.jsxs("div",{children:[e.jsx("label",{className:"label",children:"Από (Email)"}),e.jsx("input",{className:"input",type:"email",value:k,onChange:f=>C(f.target.value)})]})]}),e.jsxs("div",{className:"space-y-2",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("label",{className:"label mb-0",children:"HTML Template *"}),e.jsxs("div",{className:"flex gap-1 bg-gray-100 rounded-lg p-0.5",children:[e.jsx("button",{onClick:()=>N(!1),className:`px-3 py-1 rounded-md text-xs font-medium transition-colors ${j?"text-gray-500":"bg-white shadow-sm text-gray-800"}`,children:"✏️ Επεξεργασία"}),e.jsx("button",{onClick:()=>N(!0),className:`px-3 py-1 rounded-md text-xs font-medium transition-colors ${j?"bg-white shadow-sm text-gray-800":"text-gray-500"}`,children:"👁 Preview"})]})]}),e.jsxs("div",{className:"text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2 border",children:[e.jsx("span",{className:"font-medium text-gray-500",children:"Placeholders:"})," ",e.jsx("code",{className:"bg-white px-1 rounded border text-xs",children:"{{name}}"})," — όνομα πελάτη,"," ",e.jsx("code",{className:"bg-white px-1 rounded border text-xs",children:"{{unsubscribe_url}}"})," — link διαγραφής (να το βάζεις πάντα στο footer)"]}),j?e.jsx("div",{className:"border rounded-xl overflow-hidden bg-white",style:{height:"420px"},children:p.trim()?e.jsx("iframe",{srcDoc:p,className:"w-full h-full border-0",sandbox:"allow-same-origin",title:"Email Preview"}):e.jsx("div",{className:"h-full flex items-center justify-center text-gray-400",children:"Γράψε HTML για να δεις preview"})}):e.jsx("textarea",{className:"input resize-none font-mono text-xs",rows:16,value:p,onChange:f=>v(f.target.value),placeholder:`<!DOCTYPE html>
<html>
<body>
  <h1>Γεια σου {{name}}!</h1>
  <p>...</p>
  <p><a href="{{unsubscribe_url}}">Διαγραφή από λίστα</a></p>
</body>
</html>`})]}),z&&e.jsxs("div",{className:"text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2",children:["⚠️ ",z]}),e.jsxs("div",{className:"flex gap-3 pt-1",children:[e.jsx("button",{className:"btn-secondary flex-1",onClick:n,disabled:A,children:"Ακύρωση"}),e.jsx("button",{className:"btn-primary flex-1",onClick:O,disabled:A,children:A?"Αποθήκευση…":"Αποθήκευση Draft"})]})]})})}const et="  https://empty-hall-968f.therapon1997.workers.dev",tt=[25,50,100,200,500],ke=[{label:"30 λεπτά",value:.5},{label:"1 ώρα",value:1},{label:"2 ώρες",value:2},{label:"4 ώρες",value:4},{label:"6 ώρες",value:6},{label:"12 ώρες",value:12},{label:"24 ώρες",value:24}],De={districts:[],excludeDistricts:[],spendTiers:[],apptTiers:[],statuses:[],excludeStatuses:[],sources:[],languages:[],treatmentCategories:[],excludeTreatmentCategories:[],keyword:""},nt={injectables:{label:"Injectables",icon:"💉"},laser:{label:"Laser",icon:"⚡"},facial:{label:"Facial",icon:"✨"},consultation:{label:"Consultation",icon:"📋"},other:{label:"Other",icon:"🔖"}};function En(t,n,s){const i=Math.ceil(t/n);if(i<=1)return{label:"Αμέσως",detail:"1 batch"};const a=(i-1)*s;return a<1?{label:`~${Math.round(a*60)} λεπτά`,detail:`${i} batches`}:a<24?{label:`~${a%1===0?a:a.toFixed(1)} ώρες`,detail:`${i} batches`}:{label:`~${(a/24).toFixed(1)} μέρες`,detail:`${i} batches`}}function te(t,n){return t.includes(n)?t.filter(s=>s!==n):[...t,n]}function ne({label:t,count:n,active:s,onClick:i,color:a="blue"}){const r={blue:s?"bg-blue-600 text-white border-blue-600":"bg-white text-gray-600 border-gray-200 hover:border-blue-400",red:s?"bg-red-500 text-white border-red-500":"bg-white text-gray-600 border-gray-200 hover:border-red-400",green:s?"bg-emerald-600 text-white border-emerald-600":"bg-white text-gray-600 border-gray-200 hover:border-emerald-400",purple:s?"bg-purple-600 text-white border-purple-600":"bg-white text-gray-600 border-gray-200 hover:border-purple-400"};return e.jsxs("button",{onClick:i,className:`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${r[a]}`,children:[t,n!=null&&e.jsx("span",{className:`text-xs font-semibold ${s?"opacity-80":"text-gray-400"}`,children:n})]})}function se({title:t,icon:n,children:s}){return e.jsxs("div",{className:"space-y-2",children:[e.jsxs("div",{className:"text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5",children:[e.jsx("span",{children:n}),t]}),e.jsx("div",{className:"flex flex-wrap gap-1.5",children:s})]})}function Tn({campaign:t,onClose:n}){var $e,Me,Ge;const[s,i]=c.useState(!0),[a,r]=c.useState([]),[y,x]=c.useState(0),[w,g]=c.useState("preview"),[k,C]=c.useState(0),[p,v]=c.useState(0),[j,N]=c.useState(0),[A,b]=c.useState(""),[z,E]=c.useState(!1),[O,f]=c.useState(!1),[h,d]=c.useState(De),[S,T]=c.useState(t.batchSize||100),[H,$]=c.useState(t.intervalHours||2);c.useEffect(()=>{async function o(){try{const F=(await ye(de(ae(_,"email_contacts"),we("status","==","active")))).docs.map(I=>({id:I.id,...I.data()})).filter(I=>on(I.status)&&He(I.email)),V=await ye(de(ae(_,"email_sends"),we("campaignId","==",t.id))),U=new Set(V.docs.filter(I=>I.data().status!=="failed"&&!I.data().isTest).map(I=>I.data().email));x(U.size),r(F.filter(I=>!U.has(I.email))),i(!1)}catch(L){b(L.message),i(!1)}}o()},[t.id]);const l=c.useMemo(()=>{const o=I=>{const B={};for(const G of a){const ie=(G[I]||"").trim();ie&&(B[ie]=(B[ie]||0)+1)}return Object.entries(B).sort((G,ie)=>ie[1]-G[1])},L={};for(const I of a){const B=ve(I.city);B&&(L[B]=(L[B]||0)+1)}const F={};for(const I of re)F[I.id]=a.filter(I.match).length;const V={};for(const I of oe)V[I.id]=a.filter(I.match).length;const U={};for(const I of a){const B=Array.isArray(I.treatmentCategories)?I.treatmentCategories:[];for(const G of B)U[G]=(U[G]||0)+1}return{districtCounts:L,spendCounts:F,apptCounts:V,statuses:o("omniluxStatus"),sources:o("omniluxSource"),languages:o("language"),treatmentCategories:U}},[a]),m=c.useMemo(()=>a.filter(o=>{const L=ve(o.city),F=(o.omniluxStatus||"").trim(),V=(o.omniluxSource||"").trim(),U=(o.language||"").trim(),I=h.keyword.toLowerCase().trim();if(h.districts.length&&!h.districts.includes(L)||h.excludeDistricts.length&&h.excludeDistricts.includes(L)||h.spendTiers.length&&!re.filter(B=>h.spendTiers.includes(B.id)).some(B=>B.match(o))||h.apptTiers.length&&!oe.filter(B=>h.apptTiers.includes(B.id)).some(B=>B.match(o))||h.statuses.length&&!h.statuses.includes(F)||h.excludeStatuses.length&&h.excludeStatuses.includes(F)||h.sources.length&&!h.sources.includes(V)||h.languages.length&&!h.languages.includes(U))return!1;if(h.treatmentCategories.length){const B=Array.isArray(o.treatmentCategories)?o.treatmentCategories:[];if(!h.treatmentCategories.some(G=>B.includes(G)))return!1}if(h.excludeTreatmentCategories.length){const B=Array.isArray(o.treatmentCategories)?o.treatmentCategories:[];if(h.excludeTreatmentCategories.some(G=>B.includes(G)))return!1}return!(I&&!`${o.treatments||""} ${o.categories||""}`.toLowerCase().includes(I))}),[a,h]),u=m.slice(0,S),D=m.length-u.length,R=En(m.length,S,H),P=[h.districts.length,h.excludeDistricts.length,h.spendTiers.length,h.apptTiers.length,h.statuses.length,h.excludeStatuses.length,h.sources.length,h.languages.length,h.treatmentCategories.length,h.excludeTreatmentCategories.length,h.keyword!==""].filter(Boolean).length,W=(t.htmlBody||"").replaceAll("{{name}}","Αγαπητέ Πελάτη").replaceAll("{{unsubscribe_url}}","#");async function ee(o=!1){var I;if(et.includes("YOUR-SUBDOMAIN")){b("Το VITE_WORKER_URL δεν έχει οριστεί.");return}g("sending"),b(""),E(o);const L=t.status==="draft",F=o&&Object.entries(h).some(([B,G])=>Array.isArray(G)?G.length>0:G!=="");await le(J(_,"email_campaigns",t.id),{status:"sending",batchSize:S,intervalHours:H,"stats.total":L?m.length:((I=t.stats)==null?void 0:I.total)??m.length+y,...L?{sentAt:X()}:{},...o?{audienceSegment:F?JSON.stringify(h):null}:{}});let V=0,U=0;try{const B=await fetch(`${et}/send-campaign`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({campaignId:t.id,campaign:{name:t.name,subject:t.subject,fromName:t.fromName,fromEmail:t.fromEmail,htmlBody:t.htmlBody},contacts:u.map(q=>({id:q.id,email:q.email,name:q.name||""}))})});if(!B.ok)throw new Error(`Worker error: ${await B.text()}`);const{results:G}=await B.json();V=G.filter(q=>q.status==="sent").length,U=G.filter(q=>q.status==="failed").length,v(V),N(U),C(100);for(let q=0;q<G.length;q+=500){const Ue=pt(_);G.slice(q,q+500).forEach(ue=>{Ue.set(J(_,"email_sends",`${t.id}||${ue.email}`),{campaignId:t.id,contactId:_e(ue.email),email:ue.email,resendId:ue.resendId||null,status:ue.status,sentAt:X(),failedReason:ue.error||null,openedAt:null,clickedAt:null,bouncedAt:null,createdAt:X()})}),await Ue.commit()}const ie=D===0,zt=ie?"sent":o?"auto":"partial";await le(J(_,"email_campaigns",t.id),{status:zt,"stats.sent":We(V),"stats.failed":We(U),...o&&!ie?{autoSend:!0,nextBatchAt:mt.fromMillis(Date.now()+H*60*60*1e3)}:{}}),g("done")}catch(B){b(B.message),await le(J(_,"email_campaigns",t.id),{status:y>0?"partial":"draft"}).catch(()=>{}),g("confirm")}}if(s)return e.jsx(Ae,{onClose:n,title:"Αποστολή Καμπάνιας",children:e.jsx("div",{className:"text-center py-10 text-gray-400",children:"Φόρτωση επαφών…"})});if(!s&&a.length===0)return e.jsx(Ae,{onClose:n,title:"Αποστολή Ολοκληρώθηκε",children:e.jsxs("div",{className:"text-center py-8 space-y-3",children:[e.jsx("div",{className:"text-5xl",children:"✅"}),e.jsx("div",{className:"text-lg font-semibold text-green-700",children:"Όλες οι επαφές έχουν λάβει αυτή την καμπάνια!"}),e.jsxs("div",{className:"text-sm text-gray-500",children:[y," επαφές έχουν ήδη λάβει αυτό το email."]}),e.jsx("button",{className:"btn-primary mt-2",onClick:n,children:"Κλείσιμο"})]})});if(w==="done"){const o=z&&D>0;return e.jsx(Ae,{onClose:n,title:D===0?"Αποστολή Ολοκληρώθηκε":o?"Αυτόματη Αποστολή Ξεκίνησε":"Batch Στάλθηκε",children:e.jsxs("div",{className:"text-center py-6 space-y-4",children:[e.jsx("div",{className:"text-5xl",children:D===0?"✅":o?"🤖":"⏸️"}),e.jsx("div",{className:`text-lg font-semibold ${D===0?"text-green-700":o?"text-purple-700":"text-blue-700"}`,children:D===0?"Η καμπάνια ολοκληρώθηκε!":o?`Στάλθηκαν ${p} — συνεχίζει αυτόματα`:`${p} emails στάλθηκαν`}),e.jsxs("div",{className:"bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm space-y-1.5",children:[e.jsx(Fe,{label:"Στάλθηκαν τώρα",val:p,cls:"text-green-600"}),j>0&&e.jsx(Fe,{label:"Αποτυχίες",val:j,cls:"text-red-500"}),e.jsx(Fe,{label:"Εναπομένουν",val:D,cls:D>0?o?"text-purple-600":"text-orange-600":"text-gray-400",border:!0})]}),o&&e.jsxs("div",{className:"bg-purple-50 border border-purple-200 rounded-lg px-4 py-3 text-sm text-purple-800",children:["Τα επόμενα ",e.jsx("strong",{children:Math.min(D,S)})," emails θα αποσταλούν αυτόματα σε ",e.jsx("strong",{children:($e=ke.find(L=>L.value===H))==null?void 0:$e.label}),". Μπορείτε να κλείσετε τη σελίδα."]}),e.jsxs("div",{className:"flex gap-2",children:[!o&&e.jsx("button",{className:"btn-secondary flex-1",onClick:()=>{d(De),g("audience")},children:"🎯 Νέο Κοινό"}),e.jsx("button",{className:"btn-primary flex-1",onClick:n,children:"Κλείσιμο"})]})]})})}if(w==="sending")return e.jsx(Ae,{title:"Αποστολή σε εξέλιξη…",children:e.jsxs("div",{className:"space-y-5 py-2",children:[e.jsxs("div",{className:"space-y-2",children:[e.jsxs("div",{className:"flex justify-between text-sm font-medium",children:[e.jsxs("span",{className:"text-blue-700",children:["Αποστολή ",u.length," emails…"]}),e.jsxs("span",{children:[k,"%"]})]}),e.jsx("div",{className:"h-3 bg-gray-200 rounded-full overflow-hidden",children:e.jsx("div",{className:"h-full bg-blue-500 rounded-full transition-all duration-300",style:{width:`${k}%`}})})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-4 text-center",children:[e.jsxs("div",{children:[e.jsx("div",{className:"text-2xl font-bold text-green-600",children:p}),e.jsx("div",{className:"text-xs text-gray-500",children:"Στάλθηκαν"})]}),e.jsxs("div",{children:[e.jsx("div",{className:"text-2xl font-bold text-red-400",children:j}),e.jsx("div",{className:"text-xs text-gray-500",children:"Αποτυχίες"})]})]}),A&&e.jsxs("div",{className:"text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2",children:["⚠️ ",A]})]})});const ce=[{id:"preview",label:"👁 Προεπισκόπηση"},{id:"audience",label:P>0?`🎯 Κοινό  ${P}`:"🎯 Κοινό"},{id:"autoConfirm",label:"🤖 Αυτόματη"},{id:"confirm",label:"📤 Χειροκίνητη"}];return e.jsx("div",{className:"fixed inset-0 bg-black/50 flex items-start justify-center z-50 p-4 overflow-y-auto",children:e.jsxs("div",{className:"bg-white rounded-2xl shadow-xl w-full max-w-3xl mt-4 mb-4",children:[e.jsxs("div",{className:"flex items-center justify-between px-6 py-4 border-b",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-lg font-semibold text-gray-900",children:"Αποστολή Καμπάνιας"}),y>0&&e.jsxs("div",{className:"text-xs text-orange-600 mt-0.5",children:["Συνέχεια — ",y," έχουν ήδη λάβει αυτό το email"]})]}),e.jsx("button",{onClick:n,className:"text-gray-400 hover:text-gray-600 text-xl leading-none",children:"✕"})]}),e.jsx("div",{className:"px-6 pt-4",children:e.jsx("div",{className:"flex gap-1 bg-gray-100 rounded-lg p-1 text-sm overflow-x-auto",children:ce.map(o=>e.jsx("button",{onClick:()=>g(o.id),className:`flex-1 py-2 px-2 rounded-md font-medium transition-colors whitespace-nowrap ${w===o.id?o.id==="autoConfirm"?"bg-white shadow-sm text-purple-700":o.id==="audience"?"bg-white shadow-sm text-blue-700":"bg-white shadow-sm text-gray-900":"text-gray-500 hover:text-gray-700"}`,children:o.label},o.id))})}),e.jsxs("div",{className:"px-6 pb-6 pt-4 space-y-4",children:[w==="preview"&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"grid grid-cols-2 gap-3 text-sm",children:[e.jsxs("div",{className:"bg-gray-50 rounded-lg px-3 py-2",children:[e.jsx("div",{className:"text-xs text-gray-400 mb-0.5",children:"Θέμα"}),e.jsx("div",{className:"font-medium text-gray-800 truncate",children:t.subject})]}),e.jsxs("div",{className:"bg-gray-50 rounded-lg px-3 py-2",children:[e.jsx("div",{className:"text-xs text-gray-400 mb-0.5",children:"Αποστολέας"}),e.jsx("div",{className:"font-medium text-gray-800 truncate",children:t.fromName})]})]}),e.jsx("div",{className:"border border-gray-200 rounded-xl overflow-hidden shadow-inner",style:{height:460},children:W.trim()?e.jsx("iframe",{srcDoc:W,className:"w-full h-full border-0",sandbox:"allow-same-origin",title:"Email Preview"}):e.jsx("div",{className:"h-full flex items-center justify-center text-gray-400",children:"Δεν υπάρχει περιεχόμενο"})}),e.jsxs("div",{className:"flex items-center justify-between pt-1",children:[e.jsxs("div",{className:"text-sm text-gray-500",children:[e.jsx("span",{className:"font-bold text-blue-700",children:a.length})," επαφές συνολικά"]}),e.jsx("button",{className:"btn-primary",onClick:()=>g("audience"),children:"Επόμενο →"})]})]}),w==="audience"&&e.jsxs("div",{className:"space-y-5",children:[e.jsxs("div",{className:"flex items-center justify-between bg-blue-50 border border-blue-200 rounded-xl px-4 py-3",children:[e.jsxs("div",{children:[e.jsx("span",{className:"text-2xl font-bold text-blue-700",children:m.length}),e.jsxs("span",{className:"text-sm text-gray-500 ml-2",children:["/ ",a.length," επαφές επιλεγμένες"]}),P>0&&e.jsxs("span",{className:"ml-2 text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full font-semibold",children:[P," φίλτρα ενεργά"]})]}),P>0&&e.jsx("button",{className:"text-xs text-gray-400 hover:text-red-500 transition-colors font-medium",onClick:()=>d(De),children:"✕ Καθαρισμός"})]}),e.jsx(se,{title:"Περιοχή — Συμπερίληψη",icon:"📍",children:Ie.map(({id:o})=>{const L=l.districtCounts[o]||0;return L?e.jsx(ne,{label:o,count:L,active:h.districts.includes(o),onClick:()=>d(F=>({...F,districts:te(F.districts,o)}))},o):null})}),e.jsx(se,{title:"Περιοχή — Εξαίρεση",icon:"🚫",children:Ie.map(({id:o})=>{const L=l.districtCounts[o]||0;return L?e.jsx(ne,{label:o,count:L,active:h.excludeDistricts.includes(o),color:"red",onClick:()=>d(F=>({...F,excludeDistricts:te(F.excludeDistricts,o)}))},o):null})}),e.jsxs(se,{title:"Δαπάνη",icon:"💶",children:[re.map(o=>{const L=l.spendCounts[o.id]||0;return L?e.jsx(ne,{label:o.label,count:L,active:h.spendTiers.includes(o.id),color:"green",onClick:()=>d(F=>({...F,spendTiers:te(F.spendTiers,o.id)}))},o.id):null}),re.every(o=>!l.spendCounts[o.id])&&e.jsx("span",{className:"text-xs text-gray-400 italic",children:"Δεν υπάρχουν δεδομένα δαπάνης"})]}),e.jsxs(se,{title:"Ραντεβού",icon:"📅",children:[oe.map(o=>{const L=l.apptCounts[o.id]||0;return L?e.jsx(ne,{label:o.label,count:L,active:h.apptTiers.includes(o.id),color:"purple",onClick:()=>d(F=>({...F,apptTiers:te(F.apptTiers,o.id)}))},o.id):null}),oe.every(o=>!l.apptCounts[o.id])&&e.jsx("span",{className:"text-xs text-gray-400 italic",children:"Δεν υπάρχουν δεδομένα ραντεβού"})]}),l.statuses.length>0&&e.jsx(se,{title:"Status CRM — Συμπερίληψη",icon:"👤",children:l.statuses.map(([o,L])=>e.jsx(ne,{label:o,count:L,active:h.statuses.includes(o),color:"green",onClick:()=>d(F=>({...F,statuses:te(F.statuses,o)}))},o))}),l.statuses.length>0&&e.jsx(se,{title:"Status CRM — Εξαίρεση",icon:"🚫",children:l.statuses.map(([o,L])=>e.jsx(ne,{label:o,count:L,active:h.excludeStatuses.includes(o),color:"red",onClick:()=>d(F=>({...F,excludeStatuses:te(F.excludeStatuses,o)}))},o))}),l.languages.length>0&&e.jsx(se,{title:"Γλώσσα",icon:"🌐",children:l.languages.map(([o,L])=>e.jsx(ne,{label:o,count:L,active:h.languages.includes(o),onClick:()=>d(F=>({...F,languages:te(F.languages,o)}))},o))}),Object.keys(l.treatmentCategories).length>0&&e.jsx(se,{title:"Κατηγορία Θεραπείας — Συμπερίληψη",icon:"💆",children:Object.entries(nt).map(([o,{label:L,icon:F}])=>{const V=l.treatmentCategories[o]||0;return V?e.jsx(ne,{label:`${F} ${L}`,count:V,active:h.treatmentCategories.includes(o),color:"green",onClick:()=>d(U=>({...U,treatmentCategories:te(U.treatmentCategories,o)}))},o):null})}),Object.keys(l.treatmentCategories).length>0&&e.jsx(se,{title:"Κατηγορία Θεραπείας — Εξαίρεση",icon:"🚫",children:Object.entries(nt).map(([o,{label:L,icon:F}])=>{const V=l.treatmentCategories[o]||0;return V?e.jsx(ne,{label:`${F} ${L}`,count:V,active:h.excludeTreatmentCategories.includes(o),color:"red",onClick:()=>d(U=>({...U,excludeTreatmentCategories:te(U.excludeTreatmentCategories,o)}))},o):null})}),l.sources.length>0&&e.jsx(se,{title:"Πηγή Επαφής",icon:"📋",children:l.sources.map(([o,L])=>e.jsx(ne,{label:o,count:L,active:h.sources.includes(o),color:"purple",onClick:()=>d(F=>({...F,sources:te(F.sources,o)}))},o))}),e.jsxs("div",{children:[e.jsxs("button",{className:"text-xs font-semibold text-gray-400 hover:text-gray-600 flex items-center gap-1",onClick:()=>f(o=>!o),children:[O?"▲":"▼"," Προχωρημένα (Θεραπεία / Κατηγορία)"]}),O&&e.jsxs("div",{className:"mt-3 border border-gray-200 rounded-xl p-4 bg-gray-50",children:[e.jsx("input",{type:"text",placeholder:"π.χ. laser, botox, facial…",value:h.keyword,onChange:o=>d(L=>({...L,keyword:o.target.value})),className:"input w-full text-sm"}),e.jsx("div",{className:"text-xs text-gray-400 mt-1",children:"Αναζήτηση στα πεδία Treatments και Categories"})]})]}),m.length===0&&e.jsx("div",{className:"text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2",children:"⚠️ Κανένα αποτέλεσμα με τα τρέχοντα φίλτρα. Αλλάξτε την επιλογή."}),e.jsxs("div",{className:"flex gap-3 pt-1",children:[e.jsx("button",{className:"btn-secondary flex-1",onClick:()=>g("preview"),children:"← Πίσω"}),e.jsx("button",{className:"btn-primary flex-1 bg-purple-600 hover:bg-purple-700",disabled:m.length===0,onClick:()=>g("autoConfirm"),children:"🤖 Αυτόματη →"}),e.jsx("button",{className:"btn-primary flex-1",disabled:m.length===0,onClick:()=>g("confirm"),children:"📤 Χειροκίνητη →"})]})]}),w==="autoConfirm"&&e.jsxs("div",{className:"space-y-4",children:[e.jsx(st,{remaining:m,allActive:a,activeFilters:P,onEdit:()=>g("audience")}),e.jsxs("div",{className:"grid grid-cols-2 gap-3",children:[e.jsxs("div",{className:"space-y-1.5",children:[e.jsx("label",{className:"text-xs font-semibold text-gray-500 uppercase tracking-wide",children:"Μέγεθος Batch"}),e.jsx("select",{className:"input w-full text-sm",value:S,onChange:o=>T(Number(o.target.value)),children:tt.map(o=>e.jsxs("option",{value:o,children:[o," emails / batch"]},o))})]}),e.jsxs("div",{className:"space-y-1.5",children:[e.jsx("label",{className:"text-xs font-semibold text-gray-500 uppercase tracking-wide",children:"Συχνότητα"}),e.jsx("select",{className:"input w-full text-sm",value:H,onChange:o=>$(Number(o.target.value)),children:ke.map(o=>e.jsx("option",{value:o.value,children:o.label},o.value))})]})]}),e.jsxs("div",{className:"bg-purple-50 border border-purple-200 rounded-xl p-4",children:[e.jsx("div",{className:"text-xs font-semibold text-purple-600 uppercase tracking-wider mb-3",children:"📊 Υπολογισμός Αποστολής"}),e.jsx("div",{className:"grid grid-cols-4 gap-3 text-center",children:[{val:m.length,label:"Επαφές"},{val:Math.ceil(m.length/S),label:"Batches"},{val:(Me=ke.find(o=>o.value===H))==null?void 0:Me.label.split(" ")[0],label:"Μεταξύ batches"},{val:R.label,label:"Εκτίμηση",cls:"text-emerald-600"}].map(({val:o,label:L,cls:F})=>e.jsxs("div",{className:"bg-white rounded-lg p-3 border border-purple-100",children:[e.jsx("div",{className:`text-xl font-bold text-purple-700 ${F||""}`,children:o}),e.jsx("div",{className:"text-xs text-gray-500",children:L})]},L))})]}),e.jsxs("div",{className:"bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-800 space-y-1",children:[e.jsxs("div",{children:["Το ",e.jsxs("strong",{children:["πρώτο batch (",u.length," emails)"]})," θα σταλεί τώρα αμέσως."]}),e.jsxs("div",{children:["Τα επόμενα αυτόματα κάθε ",e.jsx("strong",{children:(Ge=ke.find(o=>o.value===H))==null?void 0:Ge.label})," μέσω server."]}),e.jsx("div",{className:"text-blue-600 text-xs",children:"Δεν χρειάζεται να κρατάτε τη σελίδα ανοιχτή."})]}),A&&e.jsxs("div",{className:"text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2",children:["⚠️ ",A]}),e.jsxs("div",{className:"flex gap-3 pt-1",children:[e.jsx("button",{className:"btn-secondary flex-1",onClick:()=>g("audience"),children:"← Κοινό"}),e.jsx("button",{className:"btn-primary flex-1 bg-purple-600 hover:bg-purple-700",disabled:m.length===0,onClick:()=>ee(!0),children:"🤖 Εκκίνηση Αυτόματης"})]})]}),w==="confirm"&&e.jsxs("div",{className:"space-y-4",children:[e.jsx(st,{remaining:m,allActive:a,activeFilters:P,onEdit:()=>g("audience")}),e.jsxs("div",{className:"space-y-1.5",children:[e.jsx("label",{className:"text-xs font-semibold text-gray-500 uppercase tracking-wide",children:"Μέγεθος Batch"}),e.jsx("select",{className:"input w-full text-sm",value:S,onChange:o=>T(Number(o.target.value)),children:tt.map(o=>e.jsxs("option",{value:o,children:[o," emails / batch"]},o))})]}),e.jsxs("div",{className:"bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2 text-sm",children:[e.jsxs("div",{children:[e.jsx("span",{className:"font-medium text-gray-700",children:"Καμπάνια:"})," ",t.name]}),e.jsxs("div",{children:[e.jsx("span",{className:"font-medium text-gray-700",children:"Θέμα:"})," ",t.subject]}),e.jsxs("div",{children:[e.jsx("span",{className:"font-medium text-gray-700",children:"Από:"})," ",t.fromName," <",t.fromEmail,">"]}),e.jsxs("div",{className:"border-t border-blue-200 pt-2 grid grid-cols-3 text-center gap-2",children:[e.jsxs("div",{children:[e.jsx("div",{className:"text-lg font-bold text-blue-700",children:u.length}),e.jsx("div",{className:"text-xs text-gray-500",children:"Στέλνονται τώρα"})]}),e.jsxs("div",{children:[e.jsx("div",{className:"text-lg font-bold text-gray-400",children:y}),e.jsx("div",{className:"text-xs text-gray-500",children:"Ήδη στάλθηκαν"})]}),e.jsxs("div",{children:[e.jsx("div",{className:"text-lg font-bold text-orange-500",children:D}),e.jsx("div",{className:"text-xs text-gray-500",children:"Επόμενο batch"})]})]})]}),e.jsxs("div",{className:"bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-sm text-yellow-800",children:["⚠️ Θα σταλεί σε ",e.jsx("strong",{children:u.length})," επαφές. Αυτή η ενέργεια δεν αναιρείται."]}),A&&e.jsxs("div",{className:"text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2",children:["⚠️ ",A]}),e.jsxs("div",{className:"flex gap-3 pt-1",children:[e.jsx("button",{className:"btn-secondary flex-1",onClick:()=>g("audience"),children:"← Κοινό"}),e.jsxs("button",{className:"btn-primary flex-1",disabled:m.length===0,onClick:()=>ee(!1),children:["📤 Αποστολή ",u.length," emails"]})]})]})]})]})})}function st({remaining:t,allActive:n,activeFilters:s,onEdit:i}){return e.jsxs("div",{className:"flex items-center justify-between bg-blue-50 border border-blue-200 rounded-xl px-4 py-3",children:[e.jsxs("div",{className:"text-sm",children:[e.jsx("span",{className:"font-bold text-blue-700 text-lg",children:t.length}),e.jsx("span",{className:"text-gray-500 ml-1.5",children:"επαφές επιλεγμένες"}),s>0&&e.jsxs("span",{className:"ml-2 text-xs bg-blue-200 text-blue-800 px-2 py-0.5 rounded-full font-semibold",children:[s," φίλτρα"]})]}),e.jsx("button",{className:"text-xs text-blue-600 hover:text-blue-800 font-semibold",onClick:i,children:"✏️ Επεξεργασία κοινού"})]})}function Fe({label:t,val:n,cls:s,border:i}){return e.jsxs("div",{className:`flex justify-between ${i?"border-t pt-1.5":""}`,children:[e.jsx("span",{className:"text-gray-500",children:t}),e.jsx("span",{className:`font-semibold ${s||""}`,children:n})]})}function Ae({children:t,onClose:n,title:s}){return e.jsx("div",{className:"fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4",children:e.jsxs("div",{className:"bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-5",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("h2",{className:"text-lg font-semibold text-gray-900",children:s}),n&&e.jsx("button",{onClick:n,className:"text-gray-400 hover:text-gray-600 text-xl leading-none",children:"✕"})]}),t]})})}const at={draft:"bg-gray-100 text-gray-600",sending:"bg-blue-100 text-blue-700",partial:"bg-orange-100 text-orange-700",auto:"bg-purple-100 text-purple-700",sent:"bg-green-100 text-green-700",failed:"bg-red-100 text-red-600"},zn={draft:"Draft",sending:"Αποστολή…",partial:"Μερική Αποστολή",auto:"🤖 Αυτόματη",sent:"Στάλθηκε",failed:"Σφάλμα"};function lt(t,n){return n?Math.round(t/n*100)+"%":"—"}function it(t){if(!t)return"";const s=(t.toDate?t.toDate():new Date(t))-Date.now();if(s<=-18e5)return"⚠️ Καθυστέρηση";if(s<=0)return"Σε λίγο…";const i=Math.floor(s/36e5),a=Math.floor(s%36e5/6e4);return i>0?`${i}ω ${a}λ`:`${a} λεπτά`}function On(){const[t,n]=c.useState([]),[s,i]=c.useState(!0),[a,r]=c.useState(!1),[y,x]=c.useState(null),[w,g]=c.useState(null),[k,C]=c.useState(null),[p,v]=c.useState(null),[j,N]=c.useState(null),[,A]=c.useState(0);c.useEffect(()=>{const d=setInterval(()=>A(S=>S+1),3e4);return()=>clearInterval(d)},[]);async function b(d){await le(J(_,"email_campaigns",d.id),{autoSend:!1,status:"partial"})}async function z(d){window.confirm(`Ολοκλήρωση καμπάνιας "${d.name}";
Θα σταματήσει η αυτόματη αποστολή και η καμπάνια θα χαρακτηριστεί ως ολοκληρωμένη.`)&&await le(J(_,"email_campaigns",d.id),{autoSend:!1,status:"sent"})}async function E(d){await le(J(_,"email_campaigns",d.id),{autoSend:!0,status:"auto",nextBatchAt:mt.fromMillis(Date.now()),autoSendError:null})}async function O(d){var S;N({status:"sending",msg:"Αποστολή batch…"});try{const l=(S=(await(await fetch("  https://empty-hall-968f.therapon1997.workers.dev/trigger-auto",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({campaignId:d.id})})).json()).report)==null?void 0:S.find(m=>m.id===d.id);l?l.action==="sent"?N({status:"done",msg:`✅ Στάλθηκαν ${l.sent} emails · Εναπομένουν: ${l.remaining}`}):l.action==="skipped"?N({status:"done",msg:"ℹ️ Η καμπάνια ολοκληρώθηκε ήδη"}):l.action==="error"?N({status:"error",msg:`❌ ${l.error}`}):N({status:"done",msg:`ℹ️ ${l.action}`}):N({status:"error",msg:"❌ Η καμπάνια δεν βρέθηκε"})}catch(T){N({status:"error",msg:`❌ ${T.message}`})}setTimeout(()=>N(null),8e3)}async function f(d,S,T){var H;C(null),v({status:"sending",msg:`Αποστολή στο ${T}…`});try{const $="  https://empty-hall-968f.therapon1997.workers.dev",l=d.id,m=`test_${T.replace(/[^a-zA-Z0-9]/g,"_")}`,D=await(await fetch(`${$}/send-campaign`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({campaignId:l,campaign:d,contacts:[{id:m,name:S||"Test",email:T}]})})).json(),R=(H=D.results)==null?void 0:H[0];if((R==null?void 0:R.status)==="sent"){const P=`${l}||test||${T}`;await Ft(J(_,"email_sends",P),{campaignId:l,contactId:m,email:T,resendId:R.resendId||null,status:"sent",isTest:!0,campaignName:d.name||"",subject:d.subject||"",sentAt:X(),failedReason:null,openedAt:null,clickedAt:null,bouncedAt:null,createdAt:X()}),v({status:"done",msg:`✅ Εστάλη στο ${T}`})}else v({status:"error",msg:`❌ Σφάλμα: ${(R==null?void 0:R.error)||JSON.stringify(D)}`})}catch($){v({status:"error",msg:`❌ ${$.message}`})}setTimeout(()=>v(null),6e3)}c.useEffect(()=>gt(de(ae(_,"email_campaigns"),Be("createdAt","desc")),S=>{n(S.docs.map(T=>({id:T.id,...T.data()}))),i(!1)}),[]);async function h(d){window.confirm(`Διαγραφή καμπάνιας "${d.name}";`)&&await ht(J(_,"email_campaigns",d.id))}return e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("p",{className:"text-sm text-gray-500",children:[t.length," καμπάνιες"]}),e.jsx("button",{className:"btn-primary",onClick:()=>{x(null),r(!0)},children:"+ Νέα Καμπάνια"})]}),s?e.jsx(Dn,{}):t.length===0?e.jsxs("div",{className:"text-center py-24",children:[e.jsx("div",{className:"text-5xl mb-4",children:"📧"}),e.jsx("div",{className:"font-semibold text-gray-600 mb-1",children:"Δεν υπάρχουν καμπάνιες ακόμα"}),e.jsx("div",{className:"text-sm text-gray-400 mb-5",children:"Δημιούργησε την πρώτη σου καμπάνια για να ξεκινήσεις"}),e.jsx("button",{className:"btn-primary",onClick:()=>r(!0),children:"+ Νέα Καμπάνια"})]}):e.jsx("div",{className:"space-y-3",children:t.map(d=>e.jsx(Fn,{c:d,testResult:p,onSend:()=>g(d),onEdit:()=>{x(d),r(!0)},onPause:()=>b(d),onTriggerNow:()=>O(d),onResumeAuto:()=>E(d),onEndCampaign:()=>z(d),onClone:()=>{x({...d,name:d.name+" (αντίγραφο)",status:"draft"}),r(!0)},onTest:()=>C(d),onDelete:()=>h(d)},d.id))}),a&&e.jsx(Ct,{campaign:y,onClose:()=>{r(!1),x(null)}}),w&&e.jsx(Tn,{campaign:w,onClose:()=>g(null)}),k&&e.jsx(Ln,{campaign:k,onClose:()=>C(null),onSend:(d,S)=>f(k,d,S)}),p&&e.jsx("div",{className:`fixed bottom-6 right-6 px-5 py-3 rounded-lg shadow-lg text-white text-sm z-50 max-w-sm ${p.status==="done"?"bg-green-600":p.status==="error"?"bg-red-600":"bg-blue-600"}`,children:p.msg}),j&&e.jsx("div",{className:`fixed bottom-20 right-6 px-5 py-3 rounded-lg shadow-lg text-white text-sm z-50 max-w-sm ${j.status==="done"?"bg-purple-600":j.status==="error"?"bg-red-600":"bg-purple-400"}`,children:j.msg})]})}function Ln({campaign:t,onClose:n,onSend:s}){const[i,a]=c.useState(""),[r,y]=c.useState("");return e.jsx("div",{className:"fixed inset-0 bg-black/50 flex items-center justify-center z-50",children:e.jsxs("div",{className:"bg-white rounded-xl shadow-xl p-6 w-full max-w-sm space-y-4",children:[e.jsxs("div",{className:"font-semibold text-gray-900",children:["🧪 Test Send — ",t.name]}),e.jsxs("div",{className:"space-y-3",children:[e.jsxs("div",{children:[e.jsxs("label",{className:"block text-xs text-gray-500 mb-1",children:["Όνομα (για ","{{name}}",")"]}),e.jsx("input",{className:"input w-full",placeholder:"π.χ. Μαρία",value:i,onChange:x=>a(x.target.value)})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-xs text-gray-500 mb-1",children:"Email *"}),e.jsx("input",{className:"input w-full",type:"email",placeholder:"you@example.com",value:r,onChange:x=>y(x.target.value)})]})]}),e.jsxs("div",{className:"flex gap-2 pt-1",children:[e.jsx("button",{className:"btn-secondary flex-1",onClick:n,children:"Ακύρωση"}),e.jsx("button",{className:"btn-primary flex-1",disabled:!r.includes("@"),onClick:()=>s(i,r),children:"Αποστολή Test"})]})]})})}function Dn(){return e.jsx("div",{className:"space-y-3 animate-pulse",children:[...Array(3)].map((t,n)=>e.jsxs("div",{className:"card p-5 space-y-4",children:[e.jsxs("div",{className:"flex justify-between items-start",children:[e.jsxs("div",{className:"space-y-2 flex-1",children:[e.jsx("div",{className:"h-4 bg-gray-200 rounded-full w-2/5"}),e.jsx("div",{className:"h-3 bg-gray-100 rounded-full w-3/5"})]}),e.jsx("div",{className:"h-6 bg-gray-100 rounded-full w-24 ml-4"})]}),e.jsx("div",{className:"grid grid-cols-4 gap-3",children:[...Array(4)].map((s,i)=>e.jsx("div",{className:"h-10 bg-gray-100 rounded-xl"},i))}),e.jsx("div",{className:"h-8 bg-gray-100 rounded-xl"})]},n))})}function Fn({c:t,testResult:n,onSend:s,onEdit:i,onPause:a,onResumeAuto:r,onTriggerNow:y,onEndCampaign:x,onClone:w,onTest:g,onDelete:k}){var j,N,A,b,z;const C={draft:"border-l-gray-200",sending:"border-l-blue-400",auto:"border-l-purple-500",partial:"border-l-orange-400",sent:"border-l-emerald-500",failed:"border-l-red-400"},p=(((j=t.stats)==null?void 0:j.total)??0)-(((N=t.stats)==null?void 0:N.sent)??0),v=(A=t.stats)!=null&&A.total?Math.round((((b=t.stats)==null?void 0:b.sent)??0)/t.stats.total*100):0;return e.jsx("div",{className:`card border-l-4 ${C[t.status]||C.draft} overflow-hidden`,children:e.jsxs("div",{className:"p-5 space-y-4",children:[e.jsxs("div",{className:"flex items-start justify-between gap-3",children:[e.jsxs("div",{className:"min-w-0",children:[e.jsx("div",{className:"font-semibold text-gray-900 truncate",children:t.name}),e.jsx("div",{className:"text-sm text-gray-500 mt-0.5 truncate",children:t.subject}),e.jsxs("div",{className:"text-xs text-gray-400 mt-0.5",children:[t.fromName," <",t.fromEmail,">"]})]}),e.jsx("span",{className:`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${at[t.status]||at.draft}`,children:zn[t.status]||t.status})]}),t.stats&&(t.status==="sent"||t.status==="partial"||t.status==="auto")&&e.jsx("div",{className:"grid grid-cols-4 gap-2 text-center",children:[{label:"Εστάλη",value:t.stats.sent??0,bold:!0},{label:"Ανοίχθηκαν",value:lt(t.stats.opened,t.stats.sent),color:"text-blue-600"},{label:"Κλικ",value:lt(t.stats.clicked,t.stats.sent),color:"text-indigo-600"},{label:"Opt-out",value:t.stats.unsubscribed??0,color:"text-orange-500"}].map(({label:E,value:O,bold:f,color:h})=>e.jsxs("div",{className:"bg-gray-50 rounded-xl py-2.5 px-1",children:[e.jsx("div",{className:`text-base font-bold ${h||"text-gray-800"}`,children:O}),e.jsx("div",{className:"text-xs text-gray-400 mt-0.5",children:E})]},E))}),t.autoSendError&&e.jsxs("div",{className:"bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-xs text-red-700 flex items-start gap-2",children:[e.jsx("span",{className:"shrink-0",children:"⚠️"}),e.jsxs("div",{children:[e.jsx("span",{className:"font-semibold",children:"Σφάλμα αυτόματης αποστολής: "}),t.autoSendError]})]}),(t.status==="sending"||t.status==="auto"||t.status==="partial")&&((z=t.stats)==null?void 0:z.total)>0&&e.jsxs("div",{className:"space-y-1.5",children:[e.jsxs("div",{className:"flex justify-between text-xs text-gray-500",children:[t.status==="auto"?e.jsxs("span",{children:["Επόμενο batch:"," ",e.jsx("span",{className:`font-semibold ${it(t.nextBatchAt).startsWith("⚠")?"text-red-600":"text-purple-700"}`,children:it(t.nextBatchAt)})]}):t.status==="sending"?e.jsx("span",{className:"text-blue-600 font-medium",children:"Αποστολή σε εξέλιξη…"}):e.jsx("span",{className:"text-orange-600",children:p>0?`${p} εναπομένουν`:"Σε παύση"}),e.jsxs("span",{className:"font-semibold",children:[t.stats.sent??0," / ",t.stats.total," · ",v,"%"]})]}),e.jsx("div",{className:"h-2 bg-gray-100 rounded-full overflow-hidden",children:e.jsx("div",{className:`h-full rounded-full transition-all ${t.status==="auto"?"bg-purple-500":t.status==="sending"?"bg-blue-500":"bg-orange-400"}`,style:{width:`${v}%`}})})]}),e.jsxs("div",{className:"flex gap-2 flex-wrap items-center border-t pt-3",children:[t.status==="draft"&&e.jsxs(e.Fragment,{children:[e.jsx("button",{className:"btn-primary text-xs",onClick:s,children:"📤 Αποστολή"}),e.jsx("button",{className:"btn-secondary text-xs",onClick:i,children:"✏️ Επεξεργασία"})]}),t.status==="auto"&&e.jsxs(e.Fragment,{children:[e.jsx("button",{className:"btn-primary text-xs bg-purple-600 hover:bg-purple-700 border-purple-600",onClick:y,children:"▶ Στείλε Τώρα"}),e.jsx("button",{className:"btn-secondary text-xs",onClick:a,children:"⏸ Παύση"}),e.jsx("button",{className:"btn-secondary text-xs text-red-500 hover:text-red-700 hover:border-red-300",onClick:x,children:"🏁 Τέλος Καμπάνιας"})]}),t.status==="partial"&&e.jsxs(e.Fragment,{children:[e.jsx("button",{className:"btn-primary text-xs",onClick:r,children:"🤖 Συνέχεια Αυτόματα"}),e.jsx("button",{className:"btn-secondary text-xs",onClick:s,children:"▶️ Χειροκίνητα"}),e.jsx("button",{className:"btn-secondary text-xs text-red-500 hover:text-red-700 hover:border-red-300",onClick:x,children:"🏁 Τέλος Καμπάνιας"})]}),t.status==="sent"&&e.jsxs(e.Fragment,{children:[e.jsx("button",{className:"btn-primary text-xs",onClick:s,children:"🎯 Νέο Κοινό"}),e.jsx("button",{className:"btn-secondary text-xs",onClick:w,children:"📋 Αντιγραφή ως Draft"})]}),e.jsx("button",{className:"btn-secondary text-xs",onClick:g,disabled:(n==null?void 0:n.status)==="sending",children:"🧪 Test"}),t.status==="draft"&&e.jsx("button",{className:"text-xs text-red-400 hover:text-red-600 ml-auto transition-colors",onClick:k,children:"Διαγραφή"})]})]})})}var Rn=["x1","y1","x2","y2","key"],Pn=["offset"],In=["xAxisId","yAxisId"],Bn=["xAxisId","yAxisId"];function rt(t,n){var s=Object.keys(t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(t);n&&(i=i.filter(function(a){return Object.getOwnPropertyDescriptor(t,a).enumerable})),s.push.apply(s,i)}return s}function Y(t){for(var n=1;n<arguments.length;n++){var s=arguments[n]!=null?arguments[n]:{};n%2?rt(Object(s),!0).forEach(function(i){Hn(t,i,s[i])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(s)):rt(Object(s)).forEach(function(i){Object.defineProperty(t,i,Object.getOwnPropertyDescriptor(s,i))})}return t}function Hn(t,n,s){return(n=_n(n))in t?Object.defineProperty(t,n,{value:s,enumerable:!0,configurable:!0,writable:!0}):t[n]=s,t}function _n(t){var n=$n(t,"string");return typeof n=="symbol"?n:n+""}function $n(t,n){if(typeof t!="object"||!t)return t;var s=t[Symbol.toPrimitive];if(s!==void 0){var i=s.call(t,n);if(typeof i!="object")return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return(n==="string"?String:Number)(t)}function he(){return he=Object.assign?Object.assign.bind():function(t){for(var n=1;n<arguments.length;n++){var s=arguments[n];for(var i in s)({}).hasOwnProperty.call(s,i)&&(t[i]=s[i])}return t},he.apply(null,arguments)}function ze(t,n){if(t==null)return{};var s,i,a=Mn(t,n);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);for(i=0;i<r.length;i++)s=r[i],n.indexOf(s)===-1&&{}.propertyIsEnumerable.call(t,s)&&(a[s]=t[s])}return a}function Mn(t,n){if(t==null)return{};var s={};for(var i in t)if({}.hasOwnProperty.call(t,i)){if(n.indexOf(i)!==-1)continue;s[i]=t[i]}return s}var Gn=t=>{var{fill:n}=t;if(!n||n==="none")return null;var{fillOpacity:s,x:i,y:a,width:r,height:y,ry:x}=t;return c.createElement("rect",{x:i,y:a,ry:x,width:r,height:y,stroke:"none",fill:n,fillOpacity:s,className:"recharts-cartesian-grid-bg"})};function St(t){var{option:n,lineItemProps:s}=t,i;if(c.isValidElement(n))i=c.cloneElement(n,s);else if(typeof n=="function")i=n(s);else{var a,{x1:r,y1:y,x2:x,y2:w,key:g}=s,k=ze(s,Rn),C=(a=Vt(k))!==null&&a!==void 0?a:{},{offset:p}=C,v=ze(C,Pn);i=c.createElement("line",he({},v,{x1:r,y1:y,x2:x,y2:w,fill:"none",key:g}))}return i}function Un(t){var{x:n,width:s,horizontal:i=!0,horizontalPoints:a}=t;if(!i||!a||!a.length)return null;var{xAxisId:r,yAxisId:y}=t,x=ze(t,In),w=a.map((g,k)=>{var C=Y(Y({},x),{},{x1:n,y1:g,x2:n+s,y2:g,key:"line-".concat(k),index:k});return c.createElement(St,{key:"line-".concat(k),option:i,lineItemProps:C})});return c.createElement("g",{className:"recharts-cartesian-grid-horizontal"},w)}function Wn(t){var{y:n,height:s,vertical:i=!0,verticalPoints:a}=t;if(!i||!a||!a.length)return null;var{xAxisId:r,yAxisId:y}=t,x=ze(t,Bn),w=a.map((g,k)=>{var C=Y(Y({},x),{},{x1:g,y1:n,x2:g,y2:n+s,key:"line-".concat(k),index:k});return c.createElement(St,{option:i,lineItemProps:C,key:"line-".concat(k)})});return c.createElement("g",{className:"recharts-cartesian-grid-vertical"},w)}function Vn(t){var{horizontalFill:n,fillOpacity:s,x:i,y:a,width:r,height:y,horizontalPoints:x,horizontal:w=!0}=t;if(!w||!n||!n.length||x==null)return null;var g=x.map(C=>Math.round(C+a-a)).sort((C,p)=>C-p);a!==g[0]&&g.unshift(0);var k=g.map((C,p)=>{var v=g[p+1],j=v==null,N=j?a+y-C:v-C;if(N<=0)return null;var A=p%n.length;return c.createElement("rect",{key:"react-".concat(p),y:C,x:i,height:N,width:r,stroke:"none",fill:n[A],fillOpacity:s,className:"recharts-cartesian-grid-bg"})});return c.createElement("g",{className:"recharts-cartesian-gridstripes-horizontal"},k)}function Yn(t){var{vertical:n=!0,verticalFill:s,fillOpacity:i,x:a,y:r,width:y,height:x,verticalPoints:w}=t;if(!n||!s||!s.length)return null;var g=w.map(C=>Math.round(C+a-a)).sort((C,p)=>C-p);a!==g[0]&&g.unshift(0);var k=g.map((C,p)=>{var v=g[p+1],j=v==null,N=j?a+y-C:v-C;if(N<=0)return null;var A=p%s.length;return c.createElement("rect",{key:"react-".concat(p),x:C,y:r,width:N,height:x,stroke:"none",fill:s[A],fillOpacity:i,className:"recharts-cartesian-grid-bg"})});return c.createElement("g",{className:"recharts-cartesian-gridstripes-vertical"},k)}var Kn=(t,n)=>{var{xAxis:s,width:i,height:a,offset:r}=t;return ut(ft(Y(Y(Y({},yt),s),{},{ticks:bt(s),viewBox:{x:0,y:0,width:i,height:a}})),r.left,r.left+r.width,n)},Jn=(t,n)=>{var{yAxis:s,width:i,height:a,offset:r}=t;return ut(ft(Y(Y(Y({},yt),s),{},{ticks:bt(s),viewBox:{x:0,y:0,width:i,height:a}})),r.top,r.top+r.height,n)},Xn={horizontal:!0,vertical:!0,horizontalPoints:[],verticalPoints:[],stroke:"#ccc",fill:"none",verticalFill:[],horizontalFill:[],xAxisId:0,yAxisId:0,syncWithTicks:!1,zIndex:Wt.grid};function Et(t){var n=Ht(),s=_t(),i=$t(),a=Y(Y({},Mt(t,Xn)),{},{x:fe(t.x)?t.x:i.left,y:fe(t.y)?t.y:i.top,width:fe(t.width)?t.width:i.width,height:fe(t.height)?t.height:i.height}),{xAxisId:r,yAxisId:y,x,y:w,width:g,height:k,syncWithTicks:C,horizontalValues:p,verticalValues:v}=a,j=Gt(),N=Ve(T=>Je(T,"xAxis",r,j)),A=Ve(T=>Je(T,"yAxis",y,j));if(!Ye(g)||!Ye(k)||!fe(x)||!fe(w))return null;var b=a.verticalCoordinatesGenerator||Kn,z=a.horizontalCoordinatesGenerator||Jn,{horizontalPoints:E,verticalPoints:O}=a;if((!E||!E.length)&&typeof z=="function"){var f=p&&p.length,h=z({yAxis:A?Y(Y({},A),{},{ticks:f?p:A.ticks}):void 0,width:n??g,height:s??k,offset:i},f?!0:C);Ke(Array.isArray(h),"horizontalCoordinatesGenerator should return Array but instead it returned [".concat(typeof h,"]")),Array.isArray(h)&&(E=h)}if((!O||!O.length)&&typeof b=="function"){var d=v&&v.length,S=b({xAxis:N?Y(Y({},N),{},{ticks:d?v:N.ticks}):void 0,width:n??g,height:s??k,offset:i},d?!0:C);Ke(Array.isArray(S),"verticalCoordinatesGenerator should return Array but instead it returned [".concat(typeof S,"]")),Array.isArray(S)&&(O=S)}return c.createElement(Ut,{zIndex:a.zIndex},c.createElement("g",{className:"recharts-cartesian-grid"},c.createElement(Gn,{fill:a.fill,fillOpacity:a.fillOpacity,x:a.x,y:a.y,width:a.width,height:a.height,ry:a.ry}),c.createElement(Vn,he({},a,{horizontalPoints:E})),c.createElement(Yn,he({},a,{verticalPoints:O})),c.createElement(Un,he({},a,{offset:i,horizontalPoints:E,xAxis:N,yAxis:A})),c.createElement(Wn,he({},a,{offset:i,verticalPoints:O,xAxis:N,yAxis:A}))))}Et.displayName="CartesianGrid";const M={open:21,click:2.6},Tt="  https://empty-hall-968f.therapon1997.workers.dev";function Q(t,n){return!n||!t?0:Math.round(t/n*100)}function K(t){return(t||0).toLocaleString("el-GR")}function Ee(t){return t?(t!=null&&t.toDate?t.toDate():new Date(t)).toLocaleDateString("el-GR",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"}):"—"}function qn({contacts:t=[]}){const[n,s]=c.useState([]),[i,a]=c.useState([]),[r,y]=c.useState(!0),[x,w]=c.useState(!1),[g,k]=c.useState(null);async function C(){try{const[f,h]=await Promise.all([ye(de(ae(_,"email_campaigns"),we("status","in",["sent","auto","partial"]))),ye(de(ae(_,"email_sends"),we("isTest","==",!0)))]),d=f.docs.map(T=>({id:T.id,...T.data()}));d.sort((T,H)=>{var $,l,m,u;return((($=H.sentAt)==null?void 0:$.seconds)||((l=H.createdAt)==null?void 0:l.seconds)||0)-(((m=T.sentAt)==null?void 0:m.seconds)||((u=T.createdAt)==null?void 0:u.seconds)||0)}),s(d);const S=h.docs.map(T=>({id:T.id,...T.data()}));S.sort((T,H)=>{var $,l;return((($=H.sentAt)==null?void 0:$.seconds)||0)-(((l=T.sentAt)==null?void 0:l.seconds)||0)}),a(S)}finally{y(!1),w(!1)}}c.useEffect(()=>{C()},[]);function p(){w(!0),C()}const v=c.useMemo(()=>n.filter(f=>!f.excludeFromMetrics),[n]),j=c.useMemo(()=>{const f={sent:0,opened:0,clicked:0,unsubscribed:0,bounced:0,failed:0};return v.forEach(h=>{h.stats&&(f.sent+=h.stats.sent||0,f.opened+=h.stats.opened||0,f.clicked+=h.stats.clicked||0,f.unsubscribed+=h.stats.unsubscribed||0,f.bounced+=h.stats.bounced||0,f.failed+=h.stats.failed||0)}),f},[n]);if(r)return e.jsx(ts,{});if(n.length===0)return e.jsxs("div",{className:"text-center py-24",children:[e.jsx("div",{className:"text-5xl mb-4",children:"📊"}),e.jsx("div",{className:"font-semibold text-gray-600 mb-1",children:"Δεν υπάρχουν δεδομένα"}),e.jsx("div",{className:"text-sm text-gray-400",children:"Στείλε πρώτα μια καμπάνια για να δεις τα αποτελέσματα"})]});const N=v.reduce((f,h)=>{const d=h.stats||{};return f+Math.max(d.opened||0,d.clicked||0)},0),A=Q(j.opened,j.sent),b=Q(N,j.sent),z=Q(j.clicked,j.sent),E=j.opened>0||j.clicked>0,O=j.opened===0&&j.clicked>0;return e.jsxs("div",{className:"space-y-5",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"text-xs font-semibold text-gray-400 uppercase tracking-widest",children:"Επισκόπηση"}),e.jsxs("button",{onClick:p,disabled:x,className:"text-xs text-gray-400 hover:text-indigo-500 transition-colors flex items-center gap-1",children:[e.jsx("span",{className:x?"animate-spin inline-block":"",children:"↺"}),x?"Φόρτωση…":"Ανανέωση"]})]}),e.jsxs("div",{className:"grid grid-cols-2 lg:grid-cols-4 gap-3",children:[e.jsx(Ce,{icon:"📧",label:"Αποστολές",value:K(j.sent),sub:`${v.length} καμπάνιες${n.length>v.length?` (+${n.length-v.length} εκτός)`:""}`,color:"sky"}),e.jsx(Ce,{icon:"👁",label:O?"Open Rate *":"Open Rate",value:O?b+"%":A+"%",sub:O?`≥${K(N)} ανοίγματα (pixel blocked)`:`${K(j.opened)} ανοίγματα`,color:(O?b:A)>=M.open?"emerald":"amber",badge:(O?b:A)>=M.open?`↑ vs ${M.open}%`:`↓ vs ${M.open}%`,badgeGood:(O?b:A)>=M.open}),e.jsx(Ce,{icon:"🖱️",label:"Click Rate",value:z+"%",sub:`${K(j.clicked)} κλικ`,color:z>=M.click?"indigo":"amber",badge:z>=M.click?`↑ vs ${M.click}%`:`↓ vs ${M.click}%`,badgeGood:z>=M.click}),e.jsx(Ce,{icon:"🚫",label:"Opt-outs / Bounces",value:K(j.unsubscribed+j.bounced),sub:Q(j.unsubscribed+j.bounced,j.sent)+"% rate",color:"rose"})]}),j.opened===0&&j.clicked>0&&e.jsxs("div",{className:"flex gap-3 bg-orange-50 border border-orange-200 rounded-xl px-4 py-3",children:[e.jsx("span",{className:"text-xl shrink-0",children:"👁"}),e.jsxs("div",{className:"text-sm space-y-2",children:[e.jsx("div",{className:"font-semibold text-orange-800",children:"Το tracking pixel μπλοκάρεται από τους email clients"}),e.jsxs("div",{className:"text-orange-700 text-xs leading-relaxed space-y-1.5",children:[e.jsxs("div",{children:["Το webhook ",e.jsx("strong",{children:"έχει"})," το ",e.jsx("code",{className:"bg-orange-100 px-1 rounded",children:"email.opened"})," event — αλλά το Resend δεν το πυροδοτεί γιατί το tracking pixel μπλοκάρεται από Gmail, Outlook, κ.ά."]}),e.jsx("div",{className:"font-medium",children:"Τι να κάνεις:"}),e.jsxs("div",{children:["1. ",e.jsx("strong",{children:"Resend → Domains → [domain] → Open Tracking"})," — βεβαιώσου ότι είναι ενεργό."]}),e.jsxs("div",{children:["2. Αν είναι ήδη ενεργό, αυτό είναι φυσιολογικό. Το ",e.jsxs("strong",{children:["Open Rate * = ",b,"%"]})," (από clicks) είναι το ελάχιστο πραγματικό open rate σου."]})]})]})]}),!E&&j.sent>=20&&j.clicked===0&&e.jsxs("div",{className:"flex gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3",children:[e.jsx("span",{className:"text-xl shrink-0",children:"⚠️"}),e.jsxs("div",{className:"text-sm",children:[e.jsx("div",{className:"font-semibold text-amber-800 mb-0.5",children:"Opens και Clicks εμφανίζονται μόνο μέσω Resend Webhooks"}),e.jsxs("div",{className:"text-amber-700 text-xs leading-relaxed",children:["Πήγαινε στο ",e.jsx("strong",{children:"Resend → Webhooks"})," και πρόσθεσε:",e.jsx("br",{}),e.jsxs("code",{className:"bg-amber-100 px-1.5 py-0.5 rounded font-mono",children:[Tt,"/webhook"]})," ","με events: ",e.jsx("code",{className:"bg-amber-100 px-1 py-0.5 rounded text-xs",children:"email.opened, email.clicked, email.bounced, email.complained"})]})]})]}),e.jsxs("div",{children:[e.jsx("div",{className:"text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3",children:"Καμπάνιες"}),e.jsx("div",{className:"space-y-2",children:n.map(f=>e.jsxs("div",{className:f.excludeFromMetrics?"opacity-60":"",children:[f.excludeFromMetrics&&e.jsx("div",{className:"text-xs text-amber-600 font-medium mb-1 flex items-center gap-1",children:"⚠️ Εκτός συνολικών μετρικών — το webhook δεν ήταν ενεργό κατά την αποστολή (τα opens/clicks δεν καταγράφηκαν)"}),e.jsx(es,{campaign:f,expanded:g===f.id,onToggle:()=>k(g===f.id?null:f.id),onRebuild:p})]},f.id))})]}),e.jsxs("div",{children:[e.jsx("div",{className:"text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3",children:"🧪 Test Emails"}),i.length===0?e.jsx("div",{className:"text-sm text-gray-400 text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200",children:"Δεν υπάρχουν test emails ακόμα. Χρησιμοποίησε το 🧪 Test σε μια καμπάνια."}):e.jsx("div",{className:"card overflow-hidden",children:e.jsxs("table",{className:"w-full text-sm",children:[e.jsx("thead",{className:"bg-gray-50 border-b border-gray-200",children:e.jsxs("tr",{children:[e.jsx("th",{className:"text-left px-4 py-2 font-medium text-gray-500 text-xs",children:"Καμπάνια"}),e.jsx("th",{className:"text-left px-4 py-2 font-medium text-gray-500 text-xs",children:"Email"}),e.jsx("th",{className:"text-left px-4 py-2 font-medium text-gray-500 text-xs",children:"Στάλθηκε"}),e.jsx("th",{className:"text-center px-4 py-2 font-medium text-gray-500 text-xs",children:"Άνοιγμα"}),e.jsx("th",{className:"text-center px-4 py-2 font-medium text-gray-500 text-xs",children:"Κλικ"}),e.jsx("th",{className:"text-center px-4 py-2 font-medium text-gray-500 text-xs",children:"Bounce"})]})}),e.jsx("tbody",{className:"divide-y divide-gray-100",children:i.map(f=>e.jsxs("tr",{className:"hover:bg-gray-50",children:[e.jsx("td",{className:"px-4 py-2 text-xs text-gray-700 font-medium max-w-[160px] truncate",children:f.campaignName||f.campaignId}),e.jsx("td",{className:"px-4 py-2 text-xs text-gray-500",children:f.email}),e.jsx("td",{className:"px-4 py-2 text-xs text-gray-400",children:Ee(f.sentAt)}),e.jsx("td",{className:"px-4 py-2 text-center",children:f.openedAt?e.jsxs("span",{className:"text-emerald-600 font-semibold text-xs",children:["✓ ",Ee(f.openedAt)]}):e.jsx("span",{className:"text-gray-300 text-xs",children:"—"})}),e.jsx("td",{className:"px-4 py-2 text-center",children:f.clickedAt?e.jsxs("span",{className:"text-indigo-600 font-semibold text-xs",children:["✓ ",Ee(f.clickedAt)]}):e.jsx("span",{className:"text-gray-300 text-xs",children:"—"})}),e.jsx("td",{className:"px-4 py-2 text-center",children:f.bouncedAt?e.jsx("span",{className:"text-rose-500 font-semibold text-xs",children:"✓"}):e.jsx("span",{className:"text-gray-300 text-xs",children:"—"})})]},f.id))})]})})]}),e.jsx(Zn,{campaigns:n,contacts:t}),e.jsx(Qn,{contacts:t,onSync:p}),v.length>1&&e.jsxs("div",{className:"card p-5",children:[e.jsx("div",{className:"text-sm font-semibold text-gray-700 mb-4",children:"Σύγκριση Καμπανιών"}),e.jsx(Yt,{width:"100%",height:200,children:e.jsxs(Kt,{data:v.map(f=>{var h,d,S,T;return{name:f.name.length>14?f.name.slice(0,14)+"…":f.name,"Open %":Q((h=f.stats)==null?void 0:h.opened,(d=f.stats)==null?void 0:d.sent),"Click %":Q((S=f.stats)==null?void 0:S.clicked,(T=f.stats)==null?void 0:T.sent)}}),margin:{top:4,right:8,left:-22,bottom:4},children:[e.jsx(Et,{strokeDasharray:"3 3",stroke:"#f3f4f6",vertical:!1}),e.jsx(Jt,{dataKey:"name",tick:{fontSize:11},axisLine:!1,tickLine:!1}),e.jsx(Xt,{tick:{fontSize:11},unit:"%",axisLine:!1,tickLine:!1}),e.jsx(qt,{formatter:f=>f+"%",contentStyle:{borderRadius:10,border:"none",boxShadow:"0 4px 20px rgba(0,0,0,.12)"}}),e.jsx(Xe,{dataKey:"Open %",fill:"#34d399",radius:[4,4,0,0],maxBarSize:40}),e.jsx(Xe,{dataKey:"Click %",fill:"#818cf8",radius:[4,4,0,0],maxBarSize:40})]})}),e.jsxs("div",{className:"flex flex-wrap gap-4 justify-center mt-2 text-xs text-gray-500",children:[e.jsxs("span",{className:"flex items-center gap-1.5",children:[e.jsx("span",{className:"w-2.5 h-2.5 rounded bg-emerald-400 shrink-0"}),"Open Rate"]}),e.jsxs("span",{className:"flex items-center gap-1.5",children:[e.jsx("span",{className:"w-2.5 h-2.5 rounded bg-indigo-400 shrink-0"}),"Click Rate"]}),e.jsxs("span",{className:"text-gray-400",children:["Avg: Open ",M.open,"% · Click ",M.click,"%"]})]})]})]})}function Zn({campaigns:t,contacts:n}){const s=n.filter(a=>a.status==="unsubscribed"),i=c.useMemo(()=>{const a={};for(const r of s){const y=r.optOutCampaignId||"__manual__",x=r.optOutCampaignName||(r.optOutSource==="manual"?"Χειροκίνητα":"—");a[y]||(a[y]={campaignId:y,campaignName:x,contacts:[]}),a[y].contacts.push(r)}return Object.values(a).sort((r,y)=>y.contacts.length-r.contacts.length)},[s]);return s.length===0?null:e.jsxs("div",{children:[e.jsx("div",{className:"text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3",children:"🚫 Opt-outs ανά Καμπάνια"}),e.jsx("div",{className:"card overflow-hidden",children:e.jsxs("table",{className:"w-full text-sm",children:[e.jsx("thead",{className:"bg-gray-50 border-b border-gray-200",children:e.jsxs("tr",{children:[e.jsx("th",{className:"text-left px-4 py-2 font-medium text-gray-500 text-xs",children:"Καμπάνια"}),e.jsx("th",{className:"text-right px-4 py-2 font-medium text-gray-500 text-xs",children:"Opt-outs"}),e.jsx("th",{className:"text-left px-4 py-2 font-medium text-gray-500 text-xs hidden md:table-cell",children:"Επαφές"})]})}),e.jsx("tbody",{className:"divide-y divide-gray-100",children:i.map(a=>e.jsxs("tr",{className:"hover:bg-gray-50",children:[e.jsxs("td",{className:"px-4 py-2.5",children:[e.jsx("span",{className:"text-sm font-medium text-gray-800",children:a.campaignName}),a.campaignId==="__manual__"&&e.jsx("span",{className:"ml-2 text-xs text-gray-400 italic",children:"χειροκίνητη ενέργεια"})]}),e.jsx("td",{className:"px-4 py-2.5 text-right",children:e.jsx("span",{className:"text-rose-600 font-bold text-sm",children:a.contacts.length})}),e.jsx("td",{className:"px-4 py-2.5 hidden md:table-cell",children:e.jsxs("div",{className:"flex flex-wrap gap-1",children:[a.contacts.slice(0,6).map(r=>e.jsx("span",{className:"text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full truncate max-w-[160px]",children:r.name||r.email},r.id)),a.contacts.length>6&&e.jsxs("span",{className:"text-xs text-gray-400",children:["+",a.contacts.length-6," ακόμα"]})]})})]},a.campaignId))}),e.jsx("tfoot",{className:"bg-gray-50 border-t border-gray-200",children:e.jsxs("tr",{children:[e.jsx("td",{className:"px-4 py-2 text-xs text-gray-400",children:"Σύνολο"}),e.jsx("td",{className:"px-4 py-2 text-right text-xs font-bold text-rose-600",children:s.length}),e.jsx("td",{className:"hidden md:table-cell"})]})})]})})]})}function Qn({contacts:t,onSync:n}){const[s,i]=c.useState(!1),[a,r]=c.useState(!1),[y,x]=c.useState(null);async function w(){r(!0),x(null);try{const p=await fetch(`${Tt}/sync-bounces`,{method:"POST",headers:{"Content-Type":"application/json"}}),v=await p.json();if(!p.ok)throw new Error(v.error||"Σφάλμα");x({ok:!0,text:`✅ Ανανεώθηκαν ${v.updated} επαφές από ${v.total} bounced/complained`}),n==null||n()}catch(p){x({ok:!1,text:`❌ ${p.message}`})}finally{r(!1),setTimeout(()=>x(null),6e3)}}const g=t.filter(p=>p.status==="bounced"),k=t.filter(p=>p.status==="complained"),C=[...t].sort((p,v)=>{const j=p.bouncedAt||p.complainedAt||p.updatedAt||"";return(v.bouncedAt||v.complainedAt||v.updatedAt||"")>j?1:-1});return e.jsxs("div",{children:[e.jsxs("div",{className:"flex items-center justify-between mb-3",children:[e.jsx("div",{className:"text-xs font-semibold text-gray-400 uppercase tracking-widest",children:"↩️ Bounces & Spam Complaints"}),e.jsxs("div",{className:"flex items-center gap-3",children:[y&&e.jsx("span",{className:`text-xs font-medium ${y.ok?"text-emerald-600":"text-rose-500"}`,children:y.text}),e.jsxs("button",{onClick:w,disabled:a,className:"text-xs text-gray-400 hover:text-indigo-600 transition-colors flex items-center gap-1 font-medium",title:"Διαβάζει όλα τα bounced/complained email_sends και ενημερώνει τις επαφές στη βάση",children:[e.jsx("span",{className:a?"animate-spin inline-block":"",children:"↺"}),a?"Συγχρονισμός…":"Sync → Contacts"]})]})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-3 mb-3",children:[e.jsxs("div",{className:"bg-rose-50 rounded-xl border border-rose-100 px-4 py-3 text-center",children:[e.jsx("div",{className:"text-2xl font-bold text-rose-600",children:s?"…":g.length}),e.jsx("div",{className:"text-xs text-rose-500 font-medium mt-0.5",children:"↩️ Hard Bounces"}),e.jsx("div",{className:"text-xs text-rose-400 mt-0.5",children:"Λανθασμένα / ανύπαρκτα email"})]}),e.jsxs("div",{className:"bg-orange-50 rounded-xl border border-orange-100 px-4 py-3 text-center",children:[e.jsx("div",{className:"text-2xl font-bold text-orange-600",children:s?"…":k.length}),e.jsx("div",{className:"text-xs text-orange-500 font-medium mt-0.5",children:"⚠️ Spam Complaints"}),e.jsx("div",{className:"text-xs text-orange-400 mt-0.5",children:"Σημείωσαν ως ανεπιθύμητο"})]})]}),s?e.jsx("div",{className:"text-sm text-gray-400 text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200",children:"Φόρτωση…"}):t.length===0?e.jsx("div",{className:"text-sm text-gray-400 text-center py-6 bg-gray-50 rounded-xl border border-dashed border-gray-200",children:"Δεν υπάρχουν bounced / complained επαφές ακόμα."}):e.jsx("div",{className:"card overflow-hidden",children:e.jsxs("table",{className:"w-full text-sm",children:[e.jsx("thead",{className:"bg-gray-50 border-b border-gray-200",children:e.jsxs("tr",{children:[e.jsx("th",{className:"text-left px-4 py-2 font-medium text-gray-500 text-xs",children:"Email"}),e.jsx("th",{className:"text-left px-4 py-2 font-medium text-gray-500 text-xs",children:"Τύπος"}),e.jsx("th",{className:"text-left px-4 py-2 font-medium text-gray-500 text-xs hidden md:table-cell",children:"Ημερομηνία"}),e.jsx("th",{className:"text-left px-4 py-2 font-medium text-gray-500 text-xs hidden lg:table-cell",children:"Πηγή"})]})}),e.jsx("tbody",{className:"divide-y divide-gray-100",children:C.slice(0,100).map(p=>e.jsxs("tr",{className:"hover:bg-gray-50",children:[e.jsxs("td",{className:"px-4 py-2 text-xs font-medium text-gray-700 max-w-[200px] truncate",children:[p.email,p.name&&e.jsx("span",{className:"text-gray-400 ml-1.5 font-normal",children:p.name})]}),e.jsx("td",{className:"px-4 py-2",children:p.status==="bounced"?e.jsx("span",{className:"inline-flex items-center gap-1 text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-medium",children:"↩️ Bounce"}):e.jsx("span",{className:"inline-flex items-center gap-1 text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium",children:"⚠️ Spam"})}),e.jsx("td",{className:"px-4 py-2 text-xs text-gray-400 hidden md:table-cell",children:Ee(p.bouncedAt||p.complainedAt||p.updatedAt)}),e.jsx("td",{className:"px-4 py-2 text-xs text-gray-400 hidden lg:table-cell",children:p.source==="transactional_webhook"?e.jsx("span",{className:"bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded text-xs",children:"Transactional"}):e.jsx("span",{className:"bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded text-xs",children:"Campaign"})})]},p.id))}),C.length>100&&e.jsx("tfoot",{className:"bg-gray-50 border-t border-gray-200",children:e.jsx("tr",{children:e.jsxs("td",{colSpan:4,className:"px-4 py-2 text-xs text-gray-400 text-center",children:["+",C.length-100," ακόμα"]})})})]})})]})}function es({campaign:t,expanded:n,onToggle:s,onRebuild:i}){var b,z;const a=t.stats||{},r=(a.opened||0)===0&&(a.clicked||0)>0,y=r?a.clicked||0:a.opened||0,x=Q(r?y:a.opened,a.sent),w=Q(a.clicked,a.sent),g=Q(a.clicked,y),k=Q(a.bounced,a.sent),C=Q(a.failed,(a.sent||0)+(a.failed||0)),p=((z=(b=t.sentAt)==null?void 0:b.toDate)==null?void 0:z.call(b))||null,v=p?p.toLocaleDateString("el-GR",{day:"2-digit",month:"short",year:"numeric"}):"—",N={sent:"bg-emerald-500",auto:"bg-purple-500",partial:"bg-orange-400"}[t.status]||"bg-gray-300",A=[{label:"Στάλθηκαν",value:a.sent||0,max:a.sent||1,color:"bg-sky-400",pctLabel:null},{label:"Ανοίχθηκαν",value:a.opened||0,max:a.sent||1,color:"bg-emerald-400",pctLabel:x+"%",benchmark:M.open,good:x>=M.open},{label:"Κλικ",value:a.clicked||0,max:a.sent||1,color:"bg-indigo-400",pctLabel:w+"%",benchmark:M.click,good:w>=M.click}];return e.jsxs("div",{className:"card overflow-hidden border border-gray-100",children:[e.jsxs("button",{className:"w-full text-left px-5 py-4 hover:bg-gray-50/70 transition-colors",onClick:s,children:[e.jsxs("div",{className:"flex items-center justify-between gap-4",children:[e.jsxs("div",{className:"flex items-center gap-3 min-w-0",children:[e.jsx("span",{className:`w-2 h-2 rounded-full shrink-0 ${N}`}),e.jsxs("div",{className:"min-w-0",children:[e.jsx("div",{className:"font-semibold text-gray-900 truncate text-sm",children:t.name}),e.jsx("div",{className:"text-xs text-gray-400 truncate mt-0.5",children:t.subject})]})]}),e.jsxs("div",{className:"flex items-center gap-5 shrink-0",children:[e.jsx(Se,{label:"Εστάλη",value:K(a.sent)}),e.jsx(Se,{label:r?"Open *":"Open",value:x+"%",color:x>=M.open?"text-emerald-600":"text-gray-600"}),e.jsx(Se,{label:"Click",value:w+"%",color:w>=M.click?"text-indigo-600":"text-gray-600"}),e.jsx(Se,{label:"Bounce",value:k+"%",color:k>2?"text-rose-500":"text-gray-400"}),e.jsx("div",{className:"text-gray-300 text-xs hidden sm:block",children:v}),e.jsx("span",{className:"text-gray-300",children:n?"▲":"▼"})]})]}),e.jsxs("div",{className:"mt-3 grid grid-cols-3 gap-2",children:[e.jsx(Re,{label:"Open Rate",p:x,benchmark:M.open,color:"bg-emerald-400"}),e.jsx(Re,{label:"Click Rate",p:w,benchmark:M.click,color:"bg-indigo-400"}),e.jsx(Re,{label:"Deliver",p:100-C,color:"bg-sky-400"})]})]}),n&&e.jsxs("div",{className:"border-t bg-gray-50/60 px-5 py-5 space-y-5",children:[e.jsxs("div",{children:[e.jsx("div",{className:"text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3",children:"Funnel"}),e.jsx("div",{className:"space-y-2",children:A.map(E=>e.jsxs("div",{className:"space-y-1",children:[e.jsxs("div",{className:"flex justify-between items-center text-xs",children:[e.jsx("span",{className:"text-gray-600 font-medium",children:E.label}),e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("span",{className:"text-gray-800 font-bold",children:K(E.value)}),E.pctLabel&&e.jsxs("span",{className:`font-semibold ${E.good?"text-emerald-600":"text-gray-500"}`,children:[E.pctLabel,E.benchmark!=null&&e.jsxs("span",{className:"font-normal text-gray-400",children:[" vs ",E.benchmark,"%"]})]})]})]}),e.jsx("div",{className:"h-2 bg-gray-200 rounded-full overflow-hidden",children:e.jsx("div",{className:`h-full rounded-full transition-all ${E.color}`,style:{width:`${Math.min(100,E.max>0?E.value/E.max*100:0)}%`}})})]},E.label))})]}),e.jsxs("div",{className:"grid grid-cols-3 sm:grid-cols-4 gap-2",children:[e.jsx(ge,{icon:"📧",label:"Εστάλη",value:K(a.sent),color:"sky"}),e.jsx(ge,{icon:"👁",label:r?"Ανοίχθηκαν *":"Ανοίχθηκαν",value:`≥${K(y)} (${x}%)`,color:"emerald",tooltip:r?"Εκτιμώμενο minimum — pixel μπλοκαρισμένο, βασίζεται στα clicks":void 0}),e.jsx(ge,{icon:"🖱️",label:"Κλικ",value:`${K(a.clicked)} (${w}%)`,color:"indigo"}),e.jsx(ge,{icon:"🎯",label:"CTOR",value:a.opened>0?g+"%":"—",color:a.opened>0?g>=20?"emerald":"indigo":"gray",tooltip:"Click-to-Open Rate: από όσους άνοιξαν, πόσοι έκαναν κλικ"})]}),e.jsxs("div",{className:"grid grid-cols-3 gap-2",children:[e.jsx(ge,{icon:"🚫",label:"Opt-out",value:K(a.unsubscribed),color:"orange"}),e.jsx(ge,{icon:"↩️",label:"Bounce",value:K(a.bounced),color:k>2?"rose":"gray"}),e.jsx(ge,{icon:"❌",label:"Αποτυχίες",value:K(a.failed),color:a.failed>0?"rose":"gray"})]}),e.jsxs("div",{className:"bg-white rounded-xl border border-gray-200 px-4 py-3 space-y-3",children:[e.jsx("div",{className:"flex items-center justify-between",children:e.jsx("div",{className:"text-xs font-semibold text-gray-400 uppercase tracking-wider",children:"Σύγκριση με Industry Avg"})}),e.jsx(ot,{label:"Open Rate",actual:x,benchmark:M.open,colorGood:"bg-emerald-400"}),e.jsx(ot,{label:"Click Rate",actual:w,benchmark:M.click,colorGood:"bg-indigo-400"}),a.opened>0&&e.jsxs("div",{className:"flex justify-between text-xs pt-1 border-t border-gray-100",children:[e.jsx("span",{className:"text-gray-600 font-medium",children:"🎯 CTOR (Click-to-Open)"}),e.jsxs("span",{className:`font-bold ${g>=20?"text-emerald-600":"text-indigo-600"}`,children:[g,"%",e.jsxs("span",{className:"font-normal text-gray-400 ml-1",children:["(",K(a.clicked)," / ",K(a.opened),")"]})]})]})]})]})]})}function ts(){return e.jsxs("div",{className:"space-y-5 animate-pulse",children:[e.jsx("div",{className:"grid grid-cols-2 lg:grid-cols-4 gap-3",children:[...Array(4)].map((t,n)=>e.jsxs("div",{className:"card p-4 space-y-3",children:[e.jsx("div",{className:"h-3 bg-gray-200 rounded-full w-3/4"}),e.jsx("div",{className:"h-7 bg-gray-200 rounded-full w-1/2"}),e.jsx("div",{className:"h-2 bg-gray-100 rounded-full w-2/3"})]},n))}),e.jsx("div",{className:"space-y-2",children:[...Array(3)].map((t,n)=>e.jsxs("div",{className:"card p-4 space-y-3",children:[e.jsxs("div",{className:"flex justify-between items-center",children:[e.jsx("div",{className:"h-4 bg-gray-200 rounded-full w-1/3"}),e.jsx("div",{className:"flex gap-4",children:[...Array(4)].map((s,i)=>e.jsx("div",{className:"h-4 bg-gray-100 rounded-full w-12"},i))})]}),e.jsx("div",{className:"grid grid-cols-3 gap-2",children:[...Array(3)].map((s,i)=>e.jsx("div",{className:"h-2 bg-gray-100 rounded-full"},i))})]},n))})]})}function Ce({icon:t,label:n,value:s,sub:i,color:a,badge:r,badgeGood:y}){const x={sky:"bg-sky-50     border-sky-100",emerald:"bg-emerald-50 border-emerald-100",indigo:"bg-indigo-50  border-indigo-100",amber:"bg-amber-50   border-amber-100",rose:"bg-rose-50    border-rose-100"},w={sky:"text-sky-700",emerald:"text-emerald-700",indigo:"text-indigo-700",amber:"text-amber-700",rose:"text-rose-600"};return e.jsxs("div",{className:`rounded-2xl border p-4 space-y-1.5 ${x[a]}`,children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("span",{className:"text-base",children:t}),r&&e.jsx("span",{className:`text-xs font-medium px-1.5 py-0.5 rounded-full ${y?"bg-emerald-100 text-emerald-700":"bg-amber-100 text-amber-700"}`,children:r})]}),e.jsx("div",{className:`text-2xl font-bold ${w[a]}`,children:s}),e.jsx("div",{className:"text-xs text-gray-500 font-medium",children:n}),i&&e.jsx("div",{className:"text-xs text-gray-400",children:i})]})}function Se({label:t,value:n,color:s="text-gray-700"}){return e.jsxs("div",{className:"text-center",children:[e.jsx("div",{className:`text-sm font-bold leading-tight ${s}`,children:n}),e.jsx("div",{className:"text-xs text-gray-400 leading-tight",children:t})]})}function Re({label:t,p:n,benchmark:s,color:i}){const a=s!=null&&n>=s;return e.jsxs("div",{className:"space-y-1",children:[e.jsxs("div",{className:"flex justify-between text-xs text-gray-400",children:[e.jsx("span",{children:t}),e.jsxs("span",{className:`font-semibold ${a?"text-emerald-600":"text-gray-500"}`,children:[n,"%"]})]}),e.jsxs("div",{className:"h-1.5 bg-gray-200 rounded-full overflow-hidden relative",children:[e.jsx("div",{className:`h-full rounded-full ${i}`,style:{width:`${Math.min(n,100)}%`}}),s!=null&&e.jsx("div",{className:"absolute top-0 h-full w-px bg-gray-500 opacity-40",style:{left:`${Math.min(s,100)}%`}})]})]})}function ge({icon:t,label:n,value:s,color:i,tooltip:a}){const r={sky:"text-sky-600",emerald:"text-emerald-600",indigo:"text-indigo-600",orange:"text-orange-500",rose:"text-rose-500",gray:"text-gray-600"};return e.jsxs("div",{className:"bg-white rounded-xl border border-gray-100 px-3 py-2.5 text-center space-y-0.5",title:a,children:[e.jsxs("div",{className:"text-xs text-gray-400",children:[t," ",n]}),e.jsx("div",{className:`text-lg font-bold ${r[i]||r.gray}`,children:s})]})}function ot({label:t,actual:n,benchmark:s,colorGood:i}){const a=n>=s,r=Math.max(n,s,1);return e.jsxs("div",{className:"space-y-1.5",children:[e.jsxs("div",{className:"flex justify-between text-xs",children:[e.jsx("span",{className:"text-gray-600 font-medium",children:t}),e.jsxs("span",{className:`font-semibold ${a?"text-emerald-600":"text-amber-600"}`,children:[n,"% ",a?"▲":"▼"," avg ",s,"%"]})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-1.5",children:[e.jsxs("div",{className:"space-y-0.5",children:[e.jsx("div",{className:"h-2.5 bg-gray-100 rounded-full overflow-hidden",children:e.jsx("div",{className:`h-full rounded-full ${i}`,style:{width:`${n/r*100}%`}})}),e.jsx("div",{className:"text-xs text-gray-400 text-center",children:"Η καμπάνια σου"})]}),e.jsxs("div",{className:"space-y-0.5",children:[e.jsx("div",{className:"h-2.5 bg-gray-100 rounded-full overflow-hidden",children:e.jsx("div",{className:"h-full rounded-full bg-gray-300",style:{width:`${s/r*100}%`}})}),e.jsx("div",{className:"text-xs text-gray-400 text-center",children:"Industry avg"})]})]})]})}const ns=`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>DermLux — Everything your skin needs, in one place.</title>
</head>
<body style="margin:0;padding:0;background-color:#f0ece4;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f0ece4;">
<tr><td align="center" style="padding:0;">

<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">


<!-- ══════════════════════════════════════════════════════
     1. HEADER — extracted pixel-perfect from Figma PDF
════════════════════════════════════════════════════════ -->
<tr>
  <td style="padding:0;line-height:0;">
    <img src="https://therapon1997-dermlux.github.io/dermlux-waitlist/email-images/header-dermlux.jpeg"
         alt="DermLux — Laser &amp; Medical Aesthetics" width="600" height="170"
         style="display:block;width:100%;max-width:600px;">
  </td>
</tr>


<!-- ══════════════════════════════════════════════════════
     2. HERO — extracted pixel-perfect from Figma PDF
════════════════════════════════════════════════════════ -->
<tr>
  <td style="padding:0;line-height:0;">
    <img src="https://therapon1997-dermlux.github.io/dermlux-waitlist/email-images/hero-gradient.jpeg"
         alt="Everything your skin needs, in one place." width="600" height="476"
         style="display:block;width:100%;max-width:600px;">
  </td>
</tr>


<!-- ══════════════════════════════════════════════════════
     3. GREETING — white, clean, no dark section
════════════════════════════════════════════════════════ -->
<tr>
  <td style="background-color:#ffffff;padding:44px 44px 16px;">
    <p style="margin:0 0 14px;font-family:Georgia,'Times New Roman',serif;font-size:16px;font-weight:700;color:#161616;">Hi {{name}},</p>
    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.9;color:#555555;">From a single glow-boosting facial to long-term laser plans and doctor-led injectables, DermLux brings it all together across our five clinics in Cyprus.</p>
  </td>
</tr>
<tr>
  <td style="background-color:#ffffff;height:36px;"></td>
</tr>


<!-- ══════════════════════════════════════════════════════
     4. SERVICE TABS — exact Figma PNG graphics
════════════════════════════════════════════════════════ -->
<tr>
  <td style="padding:0;line-height:0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td width="200" style="padding:0;line-height:0;">
          <img src="https://therapon1997-dermlux.github.io/dermlux-waitlist/email-images/tab-facials.png"
               alt="01 Facials &amp; Skin Glow" width="200"
               style="display:block;width:200px;">
        </td>
        <td width="200" style="padding:0;line-height:0;">
          <img src="https://therapon1997-dermlux.github.io/dermlux-waitlist/email-images/tab-laser.png"
               alt="02 Laser Hair Removal" width="200"
               style="display:block;width:200px;">
        </td>
        <td width="200" style="padding:0;line-height:0;">
          <img src="https://therapon1997-dermlux.github.io/dermlux-waitlist/email-images/tab-injectables.png"
               alt="03 Injectables" width="200"
               style="display:block;width:200px;">
        </td>
      </tr>
    </table>
  </td>
</tr>


<!-- ══════════════════════════════════════════════════════
     5. TREATMENT PHOTOS — real photos, 200×300, pink gradient overlay
════════════════════════════════════════════════════════ -->
<tr>
  <td style="padding:0;line-height:0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td width="200" style="padding:0;line-height:0;">
          <img src="https://therapon1997-dermlux.github.io/dermlux-waitlist/email-images/facial-overlay.jpeg"
               alt="Facials" width="200" height="300"
               style="display:block;width:200px;height:300px;">
        </td>
        <td width="200" style="padding:0;line-height:0;">
          <img src="https://therapon1997-dermlux.github.io/dermlux-waitlist/email-images/laser-overlay.jpeg"
               alt="Laser" width="200" height="300"
               style="display:block;width:200px;height:300px;">
        </td>
        <td width="200" style="padding:0;line-height:0;">
          <img src="https://therapon1997-dermlux.github.io/dermlux-waitlist/email-images/injectable-overlay.jpeg"
               alt="Injectables" width="200" height="300"
               style="display:block;width:200px;height:300px;">
        </td>
      </tr>
    </table>
  </td>
</tr>


<!-- ══════════════════════════════════════════════════════
     6. TREATMENT CONTENT — 3 columns, coloured backgrounds
════════════════════════════════════════════════════════ -->
<tr>
  <td style="padding:0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr valign="top">

        <!-- Facials — #F7F1F5 light mauve -->
        <td width="200" style="background-color:#F7F1F5;padding:28px 18px 32px;vertical-align:top;">
          <div style="font-family:Arial,Helvetica,sans-serif;font-size:6.5px;font-weight:700;color:#B392A4;letter-spacing:2.5px;text-transform:uppercase;margin-bottom:16px;">Popular Treatments</div>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#333333;padding:5px 0;">&#8250;&nbsp;&nbsp;Premium Deep Cleansing</td></tr>
            <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#333333;padding:5px 0;">&#8250;&nbsp;&nbsp;Hydration Facial</td></tr>
            <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#333333;padding:5px 0;">&#8250;&nbsp;&nbsp;Vampire Facial</td></tr>
            <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#333333;padding:5px 0;">&#8250;&nbsp;&nbsp;Advanced Diamond Facial</td></tr>
          </table>
          <div style="margin-top:24px;">
            <a href="https://dermluxclinics.com/EmailPublicBookingForm"
               style="display:block;background-color:#161616;color:#ffffff;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:8px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:13px 6px;text-align:center;">
              BOOK A FACIAL &rarr;
            </a>
          </div>
        </td>

        <!-- Laser — #F5F5F5 light gray -->
        <td width="200" style="background-color:#F5F5F5;padding:28px 18px 32px;vertical-align:top;">
          <div style="font-family:Arial,Helvetica,sans-serif;font-size:6.5px;font-weight:700;color:#B392A4;letter-spacing:2.5px;text-transform:uppercase;margin-bottom:16px;">What We Offer</div>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#333333;padding:5px 0;">&#8250;&nbsp;&nbsp;All areas, face and body</td></tr>
            <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#333333;padding:5px 0;">&#8250;&nbsp;&nbsp;6+ session bundles, better value</td></tr>
            <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#333333;padding:5px 0;">&#8250;&nbsp;&nbsp;Suitable for all skin types</td></tr>
            <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#333333;padding:5px 0;">&#8250;&nbsp;&nbsp;Women's &amp; men's treatments</td></tr>
          </table>
          <div style="margin-top:24px;">
            <a href="https://dermluxclinics.com/EmailPublicBookingForm"
               style="display:block;background-color:#161616;color:#ffffff;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:8px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:13px 6px;text-align:center;">
              EXPLORE LASER PLANS &rarr;
            </a>
          </div>
        </td>

        <!-- Injectables — #EDEDF0 light slate -->
        <td width="200" style="background-color:#EDEDF0;padding:28px 18px 32px;vertical-align:top;">
          <div style="font-family:Arial,Helvetica,sans-serif;font-size:6.5px;font-weight:700;color:#B392A4;letter-spacing:2.5px;text-transform:uppercase;margin-bottom:16px;">Treatments</div>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#333333;padding:5px 0;">&#8250;&nbsp;&nbsp;Botox</td></tr>
            <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#333333;padding:5px 0;">&#8250;&nbsp;&nbsp;Dermal Fillers</td></tr>
            <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#333333;padding:5px 0;">&#8250;&nbsp;&nbsp;Skin Boosters</td></tr>
            <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#333333;padding:5px 0;">&#8250;&nbsp;&nbsp;Polynucleotides</td></tr>
          </table>
          <div style="margin-top:24px;">
            <a href="https://dermluxclinics.com/EmailPublicBookingForm"
               style="display:block;background-color:#161616;color:#ffffff;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:8px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:13px 6px;text-align:center;">
              BOOK INJECTABLES &rarr;
            </a>
          </div>
        </td>

      </tr>
    </table>
  </td>
</tr>


<!-- ══════════════════════════════════════════════════════
     7. PRE-SUMMER GLOW PROMO
════════════════════════════════════════════════════════ -->
<tr>
  <td style="padding:0;line-height:0;">
    <a href="https://dermluxclinics.com/EmailPublicBookingForm" style="display:block;line-height:0;">
      <img src="https://therapon1997-dermlux.github.io/dermlux-waitlist/email-images/promo-preglow.png"
           alt="Pre-summer Glow — From €170 Now €125" width="600"
           style="display:block;width:100%;max-width:600px;">
    </a>
  </td>
</tr>


<!-- ══════════════════════════════════════════════════════
     8. CONSULTATION — clinic photo left, text right
════════════════════════════════════════════════════════ -->
<tr>
  <td style="padding:0;line-height:0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td width="300" style="padding:0;line-height:0;vertical-align:middle;">
          <img src="https://therapon1997-dermlux.github.io/dermlux-waitlist/email-images/clinic.jpeg"
               alt="DermLux Clinic" width="300" height="220"
               style="display:block;width:300px;height:220px;object-fit:cover;">
        </td>
        <td width="300" style="background-color:#f0ece4;padding:32px 26px;vertical-align:middle;line-height:normal;">
          <div style="font-family:Georgia,'Times New Roman',serif;font-size:17px;font-style:italic;color:#161616;line-height:1.5;margin-bottom:16px;">Not sure where to start? That's what we're here for.</div>
          <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#c4874a;line-height:1.85;">Book a full redeemable consultation and we'll guide you to the right treatment.</div>
        </td>
      </tr>
    </table>
  </td>
</tr>


<!-- ══════════════════════════════════════════════════════
     9. MAIN CTA — dark background
════════════════════════════════════════════════════════ -->
<tr>
  <td style="background-color:#161616;padding:42px 40px 46px;text-align:center;">
    <div style="font-family:Arial,Helvetica,sans-serif;font-size:7.5px;color:#888888;letter-spacing:3.5px;text-transform:uppercase;margin-bottom:24px;">Book or ask us anything</div>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center">
      <tr>
        <td style="padding-right:8px;">
          <a href="https://dermluxclinics.com/EmailPublicBookingForm"
             style="display:inline-block;background-color:#EEEBE0;color:#161616;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:16px 26px;">
            FILL IN A FORM
          </a>
        </td>
        <td style="padding-left:8px;">
          <a href="https://wa.me/35797718967"
             style="display:inline-block;background-color:#25D366;color:#ffffff;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:16px 26px;">
            &#10003; WHATSAPP US
          </a>
        </td>
      </tr>
    </table>
  </td>
</tr>


<!-- ══════════════════════════════════════════════════════
     10. FOOTER
════════════════════════════════════════════════════════ -->
<tr>
  <td style="background-color:#161616;padding:26px 40px;text-align:center;">
    <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#8B8378;line-height:1.6;">5 clinics across Cyprus, medical expertise, visible results.</p>
    <p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#8B8378;line-height:1.6;">You're receiving this because you're subscribed to DermLux updates.</p>
    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;">
      <a href="{{unsubscribe_url}}" style="color:#9D845F;text-decoration:none;">Unsubscribe</a>
      <span style="color:#9D845F;margin:0 8px;">&middot;</span>
      <a href="https://dermluxclinics.com" style="color:#9D845F;text-decoration:none;">View in browser</a>
    </p>
  </td>
</tr>


</table>
</td></tr>
</table>
</body>
</html>
`,ss=`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>DermLux — Skin, Hair &amp; Aesthetics (3-Column)</title>
</head>
<body style="margin:0;padding:0;background-color:#f0ece4;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f0ece4;">
<tr><td align="center" style="padding:0;">

<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">


<!-- ══════════════════════════════════════════════════════
     1. HEADER
════════════════════════════════════════════════════════ -->
<tr>
  <td style="padding:0;line-height:0;">
    <img src="https://therapon1997-dermlux.github.io/dermlux-waitlist/email-images/header-dermlux.jpeg"
         alt="DermLux — Laser &amp; Medical Aesthetics" width="600" height="170"
         style="display:block;width:100%;max-width:600px;">
  </td>
</tr>


<!-- ══════════════════════════════════════════════════════
     2. HERO
════════════════════════════════════════════════════════ -->
<tr>
  <td style="padding:0;line-height:0;">
    <img src="https://therapon1997-dermlux.github.io/dermlux-waitlist/email-images/hero-gradient.jpeg"
         alt="Everything your skin needs, in one place." width="600" height="476"
         style="display:block;width:100%;max-width:600px;">
  </td>
</tr>


<!-- ══════════════════════════════════════════════════════
     3. GREETING
════════════════════════════════════════════════════════ -->
<tr>
  <td style="background-color:#ffffff;padding:44px 44px 16px;">
    <p style="margin:0 0 14px;font-family:Georgia,'Times New Roman',serif;font-size:16px;font-weight:700;color:#161616;">Hi {{name}},</p>
    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.9;color:#555555;">From a single glow-boosting facial to long-term laser plans and doctor-led injectables, DermLux brings it all together across our five clinics in Cyprus.</p>
  </td>
</tr>
<tr>
  <td style="background-color:#ffffff;height:36px;"></td>
</tr>


<!-- ══════════════════════════════════════════════════════
     4. SERVICE TABS — 3 columns
════════════════════════════════════════════════════════ -->
<tr>
  <td style="padding:0;line-height:0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td width="200" style="padding:0;line-height:0;">
          <img src="https://therapon1997-dermlux.github.io/dermlux-waitlist/email-images/tab-facials.png"
               alt="01 Facials &amp; Skin Glow" width="200"
               style="display:block;width:200px;">
        </td>
        <td width="200" style="padding:0;line-height:0;">
          <img src="https://therapon1997-dermlux.github.io/dermlux-waitlist/email-images/tab-laser.png"
               alt="02 Laser Hair Removal" width="200"
               style="display:block;width:200px;">
        </td>
        <td width="200" style="padding:0;line-height:0;">
          <img src="https://therapon1997-dermlux.github.io/dermlux-waitlist/email-images/tab-injectables.png"
               alt="03 Injectables" width="200"
               style="display:block;width:200px;">
        </td>
      </tr>
    </table>
  </td>
</tr>


<!-- ══════════════════════════════════════════════════════
     5. TREATMENT PHOTOS — 200×300 each
════════════════════════════════════════════════════════ -->
<tr>
  <td style="padding:0;line-height:0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td width="200" style="padding:0;line-height:0;">
          <img src="https://therapon1997-dermlux.github.io/dermlux-waitlist/email-images/facial-overlay.jpeg"
               alt="Facials" width="200" height="300"
               style="display:block;width:200px;height:300px;">
        </td>
        <td width="200" style="padding:0;line-height:0;">
          <img src="https://therapon1997-dermlux.github.io/dermlux-waitlist/email-images/laser-overlay.jpeg"
               alt="Laser" width="200" height="300"
               style="display:block;width:200px;height:300px;">
        </td>
        <td width="200" style="padding:0;line-height:0;">
          <img src="https://therapon1997-dermlux.github.io/dermlux-waitlist/email-images/injectable-overlay.jpeg"
               alt="Injectables" width="200" height="300"
               style="display:block;width:200px;height:300px;">
        </td>
      </tr>
    </table>
  </td>
</tr>


<!-- ══════════════════════════════════════════════════════
     6. TREATMENT LISTS + BUTTONS — 3 columns
════════════════════════════════════════════════════════ -->
<tr>
  <td style="padding:0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr valign="top">

        <!-- Facials — mauve -->
        <td width="200" style="background-color:#F7F1F5;padding:28px 18px 32px;vertical-align:top;">
          <div style="font-family:Arial,Helvetica,sans-serif;font-size:6.5px;font-weight:700;color:#B392A4;letter-spacing:2.5px;text-transform:uppercase;margin-bottom:16px;">Popular Treatments</div>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#333333;padding:5px 0;">&#8250;&nbsp;&nbsp;Premium Deep Cleansing</td></tr>
            <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#333333;padding:5px 0;">&#8250;&nbsp;&nbsp;Hydration Facial</td></tr>
            <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#333333;padding:5px 0;">&#8250;&nbsp;&nbsp;Vampire Facial</td></tr>
            <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#333333;padding:5px 0;">&#8250;&nbsp;&nbsp;Advanced Diamond Facial</td></tr>
          </table>
          <div style="margin-top:24px;">
            <a href="https://dermluxclinics.com/EmailPublicBookingForm"
               style="display:block;background-color:#161616;color:#ffffff;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:8px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:13px 6px;text-align:center;">
              BOOK A FACIAL &rarr;
            </a>
          </div>
        </td>

        <!-- Laser — light grey -->
        <td width="200" style="background-color:#F5F5F5;padding:28px 18px 32px;vertical-align:top;">
          <div style="font-family:Arial,Helvetica,sans-serif;font-size:6.5px;font-weight:700;color:#B392A4;letter-spacing:2.5px;text-transform:uppercase;margin-bottom:16px;">What We Offer</div>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#333333;padding:5px 0;">&#8250;&nbsp;&nbsp;All areas, face and body</td></tr>
            <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#333333;padding:5px 0;">&#8250;&nbsp;&nbsp;6+ session bundles, better value</td></tr>
            <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#333333;padding:5px 0;">&#8250;&nbsp;&nbsp;Suitable for all skin types</td></tr>
            <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#333333;padding:5px 0;">&#8250;&nbsp;&nbsp;Women's &amp; men's treatments</td></tr>
          </table>
          <div style="margin-top:24px;">
            <a href="https://dermluxclinics.com/EmailPublicBookingForm"
               style="display:block;background-color:#161616;color:#ffffff;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:8px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:13px 6px;text-align:center;">
              EXPLORE LASER PLANS &rarr;
            </a>
          </div>
        </td>

        <!-- Injectables — light slate -->
        <td width="200" style="background-color:#EDEDF0;padding:28px 18px 32px;vertical-align:top;">
          <div style="font-family:Arial,Helvetica,sans-serif;font-size:6.5px;font-weight:700;color:#B392A4;letter-spacing:2.5px;text-transform:uppercase;margin-bottom:16px;">Treatments</div>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#333333;padding:5px 0;">&#8250;&nbsp;&nbsp;Botox</td></tr>
            <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#333333;padding:5px 0;">&#8250;&nbsp;&nbsp;Dermal Fillers</td></tr>
            <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#333333;padding:5px 0;">&#8250;&nbsp;&nbsp;Skin Boosters</td></tr>
            <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#333333;padding:5px 0;">&#8250;&nbsp;&nbsp;Polynucleotides</td></tr>
          </table>
          <div style="margin-top:24px;">
            <a href="https://dermluxclinics.com/EmailPublicBookingForm"
               style="display:block;background-color:#161616;color:#ffffff;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:8px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:13px 6px;text-align:center;">
              BOOK INJECTABLES &rarr;
            </a>
          </div>
        </td>

      </tr>
    </table>
  </td>
</tr>


<!-- ══════════════════════════════════════════════════════
     7. CONSULTATION — clinic photo left, text right
════════════════════════════════════════════════════════ -->
<tr>
  <td style="padding:0;line-height:0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td width="300" style="padding:0;line-height:0;vertical-align:middle;">
          <img src="https://therapon1997-dermlux.github.io/dermlux-waitlist/email-images/clinic.jpeg"
               alt="DermLux Clinic" width="300" height="220"
               style="display:block;width:300px;height:220px;object-fit:cover;">
        </td>
        <td width="300" style="background-color:#f0ece4;padding:32px 26px;vertical-align:middle;line-height:normal;">
          <div style="font-family:Georgia,'Times New Roman',serif;font-size:17px;font-style:italic;color:#161616;line-height:1.5;margin-bottom:16px;">Not sure where to start? That's what we're here for.</div>
          <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#c4874a;line-height:1.85;">Book a full redeemable consultation and we'll guide you to the right treatment.</div>
        </td>
      </tr>
    </table>
  </td>
</tr>


<!-- ══════════════════════════════════════════════════════
     8. MAIN CTA — dark background
════════════════════════════════════════════════════════ -->
<tr>
  <td style="background-color:#161616;padding:42px 40px 46px;text-align:center;">
    <div style="font-family:Arial,Helvetica,sans-serif;font-size:7.5px;color:#888888;letter-spacing:3.5px;text-transform:uppercase;margin-bottom:24px;">Book or ask us anything</div>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center">
      <tr>
        <td style="padding-right:8px;">
          <a href="https://dermluxclinics.com/EmailPublicBookingForm"
             style="display:inline-block;background-color:#EEEBE0;color:#161616;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:16px 26px;">
            FILL IN A FORM
          </a>
        </td>
        <td style="padding-left:8px;">
          <a href="https://wa.me/35797718967"
             style="display:inline-block;background-color:#25D366;color:#ffffff;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:16px 26px;">
            &#10003; WHATSAPP US
          </a>
        </td>
      </tr>
    </table>
  </td>
</tr>


<!-- ══════════════════════════════════════════════════════
     9. FOOTER
════════════════════════════════════════════════════════ -->
<tr>
  <td style="background-color:#161616;padding:26px 40px;text-align:center;">
    <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#8B8378;line-height:1.6;">5 clinics across Cyprus, medical expertise, visible results.</p>
    <p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#8B8378;line-height:1.6;">You're receiving this because you're subscribed to DermLux updates.</p>
    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;">
      <a href="{{unsubscribe_url}}" style="color:#9D845F;text-decoration:none;">Unsubscribe</a>
      <span style="color:#9D845F;margin:0 8px;">&middot;</span>
      <a href="https://dermluxclinics.com" style="color:#9D845F;text-decoration:none;">View in browser</a>
    </p>
  </td>
</tr>


</table>
</td></tr>
</table>
</body>
</html>
`,as=`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>DermLux — Welcome Summer, Glowing.</title>
</head>
<body style="margin:0;padding:0;background-color:#EEEBE0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#EEEBE0;">
<tr><td align="center" style="padding:0;">

<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">


<!-- ══════════════════════════════════════════════════════
     1. HEADER
════════════════════════════════════════════════════════ -->
<tr>
  <td style="padding:0;line-height:0;">
    <img src="https://therapon1997-dermlux.github.io/dermlux-waitlist/email-images/header-dermlux.jpeg"
         alt="DermLux — Laser &amp; Medical Aesthetics" width="600" height="170"
         style="display:block;width:100%;max-width:600px;">
  </td>
</tr>


<!-- ══════════════════════════════════════════════════════
     2. SUMMER HERO — photo with gradient overlay + text
════════════════════════════════════════════════════════ -->
<tr>
  <td style="padding:0;line-height:0;position:relative;">
    <div style="position:relative;line-height:0;">
      <img src="https://therapon1997-dermlux.github.io/dermlux-waitlist/email-images/summer-hero.jpeg"
           alt="Welcome Summer, Glowing." width="600" height="328"
           style="display:block;width:100%;max-width:600px;">
      <!-- Gradient overlay text block -->
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0"
             style="position:absolute;bottom:0;left:0;width:100%;background:linear-gradient(to bottom, rgba(157,132,95,0.4) 0%, #372e21 100%);">
        <tr>
          <td style="padding:24px 40px 36px;">
            <div style="font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;color:#EEEBE0;letter-spacing:3.3px;text-transform:uppercase;margin-bottom:10px;">Spring / Summer Programme</div>
            <div style="font-family:Georgia,'Times New Roman',serif;font-size:36px;font-style:italic;color:#EEEBE0;line-height:1.15;margin-bottom:10px;">Welcome summer, glowing.</div>
            <div style="font-family:Georgia,'Times New Roman',serif;font-size:18px;font-style:italic;color:#EEEBE0;line-height:1.45;">4 treatments &mdash; 1 session. Deep cleanse, hydration, microdermabrasion and a flood of Vitamin C.</div>
          </td>
        </tr>
      </table>
    </div>
  </td>
</tr>


<!-- ══════════════════════════════════════════════════════
     3. GREETING
════════════════════════════════════════════════════════ -->
<tr>
  <td style="background-color:#ffffff;padding:44px 44px 16px;">
    <p style="margin:0 0 14px;font-family:Georgia,'Times New Roman',serif;font-size:16px;font-weight:700;color:#161616;">Hi {{name}},</p>
    <p style="margin:0 0 14px;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.9;color:#555555;">Summer in Cyprus doesn't ease in, it arrives. The sun, the salt, the long days outdoors all take a real toll on your skin. Before the season hits full speed, give your skin the care that sets everything else up.</p>
    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.9;color:#555555;">Our <strong>Pre-summer Glow</strong> programme is built for exactly that moment. Whether you're prepping for a holiday, a big event, or you just want to walk into June with skin that already feels ready, this is the one session that does the work.</p>
  </td>
</tr>
<tr>
  <td style="background-color:#ffffff;height:36px;"></td>
</tr>


<!-- ══════════════════════════════════════════════════════
     4. TREATMENT BANNER — mauve gradient, name + price
════════════════════════════════════════════════════════ -->
<tr>
  <td style="padding:0;line-height:0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
           style="background:linear-gradient(to bottom, #B392A4, #C9B4C0);">
      <tr valign="middle">
        <td style="padding:20px 32px;vertical-align:middle;">
          <div style="font-family:Georgia,'Times New Roman',serif;font-size:18px;font-weight:700;color:#ffffff;margin-bottom:4px;">Pre-summer Glow</div>
          <div style="font-family:Georgia,'Times New Roman',serif;font-size:13px;font-style:italic;color:rgba(255,255,255,0.75);">1 Session</div>
        </td>
        <td style="padding:20px 32px;text-align:right;vertical-align:middle;">
          <div style="font-family:Arial,Helvetica,sans-serif;font-size:8px;color:rgba(255,255,255,0.75);letter-spacing:3px;text-transform:uppercase;margin-bottom:4px;">Programme</div>
          <div style="font-family:Georgia,'Times New Roman',serif;font-size:16px;color:#ffffff;">
            <span style="text-decoration:line-through;opacity:0.7;">From &euro;170</span>&nbsp;Now &euro;125
          </div>
        </td>
      </tr>
    </table>
  </td>
</tr>


<!-- ══════════════════════════════════════════════════════
     5. WHAT'S INCLUDED — white box with list
════════════════════════════════════════════════════════ -->
<tr>
  <td style="background-color:#EEEBE0;padding:0 50px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
           style="background-color:#ffffff;margin:0;">
      <tr>
        <td style="padding:32px 36px;">
          <div style="font-family:Arial,Helvetica,sans-serif;font-size:7px;font-weight:700;color:#9D845F;letter-spacing:3px;text-transform:uppercase;margin-bottom:20px;">What's included</div>

          <!-- Item 1 -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#161616;padding:10px 0 10px 14px;">
                &#8226;&nbsp;&nbsp;Deep Facial Cleansing
              </td>
            </tr>
            <tr><td style="border-top:1px solid #e8e3dc;padding:0;line-height:1px;">&nbsp;</td></tr>
            <tr>
              <td style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#161616;padding:10px 0 10px 14px;">
                &#8226;&nbsp;&nbsp;HydroFacial
              </td>
            </tr>
            <tr><td style="border-top:1px solid #e8e3dc;padding:0;line-height:1px;">&nbsp;</td></tr>
            <tr>
              <td style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#161616;padding:10px 0 10px 14px;">
                &#8226;&nbsp;&nbsp;Diamond Microdermabrasion
              </td>
            </tr>
            <tr><td style="border-top:1px solid #e8e3dc;padding:0;line-height:1px;">&nbsp;</td></tr>
            <tr>
              <td style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#161616;padding:10px 0 10px 14px;">
                &#8226;&nbsp;&nbsp;Vitamin C Boost
              </td>
            </tr>
          </table>

        </td>
      </tr>
    </table>
  </td>
</tr>


<!-- ══════════════════════════════════════════════════════
     6. SUBTITLE + DESCRIPTION
════════════════════════════════════════════════════════ -->
<tr>
  <td style="background-color:#EEEBE0;padding:40px 50px 10px;text-align:center;">
    <p style="margin:0 0 16px;font-family:Georgia,'Times New Roman',serif;font-size:20px;font-style:italic;color:#161616;line-height:1.5;">For pre-holiday prep, instant glow, or special events</p>
    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#9D845F;line-height:1.85;">You walk out with skin that's visibly brighter, smoother, and ready for whatever the season brings. Most clients book this the week before a trip, a wedding, or a milestone.</p>
  </td>
</tr>


<!-- ══════════════════════════════════════════════════════
     7. URGENCY NOTICE — pink left border
════════════════════════════════════════════════════════ -->
<tr>
  <td style="background-color:#EEEBE0;padding:24px 50px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
           style="background-color:rgba(179,146,164,0.1);border-left:5px solid #B392A4;">
      <tr>
        <td style="padding:14px 20px;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#161616;line-height:1.75;">
          Slots are limited through May and into June. <strong>Book yours before the calendar fills up.</strong>
        </td>
      </tr>
    </table>
  </td>
</tr>


<!-- ══════════════════════════════════════════════════════
     8. MAIN CTA — dark background
════════════════════════════════════════════════════════ -->
<tr>
  <td style="background-color:#161616;padding:42px 40px 46px;text-align:center;">
    <div style="font-family:Arial,Helvetica,sans-serif;font-size:7.5px;color:#888888;letter-spacing:3.5px;text-transform:uppercase;margin-bottom:24px;">Book or ask us anything</div>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center">
      <tr>
        <td style="padding-right:8px;">
          <a href="https://dermluxclinics.com/EmailPublicBookingForm"
             style="display:inline-block;background-color:#EEEBE0;color:#161616;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:16px 26px;">
            FILL IN A FORM
          </a>
        </td>
        <td style="padding-left:8px;">
          <a href="https://wa.me/35797718967"
             style="display:inline-block;background-color:#25D366;color:#ffffff;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:16px 26px;">
            &#10003; WHATSAPP US
          </a>
        </td>
      </tr>
    </table>
  </td>
</tr>


<!-- ══════════════════════════════════════════════════════
     9. FOOTER
════════════════════════════════════════════════════════ -->
<tr>
  <td style="background-color:#161616;padding:26px 40px;text-align:center;">
    <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#8B8378;line-height:1.6;">5 clinics across Cyprus, medical expertise, visible results.</p>
    <p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#8B8378;line-height:1.6;">You're receiving this because you're subscribed to DermLux updates.</p>
    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;">
      <a href="{{unsubscribe_url}}" style="color:#9D845F;text-decoration:none;">Unsubscribe</a>
      <span style="color:#9D845F;margin:0 8px;">&middot;</span>
      <a href="https://dermluxclinics.com" style="color:#9D845F;text-decoration:none;">View in browser</a>
    </p>
  </td>
</tr>


</table>
</td></tr>
</table>
</body>
</html>
`,ls=`<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "https://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>*|MC:SUBJECT|*</title>

  <!-- ===================================================================== -->
  <!-- DermLux · €50 off injectables · Mailchimp custom template             -->
  <!--                                                                       -->
  <!-- IMPORTANT — IMAGES:                                                    -->
  <!-- The src URLs below point at temporary Figma render URLs that expire    -->
  <!-- in ~7 days. Before sending, upload each image to Mailchimp's Content   -->
  <!-- Studio (or your own CDN) and replace the URLs. Search this file for    -->
  <!-- "REPLACE-IMAGE" to find every one.                                     -->
  <!-- ===================================================================== -->

  <style type="text/css">
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,400;1,500&family=Inter:wght@400;500;600&display=swap');

    /* ---- Client resets ---- */
    body, table, td, a { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
    table, td { mso-table-lspace:0pt; mso-table-rspace:0pt; }
    img { -ms-interpolation-mode:bicubic; border:0; height:auto; line-height:100%; outline:none; text-decoration:none; }
    table { border-collapse:collapse !important; }
    body { margin:0 !important; padding:0 !important; width:100% !important; height:100% !important; background-color:#eeebe0; }
    a { color:#9d845f; }

    /* ---- Type stacks ---- */
    .serif { font-family:'Cormorant Garamond','Cormorant',Georgia,'Times New Roman',serif; }
    .sans  { font-family:'Inter',-apple-system,'Helvetica Neue',Arial,sans-serif; }

    /* ---- Responsive ---- */
    @media only screen and (max-width:600px) {
      .container { width:100% !important; }
      .px { padding-left:24px !important; padding-right:24px !important; }
      .stack { display:block !important; width:100% !important; box-sizing:border-box !important; }
      .btn-wrap { display:block !important; width:100% !important; }
      .btn-wrap td { display:block !important; }
      .card { width:22% !important; display:inline-block !important; box-sizing:border-box !important; margin:0 1px !important; }
      .card td { padding:10px 5px 8px 5px !important; height:80px !important; border-radius:12px !important; }
      .card .serif { font-size:13px !important; line-height:15px !important; }
      .card .sans { font-size:9px !important; line-height:11px !important; }
      .h-hero { height:auto !important; }
      .euro { font-size:84px !important; }
    }
  </style>
</head>

<body style="margin:0; padding:0; background-color:#eeebe0;">

  <!-- Preheader (hidden) -->
  <div style="display:none; max-height:0; overflow:hidden; mso-hide:all; font-size:1px; line-height:1px; color:#eeebe0;">
    €50 off your next injectable appointment — first time or fifteenth, this one's for you.
    &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>

  <!-- Outer wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#eeebe0" style="background-color:#eeebe0;">
    <tr>
      <td align="center" style="padding:0;">

        <!-- 600px container -->
        <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px; max-width:600px; background-color:#ffffff;">

          <!-- ========================= HEADER / LOGO ========================= -->
          <tr>
            <td align="center" bgcolor="#161616" style="background-color:#161616; padding:34px 24px 30px 24px;">
              <!-- REPLACE-IMAGE: DermLux logo (cream lockup) -->
              <img src="https://www.figma.com/api/mcp/asset/751548e5-36f9-401a-bd58-22707d291ba1"
                   width="180" alt="DermLux"
                   style="display:block; width:180px; max-width:180px; height:auto;" />
            </td>
          </tr>

          <!-- ========================= HERO (flattened image) ========================= -->
          <tr>
            <td align="center" bgcolor="#161616" style="background-color:#161616; padding:0; font-size:0; line-height:0;">
              <!-- REPLACE-IMAGE: hero — text baked in for max client compatibility -->
              <img src="https://www.figma.com/api/mcp/asset/0483fa10-7347-4ab6-8b6c-ba43dd58702e"
                   width="600" alt="A welcome to 50€ off your injectables visit. First time or fifteenth, this one's for you."
                   style="display:block; width:100%; max-width:600px; height:auto;" />
            </td>
          </tr>

          <!-- ========================= INTRO COPY ========================= -->
          <tr>
            <td class="px" mc:edit="body_intro" style="padding:40px 60px 40px 60px; background-color:#ffffff;">
              <p class="sans" style="margin:0 0 12px 0; font-size:16px; line-height:25.5px; font-weight:400; color:#2d2926;">
                Whether you've been with us for years or you're thinking about injectables for the first time, here's a little welcome from our team. <strong style="font-weight:600; color:#2d2926;">€50 off your next injectable appointment</strong>, across all our treatments.
              </p>
              <p class="sans" style="margin:0; font-size:16px; line-height:25.5px; font-weight:400; color:#2d2926;">
                If you're new to this, the most important thing to know is below.
              </p>
            </td>
          </tr>

          <!-- ========================= DOCTOR / NON-NEGOTIABLE ========================= -->
          <tr>
            <td align="center" mc:edit="body_doctor" bgcolor="#25283d" class="px" style="background-color:#25283d; padding:40px 51px 40px 51px;">
              <!-- REPLACE-IMAGE: heart shield icon -->
              <img src="https://www.figma.com/api/mcp/asset/dfe63e15-c176-44d2-8cb0-f3a21a3cb7ac"
                   width="55" height="55" alt=""
                   style="display:block; width:55px; height:55px; margin:0 auto 24px auto;" />
              <p class="sans" style="margin:0 0 24px 0; font-size:12px; line-height:16.5px; font-weight:500; letter-spacing:3.3px; text-transform:uppercase; color:#eeebe0;">
                Non-Negotiable at DermLux
              </p>
              <p class="serif" style="margin:0 0 6px 0; font-size:36px; line-height:38px; font-style:italic; color:#ffffff;">
                Every injectable, by a doctor.
              </p>
              <p class="sans" style="margin:0 0 24px 0; font-size:16px; line-height:24px; font-weight:400; text-transform:uppercase; color:#ffffff;">
                No exceptions
              </p>
              <p class="sans" style="margin:0; font-size:16px; line-height:25px; font-weight:400; color:#eeebe0;">
                At DermLux, injectables are performed only by <strong style="font-weight:600; color:#ffffff;">licensed medical doctors</strong>, never by nurses, never by aestheticians. Your face deserves that level of care. Every appointment begins with a proper consultation about your goals, your face, and what will actually work for you, before any product is introduced.
              </p>
            </td>
          </tr>

          <!-- ========================= WHAT'S INCLUDED ========================= -->
          <tr>
            <td class="px" mc:edit="body_included" style="padding:36px 50px 8px 50px; background-color:#ffffff;">
              <p class="serif" style="margin:0 0 4px 0; font-size:22px; line-height:30.8px; font-style:italic; color:#161616;">
                What's included in the offer
              </p>
              <p class="sans" style="margin:0; font-size:13px; line-height:20.8px; font-weight:400; color:#9d845f;">
                €50 off, across all injectable treatments
              </p>
            </td>
          </tr>
          <tr>
            <td class="px" align="center" style="padding:14px 50px 28px 50px; background-color:#ffffff; font-size:0;">
              <!--[if mso]><table role="presentation" width="500" cellpadding="0" cellspacing="0" border="0"><tr><![endif]-->

              <!--[if mso]><td width="120" valign="top" style="padding:0 3px;"><![endif]-->
              <a href="https://dermluxclinics.com/injectables" target="_blank" style="text-decoration:none; display:inline-block; vertical-align:top; margin:0 2px;">
              <table role="presentation" class="card" cellpadding="0" cellspacing="0" border="0" width="120" style="width:120px; display:inline-block; vertical-align:top; margin:0;">
                <tr><td bgcolor="#25283d" style="background-color:#25283d; border-radius:16px; padding:23px 12px 20px 12px; height:120px; vertical-align:bottom;">
                  <p class="serif" style="margin:0; font-size:20px; line-height:20.8px; color:#eeebe0;">Botox</p>
                  <p class="sans" style="margin:0; font-size:12px; line-height:14.8px; color:#a7a69f;">Soften expression lines</p>
                </td></tr>
              </table>
              </a>
              <!--[if mso]></td><td width="120" valign="top" style="padding:0 3px;"><![endif]-->

              <a href="https://dermluxclinics.com/injectables" target="_blank" style="text-decoration:none; display:inline-block; vertical-align:top; margin:0 2px;">
              <table role="presentation" class="card" cellpadding="0" cellspacing="0" border="0" width="120" style="width:120px; display:inline-block; vertical-align:top; margin:0;">
                <tr><td bgcolor="#25283d" style="background-color:#25283d; border-radius:16px; padding:23px 12px 20px 12px; height:120px; vertical-align:bottom;">
                  <p class="serif" style="margin:0; font-size:20px; line-height:20.8px; color:#eeebe0;">Dermal Fillers</p>
                  <p class="sans" style="margin:0; font-size:12px; line-height:14.8px; color:#a7a69f;">Volume and definition</p>
                </td></tr>
              </table>
              </a>
              <!--[if mso]></td><td width="120" valign="top" style="padding:0 3px;"><![endif]-->

              <a href="https://dermluxclinics.com/injectables" target="_blank" style="text-decoration:none; display:inline-block; vertical-align:top; margin:0 2px;">
              <table role="presentation" class="card" cellpadding="0" cellspacing="0" border="0" width="120" style="width:120px; display:inline-block; vertical-align:top; margin:0;">
                <tr><td bgcolor="#25283d" style="background-color:#25283d; border-radius:16px; padding:23px 12px 20px 12px; height:120px; vertical-align:bottom;">
                  <p class="serif" style="margin:0; font-size:20px; line-height:20.8px; color:#eeebe0;">Skin Boosters</p>
                  <p class="sans" style="margin:0; font-size:12px; line-height:14.8px; color:#a7a69f;">Hydration from within</p>
                </td></tr>
              </table>
              </a>
              <!--[if mso]></td><td width="120" valign="top" style="padding:0 3px;"><![endif]-->

              <a href="https://dermluxclinics.com/injectables" target="_blank" style="text-decoration:none; display:inline-block; vertical-align:top; margin:0 2px;">
              <table role="presentation" class="card" cellpadding="0" cellspacing="0" border="0" width="120" style="width:120px; display:inline-block; vertical-align:top; margin:0;">
                <tr><td bgcolor="#25283d" style="background-color:#25283d; border-radius:16px; padding:23px 12px 20px 12px; height:120px; vertical-align:bottom;">
                  <p class="serif" style="margin:0; font-size:16px; line-height:20.8px; color:#eeebe0;">Polynucleotides</p>
                  <p class="sans" style="margin:0; font-size:12px; line-height:14.8px; color:#a7a69f;">Skin regeneration</p>
                </td></tr>
              </table>
              </a>
              <!--[if mso]></td></tr></table><![endif]-->
            </td>
          </tr>

          <!-- ========================= MAUVE BAND ========================= -->
          <tr>
            <td align="center" bgcolor="#b392a4" class="px" style="background-color:#b392a4; padding:48px 40px 48px 40px;">
              <p class="serif" style="margin:0; font-size:22px; line-height:30.8px; font-style:italic; color:#ffffff; text-align:center;">
                Subtle. Considered. Always you.<br />Just better-rested.
              </p>
            </td>
          </tr>

          <!-- ========================= CTA ========================= -->
          <tr>
            <td align="center" class="px" style="padding:36px 50px 4px 50px; background-color:#ffffff;">
              <p class="sans" style="margin:0; font-size:11px; line-height:16.5px; font-weight:500; letter-spacing:3.52px; text-transform:uppercase; color:#9d845f; text-align:center;">
                Book your injectable appointment
              </p>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:18px 50px 8px 50px; background-color:#ffffff;">
              <!-- Buttons -->
              <table role="presentation" class="btn-wrap" cellpadding="0" cellspacing="0" border="0" align="center">
                <tr>
                  <td style="padding:0 6px 10px 0;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" mc:edit="cta_form">
                      <tr>
                        <td bgcolor="#161616" align="center" style="background-color:#161616; width:180px;">
                          <a href="https://dermluxclinics.com/injectables" target="_blank" class="sans"
                             style="display:block; width:180px; padding:12px 0; font-size:13px; line-height:19.5px; font-weight:500; letter-spacing:1.56px; text-transform:uppercase; color:#eeebe0; text-decoration:none; text-align:center;">
                            Fill in a form
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td style="padding:0 0 10px 6px;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" mc:edit="cta_whatsapp">
                      <tr>
                        <td bgcolor="#25d366" align="center" style="background-color:#25d366; width:180px;">
                          <a href="https://wa.me/35797718967" target="_blank" class="sans"
                             style="display:block; width:180px; padding:12px 0; font-size:13px; line-height:19.5px; font-weight:500; letter-spacing:1.56px; text-transform:uppercase; color:#ffffff; text-decoration:none; text-align:center;">
                            <!-- REPLACE-IMAGE: WhatsApp icon -->
                            <img src="https://www.figma.com/api/mcp/asset/0049c45f-4429-4883-82bc-df26bd9b30cc" width="16" height="16" alt="" style="vertical-align:middle; width:16px; height:16px; margin-right:6px;" />WhatsApp us
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" mc:edit="cta_footer_text" class="px" style="padding:18px 50px 40px 50px; background-color:#ffffff;">
              <p class="serif" style="margin:0 0 6px 0; font-size:16px; line-height:20.8px; font-style:italic; color:#9d845f; text-align:center;">
                First time considering injectables?
              </p>
              <p class="sans" style="margin:0 0 14px 0; font-size:12px; line-height:18px; font-style:italic; color:#161616; text-align:center;">
                Start with a consultation. WhatsApp us and we'll guide you from there.
              </p>
              <p class="sans" style="margin:0 0 14px 0; font-size:13px; line-height:20.8px; color:#161616; text-align:center;">
                Offer valid through 30/06/2026 · One use per client
              </p>
              <p class="sans" style="margin:0; font-size:13px; line-height:20.8px; color:#9d845f; text-align:center;">
                The DermLux Team
              </p>
            </td>
          </tr>

          <!-- ========================= FOOTER ========================= -->
          <tr>
            <td align="center" bgcolor="#161616" class="px" style="background-color:#161616; padding:36px 40px 36px 40px;">
              <!-- REPLACE-IMAGE: DermLux logo (small, cream) -->
              <img src="https://www.figma.com/api/mcp/asset/751548e5-36f9-401a-bd58-22707d291ba1"
                   width="82" alt="DermLux"
                   style="display:block; width:82px; max-width:82px; height:auto; margin:0 auto 16px auto;" />
              <p class="sans" style="margin:0 0 6px 0; font-size:11px; line-height:17.6px; color:#8b8378; text-align:center;">
                5 clinics across Cyprus, medical expertise, visible results.
              </p>
              <p class="sans" style="margin:0 0 12px 0; font-size:11px; line-height:17.6px; color:#8b8378; text-align:center;">
                You're receiving this because you're subscribed to DermLux updates.
              </p>
              <p class="sans" style="margin:0 0 12px 0; font-size:11px; line-height:16.5px; text-align:center;">
                <a href="{{unsubscribe_url}}" style="color:#9d845f; text-decoration:none;">Unsubscribe</a>
              </p>
              <!-- Required by Mailchimp / CAN-SPAM: physical mailing address -->
              <p class="sans" style="margin:0; font-size:11px; line-height:16.5px; color:#5f5b54; text-align:center;">
                hello@dermluxclinics.com
              </p>
            </td>
          </tr>

        </table>
        <!-- /600px container -->

      </td>
    </tr>
  </table>

</body>
</html>
`,is=`<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "https://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>DermLux — Laser Hair Removal 40% Off For Life</title>

  <style type="text/css">
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;0,700;1,400;1,500;1,600&family=Inter:wght@400;500;600;700&display=swap');

    /* ---- Client resets ---- */
    body, table, td, a { -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; }
    table, td { mso-table-lspace:0pt; mso-table-rspace:0pt; }
    img { -ms-interpolation-mode:bicubic; border:0; height:auto; line-height:100%; outline:none; text-decoration:none; }
    table { border-collapse:collapse !important; }
    body { margin:0 !important; padding:0 !important; width:100% !important; height:100% !important; background-color:#e8e2d9; }
    a { color:#9d845f; }

    /* ---- Type stacks ---- */
    .serif { font-family:'Cormorant Garamond','Cormorant',Georgia,'Times New Roman',serif; }
    .sans  { font-family:'Inter',-apple-system,'Helvetica Neue',Arial,sans-serif; }

    /* ---- Responsive ---- */
    @media only screen and (max-width:600px) {
      .container { width:100% !important; }
      .px { padding-left:24px !important; padding-right:24px !important; }
      .stack { display:block !important; width:100% !important; box-sizing:border-box !important; }
      .btn-cell { display:block !important; width:100% !important; padding:0 0 12px 0 !important; }
      .hero-text-td { padding:64px 24px 56px 24px !important; }
      .hero-headline { font-size:96px !important; line-height:96px !important; }
      .price-num { font-size:30px !important; }
    }
  </style>
</head>

<body style="margin:0; padding:0; background-color:#e8e2d9;">

  <!-- Preheader (hidden) -->
  <div style="display:none; max-height:0; overflow:hidden; mso-hide:all; font-size:1px; line-height:1px; color:#e8e2d9;">
    Book any 8-session laser package by 15 July and keep 40% off every session — for life.
    &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>

  <!-- Outer wrapper -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#e8e2d9" style="background-color:#e8e2d9;">
    <tr>
      <td align="center" style="padding:0;">

        <!-- 600px container -->
        <table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px; max-width:600px; background-color:#f7f3ee;">

          <!-- ========= TOP ANNOUNCEMENT BAR ========= -->
          <tr>
            <td align="center" bgcolor="#161616" mc:edit="top_bar" style="position:relative; background-color:#161616; padding:11px 24px 11px 24px;">
              <p class="sans" style="margin:0; font-size:11px; line-height:16px; font-weight:600; color:#d8cdb8; text-align:center; letter-spacing:2px; text-transform:uppercase;">
                8-Session Package &nbsp;&middot;&nbsp; 40% Off For Life.
              </p>
            </td>
          </tr>

          <!-- ========= HEADER / LOGO ========= -->
          <tr>
            <td align="center" bgcolor="#161616" style="background-color:#161616; padding:24px 24px 28px 24px;">
              <!-- REPLACE-IMAGE  -->
              <img src="https://therapon1997-dermlux.github.io/dermlux-waitlist/email-images/logo-center.png"
                   width="125" alt="DermLux"
                   style="display:block; width:125px; max-width:125px; height:auto;" />
            </td>
          </tr>

          <!-- ========= HERO (single baked image — shows in Gmail mobile) ========= -->
          <tr>
            <td style="padding:0; font-size:0; line-height:0;">
              <img src="https://therapon1997-dermlux.github.io/dermlux-waitlist/email-images/hero-laser-40.jpg" width="600" alt="Laser Hair Removal — 40% Off Lifetime · 8-Session Bundles · Ends 15 July 2026" style="display:block; width:100%; max-width:600px; height:auto; border:0;" />
            </td>
          </tr>

          <!-- ========= INTRO ========= -->
          <tr>
            <td bgcolor="#f7f3ee" mc:edit="body_intro" class="px" style="background-color:#f7f3ee; padding:48px 40px 8px 40px;">
              <p class="sans" style="margin:0 0 16px 0; font-size:16px; line-height:24px; font-weight:700; color:#2b2b2b;">
                Hi {{name}},
              </p>
              <p class="sans" style="margin:0; font-size:16px; line-height:26px; font-weight:400; color:#3a3a3a;">
                Laser hair removal works best as a full course &mdash; and a course of 8 is where results truly last. This July we're doing something we've never offered before: book any 8-session package by 15 July, and once you finish it, every session you ever book after that stays <strong style="color:#2b2b2b;">40% off for life</strong>. For women and men, on any area or combination you choose.
              </p>
            </td>
          </tr>

          <!-- ========= HOW IT WORKS ========= -->
          <tr>
            <td bgcolor="#f7f3ee" mc:edit="how_it_works" class="px" style="background-color:#f7f3ee; padding:36px 40px 8px 40px;">
              <p class="sans" style="margin:0 0 24px 0; font-size:13px; line-height:18px; font-weight:600; color:#9d845f; letter-spacing:3px; text-transform:uppercase;">
                How It Works
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td valign="top" width="36" style="width:36px; padding:0 0 24px 0;">
                    <span class="serif" style="font-size:26px; line-height:24px; font-style:italic; color:#9d845f;">1</span>
                  </td>
                  <td valign="top" style="padding:0 0 24px 0;">
                    <p class="sans" style="margin:0; font-size:16px; line-height:24px; font-weight:400; color:#2b2b2b;">Book your 8-session package before 15 July.</p>
                  </td>
                </tr>
                <tr>
                  <td valign="top" width="36" style="width:36px; padding:0 0 24px 0;">
                    <span class="serif" style="font-size:26px; line-height:24px; font-style:italic; color:#9d845f;">2</span>
                  </td>
                  <td valign="top" style="padding:0 0 24px 0;">
                    <p class="sans" style="margin:0; font-size:16px; line-height:24px; font-weight:400; color:#2b2b2b;">Complete your 8 sessions &mdash; already 35% off the full course.</p>
                  </td>
                </tr>
                <tr>
                  <td valign="top" width="36" style="width:36px; padding:0;">
                    <span class="serif" style="font-size:26px; line-height:24px; font-style:italic; color:#9d845f;">3</span>
                  </td>
                  <td valign="top" style="padding:0;">
                    <p class="sans" style="margin:0; font-size:16px; line-height:24px; font-weight:400; color:#2b2b2b;">From then on, every session is 40% off &mdash; for life.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ========= SECTION HEADING: SEE WHAT YOU SAVE ========= -->
          <tr>
            <td bgcolor="#f7f3ee" class="px" style="background-color:#f7f3ee; padding:40px 40px 28px 40px;">
              <p class="sans" style="margin:0 0 6px 0; font-size:13px; line-height:18px; font-weight:600; color:#9d845f; letter-spacing:3px; text-transform:uppercase;">
                8-Session Packages
              </p>
              <p class="serif" style="margin:0 0 10px 0; font-size:44px; line-height:48px; font-style:italic; font-weight:600; color:#2b2b2b;">
                See what you save
              </p>
              <p class="sans" style="margin:0; font-size:14px; line-height:22px; font-weight:400; color:#a98a7d;">
                All prices include VAT &middot; 8 sessions per package &middot; then 40% off every session for life
              </p>
            </td>
          </tr>

          <!-- ========= PRICE TABLE: FOR HER ========= -->
          <tr>
            <td bgcolor="#1f1f1f" style="background-color:#1f1f1f; padding:16px 40px 16px 40px;">
              <p class="serif" style="margin:0; font-size:26px; line-height:30px; font-style:normal; font-weight:600; color:#f5f0e8;">For Her</p>
            </td>
          </tr>
          <tr>
            <td bgcolor="#f7f3ee" mc:edit="prices_her" class="px" style="background-color:#f7f3ee; padding:24px 40px 8px 40px;">

              <!-- Row: Full Body -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td valign="top" width="14" style="width:14px; padding:6px 0 0 0;">
                    <span style="display:inline-block; width:6px; height:6px; background-color:#b392a4; border-radius:50%;">&nbsp;</span>
                  </td>
                  <td valign="top" style="padding:0;">
                    <p class="sans" style="margin:0 0 4px 0; font-size:17px; line-height:22px; font-weight:700; color:#2b2b2b;">Full Body</p>
                    <p class="sans" style="margin:0; font-size:13px; line-height:18px; font-weight:400; color:#a98a7d;">Save &euro;420 now &middot; then &euro;90/session for life</p>
                  </td>
                  <td valign="top" align="right" style="padding:0; white-space:nowrap;">
                    <span class="serif" style="font-size:18px; color:#9d845f; text-decoration:line-through;">&euro;1200</span>
                    <span class="serif price-num" style="font-size:34px; line-height:34px; font-weight:600; color:#2b2b2b; padding-left:8px;">&euro;780</span>
                  </td>
                </tr>
              </table>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-bottom:1px solid #ddd2c4; font-size:0; line-height:0; padding:20px 0 0 0;">&nbsp;</td></tr></table>

              <!-- Row: Full Legs -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="padding-top:20px;">
                <tr>
                  <td valign="top" width="14" style="width:14px; padding:6px 0 0 0;">
                    <span style="display:inline-block; width:6px; height:6px; background-color:#b392a4; border-radius:50%;">&nbsp;</span>
                  </td>
                  <td valign="top" style="padding:0;">
                    <p class="sans" style="margin:0 0 4px 0; font-size:17px; line-height:22px; font-weight:700; color:#2b2b2b;">Full Legs</p>
                    <p class="sans" style="margin:0; font-size:13px; line-height:18px; font-weight:400; color:#a98a7d;">Save &euro;224 now &middot; then &euro;48/session for life</p>
                  </td>
                  <td valign="top" align="right" style="padding:0; white-space:nowrap;">
                    <span class="serif" style="font-size:18px; color:#9d845f; text-decoration:line-through;">&euro;640</span>
                    <span class="serif price-num" style="font-size:34px; line-height:34px; font-weight:600; color:#2b2b2b; padding-left:8px;">&euro;416</span>
                  </td>
                </tr>
              </table>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-bottom:1px solid #ddd2c4; font-size:0; line-height:0; padding:20px 0 0 0;">&nbsp;</td></tr></table>

              <!-- Row: Bikini + Under Arms -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="padding-top:20px;">
                <tr>
                  <td valign="top" width="14" style="width:14px; padding:6px 0 0 0;">
                    <span style="display:inline-block; width:6px; height:6px; background-color:#b392a4; border-radius:50%;">&nbsp;</span>
                  </td>
                  <td valign="top" style="padding:0;">
                    <p class="sans" style="margin:0 0 4px 0; font-size:17px; line-height:22px; font-weight:700; color:#2b2b2b;">Bikini + Under Arms</p>
                    <p class="sans" style="margin:0 0 4px 0; font-size:13px; line-height:18px; font-weight:400; color:#a98a7d;">Save &euro;168 now &middot; then &euro;36/session for life</p>
                    <p class="sans" style="margin:0; font-size:12px; line-height:16px; font-weight:600; font-style:italic; color:#b392a4; letter-spacing:0.5px;">THE MOST BOOKED COMBO</p>
                  </td>
                  <td valign="top" align="right" style="padding:0; white-space:nowrap;">
                    <span class="serif" style="font-size:18px; color:#9d845f; text-decoration:line-through;">&euro;480</span>
                    <span class="serif price-num" style="font-size:34px; line-height:34px; font-weight:600; color:#2b2b2b; padding-left:8px;">&euro;312</span>
                  </td>
                </tr>
              </table>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-bottom:1px solid #ddd2c4; font-size:0; line-height:0; padding:20px 0 0 0;">&nbsp;</td></tr></table>

              <!-- Row: Full Face -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="padding-top:20px;">
                <tr>
                  <td valign="top" width="14" style="width:14px; padding:6px 0 0 0;">
                    <span style="display:inline-block; width:6px; height:6px; background-color:#b392a4; border-radius:50%;">&nbsp;</span>
                  </td>
                  <td valign="top" style="padding:0;">
                    <p class="sans" style="margin:0 0 4px 0; font-size:17px; line-height:22px; font-weight:700; color:#2b2b2b;">Full Face</p>
                    <p class="sans" style="margin:0; font-size:13px; line-height:18px; font-weight:400; color:#a98a7d;">Save &euro;98 now &middot; then &euro;21/session for life</p>
                  </td>
                  <td valign="top" align="right" style="padding:0; white-space:nowrap;">
                    <span class="serif" style="font-size:18px; color:#9d845f; text-decoration:line-through;">&euro;280</span>
                    <span class="serif price-num" style="font-size:34px; line-height:34px; font-weight:600; color:#2b2b2b; padding-left:8px;">&euro;182</span>
                  </td>
                </tr>
              </table>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-bottom:1px solid #ddd2c4; font-size:0; line-height:0; padding:20px 0 0 0;">&nbsp;</td></tr></table>

            </td>
          </tr>

          <!-- ========= PRICE TABLE: FOR HIM ========= -->
          <tr>
            <td bgcolor="#1f1f1f" style="background-color:#1f1f1f; padding:16px 40px 16px 40px;">
              <p class="serif" style="margin:0; font-size:26px; line-height:30px; font-style:normal; font-weight:600; color:#f5f0e8;">For Him</p>
            </td>
          </tr>
          <tr>
            <td bgcolor="#f7f3ee" mc:edit="prices_him" class="px" style="background-color:#f7f3ee; padding:24px 40px 8px 40px;">

              <!-- Row: Full Body -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td valign="top" width="14" style="width:14px; padding:6px 0 0 0;">
                    <span style="display:inline-block; width:6px; height:6px; background-color:#b392a4; border-radius:50%;">&nbsp;</span>
                  </td>
                  <td valign="top" style="padding:0;">
                    <p class="sans" style="margin:0 0 4px 0; font-size:17px; line-height:22px; font-weight:700; color:#2b2b2b;">Full Body</p>
                    <p class="sans" style="margin:0; font-size:13px; line-height:18px; font-weight:400; color:#a98a7d;">Save &euro;672 now &middot; then &euro;144/session for life</p>
                  </td>
                  <td valign="top" align="right" style="padding:0; white-space:nowrap;">
                    <span class="serif" style="font-size:18px; color:#9d845f; text-decoration:line-through;">&euro;1920</span>
                    <span class="serif price-num" style="font-size:34px; line-height:34px; font-weight:600; color:#2b2b2b; padding-left:8px;">&euro;1248</span>
                  </td>
                </tr>
              </table>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-bottom:1px solid #ddd2c4; font-size:0; line-height:0; padding:20px 0 0 0;">&nbsp;</td></tr></table>

              <!-- Row: Chest -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="padding-top:20px;">
                <tr>
                  <td valign="top" width="14" style="width:14px; padding:6px 0 0 0;">
                    <span style="display:inline-block; width:6px; height:6px; background-color:#b392a4; border-radius:50%;">&nbsp;</span>
                  </td>
                  <td valign="top" style="padding:0;">
                    <p class="sans" style="margin:0 0 4px 0; font-size:17px; line-height:22px; font-weight:700; color:#2b2b2b;">Chest</p>
                    <p class="sans" style="margin:0; font-size:13px; line-height:18px; font-weight:400; color:#a98a7d;">Save &euro;126 now &middot; then &euro;27/session for life</p>
                  </td>
                  <td valign="top" align="right" style="padding:0; white-space:nowrap;">
                    <span class="serif" style="font-size:18px; color:#9d845f; text-decoration:line-through;">&euro;360</span>
                    <span class="serif price-num" style="font-size:34px; line-height:34px; font-weight:600; color:#2b2b2b; padding-left:8px;">&euro;234</span>
                  </td>
                </tr>
              </table>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-bottom:1px solid #ddd2c4; font-size:0; line-height:0; padding:20px 0 0 0;">&nbsp;</td></tr></table>

              <!-- Row: Chest + Belly -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="padding-top:20px;">
                <tr>
                  <td valign="top" width="14" style="width:14px; padding:6px 0 0 0;">
                    <span style="display:inline-block; width:6px; height:6px; background-color:#b392a4; border-radius:50%;">&nbsp;</span>
                  </td>
                  <td valign="top" style="padding:0;">
                    <p class="sans" style="margin:0 0 4px 0; font-size:17px; line-height:22px; font-weight:700; color:#2b2b2b;">Chest + Belly</p>
                    <p class="sans" style="margin:0; font-size:13px; line-height:18px; font-weight:400; color:#a98a7d;">Save &euro;224 now &middot; then &euro;48/session for life</p>
                  </td>
                  <td valign="top" align="right" style="padding:0; white-space:nowrap;">
                    <span class="serif" style="font-size:18px; color:#9d845f; text-decoration:line-through;">&euro;640</span>
                    <span class="serif price-num" style="font-size:34px; line-height:34px; font-weight:600; color:#2b2b2b; padding-left:8px;">&euro;416</span>
                  </td>
                </tr>
              </table>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-bottom:1px solid #ddd2c4; font-size:0; line-height:0; padding:20px 0 0 0;">&nbsp;</td></tr></table>

              <!-- Row: Back -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="padding-top:20px;">
                <tr>
                  <td valign="top" width="14" style="width:14px; padding:6px 0 0 0;">
                    <span style="display:inline-block; width:6px; height:6px; background-color:#b392a4; border-radius:50%;">&nbsp;</span>
                  </td>
                  <td valign="top" style="padding:0;">
                    <p class="sans" style="margin:0 0 4px 0; font-size:17px; line-height:22px; font-weight:700; color:#2b2b2b;">Back</p>
                    <p class="sans" style="margin:0; font-size:13px; line-height:18px; font-weight:400; color:#a98a7d;">Save &euro;224 now &middot; then &euro;48/session for life</p>
                  </td>
                  <td valign="top" align="right" style="padding:0; white-space:nowrap;">
                    <span class="serif" style="font-size:18px; color:#9d845f; text-decoration:line-through;">&euro;640</span>
                    <span class="serif price-num" style="font-size:34px; line-height:34px; font-weight:600; color:#2b2b2b; padding-left:8px;">&euro;416</span>
                  </td>
                </tr>
              </table>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-bottom:1px solid #ddd2c4; font-size:0; line-height:0; padding:20px 0 0 0;">&nbsp;</td></tr></table>

              <!-- Row: Full Legs -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="padding-top:20px;">
                <tr>
                  <td valign="top" width="14" style="width:14px; padding:6px 0 0 0;">
                    <span style="display:inline-block; width:6px; height:6px; background-color:#b392a4; border-radius:50%;">&nbsp;</span>
                  </td>
                  <td valign="top" style="padding:0;">
                    <p class="sans" style="margin:0 0 4px 0; font-size:17px; line-height:22px; font-weight:700; color:#2b2b2b;">Full Legs</p>
                    <p class="sans" style="margin:0; font-size:13px; line-height:18px; font-weight:400; color:#a98a7d;">Save &euro;252 now &middot; then &euro;54/session for life</p>
                  </td>
                  <td valign="top" align="right" style="padding:0; white-space:nowrap;">
                    <span class="serif" style="font-size:18px; color:#9d845f; text-decoration:line-through;">&euro;720</span>
                    <span class="serif price-num" style="font-size:34px; line-height:34px; font-weight:600; color:#2b2b2b; padding-left:8px;">&euro;468</span>
                  </td>
                </tr>
              </table>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-bottom:1px solid #ddd2c4; font-size:0; line-height:0; padding:20px 0 0 0;">&nbsp;</td></tr></table>

            </td>
          </tr>

          <!-- ========= "ANY AREA" NOTE ========= -->
          <tr>
            <td bgcolor="#f7f3ee" mc:edit="any_area_note" class="px" style="background-color:#f7f3ee; padding:32px 40px 48px 40px;">
              <p class="sans" style="margin:0; font-size:15px; line-height:24px; font-weight:400; color:#3a3a3a; text-align:center;">
                These are just popular examples. <strong style="color:#2b2b2b;">The 8-session price and the lifetime 40% perk apply to any area or combination you choose</strong> &mdash; just tell us what you'd like and we'll build your package.
              </p>
            </td>
          </tr>

          <!-- ========= QUOTE BAND (mauve) ========= -->
          <tr>
            <td align="center" bgcolor="#b392a4" mc:edit="quote_band" class="px" style="background-color:#b392a4; padding:56px 40px 56px 40px;">
              <p class="serif" style="margin:0; font-size:30px; line-height:42px; font-style:italic; font-weight:500; color:#f5f0e8; text-align:center; max-width:460px; margin-left:auto; margin-right:auto;">
                &ldquo;Pay for your course once. Keep 40% off every session &mdash; for the rest of your life.&rdquo;
              </p>
            </td>
          </tr>

          <!-- ========= CTA BUTTONS ========= -->
          <tr>
            <td align="center" bgcolor="#f7f3ee" class="px" style="background-color:#f7f3ee; padding:48px 40px 12px 40px;">
              <p class="sans" style="margin:0; font-size:13px; line-height:18px; font-weight:600; color:#9d845f; letter-spacing:3px; text-transform:uppercase; text-align:center;">
                Start Your Bundle
              </p>
            </td>
          </tr>
          <tr>
            <td bgcolor="#f7f3ee" class="px" style="background-color:#f7f3ee; padding:20px 40px 48px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td class="btn-cell" valign="top" width="50%" style="width:50%; padding:0 8px 0 0;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" bgcolor="#161616" style="background-color:#161616; border-radius:4px;">
                          <a href="https://dermluxclinics.com/LaserBundleOffer" target="_blank" class="sans"
                             style="display:block; padding:16px 20px; font-size:14px; line-height:18px; font-weight:600; color:#f5f0e8; text-decoration:none; text-align:center; letter-spacing:1.5px; text-transform:uppercase;">
                            Fill In A Form
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                  <td class="btn-cell" valign="top" width="50%" style="width:50%; padding:0 0 0 8px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center" bgcolor="#25d366" style="background-color:#25d366; border-radius:4px;">
                          <a href="https://wa.me/35797718967" target="_blank" class="sans"
                             style="display:block; padding:16px 20px; font-size:14px; line-height:18px; font-weight:600; color:#ffffff; text-decoration:none; text-align:center; letter-spacing:1.5px; text-transform:uppercase;">
                            WhatsApp Us
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ========= CUSTOM COMBO + FINE PRINT ========= -->
          <tr>
            <td align="center" bgcolor="#f7f3ee" mc:edit="fine_print" class="px" style="background-color:#f7f3ee; padding:8px 40px 48px 40px;">
              <p class="serif" style="margin:0 0 6px 0; font-size:22px; line-height:28px; font-style:italic; font-weight:600; color:#9d845f; text-align:center;">
                Want a different area or a custom combination?
              </p>
              <p class="sans" style="margin:0 0 28px 0; font-size:14px; line-height:22px; font-weight:400; color:#3a3a3a; text-align:center;">
                WhatsApp us &mdash; we'll build your package and send your price.
              </p>
              <p class="sans" style="margin:0 0 12px 0; font-size:13px; line-height:21px; font-weight:400; color:#6b6b6b; text-align:center;">
                Offer valid through 15 July 2026 &middot; New 8-session packages only &middot; Women &amp; men &middot; All prices include VAT 19%
              </p>
              <p class="sans" style="margin:0 0 28px 0; font-size:13px; line-height:21px; font-weight:400; color:#6b6b6b; text-align:center;">
                The lifetime 40% perk unlocks once your 8-session course is completed and applies to every future session. After 15 July, this offer won't be repeated. If you're already mid-course with us, your current plan stays as is.
              </p>
              <p class="sans" style="margin:0; font-size:14px; line-height:20px; font-weight:600; color:#9d845f; text-align:center;">
                The DermLux Team
              </p>
            </td>
          </tr>

          <!-- ========= FOOTER ========= -->
          <tr>
            <td align="center" bgcolor="#161616" class="px" style="background-color:#161616; padding:36px 40px 36px 40px;">
              <p class="sans" style="margin:0 0 6px 0; font-size:11px; line-height:17.6px; color:#8b8378; text-align:center;">
                5 clinics across Cyprus, medical expertise, visible results.
              </p>
              <p class="sans" style="margin:0 0 12px 0; font-size:11px; line-height:17.6px; color:#8b8378; text-align:center;">
                You're receiving this because you're subscribed to DermLux updates.
              </p>
              <p class="sans" style="margin:0 0 12px 0; font-size:11px; line-height:16.5px; text-align:center;">
                <a href="{{unsubscribe_url}}" style="color:#9d845f; text-decoration:none;">Unsubscribe</a>
              </p>
              <p class="sans" style="margin:0; font-size:11px; line-height:16.5px; color:#5f5b54; text-align:center;">
                hello@dermluxclinics.com
              </p>
            </td>
          </tr>

        </table>
        <!-- /600px container -->

      </td>
    </tr>
  </table>

</body>
</html>`,rs=["logo","hero","facial","laser","injectable","clinic","promo","skip"],os={logo:"🏷 Logo",hero:"🖼 Hero",facial:"💆 Facial photo",laser:"🔦 Laser photo",injectable:"💉 Injectable photo",clinic:"🏥 Clinic photo",promo:"🎁 Promo banner",skip:"✕ Skip"};function ds(t){const n={},s=new Set,i=t.filter(g=>g.mime==="image/png"&&g.w<400);i.length&&(n[i[0].id]="logo",s.add(i[0].id));const a=t.filter(g=>g.mime!=="image/png"&&!s.has(g.id)),r=a.filter(g=>g.w>g.h*1.2).sort((g,k)=>k.w*k.h-g.w*g.h);r[0]&&(n[r[0].id]="hero",s.add(r[0].id)),r[1]&&(n[r[1].id]="clinic",s.add(r[1].id));const y=a.filter(g=>g.h>g.w*1.1&&!s.has(g.id)).sort((g,k)=>k.w*k.h-g.w*g.h),x=["facial","laser","injectable"];y.forEach((g,k)=>{k<3&&(n[g.id]=x[k],s.add(g.id))});const w=a.filter(g=>g.w>g.h*3&&!s.has(g.id));return w[0]&&(n[w[0].id]="promo",s.add(w[0].id)),t.forEach(g=>{n[g.id]||(n[g.id]="skip")}),n}function cs(t){const n="https://therapon1997-dermlux.github.io/dermlux-waitlist/email-images",s=t.logo||`${n}/logo-full.png`,i=t.hero||`${n}/hero-gradient.jpeg`,a=t.facial||`${n}/facial-overlay.jpeg`,r=t.laser||`${n}/laser-overlay.jpeg`,y=t.injectable||`${n}/injectable-overlay.jpeg`,x=t.clinic||`${n}/clinic.jpeg`,w=t.promo||`${n}/promo-preglow.png`;return`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DermLux</title>
</head>
<body style="margin:0;padding:0;background-color:#f0ece4;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f0ece4;">
<tr><td align="center" style="padding:0;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">

<!-- HEADER -->
<tr>
  <td style="background-color:#161616;padding:24px 40px 22px;text-align:center;">
    <img src="${s}" alt="DermLux" width="120" height="109" style="display:block;margin:0 auto;width:120px;height:109px;">
  </td>
</tr>

<!-- HERO -->
<tr>
  <td style="padding:0;line-height:0;">
    <img src="${i}" alt="DermLux" width="600" height="476" style="display:block;width:100%;max-width:600px;">
  </td>
</tr>

<!-- GREETING -->
<tr>
  <td style="background-color:#ffffff;padding:44px 44px 16px;">
    <p style="margin:0 0 14px;font-family:Georgia,'Times New Roman',serif;font-size:16px;font-weight:700;color:#161616;">Hi {{name}},</p>
    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.9;color:#555555;">From a single glow-boosting facial to long-term laser plans and doctor-led injectables, DermLux brings it all together across our five clinics in Cyprus.</p>
  </td>
</tr>
<tr><td style="background-color:#ffffff;height:36px;"></td></tr>

<!-- SERVICE TABS -->
<tr>
  <td style="padding:0;line-height:0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td width="200" style="padding:0;line-height:0;"><img src="${n}/tab-facials.png" alt="01 Facials &amp; Skin Glow" width="200" style="display:block;width:200px;"></td>
        <td width="200" style="padding:0;line-height:0;"><img src="${n}/tab-laser.png" alt="02 Laser Hair Removal" width="200" style="display:block;width:200px;"></td>
        <td width="200" style="padding:0;line-height:0;"><img src="${n}/tab-injectables.png" alt="03 Injectables" width="200" style="display:block;width:200px;"></td>
      </tr>
    </table>
  </td>
</tr>

<!-- TREATMENT PHOTOS -->
<tr>
  <td style="padding:0;line-height:0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td width="200" style="padding:0;line-height:0;"><img src="${a}" alt="Facials" width="200" height="300" style="display:block;width:200px;height:300px;"></td>
        <td width="200" style="padding:0;line-height:0;"><img src="${r}" alt="Laser" width="200" height="300" style="display:block;width:200px;height:300px;"></td>
        <td width="200" style="padding:0;line-height:0;"><img src="${y}" alt="Injectables" width="200" height="300" style="display:block;width:200px;height:300px;"></td>
      </tr>
    </table>
  </td>
</tr>

<!-- TREATMENT CONTENT -->
<tr>
  <td style="padding:0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr valign="top">
        <td width="200" style="background-color:#F7F1F5;padding:28px 18px 32px;vertical-align:top;">
          <div style="font-family:Arial,Helvetica,sans-serif;font-size:6.5px;font-weight:700;color:#B392A4;letter-spacing:2.5px;text-transform:uppercase;margin-bottom:16px;">Popular Treatments</div>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#333333;padding:5px 0;">&#8250;&nbsp;&nbsp;Premium Deep Cleansing</td></tr>
            <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#333333;padding:5px 0;">&#8250;&nbsp;&nbsp;Hydration Facial</td></tr>
            <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#333333;padding:5px 0;">&#8250;&nbsp;&nbsp;Vampire Facial</td></tr>
            <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#333333;padding:5px 0;">&#8250;&nbsp;&nbsp;Advanced Diamond Facial</td></tr>
          </table>
          <div style="margin-top:24px;"><a href="https://dermluxclinics.com/EmailPublicBookingForm" style="display:block;background-color:#161616;color:#ffffff;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:8px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:13px 6px;text-align:center;">BOOK A FACIAL &rarr;</a></div>
        </td>
        <td width="200" style="background-color:#F5F5F5;padding:28px 18px 32px;vertical-align:top;">
          <div style="font-family:Arial,Helvetica,sans-serif;font-size:6.5px;font-weight:700;color:#B392A4;letter-spacing:2.5px;text-transform:uppercase;margin-bottom:16px;">What We Offer</div>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#333333;padding:5px 0;">&#8250;&nbsp;&nbsp;All areas, face and body</td></tr>
            <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#333333;padding:5px 0;">&#8250;&nbsp;&nbsp;6+ session bundles, better value</td></tr>
            <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#333333;padding:5px 0;">&#8250;&nbsp;&nbsp;Suitable for all skin types</td></tr>
            <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#333333;padding:5px 0;">&#8250;&nbsp;&nbsp;Women's &amp; men's treatments</td></tr>
          </table>
          <div style="margin-top:24px;"><a href="https://dermluxclinics.com/EmailPublicBookingForm" style="display:block;background-color:#161616;color:#ffffff;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:8px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:13px 6px;text-align:center;">EXPLORE LASER PLANS &rarr;</a></div>
        </td>
        <td width="200" style="background-color:#EDEDF0;padding:28px 18px 32px;vertical-align:top;">
          <div style="font-family:Arial,Helvetica,sans-serif;font-size:6.5px;font-weight:700;color:#B392A4;letter-spacing:2.5px;text-transform:uppercase;margin-bottom:16px;">Treatments</div>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#333333;padding:5px 0;">&#8250;&nbsp;&nbsp;Botox</td></tr>
            <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#333333;padding:5px 0;">&#8250;&nbsp;&nbsp;Dermal Fillers</td></tr>
            <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#333333;padding:5px 0;">&#8250;&nbsp;&nbsp;Skin Boosters</td></tr>
            <tr><td style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#333333;padding:5px 0;">&#8250;&nbsp;&nbsp;Polynucleotides</td></tr>
          </table>
          <div style="margin-top:24px;"><a href="https://dermluxclinics.com/EmailPublicBookingForm" style="display:block;background-color:#161616;color:#ffffff;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:8px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:13px 6px;text-align:center;">BOOK INJECTABLES &rarr;</a></div>
        </td>
      </tr>
    </table>
  </td>
</tr>

<!-- PROMO BANNER -->
<tr>
  <td style="padding:0;line-height:0;">
    <a href="https://dermluxclinics.com/EmailPublicBookingForm" style="display:block;line-height:0;">
      <img src="${w}" alt="Promo" width="600" style="display:block;width:100%;max-width:600px;">
    </a>
  </td>
</tr>

<!-- CONSULTATION -->
<tr>
  <td style="padding:0;line-height:0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td width="300" style="padding:0;line-height:0;vertical-align:middle;"><img src="${x}" alt="DermLux Clinic" width="300" height="220" style="display:block;width:300px;height:220px;object-fit:cover;"></td>
        <td width="300" style="background-color:#f0ece4;padding:32px 26px;vertical-align:middle;line-height:normal;">
          <div style="font-family:Georgia,'Times New Roman',serif;font-size:17px;font-style:italic;color:#161616;line-height:1.5;margin-bottom:16px;">Not sure where to start? That's what we're here for.</div>
          <div style="font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#c4874a;line-height:1.85;">Book a full redeemable consultation and we'll guide you to the right treatment.</div>
        </td>
      </tr>
    </table>
  </td>
</tr>

<!-- CTA -->
<tr>
  <td style="background-color:#161616;padding:42px 40px 46px;text-align:center;">
    <div style="font-family:Arial,Helvetica,sans-serif;font-size:7.5px;color:#888888;letter-spacing:3.5px;text-transform:uppercase;margin-bottom:24px;">Book or ask us anything</div>
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center">
      <tr>
        <td style="padding-right:8px;"><a href="https://dermluxclinics.com/EmailPublicBookingForm" style="display:inline-block;background-color:#EEEBE0;color:#161616;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:16px 26px;">FILL IN A FORM</a></td>
        <td style="padding-left:8px;"><a href="https://wa.me/35797718967" style="display:inline-block;background-color:#25D366;color:#ffffff;text-decoration:none;font-family:Arial,Helvetica,sans-serif;font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;padding:16px 26px;">&#10003; WHATSAPP US</a></td>
      </tr>
    </table>
  </td>
</tr>

<!-- FOOTER -->
<tr>
  <td style="background-color:#111111;padding:26px 40px;text-align:center;">
    <p style="margin:0 0 8px;font-family:Arial,Helvetica,sans-serif;font-size:10.5px;color:#888888;line-height:1.7;">5 clinics across Cyprus, medical expertise, visible results.</p>
    <p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:9.5px;color:#444444;line-height:1.6;">You've been subscribed to DermLux updates.</p>
    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:9.5px;">
      <a href="{{unsubscribe_url}}" style="color:#555555;text-decoration:underline;">Unsubscribe</a>
      <span style="color:#333333;margin:0 10px;">|</span>
      <a href="https://dermluxclinics.com" style="color:#555555;text-decoration:underline;">View in browser</a>
    </p>
  </td>
</tr>

</table>
</td></tr>
</table>
</body>
</html>`}function ps({onClose:t,onSaved:n}){const[s,i]=c.useState("upload"),[a,r]=c.useState([]),[y,x]=c.useState({}),[w,g]=c.useState(""),[k,C]=c.useState(""),[p,v]=c.useState(""),j=c.useRef();async function N(b){if(!(b!=null&&b.name.endsWith(".fig"))){C("Παρακαλώ επιλέξτε αρχείο .fig");return}C(""),i("loading");try{const z=await Zt.loadAsync(b),E=[];for(const[O,f]of Object.entries(z.files)){if(!O.startsWith("images/")||f.dir)continue;const h=await f.async("blob"),d=URL.createObjectURL(h),{w:S,h:T}=await new Promise($=>{const l=new Image;l.onload=()=>$({w:l.naturalWidth,h:l.naturalHeight}),l.src=d}),H=h.type||(O.endsWith(".png")?"image/png":"image/jpeg");E.push({id:O.split("/").pop(),blob:h,url:d,w:S,h:T,mime:H})}if(!E.length){C("Δεν βρέθηκαν εικόνες στο αρχείο."),i("upload");return}r(E),x(ds(E)),i("assign")}catch(z){C("Σφάλμα ανάγνωσης αρχείου: "+z.message),i("upload")}}async function A(){if(!w.trim())return;i("saving");const b={};try{const z=a.filter(O=>y[O.id]&&y[O.id]!=="skip");for(let O=0;O<z.length;O++){const f=z[O],h=y[f.id];v(`Μεταφόρτωση ${O+1}/${z.length}…`);const d=f.mime==="image/png"?"png":"jpg",S=`email-templates/${Date.now()}_${h}.${d}`,T=await Rt(Pt(It,S),f.blob,{contentType:f.mime});b[h]=await Bt(T.ref)}v("Αποθήκευση template…");const E=cs(b);await xt(ae(_,"email_templates"),{name:w.trim(),htmlBody:E,thumbUrl:b.hero||b.logo||"",imageUrls:b,createdAt:X()}),i("done"),setTimeout(()=>{n==null||n(),t()},1500)}catch(z){C("Σφάλμα: "+z.message),i("name")}}return e.jsx("div",{className:"fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4",children:e.jsxs("div",{className:"bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col",children:[e.jsxs("div",{className:"flex items-center justify-between px-6 py-4 border-b",children:[e.jsx("div",{className:"font-semibold text-gray-900",children:"📁 Import από .fig αρχείο"}),e.jsx("button",{className:"text-gray-400 hover:text-gray-600 text-xl",onClick:t,children:"×"})]}),e.jsxs("div",{className:"flex-1 overflow-y-auto p-6",children:[(s==="upload"||s==="loading")&&e.jsxs("div",{className:"flex flex-col items-center justify-center py-16 gap-4",children:[e.jsx("div",{className:"text-5xl",children:"📐"}),e.jsx("div",{className:"text-lg font-semibold text-gray-800",children:"Επιλέξτε αρχείο .fig"}),e.jsx("div",{className:"text-sm text-gray-500 text-center max-w-sm",children:"Ο designer εξάγει το αρχείο από Figma → File → Save local copy. Μετά ανεβάστε το εδώ και το σύστημα εξάγει αυτόματα logo, photos κ.λπ."}),k&&e.jsx("div",{className:"text-sm text-red-500",children:k}),s==="loading"?e.jsx("div",{className:"text-blue-600 text-sm",children:"Εξαγωγή εικόνων…"}):e.jsx("button",{className:"btn-primary",onClick:()=>j.current.click(),children:"Επιλογή αρχείου .fig"}),e.jsx("input",{ref:j,type:"file",accept:".fig",className:"hidden",onChange:b=>N(b.target.files[0])})]}),s==="assign"&&e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"text-sm text-gray-600",children:["Βρέθηκαν ",e.jsx("strong",{children:a.length})," εικόνες. Το σύστημα τις αναγνώρισε αυτόματα — ελέγξτε και διορθώστε αν χρειάζεται."]}),e.jsx("div",{className:"grid grid-cols-3 gap-3",children:a.map(b=>e.jsxs("div",{className:"border rounded-xl overflow-hidden",children:[e.jsx("img",{src:b.url,alt:"",className:"w-full h-32 object-cover"}),e.jsxs("div",{className:"p-2",children:[e.jsxs("div",{className:"text-xs text-gray-400 mb-1",children:[b.w,"×",b.h]}),e.jsx("select",{className:"w-full text-xs border rounded px-1 py-1",value:y[b.id]||"skip",onChange:z=>x(E=>({...E,[b.id]:z.target.value})),children:rs.map(z=>e.jsx("option",{value:z,children:os[z]},z))})]})]},b.id))}),e.jsxs("div",{className:"flex justify-end gap-2 pt-2",children:[e.jsx("button",{className:"btn-secondary",onClick:()=>i("upload"),children:"Πίσω"}),e.jsx("button",{className:"btn-primary",onClick:()=>i("name"),children:"Επόμενο →"})]})]}),s==="name"&&e.jsxs("div",{className:"space-y-6 max-w-md mx-auto py-8",children:[e.jsx("div",{className:"text-lg font-semibold text-gray-800",children:"Όνομα Template"}),e.jsx("input",{className:"input w-full",placeholder:"π.χ. DermLux Summer 2026",value:w,onChange:b=>g(b.target.value),autoFocus:!0}),k&&e.jsx("div",{className:"text-sm text-red-500",children:k}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx("button",{className:"btn-secondary flex-1",onClick:()=>i("assign"),children:"Πίσω"}),e.jsx("button",{className:"btn-primary flex-1",disabled:!w.trim(),onClick:A,children:"Αποθήκευση & Δημιουργία"})]})]}),s==="saving"&&e.jsxs("div",{className:"flex flex-col items-center justify-center py-20 gap-4",children:[e.jsx("div",{className:"text-4xl animate-spin",children:"⏳"}),e.jsx("div",{className:"text-blue-600 text-sm",children:p})]}),s==="done"&&e.jsxs("div",{className:"flex flex-col items-center justify-center py-20 gap-3",children:[e.jsx("div",{className:"text-5xl",children:"✅"}),e.jsx("div",{className:"font-semibold text-gray-800",children:"Template αποθηκεύτηκε!"})]})]})]})})}const be="https://therapon1997-dermlux.github.io/dermlux-waitlist/email-images",xs=[{id:"__builtin__",name:"DermLux — Skin, Hair & Aesthetics (με Promo)",description:"Κύριο newsletter με facials, laser, injectables, promo banner Pre-summer Glow και CTA.",htmlBody:ns,thumbUrl:`${be}/hero-gradient.jpeg`,builtin:!0},{id:"__builtin_3col__",name:"DermLux — Skin, Hair & Aesthetics (3 στήλες)",description:"Newsletter 3 στηλών με facials, laser, injectables και CTA. Χωρίς promo banner.",htmlBody:ss,thumbUrl:`${be}/facial-hq.jpg`,builtin:!0},{id:"__builtin_summer__",name:"DermLux — Summer Preglow Campaign",description:"Εποχικό email για το πρόγραμμα Pre-summer Glow (€125). Με τιμή, λίστα θεραπειών και urgency notice.",htmlBody:as,thumbUrl:`${be}/summer-hero.jpeg`,builtin:!0},{id:"__builtin_injectables__",name:"DermLux — €50 off Injectables Offer",description:"€50 έκπτωση σε κάθε injectable θεραπεία (Botox, Dermal Fillers, Skin Boosters, Polynucleotides). Ισχύει έως 30/06/2026.",htmlBody:ls,thumbUrl:`${be}/injectable-hq.jpg`,builtin:!0},{id:"__builtin_laser_40off__",name:"DermLux — Laser 40% Off For Life (8 Sessions)",description:"8-session laser package με 40% lifetime discount. Ισχύει έως 15 Ιουλίου 2026. Με τιμοκατάλογο For Her & For Him.",htmlBody:is,thumbUrl:`${be}/header-image-background.png`,builtin:!0}];function ms(){const[t,n]=c.useState([]),[s,i]=c.useState(null),[a,r]=c.useState(null),[y,x]=c.useState(!1),[w,g]=c.useState(null);c.useEffect(()=>gt(de(ae(_,"email_templates"),Be("createdAt","desc")),v=>n(v.docs.map(j=>({id:j.id,...j.data()})))),[]);const k=[...xs,...t];async function C(p){await ht(J(_,"email_templates",p.id)),g(null)}return e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("p",{className:"text-sm text-gray-500",children:[k.length," template",k.length!==1?"s":""]}),e.jsx("button",{className:"btn-primary",onClick:()=>x(!0),children:"📁 Import .fig αρχείο"})]}),e.jsx("div",{className:"grid gap-4",children:k.map(p=>e.jsxs("div",{className:"card p-5 flex gap-5 items-start",children:[e.jsx("img",{src:p.thumbUrl||`${be}/hero-gradient.jpeg`,alt:p.name,className:"w-28 h-20 object-cover rounded-lg shrink-0 border border-gray-200"}),e.jsxs("div",{className:"flex-1 min-w-0",children:[e.jsxs("div",{className:"flex items-center gap-2",children:[e.jsx("div",{className:"font-semibold text-gray-900",children:p.name}),p.builtin&&e.jsx("span",{className:"text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full",children:"Built-in"})]}),p.description&&e.jsx("div",{className:"text-sm text-gray-500 mt-1",children:p.description})]}),e.jsxs("div",{className:"flex flex-col gap-2 shrink-0",children:[e.jsx("button",{className:"btn-primary text-xs",onClick:()=>r(p),children:"+ Χρήση σε Καμπάνια"}),e.jsx("button",{className:"btn-secondary text-xs",onClick:()=>i(p),children:"👁 Προεπισκόπηση"}),!p.builtin&&e.jsx("button",{className:"text-xs text-red-400 hover:text-red-600 text-center",onClick:()=>g(p),children:"Διαγραφή"})]})]},p.id))}),s&&e.jsx("div",{className:"fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4",children:e.jsxs("div",{className:"bg-white rounded-2xl shadow-2xl flex flex-col w-full max-w-3xl",style:{height:"90vh"},children:[e.jsxs("div",{className:"flex items-center justify-between px-5 py-3 border-b",children:[e.jsx("div",{className:"font-semibold text-gray-900",children:s.name}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx("button",{className:"btn-primary text-xs",onClick:()=>{i(null),r(s)},children:"+ Χρήση σε Καμπάνια"}),e.jsx("button",{className:"btn-secondary text-xs",onClick:()=>i(null),children:"Κλείσιμο"})]})]}),e.jsx("iframe",{className:"flex-1 w-full rounded-b-2xl",title:"Email Preview",srcDoc:s.htmlBody,sandbox:"allow-same-origin"})]})}),a&&e.jsx(Ct,{campaign:{htmlBody:a.htmlBody,subject:"",fromName:"DermLux",fromEmail:"hello@dermluxclinics.com"},onClose:()=>r(null)}),w&&e.jsx("div",{className:"fixed inset-0 bg-black/50 flex items-center justify-center z-50",children:e.jsxs("div",{className:"bg-white rounded-xl shadow-xl p-6 w-full max-w-sm space-y-4",children:[e.jsx("div",{className:"font-semibold text-gray-900",children:"Διαγραφή Template"}),e.jsxs("div",{className:"text-sm text-gray-600",children:["Είστε σίγουροι ότι θέλετε να διαγράψετε το template ",e.jsxs("strong",{children:['"',w.name,'"']}),"; Η ενέργεια δεν αναιρείται."]}),e.jsxs("div",{className:"flex gap-2 pt-1",children:[e.jsx("button",{className:"btn-secondary flex-1",onClick:()=>g(null),children:"Ακύρωση"}),e.jsx("button",{className:"flex-1 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg",onClick:()=>C(w),children:"Διαγραφή"})]})]})}),y&&e.jsx(ps,{onClose:()=>x(!1),onSaved:()=>x(!1)})]})}const gs=[{id:"contacts",label:"👥 Επαφές"},{id:"campaigns",label:"📧 Καμπάνιες"},{id:"templates",label:"🎨 Templates"},{id:"metrics",label:"📊 Μετρικά"}];function hs(t){return t?new Date(t).toLocaleString("el-GR",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"}):""}const dt=new Set(["opt-out","optout","unsubscribed","bounced","bounce","spam","complained"]);function ct(t){const n=new Map;for(const s of t){const i=(s.email||"").trim().toLowerCase();if(!i)continue;const a=n.get(i);if(!a){n.set(i,s);continue}const r=dt.has((s.status||"").toLowerCase()),y=dt.has((a.status||"").toLowerCase());r&&!y&&n.set(i,s)}return[...n.values()]}function ys(){const[t,n]=c.useState("contacts"),[s,i]=c.useState([]),[a,r]=c.useState(!0),[y,x]=c.useState(!1),[w,g]=c.useState(null),[k,C]=c.useState(null),p=c.useRef(!1),v=c.useRef(null);async function j(){x(!0),C(null);try{const N=await ye(de(ae(_,"email_contacts"),Be("email"))),A=ct(N.docs.map(z=>({id:z.id,...z.data()})));i(A);const b=Date.now();g(b),p.current=!0,await qe(A)}catch(N){console.error("Failed to load contacts",N),C("Δεν ήταν δυνατή η φόρτωση των επαφών. Πιθανόν πρόβλημα σύνδεσης ή ημερήσιου ορίου της βάσης.")}finally{x(!1),r(!1)}}return c.useEffect(()=>{let N=!1;return(async()=>{var b;const A=await sn();if(!N)if((b=A==null?void 0:A.contacts)!=null&&b.length){const z=ct(A.contacts);i(z),g(A.savedAt),r(!1),p.current=!0,(z.length<A.contacts.length||Date.now()-A.savedAt>en)&&j()}else j()})(),()=>{N=!0}},[]),c.useEffect(()=>{if(!(!p.current||s.length===0))return clearTimeout(v.current),v.current=setTimeout(()=>qe(s),1500),()=>clearTimeout(v.current)},[s]),e.jsxs("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6",children:[e.jsxs("div",{className:"flex items-center gap-3 flex-wrap",children:[e.jsx("span",{className:"text-2xl",children:"📧"}),e.jsxs("div",{className:"flex-1 min-w-[220px]",children:[e.jsx("h1",{className:"text-xl font-bold text-gray-900",children:"Email Marketing"}),e.jsx("p",{className:"text-sm text-gray-500",children:"Διαχείριση επαφών, αποστολή καμπανιών, μετρικά"})]}),e.jsxs("div",{className:"flex items-center gap-2",children:[w&&e.jsxs("span",{className:"text-xs text-gray-400",children:["Συγχρονισμός: ",hs(w)]}),e.jsx("button",{onClick:j,disabled:y,className:"px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-300 bg-white text-gray-600 hover:border-blue-400 hover:text-blue-700 transition-colors disabled:opacity-50",title:"Φέρνει τις τελευταίες επαφές από τη βάση",children:y?"⏳ Ανανέωση…":"🔄 Ανανέωση"})]})]}),k&&e.jsxs("div",{className:"bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 flex items-center justify-between gap-3 flex-wrap",children:[e.jsxs("span",{children:["⚠️ ",k]}),e.jsx("button",{onClick:j,className:"px-3 py-1 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700",children:"Δοκίμασε ξανά"})]}),e.jsx("div",{className:"flex gap-1 bg-gray-100 rounded-xl p-1 w-fit",children:gs.map(N=>e.jsx("button",{onClick:()=>n(N.id),className:`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${t===N.id?"bg-white text-blue-700 shadow-sm":"text-gray-500 hover:text-gray-700"}`,children:N.label},N.id))}),t==="contacts"&&e.jsx(An,{contacts:s,loading:a,onContactsChange:i}),t==="campaigns"&&e.jsx(On,{}),t==="templates"&&e.jsx(ms,{}),t==="metrics"&&e.jsx(qn,{contacts:s})]})}export{ct as dedupeByEmail,ys as default};
