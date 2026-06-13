/**
 * DermLux ⇄ Claude Code bridge (v2).
 * Runs on the laptop. Watches Firestore for prompts from the portal /claude
 * page, runs them through the Claude Agent SDK, and writes back ONLY:
 *   - SHORT approval asks (yes/no) for sensitive tools (full detail on tap)
 *   - the final answer (rich markdown/tables/charts allowed)
 * Features: Remote ON/OFF, model selector, auto-approve (read-only), image
 * prompts, stop button, multi-turn continuity, session-usage estimate,
 * manifesto ↔ CLAUDE.md sync.
 *
 * Setup:  cd scripts/claude-bridge && npm install && npm start
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'node:fs'
import { tmpdir, homedir } from 'node:os'
import { join } from 'node:path'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const admin = require('firebase-admin')
const { query } = await import('@anthropic-ai/claude-agent-sdk')

const KEY_PATH      = 'C:\\Users\\User\\Downloads\\serviceaccountkey.json'
const PROJECT_CWD   = 'C:/Users/User'
const MANIFESTO_PATH= 'C:\\Users\\User\\CLAUDE.md'
const CLAUDE_EXE    = 'C:/Users/User/.local/bin/claude.exe'
const STORAGE_BUCKET= 'dermlux-waitlist.firebasestorage.app'
const POLL_MS = 4000, WINDOW_MS = 5*60*60*1000
// Real usage is measured from Claude Code's own transcripts (terminal + portal +
// bridge — everything on this machine). BUDGET = your rough token allowance per
// 5h window; tune to your plan. The label always shows the real token count too.
const PROJECTS_DIR = join(homedir(), '.claude', 'projects')
const BUDGET_TOKENS = 10_000_000   // ~billable tokens per 5h (input+output+cache_creation); tune to your plan

const MODEL_MAP = { opus:'claude-opus-4-8', sonnet:'claude-sonnet-4-6', haiku:'claude-haiku-4-5', fable:'claude-fable-5' }
const AUTO_ALLOW = new Set([
  'Read','Glob','Grep','LS','NotebookRead','WebFetch','WebSearch','TodoWrite','Task',
  'mcp__base44__query_entities','mcp__base44__list_entity_schemas','mcp__base44__list_user_apps',
])
// read-only shell heuristic (used when Auto-approve is on)
const RO_BASH = /^(\s*(cat|ls|dir|pwd|echo|grep|rg|find|head|tail|wc|type|node -e|python -c|python3 -c|git (status|log|diff|show|branch)|where|which)\b)/i
const DANGER  = /(\brm\b|\bdel\b|\bmv\b|\bmove\b|>\s|>>|\bgit (push|reset|checkout|rebase)|\bnpm (publish|install)|curl|wget|format)/i

admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync(KEY_PATH,'utf8'))), storageBucket: STORAGE_BUCKET })
const db = admin.firestore()
const bucket = admin.storage().bucket()
const MSGS  = db.collection('claude_remote_messages')
const STATE = db.collection('claude_remote_state').doc('state')
const TS = () => admin.firestore.FieldValue.serverTimestamp()
const sleep = ms => new Promise(r => setTimeout(r, ms))

let cancelFlag = false, lastSessionId = null
STATE.onSnapshot(s => { if (s.exists && s.data().cancelRequested) cancelFlag = true })

// ── manifesto two-way sync ────────────────────────────────────────────────────
let lastManifesto = ''
async function syncManifesto() {
  const snap = await STATE.get()
  const remote = snap.exists ? (snap.data().manifesto || '') : ''
  const local  = existsSync(MANIFESTO_PATH) ? readFileSync(MANIFESTO_PATH,'utf8') : ''
  if (!remote && local) { await STATE.set({ manifesto: local }, { merge:true }); lastManifesto = local }
  else if (remote && remote !== lastManifesto && remote !== local) {
    writeFileSync(MANIFESTO_PATH, remote, 'utf8'); lastManifesto = remote
    console.log('• Manifesto: portal → CLAUDE.md')
  } else lastManifesto = remote || local
}

// Walk all transcript files and sum real token usage in the rolling 5h window.
function listTranscripts(dir, out = []) {
  let entries; try { entries = readdirSync(dir, { withFileTypes: true }) } catch { return out }
  for (const e of entries) {
    const p = join(dir, e.name)
    if (e.isDirectory()) listTranscripts(p, out)
    else if (e.name.endsWith('.jsonl')) out.push(p)
  }
  return out
}
function computeRealUsage() {
  const now = Date.now(), since = now - WINDOW_MS
  let tokens = 0, oldest = now
  for (const fp of listTranscripts(PROJECTS_DIR)) {
    try { if (statSync(fp).mtimeMs < since) continue } catch { continue }   // skip files untouched in window
    let text; try { text = readFileSync(fp, 'utf8') } catch { continue }
    for (const ln of text.split('\n')) {
      if (!ln) continue
      let o; try { o = JSON.parse(ln) } catch { continue }
      const u = o?.message?.usage; if (!u) continue
      const t = Date.parse(o.timestamp || '') || 0
      if (t < since || t > now) continue
      // billable throughput: exclude cache_read (cheap re-read of cached context)
      tokens += (u.input_tokens||0) + (u.output_tokens||0) + (u.cache_creation_input_tokens||0)
      if (t < oldest) oldest = t
    }
  }
  const usedPct = Math.min(100, Math.round(tokens / BUDGET_TOKENS * 100))
  const m = (tokens/1e6).toFixed(2)
  return { usedPct, resetAt: new Date(oldest + WINDOW_MS).toISOString(),
    label: `≈ ${m}M tokens το τελευταίο 5ωρο · όλες οι χρήσεις (terminal + portal)` }
}

let lastUsageAt = 0, cachedUsage = null
async function pushUsage() {
  if (!cachedUsage || Date.now() - lastUsageAt > 60000) {   // recompute at most once a minute
    try { cachedUsage = computeRealUsage() } catch { cachedUsage = cachedUsage || { usedPct:0, label:'—' } }
    lastUsageAt = Date.now()
  }
  await STATE.set({ sessionUsage: cachedUsage, bridgeHeartbeat: new Date().toISOString() }, { merge:true })
}

// ── SHORT approval (gist) + full detail on tap ────────────────────────────────
async function askApproval(summary, detail) {
  console.log(`\n  🔐 [portal ζητά έγκριση] ${summary}`)
  if (detail) console.log(`     ↳ ${String(detail).slice(0, 200)}`)
  const ref = await MSGS.add({ role:'assistant', kind:'approval', text: summary, detail, status:'pending', createdAt: TS() })
  while (!cancelFlag) {
    await sleep(2000)
    const d = (await ref.get()).data()
    if (d?.status === 'answered') { console.log(`     → ${d.decision === 'yes' ? '✓ ΝΑΙ' : '✕ ΟΧΙ'}`); return d.decision === 'yes' }
  }
  return false
}
function summarize(tool, input) {
  if (tool === 'Bash') {
    const c = (input.command || '').trim()
    const verb = /^cat|^ls|^grep|^rg|^find|^head|^tail|^git (status|log|diff)/i.test(c) ? 'Διάβασμα' : 'Εκτέλεση εντολής'
    return { summary: `${verb} στο τερματικό`, detail: c }
  }
  if (tool === 'Write')    return { summary: `Δημιουργία/εγγραφή: ${(input.file_path||'').split(/[\\/]/).pop()}`, detail: input.file_path }
  if (tool === 'Edit' || tool === 'MultiEdit') return { summary: `Επεξεργασία: ${(input.file_path||'').split(/[\\/]/).pop()}`, detail: input.file_path }
  if (tool.startsWith('mcp__base44__')) return { summary: `Base44 ${tool.replace('mcp__base44__','')} (read-only κανόνας!)`, detail: JSON.stringify(input).slice(0,500) }
  return { summary: `Εργαλείο: ${tool}`, detail: JSON.stringify(input).slice(0,500) }
}

// ── download a portal image to a temp file Claude can Read ────────────────────
async function fetchImage(path) {
  try {
    const dir = join(tmpdir(), 'claude-bridge'); mkdirSync(dir, { recursive:true })
    const dest = join(dir, path.split('/').pop())
    await bucket.file(path).download({ destination: dest })
    return dest
  } catch (e) { console.error('image fetch failed:', e.message); return null }
}

async function run(promptDoc, state) {
  const data = promptDoc.data()
  let text = data.text || ''
  console.log(`\n📩 [από portal] prompt (${data.model || 'opus'}${data.imagePath ? ' +εικόνα' : ''}):\n   ${text.slice(0, 300)}`)
  await promptDoc.ref.update({ status:'running' })
  const startMs = Date.now()
  await STATE.set({ busy:true, activity:'σκέφτεται…', busyStartedAt: new Date().toISOString(), cancelRequested:false }, { merge:true })
  cancelFlag = false

  // playful "thinking" words like the terminal, throttled so we don't spam Firestore
  const WORDS = ['σκέφτεται…','ψάχνει…','συνδυάζει…','υπολογίζει…','διαβάζει…','συνθέτει…','μαγειρεύει…','ζυγίζει…','σκαλίζει…','δουλεύει…']
  let lastAct = 0, wi = 0
  const setAct = (w) => { const n = Date.now(); if (n - lastAct < 1400) return; lastAct = n
    STATE.set({ activity: w || WORDS[wi++ % WORDS.length] }, { merge:true }).catch(()=>{}) }

  if (data.imagePath) {
    const local = await fetchImage(data.imagePath)
    if (local) text += `\n\n[Ο χρήστης επισύναψε εικόνα. Διάβασέ την με το Read tool: ${local}]`
  }

  const auto = !!state.autoApprove
  const modelId = MODEL_MAP[state.model || 'opus'] || MODEL_MAP.opus
  const ac = new AbortController()
  const cancelWatch = setInterval(() => { if (cancelFlag) ac.abort() }, 1500)

  let finalText = ''
  try {
    const res = query({ prompt: text, options: {
      cwd: PROJECT_CWD, permissionMode:'default', pathToClaudeCodeExecutable: CLAUDE_EXE,
      model: modelId, abortController: ac,
      ...(lastSessionId ? { resume: lastSessionId } : {}),
      canUseTool: async (toolName, input) => {
        setAct(`🔧 ${toolName}…`)
        if (AUTO_ALLOW.has(toolName)) return { behavior:'allow', updatedInput: input }
        if (auto && toolName === 'Bash') {
          const c = input.command || ''
          if (RO_BASH.test(c) && !DANGER.test(c)) return { behavior:'allow', updatedInput: input }
        }
        const { summary, detail } = summarize(toolName, input)
        const ok = await askApproval(summary, detail)
        return ok ? { behavior:'allow', updatedInput: input } : { behavior:'deny', message:'Απορρίφθηκε από τον χρήστη.' }
      },
    }})
    for await (const msg of res) {
      if (msg.session_id) lastSessionId = msg.session_id
      if (msg.type === 'assistant' && msg.message?.content) {
        for (const b of msg.message.content) if (b.type === 'text') finalText = b.text
        setAct()  // rotate a thinking word
      } else if (msg.type === 'result') finalText = msg.result || finalText
    }
  } catch (e) {
    finalText = cancelFlag ? '⏹ Σταματήθηκε από τον χρήστη.' : ('⚠️ Σφάλμα: ' + (e?.message || String(e)))
  } finally { clearInterval(cancelWatch) }

  await MSGS.add({ role:'assistant', kind:'answer', text: finalText || '(κενή απάντηση)', thinkingMs: Date.now() - startMs, createdAt: TS() })
  await promptDoc.ref.update({ status:'done' })
  await STATE.set({ busy:false, activity:'', cancelRequested:false }, { merge:true })
  console.log(`💬 [προς portal] απάντηση στάλθηκε (${(finalText||'').length} χαρακτήρες)\n`)
}

console.log('Claude bridge v2 online. Watching for prompts… (terminal preview ενεργό)')
await syncManifesto()
// Independent heartbeat + usage push — keeps the portal "online" even while a
// long prompt is running inside run() (which otherwise blocks the main loop).
setInterval(() => { pushUsage().catch(() => {}) }, 15000)
pushUsage().catch(() => {})
while (true) {
  try {
    await syncManifesto()
    const snap = await STATE.get(); const st = snap.exists ? snap.data() : {}
    if (st.remoteEnabled === false) { await sleep(POLL_MS); continue }   // Remote OFF
    const q = await MSGS.where('status','==','pending').get()
    const pend = q.docs.filter(d => { const x=d.data(); return x.role==='user' && x.kind==='prompt' })
      .sort((a,b)=>(a.data().createdAt?.toMillis?.()||0)-(b.data().createdAt?.toMillis?.()||0))
    if (pend.length) await run(pend[0], st)
  } catch (e) { console.error('loop error:', e?.message || e) }
  await sleep(POLL_MS)
}
