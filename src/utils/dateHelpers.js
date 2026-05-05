import {
  startOfDay, endOfDay, startOfWeek, endOfWeek,
  isSameDay, isWithinInterval, eachDayOfInterval,
  format, isValid,
} from 'date-fns'
import { el } from 'date-fns/locale'

export function toDate(val) {
  if (!val) return null
  if (val?.toDate) return val.toDate()       // Firestore Timestamp
  if (val instanceof Date) return val
  return null
}

export function fmt(val, pattern = 'dd/MM/yyyy') {
  const d = toDate(val)
  return d && isValid(d) ? format(d, pattern, { locale: el }) : '—'
}

export function fmtDateTime(val) {
  return fmt(val, 'dd/MM/yyyy HH:mm')
}

// Returns true if the client should appear for the given day
export function isClientForDay(client, day) {
  const d = startOfDay(day)
  const dEnd = endOfDay(day)

  const prefDates = [client.preferredDate1, client.preferredDate2, client.preferredDate3]
    .map(toDate)
    .filter(Boolean)

  const matchesPref = prefDates.some(pd => isSameDay(pd, d))

  const rangeStart = toDate(client.dateRangeStart)
  const rangeEnd   = toDate(client.dateRangeEnd)
  const inRange    = rangeStart && rangeEnd &&
    isWithinInterval(d, { start: startOfDay(rangeStart), end: endOfDay(rangeEnd) })

  return matchesPref || inRange
}

// Returns true if the client should appear anywhere in the current week
export function isClientForWeek(client, weekStart) {
  const days = eachDayOfInterval({
    start: startOfWeek(weekStart, { weekStartsOn: 1 }),
    end:   endOfWeek(weekStart,   { weekStartsOn: 1 }),
  })
  return days.some(day => isClientForDay(client, day))
}

// Group week clients by day
export function groupByDay(clients, weekStart) {
  const days = eachDayOfInterval({
    start: startOfWeek(weekStart, { weekStartsOn: 1 }),
    end:   endOfWeek(weekStart,   { weekStartsOn: 1 }),
  })
  return days.map(day => ({
    day,
    label: format(day, 'EEEE dd/MM', { locale: el }),
    clients: clients.filter(c => isClientForDay(c, day)),
  }))
}

// Check if a call lock is still active (< 30 min old)
export function isLockActive(calledBy) {
  if (!calledBy?.timestamp) return false
  const ts = toDate(calledBy.timestamp)
  if (!ts) return false
  return Date.now() - ts.getTime() < 30 * 60 * 1000
}

export { format, isSameDay, startOfWeek, endOfWeek }
