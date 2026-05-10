import os
import requests
from flask import Flask, request
from datetime import datetime, timezone

app = Flask(__name__)

BOT_TOKEN          = os.environ.get('BOT_TOKEN', '')
FIREBASE_PROJECT_ID = os.environ.get('FIREBASE_PROJECT_ID', 'dermlux-waitlist')
FIREBASE_API_KEY   = os.environ.get('FIREBASE_API_KEY', '')

# In-memory conversation state: { chat_id: { 'step': int, 'data': {} } }
# Steps: 0=firstName, 1=lastName, 2=phone, 3=area, 4=comment
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

# ── Conversation logic ────────────────────────────────────────────────────────

def handle_message(chat_id, text, user_info):
    text = text.strip()

    # /start or /new → reset and begin
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

    if step == 0:  # firstName
        if not text:
            send(chat_id, 'Παρακαλώ γράψε το <b>όνομα</b> της επαφής:')
            return
        data['firstName'] = text
        user_states[chat_id] = {'step': 1, 'data': data}
        send(chat_id, f'Ωραία! Και το <b>επίθετο</b> του/της {data["firstName"]};')

    elif step == 1:  # lastName
        if not text:
            send(chat_id, 'Παρακαλώ γράψε το <b>επίθετο</b>:')
            return
        data['lastName'] = text
        user_states[chat_id] = {'step': 2, 'data': data}
        send(chat_id, f'Τέλεια! Ποιο είναι το <b>τηλέφωνο</b> του/της {data["firstName"]} {data["lastName"]};')

    elif step == 2:  # phone
        if not text:
            send(chat_id, 'Παρακαλώ γράψε το <b>τηλέφωνο</b>:')
            return
        data['phone'] = text
        user_states[chat_id] = {'step': 3, 'data': data}
        send(chat_id, 'Από ποια <b>περιοχή</b> είναι;')

    elif step == 3:  # area
        if not text:
            send(chat_id, 'Παρακαλώ γράψε την <b>περιοχή</b>:')
            return
        data['area'] = text
        user_states[chat_id] = {'step': 4, 'data': data}
        send(chat_id,
             'Έχεις κάποιο <b>σχόλιο</b> για αυτή την επαφή;\n'
             '(Γράψε ό,τι θέλεις, ή στείλε <code>/skip</code> για να παραλείψεις)')

    elif step == 4:  # comment
        data['comment'] = '' if text.lower() in ('/skip', '-', '.') else text
        user_states[chat_id] = {'step': 0, 'data': {}}

        success = save_contact(data, user_info)

        if success:
            comment_line = f'\n💬 {data["comment"]}' if data['comment'] else ''
            send(chat_id,
                 f'✅ <b>Καταχωρήθηκε!</b>\n\n'
                 f'👤 {data["firstName"]} {data["lastName"]}\n'
                 f'📞 {data["phone"]}\n'
                 f'📍 {data["area"]}'
                 f'{comment_line}\n\n'
                 f'Ευχαριστώ πολύ! 🙏 Θες να προσθέσεις άλλη επαφή; Γράψε οποτεδήποτε!')
        else:
            # Keep data in case of retry
            user_states[chat_id] = {'step': 4, 'data': data}
            send(chat_id,
                 '⚠️ Υπήρξε πρόβλημα κατά την αποθήκευση. Παρακαλώ δοκίμασε ξανά '
                 'στέλνοντας ξανά το σχόλιο (ή <code>/skip</code>).')

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
