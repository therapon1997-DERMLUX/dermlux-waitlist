/**
 * DermLux ⇄ Claude Code bridge.
 *
 * Runs on the laptop (which is logged into Claude Code). It watches Firestore
 * for prompts written from the portal /claude page, runs each through the
 * Claude Agent SDK, and writes back ONLY what the owner should see:
 *   - approval requests (yes/no) for sensitive tools  → manifesto rule #3
 *   - the final answer text
 * The intermediate process (tool calls, thinking) is NOT surfaced.
 *
 * It also: keeps a heartbeat + "busy" flag, an estimated session-limit bar,
 * and two-way syncs the manifesto with C:\Users\User\CLAUDE.md.
 *
 * Setup:  cd scripts/claude-bridge && npm install && npm start
 * Needs:  Claude Code logged in on this machine (uses your subscription),
 *         service account key at C:\Users\User\Downloads\serviceaccountkey.json
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const admin = require('firebase-admin')
const { query } = await import('@anthropic-ai/claude-agent-sdk')

// ── config ──────────────────────────────────────────────────────────────────
const KEY_PATH      = 'C:\\Users\\User\\Downloads\\serviceaccountkey.json'
const PROJECT_CWD   = 'C:/Users/User'                   // Claude runs with full context here
const MANIFESTO_PATH= 'C:\\Users\\User\\CLAUDE.md'
// The SDK's bundled binary fails to launch on this machine — point it at the
// natively-installed Claude Code CLI (verified working, uses your subscription).
const CLAUDE_EXE    = 'C:/Users/User/.local/bin/claude.exe'
const POLL_MS       = 4000
const WINDOW_MS     = 5 * 60 * 60 * 1000                // rolling 5h Claude Code window
const SOFT_LIMIT    = 45                                // est. prompts per window (tune to taste)

// Tools that run without asking (read-only / safe). Everything else needs a yes/no.
const AUTO_ALLOW = new Set([
  'Read','Glob','Grep','LS','NotebookRead','WebFetch','WebSearch','TodoWrite','Task',
  'mcp__base44__query_entities','mcp__base44__list_entity_schemas','mcp__base44__list_user_apps',
])

admin.initializeApp({ credential: admin.credential.cert(JSON.parse(readFileSync(KEY_PATH,'utf8'))) })
const db = admin.firestore()
const MSGS  = db.collection('claude_remote_messages')
const STATE = db.collection('claude_remote_state').doc('state')
const TS = () => admin.firestore.FieldValue.serverTimestamp()
const sleep = ms => new Promise(r => setTimeout(r, ms))

// ── manifesto two-way sync ────────────────────────────────────────────────────
let lastManifesto = ''
async function syncManifesto() {
  const snap = await STATE.get()
  const remote = snap.exists ? (snap.data().manifesto || '') : ''
  const local  = existsSync(MANIFESTO_PATH) ? readFileSync(MANIFESTO_PATH,'utf8') : ''
  if (!remote && local) {                       // seed portal from disk
    await STATE.set({ manifesto: local }, { merge: true }); lastManifesto = local
  } else if (remote && remote !== lastManifesto && remote !== local) {
    writeFileSync(MANIFESTO_PATH, remote, 'utf8')  // owner edited it in the portal → apply to disk
    lastManifesto = remote
    console.log('• Manifesto updated from portal → CLAUDE.md')
  } else {
    lastManifesto = remote || local
  }
}

// ── session-limit estimate ────────────────────────────────────────────────────
let win = { start: Date.now(), count: 0 }
async function pushUsage() {
  if (Date.now() - win.start > WINDOW_MS) win = { start: Date.now(), count: 0 }
  const usedPct = Math.min(100, Math.round((win.count / SOFT_LIMIT) * 100))
  await STATE.set({ sessionUsage: {
    usedPct, resetAt: new Date(win.start + WINDOW_MS).toISOString(),
    label: `≈ ${win.count}/${SOFT_LIMIT} prompts αυτό το 5ωρο (εκτίμηση)`,
  }, bridgeHeartbeat: new Date().toISOString() }, { merge: true })
}

// ── approval round-trip (manifesto rule #3) ───────────────────────────────────
async function askApproval(text) {
  const ref = await MSGS.add({ role:'assistant', kind:'approval', text, status:'pending', createdAt: TS() })
  while (true) {
    await sleep(2500)
    const d = (await ref.get()).data()
    if (d?.status === 'answered') return d.decision === 'yes'
  }
}
function describe(tool, input) {
  let detail = ''
  if (tool === 'Bash')        detail = input.command || ''
  else if (tool === 'Write')  detail = `Γράψιμο αρχείου: ${input.file_path || ''}`
  else if (tool === 'Edit' || tool === 'MultiEdit') detail = `Επεξεργασία: ${input.file_path || ''}`
  else if (tool.startsWith('mcp__base44__')) detail = `Base44 ${tool.replace('mcp__base44__','')} (ΠΡΟΣΟΧΗ: read-only κανόνας)`
  else detail = JSON.stringify(input).slice(0, 300)
  return `Το Claude Code θέλει να εκτελέσει: ${tool}\n\n${detail}\n\nΝα προχωρήσει;`
}

// ── run one prompt through Claude ─────────────────────────────────────────────
async function run(promptDoc) {
  const { text } = promptDoc.data()
  await promptDoc.ref.update({ status: 'running' })
  await STATE.set({ busy: true, activity: 'Επεξεργασία prompt…' }, { merge: true })
  win.count++
  let finalText = ''
  try {
    const res = query({
      prompt: text,
      options: {
        cwd: PROJECT_CWD,
        permissionMode: 'default',
        pathToClaudeCodeExecutable: CLAUDE_EXE,
        canUseTool: async (toolName, input) => {
          if (AUTO_ALLOW.has(toolName)) return { behavior: 'allow', updatedInput: input }
          const ok = await askApproval(describe(toolName, input))
          return ok ? { behavior: 'allow', updatedInput: input }
                    : { behavior: 'deny', message: 'Ο χρήστης απέρριψε αυτή την ενέργεια.' }
        },
      },
    })
    for await (const msg of res) {
      if (msg.type === 'assistant' && msg.message?.content) {
        for (const b of msg.message.content) if (b.type === 'text') finalText = b.text
      } else if (msg.type === 'result') {
        finalText = msg.result || finalText
      }
    }
  } catch (e) {
    finalText = '⚠️ Σφάλμα: ' + (e?.message || String(e))
  }
  await MSGS.add({ role:'assistant', kind:'answer', text: finalText || '(κενή απάντηση)', createdAt: TS() })
  await promptDoc.ref.update({ status: 'done' })
  await STATE.set({ busy: false, activity: '' }, { merge: true })
}

// ── main loop ─────────────────────────────────────────────────────────────────
console.log('Claude bridge online. Watching for prompts from the portal…')
await syncManifesto()
while (true) {
  try {
    await pushUsage()
    await syncManifesto()
    const q = await MSGS.where('role','==','user').where('kind','==','prompt')
      .where('status','==','pending').orderBy('createdAt','asc').limit(1).get()
    if (!q.empty) await run(q.docs[0])
  } catch (e) {
    console.error('loop error:', e?.message || e)
  }
  await sleep(POLL_MS)
}
