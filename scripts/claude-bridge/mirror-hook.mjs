/**
 * Optional: mirror THIS laptop's Claude Code session into the portal chat.
 * Wire it as a Claude Code "Stop" hook so each time a response finishes here,
 * a short note appears in the portal (kind=note) — so you see, in parallel,
 * what you're doing in the terminal too.
 *
 * Setup — add to C:\Users\User\.claude\settings.json (merge with existing hooks):
 *   {
 *     "hooks": {
 *       "Stop": [
 *         { "hooks": [ { "type": "command",
 *           "command": "node C:/Users/User/dermlux-waitlist/scripts/claude-bridge/mirror-hook.mjs" } ] }
 *       ]
 *     }
 *   }
 * The hook receives JSON on stdin incl. transcript_path; we post the last
 * assistant text (trimmed) to Firestore. Best-effort, never blocks the session.
 */
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)

async function main() {
  let stdin = ''
  for await (const c of process.stdin) stdin += c
  let evt = {}; try { evt = JSON.parse(stdin) } catch {}
  const tp = evt.transcript_path
  if (!tp) return
  let lastText = ''
  try {
    const lines = readFileSync(tp, 'utf8').trim().split('\n')
    for (const ln of lines) {
      const o = JSON.parse(ln)
      const content = o?.message?.content
      if (o?.type === 'assistant' && Array.isArray(content))
        for (const b of content) if (b.type === 'text' && b.text?.trim()) lastText = b.text
    }
  } catch { return }
  if (!lastText) return
  const note = lastText.replace(/\s+/g, ' ').slice(0, 140) + (lastText.length > 140 ? '…' : '')

  const admin = require('firebase-admin')
  if (!admin.apps.length) admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(readFileSync('C:\\Users\\User\\Downloads\\serviceaccountkey.json','utf8'))),
  })
  await admin.firestore().collection('claude_remote_messages').add({
    role: 'assistant', kind: 'note', text: `(laptop) ${note}`,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  })
}
main().catch(() => {}).finally(() => process.exit(0))
