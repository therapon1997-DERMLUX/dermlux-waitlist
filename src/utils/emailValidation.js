// Disposable/fake email domains to flag
const FAKE_DOMAINS = new Set([
  'mailinator.com','guerrillamail.com','tempmail.com','throwam.com',
  'yopmail.com','sharklasers.com','guerrillamailblock.com','grr.la',
  'guerrillamail.info','trashmail.com','dispostable.com','spamgourmet.com',
  'trashmail.at','trashmail.io','spamfree24.org','getairmail.com',
  'fakeinbox.com','mailnull.com','spamex.com','spamhole.com',
  'spam4.me','tempr.email','tmails.net','discard.email',
  'getnada.com','spamgourmet.net','maildrop.cc','eyepaste.com',
])

const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/

export function isValidEmail(email) {
  if (!email || typeof email !== 'string') return false
  return EMAIL_REGEX.test(email.trim())
}

export function isFakeEmail(email) {
  if (!email) return false
  const domain = email.toLowerCase().split('@')[1] || ''
  if (FAKE_DOMAINS.has(domain)) return true
  // Flag obviously fake patterns
  if (/^(test|noreply|no-reply|donotreply|admin|info)@/i.test(email)) return true
  return false
}

export function normalizeEmail(email) {
  return (email || '').toLowerCase().trim()
}

// Produces a Firestore-safe doc ID from an email (base64url, no special chars)
export function contactDocId(email) {
  const normalized = normalizeEmail(email)
  // btoa in browser only handles latin1 — emails are always ASCII so this is fine
  return btoa(normalized)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

export function statusLabel(status) {
  switch (status) {
    case 'active':       return 'Ενεργός'
    case 'unsubscribed': return 'Opt-out'
    case 'bounced':      return 'Bounce'
    case 'invalid':      return 'Άκυρο'
    default:             return status || '—'
  }
}

export function statusColor(status) {
  switch (status) {
    case 'active':       return 'bg-green-100 text-green-700'
    case 'unsubscribed': return 'bg-gray-100 text-gray-500'
    case 'bounced':      return 'bg-red-100 text-red-600'
    case 'invalid':      return 'bg-orange-100 text-orange-600'
    default:             return 'bg-gray-100 text-gray-500'
  }
}
