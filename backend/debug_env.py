
import os
from dotenv import load_dotenv

# mimic settings.py
load_dotenv()

sid = os.environ.get('TWILIO_ACCOUNT_SID')
token = os.environ.get('TWILIO_AUTH_TOKEN')
phone = os.environ.get('TWILIO_PHONE_NUMBER')

print(f"SID: {repr(sid)}")
print(f"Token: {repr(token)}")
print(f"Phone: {repr(phone)}")

is_default_sid = (sid == 'your_account_sid')
print(f"Is Default SID: {is_default_sid}")
