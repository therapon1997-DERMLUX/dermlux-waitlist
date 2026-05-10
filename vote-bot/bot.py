import os
import json
import requests
from flask import Flask, request
from datetime import datetime, timezone
import anthropic

app = Flask(__name__)

BOT_TOKEN           = os.environ.get('BOT_TOKEN', '')
FIREBASE_PROJECT_ID = os.environ.get('FIREBASE_PROJECT_ID', 'dermlux-waitlist')
FIREBASE_API_KEY    = os.environ.get('FIREBASE_API_KEY', '')
ANTHROPIC_API_KEY   = os.environ.get('ANTHROPIC_API_KEY', '')

ai_client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)

# In-memory state per user: { chat_id: { 'data': {}, 'history': [], 'status': str } }
user_states = {}

MAX_HISTORY = 20  # keep last 20 messages to avoid context bloat

# ── Telegram helpers ──────────────────────────────────────────────────────────

def send(chat_id, text):
    requests.post(
        f'https://api.telegram.org/bot{BOT_TOKEN}/sendMessage',
        json={'chat_id': chat_id, 'text': text, 'parse_mode': 'HTML'},
        timeout=10,
    )

# ── Firestore helper ──────────────────────────────────────────────────────────

def save_contact(data, user_info):
    url = (
        f'https://firestore.googleapis.com/v1/projects/{FIREBASE_PROJECT_ID}'
        f'/databases/(default)/documents/voteContacts?key={FIREBASE_API_KEY}'
    )
    payload = {
        'fields': {
            'firstName':        {'stringValue': data.get('firstName', '')},
            'lastName':         {'stringValue': data.get('lastName', '')},
            'phone':            {'stringValue': data.get('phone', '')},
            'area':             {'stringValue': data.get('area', '')},
            'comment':          {'stringValue': data.get('comment', '')},
            'addedByUsername':  {'stringValue': user_info.get('username', '')},
            'addedByName':      {'stringValue': user_info.get('name', '')},
            'telegramUserId':   {'stringValue': str(user_info.get('id', ''))},
            'timestamp':        {'timestampValue': datetime.now(timezone.utc).isoformat()},
        }
    }
    resp = requests.post(url, json=payload, timeout=10)
    return resp.status_code == 200

# ── AI conversation ───────────────────────────────────────────────────────────

SYSTEM_PROMPT = """\
You are a friendly assistant for a Greek political campaign. Campaign volunteers chat with you \
to register supporters (contacts) into a database. Your job is to collect their contact details \
conversationally in Greek.

REQUIRED fields:
- firstName  (όνομα)
- lastName   (επίθετο)
- phone      (τηλέφωνο — Greek mobile or landline)
- area       (περιοχή — neighborhood or city)

OPTIONAL field:
- comment    (σχόλιο — any note about the contact)

HOW TO BEHAVE:
- Always reply in Greek, friendly and natural.
- If the user sends multiple fields at once, extract all of them.
- If a field is missing, ask for it naturally (not robotically).
- If the user wants to correct a field at any point, update it immediately.
- Capitalize names and areas properly (e.g. γιωργης → Γιώργης).
- For phone: strip spaces, dashes, dots — keep digits only (with leading + if present).
- Validate phone: must be 10 digits for Greek numbers (or start with +30).
- If input seems wrong for a field (e.g. letters where a phone is expected), ask to clarify.
- Once ALL required fields are collected, show a formatted summary and ask the user to confirm.
- After the user confirms, set status to "save".
- If the user wants to add another contact after saving, reset and start fresh.

ALWAYS respond with ONLY a raw JSON object (no markdown, no explanation outside JSON):
{
  "reply": "<your Greek message to the user>",
  "data": {
    "firstName": "",
    "lastName": "",
    "phone": "",
    "area": "",
    "comment": ""
  },
  "status": "collecting" | "confirming" | "save"
}

Rules for status:
- "collecting": still gathering fields
- "confirming": all required fields are filled — show summary and wait for user confirmation
- "save": user has confirmed the summary — trigger the save

The "data" object must always contain the FULL current state of all fields \
(merge new info with existing, never lose previously collected fields).
"""

def get_initial_state():
    return {
        'data': {'firstName': '', 'lastName': '', 'phone': '', 'area': '', 'comment': ''},
        'history': [],
        'status': 'collecting',
    }

def call_claude(history, current_data):
    """Send conversation history to Claude and get back reply + updated data + status."""
    # Inject current data as a system reminder in the last turn
    data_reminder = (
        f'\n\n[Current collected data: {json.dumps(current_data, ensure_ascii=False)}]'
    )
    # Append reminder to the last user message without modifying history
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
            system=SYSTEM_PROMPT,
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

# ── Conversation handler ──────────────────────────────────────────────────────

def handle_message(chat_id, text, user_info):
    text = text.strip()

    # /start or /new → reset
    if text.lower() in ('/start', '/new'):
        user_states[chat_id] = get_initial_state()
        send(chat_id,
             'Γεια σου! 😊 Είμαι εδώ για να με βοηθήσεις να καταχωρίσεις επαφές '
             'που θα μας ψηφίσουν.\n\n'
             'Πες μου τα στοιχεία της επαφής — όνομα, επίθετο, τηλέφωνο και περιοχή. '
             'Μπορείς να τα στείλεις όλα μαζί ή ένα-ένα, όπως θέλεις!')
        return

    # Init state on first message
    if chat_id not in user_states:
        user_states[chat_id] = get_initial_state()
        send(chat_id,
             'Γεια σου! 😊 Είμαι εδώ για να με βοηθήσεις να καταχωρίσεις επαφές '
             'που θα μας ψηφίσουν.\n\n'
             'Πες μου τα στοιχεία της επαφής — όνομα, επίθετο, τηλέφωνο και περιοχή. '
             'Μπορείς να τα στείλεις όλα μαζί ή ένα-ένα, όπως θέλεις!')
        return

    state = user_states[chat_id]

    # Append user message to history
    state['history'].append({'role': 'user', 'content': text})

    # Trim history to avoid context bloat
    if len(state['history']) > MAX_HISTORY:
        state['history'] = state['history'][-MAX_HISTORY:]

    # Call Claude
    result = call_claude(state['history'], state['data'])

    reply   = result.get('reply', 'Συγγνώμη, δεν κατάλαβα.')
    new_data = result.get('data', state['data'])
    status  = result.get('status', 'collecting')

    # Merge data (never overwrite a filled field with empty)
    for k in state['data']:
        if new_data.get(k):
            state['data'][k] = new_data[k]

    # Append assistant reply to history
    state['history'].append({'role': 'assistant', 'content': reply})

    send(chat_id, reply)

    # If Claude says save — write to Firebase
    if status == 'save':
        success = save_contact(state['data'], user_info)
        if success:
            d = state['data']
            comment_line = f'\n💬 {d["comment"]}' if d.get('comment') else ''
            send(chat_id,
                 f'✅ <b>Καταχωρήθηκε!</b>\n\n'
                 f'👤 {d["firstName"]} {d["lastName"]}\n'
                 f'📞 {d["phone"]}\n'
                 f'📍 {d["area"]}'
                 f'{comment_line}\n\n'
                 f'Ευχαριστώ! 🙏 Θες να προσθέσεις άλλη επαφή;')
            # Reset for next contact but keep the user in the system
            user_states[chat_id] = get_initial_state()
        else:
            send(chat_id,
                 '⚠️ Υπήρξε πρόβλημα κατά την αποθήκευση. Πες μου "αποθήκευση" για να '
                 'δοκιμάσω ξανά.')
            state['status'] = 'confirming'  # keep data, let user retry
    else:
        state['status'] = status

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
        user_info = {
            'id':       from_user.get('id', 0),
            'username': from_user.get('username', ''),
            'name':     f"{from_user.get('first_name', '')} {from_user.get('last_name', '')}".strip(),
        }
        if text:
            handle_message(chat_id, text, user_info)

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
