# Claude Code ⇄ Portal bridge

Lets you drive Claude Code on this laptop **remotely** from the DermLux portal
(`/claude` page) — from your phone or any browser, while the laptop stays open.

You see only: your prompts, **approval requests (yes/no)**, and the **final answers**.
The process (tool calls, thinking) stays hidden.

## One-time setup (on the laptop)
1. Make sure Claude Code is **logged in** on this machine (it uses your subscription).
2. Install deps:
   ```
   cd C:\Users\User\dermlux-waitlist\scripts\claude-bridge
   npm install
   ```

## Run it (whenever you want remote access)
```
cd C:\Users\User\dermlux-waitlist\scripts\claude-bridge
npm start
```
Leave the window open. The portal shows **● online** when the bridge is running,
**○ offline** when it isn't. To keep it always-on, run it via Task Scheduler /
`pm2` on startup.

## How it behaves
- Reads pending prompts from the portal, runs them with full project context
  (`cwd = C:\Users\User`).
- **Read-only / safe tools run automatically.** Anything that writes, runs a
  shell command, or touches Base44 data asks you for **ΝΑΙ/ΟΧΙ** in the portal
  first (manifesto rule #3). Base44 stays read-only per your standing rule.
- The **Manifesto** shown/edited in the portal two-way syncs with `CLAUDE.md`.
- The **session-limit bar** is an estimate (rolling 5h window); tune `SOFT_LIMIT`
  in `bridge.mjs` to match your plan.

## v2 features (portal /claude)
- **Remote ON/OFF** + **model chips** (Opus/Sonnet/Haiku/Fable, default = last) + **Auto-approve (read-only)** toggle.
- **Voice input** (🎤, Greek-first) · **image attach** (📎, photo → prompt) · **Stop** button.
- Answers render **markdown, tables and charts** (assistant can emit a ```chart block).
- Approvals are **short** (the gist) with full detail on tap.

## Optional: mirror this terminal into the portal
Run `mirror-hook.mjs` as a Claude Code **Stop** hook (see the file header) so what
you do in the terminal here also shows in the portal as small notes. Opt-in — it
doesn't touch your existing hooks unless you add it.

## Security
Admin-only page. The bridge uses the service-account key already on this machine.
Anyone who can reach the portal as an admin can run Claude Code here — keep admin
accounts limited.
