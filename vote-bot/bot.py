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
# user_states:   { chat_id: { 'mode': 'onboarding'|'contact', 'step': int, 'data': {} } }
user_profiles = {}
user_states   = {}

# ── Telegram helpers ──────────────────────────────────────────────────────────

def send(chat_id, text):
    requests.post(
        f'https://api.telegram.org/bot{BOT_TOKEN}/sendMessage',
        json={'chat_id': chat_id, 'text': text, 'parse_mode': 'HTML'},
        timeout=10,
    )

# ── Firestore helpers ─────────────────────────────────────────────────────────

def save_volunteer(profile):
    """Save volunteer profile to Firebase volunteers collection."""
    url = (
        f'https://firestore.googleapis.com/v1/projects/{FIREBASE_PROJECT_ID}'
        f'/databases/(default)/documents/volunteers?key={FIREBASE_API_KEY}'
    )
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
    requests.post(url, json=payload, timeout=10)


def load_volunteer(chat_id):
    """Try to load volunteer profile from Firebase by telegramUserId."""
    url = (
        f'https://firestore.googleapis.com/v1/projects/{FIREBASE_PROJECT_ID}'
        f'/databases/(default)/documents:runQuery?key={FIREBASE_API_KEY}'
    )
    payload = {
        'structuredQuery': {
            'from': [{'collectionId': 'volunteers'}],
            'where': {
                'fieldFilter': {
                    'field': {'fieldPath': 'telegramUserId'},
                    'op': 'EQUAL',
                    'value': {'stringValue': str(chat_id)},
                }
            },
            'limit': 1,
        }
    }
    try:
        resp = requests.post(url, json=payload, timeout=10)
        if resp.status_code != 200:
            return None
        results = resp.json()
        if results and results[0].get('document'):
            fields = results[0]['document']['fields']
            return {
                'firstName':  fields.get('firstName',  {}).get('stringValue', ''),
                'lastName':   fields.get('lastName',   {}).get('stringValue', ''),
                'area':       fields.get('area',        {}).get('stringValue', ''),
                'telegramId': chat_id,
                'username':   fields.get('username',    {}).get('stringValue', ''),
            }
    except Exception:
        pass
    return None


def save_contact(data, profile):
    url = (
        f'https://firestore.googleapis.com/v1/projects/{FIREBASE_PROJECT_ID}'
        f'/databases/(default)/documents/voteContacts?key={FIREBASE_API_KEY}'
    )
    added_by = f"{profile.get('firstName', '')} {profile.get('lastName', '')}".strip()
    payload = {
        'fields': {
            'firstName':        {'stringValue': data.get('firstName', '')},
            'lastName':         {'stringValue': data.get('lastName', '')},
            'phone':            {'stringValue': data.get('phone', '')},
            'area':             {'stringValue': data.get('area', '')},
            'comment':          {'stringValue': data.get('comment', '')},
            'addedByUsername':  {'stringValue': profile.get('username', '')},
            'addedByName':      {'stringValue': added_by},
            'telegramUserId':   {'stringValue': str(profile.get('telegramId', ''))},
            'timestamp':        {'timestampValue': datetime.now(timezone.utc).isoformat()},
        }
    }
    resp = requests.post(url, json=payload, timeout=10)
    return resp.status_code == 200

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

    if step == 0:  # firstName
        data['firstName'] = text
        state['step'] = 1
        send(chat_id, f'Χαίρομαι {data["firstName"]}! Και το <b>επίθετό</b> σου;')

    elif step == 1:  # lastName
        data['lastName'] = text
        state['step'] = 2
        send(chat_id, 'Ωραία! Από ποια <b>περιοχή</b> είσαι;')

    elif step == 2:  # area
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
    state   = user_states[chat_id]
    step    = state['step']
    data    = state['data']
    profile = user_profiles.get(chat_id, {
        'firstName': '', 'lastName': '',
        'area': '', 'telegramId': user_info.get('id', 0),
        'username': user_info.get('username', ''),
    })

    if step == 0:  # firstName
        data['firstName'] = text
        state['step'] = 1
        send(chat_id, f'Και το <b>επίθετο</b> του/της {data["firstName"]};')

    elif step == 1:  # lastName
        data['lastName'] = text
        state['step'] = 2
        send(chat_id, f'Ποιο είναι το <b>τηλέφωνο</b> του/της {data["firstName"]} {data["lastName"]};')

    elif step == 2:  # phone
        data['phone'] = text
        state['step'] = 3
        send(chat_id, 'Από ποια <b>περιοχή</b> είναι;')

    elif step == 3:  # area
        data['area'] = text
        state['step'] = 4
        send(chat_id,
             'Έχεις κάποιο <b>σχόλιο</b> για αυτή την επαφή;\n'
             '(Γράψε ό,τι θέλεις, ή στείλε <code>/skip</code> για παράλειψη)')

    elif step == 4:  # comment
        data['comment'] = '' if text.lower() in ('/skip', '-', '.') else text
        success = save_contact(data, profile)

        if success:
            comment_line = f'\n💬 {data["comment"]}' if data['comment'] else ''
            send(chat_id,
                 f'✅ <b>Καταχωρήθηκε!</b>\n\n'
                 f'👤 {data["firstName"]} {data["lastName"]}\n'
                 f'📞 {data["phone"]}\n'
                 f'📍 {data["area"]}'
                 f'{comment_line}\n\n'
                 f'Θες να προσθέσεις άλλη επαφή; Γράψε οποτεδήποτε!')
            user_states[chat_id] = {'mode': 'contact', 'step': 0, 'data': {}}
        else:
            user_states[chat_id] = {'mode': 'contact', 'step': 4, 'data': data}
            send(chat_id,
                 '⚠️ Υπήρξε πρόβλημα κατά την αποθήκευση. Δοκίμασε ξανά '
                 'στέλνοντας το σχόλιο (ή <code>/skip</code>).')

# ── Main message handler ──────────────────────────────────────────────────────

def handle_message(chat_id, text, user_info):
    text = text.strip()

    # /new → νέα επαφή
    if text.lower() == '/new':
        if chat_id in user_profiles:
            start_contact(chat_id)
        else:
            start_onboarding(chat_id)
        return

    # /start → onboarding αν δεν υπάρχει προφίλ, αλλιώς καλωσόρισμα
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

    # Πρώτο μήνυμα χωρίς /start
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

    # Route
    mode = user_states[chat_id].get('mode', 'contact')
    if mode == 'onboarding':
        handle_onboarding(chat_id, text, user_info)
    else:
        handle_contact(chat_id, text, user_info)

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
