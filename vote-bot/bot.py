import os
import requests
from flask import Flask, request
from datetime import datetime, timezone

app = Flask(__name__)

BOT_TOKEN           = os.environ.get('BOT_TOKEN', '')
FIREBASE_PROJECT_ID = os.environ.get('FIREBASE_PROJECT_ID', 'dermlux-waitlist')
FIREBASE_API_KEY    = os.environ.get('FIREBASE_API_KEY', '')

# In-memory state
# user_profiles: { chat_id: { 'firstName', 'lastName', 'area', 'telegramId', 'username' } }
# user_states:   { chat_id: { 'mode': 'onboarding'|'contact'|'confirm', 'step': int, 'data': {}, 'pending': {} } }
user_profiles = {}
user_states   = {}

# Firebase anonymous auth token (shared, refreshed on error)
_firebase_token = None

# ── Firebase Auth ─────────────────────────────────────────────────────────────

def get_firebase_token():
    global _firebase_token
    if _firebase_token:
        return _firebase_token
    resp = requests.post(
        f'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key={FIREBASE_API_KEY}',
        json={'returnSecureToken': True},
        timeout=10,
    )
    if resp.status_code == 200:
        _firebase_token = resp.json().get('idToken')
    return _firebase_token

def firestore_post(collection, payload):
    """POST to Firestore with anonymous auth. Returns True on success."""
    global _firebase_token
    token = get_firebase_token()
    if not token:
        return False
    url = (
        f'https://firestore.googleapis.com/v1/projects/{FIREBASE_PROJECT_ID}'
        f'/databases/(default)/documents/{collection}'
    )
    headers = {'Authorization': f'Bearer {token}'}
    resp = requests.post(url, json=payload, headers=headers, timeout=10)
    if resp.status_code == 401:
        # Token expired — refresh and retry once
        _firebase_token = None
        token = get_firebase_token()
        if not token:
            return False
        headers = {'Authorization': f'Bearer {token}'}
        resp = requests.post(url, json=payload, headers=headers, timeout=10)
    return resp.status_code == 200

def firestore_query(collection, field, value):
    """Query Firestore collection by field == value. Returns first match or None."""
    global _firebase_token
    token = get_firebase_token()
    if not token:
        return None
    url = (
        f'https://firestore.googleapis.com/v1/projects/{FIREBASE_PROJECT_ID}'
        f'/databases/(default)/documents:runQuery'
    )
    headers = {'Authorization': f'Bearer {token}'}
    payload = {
        'structuredQuery': {
            'from': [{'collectionId': collection}],
            'where': {
                'fieldFilter': {
                    'field': {'fieldPath': field},
                    'op': 'EQUAL',
                    'value': {'stringValue': str(value)},
                }
            },
            'limit': 1,
        }
    }
    try:
        resp = requests.post(url, json=payload, headers=headers, timeout=10)
        if resp.status_code == 401:
            _firebase_token = None
            token = get_firebase_token()
            headers = {'Authorization': f'Bearer {token}'}
            resp = requests.post(url, json=payload, headers=headers, timeout=10)
        if resp.status_code == 200:
            results = resp.json()
            if results and results[0].get('document'):
                return results[0]['document']['fields']
    except Exception:
        pass
    return None

# ── Telegram helpers ──────────────────────────────────────────────────────────

def send(chat_id, text):
    requests.post(
        f'https://api.telegram.org/bot{BOT_TOKEN}/sendMessage',
        json={'chat_id': chat_id, 'text': text, 'parse_mode': 'HTML'},
        timeout=10,
    )

# ── Firestore save helpers ────────────────────────────────────────────────────

def save_volunteer(profile):
    payload = {
        'fields': {
            'firstName':      {'stringValue': profile.get('firstName', '')},
            'lastName':       {'stringValue': profile.get('lastName', '')},
            'area':           {'stringValue': profile.get('area', '')},
            'telegramUserId': {'stringValue': str(profile.get('telegramId', ''))},
            'username':       {'stringValue': profile.get('username', '')},
            'registeredAt':   {'timestampValue': datetime.now(timezone.utc).isoformat()},
        }
    }
    return firestore_post('volunteers', payload)


def save_contact(data, profile):
    added_by = f"{profile.get('firstName', '')} {profile.get('lastName', '')}".strip()
    payload = {
        'fields': {
            'firstName':       {'stringValue': data.get('firstName', '')},
            'lastName':        {'stringValue': data.get('lastName', '')},
            'phone':           {'stringValue': data.get('phone', '')},
            'area':            {'stringValue': data.get('area', '')},
            'comment':         {'stringValue': data.get('comment', '')},
            'addedByUsername': {'stringValue': profile.get('username', '')},
            'addedByName':     {'stringValue': added_by},
            'telegramUserId':  {'stringValue': str(profile.get('telegramId', ''))},
            'timestamp':       {'timestampValue': datetime.now(timezone.utc).isoformat()},
        }
    }
    return firestore_post('voteContacts', payload)


def load_volunteer(chat_id):
    fields = firestore_query('volunteers', 'telegramUserId', chat_id)
    if fields:
        return {
            'firstName':  fields.get('firstName',  {}).get('stringValue', ''),
            'lastName':   fields.get('lastName',   {}).get('stringValue', ''),
            'area':       fields.get('area',        {}).get('stringValue', ''),
            'telegramId': chat_id,
            'username':   fields.get('username',    {}).get('stringValue', ''),
        }
    return None

# ── Smart YES/NO/EDIT detection ───────────────────────────────────────────────

YES_WORDS = {'ναι', 'yes', 'σωστα', 'σωστά', 'ok', 'οκ', 'εντάξει', 'εντaξει',
             'τελεια', 'τέλεια', 'καλα', 'καλά', 'σωστο', 'σωστό', 'done',
             'καταχωρησε', 'καταχώρησε', 'αποθηκευσε', 'αποθήκευσε', '✓', '👍'}

NO_WORDS  = {'οχι', 'όχι', 'no', 'λαθος', 'λάθος', 'αλλαγη', 'αλλαγή',
             'διορθωσε', 'διόρθωσε', 'αλλαξε', 'άλλαξε', 'διορθωση', 'διόρθωση'}

def is_yes(text):
    t = text.lower().strip()
    return t in YES_WORDS or any(w in t for w in YES_WORDS)

def is_no(text):
    t = text.lower().strip()
    return t in NO_WORDS or any(w in t for w in NO_WORDS)

# ── Confirmation message ──────────────────────────────────────────────────────

def send_confirmation(chat_id, data):
    comment_line = f'\n💬 <b>Σχόλιο:</b> {data["comment"]}' if data.get('comment') else ''
    send(chat_id,
         f'📋 <b>Έλεγχος στοιχείων:</b>\n\n'
         f'👤 <b>Όνομα:</b> {data.get("firstName", "")} {data.get("lastName", "")}\n'
         f'📞 <b>Τηλέφωνο:</b> {data.get("phone", "")}\n'
         f'📍 <b>Περιοχή:</b> {data.get("area", "")}'
         f'{comment_line}\n\n'
         f'Είναι σωστά; Γράψε <b>ναι</b> για αποθήκευση ή πες μου τι να διορθώσω.')

# ── Onboarding flow ───────────────────────────────────────────────────────────

def start_onboarding(chat_id):
    user_states[chat_id] = {'mode': 'onboarding', 'step': 0, 'data': {}}
    send(chat_id,
         'Γεια σου! 👋 Καλώς ήρθες στο σύστημα καταχώρησης επαφών.\n\n'
         'Πρώτα θέλω να σε γνωρίσω!\n\n'
         'Ποιο είναι το <b>όνομά</b> σου;')


def handle_onboarding(chat_id, text, user_info):
    state = user_states[chat_id]
    step  = state['step']
    data  = state['data']

    if step == 0:
        data['firstName'] = text
        state['step'] = 1
        send(chat_id, f'Χαίρομαι {data["firstName"]}! Και το <b>επίθετό</b> σου;')

    elif step == 1:
        data['lastName'] = text
        state['step'] = 2
        send(chat_id, 'Ωραία! Από ποια <b>περιοχή</b> είσαι;')

    elif step == 2:
        data['area']       = text
        data['telegramId'] = user_info.get('id', chat_id)
        data['username']   = user_info.get('username', '')

        user_profiles[chat_id] = data
        save_volunteer(data)

        send(chat_id,
             f'Τέλεια <b>{data["firstName"]} {data["lastName"]}</b> από {data["area"]}! 🎉\n\n'
             f'Το προφίλ σου αποθηκεύτηκε.\n\n'
             f'Μπορείς τώρα να ξεκινήσεις να καταχωρείς επαφές.\n'
             f'Πώς λέγεται η πρώτη σου επαφή; Γράψε το <b>όνομα</b>:')

        user_states[chat_id] = {'mode': 'contact', 'step': 0, 'data': {}}

# ── Contact registration flow ─────────────────────────────────────────────────

def start_contact(chat_id):
    user_states[chat_id] = {'mode': 'contact', 'step': 0, 'data': {}}
    profile = user_profiles.get(chat_id, {})
    send(chat_id,
         f'Εντάξει {profile.get("firstName", "")}! Νέα επαφή.\n\nΠώς λέγεται; Γράψε το <b>όνομα</b>:')


def handle_contact(chat_id, text, user_info):
    state = user_states[chat_id]
    step  = state['step']
    data  = state['data']

    if step == 0:
        data['firstName'] = text
        state['step'] = 1
        send(chat_id, f'Και το <b>επίθετο</b> του/της {data["firstName"]};')

    elif step == 1:
        data['lastName'] = text
        state['step'] = 2
        send(chat_id, f'Ποιο είναι το <b>τηλέφωνο</b> του/της {data["firstName"]} {data["lastName"]};')

    elif step == 2:
        data['phone'] = text
        state['step'] = 3
        send(chat_id, 'Από ποια <b>περιοχή</b> είναι;')

    elif step == 3:
        data['area'] = text
        state['step'] = 4
        send(chat_id,
             'Έχεις κάποιο <b>σχόλιο</b>;\n'
             '(Γράψε ό,τι θέλεις, ή <code>/skip</code> για παράλειψη)')

    elif step == 4:
        data['comment'] = '' if text.lower() in ('/skip', '-', '.') else text
        # Move to confirmation
        user_states[chat_id] = {'mode': 'confirm', 'data': data}
        send_confirmation(chat_id, data)

# ── Confirmation flow ─────────────────────────────────────────────────────────

def handle_confirm(chat_id, text, user_info):
    state   = user_states[chat_id]
    data    = state['data']
    profile = user_profiles.get(chat_id, {
        'firstName': '', 'lastName': '',
        'area': '', 'telegramId': user_info.get('id', 0),
        'username': user_info.get('username', ''),
    })

    if is_yes(text):
        success = save_contact(data, profile)
        if success:
            comment_line = f'\n💬 {data["comment"]}' if data.get('comment') else ''
            send(chat_id,
                 f'✅ <b>Καταχωρήθηκε!</b>\n\n'
                 f'👤 {data["firstName"]} {data["lastName"]}\n'
                 f'📞 {data["phone"]}\n'
                 f'📍 {data["area"]}'
                 f'{comment_line}\n\n'
                 f'Θες να προσθέσεις άλλη επαφή; Γράψε οποτεδήποτε!')
            user_states[chat_id] = {'mode': 'contact', 'step': 0, 'data': {}}
        else:
            send(chat_id, '⚠️ Υπήρξε πρόβλημα κατά την αποθήκευση. Δοκίμασε να στείλεις <b>ναι</b> ξανά.')

    elif is_no(text) or any(w in text.lower() for w in ['όνομα', 'ονομα', 'επίθετο', 'επιθετο', 'τηλέφωνο', 'τηλεφωνο', 'περιοχή', 'περιοχη', 'σχόλιο', 'σχολιο']):
        # Figure out what they want to change
        t = text.lower()
        if any(w in t for w in ['όνομα', 'ονομα', 'first']):
            user_states[chat_id] = {'mode': 'edit', 'field': 'firstName', 'data': data}
            send(chat_id, f'Ποιο είναι το σωστό <b>όνομα</b>;')
        elif any(w in t for w in ['επίθετο', 'επιθετο', 'last']):
            user_states[chat_id] = {'mode': 'edit', 'field': 'lastName', 'data': data}
            send(chat_id, 'Ποιο είναι το σωστό <b>επίθετο</b>;')
        elif any(w in t for w in ['τηλέφωνο', 'τηλεφωνο', 'phone', 'αριθμό', 'αριθμο']):
            user_states[chat_id] = {'mode': 'edit', 'field': 'phone', 'data': data}
            send(chat_id, 'Ποιο είναι το σωστό <b>τηλέφωνο</b>;')
        elif any(w in t for w in ['περιοχή', 'περιοχη', 'area']):
            user_states[chat_id] = {'mode': 'edit', 'field': 'area', 'data': data}
            send(chat_id, 'Ποια είναι η σωστή <b>περιοχή</b>;')
        elif any(w in t for w in ['σχόλιο', 'σχολιο', 'comment', 'σχόλια', 'σχολια']):
            user_states[chat_id] = {'mode': 'edit', 'field': 'comment', 'data': data}
            send(chat_id, 'Γράψε το νέο <b>σχόλιο</b> (ή <code>/skip</code> για διαγραφή):')
        else:
            # Generic "no" — ask what to fix
            send(chat_id,
                 'Τι θέλεις να διορθώσεις;\n'
                 'Γράψε π.χ. "άλλαξε το <b>τηλέφωνο</b>" ή "λάθος <b>περιοχή</b>" κτλ.')
    else:
        # Unrecognized — show confirmation again
        send_confirmation(chat_id, data)

# ── Edit a single field ───────────────────────────────────────────────────────

def handle_edit(chat_id, text, user_info):
    state = user_states[chat_id]
    field = state['field']
    data  = state['data']

    if field == 'comment':
        data[field] = '' if text.lower() in ('/skip', '-', '.') else text
    else:
        data[field] = text

    user_states[chat_id] = {'mode': 'confirm', 'data': data}
    send(chat_id, '👍 Ενημερώθηκε! Να ελέγξουμε ξανά:')
    send_confirmation(chat_id, data)

# ── Main message handler ──────────────────────────────────────────────────────

def handle_message(chat_id, text, user_info):
    text = text.strip()

    if text.lower() == '/new':
        if chat_id in user_profiles:
            start_contact(chat_id)
        else:
            start_onboarding(chat_id)
        return

    if text.lower() == '/start':
        if chat_id not in user_profiles:
            profile = load_volunteer(chat_id)
            if profile:
                user_profiles[chat_id] = profile

        if chat_id in user_profiles:
            profile = user_profiles[chat_id]
            send(chat_id,
                 f'Καλώς ήρθες πάλι <b>{profile["firstName"]}</b>! 👋\n\n'
                 f'Γράψε μου το <b>όνομα</b> της επαφής που θέλεις να καταχωρήσεις:')
            user_states[chat_id] = {'mode': 'contact', 'step': 0, 'data': {}}
        else:
            start_onboarding(chat_id)
        return

    if chat_id not in user_states:
        if chat_id not in user_profiles:
            profile = load_volunteer(chat_id)
            if profile:
                user_profiles[chat_id] = profile

        if chat_id in user_profiles:
            user_states[chat_id] = {'mode': 'contact', 'step': 0, 'data': {}}
            handle_contact(chat_id, text, user_info)
        else:
            start_onboarding(chat_id)
        return

    mode = user_states[chat_id].get('mode', 'contact')

    if mode == 'onboarding':
        handle_onboarding(chat_id, text, user_info)
    elif mode == 'contact':
        handle_contact(chat_id, text, user_info)
    elif mode == 'confirm':
        handle_confirm(chat_id, text, user_info)
    elif mode == 'edit':
        handle_edit(chat_id, text, user_info)

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
