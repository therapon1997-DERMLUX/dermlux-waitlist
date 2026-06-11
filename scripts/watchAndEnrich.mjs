/**
 * OmniLux CSV watcher — automatically runs enrichContacts.mjs
 * whenever a new OmniLux-*.csv file appears in Downloads.
 *
 * Run: node scripts/watchAndEnrich.mjs
 * Or:  double-click start_watcher.bat
 *
 * Leave this running in the background. Each time you export a fresh
 * OmniLux CSV to your Downloads folder, enrichment starts automatically.
 */

import { readdirSync, statSync, watch } from 'fs'
import { spawn } from 'child_process'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DOWNLOADS = 'C:/Users/User/Downloads'
const PATTERN   = /^OmniLux.*\.csv$/i
const SCRIPT    = resolve(__dirname, 'enrichContacts.mjs')
const ROOT      = resolve(__dirname, '..')

// ── Helpers ────────────────────────────────────────────────────────────────────
function timestamp() {
  return new Date().toLocaleTimeString('el-CY', { hour12: false })
}

function log(msg) {
  console.log(`[${timestamp()}] ${msg}`)
}

function getAllOmniLuxFiles() {
  return readdirSync(DOWNLOADS)
    .filter(f => PATTERN.test(f))
    .map(f => {
      const path = `${DOWNLOADS}/${f}`
      return { path, name: f, mtime: statSync(path).mtime.getTime() }
    })
    .sort((a, b) => b.mtime - a.mtime)
}

// ── State ──────────────────────────────────────────────────────────────────────
let isRunning   = false
let lastFile    = null    // path of the file we last processed
let pendingFile = null    // queued file to process after current run finishes

// Find the current latest file on startup — do NOT process it, just remember it
const existing = getAllOmniLuxFiles()
if (existing.length) {
  lastFile = existing[0].path
  log(`Watching for new OmniLux CSVs in Downloads…`)
  log(`Current file (will not re-process): ${existing[0].name}`)
} else {
  log(`No OmniLux CSV found yet — will process the first one that appears.`)
}

log('Watcher ready. Export a new OmniLux CSV to trigger enrichment automatically.')
log('Press Ctrl+C to stop.\n')

// ── Run enrichment ─────────────────────────────────────────────────────────────
function runEnrichment(csvPath) {
  if (isRunning) {
    log(`Enrichment already running — queueing ${csvPath}`)
    pendingFile = csvPath
    return
  }

  isRunning = true
  lastFile  = csvPath
  log(`\n--- New CSV detected: ${csvPath.split('/').pop()} ---`)
  log('Starting enrichment… (this may take several minutes)')

  const proc = spawn('node', [SCRIPT, '--csv', csvPath], {
    stdio: 'inherit',
    cwd: ROOT,
    shell: false,
  })

  proc.on('close', code => {
    isRunning = false
    if (code === 0) {
      log('✓ Enrichment finished successfully.\n')
    } else {
      log(`✗ Enrichment exited with code ${code}. Check output above for errors.\n`)
    }

    // Process queued file if one arrived while we were running
    if (pendingFile && pendingFile !== lastFile) {
      const queued = pendingFile
      pendingFile  = null
      log(`Processing queued file: ${queued}`)
      setTimeout(() => runEnrichment(queued), 2000)
    }
  })
}

// ── Watch Downloads folder ─────────────────────────────────────────────────────
let debounceTimer = null

watch(DOWNLOADS, { persistent: true }, (event, filename) => {
  if (!filename || !PATTERN.test(filename)) return

  // Debounce: wait 4s after the last event for the same filename
  // (the OS fires multiple events while a file is being written/copied)
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    const latest = getAllOmniLuxFiles()
    if (!latest.length) return

    const newest = latest[0]
    if (newest.path === lastFile) return          // same file, ignore
    if (pendingFile === newest.path) return       // already queued

    runEnrichment(newest.path)
  }, 4000)
})
