import os
import json
import requests
from flask import Flask, request
from datetime import datetime, timezone
import anthropic
import firebase_admin
from firebase_admin import credentials, firestore

app = Flask(__name__)

BOT_TOKEN         = os.environ.get('BOT_TOKEN', '')
ANTHROPIC_API_KEY = os.environ.get('ANTHROPIC_API_KEY', '')

# Initialise Firebase Admin from the service account JSON stored as an env var
_sa_json = os.environ.get('FIREBASE_SERVICE_ACCOUNT', '')
if _sa_json:
    _sa_dict = json.loads(_sa_json)
    firebase_admin.initialize_app(credentials.Certificate(_sa_dict))
else:
    firebase_admin.initialize_app()   # uses GOOGLE_APPLICATION_CREDENTIALS if set

db = firestore.client()

ai_client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

# In-memory state per chat_id:
# {
#   'mode': 'registering' | 'collecting',
#   'volunteer': { firstName, lastName, area },
#   'data': { firstName, lastName, phone, area, comment },
#   'history': [ {role, content}, ... ],
# }
user_states = {}

MAX_HISTORY = 20

# ── Telegram helpers ──────────────────────────────────────────────────────────

def send(chat_id, text):
    requests.post(
        f'https://api.telegram.org/bot{BOT_TOKEN}/sendMessage',
        json={'chat_id': chat_id, 'text': text, 'parse_mode': 'HTML'},
        timeout=10,
    )

# ── Firestore helpers ─────────────────────────────────────────────────────────

def get_volunteer_profile(telegram_user_id):
    """Fetch volunteer profile by telegramUserId. Returns dict or None."""
    try:
        doc = db.collection('volunteers').document(str(telegram_user_id)).get()
        return doc.to_dict() if doc.exists else None
    except Exception as e:
        print(f'[Firebase] get_volunteer_profile error: {e}')
        return None

def save_volunteer_profile(telegram_user_id, data):
    """Create or update volunteer profile (uses telegramUserId as document ID)."""
    try:
        db.collection('volunteers').document(str(telegram_user_id)).set({
            'firstName':      data.get('firstName', ''),
            'lastName':       data.get('lastName', ''),
            'area':           data.get('area', ''),
            'telegramUserId': str(telegram_user_id),
            'updatedAt':      datetime.now(timezone.utc),
        })
        return True
    except Exception as e:
        print(f'[Firebase] save_volunteer_profile error: {e}')
        return False

def save_contact(data, volunteer, telegram_user_id, telegram_username):
    """Save a contact to voteContacts collection."""
    try:
        added_by = f'{volunteer.get("firstName", "")} {volunteer.get("lastName", "")}'.strip()
        db.collection('voteContacts').add({
            'firstName':       data.get('firstName', ''),
            'lastName':        data.get('lastName', ''),
            'phone':           data.get('phone', ''),
            'area':            data.get('area', ''),
            'comment':         data.get('comment', ''),
            'addedByName':     added_by,
            'addedByArea':     volunteer.get('area', ''),
            'addedByUsername': telegram_username,
            'addedByUserId':   str(telegram_user_id),
            'timestamp':       datetime.now(timezone.utc),
        })
        return True
    except Exception as e:
        print(f'[Firebase] save_contact error: {e}')
        return False

# ── System prompts ────────────────────────────────────────────────────────────

VOLUNTEER_SYSTEM_PROMPT = """\
You are a friendly assistant for a Greek political campaign. A new volunteer is registering \
themselves to use this bot. You need to collect their personal details conversationally in Greek.

REQUIRED fields:
- firstName  (όνομα του εθελοντή)
- lastName   (επίθετο του εθελοντή)
- area       (περιοχή του εθελοντή — neighborhood or city)

HOW TO BEHAVE:
- Always reply in Greek, warm and welcoming.
- If they send multiple fields at once, extract all of them.
- If a field is missing, ask naturally.
- If they want to correct something, update it immediately.
- Capitalize names and areas properly.
- Once ALL fields are collected, show a summary and ask to confirm.
- After confirmation, set status to "save".

ALWAYS respond with ONLY a raw JSON object (no markdown):
{
  "reply": "<your Greek message>",
  "data": { "firstName": "", "lastName": "", "area": "" },
  "status": "collecting" | "confirming" | "save"
}

- "collecting": still gathering fields
- "confirming": all fields filled, showing summary, waiting for confirmation
- "save": user confirmed — trigger save

Always include the FULL current data in the "data" object (never lose collected fields).
"""

CONTACT_SYSTEM_PROMPT = """\
You are a friendly assistant for a Greek political campaign. A volunteer is using you to register \
supporters (contacts) into a database. Your job is to collect contact details conversationally in Greek.

REQUIRED fields:
- firstName  (όνομα της επαφής)
- lastName   (επίθετο της επαφής)
- phone      (τηλέφωνο — Greek mobile or landline)
- area       (περιοχή — neighborhood or city)

OPTIONAL field:
- comment    (σχόλιο — any note about the contact)

HOW TO BEHAVE:
- Always reply in Greek, friendly and natural.
- If the user sends multiple fields at once, extract all of them.
- If a field is missing, ask for it naturally (not robotically).
- If the user wants to correct a field at any point ("άλλαξε", "λάθος", "εννοώ"), update it immediately.
- Capitalize names and areas properly (e.g. γιωργης → Γιώργης).
- For phone: strip spaces, dashes, dots — keep digits only (with leading + if present).
- Validate phone: must be 8 digits for Cyprus numbers (or start with +357 followed by 8 digits).
- If input seems wrong for a field (e.g. letters where phone expected), ask to clarify.
- Once ALL required fields (firstName, lastName, phone, area) are collected, ALWAYS ask: \
"Θέλεις να προσθέσεις κάποιο σχόλιο για αυτή την επαφή; (π.χ. σημειώσεις, πώς τον/την ξέρεις κτλ.) \
Αν όχι, πες μου «όχι» ή «παράλειψη»." — wait for their answer before showing the summary.
- After the comment answer (or skip), show a formatted summary of ALL fields and ask to confirm.
- After confirmation, set status to "save".
- If the user wants to update THEIR OWN volunteer profile (e.g. "άλλαξε τα δικά μου στοιχεία", \
"λάθος το όνομά μου"), set status to "update_profile".

STRICT PRIVACY RULE:
Never reveal, discuss, or reference any data entered by other volunteers. \
If a volunteer asks about other volunteers, other contacts, totals, lists, or anything \
beyond their own current session, politely decline and redirect them to adding a new contact. \
Each volunteer can only see what they themselves are currently entering.

ALWAYS respond with ONLY a raw JSON object (no markdown):
{
  "reply": "<your Greek message>",
  "data": { "firstName": "", "lastName": "", "phone": "", "area": "", "comment": "" },
  "status": "collecting" | "confirming" | "save" | "update_profile"
}

- "collecting": still gathering contact fields
- "confirming": all required fields filled, showing summary, waiting for confirmation
- "save": user confirmed — trigger save
- "update_profile": user wants to edit their own volunteer details

Always include the FULL current data in the "data" object (never lose collected fields).
"""

# ── Claude call ───────────────────────────────────────────────────────────────

def call_claude(system_prompt, history, current_data):
    data_reminder = f'\n\n[Current collected data: {json.dumps(current_data, ensure_ascii=False)}]'
    messages = list(history)
    if messages and messages[-1]['role'] == 'user':
        messages = history[:-1] + [{
            'role': 'user',
            'content': history[-1]['content'] + data_reminder,
        }]

    try:
        response = ai_client.messages.create(
            model='claude-haiku-4-5-20251001',
            max_tokens=400,
            system=system_prompt,
            messages=messages,
        )
        raw = response.content[0].text.strip()
        if raw.startswith('```'):
            raw = raw.split('```')[1]
            if raw.startswith('json'):
                raw = raw[4:]
        return json.loads(raw)
    except Exception:
        return {
            'reply': 'Συγγνώμη, υπήρξε πρόβλημα. Μπορείς να επαναλάβεις;',
            'data': current_data,
            'status': 'collecting',
        }

# ── State helpers ─────────────────────────────────────────────────────────────

def empty_volunteer():
    return {'firstName': '', 'lastName': '', 'area': ''}

def empty_contact():
    return {'firstName': '', 'lastName': '', 'phone': '', 'area': '', 'comment': ''}

def new_state(mode='registering', volunteer=None):
    return {
        'mode': mode,
        'volunteer': volunteer or empty_volunteer(),
        'data': empty_contact(),
        'history': [],
    }

# ── Message handler ───────────────────────────────────────────────────────────

def handle_message(chat_id, text, telegram_user_id, telegram_username):
    text = text.strip()

    # /start or /new — full reset, re-check volunteer profile
    if text.lower() in ('/start', '/new'):
        profile = get_volunteer_profile(telegram_user_id)
        if profile and profile.get('firstName'):
            user_states[chat_id] = new_state(mode='collecting', volunteer=profile)
            send(chat_id,
                 f'Καλώς ήρθες πάλι, <b>{profile["firstName"]}</b>! 😊\n\n'
                 f'Πες μου τα στοιχεία της επαφής που θέλεις να καταχωρίσεις. '
                 f'Μπορείς να τα στείλεις όλα μαζί ή ένα-ένα!')
        else:
            user_states[chat_id] = new_state(mode='registering')
            send(chat_id,
                 'Γεια σου! 😊 Φαίνεται ότι είναι η πρώτη φορά που χρησιμοποιείς το bot.\n\n'
                 'Πρώτα χρειάζομαι <b>τα δικά σου στοιχεία</b> για να ξέρω ποιος καταχωρεί τις επαφές.\n\n'
                 'Πες μου το <b>όνομά σου</b>, το <b>επίθετό σου</b> και την <b>περιοχή σου</b>:')
        return

    # /profile — let volunteer update their own details
    if text.lower() == '/profile':
        state = user_states.get(chat_id)
        volunteer = state['volunteer'] if state else empty_volunteer()
        user_states[chat_id] = new_state(mode='registering', volunteer=volunteer)
        send(chat_id,
             'Εντάξει! Πες μου τα νέα σου στοιχεία (όνομα, επίθετο, περιοχή).\n'
             'Μπορείς να στείλεις μόνο αυτό που θέλεις να αλλάξεις:')
        return

    # First ever message — check Firebase for existing profile
    if chat_id not in user_states:
        profile = get_volunteer_profile(telegram_user_id)
        if profile and profile.get('firstName'):
            user_states[chat_id] = new_state(mode='collecting', volunteer=profile)
            send(chat_id,
                 f'Καλώς ήρθες πάλι, <b>{profile["firstName"]}</b>! 😊\n\n'
                 f'Πες μου τα στοιχεία της επαφής που θέλεις να καταχωρίσεις. '
                 f'Μπορείς να τα στείλεις όλα μαζί ή ένα-ένα!')
            return
        else:
            user_states[chat_id] = new_state(mode='registering')
            send(chat_id,
                 'Γεια σου! 😊 Φαίνεται ότι είναι η πρώτη φορά που χρησιμοποιείς το bot.\n\n'
                 'Πρώτα χρειάζομαι <b>τα δικά σου στοιχεία</b> για να ξέρω ποιος καταχωρεί τις επαφές.\n\n'
                 'Πες μου το <b>όνομά σου</b>, το <b>επίθετό σου</b> και την <b>περιοχή σου</b>:')
            return

    state = user_states[chat_id]

    # Append user message to history
    state['history'].append({'role': 'user', 'content': text})
    if len(state['history']) > MAX_HISTORY:
        state['history'] = state['history'][-MAX_HISTORY:]

    mode = state['mode']

    # ── REGISTERING MODE: collecting volunteer's own details ──────────────────
    if mode == 'registering':
        result = call_claude(VOLUNTEER_SYSTEM_PROMPT, state['history'], state['volunteer'])

        reply    = result.get('reply', 'Συγγνώμη, δεν κατάλαβα.')
        new_data = result.get('data', state['volunteer'])
        status   = result.get('status', 'collecting')

        for k in state['volunteer']:
            if new_data.get(k):
                state['volunteer'][k] = new_data[k]

        state['history'].append({'role': 'assistant', 'content': reply})
        send(chat_id, reply)

        if status == 'save':
            ok = save_volunteer_profile(telegram_user_id, state['volunteer'])
            if ok:
                v = state['volunteer']
                send(chat_id,
                     f'✅ Τέλεια, <b>{v["firstName"]}</b>! Τα στοιχεία σου αποθηκεύτηκαν.\n\n'
                     f'Τώρα πες μου τα στοιχεία της πρώτης επαφής που θέλεις να καταχωρίσεις. '
                     f'Μπορείς να τα στείλεις όλα μαζί ή ένα-ένα!')
                state['mode'] = 'collecting'
                state['data'] = empty_contact()
                state['history'] = []
            else:
                send(chat_id, '⚠️ Πρόβλημα αποθήκευσης. Πες μου "αποθήκευση" για να δοκιμάσω ξανά.')

    # ── COLLECTING MODE: adding a contact ─────────────────────────────────────
    elif mode == 'collecting':
        result = call_claude(CONTACT_SYSTEM_PROMPT, state['history'], state['data'])

        reply    = result.get('reply', 'Συγγνώμη, δεν κατάλαβα.')
        new_data = result.get('data', state['data'])
        status   = result.get('status', 'collecting')

        for k in state['data']:
            if new_data.get(k):
                state['data'][k] = new_data[k]

        state['history'].append({'role': 'assistant', 'content': reply})
        send(chat_id, reply)

        if status == 'update_profile':
            # Volunteer wants to fix their own details
            send(chat_id,
                 'Εντάξει! Πες μου τα νέα σου στοιχεία (όνομα, επίθετο, περιοχή):')
            state['mode'] = 'registering'
            state['history'] = []

        elif status == 'save':
            ok = save_contact(state['data'], state['volunteer'], telegram_user_id, telegram_username)
            if ok:
                d = state['data']
                comment_line = f'\n💬 {d["comment"]}' if d.get('comment') else ''
                send(chat_id,
                     f'✅ <b>Καταχωρήθηκε!</b>\n\n'
                     f'👤 {d["firstName"]} {d["lastName"]}\n'
                     f'📞 {d["phone"]}\n'
                     f'📍 {d["area"]}'
                     f'{comment_line}\n\n'
                     f'Ευχαριστώ! 🙏 Θες να προσθέσεις άλλη επαφή;')
                state['data'] = empty_contact()
                state['history'] = []
            else:
                send(chat_id, '⚠️ Πρόβλημα αποθήκευσης. Πες μου "αποθήκευση" για να δοκιμάσω ξανά.')

# ── Flask routes ──────────────────────────────────────────────────────────────

@app.route('/webhook', methods=['POST'])
def webhook():
    update = request.get_json(silent=True)
    if not update:
        return 'OK'

    message = update.get('message') or update.get('edited_message')
    if message:
        chat_id   = message['chat']['id']
        text      = message.get('text', '')
        from_user = message.get('from', {})
        telegram_user_id = from_user.get('id', 0)
        telegram_username = from_user.get('username', '')
        if text:
            handle_message(chat_id, text, telegram_user_id, telegram_username)

    return 'OK'


@app.route('/set_webhook')
def set_webhook():
    base_url = request.args.get('url', '').rstrip('/')
    if not base_url:
        return 'Pass ?url=https://your-render-url.onrender.com', 400
    resp = requests.post(
        f'https://api.telegram.org/bot{BOT_TOKEN}/setWebhook',
        json={'url': f'{base_url}/webhook'},
        timeout=10,
    )
    return resp.json()


@app.route('/health')
def health():
    return 'OK'


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)
