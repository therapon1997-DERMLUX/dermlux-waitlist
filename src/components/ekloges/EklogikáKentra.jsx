import { useEffect, useState, useMemo } from 'react'
import { collection, doc, onSnapshot, setDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'

// ─────────────────────────────────────────────────────────────────────────────
// Static data
// ─────────────────────────────────────────────────────────────────────────────

const POLL_LOOKUP = {
  '001-002': [{num:1,name:'ΚΕΝΤΡΟ Α'}],
  '003, 021': [{num:2,name:'ΚΕΝΤΡΟ Β'},{num:23,name:'ΚΕΝΤΡΟ ΣΤ'}],
  '004-007': [{num:3,name:'ΚΕΝΤΡΟ Γ'},{num:4,name:'ΚΕΝΤΡΟ Δ'},{num:5,name:'ΚΕΝΤΡΟ Ε'},{num:6,name:'ΚΕΝΤΡΟ ΣΤ'},{num:7,name:'ΚΕΝΤΡΟ Ζ'}],
  '008-009': [{num:8,name:'ΚΕΝΤΡΟ Η'},{num:9,name:'ΚΕΝΤΡΟ Θ'},{num:10,name:'ΚΕΝΤΡΟ Ι'}],
  '010-012': [{num:11,name:'ΚΕΝΤΡΟ Κ'},{num:12,name:'ΚΕΝΤΡΟ Λ'},{num:13,name:'ΚΕΝΤΡΟ Μ'}],
  '013': [{num:14,name:'ΚΕΝΤΡΟ Ν'}],
  '016-019': [{num:18,name:'ΚΕΝΤΡΟ Α'},{num:19,name:'ΚΕΝΤΡΟ Β'},{num:20,name:'ΚΕΝΤΡΟ Γ'},{num:21,name:'ΚΕΝΤΡΟ Δ'}],
  '020': [{num:22,name:'ΚΕΝΤΡΟ Ε'}],
  '023-024': [{num:25,name:'ΚΕΝΤΡΟ Η'},{num:26,name:'ΚΕΝΤΡΟ Θ'}],
  '025-026': [{num:27,name:'ΚΕΝΤΡΟ Α'},{num:28,name:'ΚΕΝΤΡΟ Β'},{num:29,name:'ΚΕΝΤΡΟ Γ'}],
  '027': [{num:30,name:'ΚΕΝΤΡΟ Α'}],
  '031-032': [{num:33,name:'ΚΕΝΤΡΟ Α'},{num:34,name:'ΚΕΝΤΡΟ Β'}],
  '033-034': [{num:58,name:'ΚΕΝΤΡΟ Α'},{num:59,name:'ΚΕΝΤΡΟ Β'}],
  '036': [{num:61,name:'ΚΕΝΤΡΟ Α'}],
  '037-040': [{num:43,name:'ΚΕΝΤΡΟ Α'},{num:44,name:'ΚΕΝΤΡΟ Β'},{num:45,name:'ΚΕΝΤΡΟ Γ'},{num:46,name:'ΚΕΝΤΡΟ Δ'}],
  '041-043': [{num:47,name:'ΚΕΝΤΡΟ Ε'},{num:48,name:'ΚΕΝΤΡΟ ΣΤ'},{num:49,name:'ΚΕΝΤΡΟ Ζ'}],
  '046-048': [{num:35,name:'ΚΕΝΤΡΟ Α'},{num:36,name:'ΚΕΝΤΡΟ Β'},{num:37,name:'ΚΕΝΤΡΟ Γ'}],
  '049': [{num:69,name:'ΚΕΝΤΡΟ Α'}],
  '050-051': [{num:62,name:'ΚΕΝΤΡΟ Α'}],
  '052': [{num:52,name:'ΚΕΝΤΡΟ Α'}],
  '053': [{num:70,name:'ΚΕΝΤΡΟ Α'}],
  '054': [{num:71,name:'ΚΕΝΤΡΟ Α'}],
  '056': [{num:73,name:'ΚΕΝΤΡΟ Α'}],
  '057': [{num:74,name:'ΚΕΝΤΡΟ Α'}],
  '058': [{num:63,name:'ΚΕΝΤΡΟ Α'},{num:64,name:'ΚΕΝΤΡΟ Β'}],
  '059': [{num:75,name:'ΚΕΝΤΡΟ Α'}],
  '060': [{num:76,name:'ΚΕΝΤΡΟ Α'}],
  '061': [{num:77,name:'ΚΕΝΤΡΟ Α'}],
  '062': [{num:53,name:'ΚΕΝΤΡΟ Α'}],
  '063': [{num:78,name:'ΚΕΝΤΡΟ Α'}],
  '064': [{num:79,name:'ΚΕΝΤΡΟ Α'}],
  '065': [{num:80,name:'ΚΕΝΤΡΟ Α'}],
  '066': [{num:65,name:'ΚΕΝΤΡΟ Α'}],
  '067': [{num:81,name:'ΚΕΝΤΡΟ Α'}],
  '069-072': [{num:82,name:'ΚΕΝΤΡΟ Α'},{num:83,name:'ΚΕΝΤΡΟ Β'},{num:84,name:'ΚΕΝΤΡΟ Γ'},{num:85,name:'ΚΕΝΤΡΟ Δ'}],
  '073': [{num:86,name:'ΚΕΝΤΡΟ Α'}],
  '074': [{num:87,name:'ΚΕΝΤΡΟ Α'}],
  '075': [{num:38,name:'ΚΕΝΤΡΟ Α'}],
  '076': [{num:39,name:'ΚΕΝΤΡΟ Α'}],
  '077': [{num:88,name:'ΚΕΝΤΡΟ Α'}],
  '078': [{num:89,name:'ΚΕΝΤΡΟ Α'}],
  '081': [{num:91,name:'ΚΕΝΤΡΟ Α'}],
  '083-084': [{num:40,name:'ΚΕΝΤΡΟ Α'},{num:41,name:'ΚΕΝΤΡΟ Β'}],
  '085': [{num:93,name:'ΚΕΝΤΡΟ Α'}],
  '086-087': [{num:54,name:'ΚΕΝΤΡΟ Α'},{num:55,name:'ΚΕΝΤΡΟ Β'}],
  '088': [{num:94,name:'ΚΕΝΤΡΟ Α'}],
  '089': [{num:95,name:'ΚΕΝΤΡΟ Α'}],
  '090': [{num:66,name:'ΚΕΝΤΡΟ Α'}],
  '094': [{num:99,name:'ΚΕΝΤΡΟ Β'},{num:100,name:'ΚΕΝΤΡΟ Γ'},{num:101,name:'ΚΕΝΤΡΟ Δ'},{num:102,name:'ΚΕΝΤΡΟ Ε'},{num:103,name:'ΚΕΝΤΡΟ ΣΤ'}],
  '095': [{num:104,name:'ΚΕΝΤΡΟ Α'}],
  '096': [{num:105,name:'ΚΕΝΤΡΟ Α'}],
  '097': [{num:106,name:'ΚΕΝΤΡΟ Α'}],
  '098': [{num:107,name:'ΚΕΝΤΡΟ Α'}],
  '099': [{num:108,name:'ΚΕΝΤΡΟ Α'}],
  '100': [{num:109,name:'ΚΕΝΤΡΟ Α'}],
  '101-102': [{num:110,name:'ΚΕΝΤΡΟ Α'},{num:111,name:'ΚΕΝΤΡΟ Β'}],
  '105': [{num:114,name:'ΚΕΝΤΡΟ Α'}],
  '106': [{num:67,name:'ΚΕΝΤΡΟ Α'}],
  '108': [{num:116,name:'ΚΕΝΤΡΟ Α'}],
  '110': [{num:118,name:'ΚΕΝΤΡΟ Α'}],
  '111': [{num:119,name:'ΚΕΝΤΡΟ Α'}],
  '112': [{num:120,name:'ΚΕΝΤΡΟ Α'}],
  '113': [{num:121,name:'ΚΕΝΤΡΟ Α'}],
  '114': [{num:68,name:'ΚΕΝΤΡΟ Α'}],
  '115': [{num:122,name:'ΚΕΝΤΡΟ Α'}],
  '116': [{num:123,name:'ΚΕΝΤΡΟ Α'}],
  '117': [{num:124,name:'ΚΕΝΤΡΟ Α'}],
  '118': [{num:125,name:'ΚΕΝΤΡΟ Α'}],
  '119': [{num:126,name:'ΚΕΝΤΡΟ Α'}],
  '120': [{num:127,name:'ΚΕΝΤΡΟ Α'}],
  '121-122': [{num:128,name:'ΚΕΝΤΡΟ Α'},{num:129,name:'ΚΕΝΤΡΟ Β'}],
  '123': [{num:56,name:'ΚΕΝΤΡΟ Α'}],
  '125': [{num:130,name:'ΚΕΝΤΡΟ Α'}],
  '126': [{num:131,name:'ΚΕΝΤΡΟ Α'}],
  '127': [{num:132,name:'ΚΕΝΤΡΟ Α'}],
  '128': [{num:133,name:'ΚΕΝΤΡΟ Α'}],
  '133': [{num:134,name:'ΚΕΝΤΡΟ Α'}],
  '134': [{num:135,name:'ΚΕΝΤΡΟ Α'}],
  '150': [{num:97,name:'ΚΕΝΤΡΟ Α'}],
  '152': [{num:42,name:'ΚΕΝΤΡΟ Α'}],
  '153': [{num:115,name:'ΚΕΝΤΡΟ Α'}],
  '154': [{num:96,name:'ΚΕΝΤΡΟ Α'}],
  '155': [{num:92,name:'ΚΕΝΤΡΟ Α'}],
  '156': [{num:113,name:'ΚΕΝΤΡΟ Α'}],
  '157': [{num:117,name:'ΚΕΝΤΡΟ Α'}],
  '158': [{num:90,name:'ΚΕΝΤΡΟ Α'}],
}

const TIERS = [
  {
    id:'t1', color:'#c0392b', voterColor:'#c0392b',
    label:'🔴 ΚΡΙΣΙΜΑ — Πάνω από 1.500 ψηφοφόροι',
    badge:'9 κέντρα', staffTip:'👥 Χρειάζονται 4+ άτομα',
    centers:[
      {rank:1,  name:'9ο ΔΗΜ. ΣΧΟΛΕΙΟ ΚΟΥΠΑΤΕΙΟ',             area:'Κάτω Πάφος',           boxes:5, voters:2820, aa:'004-007'},
      {rank:2,  name:'ΔΗΜ. ΣΧΟΛΕΙΟ ΕΜΠΑΣ',                    area:'Έμπα',                  boxes:4, voters:2505, aa:'069-072'},
      {rank:3,  name:'Α ΔΗΜ. ΣΧΟΛΕΙΟ ΓΕΡΟΣΚΗΠΟΥ',             area:'Γεροσκήπου',            boxes:4, voters:2397, aa:'037-040'},
      {rank:4,  name:'ΔΗΜ. ΣΧΟΛΕΙΟ ΑΓ. ΣΤΕΦΑΝΟΥ ΛΕΜΠΑΣ',     area:'Λέμπα',                 boxes:5, voters:2300, aa:'094'},
      {rank:5,  name:'Γ ΔΗΜ. ΣΧΟΛΕΙΟ ΠΑΦΟΥ',                  area:'Πάφος',                 boxes:4, voters:2159, aa:'016-019'},
      {rank:6,  name:'ΔΗΜ. ΣΧΟΛΕΙΟ ΠΕΓΕΙΑΣ',                  area:'Πέγεια',                boxes:3, voters:1917, aa:'046-048'},
      {rank:7,  name:'Β ΔΗΜ. ΣΧΟΛΕΙΟ ΓΕΡΟΣΚΗΠΟΥ',             area:'Γεροσκήπου',            boxes:3, voters:1869, aa:'041-043'},
      {rank:8,  name:'Β ΔΗΜ. ΣΧΟΛΕΙΟ ΠΑΦΟΥ',                  area:'Πάφος',                 boxes:3, voters:1712, aa:'010-012'},
      {rank:9,  name:'Δ ΔΗΜ. ΣΧΟΛΕΙΟ ΠΑΦΟΥ',                  area:'Πάφος',                 boxes:3, voters:1670, aa:'008-009'},
    ]
  },
  {
    id:'t2', color:'#e67e22', voterColor:'#e67e22',
    label:'🟠 ΥΨΗΛΗ ΠΡΟΤΕΡΑΙΟΤΗΤΑ — 750 – 1.500 ψηφοφόροι',
    badge:'9 κέντρα', staffTip:'👥 2–3 άτομα',
    centers:[
      {rank:10, name:'ΣΤ ΔΗΜ. ΣΧΟΛΕΙΟ ΚΑΤΩ ΠΑΦΟΥ',            area:'Κάτω Πάφος',           boxes:3, voters:1438, aa:'025-026'},
      {rank:11, name:'ΔΗΜ. ΣΧΟΛΕΙΟ ΑΝΑΒΑΡΓΟΥ',                 area:'Ανάβαργος',             boxes:2, voters:1222, aa:'031-032'},
      {rank:12, name:'ΓΥΜΝΑΣΙΟ ΑΠΟΣΤΟΛΟΥ ΠΑΥΛΟΥ',              area:'Πάφος',                 boxes:2, voters:1174, aa:'023-024'},
      {rank:13, name:'ΓΥΜΝΑΣΙΟ ΠΟΛΕΩΣ ΧΡΥΣΟΧΟΥΣ',             area:'Πόλις Χρυσοχούς',      boxes:2, voters:1102, aa:'033-034'},
      {rank:14, name:'ΔΗΜ. ΣΧΟΛΕΙΟ ΚΙΣΣΟΝΕΡΓΑΣ',               area:'Κισσόνεργα',            boxes:2, voters:1077, aa:'083-084'},
      {rank:15, name:'ΔΗΜ. ΣΧΟΛΕΙΟ ΚΟΝΙΩΝ',                    area:'Κόνια',                 boxes:2, voters:1062, aa:'086-087'},
      {rank:16, name:'ΛΥΚΕΙΟ ΚΥΚΚΟΥ ΠΑΦΟΥ',                    area:'Πάφος',                 boxes:2, voters:1029, aa:'003, 021'},
      {rank:17, name:'ΔΗΜ. ΣΧΟΛΕΙΟ ΜΕΣΟΓΗΣ',                   area:'Μεσόγη',                boxes:2, voters:929,  aa:'101-102'},
      {rank:18, name:'ΔΗΜ. ΣΧΟΛΕΙΟ ΤΑΛΑΣ',                     area:'Τάλα',                  boxes:2, voters:918,  aa:'121-122'},
    ]
  },
  {
    id:'t3', color:'#c9a800', voterColor:'#b8860b',
    label:'🟡 ΜΕΣΑΙΑ ΠΡΟΤΕΡΑΙΟΤΗΤΑ — 200 – 750 ψηφοφόροι',
    badge:'35 κέντρα', staffTip:'👤 1–2 άτομα',
    centers:[
      {rank:19, name:'ΔΗΜ. ΣΧΟΛΕΙΟ ΑΡΓΑΚΑΣ',                   area:'Αργάκα',                boxes:2, voters:714,  aa:'058'},
      {rank:20, name:'ΠΕΡΙΦ. ΔΗΜ. ΣΧΟΛΕΙΟ ΠΟΛΕΜΙΟΥ',           area:'Πολέμι',                boxes:1, voters:638,  aa:'112'},
      {rank:21, name:'ΠΕΡ. ΔΗΜ. ΣΧΟΛ. ΑΓ. ΜΑΡΙΝΑΣ ΧΡΥΣΟΧΟΥΣ', area:'Αγία Μαρίνα Χρυσοχούς',boxes:1, voters:595,  aa:'050-051'},
      {rank:22, name:'ΠΕΡΙΦ. ΔΗΜ. ΣΧΟΛΕΙΟ ΓΙΟΛΟΥ',             area:'Γιόλου',                boxes:1, voters:595,  aa:'064'},
      {rank:23, name:'Ζ ΔΗΜ. ΣΧΟΛΕΙΟ ΠΑΦΟΥ',                   area:'Πάφος',                 boxes:1, voters:565,  aa:'001-002'},
      {rank:24, name:'ΠΕΡΙΦ. ΔΗΜ. ΣΧΟΛΕΙΟ ΤΣΑΔΑΣ',             area:'Τσάδα',                 boxes:1, voters:560,  aa:'127'},
      {rank:25, name:'10ο ΔΗΜ. ΣΧΟΛΕΙΟ ΠΑΦΟΥ',                 area:'Πάφος',                 boxes:1, voters:543,  aa:'020'},
      {rank:26, name:'Α ΔΗΜ. ΣΧΟΛΕΙΟ ΠΑΦΟΥ',                   area:'Πάφος',                 boxes:1, voters:541,  aa:'013'},
      {rank:27, name:'Ε ΔΗΜ. ΣΧΟΛΕΙΟ ΠΑΦΟΥ',                   area:'Πάφος',                 boxes:1, voters:535,  aa:'027'},
      {rank:28, name:'ΔΗΜ. ΣΧΟΛΕΙΟ ΚΟΥΚΛΙΩΝ',                  area:'Κούκλια',               boxes:1, voters:527,  aa:'088'},
      {rank:29, name:'ΚΟΙΝΟΤΙΚΟ ΚΤΙΡΙΟ ΤΡΕΜΙΘΟΥΣΑΣ',           area:'Τρεμιθούσα',            boxes:1, voters:463,  aa:'126'},
      {rank:30, name:'ΔΗΜ. ΣΧΟΛΕΙΟ ΤΙΜΗΣ',                     area:'Τίμη',                  boxes:1, voters:460,  aa:'123'},
      {rank:31, name:'ΚΟΙΝΟΤΙΚΑ ΚΤΙΡΙΑ ΝΕΟΥ ΧΩΡΙΟΥ',           area:'Νέο Χωριό',             boxes:1, voters:419,  aa:'106'},
      {rank:32, name:'ΚΟΙΝΟΤΙΚΑ ΚΤΙΡΙΑ ΠΑΝΑΓΙΑΣ',              area:'Παναγιά',               boxes:1, voters:419,  aa:'108'},
      {rank:33, name:'ΚΟΙΝΟΤΙΚΟ ΚΤΙΡΙΟ ΣΤΡΟΥΜΠΙΟΥ',            area:'Στρούμπι',              boxes:1, voters:407,  aa:'120'},
      {rank:34, name:'ΓΡΑΦΕΙΑ ΚΟΙΝ. ΣΥΜΒ. ΠΩΜΟΥ',              area:'Πώμος',                 boxes:1, voters:371,  aa:'114'},
      {rank:35, name:'ΚΟΙΝΟΤΙΚΟ ΝΗΠΙΑΓΩΓΕΙΟ ΠΡΟΔΡΟΜΙΟΥ',       area:'Προδρόμι',              boxes:1, voters:345,  aa:'036'},
      {rank:36, name:'ΚΟΙΝΟΤΙΚΟ ΚΤΙΡΙΟ ΑΝΑΡΙΤΑΣ',              area:'Αναρίτα',               boxes:1, voters:343,  aa:'057'},
      {rank:37, name:'ΔΗΜ. ΣΧΟΛΕΙΟ ΔΡΟΥΣΕΙΑΣ',                 area:'Δρούσεια',              boxes:1, voters:330,  aa:'066'},
      {rank:38, name:'ΑΙΘΟΥΣΑ ΠΟΛΛ. ΧΡΗΣΗΣ ΑΜΑΡΓΕΤΗΣ',        area:'Αμαργέτη',              boxes:1, voters:325,  aa:'056'},
      {rank:39, name:'ΔΗΜ. ΣΧΟΛΕΙΟ ΙΝΕΙΑΣ',                    area:'Ινεια',                 boxes:1, voters:308,  aa:'075'},
      {rank:40, name:'ΔΗΜ. ΣΧΟΛΕΙΟ ΑΡΜΟΥΣ',                    area:'Άρμου',                 boxes:1, voters:292,  aa:'059'},
      {rank:41, name:'ΚΟΙΝΟΤΙΚΟ ΚΤΙΡΙΟ ΜΕΣΑ ΧΩΡΙΟΥ',           area:'Μέσα Χωριό',            boxes:1, voters:285,  aa:'099'},
      {rank:42, name:'ΚΟΙΝΟΤΙΚΟ ΚΤΙΡΙΟ ΑΓΙΑΣ ΜΑΡΙΝΟΥΔΑΣ',     area:'Αγία Μαρινούδα',        boxes:1, voters:252,  aa:'052'},
      {rank:43, name:'ΚΟΙΝΟΤΙΚΟ ΚΤΙΡΙΟ ΚΑΘΗΚΑ',                area:'Καθήκας',               boxes:1, voters:248,  aa:'076'},
      {rank:44, name:'ΠΟΛΙΤΙΣΤΙΚΟ ΚΕΝΤΡΟ ΣΑΛΑΜΙΟΥΣ',          area:'Σαλαμιού',              boxes:1, voters:248,  aa:'115'},
      {rank:45, name:'ΚΟΙΝΟΤΙΚΟ ΚΤΙΡΙΟ ΑΧΕΛΕΙΑΣ',              area:'Αχελειά',               boxes:1, voters:233,  aa:'062'},
      {rank:46, name:'ΚΟΙΝΟΤΙΚΑ ΚΤΙΡΙΑ ΣΤΑΤΟΥ - ΑΓ. ΦΩΤΙΟΥ',  area:'Στατός - Αγ. Φώτιος',  boxes:1, voters:233,  aa:'118'},
      {rank:47, name:'ΚΟΙΝΟΤΙΚΟ ΚΤΙΡΙΟ ΚΟΙΛΗΣ',                area:'Κοίλη',                 boxes:1, voters:232,  aa:'085'},
      {rank:48, name:'ΚΟΙΝΟΤΙΚΟ ΚΤΙΡΙΟ ΜΑΡΑΘΟΥΝΤΑΣ',           area:'Μαραθούντα',            boxes:1, voters:228,  aa:'098'},
      {rank:49, name:'ΔΗΜ. ΣΧΟΛΕΙΟ ΧΟΛΕΤΡΙΩΝ',                 area:'Χολέτρια',              boxes:1, voters:223,  aa:'133'},
      {rank:50, name:'ΚΟΙΝΟΤΙΚΑ ΚΤΙΡΙΑ ΠΕΡΙΣΤΕΡΩΝΑΣ',          area:'Περιστερώνα',           boxes:1, voters:213,  aa:'111'},
      {rank:51, name:'ΚΟΙΝΟΤΙΚΑ ΚΤΙΡΙΑ ΛΕΤΥΜΠΟΥΣ',             area:'Λέτυμπος',              boxes:1, voters:211,  aa:'095'},
      {rank:52, name:'ΓΡΑΦΕΙΟ ΚΟΙΝ. ΣΥΜΒ. ΣΙΜΟΥΣ',            area:'Σιμού',                 boxes:1, voters:203,  aa:'116'},
      {rank:53, name:'ΓΡ. ΚΟΙΝ. ΣΥΜΒ. ΚΑΝΝΑΒΙΟΥΣ',            area:'Κανναβιού',             boxes:1, voters:200,  aa:'078'},
    ]
  },
  {
    id:'t4', color:'#27ae60', voterColor:'#27ae60',
    label:'🟢 ΧΑΜΗΛΗ ΠΡΟΤΕΡΑΙΟΤΗΤΑ — Κάτω από 200 ψηφοφόροι',
    badge:'33 κέντρα', staffTip:'👤 1 άτομο αρκεί',
    centers:[
      {rank:54, name:'ΚΟΙΝΟΤΙΚΑ ΚΤΙΡΙΑ ΓΑΛΑΤΑΡΙΑΣ',            area:'Γαλατάρια',             boxes:1, voters:195,  aa:'063'},
      {rank:55, name:'ΠΟΛΙΤΙΣΤΙΚΟ ΚΕΝΤΡΟ ΧΟΥΛΟΥΣ',             area:'Χούλου',                boxes:1, voters:192,  aa:'134'},
      {rank:56, name:'ΠΟΛΙΤΙΣΤΙΚΟ ΚΕΝΤΡΟ ΛΥΣΟΥ',               area:'Λύσος',                 boxes:1, voters:191,  aa:'096'},
      {rank:57, name:'ΠΟΛΙΤΙΣΤΙΚΟ ΚΕΝΤΡΟ ΚΑΛΛΕΠΕΙΑΣ',          area:'Καλλέπεια',             boxes:1, voters:189,  aa:'077'},
      {rank:58, name:'ΓΡΑΦΕΙΑ ΚΟΙΝ. ΣΥΜΒ. ΚΕΛΟΚΕΔΑΡΩΝ',       area:'Κελοκέδαρα',            boxes:1, voters:165,  aa:'081'},
      {rank:59, name:'ΚΕΝΤΡΟ ΠΕΡΙΒ. ΜΕΛΕΤΩΝ ΚΡΗΤΟΥ ΤΕΡΡΑ',    area:'Κρήτου Τέρρα',          boxes:1, voters:164,  aa:'090'},
      {rank:60, name:'ΚΟΙΝΟΤΙΚΟ ΙΑΤΡΕΙΟ ΕΠΙΣΚΟΠΗΣ',            area:'Επισκοπή',              boxes:1, voters:160,  aa:'073'},
      {rank:61, name:'ΚΟΙΝΟΤΙΚΑ ΚΤΙΡΙΑ ΠΕΝΤΑΛΙΑΣ',             area:'Πενταλιά',              boxes:1, voters:151,  aa:'110'},
      {rank:62, name:'ΓΡΑΦΕΙΑ ΚΟΙΝ. ΣΥΜΒ. ΓΟΥΔΙΟΥ',            area:'Γούδι',                 boxes:1, voters:146,  aa:'065'},
      {rank:63, name:'ΓΡΑΦΕΙΑ ΚΟΙΝ. ΣΥΜΒ. ΜΕΣΑΝΩΝ',            area:'Μεσάνα',                boxes:1, voters:146,  aa:'100'},
      {rank:64, name:'ΓΡΑΦΕΙΟ ΚΟΙΝ. ΣΥΜΒ. ΝΑΤΑΣ',              area:'Νάτα',                  boxes:1, voters:146,  aa:'105'},
      {rank:65, name:'ΚΕΝΤΡΟ ΠΛΗΡΟΦΟΡΗΣΗΣ ΓΕΩΛΟΓΙΑΣ ΑΚΑΜΑ',   area:'Ακάμας',                boxes:1, voters:145,  aa:'152'},
      {rank:66, name:'ΚΟΙΝΟΤΙΚΟ ΚΕΝΤΡΟ ΣΤΕΝΗΣ',                area:'Στενή',                 boxes:1, voters:142,  aa:'119'},
      {rank:67, name:'ΔΗΜ. ΣΧΟΛΕΙΟ ΜΑΝΔΡΙΩΝ',                  area:'Μανδριά',               boxes:1, voters:141,  aa:'097'},
      {rank:68, name:'ΔΗΜ. ΣΧΟΛΕΙΟ ΤΡΑΧΥΠΕΔΟΥΛΑΣ',             area:'Τραχυπέδουλα',          boxes:1, voters:139,  aa:'125'},
      {rank:69, name:'ΚΟΙΝΟΤΙΚΑ ΚΤΗΡΙΑ ΦΥΤΗΣ',                 area:'Φύτη',                  boxes:1, voters:139,  aa:'128'},
      {rank:70, name:'ΓΡΑΦΕΙΑ ΚΟΙΝ. ΣΥΜΒ. ΠΡΑΙΤΩΡΙΟΥ',        area:'Πραιτώρι',              boxes:1, voters:138,  aa:'113'},
      {rank:71, name:'ΔΗΜ. ΣΧΟΛΕΙΟ ΑΓ. ΓΕΩΡΓΙΟΥ',             area:'Αγ. Γεώργιος',          boxes:1, voters:132,  aa:'053'},
      {rank:72, name:'ΚΟΙΝΟΤΙΚΟ ΚΤΙΡΙΟ ΔΡΥΜΟΥΣ',               area:'Δρυμός',                boxes:1, voters:130,  aa:'067'},
      {rank:73, name:'ΚΟΙΝΟΤΙΚΟ ΚΤΙΡΙΟ ΘΕΛΕΤΡΑΣ',              area:'Θέλετρα',               boxes:1, voters:130,  aa:'074'},
      {rank:74, name:'ΓΡΑΦΕΙΟ ΣΥΝΔ. ΑΠΟΔΗΜΩΝ ΑΣΠΡΟΓΙΑΣ',      area:'Ασπρογιά',              boxes:1, voters:107,  aa:'061'},
      {rank:75, name:'ΚΟΙΝΟΤΙΚΟ ΚΤΙΡΙΟ ΑΓΙΟΥ ΔΗΜΗΤΡΙΑΝΟΥ',    area:'Αγ. Δημητριανός',       boxes:1, voters:105,  aa:'054'},
      {rank:76, name:'ΓΡΑΦΕΙΟ ΚΟΙΝ. ΣΥΜΒ. ΣΚΟΥΛΛΙ',           area:'Σκούλλι',               boxes:1, voters:104,  aa:'117'},
      {rank:77, name:'ΚΟΙΝΟΤΙΚΟ ΙΑΤΡΕΙΟ ΚΡΗΤΟΥ ΜΑΡΟΤΤΟΥ',     area:'Κρήτου Μαρόττου',       boxes:1, voters:103,  aa:'089'},
      {rank:78, name:'ΚΟΙΝΟΤΙΚΟ ΚΤΙΡΙΟ ΑΓ. ΜΑΡΙΝΑΣ ΚΕΛ.',    area:'Αγ. Μαρίνα Κελοκέδαρων',boxes:1,voters:88,   aa:'049'},
      {rank:79, name:'ΚΟΙΝΟΤΙΚΟ ΙΑΤΡΕΙΟ ΛΕΜΟΝΑ',               area:'Λεμονάς',               boxes:1, voters:84,   aa:'150'},
      {rank:80, name:'ΓΡΑΦΕΙΑ ΚΟΙΝ. ΣΥΜΒ. ΝΙΚΟΚΛΕΙΑΣ',        area:'Νικόκλεια',             boxes:1, voters:75,   aa:'153'},
      {rank:81, name:'ΔΗΜ. ΣΧΟΛΕΙΟ ΑΡΧΙΜΑΝΔΡΙΤΑΣ',            area:'Αρχιμανδρίτα',          boxes:1, voters:71,   aa:'060'},
      {rank:82, name:'ΔΗΜ. ΣΧΟΛΕΙΟ ΚΙΝΟΥΣΑΣ',                  area:'Κινούσα',               boxes:1, voters:67,   aa:'155'},
      {rank:83, name:'ΚΟΙΝΟΤΙΚΟ ΚΤΙΡΙΟ ΜΗΛΙΟΥΣ',               area:'Μηλιού',                boxes:1, voters:67,   aa:'156'},
      {rank:84, name:'ΚΟΙΝΟΤΙΚΟ ΚΤΙΡΙΟ ΚΕΔΑΡΩΝ',               area:'Κέδαρες',               boxes:1, voters:66,   aa:'158'},
      {rank:85, name:'ΚΟΙΝΟΤΙΚΟ ΚΤΙΡΙΟ ΠΑΝΩ ΑΚΟΥΡΔΑΛΕΙΑΣ',    area:'Πάνω Ακουρδάλεια',      boxes:1, voters:65,   aa:'157'},
      {rank:86, name:'ΚΟΙΝΟΤΙΚΟ ΚΤΙΡΙΟ ΛΑΣΑΣ',                 area:'Λάσα',                  boxes:1, voters:64,   aa:'154'},
    ]
  }
]

const ALL_CENTERS = TIERS.flatMap(t => t.centers)
const safeId = aa => 'cnt_' + aa.replace(/[^a-zA-Z0-9]/g, '_')
const EMPTY_FORM = { name:'', surname:'', phone:'', adt:'', comments:'', ageGroup:'', ekso:false, katametrisi:false, diarkeia:false, proedrevon:false }

// ─────────────────────────────────────────────────────────────────────────────
// Main component
// ─────────────────────────────────────────────────────────────────────────────

export default function EklogikáKentra() {
  const [staffData, setStaffData] = useState({})
  const [matches,   setMatches]   = useState({})
  const [staffModal, setStaffModal] = useState(null) // aa string | null
  const [openPicker, setOpenPicker] = useState(null) // pollNum | null

  useEffect(() => {
    const u1 = onSnapshot(collection(db, 'eklogika_staff'), snap => {
      const d = {}
      snap.docs.forEach(doc => { const { aa, people } = doc.data(); if (aa) d[aa] = people || [] })
      setStaffData(d)
    })
    const u2 = onSnapshot(collection(db, 'eklogika_matches'), snap => {
      const d = {}
      snap.docs.forEach(doc => { d[doc.id] = doc.data() })
      setMatches(d)
    })
    return () => { u1(); u2() }
  }, [])

  const totalPeople   = useMemo(() => Object.values(staffData).reduce((s, a) => s + a.length, 0), [staffData])
  const staffedCount  = useMemo(() => ALL_CENTERS.filter(c => (staffData[c.aa] || []).length > 0).length, [staffData])
  const totalPolls    = useMemo(() => Object.values(POLL_LOOKUP).reduce((s, v) => s + v.length, 0), [])
  const matchedPolls  = useMemo(() => Object.keys(matches).length, [matches])

  async function clearMatch(pollNum) {
    await deleteDoc(doc(db, 'eklogika_matches', String(pollNum)))
  }

  async function assignMatch(pollNum, aa, person) {
    await setDoc(doc(db, 'eklogika_matches', String(pollNum)), {
      aa, personIdx: person.idx, personKey: aa + '||' + person.idx,
      name: person.name, surname: person.surname, proedrevon: !!person.proedrevon,
    })
    setOpenPicker(null)
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', background: '#f4f4f4', minHeight: '100vh', color: '#222' }}>

      {/* ── Header ── */}
      <header style={{ background: '#1a3a6b', color: 'white', padding: '20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 22, marginBottom: 6 }}>📊 Εκλογικά Κέντρα Πάφου — Κατά Σημαντικότητα</h1>
        <p style={{ fontSize: 14, opacity: 0.85 }}>Βουλευτικές Εκλογές 2026 · Βάση δεδομένων 2021 · Ταξινόμηση κατά αριθμό ψηφοφόρων</p>
      </header>

      {/* ── Stats ── */}
      <div style={{ display:'flex', justifyContent:'center', gap:16, padding:16, flexWrap:'wrap', background:'#e8edf5', borderBottom:'2px solid #ccc' }}>
        {[
          { num:'86',             lbl:'Κτίρια / Σημεία' },
          { num:'122',            lbl:'Συνολικές Κάλπες' },
          { num:'47.429',         lbl:'Ψηφοφόροι Πάφου' },
          { num:'24/5',           lbl:'Ημερομηνία 2026' },
          { num:`${staffedCount}/86`, lbl:'Στελεχωμένα Κέντρα', progress: staffedCount/86 },
          { num:totalPeople,      lbl:'Άτομα Συνολικά' },
          { num:`${matchedPolls}/${totalPolls}`, lbl:'Αντιστοιχισμένες Κάλπες' },
        ].map(s => (
          <div key={s.lbl} style={{ background:'white', borderRadius:8, padding:'12px 20px', textAlign:'center', minWidth:120, boxShadow:'0 1px 4px rgba(0,0,0,.1)' }}>
            <div style={{ fontSize:28, fontWeight:'bold', color:'#1a3a6b' }}>{s.num}</div>
            <div style={{ fontSize:12, color:'#666', marginTop:2 }}>{s.lbl}</div>
            {s.progress !== undefined && (
              <div style={{ marginTop:6, background:'#eee', borderRadius:4, height:8, width:80, margin:'6px auto 0' }}>
                <div style={{ background:'#1a3a6b', width:`${Math.min(s.progress*100,100)}%`, height:'100%', borderRadius:4 }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Coverage table ── */}
      <CoverageTable staffData={staffData} matches={matches} />

      {/* ── Tier sections ── */}
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 12px 40px' }}>
        {TIERS.map(tier => (
          <TierSection
            key={tier.id}
            tier={tier}
            staffData={staffData}
            matches={matches}
            openPicker={openPicker}
            setOpenPicker={setOpenPicker}
            onOpenStaff={setStaffModal}
            onClearMatch={clearMatch}
            onAssignMatch={assignMatch}
          />
        ))}
      </div>

      {/* ── Staff side-panel modal ── */}
      {staffModal && (
        <StaffModal
          aa={staffModal}
          people={staffData[staffModal] || []}
          onClose={() => setStaffModal(null)}
        />
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Coverage table
// ─────────────────────────────────────────────────────────────────────────────

function CoverageTable({ staffData, matches }) {
  const totalVoters = ALL_CENTERS.reduce((s, c) => s + c.voters, 0)

  const rows = TIERS.map(tier => {
    const boxes    = tier.centers.reduce((s, c) => s + c.boxes, 0)
    const voters   = tier.centers.reduce((s, c) => s + c.voters, 0)
    const staffed  = tier.centers.filter(c => (staffData[c.aa] || []).length > 0).length
    const kat      = tier.centers.reduce((s, c) => s + (staffData[c.aa] || []).filter(p => p.katametrisi).length, 0)
    const covPct   = boxes > 0 ? Math.round(kat / boxes * 100) : 0
    return { tier, boxes, voters, staffed, kat, covPct, pct: (voters / totalVoters * 100).toFixed(1) }
  })

  const totBoxes   = rows.reduce((s, r) => s + r.boxes, 0)
  const totVoters  = rows.reduce((s, r) => s + r.voters, 0)
  const totStaffed = rows.reduce((s, r) => s + r.staffed, 0)
  const totKat     = rows.reduce((s, r) => s + r.kat, 0)
  const totCov     = totBoxes > 0 ? Math.round(totKat / totBoxes * 100) : 0

  const th = { padding:'9px 14px', textAlign:'left', borderBottom:'2px solid #d0d8ea', color:'#1a3a6b', fontSize:13, fontWeight:700 }
  const td = { padding:'9px 14px', fontSize:13 }

  return (
    <div style={{ maxWidth:1100, margin:'18px auto 0', padding:'0 12px' }}>
      <div style={{ background:'white', borderRadius:10, boxShadow:'0 2px 10px rgba(0,0,0,.1)', overflow:'hidden' }}>
        <div style={{ background:'#1a3a6b', color:'white', padding:'12px 18px', fontWeight:700, fontSize:15 }}>
          📊 Κάλυψη Καταμέτρησης ανά Κατηγορία Εκλογικών Κέντρων
        </div>
        <div style={{ overflowX:'auto' }}>
          <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
            <thead>
              <tr style={{ background:'#eef1f8' }}>
                <th style={th}>Κατηγορία</th>
                <th style={{...th,textAlign:'center'}}>Κέντρα</th>
                <th style={{...th,textAlign:'center'}}>Κάλπες</th>
                <th style={{...th,textAlign:'right'}}>Ψηφοφόροι</th>
                <th style={{...th,textAlign:'right'}}>% επί συνόλου</th>
                <th style={{...th,textAlign:'center'}}>Στελεχ. Κέντρα</th>
                <th style={{...th,textAlign:'center'}}>Καταμετρητές</th>
                <th style={{...th,textAlign:'center'}}>Κάλυψη</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.tier.id} style={{ borderBottom:'1px solid #eee' }}>
                  <td style={td}>
                    <span style={{ display:'inline-block', width:12, height:12, borderRadius:'50%', background:r.tier.color, marginRight:8, verticalAlign:'middle' }} />
                    <strong>{r.tier.label.split('—')[0].trim()}</strong>
                  </td>
                  <td style={{...td,textAlign:'center'}}>{r.tier.centers.length}</td>
                  <td style={{...td,textAlign:'center'}}>{r.boxes}</td>
                  <td style={{...td,textAlign:'right'}}>{r.voters.toLocaleString('el-GR')}</td>
                  <td style={{...td,textAlign:'right'}}>{r.pct}%</td>
                  <td style={{...td,textAlign:'center'}}>{r.staffed}/{r.tier.centers.length}</td>
                  <td style={{...td,textAlign:'center'}}>{r.kat}/{r.boxes}</td>
                  <td style={{...td,textAlign:'center'}}>
                    <div style={{ display:'inline-flex', alignItems:'center', gap:6 }}>
                      <div style={{ background:'#eee', borderRadius:4, height:8, width:64, display:'inline-block' }}>
                        <div style={{ background:r.tier.color, width:`${Math.min(r.covPct,100)}%`, height:'100%', borderRadius:4 }} />
                      </div>
                      <span>{r.covPct}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background:'#eef1f8', fontWeight:700 }}>
                <td style={td}>Σύνολο</td>
                <td style={{...td,textAlign:'center'}}>{ALL_CENTERS.length}</td>
                <td style={{...td,textAlign:'center'}}>{totBoxes}</td>
                <td style={{...td,textAlign:'right'}}>{totVoters.toLocaleString('el-GR')}</td>
                <td style={{...td,textAlign:'right'}}>100%</td>
                <td style={{...td,textAlign:'center'}}>{totStaffed}/{ALL_CENTERS.length}</td>
                <td style={{...td,textAlign:'center'}}>{totKat}/{totBoxes}</td>
                <td style={{...td,textAlign:'center'}}>
                  <div style={{ display:'inline-flex', alignItems:'center', gap:6 }}>
                    <div style={{ background:'#eee', borderRadius:4, height:8, width:64, display:'inline-block' }}>
                      <div style={{ background:'#1a3a6b', width:`${Math.min(totCov,100)}%`, height:'100%', borderRadius:4 }} />
                    </div>
                    <span>{totCov}%</span>
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Tier section
// ─────────────────────────────────────────────────────────────────────────────

function TierSection({ tier, staffData, matches, openPicker, setOpenPicker, onOpenStaff, onClearMatch, onAssignMatch }) {
  return (
    <div style={{ marginTop:24 }}>
      <div style={{ background:tier.color, color:'white', padding:'10px 16px', borderRadius:'8px 8px 0 0', display:'flex', alignItems:'center', gap:12, fontWeight:700, fontSize:15 }}>
        <span style={{ flex:1 }}>{tier.label}</span>
        <span style={{ background:'rgba(255,255,255,.25)', borderRadius:20, padding:'2px 12px', fontSize:13 }}>{tier.badge}</span>
        <span style={{ fontSize:13, fontWeight:400, opacity:.9 }}>{tier.staffTip}</span>
      </div>
      <div style={{ background:'white', borderRadius:'0 0 8px 8px', boxShadow:'0 2px 8px rgba(0,0,0,.1)', overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ background:'#f5f5f5', borderBottom:'2px solid #e0e0e0', fontSize:12, color:'#555', textTransform:'uppercase', letterSpacing:'0.5px' }}>
              <th style={{ padding:'10px 12px', textAlign:'left', width:36 }}>#</th>
              <th style={{ padding:'10px 12px', textAlign:'left' }}>Εκλογικό Κέντρο</th>
              <th style={{ padding:'10px 12px', textAlign:'center' }}>Κάλπες</th>
              <th style={{ padding:'10px 12px', textAlign:'right' }}>Ψηφοφόροι</th>
              <th style={{ padding:'10px 12px', textAlign:'left' }}>Α/Α · Κέντρα 2026 · Στελέχωση</th>
            </tr>
          </thead>
          <tbody>
            {tier.centers.map(center => (
              <CenterRow
                key={center.rank}
                center={center}
                tier={tier}
                people={staffData[center.aa] || []}
                matches={matches}
                openPicker={openPicker}
                setOpenPicker={setOpenPicker}
                onOpenStaff={onOpenStaff}
                onClearMatch={onClearMatch}
                onAssignMatch={onAssignMatch}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Center row (one polling station)
// ─────────────────────────────────────────────────────────────────────────────

function CenterRow({ center, tier, people, matches, openPicker, setOpenPicker, onOpenStaff, onClearMatch, onAssignMatch }) {
  const polls = POLL_LOOKUP[center.aa] || []
  const hasStaff = people.length > 0

  return (
    <tr style={{ borderBottom:'1px solid #eee', verticalAlign:'top' }}>
      {/* Rank */}
      <td style={{ padding:'10px 12px', fontSize:14, color:'#999', fontWeight:'bold' }}>{center.rank}</td>

      {/* Name + staff preview */}
      <td style={{ padding:'10px 12px', fontSize:14 }}>
        <div style={{ fontWeight:600 }}>{center.name}</div>
        <div style={{ fontSize:12, color:'#888', marginTop:2 }}>{center.area}</div>
        {/* Inline staff preview */}
        {people.length > 0 && (
          <div style={{ marginTop:6, display:'flex', flexDirection:'column', gap:3 }}>
            {people.map((p, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', flexWrap:'wrap', gap:4, fontSize:12, color:'#333' }}>
                <span>{p.name} {p.surname}</span>
                {p.phone && <span style={{ color:'#888', fontSize:11 }}>· {p.phone}</span>}
                {p.ageGroup    && <Tag style={{ background:'#ede9fe', color:'#5b21b6' }}>{p.ageGroup}</Tag>}
                {p.ekso        && <Tag style={{ background:'#dbeafe', color:'#1d4ed8' }}>Έξω</Tag>}
                {p.katametrisi && <Tag style={{ background:'#fef3c7', color:'#92400e' }}>Καταμ.</Tag>}
                {p.diarkeia    && <Tag style={{ background:'#d1fae5', color:'#065f46' }}>Μέρα</Tag>}
                {p.proedrevon  && <Tag style={{ background:'#fef9c3', color:'#854d0e', border:'1px solid #f0c040' }}>👑 Προεδρεύον</Tag>}
              </div>
            ))}
          </div>
        )}
      </td>

      {/* Boxes */}
      <td style={{ padding:'10px 12px', textAlign:'center', fontSize:14 }}>
        <span style={{ display:'inline-block', background:'#e8edf5', color:'#1a3a6b', borderRadius:12, padding:'2px 10px', fontSize:13, fontWeight:'bold' }}>
          {center.boxes} κάλπ{center.boxes === 1 ? 'η' : 'ες'}
        </span>
      </td>

      {/* Voters */}
      <td style={{ padding:'10px 12px', textAlign:'right', fontSize:14, fontWeight:'bold', color:tier.voterColor }}>
        {center.voters.toLocaleString('el-GR')}
      </td>

      {/* AA + staff btn + poll tags + inline matching */}
      <td style={{ padding:'10px 12px', fontSize:12, color:'#aaa', verticalAlign:'top' }}>
        <div>{center.aa}</div>

        {/* Staff button */}
        <button
          onClick={() => onOpenStaff(center.aa)}
          style={{
            display:'inline-flex', alignItems:'center', gap:4, marginTop:5,
            padding:'3px 8px', border:`1px solid ${hasStaff ? '#27ae60' : '#ccc'}`,
            borderRadius:12, background: hasStaff ? '#e8f5e9' : '#f5f5f5',
            color: hasStaff ? '#1a6b3a' : '#555', fontSize:12, cursor:'pointer',
            fontWeight: hasStaff ? 'bold' : 'normal', transition:'all .15s',
          }}
        >
          👥
          <span style={{
            display:'inline-flex', alignItems:'center', justifyContent:'center',
            background: hasStaff ? '#27ae60' : '#bbb', color:'white',
            borderRadius:10, minWidth:18, height:18, fontSize:11, padding:'0 4px', fontWeight:'bold',
          }}>
            {people.length}
          </span>
        </button>

        {/* Poll tags */}
        {polls.length > 0 && (
          <div style={{ display:'flex', flexWrap:'wrap', gap:3, marginTop:4 }}>
            {polls.map(p => (
              <span key={p.num} style={{
                display:'inline-block', background:'#eef2fb', border:'1px solid #a8b8d8',
                color:'#1a3a6b', borderRadius:10, padding:'1px 7px', fontSize:11, fontWeight:'bold', whiteSpace:'nowrap',
              }}>
                {p.name} #{p.num}
              </span>
            ))}
          </div>
        )}

        {/* Inline matching rows */}
        {polls.length > 0 && (
          <div style={{ marginTop:4 }}>
            {polls.map(poll => {
              const match = matches[String(poll.num)]
              const isOpen = openPicker === poll.num
              const eligible = people
                .map((p, idx) => ({ ...p, idx }))
                .filter(p => p.katametrisi || p.proedrevon)
                .filter(p => {
                  // exclude already assigned to other polls in this AA
                  return !polls
                    .filter(q => q.num !== poll.num && matches[String(q.num)])
                    .map(q => matches[String(q.num)].personKey)
                    .includes(center.aa + '||' + p.idx)
                })

              return (
                <div key={poll.num}>
                  {/* Match row */}
                  <div
                    onClick={() => { if (!match) setOpenPicker(isOpen ? null : poll.num) }}
                    style={{
                      display:'flex', alignItems:'center', padding:'6px 0', gap:8,
                      borderBottom:'1px solid #f2f2f2', cursor: match ? 'default' : 'pointer',
                      background: match ? '#f0faf4' : 'transparent',
                      transition:'background .1s',
                    }}
                  >
                    <div style={{ display:'flex', alignItems:'center', gap:6, flex:1, minWidth:0 }}>
                      <span style={{
                        background: match ? '#27ae60' : '#1a3a6b', color:'white',
                        fontSize:10, fontWeight:'bold', borderRadius:10, padding:'2px 7px', whiteSpace:'nowrap', flexShrink:0,
                      }}>#{poll.num}</span>
                      <span style={{ fontSize:12, color:'#555', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{poll.name}</span>
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:5, flexShrink:0 }}>
                      {match ? (
                        <>
                          {match.proedrevon && <span style={{ fontSize:12 }}>👑</span>}
                          <span style={{ fontSize:12, fontWeight:'bold', color: match.proedrevon ? '#92400e' : '#1a6b3a' }}>
                            {match.name} {match.surname}
                          </span>
                          <button
                            onClick={e => { e.stopPropagation(); onClearMatch(poll.num) }}
                            style={{ background:'none', border:'none', color:'#c0392b', cursor:'pointer', fontSize:11, padding:'1px 4px', borderRadius:4 }}
                          >✕</button>
                        </>
                      ) : (
                        <span style={{ fontSize:11, color:'#c0c0c0', fontStyle:'italic' }}>+ Επιλογή</span>
                      )}
                    </div>
                  </div>

                  {/* Inline picker */}
                  {isOpen && (
                    <div style={{ padding:'10px 0 10px 8px', background:'#f0f4fb', borderTop:'1px dashed #c5d0e8', marginBottom:2 }}>
                      <div style={{ fontSize:12, fontWeight:'bold', color:'#1a3a6b', marginBottom:5 }}>
                        📋 {poll.name} #{poll.num} — Επιλογή καταμετρητή
                      </div>
                      {eligible.length === 0 ? (
                        <div style={{ fontSize:12, color:'#888' }}>
                          Δεν υπάρχουν διαθέσιμοι καταμετρητές.<br/>
                          <small>Πρόσθεσε άτομα με ✓ Καταμέτρηση από το κουμπί 👥.</small>
                        </div>
                      ) : (
                        eligible.map(p => (
                          <button
                            key={p.idx}
                            onClick={() => onAssignMatch(poll.num, center.aa, p)}
                            style={{
                              display:'flex', alignItems:'center', gap:8, padding:'6px 10px',
                              background: p.proedrevon ? '#fffbea' : 'white',
                              border: `1px solid ${p.proedrevon ? '#f0c040' : '#c0cfea'}`,
                              borderRadius:6, cursor:'pointer', textAlign:'left', width:'100%',
                              marginBottom:4, transition:'all .1s',
                            }}
                          >
                            {p.proedrevon && <span style={{ fontSize:14 }}>👑</span>}
                            <span style={{ fontWeight:'bold', fontSize:12, flex:1 }}>{p.name} {p.surname}</span>
                            {p.phone && <span style={{ fontSize:11, color:'#888' }}>{p.phone}</span>}
                            {p.ageGroup && <span style={{ fontSize:10, background:'#ede9fe', color:'#5b21b6', padding:'1px 5px', borderRadius:8 }}>{p.ageGroup}</span>}
                            {p.proedrevon && <span style={{ fontSize:10, fontWeight:'bold', background:'#fef08a', color:'#854d0e', borderRadius:8, padding:'1px 6px', border:'1px solid #f0c040' }}>Προεδρεύον</span>}
                          </button>
                        ))
                      )}
                      <button
                        onClick={() => setOpenPicker(null)}
                        style={{ padding:'4px 12px', background:'white', border:'1px solid #ccc', borderRadius:6, fontSize:11, cursor:'pointer', color:'#666', marginTop:2 }}
                      >Ακύρωση</button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </td>
    </tr>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Small tag helper
// ─────────────────────────────────────────────────────────────────────────────

function Tag({ style, children }) {
  return (
    <span style={{ display:'inline-block', fontSize:10, fontWeight:'bold', padding:'1px 6px', borderRadius:10, lineHeight:1.5, ...style }}>
      {children}
    </span>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Staff side-panel modal (slides from right)
// ─────────────────────────────────────────────────────────────────────────────

function StaffModal({ aa, people, onClose }) {
  const [editIdx,  setEditIdx]  = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [form,     setForm]     = useState(EMPTY_FORM)
  const [saving,   setSaving]   = useState(false)

  const center  = ALL_CENTERS.find(c => c.aa === aa)
  const polls   = POLL_LOOKUP[aa] || []
  const pollInfo = polls.map(p => p.name + ' #' + p.num).join('  ·  ')
  const subtitle = center?.area || ''

  function openAdd() { setEditIdx(null); setForm(EMPTY_FORM); setShowForm(true) }
  function openEdit(idx) { setEditIdx(idx); setForm({ ...EMPTY_FORM, ...people[idx] }); setShowForm(true) }

  async function handleSave() {
    if (!form.name.trim() && !form.surname.trim()) return
    setSaving(true)
    try {
      const updated = editIdx === null ? [...people, form] : people.map((p, i) => i === editIdx ? form : p)
      await setDoc(doc(db, 'eklogika_staff', safeId(aa)), { aa, people: updated })
      setShowForm(false); setEditIdx(null)
    } finally { setSaving(false) }
  }

  async function handleDelete(idx) {
    if (!window.confirm('Διαγραφή ατόμου;')) return
    const updated = people.filter((_, i) => i !== idx)
    await setDoc(doc(db, 'eklogika_staff', safeId(aa)), { aa, people: updated })
  }

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.45)', zIndex:1000 }}
      />
      {/* Slide-in panel from right */}
      <div style={{
        position:'fixed', top:0, right:0, bottom:0, width:440, maxWidth:'100vw',
        background:'white', zIndex:1001, display:'flex', flexDirection:'column',
        boxShadow:'-4px 0 24px rgba(0,0,0,.18)',
        animation:'slideIn .2s ease',
      }}>
        <style>{`@keyframes slideIn { from { transform: translateX(100%) } to { transform: translateX(0) } }`}</style>

        {/* Header */}
        <div style={{ background:'#1a3a6b', color:'white', padding:'16px 20px', display:'flex', alignItems:'flex-start', gap:12 }}>
          <div style={{ flex:1 }}>
            <h2 style={{ fontSize:16, lineHeight:1.3, margin:0 }}>{center?.name || aa}</h2>
            <div style={{ fontSize:12, opacity:.7, marginTop:3 }}>
              {subtitle ? subtitle + ' · ' : ''}Α/Α: {aa}{pollInfo ? '  |  ' + pollInfo : ''}
            </div>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'white', fontSize:20, cursor:'pointer', opacity:.8, padding:'0 4px' }}>✕</button>
        </div>

        {/* Body */}
        <div style={{ flex:1, overflowY:'auto', padding:16, display:'flex', flexDirection:'column', gap:10 }}>

          {/* Person list */}
          {people.length === 0 && !showForm && (
            <div style={{ color:'#aaa', fontSize:14, textAlign:'center', padding:'20px 0' }}>
              Δεν έχουν ανατεθεί άτομα ακόμα.<br/>Πάτησε «+ Προσθήκη Ατόμου» παρακάτω.
            </div>
          )}
          {people.map((p, idx) => (
            <PersonCard key={idx} person={p} onEdit={() => openEdit(idx)} onDelete={() => handleDelete(idx)} />
          ))}

          {/* Add button */}
          {!showForm && (
            <button
              onClick={openAdd}
              style={{
                display:'flex', alignItems:'center', justifyContent:'center', gap:6,
                width:'100%', padding:10, background:'#e8edf5', color:'#1a3a6b',
                border:'2px dashed #aab8d4', borderRadius:8, fontSize:14, fontWeight:'bold', cursor:'pointer',
              }}
            >
              + Προσθήκη Ατόμου
            </button>
          )}

          {/* Add/Edit form */}
          {showForm && (
            <PersonForm
              form={form}
              setForm={setForm}
              onSave={handleSave}
              onCancel={() => { setShowForm(false); setEditIdx(null) }}
              saving={saving}
              isEdit={editIdx !== null}
            />
          )}
        </div>
      </div>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Person card (inside modal list)
// ─────────────────────────────────────────────────────────────────────────────

function PersonCard({ person, onEdit, onDelete }) {
  const pills = [
    { label:'✓ Έξω',         active: person.ekso,        activeStyle:{ borderColor:'#27ae60', color:'#1a6b3a', background:'#e8f5e9' } },
    { label:'✓ Καταμέτρηση', active: person.katametrisi,  activeStyle:{ borderColor:'#27ae60', color:'#1a6b3a', background:'#e8f5e9' } },
    { label:'✓ Όλη η μέρα',  active: person.diarkeia,     activeStyle:{ borderColor:'#27ae60', color:'#1a6b3a', background:'#e8f5e9' } },
    { label:'👑 Προεδρεύον', active: person.proedrevon,   activeStyle:{ borderColor:'#f0c040', color:'#854d0e', background:'#fef9c3' } },
  ]

  return (
    <div style={{ background:'#f9f9f9', border:'1px solid #e0e0e0', borderRadius:8, padding:'12px 14px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4 }}>
        <div style={{ fontWeight:'bold', fontSize:15 }}>
          {person.name} {person.surname}
          {person.ageGroup && (
            <span style={{ display:'inline-block', fontSize:11, fontWeight:'bold', padding:'1px 7px', borderRadius:10, background:'#ede9fe', color:'#5b21b6', verticalAlign:'middle', marginLeft:6 }}>
              {person.ageGroup}
            </span>
          )}
        </div>
        <div style={{ display:'flex', gap:4 }}>
          <button onClick={onEdit}   style={{ background:'none', border:'1px solid #ddd', borderRadius:6, padding:'2px 7px', cursor:'pointer', fontSize:13 }}>✏️</button>
          <button onClick={onDelete} style={{ background:'none', border:'1px solid #ddd', borderRadius:6, padding:'2px 7px', cursor:'pointer', fontSize:13 }}>🗑️</button>
        </div>
      </div>
      {(person.phone || person.adt) && (
        <div style={{ fontSize:13, color:'#555', marginBottom:2 }}>
          {person.phone && `📞 ${person.phone}`}
          {person.phone && person.adt && '  |  '}
          {person.adt && `🪪 ${person.adt}`}
        </div>
      )}
      {person.comments && (
        <div style={{ fontSize:12, color:'#888', marginBottom:6, fontStyle:'italic' }}>💬 {person.comments}</div>
      )}
      <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginTop:8 }}>
        {pills.map(pill => (
          <span key={pill.label} style={{
            display:'inline-block', padding:'3px 10px', borderRadius:20, fontSize:12,
            border:'1px solid', borderColor: pill.active ? undefined : '#ddd',
            color: pill.active ? undefined : '#bbb',
            background: pill.active ? undefined : '#fafafa',
            fontWeight: pill.active ? 'bold' : 'normal',
            ...(pill.active ? pill.activeStyle : {}),
          }}>
            {pill.label}
          </span>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Person add/edit form
// ─────────────────────────────────────────────────────────────────────────────

function PersonForm({ form, setForm, onSave, onCancel, saving, isEdit }) {
  const set = (f, v) => setForm(p => ({ ...p, [f]: v }))
  const inp = { padding:'7px 10px', border:'1px solid #ccc', borderRadius:6, fontSize:14, fontFamily:'Arial,sans-serif', width:'100%', boxSizing:'border-box' }

  const checks = [
    { field:'ekso',        label:'Έξω (παρατηρητής)',    crown:false },
    { field:'katametrisi', label:'Καταμέτρηση',           crown:false },
    { field:'diarkeia',    label:'Όλη η μέρα',            crown:false },
    { field:'proedrevon',  label:'👑 Προεδρεύον',         crown:true  },
  ]

  return (
    <div style={{ background:'#f0f4fb', border:'1px solid #c0cfea', borderRadius:8, padding:14, display:'flex', flexDirection:'column', gap:10 }}>
      <div style={{ fontWeight:'bold', fontSize:14, color:'#1a3a6b' }}>{isEdit ? 'Επεξεργασία Ατόμου' : 'Νέο Άτομο'}</div>

      <div style={{ display:'flex', gap:8 }}>
        <div style={{ flex:1 }}>
          <label style={{ fontSize:12, color:'#555', fontWeight:'bold', display:'block', marginBottom:4 }}>Όνομα</label>
          <input style={inp} value={form.name} onChange={e => set('name', e.target.value)} placeholder="π.χ. Γιώργος" autoComplete="off" />
        </div>
        <div style={{ flex:1 }}>
          <label style={{ fontSize:12, color:'#555', fontWeight:'bold', display:'block', marginBottom:4 }}>Επίθετο</label>
          <input style={inp} value={form.surname} onChange={e => set('surname', e.target.value)} placeholder="π.χ. Παπαδόπουλος" autoComplete="off" />
        </div>
      </div>

      <div>
        <label style={{ fontSize:12, color:'#555', fontWeight:'bold', display:'block', marginBottom:4 }}>Τηλέφωνο</label>
        <input style={inp} value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="π.χ. 99 123456" />
      </div>

      <div>
        <label style={{ fontSize:12, color:'#555', fontWeight:'bold', display:'block', marginBottom:4 }}>ΑΔΤ</label>
        <input style={inp} value={form.adt} onChange={e => set('adt', e.target.value)} placeholder="π.χ. Α 123456" />
      </div>

      <div>
        <label style={{ fontSize:12, color:'#555', fontWeight:'bold', display:'block', marginBottom:4 }}>Σχόλια</label>
        <textarea style={{ ...inp, resize:'vertical', minHeight:60 }} value={form.comments} onChange={e => set('comments', e.target.value)} placeholder="π.χ. Αρχηγός κλιμακίου..." />
      </div>

      {/* Age group */}
      <div>
        <label style={{ fontSize:12, color:'#555', fontWeight:'bold', display:'block', marginBottom:6 }}>Ηλικιακή Ομάδα</label>
        <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
          {['20-40', '40-65', '65+'].map(ag => (
            <label key={ag} style={{
              display:'flex', alignItems:'center', gap:5, fontSize:13,
              padding:'5px 12px', border:`1px solid ${form.ageGroup === ag ? '#27ae60' : '#ccc'}`,
              borderRadius:20, cursor:'pointer',
              background: form.ageGroup === ag ? '#e8f5e9' : 'white',
              color: form.ageGroup === ag ? '#1a6b3a' : '#333',
              fontWeight: form.ageGroup === ag ? 'bold' : 'normal',
            }}>
              <input type="radio" name="agGroup" value={ag} checked={form.ageGroup === ag} onChange={() => set('ageGroup', ag)} style={{ accentColor:'#27ae60' }} />
              {ag}
            </label>
          ))}
          <label style={{ display:'flex', alignItems:'center', gap:5, fontSize:13, padding:'5px 12px', border:'1px solid #ccc', borderRadius:20, cursor:'pointer', background: form.ageGroup === '' ? '#f5f5f5' : 'white' }}>
            <input type="radio" name="agGroup" value="" checked={form.ageGroup === ''} onChange={() => set('ageGroup', '')} style={{ accentColor:'#27ae60' }} />
            Χωρίς
          </label>
        </div>
      </div>

      {/* Checkboxes */}
      <div>
        <label style={{ fontSize:12, color:'#555', fontWeight:'bold', display:'block', marginBottom:6 }}>Παρουσία</label>
        <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
          {checks.map(({ field, label, crown }) => (
            <label key={field} style={{
              display:'flex', alignItems:'center', gap:5, fontSize:13,
              padding:'5px 12px', cursor:'pointer', userSelect:'none',
              border:`1px solid ${form[field] ? (crown ? '#f0c040' : '#27ae60') : '#ccc'}`,
              borderRadius:20,
              background: form[field] ? (crown ? '#fef9c3' : '#e8f5e9') : 'white',
              color: form[field] ? (crown ? '#854d0e' : '#1a6b3a') : '#333',
              fontWeight: form[field] ? 'bold' : 'normal',
            }}>
              <input type="checkbox" checked={form[field]} onChange={e => set(field, e.target.checked)} style={{ accentColor: crown ? '#f0c040' : '#27ae60', width:14, height:14 }} />
              {label}
            </label>
          ))}
        </div>
      </div>

      <div style={{ display:'flex', gap:8, justifyContent:'flex-end', marginTop:4 }}>
        <button onClick={onCancel} disabled={saving} style={{ padding:'8px 16px', background:'white', color:'#555', border:'1px solid #ccc', borderRadius:6, fontSize:14, cursor:'pointer' }}>
          Ακύρωση
        </button>
        <button
          onClick={onSave}
          disabled={saving || (!form.name.trim() && !form.surname.trim())}
          style={{ padding:'8px 20px', background:'#1a3a6b', color:'white', border:'none', borderRadius:6, fontSize:14, fontWeight:'bold', cursor:'pointer', opacity: saving ? .6 : 1 }}
        >
          {saving ? 'Αποθήκευση…' : '✔ Αποθήκευση'}
        </button>
      </div>
    </div>
  )
}
