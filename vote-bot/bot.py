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

# In-memory conversation state: { chat_id: { 'step': int, 'data': {} } }
# Steps: 0=firstName, 1=lastName, 2=phone, 3=area, 4=comment, 5=confirm
user_states = {}

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

# ── AI parsing ────────────────────────────────────────────────────────────────

STEP_META = {
    0: {
        'field': 'firstName',
        'desc': 'first name (όνομα) of the contact person',
        'examples': 'Γιώργης, Μαρία, Κώστας, Νίκος',
        'skippable': False,
    },
    1: {
        'field': 'lastName',
        'desc': 'last name (επίθετο) of the contact person',
        'examples': 'Παπαδόπουλος, Νικολάου, Γεωργίου',
        'skippable': False,
    },
    2: {
        'field': 'phone',
        'desc': 'Greek phone number (mobile or landline)',
        'examples': '6912345678, 2101234567, 694 123 4567',
        'skippable': False,
    },
    3: {
        'field': 'area',
        'desc': 'area or neighborhood (περιοχή) in Greece',
        'examples': 'Χολαργός, Κηφισιά, Θεσσαλονίκη, Γλυφάδα',
        'skippable': False,
    },
    4: {
        'field': 'comment',
        'desc': 'optional short note about the contact',
        'examples': 'ψηφίζει σίγουρα, αμφίβολος, φίλος του Νίκου',
        'skippable': True,
    },
    5: {
        'field': None,
        'desc': 'confirmation — user reviewing and confirming all data',
        'examples': 'ναι, σωστά, ok, /ok, επιβεβαιώνω',
        'skippable': False,
    },
}

def ai_parse(step, user_message, data):
    """
    Ask Claude Haiku to interpret the user's message in context.
    Returns a dict: { action, value?, reply? }
      action: "save" | "back" | "skip" | "confirm" | "unclear"
      value:  clean extracted value (when action=save)
      reply:  short Greek message to send back (when action=unclear)
    """
    meta = STEP_META[step]
    already = ', '.join(f'{k}: {v}' for k, v in data.items() if v) if data else 'none yet'

    if step == 5:
        task = (
            'The user is reviewing a summary of contact data and must confirm or go back to fix something.\n'
            f'Data collected so far: {already}\n'
            'Return action="confirm" if they agree/confirm (e.g. ναι, σωστά, ok, καλά, ✓).\n'
            'Return action="back" if they want to correct something.\n'
            'Return action="unclear" with a Greek reply if the message is ambiguous.'
        )
    else:
        skip_rule = (
            'Return action="skip" if the user wants to skip this optional field '
            '(e.g. τίποτα, δεν έχω, pass, skip, -, παράλειψη).\n'
            if meta['skippable'] else ''
        )
        task = (
            f'The bot is collecting contact info step by step for a Greek political campaign.\n'
            f'Current field to collect: {meta["desc"]}\n'
            f'Valid examples: {meta["examples"]}\n'
            f'Data collected so far: {already}\n\n'
            f'Analyze the user message and return ONE of these actions:\n'
            f'- "save": user provided a valid value. Extract it cleanly as "value".\n'
            f'- "back": user wants to correct a previous field '
            f'(e.g. λάθος, πίσω, διόρθωσε, εννοώ, όχι, ξανά).\n'
            f'{skip_rule}'
            f'- "unclear": input is not valid for this field. '
            f'Provide a short friendly Greek "reply" asking them to try again.\n\n'
            f'Extra rules:\n'
            f'- For names: capitalize properly (γιωργης → Γιώργης).\n'
            f'- For phone: strip spaces and dashes, keep only digits (and leading + if present).\n'
            f'- For area: capitalize first letter of each word.\n'
            f'- If the user seems to provide the value but also says it\'s wrong '
            f'(e.g. "όχι εννοώ Νίκος"), treat as action="back" so they re-enter it.\n'
            f'- Short single words that match the expected field type should be "save".'
        )

    prompt = (
        f'{task}\n\n'
        f'User message: "{user_message}"\n\n'
        f'Respond with ONLY a raw JSON object, no markdown fences:\n'
        f'{{"action": "...", "value": "...", "reply": "..."}}'
    )

    try:
        response = ai_client.messages.create(
            model='claude-haiku-4-5-20251001',
            max_tokens=150,
            messages=[{'role': 'user', 'content': prompt}],
        )
        raw = response.content[0].text.strip()
        # Strip markdown fences if model wrapped it anyway
        if raw.startswith('```'):
            raw = raw.split('```')[1]
            if raw.startswith('json'):
                raw = raw[4:]
        return json.loads(raw)
    except Exception:
        # Fallback: treat as plain save
        return {'action': 'save', 'value': user_message}

# ── Step prompts ──────────────────────────────────────────────────────────────

def prompt_for_step(chat_id, step, data):
    prompts = {
        0: 'Πώς λέγεται η επαφή; Ξεκίνα με το <b>όνομα</b>:',
        1: lambda d: f'Ωραία! Και το <b>επίθετο</b> του/της {d["firstName"]};',
        2: lambda d: f'Τέλεια! Ποιο είναι το <b>τηλέφωνο</b> του/της {d["firstName"]} {d["lastName"]};',
        3: 'Από ποια <b>περιοχή</b> είναι;',
        4: ('Έχεις κάποιο <b>σχόλιο</b> για αυτή την επαφή;\n'
            '(Γράψε ό,τι θέλεις, ή πες μου "τίποτα" για να παραλείψεις)'),
    }
    p = prompts[step]
    send(chat_id, p(data) if callable(p) else p)

def send_confirmation(chat_id, data):
    comment_line = f'\n💬 {data["comment"]}' if data.get('comment') else '\n💬 (χωρίς σχόλιο)'
    send(chat_id,
         f'📋 <b>Έλεγξε τα στοιχεία πριν την αποθήκευση:</b>\n\n'
         f'👤 {data.get("firstName", "")} {data.get("lastName", "")}\n'
         f'📞 {data.get("phone", "")}\n'
         f'📍 {data.get("area", "")}'
         f'{comment_line}\n\n'
         f'Είναι σωστά; Γράψε <b>ναι</b> για αποθήκευση, ή <b>πίσω</b> για να διορθώσεις κάτι.')

# ── Conversation logic ────────────────────────────────────────────────────────

def do_back(chat_id, step, data):
    """Go one step back, clearing the field that was entered at that step."""
    if step == 0:
        send(chat_id, 'Είσαι ήδη στην αρχή! Γράψε το <b>όνομα</b> της επαφής:')
        return
    new_step = step - 1
    field_at_step = {1: 'firstName', 2: 'lastName', 3: 'phone', 4: 'area', 5: 'comment'}
    field = field_at_step.get(step)
    if field and field in data:
        del data[field]
    user_states[chat_id] = {'step': new_step, 'data': data}
    send(chat_id, '↩️ Εντάξει, πάμε πίσω.')
    prompt_for_step(chat_id, new_step, data)

def handle_message(chat_id, text, user_info):
    text = text.strip()

    # Hard commands that always work regardless of state
    if text.lower() in ('/start', '/new'):
        user_states[chat_id] = {'step': 0, 'data': {}}
        send(chat_id,
             'Γεια σου! 😊 Θα με βοηθήσεις να καταχωρήσεις επαφές που θα μας ψηφίσουν.\n\n'
             'Πώς λέγεται η επαφή; Ξεκίνα με το <b>όνομα</b>:')
        return

    state = user_states.get(chat_id)

    # First message ever (no /start) → auto-start
    if state is None:
        user_states[chat_id] = {'step': 0, 'data': {}}
        send(chat_id,
             'Γεια σου! 😊 Θα με βοηθήσεις να καταχωρήσεις επαφές που θα μας ψηφίσουν.\n\n'
             'Πώς λέγεται η επαφή; Ξεκίνα με το <b>όνομα</b>:')
        return

    step = state['step']
    data = state['data']

    # Explicit back/skip commands (shortcuts, bypass AI)
    if text.lower() in ('/back', 'πίσω', 'back'):
        do_back(chat_id, step, data)
        return

    # Parse the message with Claude
    parsed = ai_parse(step, text, data)
    action = parsed.get('action', 'unclear')

    if action == 'back':
        do_back(chat_id, step, data)
        return

    if action == 'unclear':
        reply = parsed.get('reply', 'Δεν κατάλαβα. Μπορείς να το ξαναγράψεις;')
        send(chat_id, reply)
        return

    # ── Steps 0–4: collect fields ─────────────────────────────────────────────

    if step in (0, 1, 2, 3):
        if action == 'save':
            field = STEP_META[step]['field']
            data[field] = parsed.get('value', text)
            next_step = step + 1
            user_states[chat_id] = {'step': next_step, 'data': data}
            prompt_for_step(chat_id, next_step, data)

    elif step == 4:  # comment — skippable
        if action in ('save', 'skip'):
            data['comment'] = parsed.get('value', '') if action == 'save' else ''
            user_states[chat_id] = {'step': 5, 'data': data}
            send_confirmation(chat_id, data)

    elif step == 5:  # confirmation
        if action == 'confirm' or text.lower() in ('/ok', 'ok', 'ναι', 'ναί', 'σωστά', 'σωστα'):
            user_states[chat_id] = {'step': 0, 'data': {}}
            success = save_contact(data, user_info)
            if success:
                comment_line = f'\n💬 {data["comment"]}' if data.get('comment') else ''
                send(chat_id,
                     f'✅ <b>Καταχωρήθηκε!</b>\n\n'
                     f'👤 {data["firstName"]} {data["lastName"]}\n'
                     f'📞 {data["phone"]}\n'
                     f'📍 {data["area"]}'
                     f'{comment_line}\n\n'
                     f'Ευχαριστώ πολύ! 🙏 Θες να προσθέσεις άλλη επαφή; Γράψε οποτεδήποτε!')
            else:
                user_states[chat_id] = {'step': 5, 'data': data}
                send(chat_id,
                     '⚠️ Υπήρξε πρόβλημα κατά την αποθήκευση. Πες μου <b>ναι</b> για να δοκιμάσω ξανά.')

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
