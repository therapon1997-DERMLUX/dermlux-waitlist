// ── District mapping ──────────────────────────────────────────────────────────
export const CITY_TO_DISTRICT = {
  // Λευκωσία
  'Nicosia': 'Λευκωσία', 'nicosia': 'Λευκωσία', 'NICOSIA': 'Λευκωσία',
  'nicosia cyprus': 'Λευκωσία', 'center nicosia': 'Λευκωσία',
  'DermLux Nicosia': 'Λευκωσία',
  'Λευκωσία': 'Λευκωσία', 'λευκωσια': 'Λευκωσία',
  'Strovolos': 'Λευκωσία', 'Agios Dometios': 'Λευκωσία',
  'Dali': 'Λευκωσία', 'Lythrodontas': 'Λευκωσία', 'pendacomo': 'Λευκωσία',

  // Λεμεσός
  'Limassol': 'Λεμεσός', 'limassol': 'Λεμεσός',
  'Gold': 'Λεμεσός',
  'DermLux Limassol Gold': 'Λεμεσός', 'DermLux Limassol Laser': 'Λεμεσός',
  'Limassol Gold': 'Λεμεσός', 'Limassol Laser': 'Λεμεσός',
  'Lemselo': 'Λεμεσός',
  'Λεμεσός': 'Λεμεσός', 'Λεμεσος': 'Λεμεσός',
  'Kato Polemidhia': 'Λεμεσός', 'Kato Polemidya': 'Λεμεσός', 'Polemidia': 'Λεμεσός',
  'pyrgos limassol': 'Λεμεσός', 'Paramytha': 'Λεμεσός', 'Pissouri': 'Λεμεσός',
  'Ipsonas': 'Λεμεσός', 'Akrotiri': 'Λεμεσός', 'Ayus Tychones': 'Λεμεσός',
  'Μέσα Γειτονιά': 'Λεμεσός',

  // Λάρνακα
  'Larnaca': 'Λάρνακα', 'larnaca': 'Λάρνακα', 'Larnaka': 'Λάρνακα',
  'Λαρνακα': 'Λάρνακα', 'Λάρνακα': 'Λάρνακα',
  'DermLux Larnaca': 'Λάρνακα',
  'Aradippou': 'Λάρνακα', 'Xylophaghou': 'Λάρνακα',
  'Μενεου': 'Λάρνακα', 'Πυλα': 'Λάρνακα', 'Pyla': 'Λάρνακα', 'Κορνος': 'Λάρνακα',

  // Πάφος
  'Paphos': 'Πάφος', 'Páfos': 'Πάφος', 'Pafos': 'Πάφος', 'Paphos, Cyprus': 'Πάφος',
  'Πάφος': 'Πάφος', 'Παφος': 'Πάφος',
  'DermLux Paphos': 'Πάφος',
  'Kissonerga': 'Πάφος', 'Kouklia': 'Πάφος', 'Polis': 'Πάφος',
  'Pegeia': 'Πάφος', 'Peyia': 'Πάφος', 'Mesa Chorio': 'Πάφος',
  'Tala': 'Πάφος', 'Empa': 'Πάφος', 'Χλωρακας': 'Πάφος', 'Lyso': 'Πάφος',

  // Αμμόχωστος (free area)
  'Paralimni': 'Αμμόχωστος', 'Αμμωχοστος': 'Αμμόχωστος',

  // Κατεχόμενα
  'Lefkosa': 'Κατεχόμενα', 'Lefkoşa': 'Κατεχόμενα',
  'Gönyeli': 'Κατεχόμενα', 'Hamitköy': 'Κατεχόμενα',
  'Kyrenia': 'Κατεχόμενα', 'Lapithos': 'Κατεχόμενα', 'Akanthou': 'Κατεχόμενα',
  'Omorfo': 'Κατεχόμενα', 'Lefke': 'Κατεχόμενα',
  'Famagusta': 'Κατεχόμενα', 'Famagusta Walled City': 'Κατεχόμενα',
  'Gazimagusa': 'Κατεχόμενα',
  'Kibris': 'Κατεχόμενα',
}

export function getDistrict(city) {
  if (!city) return null
  return CITY_TO_DISTRICT[city.trim()] || 'Άλλο'
}

export function formatSpend(val) {
  const n = parseFloat(val)
  if (!n || isNaN(n)) return null
  return '€' + n.toLocaleString('el-GR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })
}

// ── Auto-computed tags from contact fields ─────────────────────────────────────
export function computeTags(contact) {
  const tags = []

  // Spend tier
  const spend = parseFloat(contact.totalSpend) || 0
  if (spend >= 2000)      tags.push({ key: 'vip',       label: '💎 VIP',          cls: 'bg-yellow-50 text-yellow-800 border-yellow-300' })
  else if (spend >= 500)  tags.push({ key: 'highval',   label: '⭐ High Value',    cls: 'bg-amber-50 text-amber-800 border-amber-300' })
  else if (spend >= 100)  tags.push({ key: 'medval',    label: '💶 Αγοράζει',      cls: 'bg-green-50 text-green-700 border-green-300' })
  else if (spend > 0)     tags.push({ key: 'lowval',    label: '💵 Μικρό ποσό',   cls: 'bg-gray-50 text-gray-600 border-gray-300' })

  // Loyalty / appointment count
  const appts = parseInt(contact.appointmentCount) || 0
  if (appts >= 10)        tags.push({ key: 'loyal',     label: '🏆 Loyal',         cls: 'bg-purple-50 text-purple-700 border-purple-300' })
  else if (appts >= 4)    tags.push({ key: 'regular',   label: '✅ Regular',       cls: 'bg-blue-50 text-blue-700 border-blue-300' })
  else if (appts === 1)   tags.push({ key: 'new',       label: '🆕 Νέος/α',        cls: 'bg-sky-50 text-sky-700 border-sky-300' })

  // Treatment categories
  const cats = Array.isArray(contact.treatmentCategories) ? contact.treatmentCategories : []
  if (cats.includes('injectables')) tags.push({ key: 'inj',  label: '💉 Injectables', cls: 'bg-pink-50 text-pink-700 border-pink-300' })
  if (cats.includes('laser'))       tags.push({ key: 'las',  label: '⚡ Laser',        cls: 'bg-orange-50 text-orange-700 border-orange-300' })
  if (cats.includes('facial'))      tags.push({ key: 'fac',  label: '✨ Facial',       cls: 'bg-teal-50 text-teal-700 border-teal-300' })
  if (cats.includes('body'))        tags.push({ key: 'body', label: '🏃 Body',          cls: 'bg-lime-50 text-lime-700 border-lime-300' })

  // Language
  if (contact.language === 'English') tags.push({ key: 'en', label: '🇬🇧 English', cls: 'bg-blue-50 text-blue-600 border-blue-200' })
  if (contact.language === 'Russian') tags.push({ key: 'ru', label: '🇷🇺 Russian', cls: 'bg-red-50 text-red-600 border-red-200' })

  // District
  const district = getDistrict(contact.city)
  if (district && district !== 'Άλλο') {
    tags.push({ key: 'district', label: '📍 ' + district, cls: 'bg-gray-50 text-gray-600 border-gray-200' })
  } else if (district === 'Άλλο') {
    tags.push({ key: 'district', label: '🌍 Εξωτερικό', cls: 'bg-gray-50 text-gray-500 border-gray-200' })
  }

  return tags
}

// Ordered list of districts for filter UI
export const DISTRICTS = [
  { id: 'Λευκωσία',   color: 'blue'   },
  { id: 'Λεμεσός',    color: 'blue'   },
  { id: 'Λάρνακα',    color: 'blue'   },
  { id: 'Πάφος',      color: 'blue'   },
  { id: 'Αμμόχωστος', color: 'blue'   },
  { id: 'Κατεχόμενα', color: 'orange' },
  { id: 'Άλλο',       color: 'purple' },
]
