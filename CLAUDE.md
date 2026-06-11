# Dermlux Waitlist & Email Marketing Tool

## Tech Stack
- **Frontend:** React (Vite) + Tailwind CSS, hosted on GitHub Pages
- **Database:** Firebase Firestore (REST API in worker, JS SDK in frontend) — **free Spark plan**
- **Worker:** Cloudflare Worker `empty-hall-968f` — **free plan**
- **Email:** Resend API (batch sends, webhooks)
- **Auth:** Firebase Auth (email/password)

## Free Tier Limits (IMPORTANT)
- **Firestore:** 50,000 reads/day, 20,000 writes/day — minimize operations in every change
- **Cloudflare Worker:** 100,000 requests/day, 10ms CPU per invocation
- **Resend:** 100 emails/batch (hard limit), 100 emails/day on free plan
- Always prefer direct document GET by ID over queries
- Use cursor-based pagination, never load entire collections
- Use Resend tags to avoid Firestore queries in webhooks

## Project Structure
- `src/` — React frontend (Firebase JS SDK)
- `worker/index.js` — Cloudflare Worker (Firestore REST API, Resend API)
- `worker/wrangler.toml` — Worker config

## Deploy Commands
```bash
# Frontend (auto-deploys on push to main via GitHub Actions)
git add . && git commit -m "..." && git push

# Worker (run from worker/ directory)
cd worker
npx wrangler deploy
```

## Key Architecture Decisions
- Contact document IDs: base64url of lowercase email (`fsContactDocId`)
- Contact numeric record IDs: FNV-1a hash of email (`emailToRecordId`)
- Email send doc IDs: `campaignId||email`
- Webhook uses Resend tags (campaign_id, contact_id) to avoid expensive queries
- Auto-send uses cursor-based pagination (`lastContactCursor`) to stay within quota
- Audience segmentation saved as JSON string on campaign doc, replicated in worker

## Do NOT Touch
- Unsubscribe flow (`/unsubscribe` endpoint + `UnsubscribePage.jsx`) — working, leave as-is

## Cron Schedule
- Worker cron runs every 15 minutes (`*/15 * * * *`)
- Auto-send batches spaced 2 hours apart (`AUTO_INTERVAL_MS`)

## Firebase
- Project: `dermlux-waitlist`
- Admin UID: `TMgFlpv8ZcNGcgk7XKIxjDktf802`
- Collections: `email_contacts`, `email_campaigns`, `email_sends`, `email_templates`, `clients`

## User Context
- Non-technical user — give simple deploy instructions (step by step, no `&&` in PowerShell)
- Uses Windows PowerShell — avoid bash-only syntax in user-facing commands
- Screenshots folder: `C:\Users\User\OneDrive\Εικόνες\Screenshots` — check here when user mentions screenshot

---

## Bookkeeping Module — Phase 1 BUILT (deploy + enable pending)

**Status:** Phase 1 code is written & builds clean. Admin-only. Files:
- `src/components/bookkeeping/Bookkeeping.jsx` — list + filters (month/category/location) + summary cards + per-category bars
- `src/components/bookkeeping/ExpenseModal.jsx` — drag-drop / file / paste-snip upload → Storage → AI extract → confirm form → save. Exports `CATEGORIES`, `LOCATIONS`, `PAYMENT_METHODS`.
- Route `/bookkeeping` (AdminRoute) in `App.jsx`; Navbar links (desktop + mobile, isAdmin) labelled "Λογιστικά".
- Worker: `/extract-invoice` endpoint in `worker/index.js` → `extractInvoice()` calls Claude **Haiku 4.5** vision, returns JSON fields. CORS locked to ALLOWED_ORIGIN.
- Firestore collection: **`expenses`** (vendor, vatNumber, invoiceNumber, date, net, vat, vatRate, total, currency, category, location, paymentMethod, notes, fileUrl, fileName, status, source, createdAt/By). Storage path `expenses/{ts}_{name}`.
- AI is **optional/graceful**: if `VITE_WORKER_URL` unset or the call fails, the modal just falls back to manual entry. Net+vatRate auto-computes VAT & total.

**To deploy & enable (in order):**
1. **Firebase Storage** — ensure Storage is enabled and rules allow authenticated writes to `expenses/` (e.g. `match /expenses/{f} { allow read, write: if request.auth != null; }`). Without this, uploads fail.
   ⚠️ **ΠΡΟΣΟΧΗ (συνέβη 10/06/2026):** Οι κανόνες Storage μπαίνουν ΜΟΝΟ στο Firebase Console → **Storage → Rules**. ΠΟΤΕ στο **Firestore Database → Rules** — αν μπουν εκεί, σβήνουν τους κανόνες της βάσης και ΟΛΗ η εφαρμογή δείχνει άδεια (κανένα δεδομένο δεν χάνεται, αλλά μπλοκάρονται όλα τα reads). Σωστοί κανόνες Firestore: `match /{document=**} { allow read, write: if request.auth != null; }`. Επαναφορά έγινε 11/06/2026 μέσω Firebase Rules API με το service account key (`C:\Users\User\Downloads\serviceaccountkey.json`).
2. **Anthropic key for AI read** — `cd worker` then `npx wrangler secret put ANTHROPIC_API_KEY` (paste key from console.anthropic.com), then `npx wrangler deploy`. (App works without this — just no auto-read.)
3. **Frontend** — `git add . && git commit -m "..." && git push` (GitHub Actions auto-deploys).

**Phase 2 (not built):** bank-statement import + reconciliation (`bank_transactions` collection; match by amount+date+vendor).

---

## Bookkeeping Module — original design notes

**Goal:** Replace **Expensify**. Drag-drop / photo / screen-snip upload of expense invoices → AI reads the details → store → reports/metrics → (later) match against bank statements. Build it as a new module inside THIS app (not Base44) to avoid Base44 credit costs.

**Why here, not Base44:** Base44 burns credits. This app is already React + Firebase (Storage + Firestore + Auth) on free tiers, with an existing Cloudflare Worker — so the only running cost is a tiny per-invoice AI fee.

**Architecture (reuses existing stack):**
- Upload → **Firebase Storage** (`storage` already exported from `src/firebase/config.js`)
- Data → **Firestore** new collections: `expenses`, `bank_transactions` (Phase 2), optional `vendors`
- AI extraction → add a `/extract-invoice` route to the existing **Cloudflare Worker** (`worker/index.js`, deployed name `empty-hall-968f`). Worker calls Claude vision, returns JSON. **API key must live in the Worker** (never in the static GitHub Pages frontend).
- UI → new `src/components/bookkeeping/` module; add `/bookkeeping` admin route in `App.jsx` + Navbar link (mirror the Email/Medical module pattern). Admin-only.

**AI model & cost:** Use **Claude Haiku 4.5** (`claude-haiku-4-5`) vision for extraction; Sonnet 4.6 (`claude-sonnet-4-6`) only as fallback for messy invoices. Cost ≈ **$0.003 (~⅓ cent) per invoice** on Haiku → realistically **under €1–2/month**. Billed directly via the user's own **Anthropic API key** (separate from Base44). Anthropic requires a one-time prepaid credit top-up (min $5). Files API storage/listing is free.

**Extraction fields:** vendor, vendor VAT number, invoice number, invoice date, net, VAT amount, VAT rate (Cyprus: 19/9/5/0%), total, currency, suggested category, location. Pattern: **AI pre-fills → user confirms in ~5 sec → save** (keeps books audit-clean). Always keep the original file for audit.

**Suggested data model:**
- `expenses` — vendor, vat_number, invoice_number, date, net, vat_amount, vat_rate, total, currency, category, location, payment_method, fileUrl, status (pending/confirmed/reconciled), bank_txn_id
- `bank_transactions` (Phase 2) — date, description, amount, direction (in/out), matched_expense_id, status

**Build phases:** Phase 1 = upload + AI extract + confirm + store + reports (this alone replaces Expensify). Phase 2 = bank-statement import + reconciliation (match by amount+date+vendor; start simple). Do NOT build bank matching on day one.

**Open decisions (ask user before building):**
1. Scope to start — Phase 1 expenses-only (recommended) vs include bank matching now.
2. P&L — expenses-only here (recommended) vs bridge Base44 **revenue** (Invoice entity) into Firebase for full profit/P&L per location. Revenue currently lives in Base44, not Firebase.
3. AI key — user creates an Anthropic key now (recommended) vs build manual-entry first and add AI later.

**Free-tier reminders that apply:** Firestore 50k reads / 20k writes/day; Worker 100k req/day, 10ms CPU (LLM call is mostly network wait, fine). Minimize reads; direct doc GET by ID.

**Cross-ref:** Base44 revenue/marketing analytics context is in user memory `project_dermlux_analytics.md` (Base44 app `DermLux`, appId `698edc30cdeae666002ae63e`; Invoice entity has total_price/net_price/city/treatment_category/client_phone).
