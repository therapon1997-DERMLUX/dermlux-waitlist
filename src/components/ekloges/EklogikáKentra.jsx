import { useEffect, useState, useMemo } from 'react'
import { collection, doc, onSnapshot, setDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

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
    id: 't1', color: '#c0392b', label: '🔴 ΚΡΙΣΙΜΑ — Πάνω από 1.500 ψηφοφόροι', staffTip: '👥 Χρειάζονται 4+ άτομα',
    centers: [
      {rank:1, name:'9ο ΔΗΜ. ΣΧΟΛΕΙΟ ΚΟΥΠΑΤΕΙΟ', area:'Κάτω Πάφος', boxes:5, voters:2820, aa:'004-007'},
      {rank:2, name:'ΔΗΜ. ΣΧΟΛΕΙΟ ΕΜΠΑΣ', area:'Έμπα', boxes:4, voters:2505, aa:'069-072'},
      {rank:3, name:'Α ΔΗΜ. ΣΧΟΛΕΙΟ ΓΕΡΟΣΚΗΠΟΥ', area:'Γεροσκήπου', boxes:4, voters:2397, aa:'037-040'},
      {rank:4, name:'ΔΗΜ. ΣΧΟΛΕΙΟ ΑΓ. ΣΤΕΦΑΝΟΥ ΛΕΜΠΑΣ', area:'Λέμπα', boxes:5, voters:2300, aa:'094'},
      {rank:5, name:'Γ ΔΗΜ. ΣΧΟΛΕΙΟ ΠΑΦΟΥ', area:'Πάφος', boxes:4, voters:2159, aa:'016-019'},
      {rank:6, name:'ΔΗΜ. ΣΧΟΛΕΙΟ ΠΕΓΕΙΑΣ', area:'Πέγεια', boxes:3, voters:1917, aa:'046-048'},
      {rank:7, name:'Β ΔΗΜ. ΣΧΟΛΕΙΟ ΓΕΡΟΣΚΗΠΟΥ', area:'Γεροσκήπου', boxes:3, voters:1869, aa:'041-043'},
      {rank:8, name:'Β ΔΗΜ. ΣΧΟΛΕΙΟ ΠΑΦΟΥ', area:'Πάφος', boxes:3, voters:1712, aa:'010-012'},
      {rank:9, name:'Δ ΔΗΜ. ΣΧΟΛΕΙΟ ΠΑΦΟΥ', area:'Πάφος', boxes:3, voters:1670, aa:'008-009'},
    ]
  },
  {
    id: 't2', color: '#e67e22', label: '🟠 ΥΨΗΛΗ ΠΡΟΤΕΡΑΙΟΤΗΤΑ — 750 – 1.500 ψηφοφόροι', staffTip: '👥 2–3 άτομα',
    centers: [
      {rank:10, name:'ΣΤ ΔΗΜ. ΣΧΟΛΕΙΟ ΚΑΤΩ ΠΑΦΟΥ', area:'Κάτω Πάφος', boxes:3, voters:1438, aa:'025-026'},
      {rank:11, name:'ΔΗΜ. ΣΧΟΛΕΙΟ ΑΝΑΒΑΡΓΟΥ', area:'Ανάβαργος', boxes:2, voters:1222, aa:'031-032'},
      {rank:12, name:'ΓΥΜΝΑΣΙΟ ΑΠΟΣΤΟΛΟΥ ΠΑΥΛΟΥ', area:'Πάφος', boxes:2, voters:1174, aa:'023-024'},
      {rank:13, name:'ΓΥΜΝΑΣΙΟ ΠΟΛΕΩΣ ΧΡΥΣΟΧΟΥΣ', area:'Πόλις Χρυσοχούς', boxes:2, voters:1102, aa:'033-034'},
      {rank:14, name:'ΔΗΜ. ΣΧΟΛΕΙΟ ΚΙΣΣΟΝΕΡΓΑΣ', area:'Κισσόνεργα', boxes:2, voters:1077, aa:'083-084'},
      {rank:15, name:'ΔΗΜ. ΣΧΟΛΕΙΟ ΚΟΝΙΩΝ', area:'Κόνια', boxes:2, voters:1062, aa:'086-087'},
      {rank:16, name:'ΛΥΚΕΙΟ ΚΥΚΚΟΥ ΠΑΦΟΥ', area:'Πάφος', boxes:2, voters:1029, aa:'003, 021'},
      {rank:17, name:'ΔΗΜ. ΣΧΟΛΕΙΟ ΜΕΣΟΓΗΣ', area:'Μεσόγη', boxes:2, voters:929, aa:'101-102'},
      {rank:18, name:'ΔΗΜ. ΣΧΟΛΕΙΟ ΤΑΛΑΣ', area:'Τάλα', boxes:2, voters:918, aa:'121-122'},
    ]
  },
  {
    id: 't3', color: '#c9a800', label: '🟡 ΜΕΣΑΙΑ ΠΡΟΤΕΡΑΙΟΤΗΤΑ — 200 – 750 ψηφοφόροι', staffTip: '👤 1–2 άτομα',
    centers: [
      {rank:19, name:'ΔΗΜ. ΣΧΟΛΕΙΟ ΑΡΓΑΚΑΣ', area:'Αργάκα', boxes:2, voters:714, aa:'058'},
      {rank:20, name:'ΠΕΡΙΦ. ΔΗΜ. ΣΧΟΛΕΙΟ ΠΟΛΕΜΙΟΥ', area:'Πολέμι', boxes:1, voters:638, aa:'112'},
      {rank:21, name:'ΠΕΡ. ΔΗΜ. ΣΧΟΛ. ΑΓ. ΜΑΡΙΝΑΣ ΧΡΥΣΟΧΟΥΣ', area:'Αγία Μαρίνα Χρυσοχούς', boxes:1, voters:595, aa:'050-051'},
      {rank:22, name:'ΠΕΡΙΦ. ΔΗΜ. ΣΧΟΛΕΙΟ ΓΙΟΛΟΥ', area:'Γιόλου', boxes:1, voters:595, aa:'064'},
      {rank:23, name:'Ζ ΔΗΜ. ΣΧΟΛΕΙΟ ΠΑΦΟΥ', area:'Πάφος', boxes:1, voters:565, aa:'001-002'},
      {rank:24, name:'ΠΕΡΙΦ. ΔΗΜ. ΣΧΟΛΕΙΟ ΤΣΑΔΑΣ', area:'Τσάδα', boxes:1, voters:560, aa:'127'},
      {rank:25, name:'10ο ΔΗΜ. ΣΧΟΛΕΙΟ ΠΑΦΟΥ', area:'Πάφος', boxes:1, voters:543, aa:'020'},
      {rank:26, name:'Α ΔΗΜ. ΣΧΟΛΕΙΟ ΠΑΦΟΥ', area:'Πάφος', boxes:1, voters:541, aa:'013'},
      {rank:27, name:'Ε ΔΗΜ. ΣΧΟΛΕΙΟ ΠΑΦΟΥ', area:'Πάφος', boxes:1, voters:535, aa:'027'},
      {rank:28, name:'ΔΗΜ. ΣΧΟΛΕΙΟ ΚΟΥΚΛΙΩΝ', area:'Κούκλια', boxes:1, voters:527, aa:'088'},
      {rank:29, name:'ΚΟΙΝΟΤΙΚΟ ΚΤΙΡΙΟ ΤΡΕΜΙΘΟΥΣΑΣ', area:'Τρεμιθούσα', boxes:1, voters:463, aa:'126'},
      {rank:30, name:'ΔΗΜ. ΣΧΟΛΕΙΟ ΤΙΜΗΣ', area:'Τίμη', boxes:1, voters:460, aa:'123'},
      {rank:31, name:'ΚΟΙΝΟΤΙΚΑ ΚΤΙΡΙΑ ΝΕΟΥ ΧΩΡΙΟΥ', area:'Νέο Χωριό', boxes:1, voters:419, aa:'106'},
      {rank:32, name:'ΚΟΙΝΟΤΙΚΑ ΚΤΙΡΙΑ ΠΑΝΑΓΙΑΣ', area:'Παναγιά', boxes:1, voters:419, aa:'108'},
      {rank:33, name:'ΚΟΙΝΟΤΙΚΟ ΚΤΙΡΙΟ ΣΤΡΟΥΜΠΙΟΥ', area:'Στρούμπι', boxes:1, voters:407, aa:'120'},
      {rank:34, name:'ΓΡΑΦΕΙΑ ΚΟΙΝ. ΣΥΜΒ. ΠΩΜΟΥ', area:'Πώμος', boxes:1, voters:371, aa:'114'},
      {rank:35, name:'ΚΟΙΝΟΤΙΚΟ ΝΗΠΙΑΓΩΓΕΙΟ ΠΡΟΔΡΟΜΙΟΥ', area:'Προδρόμι', boxes:1, voters:345, aa:'036'},
      {rank:36, name:'ΚΟΙΝΟΤΙΚΟ ΚΤΙΡΙΟ ΑΝΑΡΙΤΑΣ', area:'Αναρίτα', boxes:1, voters:343, aa:'057'},
      {rank:37, name:'ΔΗΜ. ΣΧΟΛΕΙΟ ΔΡΟΥΣΕΙΑΣ', area:'Δρούσεια', boxes:1, voters:330, aa:'066'},
      {rank:38, name:'ΑΙΘΟΥΣΑ ΠΟΛΛ. ΧΡΗΣΗΣ ΑΜΑΡΓΕΤΗΣ', area:'Αμαργέτη', boxes:1, voters:325, aa:'056'},
      {rank:39, name:'ΔΗΜ. ΣΧΟΛΕΙΟ ΙΝΕΙΑΣ', area:'Ινεια', boxes:1, voters:308, aa:'075'},
      {rank:40, name:'ΔΗΜ. ΣΧΟΛΕΙΟ ΑΡΜΟΥΣ', area:'Άρμου', boxes:1, voters:292, aa:'059'},
      {rank:41, name:'ΚΟΙΝΟΤΙΚΟ ΚΤΙΡΙΟ ΜΕΣΑ ΧΩΡΙΟΥ', area:'Μέσα Χωριό', boxes:1, voters:285, aa:'099'},
      {rank:42, name:'ΚΟΙΝΟΤΙΚΟ ΚΤΙΡΙΟ ΑΓΙΑΣ ΜΑΡΙΝΟΥΔΑΣ', area:'Αγία Μαρινούδα', boxes:1, voters:252, aa:'052'},
      {rank:43, name:'ΚΟΙΝΟΤΙΚΟ ΚΤΙΡΙΟ ΚΑΘΗΚΑ', area:'Καθήκας', boxes:1, voters:248, aa:'076'},
      {rank:44, name:'ΠΟΛΙΤΙΣΤΙΚΟ ΚΕΝΤΡΟ ΣΑΛΑΜΙΟΥΣ', area:'Σαλαμιού', boxes:1, voters:248, aa:'115'},
      {rank:45, name:'ΚΟΙΝΟΤΙΚΟ ΚΤΙΡΙΟ ΑΧΕΛΕΙΑΣ', area:'Αχελειά', boxes:1, voters:233, aa:'062'},
      {rank:46, name:'ΚΟΙΝΟΤΙΚΑ ΚΤΙΡΙΑ ΣΤΑΤΟΥ - ΑΓ. ΦΩΤΙΟΥ', area:'Στατός - Αγ. Φώτιος', boxes:1, voters:233, aa:'118'},
      {rank:47, name:'ΚΟΙΝΟΤΙΚΟ ΚΤΙΡΙΟ ΚΟΙΛΗΣ', area:'Κοίλη', boxes:1, voters:232, aa:'085'},
      {rank:48, name:'ΚΟΙΝΟΤΙΚΟ ΚΤΙΡΙΟ ΜΑΡΑΘΟΥΝΤΑΣ', area:'Μαραθούντα', boxes:1, voters:228, aa:'098'},
      {rank:49, name:'ΔΗΜ. ΣΧΟΛΕΙΟ ΧΟΛΕΤΡΙΩΝ', area:'Χολέτρια', boxes:1, voters:223, aa:'133'},
      {rank:50, name:'ΚΟΙΝΟΤΙΚΑ ΚΤΙΡΙΑ ΠΕΡΙΣΤΕΡΩΝΑΣ', area:'Περιστερώνα', boxes:1, voters:213, aa:'111'},
      {rank:51, name:'ΚΟΙΝΟΤΙΚΑ ΚΤΙΡΙΑ ΛΕΤΥΜΠΟΥΣ', area:'Λέτυμπος', boxes:1, voters:211, aa:'095'},
      {rank:52, name:'ΓΡΑΦΕΙΟ ΚΟΙΝ. ΣΥΜΒ. ΣΙΜΟΥΣ', area:'Σιμού', boxes:1, voters:203, aa:'116'},
      {rank:53, name:'ΓΡ. ΚΟΙΝ. ΣΥΜΒ. ΚΑΝΝΑΒΙΟΥΣ', area:'Κανναβιού', boxes:1, voters:200, aa:'078'},
    ]
  },
  {
    id: 't4', color: '#27ae60', label: '🟢 ΧΑΜΗΛΗ ΠΡΟΤΕΡΑΙΟΤΗΤΑ — Κάτω από 200 ψηφοφόροι', staffTip: '👤 1 άτομο αρκεί',
    centers: [
      {rank:54, name:'ΚΟΙΝΟΤΙΚΑ ΚΤΙΡΙΑ ΓΑΛΑΤΑΡΙΑΣ', area:'Γαλατάρια', boxes:1, voters:195, aa:'063'},
      {rank:55, name:'ΠΟΛΙΤΙΣΤΙΚΟ ΚΕΝΤΡΟ ΧΟΥΛΟΥΣ', area:'Χούλου', boxes:1, voters:192, aa:'134'},
      {rank:56, name:'ΠΟΛΙΤΙΣΤΙΚΟ ΚΕΝΤΡΟ ΛΥΣΟΥ', area:'Λύσος', boxes:1, voters:191, aa:'096'},
      {rank:57, name:'ΠΟΛΙΤΙΣΤΙΚΟ ΚΕΝΤΡΟ ΚΑΛΛΕΠΕΙΑΣ', area:'Καλλέπεια', boxes:1, voters:189, aa:'077'},
      {rank:58, name:'ΓΡΑΦΕΙΑ ΚΟΙΝ. ΣΥΜΒ. ΚΕΛΟΚΕΔΑΡΩΝ', area:'Κελοκέδαρα', boxes:1, voters:165, aa:'081'},
      {rank:59, name:'ΚΕΝΤΡΟ ΠΕΡΙΒ. ΜΕΛΕΤΩΝ ΚΡΗΤΟΥ ΤΕΡΡΑ', area:'Κρήτου Τέρρα', boxes:1, voters:164, aa:'090'},
      {rank:60, name:'ΚΟΙΝΟΤΙΚΟ ΙΑΤΡΕΙΟ ΕΠΙΣΚΟΠΗΣ', area:'Επισκοπή', boxes:1, voters:160, aa:'073'},
      {rank:61, name:'ΚΟΙΝΟΤΙΚΑ ΚΤΙΡΙΑ ΠΕΝΤΑΛΙΑΣ', area:'Πενταλιά', boxes:1, voters:151, aa:'110'},
      {rank:62, name:'ΓΡΑΦΕΙΑ ΚΟΙΝ. ΣΥΜΒ. ΓΟΥΔΙΟΥ', area:'Γούδι', boxes:1, voters:146, aa:'065'},
      {rank:63, name:'ΓΡΑΦΕΙΑ ΚΟΙΝ. ΣΥΜΒ. ΜΕΣΑΝΩΝ', area:'Μεσάνα', boxes:1, voters:146, aa:'100'},
      {rank:64, name:'ΓΡΑΦΕΙΟ ΚΟΙΝ. ΣΥΜΒ. ΝΑΤΑΣ', area:'Νάτα', boxes:1, voters:146, aa:'105'},
      {rank:65, name:'ΚΕΝΤΡΟ ΠΛΗΡΟΦΟΡΗΣΗΣ ΓΕΩΛΟΓΙΑΣ ΑΚΑΜΑ', area:'Ακάμας', boxes:1, voters:145, aa:'152'},
      {rank:66, name:'ΚΟΙΝΟΤΙΚΟ ΚΕΝΤΡΟ ΣΤΕΝΗΣ', area:'Στενή', boxes:1, voters:142, aa:'119'},
      {rank:67, name:'ΔΗΜ. ΣΧΟΛΕΙΟ ΜΑΝΔΡΙΩΝ', area:'Μανδριά', boxes:1, voters:141, aa:'097'},
      {rank:68, name:'ΔΗΜ. ΣΧΟΛΕΙΟ ΤΡΑΧΥΠΕΔΟΥΛΑΣ', area:'Τραχυπέδουλα', boxes:1, voters:139, aa:'125'},
      {rank:69, name:'ΚΟΙΝΟΤΙΚΑ ΚΤΗΡΙΑ ΦΥΤΗΣ', area:'Φύτη', boxes:1, voters:139, aa:'128'},
      {rank:70, name:'ΓΡΑΦΕΙΑ ΚΟΙΝ. ΣΥΜΒ. ΠΡΑΙΤΩΡΙΟΥ', area:'Πραιτώρι', boxes:1, voters:138, aa:'113'},
      {rank:71, name:'ΔΗΜ. ΣΧΟΛΕΙΟ ΑΓ. ΓΕΩΡΓΙΟΥ', area:'Αγ. Γεώργιος', boxes:1, voters:132, aa:'053'},
      {rank:72, name:'ΚΟΙΝΟΤΙΚΟ ΚΤΙΡΙΟ ΔΡΥΜΟΥΣ', area:'Δρυμός', boxes:1, voters:130, aa:'067'},
      {rank:73, name:'ΚΟΙΝΟΤΙΚΟ ΚΤΙΡΙΟ ΘΕΛΕΤΡΑΣ', area:'Θέλετρα', boxes:1, voters:130, aa:'074'},
      {rank:74, name:'ΓΡΑΦΕΙΟ ΣΥΝΔ. ΑΠΟΔΗΜΩΝ ΑΣΠΡΟΓΙΑΣ', area:'Ασπρογιά', boxes:1, voters:107, aa:'061'},
      {rank:75, name:'ΚΟΙΝΟΤΙΚΟ ΚΤΙΡΙΟ ΑΓΙΟΥ ΔΗΜΗΤΡΙΑΝΟΥ', area:'Αγ. Δημητριανός', boxes:1, voters:105, aa:'054'},
      {rank:76, name:'ΓΡΑΦΕΙΟ ΚΟΙΝ. ΣΥΜΒ. ΣΚΟΥΛΛΙ', area:'Σκούλλι', boxes:1, voters:104, aa:'117'},
      {rank:77, name:'ΚΟΙΝΟΤΙΚΟ ΙΑΤΡΕΙΟ ΚΡΗΤΟΥ ΜΑΡΟΤΤΟΥ', area:'Κρήτου Μαρόττου', boxes:1, voters:103, aa:'089'},
      {rank:78, name:'ΚΟΙΝΟΤΙΚΟ ΚΤΙΡΙΟ ΑΓ. ΜΑΡΙΝΑΣ ΚΕΛ.', area:'Αγ. Μαρίνα Κελοκέδαρων', boxes:1, voters:88, aa:'049'},
      {rank:79, name:'ΚΟΙΝΟΤΙΚΟ ΙΑΤΡΕΙΟ ΛΕΜΟΝΑ', area:'Λεμονάς', boxes:1, voters:84, aa:'150'},
      {rank:80, name:'ΓΡΑΦΕΙΑ ΚΟΙΝ. ΣΥΜΒ. ΝΙΚΟΚΛΕΙΑΣ', area:'Νικόκλεια', boxes:1, voters:75, aa:'153'},
      {rank:81, name:'ΔΗΜ. ΣΧΟΛΕΙΟ ΑΡΧΙΜΑΝΔΡΙΤΑΣ', area:'Αρχιμανδρίτα', boxes:1, voters:71, aa:'060'},
      {rank:82, name:'ΔΗΜ. ΣΧΟΛΕΙΟ ΚΙΝΟΥΣΑΣ', area:'Κινούσα', boxes:1, voters:67, aa:'155'},
      {rank:83, name:'ΚΟΙΝΟΤΙΚΟ ΚΤΙΡΙΟ ΜΗΛΙΟΥΣ', area:'Μηλιού', boxes:1, voters:67, aa:'156'},
      {rank:84, name:'ΚΟΙΝΟΤΙΚΟ ΚΤΙΡΙΟ ΚΕΔΑΡΩΝ', area:'Κέδαρες', boxes:1, voters:66, aa:'158'},
      {rank:85, name:'ΚΟΙΝΟΤΙΚΟ ΚΤΙΡΙΟ ΠΑΝΩ ΑΚΟΥΡΔΑΛΕΙΑΣ', area:'Πάνω Ακουρδάλεια', boxes:1, voters:65, aa:'157'},
      {rank:86, name:'ΚΟΙΝΟΤΙΚΟ ΚΤΙΡΙΟ ΛΑΣΑΣ', area:'Λάσα', boxes:1, voters:64, aa:'154'},
    ]
  }
]

const ALL_CENTERS = TIERS.flatMap(t => t.centers)

const safeId = (aa) => aa.replace(/[^a-zA-Z0-9]/g, '_')

const EMPTY_PERSON = { name: '', surname: '', phone: '', adt: '', comments: '', ageGroup: '', ekso: false, katametrisi: false, diarkeia: false, proedrevon: false }

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function EklogikáKentra() {
  const [staffData, setStaffData] = useState({}) // { [aa]: Person[] }
  const [matches, setMatches] = useState({})     // { [pollNum]: MatchObj }

  // Modal state
  const [staffModal, setStaffModal] = useState(null)   // aa string or null
  const [matchPicker, setMatchPicker] = useState(null) // { aa, pollNum } or null

  // Real-time Firestore listeners
  useEffect(() => {
    const unsub1 = onSnapshot(collection(db, 'eklogika_staff'), (snap) => {
      const data = {}
      snap.docs.forEach(d => {
        const { aa, people } = d.data()
        if (aa) data[aa] = people || []
      })
      setStaffData(data)
    })
    const unsub2 = onSnapshot(collection(db, 'eklogika_matches'), (snap) => {
      const data = {}
      snap.docs.forEach(d => {
        data[d.id] = d.data()
      })
      setMatches(data)
    })
    return () => { unsub1(); unsub2() }
  }, [])

  // Derived stats
  const totalPeople = useMemo(() => {
    return Object.values(staffData).reduce((sum, arr) => sum + arr.length, 0)
  }, [staffData])

  const staffedCenters = useMemo(() => {
    return ALL_CENTERS.filter(c => (staffData[c.aa] || []).length > 0).length
  }, [staffData])

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Stats header */}
      <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <h1 className="text-xl font-bold text-gray-800">🗳️ Εκλογικά Κέντρα Πάφου</h1>
            <div className="flex flex-wrap gap-3 text-sm">
              <StatPill label="Κτίρια/Σημεία" value="86" />
              <StatPill label="Κάλπες" value="122" />
              <StatPill label="Ψηφοφόροι" value="47.429" />
              <StatPill label="Ημερομηνία" value="24/5" />
              <StatPill label="Στελεχωμένα" value={`${staffedCenters}/86`} highlight />
              <StatPill label="Άτομα Συνολικά" value={totalPeople} highlight />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
        {/* Coverage table */}
        <CoverageTable staffData={staffData} />

        {/* Tier sections */}
        {TIERS.map(tier => (
          <TierSection
            key={tier.id}
            tier={tier}
            staffData={staffData}
            onOpenStaff={(aa) => setStaffModal(aa)}
          />
        ))}

        {/* Matching section */}
        <MatchingSection
          staffData={staffData}
          matches={matches}
          onOpenPicker={(aa, pollNum) => setMatchPicker({ aa, pollNum })}
          onClearMatch={(pollNum) => deleteDoc(doc(db, 'eklogika_matches', String(pollNum)))}
        />
      </div>

      {/* Staff modal */}
      {staffModal && (
        <StaffModal
          aa={staffModal}
          people={staffData[staffModal] || []}
          onClose={() => setStaffModal(null)}
        />
      )}

      {/* Match picker modal */}
      {matchPicker && (
        <MatchPickerModal
          aa={matchPicker.aa}
          pollNum={matchPicker.pollNum}
          people={staffData[matchPicker.aa] || []}
          matches={matches}
          onClose={() => setMatchPicker(null)}
        />
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// StatPill
// ---------------------------------------------------------------------------

function StatPill({ label, value, highlight }) {
  return (
    <div className={`px-3 py-1.5 rounded-full text-xs font-medium ${highlight ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'}`}>
      <span className="opacity-70">{label}: </span>
      <span className="font-bold">{value}</span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Coverage table
// ---------------------------------------------------------------------------

function CoverageTable({ staffData }) {
  const totalVoters = ALL_CENTERS.reduce((s, c) => s + c.voters, 0)

  const rows = TIERS.map(tier => {
    const centers = tier.centers
    const tierBoxes = centers.reduce((s, c) => s + c.boxes, 0)
    const tierVoters = centers.reduce((s, c) => s + c.voters, 0)
    const staffedCount = centers.filter(c => (staffData[c.aa] || []).length > 0).length
    const katametrisiCount = centers.reduce((s, c) => {
      return s + (staffData[c.aa] || []).filter(p => p.katametrisi).length
    }, 0)
    const coverage = tierBoxes > 0 ? katametrisiCount / tierBoxes : 0
    return { tier, centers: centers.length, boxes: tierBoxes, voters: tierVoters, pct: (tierVoters / totalVoters * 100).toFixed(1), staffedCount, katametrisiCount, coverage }
  })

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <h2 className="font-semibold text-gray-800 mb-4">Κάλυψη ανά Κατηγορία</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 text-xs border-b">
              <th className="text-left pb-2">Κατηγορία</th>
              <th className="text-right pb-2">Κέντρα</th>
              <th className="text-right pb-2">Κάλπες</th>
              <th className="text-right pb-2">Ψηφοφόροι</th>
              <th className="text-right pb-2">% Συνόλου</th>
              <th className="text-right pb-2">Στελεχ.</th>
              <th className="text-right pb-2">Καταμέτρηση</th>
              <th className="text-left pb-2 pl-4">Κάλυψη</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map(r => (
              <tr key={r.tier.id}>
                <td className="py-2">
                  <span className="inline-block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: r.tier.color }} />
                  <span className="font-medium text-gray-700">{r.tier.label.split('—')[0].trim()}</span>
                </td>
                <td className="py-2 text-right text-gray-600">{r.centers}</td>
                <td className="py-2 text-right text-gray-600">{r.boxes}</td>
                <td className="py-2 text-right text-gray-600">{r.voters.toLocaleString('el-GR')}</td>
                <td className="py-2 text-right text-gray-600">{r.pct}%</td>
                <td className="py-2 text-right text-gray-600">{r.staffedCount}/{r.centers}</td>
                <td className="py-2 text-right text-gray-600">{r.katametrisiCount}/{r.boxes}</td>
                <td className="py-2 pl-4">
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full"
                        style={{ width: `${Math.min(r.coverage * 100, 100)}%`, backgroundColor: r.tier.color }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">{Math.round(r.coverage * 100)}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// TierSection
// ---------------------------------------------------------------------------

function TierSection({ tier, staffData, onOpenStaff }) {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="px-5 py-3 text-white font-semibold flex items-center justify-between" style={{ backgroundColor: tier.color }}>
        <span>{tier.label}</span>
        <span className="text-sm font-normal opacity-90">{tier.staffTip}</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 text-xs border-b bg-gray-50">
              <th className="text-left px-4 py-2">#</th>
              <th className="text-left px-4 py-2">Κέντρο</th>
              <th className="text-left px-4 py-2">Περιοχή</th>
              <th className="text-right px-4 py-2">Κάλπες</th>
              <th className="text-right px-4 py-2">Ψηφοφόροι</th>
              <th className="text-right px-4 py-2">ΑΑ</th>
              <th className="text-right px-4 py-2">Προσωπικό</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {tier.centers.map(center => {
              const people = staffData[center.aa] || []
              return (
                <tr key={center.rank} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2.5 text-gray-400 font-mono text-xs">{center.rank}</td>
                  <td className="px-4 py-2.5 font-medium text-gray-800">{center.name}</td>
                  <td className="px-4 py-2.5 text-gray-500">{center.area}</td>
                  <td className="px-4 py-2.5 text-right text-gray-600">{center.boxes}</td>
                  <td className="px-4 py-2.5 text-right text-gray-600">{center.voters.toLocaleString('el-GR')}</td>
                  <td className="px-4 py-2.5 text-right text-gray-500 font-mono text-xs">{center.aa}</td>
                  <td className="px-4 py-2.5 text-right">
                    <button
                      onClick={() => onOpenStaff(center.aa)}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors"
                      style={{
                        backgroundColor: people.length > 0 ? tier.color + '22' : '#f3f4f6',
                        color: people.length > 0 ? tier.color : '#6b7280',
                        border: `1px solid ${people.length > 0 ? tier.color + '55' : '#e5e7eb'}`
                      }}
                    >
                      👥 {people.length} άτομα
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// MatchingSection
// ---------------------------------------------------------------------------

function MatchingSection({ staffData, matches, onOpenPicker, onClearMatch }) {
  const allAAs = Object.keys(POLL_LOOKUP)

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <h2 className="font-semibold text-gray-800 mb-1">Ανάθεση Καταμετρητών / Προεδρευόντων</h2>
      <p className="text-xs text-gray-400 mb-5">Για κάθε κάλπη, επιλέξτε άτομο με καταμέτρηση ή προεδρεύον από την ομάδα ΑΑ.</p>
      <div className="space-y-6">
        {allAAs.map(aa => {
          const polls = POLL_LOOKUP[aa]
          const center = ALL_CENTERS.find(c => c.aa === aa)
          const people = staffData[aa] || []
          const eligible = people.filter(p => p.katametrisi || p.proedrevon)

          return (
            <div key={aa} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 flex items-center justify-between">
                <div>
                  <span className="font-medium text-gray-800 text-sm">{center?.name || aa}</span>
                  <span className="ml-2 text-xs text-gray-400">ΑΑ: {aa}</span>
                </div>
                <span className="text-xs text-gray-400">{eligible.length} επιλέξιμοι</span>
              </div>
              <div className="divide-y divide-gray-100">
                {polls.map(poll => {
                  const match = matches[String(poll.num)]
                  return (
                    <div key={poll.num} className="flex items-center justify-between px-4 py-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-gray-400 w-6">{poll.num}</span>
                        <span className="text-sm text-gray-600">{poll.name}</span>
                      </div>
                      <div>
                        {match ? (
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-blue-700">
                              {match.proedrevon && <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded mr-1">Πρ.</span>}
                              {match.name} {match.surname}
                            </span>
                            <button
                              onClick={() => onClearMatch(poll.num)}
                              className="text-gray-400 hover:text-red-500 transition-colors text-lg leading-none"
                              title="Καθαρισμός"
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => onOpenPicker(aa, poll.num)}
                            disabled={eligible.length === 0}
                            className="text-xs px-3 py-1 rounded-full border border-blue-300 text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            + Ανάθεση
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// StaffModal
// ---------------------------------------------------------------------------

function StaffModal({ aa, people, onClose }) {
  const [editIdx, setEditIdx] = useState(null)   // index being edited, or null for "add new"
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_PERSON)
  const [saving, setSaving] = useState(false)

  const center = ALL_CENTERS.find(c => c.aa === aa)

  function openAdd() {
    setEditIdx(null)
    setForm(EMPTY_PERSON)
    setShowForm(true)
  }

  function openEdit(idx) {
    setEditIdx(idx)
    setForm({ ...EMPTY_PERSON, ...people[idx] })
    setShowForm(true)
  }

  async function handleSave() {
    if (!form.name.trim() || !form.surname.trim()) return
    setSaving(true)
    try {
      let updatedPeople
      if (editIdx === null) {
        updatedPeople = [...people, form]
      } else {
        updatedPeople = people.map((p, i) => i === editIdx ? form : p)
      }
      await setDoc(doc(db, 'eklogika_staff', safeId(aa)), { aa, people: updatedPeople })
      setShowForm(false)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(idx) {
    if (!window.confirm('Διαγραφή ατόμου;')) return
    const updatedPeople = people.filter((_, i) => i !== idx)
    await setDoc(doc(db, 'eklogika_staff', safeId(aa)), { aa, people: updatedPeople })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="font-semibold text-gray-800">{center?.name || aa}</h2>
            <p className="text-xs text-gray-400">ΑΑ: {aa} · {people.length} άτομα</p>
          </div>
          <div className="flex items-center gap-3">
            {!showForm && (
              <button onClick={openAdd} className="btn-primary text-sm">+ Προσθήκη</button>
            )}
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
          </div>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-4 space-y-4">
          {/* Add/Edit form */}
          {showForm && (
            <PersonForm
              form={form}
              setForm={setForm}
              onSave={handleSave}
              onCancel={() => setShowForm(false)}
              saving={saving}
              isEdit={editIdx !== null}
            />
          )}

          {/* People list */}
          {people.length === 0 && !showForm ? (
            <p className="text-sm text-gray-400 text-center py-8">Δεν υπάρχουν καταχωρήσεις.</p>
          ) : (
            <div className="space-y-2">
              {people.map((p, idx) => (
                <PersonCard key={idx} person={p} onEdit={() => openEdit(idx)} onDelete={() => handleDelete(idx)} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// PersonForm
// ---------------------------------------------------------------------------

function PersonForm({ form, setForm, onSave, onCancel, saving, isEdit }) {
  const set = (field, val) => setForm(prev => ({ ...prev, [field]: val }))

  return (
    <div className="border border-blue-200 rounded-lg p-4 bg-blue-50 space-y-3">
      <h3 className="font-medium text-blue-800 text-sm">{isEdit ? 'Επεξεργασία' : 'Νέο Άτομο'}</h3>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-600 block mb-1">Όνομα *</label>
          <input className="input text-sm" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Όνομα" />
        </div>
        <div>
          <label className="text-xs text-gray-600 block mb-1">Επώνυμο *</label>
          <input className="input text-sm" value={form.surname} onChange={e => set('surname', e.target.value)} placeholder="Επώνυμο" />
        </div>
        <div>
          <label className="text-xs text-gray-600 block mb-1">Τηλέφωνο</label>
          <input className="input text-sm" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="99..." />
        </div>
        <div>
          <label className="text-xs text-gray-600 block mb-1">ΑΔΤ</label>
          <input className="input text-sm" value={form.adt} onChange={e => set('adt', e.target.value)} placeholder="ΑΔΤ" />
        </div>
        <div className="col-span-2">
          <label className="text-xs text-gray-600 block mb-1">Σχόλια</label>
          <input className="input text-sm" value={form.comments} onChange={e => set('comments', e.target.value)} placeholder="Σχόλια..." />
        </div>
      </div>

      {/* Age group */}
      <div>
        <label className="text-xs text-gray-600 block mb-1">Ηλικιακή Ομάδα</label>
        <div className="flex gap-4">
          {['20-40', '40-65', '65+'].map(ag => (
            <label key={ag} className="flex items-center gap-1.5 text-sm cursor-pointer">
              <input
                type="radio"
                name="ageGroup"
                value={ag}
                checked={form.ageGroup === ag}
                onChange={() => set('ageGroup', ag)}
                className="accent-blue-600"
              />
              {ag}
            </label>
          ))}
          <label className="flex items-center gap-1.5 text-sm cursor-pointer">
            <input
              type="radio"
              name="ageGroup"
              value=""
              checked={form.ageGroup === ''}
              onChange={() => set('ageGroup', '')}
              className="accent-blue-600"
            />
            Χωρίς
          </label>
        </div>
      </div>

      {/* Checkboxes */}
      <div className="flex flex-wrap gap-4">
        {[
          { field: 'ekso', label: 'Εξωτερικός' },
          { field: 'katametrisi', label: 'Καταμέτρηση' },
          { field: 'diarkeia', label: 'Διάρκεια' },
          { field: 'proedrevon', label: 'Προεδρεύον' },
        ].map(({ field, label }) => (
          <label key={field} className="flex items-center gap-1.5 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={form[field]}
              onChange={e => set(field, e.target.checked)}
              className="accent-blue-600"
            />
            {label}
          </label>
        ))}
      </div>

      <div className="flex gap-3 pt-1">
        <button className="btn-secondary text-sm flex-1" onClick={onCancel} disabled={saving}>Ακύρωση</button>
        <button
          className="btn-primary text-sm flex-1"
          onClick={onSave}
          disabled={saving || !form.name.trim() || !form.surname.trim()}
        >
          {saving ? 'Αποθήκευση…' : 'Αποθήκευση'}
        </button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// PersonCard
// ---------------------------------------------------------------------------

function PersonCard({ person, onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3 hover:bg-gray-50 transition-colors">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="font-medium text-gray-800 text-sm">{person.name} {person.surname}</span>
          {person.ageGroup && (
            <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{person.ageGroup}</span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {person.phone && <span className="text-xs text-gray-500">📞 {person.phone}</span>}
          {person.adt && <span className="text-xs text-gray-500">🪪 {person.adt}</span>}
          {person.ekso && <span className="text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">Εξωτερικός</span>}
          {person.katametrisi && <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Καταμέτρηση</span>}
          {person.diarkeia && <span className="text-xs bg-teal-100 text-teal-700 px-1.5 py-0.5 rounded">Διάρκεια</span>}
          {person.proedrevon && <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">Προεδρεύον</span>}
          {person.comments && <span className="text-xs text-gray-400 italic">{person.comments}</span>}
        </div>
      </div>
      <div className="flex items-center gap-2 ml-4 shrink-0">
        <button onClick={onEdit} className="text-xs text-blue-600 hover:text-blue-800 transition-colors">Επεξ.</button>
        <button onClick={onDelete} className="text-xs text-red-500 hover:text-red-700 transition-colors">Διαγρ.</button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// MatchPickerModal
// ---------------------------------------------------------------------------

function MatchPickerModal({ aa, pollNum, people, matches, onClose }) {
  const [saving, setSaving] = useState(false)

  // Find which poll numbers in this AA are already matched
  const pollsInAA = POLL_LOOKUP[aa] || []
  const takenPersonKeys = pollsInAA
    .filter(p => p.num !== pollNum && matches[String(p.num)])
    .map(p => matches[String(p.num)].personKey)

  const eligible = people
    .map((p, idx) => ({ ...p, idx }))
    .filter(p => (p.katametrisi || p.proedrevon) && !takenPersonKeys.includes(aa + '||' + p.idx))

  async function handleSelect(person) {
    setSaving(true)
    try {
      await setDoc(doc(db, 'eklogika_matches', String(pollNum)), {
        aa,
        personIdx: person.idx,
        personKey: aa + '||' + person.idx,
        name: person.name,
        surname: person.surname,
        proedrevon: !!person.proedrevon,
      })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <div>
            <h2 className="font-semibold text-gray-800">Ανάθεση — Κάλπη #{pollNum}</h2>
            <p className="text-xs text-gray-400">ΑΑ: {aa}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>
        <div className="px-6 py-4 space-y-2 max-h-[60vh] overflow-y-auto">
          {eligible.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">Δεν υπάρχουν διαθέσιμα άτομα με Καταμέτρηση ή Προεδρεύον.</p>
          ) : (
            eligible.map(person => (
              <button
                key={person.idx}
                onClick={() => handleSelect(person)}
                disabled={saving}
                className="w-full flex items-center justify-between border border-gray-200 rounded-lg px-4 py-3 hover:bg-blue-50 hover:border-blue-300 transition-colors text-left"
              >
                <div>
                  <div className="font-medium text-gray-800 text-sm">{person.name} {person.surname}</div>
                  <div className="flex gap-2 mt-0.5">
                    {person.katametrisi && <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Καταμέτρηση</span>}
                    {person.proedrevon && <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">Προεδρεύον</span>}
                    {person.phone && <span className="text-xs text-gray-400">{person.phone}</span>}
                  </div>
                </div>
                <span className="text-blue-500 text-lg">→</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
