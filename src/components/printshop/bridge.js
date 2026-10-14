// Γέφυρα Ερμογένη ↔ σελίδες: τι βλέπει ο χρήστης (context), άνοιγμα προβολής, καλάθι, πλοήγηση.
const listeners = new Map()
let context = { page: '', tab: '', period: '', query: '', extra: '' }

export function setHermesContext(patch) { context = { ...context, ...patch } }
export function getHermesContext() { return context }

export function on(evt, fn) {
  if (!listeners.has(evt)) listeners.set(evt, new Set())
  listeners.get(evt).add(fn)
  return () => listeners.get(evt)?.delete(fn)
}
export function emit(evt, payload) { listeners.get(evt)?.forEach(fn => { try { fn(payload) } catch (e) { console.error(e) } }) }

// ---------- καλάθι (ανά χρήστη, μένει στον browser) ----------
const BKEY = 'printshop_basket_v1'
export function getBasket() { try { return JSON.parse(localStorage.getItem(BKEY) || '[]') } catch { return [] } }
export function setBasket(ids) {
  const uniq = [...new Set(ids)]
  try { localStorage.setItem(BKEY, JSON.stringify(uniq)) } catch {}
  emit('basket', uniq)
  return uniq
}
export function addToBasket(ids) { return setBasket([...getBasket(), ...ids]) }
export function removeFromBasket(ids) { const rm = new Set(ids); return setBasket(getBasket().filter(i => !rm.has(i))) }
